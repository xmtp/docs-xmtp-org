# Understand fees to send messages with XMTP

Use this guide to understand the fees involved in sending messages with XMTP.

## Why fees are necessary

To support a decentralized and sustainable network, XMTP operates on a usage-based fee model. The fees you pay directly compensate the independent node operators who run the infrastructure, ensuring the network remains resilient, secure, and censorship-resistant.

XMTP's architecture consists of two layers:

1.  **The XMTP Network (Offchain):** A globally distributed network of nodes responsible for securely routing and delivering encrypted messages between users. Messaging fees support the operators of these nodes.
2.  **The XMTP Appchain (Onchain):** A specialized blockchain that stores critical metadata, such as user identities, contacts, and group permissions. This onchain layer is essential for decentralized identity and ensuring that only the appropriate users can access conversations. Gas fees are used to pay for transactions on the Appchain.

This two-layer system allows XMTP to provide scalable, decentralized messaging.

## Who pays messaging fees?

Apps and agents pay fees to send messages through XMTP.

To learn how to fund your app to pay fees, see [Fund your app to send messages with XMTP](/fund-apps/fund-your-app).

## What kinds of fees are there?

- **Messaging fees**: Charged for messages sent through the XMTP Network.
- **Gas fees**: Charged for messages that require transactions on the XMTP Appchain.

To learn more about fees, see [Fee types](/fund-apps/calculate-fess#fee-types).

## What counts as a message?

Everything an app or agent sends through the XMTP Network counts toward its message volume:

- App messages (text, reactions, replies)
- Media attachments (charged by size, capped at 1 MB)
- System messages (read receipts, typing indicators)
- Group management (member additions, permission changes)
- Identity updates and consent preferences

To learn more about the message types that clients can publish to XMTP, see [Envelope types](/protocol/envelope-types).

## What happens to collected messaging fees?

Collected messaging fees are paid directly to the node operators who run the globally distributed nodes that power the XMTP Network.

To learn more about node operation, see [Run an XMTP Network node](/network/run-a-node).

## What happens to collected gas fees?

Collected gas fees are paid directly to the XMTP Appchain. Fees are used to maintain the Appchain.
