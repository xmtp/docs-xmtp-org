# Message types with XMTP

XMTP defines several message types, each serving a distinct role in establishing and maintaining secure and private communication. This document outlines these message types and their functions within the XMTP protocol.

Here are the key message types:

- Key package
- Welcome
- Commit
- Identity update
- Chat

Together, they enable:
- **Bootstrapping groups**: 
  - A participant publishes a **key package message**.
  - An existing group member references that package and sends a **welcome message** so the newcomer can decrypt group secrets.
- **Group evolution**: Any group membership or permission change triggers a **commit message** event so every client’s state machine can advance identically.
- **Key rotation**: A participant who changes keys sends an **identity update message**. Peers refresh that member’s identity before decrypting future traffic.
- **Chat**: Every text, image, reaction, and other content type is wrapped as a **chat message**.

## Key package message

A key package is a cryptographic credential bundle that provides public information about a user's installation. XMTP SDKs create and upload fresh key packages behind the scenes when an installation is initialized or rotated.

For practical purposes, think of a key package as a calling card for an installation that says: here’s how to encrypt to me, here’s how long this card is valid, and it’s signed so you can trust it. 

Specifically, a key package contains the following fields:
- Public key that others can use to encrypt welcome messages
- Signature key
- Capabilities (supported protocol version, cipher suites, lifetime, etc.)
- Credential for identity verification
- Content of the leaf node that should be added to represent this client

Group members cache key packages to authenticate future handshakes and welcome material. In this way, key packages enable asynchronous addition of clients to a group.

When an app inspects a group member, the SDK gives you a `PublicIdentity`, which internally holds the decoded fields. This enables an app to, for example, display an identity from the credential or determine whether the key package is expired based on the lifetime.

## Welcome message

A welcome message bootstraps a new member into an existing group. A welcome message is dependent on the newcomer's key package and provides the new member with the current state of the group after application of a commit message. 

Specifically, a welcome contains the following fields:
- Group context information
- Encrypted group secrets
- Tree structure for the group
- Confirmation tags for epoch verification

If decryption of a welcome message fails because of an outdated or missing key package, the SDK automatically fetches the latest package for that installation and retries.

## Commit message

A commit message can update a group's state, permissions, and membership. As such, a commit message also initiates a new epoch for the group, instructing group members to update their representation of the group's cryptographic state by applying proposals and advancing the key schedule. Commit messages record every state-transition even, enabling all members to converge on the same group state.

## Identity update message

An identity update message verifies and authenticates a user identity across the network. It is signed by the user's account and verifiable by peers.

Identities can evolve over time and identity update messages enable a group member to rotate their signature or HPKE keys (for example, when onboarding a new device) while preserving group continuity and authenticity.

They handle:
- Linking an installation to an XMTP inbox
- Key rotation and revocation
- Multi-device synchronization

Identity update messages are stored permanently to ensure continuity of trust and identity verification.

## Chat message

A chat message represents the day-to-day communication between users, including payloads like text, attachments, reactions, onchain transactions, etc.

They are:
- Encrypted using the group's shared secrets
- Authenticated with sender signatures
- Encoded using XMTP content types
- Sent on the `groupMessage` topic
