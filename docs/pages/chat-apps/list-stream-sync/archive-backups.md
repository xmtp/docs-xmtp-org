# Support archive-based backups

Support archive-based backups to give your users an easy and durable way to back up their XMTP conversations, messages, and consent preferences from one app installation and import them into another.

For example, a user can set up an archive-based backup for an app installation on their device. If they lose their device and get a new one, they can download and import their archive-based backup onto their new device.

When an archive-based backup is imported into an installation, **all imported conversations start off as inactive, with history visible and in read-only mode**. This is as intended by Messaging Layer Security (MLS), which ensures that there is no way to join a conversation without the permission of an existing member. As such, imported conversations will be inactive until the new installation is added to the conversation by an active member. This process happens invisibly and automatically as other members of the group come online and send or receive messages.

To learn more, see [4. Handle post-import conversation statuses](#4-handle-post-import-conversation-statuses).

This feature includes three core methods:

- `createArchive(path, encryptionKey, options?)`
- `archiveMetadata(path, encryptionKey)`
- `importArchive(path, encryptionKey)`

## 1. Create the archive

To enable a user to create an archive:

1. Specify the archive file path (e.g., iCloud, Google Cloud, or your server). Ensure the parent folder already exists.
2. Generate a 32-byte array encryption key to protect the archive contents. This ensures that other apps and devices cannot access the contents without the key. Securely store the key in a location that is secure, independent of the archive file, and will persist after your app has been uninstalled. A common place to store this encryption key is the iCloud Keychain.
3. Call `createArchive(path, encryptionKey, options?)` with the archive file path and the encryption key. Optionally, you can pass in the following:
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

   This writes the selected content into the specified file location and encrypts it using the provided key.

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

## 3. Import the archive

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

## 4. Handle post-import conversation statuses

After importing the archive to an app installation, **all imported conversations will be inactive, with history visible and in read-only mode**, as intended by MLS as described earlier.

You should gray out UI functionality that involves writing to or modifying inactive conversations.

Attempting to send or sync on inactive conversations will throw a `Group is inactive` error.

To check conversation status before initiating a network action:

:::code-group

```tsx [React Native]
conversation.isActive();
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

- A participant, or a preexisting installation belonging to the user who ran the import, will automatically add the new installation when sending a message to the conversation or calling `conversation.sync`. In some cases, it may take up to 30 minutes for other devices to recognize the new installation.
- For DM conversations, you may choose to programmatically create a duplicate DM for every inactive DM to trigger [stitching](/chat-apps/push-notifs/understand-push-notifs#dm-stitching-considerations-for-push-notifications). This will activate the DM conversations.

Inactive conversations in which participants frequently send messages may seem to activate immediately.

## Archive-based backups vs History Sync

Archive-based backups and History Sync serve similar purposes: helping you restore messages on new devices. When should you use one or the other?

- If your users sign in using wallets or passkeys shared by multiple chat apps provided by different developers, use [History Sync](/chat-apps/list-stream-sync/history-sync) to allow them to synchronize their messages when they install a new app.
- If your goal is to synchronize a user's message history across multiple devices that will be used at the same time, [History Sync](/chat-apps/list-stream-sync/history-sync) may be a better fit. Especially if those devices are on different platforms (an Android tablet and an iOS app).
- If your goal is to maintain message history when a user upgrades or replaces their device, use archive-based backups.
- If your goal is to allow users to export their data into the storage platform of their choosing, use archive-based backups.

## FAQ about archive-based backups

### What backup frequency options should I offer users?

Consider providing backup frequency options based on patterns in common chat apps:

- **Never** - For users who prefer manual control
- **Daily** - For active users (automatically at a quiet time like 2 AM)
- **Weekly** - For moderate users (for example, every Sunday)
- **Monthly** - For light users (for example, first day of each month)

You might also offer **manual backup** that enables users to create backups on demand

### How often should users create backups?

The frequency of archive creation depends on your users' messaging patterns and risk tolerance:

For most users:

- Weekly or monthly automated backups work well for regular message activity
- Consider creating archives after important conversations or when users receive many messages

For power users:

- Daily automated backups for users who send/receive many messages
- Allow manual backup creation before important events (travel, device changes)

Backup triggers to consider:

- Time-based: Daily, weekly, or monthly schedules
- Activity-based: After a certain number of new messages (for example, every 100 messages)
- Event-based: Before OS updates, app updates, or when users plan to switch devices

### Should users keep multiple backups?

Consider enabling users to maintain multiple backups:

- Keep the last 3-5 archives to provide recovery options if one archive becomes corrupted
- Implement automatic cleanup of old archives to manage storage space
- Allow users to name archives (for example, "Before iOS update" or "Monthly backup - Jan 2024") for easier identification

### How should I handle archive storage locations?

Follow patterns established by common chat apps:

- iCloud
- Google Drive
- User's preferred cloud service
- Your servers

### Should I automatically prompt users to create archives?

Consider gentle prompts similar to common chat apps:

- After app installation: Suggest setting up automated backups during onboarding
- Periodic reminders: Monthly prompts for users who haven't created recent archives (avoid being pushy)
- Before major events: Prompt before app updates or when users haven't backed up in a while
- Smart detection: Suggest backups when users have many new active conversations

### How do I help users understand archive limitations?

Be transparent about the post-import experience:

- Explain read-only mode: Let users know that imported conversations start as read-only
- Set expectations: Explain the reactivation process and that reactivation happens automatically but may take time
- Provide progress indicators: Show users when conversations become active again
