# Create conversations

## Check if an identity is reachable

The first step to creating a conversation is to verify that participants’ identities are reachable on XMTP. The `canMessage` method checks each identity's compatibility, returning a response indicating whether each identity can receive messages.

Once you have the verified identities, you can create a new conversation, whether it's a group chat or direct message (DM).

:::code-group

```js [Browser]
import { Client } from "@xmtp/browser-sdk";

// response is a Map of string (identity) => boolean (is reachable)
const response = await Client.canMessage([bo.identity, caro.identity]);
```

```js [Node]
import { Client } from "@xmtp/node-sdk";

// response is a Map of string (identity) => boolean (is reachable)
const response = await Client.canMessage([bo.identity, caro.identity]);
```

```tsx [React Native]
// Request
const canMessage = await client.canMessage([
  boIdentity,
  v2OnlyIdentity,
  badIdentity,
])

// Response
{
  "0xboAddress": true,
  "0xV2OnlyAddress": false,
  "0xBadAddress": false,
}
```

```kotlin [Kotlin]
// Request
val boIdentity = Identity(ETHEREUM, '0xboAddress')
val v2Identity = Identity(ETHEREUM, '0xV2OnlyAddress')
val badIdentity = Identity(ETHEREUM, '0xBadAddress')

val canMessage = client.canMessage(listOf(boIdentity, v2Identity, badIdentity))

// Response
[
  "0xboAddress": true,
  "0xV2OnlyAddress": false,
  "0xBadAddress": false,
]
```

```swift [Swift]
// Request
let canMessage = try await client.canMessage([boIdentity, v2OnlyIdentity, badIdentity])

// Response
[
  "0xboAddress": true,
  "0xV2OnlyAddress": false,
  "0xBadAddress": false,
]
```

:::

## Create a new group chat

Once you have the verified identities, create a new group chat.

