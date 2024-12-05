# Enable device sync for apps built with XMTP

Enable the device sync feature to give your users a way to sync decrypted historical data from an existing app installation on one device—with a new app installation on another device.

This historical data includes:

- Conversations
- Conversation messages
- Consent state
- HMAC keys (for push notifications)

Device sync enables your users pick up conversations where they left off, regardless of the app installation they use. All they need is an existing installation online to provide the data.

## Device sync components

Device syncs are accomplished using these components:

- Sync group
- Sync worker
- History server

### Sync group

A sync group is a special [Messaging Layer Security](/protocol/specs) group that includes all of the user’s devices. The sync group is used to send serialized sync messages across the user's devices. The sync group is filtered out of most queries by default so they don’t appear in the user’s inbox.

### Sync worker

A sync worker is a spawned background worker that listens for sync events, and processes them accordingly. This worker:

- Emits and updates consent
- Creates and consumes archive payloads for and from other devices
- Keeps preferences synced across devices

### History server

A history server acts as a bucket that holds encrypted sync payloads. The URL location of these payloads and the password (cipher encryption key) to decrypt these payloads is sent over the sync group for the recipient to decrypt.

## How device sync works

When your app initializes an XMTP client and a `historySyncUrl` client option is present, device sync automatically triggers an initial sync request, pulling all message history into the new app installation and merging it with the existing app installations in the sync group.

Ongoing updates to history are streamed automatically. Updates, whether for user consent preferences or messages, are sent across the sync group, ensuring all app installations have up-to-date information.

## Enable device sync

When [creating a client](/inboxes/build-inbox#create-an-xmtp-client), set the `historySyncUrl` client option to a history sync server URL. Device sync can then handle the sync request creation, history synchronization, and updates across app installations.

You can run your own server or use a server managed and operated by [Ephemera](https://ephemerahq.com/), a steward of the development and adoption of XMTP:

- For development, use `https://message-history.dev.ephemera.network/` (default value set by XMTP SDKs)
- For production, use `https://message-history.production.ephemera.network`

## Trigger a manual sync

While device sync runs automatically, you can trigger a manual sync request, if needed.

:::code-group

```jsx [Browser]
await client.syncHistory();
```

```jsx [Node]
code sample needed
```

```jsx [React Native]
code sample needed
```

```kotlin [Kotlin]
code sample needed
```

```swift [Swift]
code sample needed
```

:::
