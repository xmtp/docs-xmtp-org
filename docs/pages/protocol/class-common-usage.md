## Common class usage patterns

When working with these classes:

### Client

Gateway to all XMTP functionality
Contains the conversations, and messages
Handles encryption and decryption of messages

### Conversations

Central interface for managing all conversations
Use sync() before accessing local conversation data
Use streamAllMessages() to listen for new messages in real-time
Create conversations with newDm(), newGroup(), etc.

### Dm

Access the peer using conversation.peerInboxId
Create new DMs with client.conversations.newDm(inboxId)
Send messages with dm.send(content)

### Group

Get members with await group.members(); (this works for DMs too)
Manage group metadata with updateName(), updateDescription(), etc.
Add/remove members with addMembers() and removeMembers()
Manage permissions with admin methods: addAdmin(), addSuperAdmin(), etc.
Check permissions with isAdmin() and isSuperAdmin()

### GroupMember

Use member.inboxId to identify members
Access Ethereum addresses through member.accountIdentifiers
Access installation IDs through member.installationIds
Check permission level with member.permissionLevel
Verify consent state with member.consentState
