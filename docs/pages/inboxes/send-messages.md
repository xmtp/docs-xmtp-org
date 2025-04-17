# Send messages

Once you have the group chat or DM conversation, you can send messages in the conversation.

:::code-group

```tsx [Browser]
// For a DM conversation
await dm.send("Hello world");

// OR for a group chat
await group.send("Hello everyone");
```

```tsx [Node]
// For a DM conversation
await dm.send("Hello world");

// OR for a group chat
await group.send("Hello everyone");
```

```tsx [React Native]
// For a DM conversation
const dm = await client.conversations.findOrCreateDm(recipientInboxId);
await dm.send("Hello world");

// OR for a group chat
const group = await client.conversations.newGroup([recipientInboxId1, recipientInboxId2]);
await group.send("Hello everyone");
```

```kotlin [Kotlin]
// For a DM conversation
val dm = client.conversations.findOrCreateDm(recipientInboxId)
dm.send(text = "Hello world")

// OR for a group chat
val group = client.conversations.newGroup(listOf(recipientInboxId1, recipientInboxId2))
group.send(text = "Hello everyone")
```

```swift [Swift]
// For a DM conversation
let dm = try await client.conversations.findOrCreateDm(with: recipientInboxId)
try await dm.send(content: "Hello world")

// OR for a group chat
let group = try await client.conversations.newGroup([recipientInboxId1, recipientInboxId2])
try await group.send(content: "Hello everyone")
```

:::

## Optimistically send messages

When a user sends a message with XMTP, they might experience a slight delay between sending the message and seeing their sent message display in their app UI.

Typically, the slight delay is caused by the app needing to wait for the XMTP network to finish processing the message before the app can display the message in its UI.

Messaging without optimistic sending:

![Messaging without optimistic sending. Note the slight delay after clicking Send.](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/without-opt-sending.gif)

Note the slight delay after clicking **Send**.

Implement optimistic sending to be able to immediately display the sent message in the sender’s UI while processing the message in the background. This provides the user with immediate feedback and enables them to continue messaging without waiting for their previous message to finish processing.

Messaging with optimistic sending:

![Messaging with optimistic sending. The message displays immediately for the sender, with a checkmark indicator displaying once the message has been successfully sent.](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/with-opt-sending.gif)

The message displays immediately for the sender, with a checkmark indicator displaying once the message has been successfully sent.

### How it works

There are two steps to optimistically send a message:

1. Send the message to the local database so you can display it immediately in the sender's UI.
2. Publish the message to the XMTP network so it can be delivered to the recipient.

### 1. Optimistically send a message locally

Send the message to the local database. This ensures that the message will be there when you query for messages and can immediately display the message in the sender's UI.

:::code-group

```tsx [Browser]
// Optimistically send the message to the local database
conversation.sendOptimistic("Hello world");

// For custom content types, specify the content type
const customContent = { foo: "bar" };
const contentType = { authorityId: "example", typeId: "test", versionMajor: 1, versionMinor: 0 };
conversation.sendOptimistic(customContent, contentType);
```

```tsx [Node]
// Optimistically send the message to the local database
conversation.sendOptimistic("Hello world");

// For custom content types, specify the content type
const customContent = { foo: "bar" };
const contentType = { authorityId: "example", typeId: "test", versionMajor: 1, versionMinor: 0 };
conversation.sendOptimistic(customContent, contentType);
```

```tsx [React Native]
// Optimistically send the message to the local database
await conversation.prepareMessage("Hello world");

// For custom content types, specify the content type
const customContent = { foo: "bar" };
const contentType = new ContentTypeId({
  authorityId: "example",
  typeId: "test",
  versionMajor: 1,
  versionMinor: 0
});
await conversation.prepareMessage(customContent, contentType);
```

```kotlin [Kotlin]
// Optimistically send the message to the local database
conversation.prepareMessage("Hello world")

// For custom content types, specify the content type
val customContent = mapOf("foo" to "bar")
val contentType = ContentTypeId(
    authorityId = "example",
    typeId = "test",
    versionMajor = 1,
    versionMinor = 0
)
conversation.prepareMessage(customContent, contentType)
```

```swift [Swift]
// Optimistically send the message to the local database
try await conversation.prepareMessage("Hello world")

// For custom content types, specify the content type
let customContent = ["foo": "bar"]
let contentType = ContentTypeId(
    authorityId: "example",
    typeId: "test",
    versionMajor: 1,
    versionMinor: 0
)
try await conversation.prepareMessage(customContent, contentType: contentType)
```

