# Support disappearing messages with XMTP

Disappearing messages are messages that are intended to be visible to users for only a short period of time. After the message expiration time passes, the messages are removed from the UI and deleted from local storage so the messages are no longer accessible to conversation participants.

Disappearing message behavior is enforced by apps, meaning that apps are responsible for removing messages from their UIs and local storage based on conditions set at the conversation level. Conversation participants using apps that support disappearing messages will have a UX that honors the message expiration conditions. 

However, it's important to understand that:

- A conversation participant using an app that doesn't support disappearing messages will not experience disappearing message behavior.
- Messages aren't deleted from the XMTP network.

Therefore, disappearing messages should be understood as best-effort, app-level privacy that helps avoid leaving an easily accessible record in a messaging UI. However, it's not a guaranteed, system-wide “message self-destruct.”

## Implement disappearing messages

Here is a high-level view of the disappearing messages flow:

1. When a 1:1 or group chat conversation is created or updated, a user with appropriate permissions can set disappearing message conditions for messages sent in the conversation.
2. In a conversation with disappearing message conditions, a sender creates a message. The message abides by disappearing message metadata set for the conversation.
3. The message is sent over the XMTP network.
4. The recipients’ apps with disappearing message support receive the message and check the expiration conditions set for the conversation.
5. If the message hasn't expired, the app displays the message in the messaging UI.
6. If the message has expired, the message is removed from (or not displayed in the first place in) the conversation participants’ app UIs and is deleted from the apps’ local storage.

### Enable disappearing messages for a conversation

When creating or updating a conversation, enable users with appropriate permissions to set disappearing message expiration conditions.

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

```text
// Example: disappearing message with an expiration time based on a 
// countdown start time and expiration countdown
```

### Receive a disappearing message

On the receiving side, your app needs to:

1. Check for disappearing message metadata set for the conversation. For example:
    
    ```text
    // Example: check for disappearing message on the message's parent conversation
    ```
    
2. Display the message if the current time is before the expiration time. For example:
    
    ```text
    // Example: Check is the current time is before the expiration time
    ```
    
    Here are some tips for displaying disappearing messages in your app to ensure that users understand which messages use the feature and what to expect.
    
    - **Use a distinct visual style**: You might style disappearing messages differently from regular messages (e.g., a different background color or icon) so users understand they're short-lived.
    - **Display a countdown**: Show a small countdown that indicates how much time remains before the message disappears.

### Periodically check message expiration time

A worker runs every one second to clean up expired disappearing messages. The worker also updates the message expiration policy to align with any updated policy values. For example:

```text
// Example: Use the worker that runs every two seconds 
// to clean up expired messages based on group disappearing settings. 
// The worker will also update the message expiration policy to align 
// with any updated disappearing message policy values.
```

### Remove a message from the app UI

If the expiration time has passed, remove the message from the app UI. For example:

```text
// Example: remove the message from your UI
```

### Delete a message from local storage

If the expiration time has passed, delete the message from local storage. For example:

```text
// Example: delete the message from local storage
```
