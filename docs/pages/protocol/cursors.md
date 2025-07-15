# Cursors with XMTP

This document explains the concept of **cursors** as they relate to message synchronization on the XMTP network. Cursors are a fundamental part of how XMTP clients efficiently fetch new messages and maintain state, particularly with the `sync()` family of functions.

While cursors are managed automatically by the XMTP SDKs, understanding how they work is crucial for debugging and for grasping the underlying mechanics of message synchronization.

## What is a cursor?

A cursor is a pointer or a marker that an XMTP client maintains for each topic it subscribes to (both [group message topics](/protocol/topics#group-message-topic) and [welcome message topics](/protocol/topics#welcome-message-topic)). This cursor is stored locally and is specific to each app installation.

Think of it as a bookmark in the chronological log of messages and events for a given topic. Its purpose is to remember the exact point up to which an installation has successfully synchronized its data.

## How cursors work with `sync()`

The primary role of a cursor becomes evident when you use the `sync()` functions (`conversation.sync()`, `conversations.sync()`, and `conversations.syncAll()`).

1.  **Initial sync**: The first time an app installation calls `sync()` for a specific conversation, it fetches all available messages and events from the network for that conversation's topic.
2.  **Cursor placement**: Once the sync is complete, the SDK places a cursor at the end of that batch of fetched messages.
3.  **Subsequent syncs**: On the next `sync()` call for that same conversation, the client sends its current cursor position to the network. The network then returns only the messages and events that have occurred *after* that cursor.
4.  **Cursor advancement**: After the new messages are successfully fetched, the SDK advances the cursor to the new latest point.

This process ensures that each `sync()` call only retrieves what's new, making synchronization efficient by avoiding the re-downloading of messages the client already has.

### The cursor only moves forward

A key characteristic of cursors is that they **only move forward** and **only when a `sync()` function is called**.

- **You cannot re-fetch old messages**: Because the cursor never moves backward, an installation cannot use `sync()` to re-fetch messages it has already synchronized. The network will only return messages that are newer than the installation's current cursor. To get message history on a *new* device, you would use [History Sync](/inboxes/history-sync).
- **Streaming does not move the cursor**: Receiving messages via a real-time `stream()` does not affect the cursor's position. This is intentional. Streaming provides messages as they arrive but doesn't guarantee their order or that none were missed (for example, if the client was briefly offline). The `sync()` function acts as the authoritative way to get all messages in the correct order up to a certain point. Calling `sync()` after streaming ensures the local state is consistent and correctly ordered.

## Cursors for different sync functions

Each `sync()` function corresponds to a different type of cursor:

- `conversation.sync()`: This operates on the **group message topic** for a single conversation. It moves the cursor for that specific conversation, fetching new messages or group updates (like name changes).
- `conversations.sync()`: This operates on the **welcome message topic**. It moves the cursor for welcome messages, fetching any new conversations the user has been invited to. It does *not* fetch the contents of those new conversations.
- `conversations.syncAll()`: This is the most comprehensive sync. It effectively performs the actions of the other two syncs for all of the user's conversations. It moves the cursors for the welcome topic *and* for every individual group message topic, ensuring the client has fetched all new conversations and all new messages in existing conversations.

By understanding cursors, you can better reason about the behavior of your app's synchronization logic and the data being transferred from the XMTP network.