:::

### 2. Publish an optimistically sent message to the network

After optimistically sending a message, use `publishMessages` to publish the message to the XMTP network so it can be delivered to recipients.

:::code-group

```tsx [Browser]
// Publish all pending optimistically sent messages to the network
// Call this only after using sendOptimistic to send a message locally
async function sendMessageWithOptimisticUI(conversation, messageText) {
  try {
    // Add message to UI immediately
    conversation.sendOptimistic(messageText);
    
    // Actually send the message to the network
    await conversation.publishMessages();
    return true;
  } catch (error) {
    console.error("Failed to send message:", error);
    return false;
  }
}
```

```tsx [Node]
// Publish all pending optimistically sent messages to the network
// Call this only after using sendOptimistic to send a message locally
async function sendMessageWithOptimisticUI(conversation, messageText) {
  try {
    // Add message to UI immediately
    conversation.sendOptimistic(messageText);
    
    // Actually send the message to the network
    await conversation.publishMessages();
    return true;
  } catch (error) {
    console.error("Failed to send message:", error);
    return false;
  }
}
```

```tsx [React Native]
// Publish all pending optimistically sent messages to the network
// Call this only after using prepareMessage to send a message locally
async function sendMessageWithOptimisticUI(conversation: Conversation, messageText: string): Promise<boolean> {
  try {
    // Add message to UI immediately
    await conversation.prepareMessage(messageText);
    
    // Actually send the message to the network
    await conversation.publishMessages();
    return true;
  } catch (error) {
    console.error("Failed to send message:", error);
    return false;
  }
}
```

```kotlin [Kotlin]
// Publish all pending optimistically sent messages to the network
// Call this only after using prepareMessage to send a message locally
suspend fun sendMessageWithOptimisticUI(conversation: Conversation, messageText: String): Boolean {
    return try {
        // Add message to UI immediately
        conversation.prepareMessage(messageText)
        
        // Actually send the message to the network
        conversation.publishMessages()
        true
    } catch (error: Exception) {
        Log.e("XMTP", "Failed to send message: ${error.message}", error)
        false
    }
}
```

```swift [Swift]
// Publish all pending optimistically sent messages to the network
// Call this only after using prepareMessage to send a message locally
func sendMessageWithOptimisticUI(conversation: Conversation, messageText: String) async throws -> Bool {
    do {
        // Add message to UI immediately
        try await conversation.prepareMessage(messageText)
        
        // Actually send the message to the network
        try await conversation.publishMessages()
        return true
    } catch {
        print("Failed to send message: \(error)")
        return false
    }
}
```

:::

### Key UX considerations for optimistically sent messages

- After optimistically sending a message, show the user an indicator that the message is still being processed. After successfully sending the message, show the user a success indicator.
  - An optimistically sent message initially has an `unpublished` status. Once published to the network, it has a `published` status. You can use this status to determine which indicator to dipslay in the UI.
- If an optimistically sent message fails to send it will have a `failed` status. In this case, be sure to give the user an option to retry sending the message or cancel sending. Use a try/catch block to intercept errors and allow the user to retry or cancel.

## Handle unsupported content types

