# Android SDK Documentation Gap Analysis

**SDK Repo:** https://github.com/xmtp/xmtp-android
**Docs Location:** `/docs/pages/chat-apps/`
**Analysis Date:** January 2026

---

## Summary

| Category | Documented | In SDK | Gap |
|----------|------------|--------|-----|
| Client methods | ~15 | ~35 | ~20 missing |
| Conversations methods | ~20 | ~30 | ~10 missing |
| Group methods | ~25 | ~45 | ~20 missing |
| DM methods | ~10 | ~30 | ~20 missing |
| Supporting classes | Partial | Complete | Several missing |

---

## Critical Gaps (High Priority)

### 1. Archive Operations (Not Documented)
The SDK supports encrypted archive import/export - not mentioned in docs at all.

**Missing methods:**
- `client.createArchive(path, encryptionKey, opts)` - Create encrypted backup
- `client.importArchive(path, encryptionKey)` - Restore from backup
- `client.archiveMetadata(path, encryptionKey)` - Read archive metadata
- `ArchiveOptions` data class
- `ArchiveMetadata` data class

**Recommendation:** Add new doc page: `core-messaging/backup-restore.mdx`

---

### 2. Fork Recovery (Not Documented)
New feature for handling MLS commit log forks.

**Missing:**
- `ForkRecoveryPolicy` enum (None, AllowlistedGroups, All)
- `ForkRecoveryOptions` data class
- `ClientOptions.forkRecoveryOptions` parameter
- `conversation.commitLogForkStatus()` method
- `ConversationDebugInfo.CommitLogForkStatus` enum

**Recommendation:** Add section to troubleshooting or advanced topics

---

### 3. Debug Information (Not Documented)
Debug APIs for troubleshooting.

**Missing methods:**
- `client.debugInformation` property
- `conversation.getDebugInformation()`
- `ConversationDebugInfo` class

**Recommendation:** Add to debug-your-app.mdx

---

### 4. Conversation Finding Methods (Partially Documented)

**Documented:**
- `findConversation(conversationId)`
- `findConversationByTopic(topic)`
- `findGroup(groupId)`
- `findDmByInboxId(inboxId)`

**Missing from docs:**
- `findDmByIdentity(publicIdentity)` - Find DM by public identity
- `findMessage(messageId)` - Find specific message
- `findEnrichedMessage(messageId)` - Find message with reactions

---

### 5. Group Creation with Custom Permissions (Not Documented)

**Documented:**
- `newGroup()` with `GroupPermissionPreconfiguration`

**Missing from docs:**
- `newGroupCustomPermissions(inboxIds, permissionPolicySet, ...)`
- `newGroupCustomPermissionsWithIdentities(identities, permissionPolicySet, ...)`
- `PermissionPolicySet` class
- Individual permission update methods:
  - `group.updateAddMemberPermission(newPermissionOption)`
  - `group.updateRemoveMemberPermission(newPermissionOption)`
  - `group.updateAddAdminPermission(newPermissionOption)`
  - `group.updateRemoveAdminPermission(newPermissionOption)`
  - `group.updateNamePermission(newPermissionOption)`
  - `group.updateDescriptionPermission(newPermissionOption)`
  - `group.updateImageUrlPermission(newPermissionOption)`
- `PermissionOption` enum
- `group.permissionPolicySet()` method

**Recommendation:** Expand group-permissions.mdx significantly

---

### 6. Message Visibility Options (Not Documented)

**Missing:**
- `MessageVisibilityOptions` data class
- `shouldPush` parameter for controlling push notifications per message
- Usage in `send()` and `prepareMessage()` methods

---

### 7. Last Read Times (Not Documented)

**Missing methods:**
- `conversation.getLastReadTimes()` - Returns `Map<InboxId, Long>`
- `group.getLastReadTimes()`
- `dm.getLastReadTimes()`

**Recommendation:** Add to new "Read Receipts" or message tracking section

---

### 8. Paused Conversations (Not Documented)

**Missing methods:**
- `conversation.pausedForVersion()` - Check if paused for protocol upgrade
- `group.pausedForVersion()`
- `dm.pausedForVersion()`

---

### 9. Key Package Status (Not Documented)

**Missing:**
- `Client.keyPackageStatusesForInstallationIds(installationIds, api)` - Check key package status
- `FfiKeyPackageStatus` enum/class

---

### 10. Newest Message Metadata (Not Documented)

**Missing:**
- `Client.getNewestMessageMetadata(groupIds, api)` - Batch get newest message info
- `MessageMetadata` type alias

---

## Medium Priority Gaps

### 11. Identity-Based Methods (Partially Documented)
SDK has parallel methods for both `InboxId` and `PublicIdentity`:

**Missing identity-based variants:**
- `conversations.newGroupWithIdentities(identities, ...)` - Use public identities
- `conversations.newConversationWithIdentity(peerPublicIdentity, ...)`
- `conversations.findOrCreateDmWithIdentity(peerPublicIdentity, ...)`
- `group.addMembersByIdentity(identities)` - Returns `GroupMembershipResult`
- `group.removeMembersByIdentity(identities)`

**Note:** Docs mostly show inbox ID variants only

---

### 12. GroupMembershipResult (Not Documented)

**Missing:**
- `GroupMembershipResult` class returned by `addMembers()` and `addMembersByIdentity()`
- Details on what information this provides

---

### 13. Streaming with onClose Callback (Partially Documented)

**Missing parameter documentation:**
- All stream methods accept `onClose: (() -> Unit)? = null` callback
- Not shown in examples

---

