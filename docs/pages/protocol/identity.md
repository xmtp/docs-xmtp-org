# Identity in XMTP

:::info[Key takeaways]

- **Why it matters:** Your messaging identity starts private by default, letting you maintain separate personas or unify them as you choose
- **How it works:** Each wallet gets its own standalone inbox, with the option to link them under one identity
- **Future-proof:** Identity moves to the XMTP appchain in 2025, providing trustless censorship resistance. To learn more, see [The future of identity](https://xmtp.org/roadmap#the-future-of-identity).

:::

## Private by default

Identity in XMTP is privacy-first, letting you reveal only what you choose, when you choose. Each wallet you activate starts with a private, standalone inbox that no one can link with your other inboxes, wallets, or onchain activity. At any time, you can associate your inbox with new wallets to make their activity part of your messaging identity and give them access to send and receive messages for you.

For example, you might start with a single anonymous wallet for a memecoin holder chat, connect a wallet with your ENS name when you're ready to be found, or add a vault wallet to showcase your NFT collection. Once linked, these wallets share a unified inbox and let you receive messages through any of their associated names or addresses -- all while giving cryptographic proof to senders that you are the owner.

## How identity works

:::tip[Technical specification]

For the complete technical specification of XMTP's identity system, see [XIP-46: Multi-Wallet Identity](https://github.com/xmtp/XIPs/blob/main/XIPs/xip-46-multi-wallet-identity.md). This XIP defines the protocol-level implementation of Inbox IDs, identity actions, permission hierarchies, and migration from XMTP v2.

:::

XMTP identity operates at the wallet address level, using cryptographic signatures to manage associations between wallets. These associations are controlled through XMTP `IdentityAction` operations:

```rust
message IdentityAction {
  oneof kind {
    CreateInbox create_inbox = 1;                       // Create a new identity
    AddAssociation add = 2;                             // Associate a new wallet
    RevokeAssociation revoke = 3;                       // Remove a wallet association
    ChangeRecoveryAddress change_recovery_address = 4;  // Change the recovery address
  }
}
```

Identity operations create public records that prove you own the associated wallets. The wallet first used to create the association becomes the recovery wallet. Any linked wallet can add new associations, but only this recovery wallet can remove them or designate a new recovery wallet.

While XMTP works purely with wallet addresses, applications handle the connection to human-readable identities, resolving addresses to ENS names, Lens handles, or other web3 usernames to create user-friendly experiences. Messages sent to any of these identifiers are automatically routed to the unified inbox of their associated wallet.

### Privacy considerations for onchain identity

The default separation between wallets provides strong privacy guarantees. Users who choose to link wallets should be aware that these associations become visible onchain. For maximum privacy, users should maintain separate XMTP inboxes for sensitive communications. Apps built for these users can merge their inboxes locally. Research into privacy-preserving unlinkable associations is ongoing.

## Composability

XMTP identity associations enable developers to build new experiences around messaging. Here are the two main patterns:

### Inbox discovery

Looking up a user’s XMTP inbox using any of their wallet addresses or ENS names.

- NFT marketplace notifications for bids
- DAO governance communications
- Group chat creation based on contract interactions

### Address discovery

Retrieving all wallet addresses and names associated with an XMTP inbox.

- Web3 contact cards with ENS, Base, Farcaster, and Lens names
- Blockchain name display for conversation partners
- Cross-address identity verification

## FAQ

### What differentiates XMTP’s approach to identity? What are its benefits?

Unlike traditional systems that bind user identity to a proprietary namespace, XMTP’s identity model leverages existing namespaces while prioritizing privacy. Users can choose which wallets to link, maintaining privacy by default, and consolidate their chosen names into a single messaging inbox.

Benefits for users:

- Private identity by default
- Receive all your messages without switching apps
- Communicate using any name you own

Benefits for apps and services:

- No need to build and maintain your own messaging system
- No need to integrate a new namespace
- If you have a namespace, XMTP makes it more valuable by extending its reach to more apps
- Users can communicate using all their names without switching to other apps
- Users can access existing agents and mini-apps developed by the XMTP community

### How secure is this system? What happens if one of my linked wallets gets compromised?

XMTP requires cryptographic signatures for every identity operation and maintains strict validation rules. The system protects against replay attacks by tracking all previously seen signatures, and each action must be properly authorized according to the key hierarchy. If a wallet linked to an identity is compromised, the recovery wallet can unlink it to protect the inbox. By default, the recovery wallet is the first wallet that created the identity.

### How do I recover my identity? What if I lose access to my recovery wallet?

The first wallet associated with an identity becomes the recovery wallet. This recovery wallet is the only one that can remove other wallet associations. It can also change the recovery address to a different wallet address. If access to the recovery wallet is lost, you can continue using your inbox with other linked wallets, but you won’t be able to revoke other wallet associations in case of compromise.

As a last resort, you can create a new inbox and associate your wallet addresses to it. This ensures continued messaging access, though previous messages tied to the original inbox will remain inaccessible.

### Can smart wallets or other smart contracts have XMTP identities?

Any EIP-4337 smart wallet can create or link to an XMTP identity and send or receive messages. Other smart contracts can also do this if they support EIP-1271.

### What is the maximum number of wallets that can be linked to an identity?

The XMTP identity system has a maximum limit of 256 wallets that can be linked to a single identity. Revocations and recovery address changes count toward this limit.

### How does wallet linking work across chains?

Currently, XMTP supports only EVM chains. Messages sent to any address are delivered to its associated inbox, regardless of the network used by the app. 

To learn about future plans to extend support to wallets on non-EVM ecosystems, see [The future of identity](https://xmtp.org/roadmap#the-future-of-identity).

### Are there any rate limits for identity operations?

Yes, Ephemera’s centralized service has rate limits in place to ensure system stability under heavy usage. 

To learn about future plans for rate limiting identity operations, see [The future of identity](https://xmtp.org/roadmap#the-future-of-identity).

### What costs are associated with identity operations?

Currently, wallet linking and unlinking operations are free. 

To learn about future plans around identity operation costs, see [The future of identity](https://xmtp.org/roadmap#the-future-of-identity).

### How public is my identity association history?

Identity association history is currently public and viewable through the XMTP SDKs. 

To learn about future plans around putting identity association history onchain, see [The future of identity](https://xmtp.org/roadmap#the-future-of-identity).