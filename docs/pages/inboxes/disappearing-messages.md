# Support disappearing messages with XMTP

Disappearing messages are messages that are intended to be visible to users for only a short period of time. After the message expiration time passes, the messages are removed from the UI and deleted from local storage so the messages are no longer accessible to conversation participants.

## App-level disappearing messages vs. network-level message expiration

Disappearing message behavior is enforced by apps, meaning that apps are responsible for removing messages from their UIs and local storage based on conditions set at the conversation level. As a feature, disappearing messages doesn't delete messages from the XMTP network. 

Starting with XMTP mainnet, the network will enforce message expiration to delete messages from the network after a retention period currently targeted at 6 months.

To learn more, see [Message expiry](https://community.xmtp.org/t/xip-49-decentralized-backend-for-mls-messages/856) in XIP-49: Decentralized backend for MLS messages.

Disappearing messages can be understood as app-level privacy that helps avoid leaving an easily accessible record in a messaging UI, while XMTP mainnet message expiration is the mechanism by which messages are deleted from the network.

## Implement disappearing messages

Conversation participants using apps that support disappearing messages will have a UX that honors the message expiration conditions. Conversation participants using apps that don't support disappearing messages won't experience disappearing message behavior.

Messages abide by the disappearing message settings for the conversation.

### Enable disappearing messages for a conversation

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

```tsx [React Native]
// DM
await client.conversations.newConversation(
  address,
  { 
    disappearingMessageSettings: DisappearingMessageSettings(
      disappearStartingAtNs: 1738620126404999936,
      retentionDurationInNs: 1800000000000000
    )
  }
)

// Group
await client.conversations.newGroup(
  [address],
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
    address,
    disappearingMessageSettings = DisappearingMessageSettings(
        disappearStartingAtNs = 1738620126404999936,
        retentionDurationInNs = 1800000000000000
    )
)

// Group
client.conversations.newGroup(
    [address],
    disappearingMessageSettings = DisappearingMessageSettings(
        disappearStartingAtNs = 1738620126404999936,
        retentionDurationInNs = 1800000000000000
    )
)
```

```swift [Swift]
// DM
try await client.conversations.newConversation(
    with: address,
    disappearingMessageSettings: DisappearingMessageSettings(
        disappearStartingAtNs: 1738620126404999936,
        retentionDurationInNs: 1800000000000000
    )
)

// Group
try await client.conversations.newGroup(
    with: [address],
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

#### Automatic removal from UI

Expired messages don't require manual removal from the UI. If your app UI updates when the local storage changes, expired messages will disappear automatically when the background worker deletes them from local storage.

### Receive a disappearing message

On the receiving side, your app doesn't need to check expiration conditions manually. Receive and process messages as usual, and the background worker handles message expiration cleanup.

### UX tips for disappearing messages

To ensure that users understand which messages are disappearing messages and their behavior, consider implementing:

- A distinct visual style: Style disappearing messages differently from regular messages (e.g., a different background color or icon) to indicate their temporary nature.
- A clear indication of the message's temporary nature: Use a visual cue, such as a timestamp or a countdown, to inform users that the message will disappear after a certain period.