### 14. Message Filtering Options (Partially Documented)

**Documented:**
- Basic filtering by `afterNs`, `limit`, `deliveryStatus`
- `excludedContentTypes`
- `sortBy`

**Missing from docs:**
- `excludeSenderInboxIds` parameter - Filter out messages from specific senders
- Full parameter list for `messages()` method

---

### 15. Preferences Streaming (Partially Documented)

**Documented:**
- `client.preferences.streamConsent()`

**Missing:**
- `client.preferences.streamPreferenceUpdates()` - Returns `Flow<PreferenceType>`
- `PreferenceType` enum (HMAC_KEYS)
- `client.preferences.conversationState(groupId)` method

---

### 16. Conversation List Pagination (Partially Documented)

**Documented:**
- Basic `list()`, `listGroups()`, `listDms()`
- `consentState` filter
- `limit` parameter

**Missing parameters:**
- `createdAfterNs` / `createdBeforeNs`
- `lastActivityAfterNs` / `lastActivityBeforeNs`
- `orderBy` parameter (`ListConversationsOrderBy.CREATED_AT` vs `LAST_ACTIVITY`)

---

### 17. Database Management (Partially Documented)

**Documented:**
- `client.deleteLocalDatabase()`

**Missing:**
- `client.dropLocalDatabaseConnection()` - Temporarily drop connection
- `client.reconnectLocalDatabase()` - Reconnect after drop

---

### 18. Installation Signature Verification (Not Documented)

**Missing methods:**
- `client.signWithInstallationKey(message)` - Sign with installation key
- `client.verifySignature(message, signature)` - Verify signature
- `client.verifySignatureWithInstallationId(message, signature, installationId)` - Verify with specific installation

---

### 19. messagesWithReactions() Method (Not Documented)

**Missing:**
- `conversation.messagesWithReactions(...)` - Alternative to `enrichedMessages()`
- Difference between `enrichedMessages()` and `messagesWithReactions()`

---

### 20. Process Message Methods (Not Documented)

**Missing:**
- `conversations.processMessage(messageBytes)` - Process raw message bytes
- `conversation.processMessage(messageBytes)`
- `group.processMessage(messageBytes)`
- `dm.processMessage(messageBytes)`
- `conversations.fromWelcome(envelopeBytes)` - Create conversation from welcome

---

## Lower Priority Gaps

### 21. Push Topics Methods
**Missing:**
- `conversations.allPushTopics()` - Get all topics for push
- `conversation.getPushTopics()` - Get topics for specific conversation

---

### 22. Peer Inbox IDs
**Missing:**
- `group.peerInboxIds()` - Get all peer inbox IDs in group
- `dm.peerInboxId` - Property for DM peer

---

### 23. Group Creator Methods
**Missing:**
- `group.isCreator()` - Check if current user is creator
- `dm.isCreator()` - Check if current user created DM
- `dm.creatorInboxId()` - Get DM creator

---

### 24. Logging API Details
**Partially documented but missing:**
- `Client.deactivatePersistentLibXMTPLogWriter()`
- `Client.getXMTPLogFilePaths(appContext)`
- `Client.clearXMTPLogs(appContext)`

---

### 25. Topic Class
**Missing:**
- `Topic` sealed class
- `Topic.userWelcome(installationId)`
- `Topic.groupMessage(groupId)`

---

### 26. libXMTP Version
**Missing:**
- `client.libXMTPVersion` property

---

### 27. deleteMessageLocally (Conversations level)
**Missing:**
- `conversations.deleteMessageLocally(messageId)` - Delete from local DB only

---

## Documentation Accuracy Issues

### 1. Deprecated APIs Still Documented
The docs show synchronous property access which is deprecated:
- `group.name` → Should use `group.name()` suspend function
- `group.description` → Should use `group.description()` suspend function
- `group.imageUrl` → Should use `group.imageUrl()` suspend function
- `group.appData` → Should use `group.appData()` suspend function
- `conversation.disappearingMessageSettings` → Should use suspend function
- `conversation.isDisappearingMessagesEnabled` → Should use suspend function

**Recommendation:** Update all examples to use suspend function variants

### 2. SendOptions.ephemeral is Deprecated
Docs may reference `ephemeral` parameter which is deprecated.

### 3. syncConsent() is Deprecated
**Deprecated:** `client.preferences.syncConsent()`
**Use instead:** `client.preferences.sync()`

---

## Recommended Documentation Updates

### New Pages to Create
1. **backup-restore.mdx** - Archive operations
2. **advanced-permissions.mdx** - Custom permission policies
3. **fork-recovery.mdx** - Handling commit log forks (advanced)

### Pages to Significantly Update
1. **group-permissions.mdx** - Add custom permissions, individual permission updates
2. **list-messages.mdx** - Add all filtering parameters, `messagesWithReactions()`
3. **list.mdx** - Add all pagination parameters
4. **manage-inboxes.mdx** - Add signature verification methods
5. **debug-your-app.mdx** - Add debug information APIs

### Pages Needing Minor Updates
1. **create-conversations.mdx** - Add identity-based creation methods
2. **send-messages.mdx** - Add `MessageVisibilityOptions`
3. **sync-and-syncall.mdx** - Add database connection management
4. **android-pn.mdx** - Add all push topics methods

---

## SDK Version Note
This analysis is based on the latest SDK from the main branch. Some APIs may be:
- Recently added and not yet stable
- Marked as `@DelicateApi` for advanced use cases
- Internal APIs exposed publicly but not intended for general use

Review the SDK's CHANGELOG and release notes for stable API guidance.
