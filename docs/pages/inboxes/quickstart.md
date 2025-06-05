# Quickstart: Build an app with XMTP

This quickstart provides a map to building a complete messaging app with XMTP including support for:

- End-to-end encrypted direct message and group chat conversations
- Rich content types (attachments, reactions, replies, and more)
- Real-time push notifications
- Spam-free inboxes using user consent preferences

:::tip

Want to build an agent that works in messaging apps built with XMTP? Explore the examples and docs in [xmtp-agent-examples](https://github.com/ephemeraHQ/xmtp-agent-examples).

:::

## 🏗️ Phase I: Setup

1. Select the XMTP SDK that matches your platform.

   - Mobile development
     - [React Native SDK](https://github.com/xmtp/xmtp-react-native)
     - [Kotlin SDK](https://github.com/xmtp/xmtp-android)
     - [Swift SDK](https://github.com/xmtp/xmtp-ios)

   - Web development
     - [Browser SDK](https://github.com/xmtp/xmtp-js/tree/main/sdks/browser-sdk) (for web apps)
     - [Node SDK](https://github.com/xmtp/xmtp-js/tree/main/sdks/node-sdk) (for servers)

   Need an SDK for a different platform? Let us know in [Ideas & Improvements](https://community.xmtp.org/c/general/ideas/54) in the XMTP Community Forums.

2. [Run a local XMTP node](https://github.com/xmtp/xmtp-local-node/tree/main) for development and testing.
   
## 💬 Phase II: Build core messaging

1. [Create an EAO or SCW signer](/inboxes/create-a-signer#create-a-eoa-or-scw-signer)

2. [Create an XMTP client](/inboxes/create-a-client)

3. [Check if an identity is reachable on XMTP](/inboxes/create-conversations#check-if-an-identity-is-reachable)

4. Create a [group chat](/inboxes/create-conversations#create-a-new-group-chat) or [direct message](/inboxes/create-conversations#create-a-new-dm) (DM) conversation.  
   With XMTP, "conversation" refers to both group chat and DM conversations.

5. [Send messages](/inboxes/send-messages) in a conversation.

6. Manage group chat [permissions](/inboxes/group-permissions) and [metadata](/inboxes/group-metadata).

## 🔁 Phase III: Keep conversations and messages up to date

1. [List existing conversations](/inboxes/list-and-stream#list-existing-conversations) from local storage.

2. [Stream new conversations](/inboxes/list-and-stream#stream-all-group-chats-and-dms) from the network.

3. [Stream new messages](/inboxes/list-and-stream#stream-all-group-chat-and-dm-messages-and-preferences) from the network.

4. [Sync new conversations](/inboxes/sync-and-syncall#sync-new-conversations) from the network.

5. [Sync a specific conversation's messages and preference updates](/inboxes/sync-and-syncall#sync-a-specific-conversation) from the network.

## 💅🏽 Phase IV: Enhance the user experience

1. [Implement user consent](/inboxes/user-consent/support-user-consent), which provides a consent value of either **unknown**, **allowed** or **denied** to each of a user's contacts.  
   You can use these consent values to appropriately filter user conversations. For example, conversations with **unknown** contacts can go to a possible spam tab and only conversations with **allowed** contacts can go to a user's main inbox.
  
2. Support rich [content types](/inboxes/content-types/content-types)
   - [Attachments](/inboxes/content-types/attachments)
     - Single remote attachment
     - Multiple remote attachments
     - Attachments smaller than 1MB
   - [Reactions](/inboxes/content-types/reactions)
   - [Replies](/inboxes/content-types/replies)
   - [Read receipts](/inboxes/content-types/read-receipts)
   - [Onchain transaction references](/inboxes/content-types/transaction-refs)

3. [Implement push notifications](/inboxes/push-notifs/understand-push-notifs)

## 🧪 Phase V: Test and debug

- [Stress and burn-in test](/inboxes/debug-your-app#xmtp-debug) your inbox app

- [Enable file logging](/inboxes/debug-your-app#file-logging)

- [Capture network statistics](/inboxes/debug-your-app#network-statistics)

- Found a bug or need support? Please file an issue in the relevant SDK repo:
  - [React Native SDK](https://github.com/xmtp/xmtp-react-native)
  - [Kotlin SDK](https://github.com/xmtp/xmtp-android)
  - [Swift SDK](https://github.com/xmtp/xmtp-ios)
  - [Browser SDK](https://github.com/xmtp/xmtp-js/tree/main/sdks/browser-sdk)
  - [Node SDK](https://github.com/xmtp/xmtp-js/tree/main/sdks/node-sdk)
