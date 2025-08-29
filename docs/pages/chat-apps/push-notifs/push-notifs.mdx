# Support push notifications

With XMTP, you can enable real-time push notifications to keep users updated on new conversations and messages.

## Get a Welcome message topic ID

Get the topic identifier for an app installation. This topic ID tells your app where to listen on the network for push notifications about any new group chat or DM conversations.

:::code-group

```tsx [React Native]
// Request
alix.welcomeTopic()

// Response
/xmtp/mls/1/w-$installationId/proto
```

```kotlin [Kotlin]
// Request
Topic.userWelcome(client.installationId).description

// Response
/xmtp/mls/1/w-$installationId/proto
```

```swift [Swift]
// Request
Topic.userWelcome(client.installationId).description

// Response
/xmtp/mls/1/w-$installationId/proto
```

:::

## Get a message topic ID

Get the topic identifier for a group chat or DM conversation that's already in progress. This topic ID tells your app where to listen on the network for push notifications about any new messages in a specific group chat or DM conversation.

:::code-group

```tsx [React Native]
// Request
conversation.topic

// Response
/xmtp/mls/1/g-$conversationId/proto
```

```kotlin [Kotlin]
// Request
conversation.topic

// Response
/xmtp/mls/1/g-$conversationId/proto
```

```swift [Swift]
// Request
conversation.topic

// Response
/xmtp/mls/1/g-$conversationId/proto
```

:::

## List push topics for a DM conversation

Lists topics for a specific DM conversation.

:::code-group

```tsx [React Native]
conversation.getPushTopics()
```

```kotlin [Kotlin]
conversation.getPushTopics()
```

```swift [Swift]
conversation.getPushTopics()
```

:::

## List push topics for all conversations

Lists topics for all group chat and DM conversations, including duplicate DM conversations.

Duplicate DM conversations can occur when a user creates new conversations with the same contact from different installations or devices. While DM stitching automatically combines these conversations into a single view for users, each duplicate conversation maintains its own push notification topic. Ensure that users receive push notifications for messages sent through any of the stitched conversations, even as the system gradually consolidates them into a single conversation.

