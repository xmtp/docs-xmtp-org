# Support push notifications

With XMTP, you can enable real-time push notifications to keep users updated on new conversations and messages.

For best practices, see [Best practices for push notifications](#best-practices-for-push-notifications).

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

Get the topic identifier for a group chat or DM conversation that’s already in progress. This topic ID tells your app where to listen on the network for push notifications about any new messages in a specific group chat or DM conversation.

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

## Subscribe to topics

Subscribe to all relevant topics, allowing your app to monitor for push notifications about both new and ongoing conversations.

This code sample retrieves all topics associated with `alix`’s conversations, for example, enabling the app to receive push notifications only for conversations in which `alix` is a part of.

:::code-group

```tsx [React Native]
const conversations = await alix.conversations.listConversations();
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

Then determine whether it’s for a new conversation or an existing one.

- **If it’s a Welcome message for a new conversation** (`alix.welcomeTopic() == received.topic`), initiate the conversation with `conversationFromWelcome`:

  :::code-group

  ```tsx [React Native]
  const conversation = await alix.conversations.conversationFromWelcome(
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

- **If it’s a message for an existing conversation**, find the corresponding topic, sync the conversation, and process the new message:

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

## Run a push notification server

To implement push notifications in your app, you must run a push notification server. This server acts as an intermediary between the XMTP network and your app’s push notification service, ensuring that users receive timely and relevant notifications.

### Why is a push notification server required?

- **Continuous monitoring**: The XMTP network operates on a decentralized protocol, where messages are exchanged directly between clients. However, for push notifications, your app needs a dedicated server to continuously listen for new messages or events on the XMTP network, even when the user’s device is offline or the app is not running.
- **Message processing**: Upon detecting new messages or events, the server processes them to determine their relevance and formats them appropriately for push notifications. This includes extracting necessary information, such as the sender’s identity and message content, to craft meaningful notifications.
- **Integration with push notification services**: The server interfaces with platform-specific push notification services, like [Apple Push Notification Service](#understand-apple-entitlements-for-ios-apps) (APNs) for iOS or Firebase Cloud Messaging (FCM) for Android. It sends the processed notifications to these services, which then deliver them to the user’s device.

To learn more about running a push notification server, see:

- Go: [Set up a push notification server](/inboxes/push-notifs/pn-server)
- Android: [Try push notifications with the Android example XMTP app](/inboxes/push-notifs/android-pn)
- iOS: [Try push notifications with the iOS example XMTP app](/inboxes/push-notifs/ios-pn)

## Best practices for push notifications

- Display push notifications only for messages sent **to** a user. In other words, do not send a push notification to a user about a message they sent. To do this, filter out messages sent by the user and don't send push notifications for them.

- Provide a separate setting for enabling and disabling direct message push notifications. For example, if you’re building a Lens app, provide a setting for XMTP push notifications that’s separate from Lens push notifications for posts, comments, likes, and so forth. For example, here are push notification settings in the Orb app:

  <div>
  <img src="https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/push-notif-settings.png" width="350px" />
  </div>

- Decrypt messages for push notifications so you can display the contents within the notification. For example, here is a decrypted push notification provided by the Converse app:

  <div>
  <img src="https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/push-notifs-decrypted.jpg" width="350px" />
  </div>

- Display badges that indicate the presence of new notifications, messages, or conversations to help with engagement and interaction success.

  - Here is a conversation icon badge showing the presence of an unread message:

    <div>
    <img src="https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/unread-badge.png" width="350px" />
    </div>

    Along these lines, be sure to unbadge conversations in which the user sent the latest message to avoid displaying unnecessary badges as users send messages across different apps. The action of sending the latest message implies that the user has seen the conversation.

  - Here is an app icon badge showing the number of unread messages in the Orb app:

    <div>
    <img src="https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/badging-orb.jpg" width="200px"/>
    </div>

### Understand Apple entitlements for iOS apps

When building an iOS app with XMTP, you might want to suppress certain Apple push notifications. For example, you should suppress push notifications for a user's own messages.

You can use the [com.apple.developer.usernotifications.filtering](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_usernotifications_filtering) entitlement. To do so, you need to obtain permission from Apple. Submit the application using the app owner's Apple developer account via [https://developer.apple.com/contact/request/notification-service](https://developer.apple.com/contact/request/notification-service).

:::tip[Submit your application early]
The approval process can take 2-3 weeks or longer.
:::

Here are some sample answers to help you complete the application:

- **App name:** [Your app name]
- **App Store URL:** [Your app store URL]
- **Apple ID of App:** [Your app ID]
- **App Type:** Messaging
- **Does your app provide end-to-end encryption?:** Yes
- **Explain why existing APIs are not adequate for your app:** The existing APIs always show some sort of notification when a push comes in. We don't want to show a notification for a user's own messages.
- **Explain why your app doesn’t show a visible notification each time a push notification is received:** The server delivering notifications only knows of the existence of a conversation. It does not know who the sender or recipient are. That data is decoded on the device in the extension. As a result, it sends a push notification for every message that occurs in the conversation. We want to filter out notifications for notifications that the user sent.
- **When your extension runs, what system and network resources does it need?:** We might need to make a GRPC request in order to load additional information about a conversation. This is only necessary when we haven't stored the conversation details locally, which is expected to be less common than being able to just decode the conversation locally.
- **How often does your extension run? What can trigger it to run?:** The extension will run whenever a message is sent or received in a conversation. The frequency will depend on how active a user is.
