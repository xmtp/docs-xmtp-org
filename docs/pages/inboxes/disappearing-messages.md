# Support disappearing messages with XMTP

Disappearing messages are messages that are intended to be visible to users for only a short period of time. After the message expiration time passes, the messages are removed from the UI and deleted from local storage so the messages are no longer accessible to conversation participants.

Disappearing message behavior is enforced by apps, meaning that apps are responsible for removing messages from their UIs and local storage based on conditions set at the conversation level. Conversation participants using apps that support disappearing messages will have a UX that honors the message expiration conditions. 

However, it's important to understand that:

- A conversation participant using an app that doesn't support disappearing messages won't experience disappearing message behavior.
- Messages aren't deleted from the XMTP network.

:::tip

Therefore, disappearing messages should be understood as best-effort, app-level privacy that helps avoid leaving an easily accessible record in a messaging UI. However, it's not a guaranteed, system-wide “message self-destruct.”

:::

## Implement disappearing messages

### Enable disappearing messages for a conversation

When creating or updating a conversation, only group admins and DM participants can set disappearing message expiration conditions.

This includes setting the following conditions expressed in nanoseconds (ns):

- `from_ns`: Starting timestamp from which the message lifespan is calculated
- `in_ns`: Duration of time during which the message should remain visible to conversation participants

For example:

1. Set `from_ns` to the current time, such as `1738620126404999936` (nanoseconds since the Unix epoch of January 1, 1970).
2. Set `in_ns` to the message lifespan, such as 1800000000000000 (30 minutes).
3. Use `from_ns` and `in_ns` to calculate the message expiration time of `1738620126404999936 + 1800000000000000 = 1740420126404999936`.

To learn more see [conversation.rs](https://github.com/xmtp/libxmtp/blob/main/bindings_node/src/conversation.rs#L49).

### Send a disappearing message

When sending a message, it abides by message expiration conditions set for the conversation. For example:

:::code-group

```tsx [Browser]
// add code sample
```

```tsx [Node]
// add code sample
```

```tsx [React Native]
// add code sample
```

```kotlin [Kotlin]
// add code sample
```

```swift [Swift]
// add code sample
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
