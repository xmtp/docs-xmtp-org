# Identity types with XMTP

XMTP's identity system is decentralized and cryptographically verifiable. Identities are not tied to usernames, emails, or centralized accounts. Instead, they are derived from blockchain-based accounts and authenticated using cryptographic signatures. This document explains how identities are formed, verified, and managed in XMTP.

## Account-based identity

Each XMTP user is identified by a blockchain account—most commonly an Ethereum address. The account signs a key package, which defines the user's identity for messaging. This signature is used to prove control of the address and to bind it to a specific public key.

- Wallets sign messages using EIP-191 or other standard signing methods.
- Smart contract wallets are supported by implementing a common interface for signing.
- A single account may be associated with multiple client installations.

## Inbox ID

The Inbox ID is a stable identifier for a user's messaging identity. It is derived from the public key material in their key package.

- Used as the destination for messages in DMs and groups.
- Remains stable while the key package is valid.
- Changes when the user rotates keys (e.g., after expiration or recovery).

## Installation ID

Each XMTP client installation (on a device or in a browser) is assigned a unique Installation ID.

- Identifies a specific instance of the XMTP client.
- Used for managing consent, message sync, and multi-device support.
- Available via `member.installationIds` in group contexts.

## Identity updates

Identities evolve over time. XMTP supports permanent, signed updates to allow for key rotation, metadata changes, and recovery.

- Signed by the user's account and verifiable by peers.
- Updates include new public key material and optional metadata.
- Stored permanently to ensure continuity of trust and identity verification.

## Consent and trust

Consent is enforced at the identity layer. Before messages can be exchanged, a recipient must opt in (explicitly or implicitly) to receiving messages.

- Consent is tracked at the installation level.
- Inbox curation is implemented by apps based on consent status.
- Developers can use `member.consentState` to determine permission to send.

## Summary

The XMTP identity model ensures that:

- Identities are controlled by users via their wallets.
- Each installation is uniquely identifiable.
- Key rotation and updates are supported.
- Trust relationships are verifiable and durable.

This model allows XMTP apps to offer strong privacy guarantees while supporting interoperability, recoverability, and multi-device usage.