As more [custom](/inboxes/content-types/content-types#create-a-custom-content-type) and [standards-track](/inboxes/content-types/content-types#standards-track-content-types) content types are introduced into the XMTP ecosystem, your app may encounter content types it does not support. This situation, if not handled properly, could lead to app crashes.

Each message is accompanied by a `fallback` property, which offers a descriptive string representing the content type's expected value. It's important to note that fallbacks are immutable and are predefined in the content type specification. In instances where `fallback` is `undefined`, such as read receipts, it indicates that the content is not intended to be rendered. If you're venturing into creating custom content types, you're provided with the flexibility to specify a custom fallback string. For a deeper dive into this, see [Build custom content types](/inboxes/content-types/custom).

:::code-group

```js [Browser]
const codec = client.codecFor(content.contentType);
if (!codec) {
  /*Not supported content type*/
  if (message.fallback !== undefined) {
    return message.fallback;
  }
  // Handle other types like ReadReceipts which are not meant to be displayed
}
```

```js [Node]
const codec = client.codecFor(content.contentType);
if (!codec) {
  /*Not supported content type*/
  if (message.fallback !== undefined) {
    return message.fallback;
  }
  // Handle other types like ReadReceipts which are not meant to be displayed
}
```

```jsx [React Native]
//contentTypeID has the following structure `${contentType.authorityId}/${contentType.typeId}:${contentType.versionMajor}.${contentType.versionMinor}`;
const isRegistered = message.contentTypeID in client.codecRegistry;
if (!isRegistered) {
  // Not supported content type
  if (message?.fallback != null) {
    return message?.fallback;
  }
  // Handle other types like ReadReceipts which are not meant to be displayed
}
```

```kotlin [Kotlin]
val codec = client.codecRegistry.find(options?.contentType)
if (!codec) {
  /*Not supported content type*/
  if (message.fallback != null) {
    return message.fallback
  }
  // Handle other types like ReadReceipts which are not meant to be displayed
}
```

```swift [Swift]
let codec = client.codecRegistry.find(for: contentType)
if (!codec) {
  /*Not supported content type*/
  if (message.fallback != null) {
    return message.fallback
  }
  // Handle other types like ReadReceipts which are not meant to be displayed
}
```

:::

## Support disappearing messages

Disappearing messages are messages that are intended to be visible to users for only a short period of time. After the message expiration time passes, the messages are removed from the UI and deleted from local storage so the messages are no longer accessible to conversation participants.

### App-level disappearing messages vs. network-level message expiration

Disappearing message behavior is enforced by apps, meaning that apps are responsible for removing messages from their UIs and local storage based on conditions set at the conversation level. As a feature, disappearing messages doesn't delete messages from the XMTP network. 

Starting with XMTP mainnet, the network will enforce message expiration to delete messages from the network after a retention period currently targeted at 6 months. This message expiration is a general condition of the network and is not related to the disappearing messages feature.

To learn more, see [Message expiry](https://community.xmtp.org/t/xip-49-decentralized-backend-for-mls-messages/856) in XIP-49: Decentralized backend for MLS messages.

Disappearing messages can be understood as app-level privacy that helps avoid leaving an easily accessible record in a messaging UI, while XMTP mainnet message expiration is the mechanism by which messages are deleted from the network.

### Enable disappearing messages for a conversation

Conversation participants using apps that support disappearing messages will have a UX that honors the message expiration conditions. Conversation participants using apps that don't support disappearing messages won't experience disappearing message behavior.

Messages abide by the disappearing message settings for the conversation.

When creating or updating a conversation, only group admins and DM participants can set disappearing message expiration conditions.

This includes setting the following conditions expressed in nanoseconds (ns):

- `disappearStartingAtNs`: Starting timestamp from which the message lifespan is calculated
- `retentionDurationInNs`: Duration of time during which the message should remain visible to conversation participants

For example:

1. Set `disappearStartingAtNs` to the current time, such as `1738620126404999936` (nanoseconds since the Unix epoch of January 1, 1970).
2. Set `retentionDurationInNs` to the message lifespan, such as 1800000000000000 (30 minutes).
3. Use `disappearStartingAtNs` and `retentionDurationInNs` to calculate the message expiration time of `1738620126404999936 + 1800000000000000 = 1740420126404999936`.

To learn more see [conversation.rs](https://github.com/xmtp/libxmtp/blob/main/bindings_node/src/conversation.rs#L49).


### Set disappearing message settings on conversation create

For example:

:::code-group

```js [Browser]
// DM
await client.conversations.newDm(
  inboxId,
  {
    messageDisappearingSettings: {
      fromNs: 1738620126404999936n,
      inNs: 1800000000000000n
    }
  }
)

// Group
await client.conversations.newGroup(
  [inboxId],
  { 
    messageDisappearingSettings: {
      fromNs: 1738620126404999936n,
      inNs: 1800000000000000n
    }
  }
)
```

```js [Node]
// DM
await client.conversations.newDm(
  inboxId,
  {
    messageDisappearingSettings: {
      fromNs: 1738620126404999936,
      inNs: 1800000000000000
    }
  }
)

// Group
await client.conversations.newGroup(
  [inboxId],
  { 
    messageDisappearingSettings: {
      fromNs: 1738620126404999936,
      inNs: 1800000000000000
    }
  }
)
```

```tsx [React Native]
// DM
await client.conversations.newConversation(
  inboxId,
  {
    disappearingMessageSettings: DisappearingMessageSettings(
      disappearStartingAtNs: 1738620126404999936,
      retentionDurationInNs: 1800000000000000
    )
  }
)

// Group
await client.conversations.newGroup(
  [inboxId],
  { 
    disappearingMessageSettings: DisappearingMessageSettings(
      disappearStartingAtNs: 1738620126404999936,
      retentionDurationInNs: 1800000000000000
    )
  }
)
```

```kotlin [Kotlin]
// DM
client.conversations.newConversation(
    inboxId,
    disappearingMessageSettings = DisappearingMessageSettings(
        disappearStartingAtNs = 1738620126404999936,
        retentionDurationInNs = 1800000000000000
    )
)

// Group
client.conversations.newGroup(
    [inboxId],
    disappearingMessageSettings = DisappearingMessageSettings(
        disappearStartingAtNs = 1738620126404999936,
        retentionDurationInNs = 1800000000000000
    )
)
```

```swift [Swift]
// DM
try await client.conversations.newConversation(
    with: inboxId,
    disappearingMessageSettings: DisappearingMessageSettings(
        disappearStartingAtNs: 1738620126404999936,
        retentionDurationInNs: 1800000000000000
    )
)

// Group
try await client.conversations.newGroup(
    with: [inboxId],
    disappearingMessageSettings: DisappearingMessageSettings(
        disappearStartingAtNs: 1738620126404999936,
        retentionDurationInNs: 1800000000000000
    )
)
```

:::

### Update disappearing message settings for an existing conversation

For example:

:::code-group

```tsx [Browser]
// Update disappearing message settings
await conversation.updateMessageDisappearingSettings(1738620126404999936n, 1800000000000000n)

// Clear disappearing message settings
await conversation.removeMessageDisappearingSettings()
```

```tsx [Node]
// Update disappearing message settings
await conversation.updateMessageDisappearingSettings(1738620126404999936, 1800000000000000)

// Clear disappearing message settings
await conversation.removeMessageDisappearingSettings()
```

```tsx [React Native]
await conversation.updateDisappearingMessageSettings(updatedSettings)
await conversation.clearDisappearingMessageSettings()
```

```kotlin [Kotlin]
conversation.updateDisappearingMessageSettings(updatedSettings)
conversation.clearDisappearingMessageSettings()
```

```swift [Swift]
try await conversation.updateDisappearingMessageSettings(updatedSettings)
try await conversation.clearDisappearingMessageSettings()
```

:::

### Get the disappearing message settings for a conversation

For example:

:::code-group

```tsx [Browser]
// Get the disappearing message settings
const settings = await conversation.messageDisappearingSettings()

// Check if disappearing messages are enabled
const isEnabled = await conversation.isDisappearingMessagesEnabled()
```

```tsx [Node]
// Get the disappearing message settings
const settings = conversation.messageDisappearingSettings()

const isEnabled = conversation.isDisappearingMessagesEnabled()
```

```tsx [React Native]
conversation.disappearingMessageSettings
conversation.isDisappearingMessagesEnabled()
```

```kotlin [Kotlin]
conversation.disappearingMessageSettings
conversation.isDisappearingMessagesEnabled
```

```swift [Swift]
conversation.disappearingMessageSettings
try conversation.isDisappearingMessagesEnabled()
```

:::

### Automatic deletion from local storage

A background worker runs every one second to clean up expired disappearing messages. The worker automatically deletes expired messages from local storage. No additional action is required by integrators.

To learn more about the background worker, see [disappearing_messages.rs](https://github.com/xmtp/libxmtp/blob/main/xmtp_mls/src/groups/disappearing_messages.rs#L68).

### Automatic removal from UI

Expired messages don't require manual removal from the UI. If your app UI updates when the local storage changes, expired messages will disappear automatically when the background worker deletes them from local storage.

### Receive a disappearing message

On the receiving side, your app doesn't need to check expiration conditions manually. Receive and process messages as usual, and the background worker handles message expiration cleanup.

### UX tips for disappearing messages

To ensure that users understand which messages are disappearing messages and their behavior, consider implementing:

- A distinct visual style: Style disappearing messages differently from regular messages (e.g., a different background color or icon) to indicate their temporary nature.
- A clear indication of the message's temporary nature: Use a visual cue, such as a timestamp or a countdown, to inform users that the message will disappear after a certain period.
