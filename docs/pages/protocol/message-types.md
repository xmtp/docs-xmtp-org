# Message types with XMTP

XMTP defines several message types, each serving a distinct role in establishing and maintaining secure and private communication. This document outlines these message types and their functions within the XMTP protocol.

## Key packages

Key packages are cryptographic credentials that underpin group and user security
- **Description**: Key packages are pre-published objects that provide public information about a user, enabling asynchronous addition of clients to a group. They contain:
  - Public keys for encryption
  - Signature keys
  - Capabilities (supported protocols, cipher suites, etc.)
  - Credentials for identity verification

| **Key package** | Cryptographic credential bundle that other members cache to authenticate future handshakes and welcome material. | FFI bindings surfaced as `KeyPackageResult`; ultimately generated in Rust and passed into Kotlin via JNI. | `KeyPackage` (§ 7.3) |

Includes:

1. protocol version & cipher suite
2. public key others can use to encrypt 
welcome message
3. Content of the leaf node that should
be added to represent this client

You never craft or transmit a Key Package manually; the SDK creates and uploads fresh ones behind the scenes when you initialise or rotate an installation.
	•	When you inspect another member, the SDK gives you a PublicIdentity which internally holds the decoded fields above—so your UI can, for example, show their wallet address (from the credential) or determine whether their package is expired (from the lifetime).
	•	If decryption of a Welcome fails because of an outdated or missing Key Package, the SDK automatically fetches the latest package for that installation and retries.

So, for practical purposes, think of a Key Package as “the visiting card” every XMTP installation publishes: here’s how to encrypt to me, here’s who I am, here’s how long this card is valid, and it’s all signed so you can trust it.

## Welcome messages
- **Purpose**: Bootstrap new members into existing groups
- **Description**: Welcome messages are dependent on the associated key packages and provide new members with the current state of the group after application of a Commit message. They contain:
  - Group context information
  - Encrypted group secrets
  - Tree structure for the group
  - Confirmation tags for epoch verification

| **Welcome** | Delivers the encrypted group secrets that let a newcomer join; references the newcomer’s Key Package. | Consumed by `Conversations.fromWelcome(…)`; published on the `userWelcome` topic. | `Welcome` (§ 7.4) |


## Chat messages (app messages)
- **Purpose**: Core communication between users
- **Description**: Chat messages represent the core communication between users. They are:
  - Encrypted using the group's shared secrets
  - Authenticated with sender signatures
  - Encoded using XMTP's content type framework (supporting text, images, files, etc.)
  - Sent as either PublicMessage or PrivateMessage frames

| **Chat message** | Day-to-day user payload—text, attachments, reactions, etc. | Encoded by `TextCodec` (`ContentTypeText`) and sent on the `groupMessage` topic. | Application Data inside an MLS `PrivateMessage` (§ 7.5) |


## Commit messages
- **Purpose**: Update group state and membership
- **Description**: Commit messages initiate a new epoch for the group, instructing group members to update their representation of the state by applying proposals and advancing the key schedule. They:
  - Apply proposal changes (adds, removes, updates)
  - Distribute fresh entropy to the group
  - Update the group's cryptographic state
  - May include UpdatePath for key refresh

| **Chat-metadata / Commit** | Records every state-transition event so all replicas converge: adds, removes, permission changes, branching, etc. | Encoded/decoded by `GroupUpdatedCodec` (`ContentTypeGroupUpdated`). | `Commit` plus its Proposal list (§ 9) |


## Identity update messages
- **Purpose**: Verify and authenticate user identities across the network
- **Description**: Identity update messages play a critical role in verifying and authenticating user identities across the network. They handle:
  - Linking installations to XMTP inboxes
  - Key rotation and revocation
  - Multi-device synchronization

| **Identity-update** | Lets a member rotate signature or HPKE keys (e.g., new device) while preserving group continuity and authenticity. | Appears as a specific “identity-update” reason within the same `GroupUpdated` envelope; SDK exposes it via `PublicIdentity`. | `Update` Proposal (§ 9.1) |



### How the pieces fit together

1. **Bootstrapping** – A participant publishes a **Key package**. An existing member references that package and sends a **Welcome** so the newcomer can decrypt group secrets.  
2. **Normal chat** – Every text/image/etc. is wrapped as a **Chat message** (`TextCodec`) and posted on `groupMessage`.  
3. **Group evolution** – Any membership or policy change triggers a **Chat-metadata / Commit** event (`GroupUpdated`) so every client’s state machine advances identically.  
4. **Key rotation** – A member who changes keys sends an **Identity-update** (specialized `GroupUpdated` record). Peers refresh that member’s `PublicIdentity` before decrypting future traffic.