To learn more, see [Understand DM stitching and push notifications](/chat-apps/push-notifs/understand-push-notifs#understand-dm-stitching-and-push-notifications).

:::code-group

```tsx [React Native]
conversations.allPushTopics()
```

```kotlin [Kotlin]
conversations.allPushTopics()
```

```swift [Swift]
conversations.allPushTopics()
```

:::

## Subscribe to topics

Subscribe to all relevant topics, allowing your app to monitor for push notifications about both new and ongoing conversations.

This code sample retrieves all topics associated with `alix`'s conversations, for example, enabling the app to receive push notifications only for conversations in which `alix` is a part of.

:::code-group

```tsx [React Native]
const conversations = await alix.conversations.list();
const topics = conversations.map((conv: any) => conv.topic);

await subscribeAll([alix.welcomeTopic(), ...topics]);
```

```kotlin [Kotlin]
val conversations = alix.conversations.list()
val topics = conversations.map { it.topic }.toMutableList()

subscribeAll(topics.push(Topic.userWelcome(client.installationId).description))
```

```swift [Swift]
let conversations = try await alix.conversations.list()
var topics = conversations.map { $0.topic }

subscribeAll(topics.append(Topic.userWelcome(client.installationId).description))```

:::

## Receive push notifications

On receipt of a push notification, decode it:

:::code-group

```tsx [React Native]
const receivedBytes = Buffer.from(received.message, "base64").toString("utf-8");
```

```kotlin [Kotlin]
val encryptedMessage = remoteMessage.data["encryptedMessage"]
val encryptedMessageData = Base64.decode(encryptedMessage, Base64.NO_WRAP)
```

```swift [Swift]
let encryptedMessage = remoteMessage.data["encryptedMessage"]
let encryptedMessageData =  Data(base64Encoded: encryptedMessage)
```

:::

Then determine whether it's for a new conversation or an existing one.

- **If it's a Welcome message for a new conversation** (`alix.welcomeTopic() == received.topic`), initiate the conversation with `fromWelcome`:

  :::code-group

  ```tsx [React Native]
  const conversation = await alix.conversations.fromWelcome(
    receivedBytes
  );
  ```

  ```kotlin [Kotlin]
  val conversation = alix.conversations.fromWelcome(receivedBytes)
  ```

  ```swift [Swift]
  let conversation = try await alix.conversations.fromWelcome(receivedBytes)
  ```

  :::

- **If it's a message for an existing conversation**, find the corresponding topic, sync the conversation, and process the new message:

  :::code-group

  ```tsx [React Native]
  const conversation = await alix.findConversationByTopic(received.topic);
  await conversation.sync();
  const message = await conversation.processMessage(receivedBytes);
  ```

  ```kotlin [Kotlin]
  val conversation = alix.findConversationByTopic(received.topic)
  conversation.sync()
  val message = conversation.processMessage(receivedBytes)
  ```

  ```swift [Swift]
  let conversation = try alix.findConversationByTopic(received.topic)
  try await conversation.sync()
  let message = try await conversation.processMessage(receivedBytes)
  ```

  :::

## Stream HMAC key update events

Use `preferences.stream` to listen for events that indicate when a new HMAC key has been added, typically due to a new installation joining the network. This stream does not provide the actual HMAC keys but notifies you to refresh your HMAC keys accordingly by resubscribing to topics.

This is particularly useful for ensuring that push notifications work correctly across all installations by not missing updates from new installations.

:::code-group

```tsx [React Native]
await alix.preferences.stream((event: any) => {
  // Received a preference update event
  // Check if it indicates a new HMAC key and resubscribe if necessary
});
```

```kotlin [Kotlin]
alix.preferences.stream().collect { event ->
  // Received a preference update event
}
```

```swift [Swift]
for await event in try await alix.preferences.stream() {
  // Received a preference update event
}
```

:::

## Resubscribe to topics to get new HMAC keys

As soon as your app receives a user preference update event from [preferences.sync](/chat-apps/list-stream-sync/sync-preferences) or [preferences.stream](#stream-hmac-key-update-events) indicating new HMAC keys for a user, resubscribe to topics to get the new HMAC keys. For example:

```kotlin [Kotlin]
conversations.allTopics.forEach { -> topic
val hmacKeysResult = conversations.getHmacKeys()
val hmacKeys = hmacKeysResult.hmacKeysMap
val result = hmacKeys[topic]?.valuesList?.map { hmacKey ->
    Service.Subscription.HmacKey.newBuilder().also { sub_key ->
        sub_key.key = hmacKey.hmacKey
        sub_key.thirtyDayPeriodsSinceEpoch = hmacKey.thirtyDayPeriodsSinceEpoch
    }.build()
}

val subscription = Service.Subscription.newBuilder().also { sub ->
    sub.addAllHmacKeys(result)
    sub.topic = topic
    sub.isSilent = false
}.build()
}

PushNotificationTokenManager.xmtpPush.subscribeWithMetadata(subscription)
```

This ensures that older installations (or your XMTP push notification server code) now know about and resubscribe to all conversations for all of the new HMAC keys.

## Get HMAC keys for a conversation

Gets the HMAC keys for a specific group chat or DM conversation.

For DM conversations, the response includes HMAC keys for all topics associated with the conversation. This is necessary because a single DM conversation can have multiple underlying topics due to DM stitching, where multiple conversations between the same participants are combined into one view.

For example, if Alix and Bo have a conversation that was created from two different installations, there might be two topics (`topic1` and `topic2`) for what appears as a single conversation to the user. The response will include HMAC keys for both topics to ensure push notifications work correctly regardless of which topic the message was sent through.

To learn more, see [Understand DM stitching and push notifications](/chat-apps/push-notifs/understand-push-notifs#understand-dm-stitching-and-push-notifications).

:::code-group

```tsx [React Native]
conversation.getHmacKeys()
```

```kotlin [Kotlin]
conversation.getHmacKeys()
```

```swift [Swift]
conversation.getHmacKeys()
```

:::

## Run a push notification server

To implement push notifications in your app, you must run a push notification server. This server acts as an intermediary between the XMTP network and your app's push notification service, ensuring that users receive timely and relevant notifications.

### Why is a push notification server required?

- **Continuous monitoring**: The XMTP network operates on a decentralized protocol, where messages are exchanged directly between clients. However, for push notifications, your app needs a dedicated server to continuously listen for new messages or events on the XMTP network, even when the user's device is offline or the app is not running.
- **Message processing**: Upon detecting new messages or events, the server processes them to determine their relevance and formats them appropriately for push notifications. This includes extracting necessary information, such as the sender's identity and message content, to craft meaningful notifications.
- **Integration with push notification services**: The server interfaces with platform-specific push notification services, like [Apple Push Notification Service](/chat-apps/push-notifs/understand-push-notifs#best-practices-for-apple-push-notifications) (APNs) for iOS or Firebase Cloud Messaging (FCM) for Android. It sends the processed notifications to these services, which then deliver them to the user's device.

To learn more about running a push notification server, see [Understand push notifications with XMTP](/chat-apps/push-notifs/understand-push-notifs).

Then you can:

- [Set up a Go push notification server](/chat-apps/push-notifs/pn-server)
- [Try push notifications with the Android example XMTP app](/chat-apps/push-notifs/android-pn)
- [Try push notifications with the iOS example XMTP app](/chat-apps/push-notifs/ios-pn)
