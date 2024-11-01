## Build the inbox

:::warning[🚧 XMTP V3 Alpha]

The XMTP V3 SDKs are in **alpha** status and ready for you to start experimenting with.
However, we do **not** recommend using alpha software in production apps. Software in this status will change as we add features and iterate based on feedback.


XMTP V3 includes breaking changes from V2, most of which will be mitigated by the SDKs. Guidance about the migration path from V2 to V3 will be delivered in forthcoming XMTP V3 release notes.

Join the [XMTP Devs 💪 group chat](https://converse.xyz/group-invite/e-KZyw77m-7sjUmEk5lgu) in Converse to keep up with the latest updates.

:::

### Check if an address is reachable on V3

The first step to creating a conversation is to verify that participants’ addresses are reachable on XMTP V3. The `canGroupMessage` method checks each address’ compatibility with V3, returning a response indicating whether each address can receive V3 messages. 

Once you have the verified V3 addresses, you can create a new conversation, whether it is a group chat or direct message (DM).

```tsx [React Native]
// Request
const canMessageV3 = await alix.canGroupMessage([
  '0xcaroAddress',
  '0xboAddress',
  '0xV2OnlyAddress',
  '0xBadAddress',
])

// Response
{
  "0xcaroAddress": true,
  "0xboAddress": true,
  "0xV2OnlyAddress": false,
  "0xBadAddress": false,
}
```

:::tip

Regarding how to handle addresses that aren’t reachable on V3, the migration documentation in the XMTP V3 release notes will outline the next steps for addressing compatibility issues, ensuring smooth onboarding to V3 for all participants.
:::

### Create a new group chat

Once you have the verified V3 addresses, create a new group chat:

```tsx [React Native]
// New Group
const group = await alix.conversations.newGroup([bo.address, caro.address])

// New Group with Metadata
const group = await alix.conversations.newGroup([bo.address, caro.address], {
      name: 'The Group Name',
      imageUrlSquare: 'www.groupImage.com',
      description: 'The description of the group',
      permissionLevel: 'admin_only' // 'all_members' | 'admin_only'
    })
```

### Create a new DM

Once you have the verified V3 addresses, create a new DM:

```tsx [React Native]
const dm = await alix.conversations.findOrCreateDm(bo.address)
```

*Replaces V2 functionality `client.conversations.newConversation(address)`*

### List new group chats or DMs

Get any new group chats or DMs from the network:

```tsx [React Native]
await alix.conversations.syncConversations()
```

*Does not refetch existing conversations*

### List new messages

Get new messages from the network for all existing group chats and DMs in the local database:

```tsx [React Native]
await alix.conversations.syncAllConversations()
```

*Does not refetch existing messages or messages for inactive group chat conversations*

### List existing group chats or DMs

Get a list of existing group chats or DMs in the local database, ordered either by `createdAt` date or `lastMessage`.

```tsx [React Native]
// List ConversationContainer items by createdAt date
await alix.conversations.listConversations()

// List ConversationContainer items by lastMessage but only return specified fields
await alix.conversations.listConversations({
      members: false,
      consentState: false,
      description: false,
      creatorInboxId: false,
      addedByInboxId: false,
      isActive: false,
      lastMessage: true,
    }, 
    'lastMessage') // 'createdAt' | 'lastMessage'
```

*Replaces V2 functionality `client.conversations.list()`*

### Stream all group chats and DMs

Listens to the network for new group chats and DMs. Whenever a new conversation starts, it triggers the provided callback function with a [`ConversationContainer` object](#conversationcontainer-interface). This allows the client to immediately respond to any new group chats or DMs initiated by other users.

```tsx [React Native]
  await alix.conversations.streamConversations(
    async (conversation: ConversationContainer<any>) => {
	    // Received a conversation
    }
  )
```

*Replaces V2 `client.conversations.stream()`*

### Stream all group chat and DM messages

Listens to the network for new messages within all active group chats and DMs. Whenever a new message is sent to any of these conversations, the callback is triggered with a `DecodedMessage` object. This keeps the inbox up to date by streaming in messages as they arrive.

```tsx [React Native]
  await alix.conversations.streamAllConversationMessages(
    async (message: DecodedMessage<any>) => {
      // Received a message
    }
  )
```

*Replaces V2 `client.conversations.streamAllMessages()`*

### Conversation helper methods

Use these helper methods to quickly locate and access specific conversations—whether by ID, topic, group ID, or DM address—returning the appropriate ConversationContainer, group, or DM object.

```tsx [React Native]
// Returns a ConversationContainer
await alix.conversations.findConversation(conversation.id)
await alix.conversations.findConversationByTopic(conversation.topic)
// Returns a Group
await alix.conversations.findGroup(group.id)
// Returns a DM
await alix.conversations.findDm(bo.address)
```

### ConversationContainer interface

Serves as a unified structure for managing both group chats and DMs. It provides a consistent set of properties and methods to seamlessly handle various conversation types.

https://github.com/xmtp/xmtp-react-native/blob/main/src/lib/ConversationContainer.ts

### Group class

Represents a group chat conversation, providing methods to manage group-specific functionalities such as sending messages, synchronizing state, and handling group membership.

https://github.com/xmtp/xmtp-react-native/blob/main/src/lib/Group.ts

### Dm class

Represents a DM conversation, providing methods to manage one-on-one communications, such as sending messages, synchronizing state, and handling message streams.

https://github.com/xmtp/xmtp-react-native/blob/main/src/lib/Dm.ts
