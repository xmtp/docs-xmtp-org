# Extend the XMTP identity model

XMTP is designed with a flexible identity model that can be extended over time without introducing breaking changes for existing apps.

This document provides a general blueprint for how to extend XMTP to non-EVM platforms where identities are controlled by public keys, such as Solana, Bitcoin, Zcash, and others.

### Why is extension needed for non-EVM chains?

XMTP is designed to support EVM chains by default. EVMs all share the same address format and signature scheme.

- **EOAs on EVM chain**: Work automatically. Signature verification is purely cryptographic (secp256k1 ECDSA), so no configuration is needed.
- **SCWs on EVM chains**: Require adding the chain's RPC endpoint to the verifier config. See [Create a SCW signer](/chat-apps/core-messaging/create-a-signer#create-a-smart-contract-wallet-signer).
- **Non-EVM chains**: Require implementing new identity types and signature verification, as described in this document.

For example, see the different address formats, signature schemes, signature standards,and verification methods required by these chains:

  | Aspect | Ethereum (EVM) | Solana | Bitcoin |
  | --- | --- | --- | --- |
  | **Address format** | Hex (`0x...`) | Base58 (`7EcD...LtV`) | Bech32 (`bc1...`) |
  | **Signature scheme** | secp256k1 ECDSA | Ed25519 | secp256k1 ECDSA |
  | **Signature standard** | EIP-191 / ERC-1271 | Solana-specific | BIP-137 or similar |
  | **Verification** | Recover address from signature | Verify against public key | Varies by wallet |

## XMTP inboxes and identity updates

An XMTP inbox groups together many identities into a single address (XMTP inbox ID) that can be reached on the network. Those identities might be wallets, passkeys, app installations, or any other identifier. This identity model is what allows you to sign in to multiple XMTP apps across different devices and platforms and see the same conversations and messages. XMTP enables portability at its core.

Each XMTP inbox is constructed through a series of identity updates. Identity updates are special messages on the network that can add or remove identities from a given inbox. Anyone who wants to know "who is in this group chat with me?" or "how do I reach vitalik.eth?" will download all the *identity updates* for a given inbox, verify that each update has been correctly signed, and construct the state of that inbox by applying each valid update in order.

Identity updates are signed by an existing member of the inbox and any new members that are being added.

To learn more, see [Identity with XMTP](https://xmtp.org/identity).

### Identity types

To add XMTP support for an eligible platform, you must create a new identity type in the protocol so clients can construct identity updates signed by the platform's accounts.

Every identity type has two important jobs:

1. It needs to provide a unique public identifier (an address or public key) others can use to reach the inbox
2. It needs to provide a way to prove ownership of that identifier

## Add a new identity type to XMTP

To add a new identity type to XMTP:

1. Define the identifier format for the new identity type
2. Implement a signature verifier to prove ownership of those identities
3. Update wire formats to store the new identifiers and signatures

### Define the identifier kind

Every account on your target platform has a unique identifier (an address or public key). You need to define how this identifier will be represented in XMTP.

You'll need to:

1. Define the new identifier kind in the [Rust identity module](https://github.com/xmtp/libxmtp/blob/main/xmtp_id/src/associations/ident.rs) in the libxmtp repo.
2. Add a new variant to the `MemberIdentifier` protobuf message
3. Add a new entry to the `IdentifierKind` enum

   ```proto
   // The identifier for a member of an XID
   message MemberIdentifier {
     oneof kind {
       string ethereum_address = 1;
       bytes installation_public_key = 2;
       Passkey passkey = 3;
       // Add your new identifier type here
     }
   }

   // List of identity kinds
   enum IdentifierKind {
     IDENTIFIER_KIND_UNSPECIFIED = 0;
     IDENTIFIER_KIND_ETHEREUM = 1;
     IDENTIFIER_KIND_PASSKEY = 2;
     // Add your new identifier kind here
   }
   ```

### Implement signature verification

To link an XMTP identity with an account on your target platform, you need to implement a signature verifier.

Use the existing verifiers in [verified_signature.rs](https://github.com/xmtp/libxmtp/blob/main/xmtp_id/src/associations/verified_signature.rs) as a reference.

Your implementation should:

1. Create a new signature type and corresponding [protobuf message types](https://github.com/xmtp/proto/blob/main/proto/identity/associations/signature.proto) in the XMTP proto repo so it can be used in identity updates

2. Collect proof that the owner of the identifier has approved the challenge

The SDK handles:

- Creating a challenge (text summarizing the identity update)
- Including the signature in an identity update so others can verify the association

### Roll out the new identifier type

New identifier types are safe to roll out as non-breaking changes. Clients with a newer SDK version that supports the new identity type will be able to resolve addresses to inboxes and see which addresses are associated with a given inbox. Older clients will discard identity updates referencing the new identity type until they upgrade to a version that can process them.

## Permissions and rules

New identity types are designed to live inside an inbox created with a passkey or an Ethereum wallet. When combined with a passkey, new identity types have full capabilities and can do everything the protocol supports.

Two-way associations are possible: A member of a conversation can see which addresses are associated with a given inbox, and any user of the network can see which inbox is associated with an address.

| **Action** | **Passkey** | **Ethereum Wallet** | **New identity type** | **Passkey + New identity type** |
| --- | --- | --- | --- | --- |
| **Associate identifier with an inbox** | ❌ | ✅ | ✅ | ✅ |
| **Resolve address to inbox ID** | ❌ | ✅ | ✅ | ✅ |
| **Create a new inbox** | ✅ | ✅ | ❌ | ✅ |
| **Add new installations to an inbox** | ✅ | ✅ | ❌ | ✅ |
| **Add new identifiers to an inbox** | ✅ | ✅ | ❌ | ✅ |
| **Act as recovery address** | ✅ | ✅ | ❌ | ✅ |