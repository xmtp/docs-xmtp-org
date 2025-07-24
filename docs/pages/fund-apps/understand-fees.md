# Understand fees to send messages with XMTP

Use this guide to understand the fees involved in sending messages with XMTP.

## Who pays messaging fees?

Apps and agents pay fees to send messages through XMTP.

To learn how to fund your app to pay fees, see [Fund your app to send messages with XMTP](/fund-apps/fund-your-app).

# What kinds of fees are there?

- **Messaging fees**: Charged for messages sent through the XMTP network.
- **Gas fees**: Charged for messages that require transactions on the XMTP appchain.

To learn more about fees, see [Fee types](/fund-apps/calculate-costs#fee-types).

## What counts as a message?

Everything an app or agent sends through the XMTP network counts toward its message volume:

- App messages (text, reactions, replies)
- Media attachments (charged by size, capped at 1MB)
- System messages (read receipts, typing indicators)
- Group management (member additions, permission changes)
- Identity updates and consent preferences

To learn more about the message types that clients can publish to XMTP, see [Envelope types](/protocol/envelope-types).

## What happens to collected messaging fees?

Collected messaging fees are paid directly to the node operators who run the globally distributed nodes that power the XMTP network.

To learn more about node operation, see [Run an XMTP network node](/network/run-a-node).

## What happens to collected gas fees?

Collected gas fees are paid directly to the XMTP appchain. Fees are used to maintain the appchain.
