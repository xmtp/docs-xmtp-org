# Enable history sync for apps built with XMTP

Enable the history sync feature to give your users a way to sync decrypted historical data from an existing app installation to a new app installation.

This historical data includes:

- Conversations
- Conversation messages
- Consent state

History sync enables your users pick up conversations where they left off, regardless of the app installation they use. All they need is an existing app installation to provide the data.

## Enable history sync

History sync is enabled by default. When [creating a client](/inboxes/build-inbox#create-an-xmtp-client), the `historySyncUrl` client option is dynamically set to a default history sync server URL based on your `env` client option setting.

- When `env` is set to `dev`, the `historySyncUrl` is set to `https://message-history.dev.ephemera.network/`
- When `env` is set to `production`, the `historySyncUrl` is set to `https://message-history.production.ephemera.network`

These default servers are managed and operated by [Ephemera](https://ephemerahq.com/), a steward of the development and adoption of XMTP.

You can choose to [run your own server](https://github.com/xmtp/xmtp-message-history-server) and set the `historySyncUrl` to your server's URL.

## Manually request syncs

While history sync runs automatically, you can manually request syncs, if needed.

### Sync history

Use this method to sync conversation, message, and consent state history.

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

### Sync consent

Use this method to sync consent state history.

:::code-group

```jsx [Browser]
code sample needed
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

### Sync messages

Use this method to sync message history.

:::code-group

```jsx [Browser]
code sample needed
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

## How history sync works

When your app initializes an XMTP client and a `historySyncUrl` client option is present, history sync automatically triggers an initial sync request, pulling all message history into the new app installation and merging it with the existing app installations in the sync group.

Ongoing updates to history are streamed automatically. Updates, whether for user consent preferences or messages, are sent across the sync group, ensuring all app installations have up-to-date information.

History syncs are accomplished using these components:

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
