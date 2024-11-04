# Support push notifications

With XMTP, you can enable real-time push notifications to keep users updated on new conversations and messages.

For best practices, see [Best practices for push notifications](https://docs.xmtp.org/notifications/notif-best-practices).

## Get a Welcome message topic ID

Get the topic identifier for a new group chat or DM conversation. This topic ID tells your app where to listen on the network for push notifications about the start of a new group chat or DM.

```tsx [React Native]
// Request
alix.welcomeTopic()

// Response
/xmtp/mls/1/w-$installationId/proto
```

*Replaces V2 `/xmtp/0/invite-$address/proto`* 

## Get a V3 message topic ID

Get the topic identifier for a group chat or DM conversation that’s already in progress. This topic ID tells your app where to listen on the network for push notifications about any new messages in a specific group chat or DM conversation.

```tsx [React Native]
// Request
conversation.topic

// Response
/xmtp/mls/1/g-$conversationId/proto
```

*Replaces V2 `/xmtp/0/m-$addresses/proto`*

## Subscribe to topics

Subscribe to all relevant topics, allowing your app to monitor for push notifications about both new and ongoing conversations. 

This code sample retrieves all topics associated with `alix`’s conversations, for example, enabling the app to receive push notifications only for conversations in which `alix` is a part of.

```tsx [React Native]
const conversations = await alix.conversations.listConversations()
const topics = conversations.map((conv: any) => conv.topic)

await subscribeAll([alix.welcomeTopic(), ...topics])
```

## Receive push notifications

On receipt of a push notification, decode it:

```tsx [React Native]
const receivedBytes = Buffer.from(received.message, 'base64').toString('utf-8')
```

Then determine whether it’s for a new conversation or an existing one.

- **If it’s a Welcome message** (`alix.welcomeTopic() == received.topic`), initiate the conversation with `conversationFromWelcome`:
    
    ```tsx [React Native]
    const conversation = await alix.conversations.conversationFromWelcome(receivedBytes)
    ```
    
- **If it’s a V3 message**, find the corresponding topic, sync the conversation, and process the new message:
    
    ```tsx [React Native]
    const conversation = await alix.findConversationByTopic(received.topic)
    await conversation.sync()
    const message = await conversation.processMessage(receivedBytes)
    ```
    

## Run a push notification server

To implement push notifications in your app, you must run a push notification server. This server acts as an intermediary between the XMTP network and your app’s push notification service, ensuring that users receive timely and relevant notifications.

### Why is a push notification server required?

- **Continuous monitoring**: The XMTP network operates on a decentralized protocol, where messages are exchanged directly between clients. However, for push notifications, your app needs a dedicated server to continuously listen for new messages or events on the XMTP network, even when the user’s device is offline or the app is not running.
- **Message processing**: Upon detecting new messages or events, the server processes them to determine their relevance and formats them appropriately for push notifications. This includes extracting necessary information, such as the sender’s identity and message content, to craft meaningful notifications.
- **Integration with push notification services**: The server interfaces with platform-specific push notification services, like [Apple Push Notification Service](https://docs.xmtp.org/notifications/build-notifications#understand-apple-entitlements-for-ios-apps) (APNs) for iOS or Firebase Cloud Messaging (FCM) for Android. It sends the processed notifications to these services, which then deliver them to the user’s device.

To learn more about running a push notification server, see:

- Go: [Set up a push notification server](https://docs.xmtp.org/notifications/notif-server)
- Android: [Try push notifications with the Android example XMTP app](https://docs.xmtp.org/notifications/notifs-android)
- iOS: [Try push notifications with the iOS example XMTP app](https://docs.xmtp.org/notifications/notifs-ios) 