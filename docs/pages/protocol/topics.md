# Topics with XMTP

This document describes the concept of **topics** on the XMTP network. Topics are used to address and route [envelopes](/protocol/envelope-types), forming the backbone of the XMTP pub/sub messaging system.

While XMTP SDKs manage topic subscriptions automatically, understanding them can be helpful for protocol-level development, debugging, and building services like push notification servers.

## Topic naming convention

XMTP topics follow a standardized format that indicates the protocol version, message type, and a unique identifier. The general structure is:

`/xmtp/mls/1/{topic-type}-{identifier}/proto`

- `/xmtp/mls/1/`: The protocol namespace, indicating XMTP with MLS, version 1.
- `{topic-type}`: A single letter representing the purpose of the topic (for example, `g` for group, `w` for welcome).
- `{identifier}`: A unique ID for the specific conversation or installation.
- `/proto`: The payload serialization format.

## Core topics in XMTP

XMTP uses two primary topic types for delivering messages.

### Group message topic

The group message topic is used to send and receive messages within a specific conversation (both 1:1 DMs and group chats). Each conversation has its own unique topic.

- **Format**: `/xmtp/mls/1/g-$conversationId/proto`
- **Envelope**: [Group message envelope](/protocol/envelope-types#group-message-envelope)
- **Purpose**: Carries all ongoing communication for a conversation, including [application messages](/protocol/envelope-types#application-messages) (text, reactions, etc.) and [commit messages](/protocol/envelope-types#commit-messages) that modify the group state.
- **Usage**: When an app wants to receive messages for a conversation, it subscribes to this topic. The `conversation.topic` property in the SDKs provides this value.

> **Note on [DM stitching](/inboxes/push-notifs/understand-push-notifs#understand-dm-stitching-and-push-notifications**): For direct messages, multiple underlying conversations might be "stitched" together in the UI. For push notifications to be reliable, an app must subscribe to the group message topic for each of these underlying conversations.

### Welcome message topic

The welcome message topic is used to deliver a `Welcome` message to a new member of a group. This message bootstraps the new member, providing them with the group's state so they can participate.

- **Format**: `/xmtp/mls/1/w-$installationId/proto`
- **Envelope**: [Welcome message envelope](/protocol/envelope-types#welcome-message-envelope)
- **Purpose**: To notify a specific app installation that it has been added to a new conversation.
- **Usage**: A push notification server subscribes to an installation's welcome topic to be notified when that installation is invited to a new group chat or DM. The SDKs provide this via methods like `client.welcomeTopic()`.

## How other envelopes are handled

Not all envelope types are broadcast on persistent pub/sub topics.

- **[Key package envelopes](/protocol/envelope-types#key-package-envelope)**: These are not sent over a topic. Instead, they are published to a network-level store where they can be retrieved by other clients who need to start a conversation or add a new member to a group.

- **[Identity update envelopes](/protocol/envelope-types#identity-update-envelope)**: These are also not sent over a topic. They are stored permanently on the XMTP network to ensure the continuity and verifiability of a user's identity across their devices.