:::tip
If you want to provide faster and offline group creation, consider using [optimistic group chat creation](#optimistically-create-a-group-chat) instead. This approach enables instant group creation and message preparation before adding members and even when offline.
:::

:::code-group

```js [Browser]
const group = await client.conversations.newGroup(
  [bo.inboxId, caro.inboxId],
  createGroupOptions /* optional */
);
```

```js [Node]
const group = await client.conversations.newGroup(
  [bo.inboxId, caro.inboxId],
  createGroupOptions /* optional */
);
```

```tsx [React Native]
// New Group
const group = await alix.conversations.newGroup([bo.inboxId, caro.inboxId]);

// New Group with Metadata
const group = await alix.conversations.newGroup([bo.inboxId, caro.inboxId], {
  name: "The Group Name",
  imageUrl: "www.groupImage.com",
  description: "The description of the group",
  permissionLevel: "admin_only", // 'all_members' | 'admin_only'
});
```

```kotlin [Kotlin]
// New Group
val group = alix.conversations.newGroup(listOf(bo.inboxId, caro.inboxId))

// New Group with Metadata
val group = alix.conversations.newGroup(listOf(bo.inboxId, caro.inboxId),
  permissionLevel = GroupPermissionPreconfiguration.ALL_MEMBERS, // ALL_MEMBERS | ADMIN_ONLY
  name = "The Group Name",
  imageUrl = "www.groupImage.com",
  description = "The description of the group",
)
```

```swift [Swift]
// New Group
let group = try await alix.conversations.newGroup([bo.inboxId, caro.inboxId])

// New Group with Metadata
let group = try await alix.conversations.newGroup([bo.inboxId, caro.inboxId],
  permissionLevel: .admin_only, // .all_members | .admin_only
  name: "The Group Name",
  imageUrl: "www.groupImage.com",
  description: "The description of the group",
)
```

:::

## Optimistically create a new group chat

Optimistic group creation enables instant group chat creation and message preparation, even when offline or before adding members. This approach prioritizes user experience by allowing immediate interaction with the group chat, while handling the network synchronization in the background when members are added.

Use this method to optimistically create a group chat, which enables a user to create a group chat now and add members later.

The group chat can be created with any number of [standard options](/inboxes/group-metadata#updatable-group-chat-metadata), or no options. The group chat is stored only in the local storage of the app installation used to create it. In other words, the group chat is visible only to the creator and in the app installation they used to create it.

You can prepare messages for the optimistic group chat immediately using `prepareMessage()`. As with the group chat itself, these messages are stored locally only.

When you want to add members, you use [`addMembers()`](/inboxes/group-permissions#add-members-by-inbox-id) with a list of inbox IDs.

Adding a member will automatically sync the group chat to the network. Once synced, the group chat becomes visible to the added members and across other app installations.

After adding members, you must explicitly call `publishMessages()` to send any prepared messages to the network.

To learn more about optimistically sending messages using `prepareMessage()` and `publishMessages()`, see [Optimistically send messages](/inboxes/send-messages#optimistically-send-messages).

:::code-group

```js [Browser]

```

```js [Node]

```

```tsx [React Native]

```

```kotlin [Kotlin]
// Create optimistic group (stays local)
val optimisticGroup = boClient.conversations.newGroupOptimistic(groupName = "Testing")

// Prepare a message (stays local)
optimisticGroup.prepareMessage("Hello group!")

// Later, add members and sync
optimisticGroup.addMembers(listOf(alixClient.inboxId)) // also syncs group to the network
optimisticGroup.publishMessages() // Publish prepared messages
```

:::

## Create a new DM

Once you have the verified identity, get its inbox ID and create a new DM:

:::code-group

```js [Browser]
const group = await client.conversations.newDm(bo.inboxId);
```

```js [Node]
const group = await client.conversations.newDm(bo.inboxId);
```

```tsx [React Native]
const dm = await alix.conversations.findOrCreateDm(bo.inboxId);
```

```kotlin [Kotlin]
val dm = alix.conversations.findOrCreateDm(bo.inboxId)

// calls the above function under the hood but returns a type conversation instead of a dm
val conversation = client.conversations.newConversation(inboxId)
```

```swift [Swift]
let dm = try await alix.conversations.findOrCreateDm(with: bo.inboxId)

// calls the above function under the hood but returns a type conversation instead of a dm
let conversation = try await client.conversations.newConversation(inboxId)
```

:::

## Conversation helper methods

Use these helper methods to quickly locate and access specific conversations—whether by conversation ID, topic, group ID, or DM identity—returning the appropriate ConversationContainer, group, or DM object.

:::code-group

```js [Browser]
// get a conversation by its ID
const conversationById = await client.conversations.getConversationById(
  conversationId
);

// get a message by its ID
const messageById = await client.conversations.getMessageById(messageId);

// get a 1:1 conversation by a peer's inbox ID
const dmByInboxId = await client.conversations.getDmByInboxId(peerInboxId);
```

```js [Node]
// get a conversation by its ID
const conversationById = await client.conversations.getConversationById(
  conversationId
);

// get a message by its ID
const messageById = await client.conversations.getMessageById(messageId);

// get a 1:1 conversation by a peer's inbox ID
const dmByInboxId = await client.conversations.getDmByInboxId(peerInboxId);
```

```tsx [React Native]
// Returns a ConversationContainer
await alix.conversations.findConversation(conversation.id);
await alix.conversations.findConversationByTopic(conversation.topic);
// Returns a Group
await alix.conversations.findGroup(group.id);
// Returns a DM
await alix.conversations.findDmByIdentity(bo.identity);
```

```kotlin [Kotlin]
// Returns a ConversationContainer
alix.conversations.findConversation(conversation.id)
alix.conversations.findConversationByTopic(conversation.topic)
// Returns a Group
alix.conversations.findGroup(group.id)
// Returns a DM
alix.conversations.findDmbyInboxId(bo.inboxId);
```

```swift [Swift]
// Returns a ConversationContainer
try alix.conversations.findConversation(conversation.id)
try alix.conversations.findConversationByTopic(conversation.topic)
// Returns a Group
try alix.conversations.findGroup(group.id)
// Returns a DM
try alix.conversations. findDmbyInboxId(bo.inboxId)
```

:::

## Conversation union type

Serves as a unified structure for managing both group chats and DMs. It provides a consistent set of properties and methods to seamlessly handle various conversation types.

- React Native: [Conversation.ts](https://github.com/xmtp/xmtp-react-native/blob/main/src/lib/Conversation.ts)

## Group class

Represents a group chat conversation, providing methods to manage group-specific functionalities such as sending messages, synchronizing state, and handling group membership.

- React Native: [Group.ts](https://github.com/xmtp/xmtp-react-native/blob/main/src/lib/Group.ts)

## Dm class

Represents a DM conversation, providing methods to manage one-on-one communications, such as sending messages, synchronizing state, and handling message streams.

- React Native: [Dm.ts](https://github.com/xmtp/xmtp-react-native/blob/main/src/lib/Dm.ts)
