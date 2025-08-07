# Support archive-based backups

Support archive-based backups to give your users an easy and durable way to back up their XMTP conversations, messages, and consent preferences from one app installation and import them into another.

For example, a user can set up an archive-based backup for an app installation on their device. If they lose their device and get a new one, they can download and import their archive-based backup onto their new device.

When an archive-based backup is imported into an installation, **all imported conversations start off as inactive, with history visible and in read-only mode**. This is as intended by Messaging Layer Security (MLS), which ensures that there is no way to offer immediate access to active conversations. To protect the security of conversations, MLS requires that all new installations go through the process of being re-added as a member of a conversation. As such, all conversations will be inactive until the installation is added to the imported conversations by active members of the conversations.

To learn more, see [4. Handle post-import conversastion statuses](#4-handle-post-import-conversation-statuses).

Archive-based backups can be used as a more **deterministic and user-controlled** alternative to [history sync](/inboxes/history-sync).  To take this approach, set the `historySyncUrl` client option to an empty string.

This feature includes three core methods:

- `createArchive(path, encryptionKey, options?)`
- `archiveMetadata(path, encryptionKey)`
- `importArchive(path, encryptionKey)`

## 1. Create the archive

To enable a user to create an archive:

1. Create the archive file that will be used as the database backup.
2. Specify the archive file path (e.g., iCloud, Google Cloud, or your server).
3. Generate a 32-byte array encryption key to protect the archive contents. This ensures that other apps and devices cannot access the contents without the key. Securely store the key in a location that is easily accessible to the user.
4. Call `createArchive(path, encryptionKey, options?)` with the archive file path and the encryption key. Optionally, you can pass in the following:
   - Archive start and end time. If left blank, the archive will include all time.
   - Archive contents, which can be `Consent` or `Messages`. If left blank, the archive will include both.

    :::code-group

    ```tsx [React Native]
    createArchive(path: string, encryptionKey: string | Uint8Array, options?: {
      startTime?: Date,
      endTime?: Date,
      elements?: ("Consent" | "Messages")[]
    })
    ```

    ```kotlin [Kotlin]
    // Create an archive backup
    XMTPClient.createArchive(
        path = "/path/to/archive.xmtp",
        encryptionKey = encryptionKey,
        options = ArchiveOptions(
            startTime = startTime,
            endTime = endTime,
            elements = listOf(ArchiveElement.CONSENT, ArchiveElement.MESSAGES)
        )
    )
    ```

    ```swift [Swift]
    // Create an archive backup
    try await xmtp.createArchive(
        path: "/path/to/archive.xmtp",
        encryptionKey: encryptionKey,
        options: ArchiveOptions(
            startTime: startTime,
            endTime: endTime,
            elements: [.consent, .messages]
        )
    )
    ```

    :::

    This writes the selected content into the empty file and encrypts it using the provided key.

If the user tries to close the app before `createArchive` is complete, you can do a check to see if the file on the server is empty. If empty, display a warning to the user letting them know that exiting the app will cancel archive creation.

## 2. Check archive metadata

To enable a user to view information about their archive(s) before importing it to an app installation:

:::code-group

```tsx [React Native]
archiveMetadata(path: string, encryptionKey: string)
```

```kotlin [Kotlin]
// Get archive metadata
val metadata = XMTPClient.archiveMetadata(
    path = "/path/to/archive.xmtp",
    encryptionKey = encryptionKey
)
// metadata.startTime, metadata.endTime, metadata.elements, metadata.createdAt
```

```swift [Swift]
// Get archive metadata
let metadata = try await xmtp.archiveMetadata(
    path: "/path/to/archive.xmtp",
    encryptionKey: encryptionKey
)
// metadata.startTime, metadata.endTime, metadata.elements, metadata.createdAt
```

:::

This will return information that enables the user to better understand the archive(s) they want to import:

- Start and end time of archived data
- Archived elements (messages and/or consent)
- Archive creation date

You can get the archive file size from the file system.

### 3. Import the archive

To enable a user to import a selected archive to an installation:

:::code-group

```tsx [React Native]
importArchive(path: string, encryptionKey: string)
```

```kotlin [Kotlin]
// Import an archive backup
XMTPClient.importArchive(
    path = "/path/to/archive.xmtp",
    encryptionKey = encryptionKey
)
```

```swift [Swift]
// Import an archive backup
try await xmtp.importArchive(
    path: "/path/to/archive.xmtp",
    encryptionKey: encryptionKey
)
```

:::

This downloads and integrates the archive data into the app installation’s local database. The archive import is **additive**, not destructive: existing messages are preserved, and duplicate messages are ignored.

If the user tries to close the app before `importArchive` is complete, display a warning to the user letting them know that exiting the app will cancel the archive import.

### 4. Handle post-import conversation statuses

After importing the archive to an app installation, **all imported conversations will be inactive, with history visible and in read-only mode**, as intended by MLS as described earlier.

You should gray out UI functionality that involves network requests for inactive conversations.

Attempting to send or sync on inactive conversations will throw a `Group is inactive` error.

To check conversation status before initiating a network action:

:::code-group

```tsx [React Native]
conversation.isActive()
```

```kotlin [Kotlin]
// Check if the conversation is active
if (conversation.isActive()) {
    // Conversation is active, safe to send or sync
} else {
    // Conversation is inactive, show read-only UI
}
```

```swift [Swift]
// Check if the conversation is active
if conversation.isActive() {
    // Conversation is active, safe to send or sync
} else {
    // Conversation is inactive, show read-only UI
}
```

:::


This will check to see if the installation is actively in the conversation yet.

To reactivate a DM or group conversation:

- A participant, or a preexisting installation belonging to the user who ran the import, can add the new installation by sending a message to the conversation.
- For DM conversations, you may choose to programmatically create a duplicate DM for every inactive DM to trigger [stitching](/inboxes/push-notifs/understand-push-notifs#dm-stitching-considerations-for-push-notifications). This will activate the DM conversations.

Inactive conversations in which participants frequently send messages may seem to activate immediately.
