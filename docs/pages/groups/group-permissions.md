# Handle group chat permissions

Robust group chat permissions are key to providing users with a friendly and safe group chat experience.

These are the current permissions allowed for a group:

- Add member
- Remove member
- Update metadata
- Add admin
- Remove admin
- Update permissions

## Permission options

These are the permission options available for each permission:

- Unspecified
- Allow
- Deny
- Allow if admin or super admin
- Allow if super admin

You can list, add, and remove members from a group chat. Only the group chat creator (super admin) has permission to add or remove members. This restriction ensures that only authorized individuals can modify the participant list.

## Manage group chat admins

There are two kinds of administrators: super admins and admins. The group creator starts as a super admin, who has the most permissions so that a normal admin cannot remove the creator or destroy a group.

Here's an overview of how group chat admin statuses work:

- Everyone in a group chat is a member.
- A member can be granted admin or super admin status.  
If the member's admin or super admin status is removed, they are still a member of the group chat. 
- By default, only a member with super admin can add and remove admin and super admin statuses.  
Also by default, the group creator is the only member with super admin status.

:::info

By design, checking admin permission status by wallet address is not supported. Instead, look up the `inboxID` for that wallet address, then use the calls below.

:::

### Check if inbox ID is an admin

:::code-group

```jsx [JavaScript]
// Assume group is an existing group chat object for client
const isAdmin = await.group.isAdmin(adminClient.inboxID)
```

```kotlin [Kotlin]
//Assume group is an existing group chat object for client
val isInboxIDAdmin = group.isAdmin(inboxId)
```

```swift [Swift]
// Assume group is an existing group chat object for client
try group.isAdmin(client.inboxID)
```

```tsx [Node]
// this API is experimental and may change in the future

const isAdmin = group.isAdmin(inboxId);
```

:::

### Check if inbox ID is a super admin

:::code-group

```jsx [JavaScript]
//Assume group is an existing group chat object for client
const isSuperAdmin = await group.isSuperAdmin(client.inboxID)
```

```kotlin [Kotlin]
//Assume group is an existing group chat object for client
val isInboxIDSuperAdmin = group.isSuperAdmin(inboxId)
```

```swift [Swift]
try group.isSuperAdmin(inboxid: inboxID)
```

```tsx [Node]
// this API is experimental and may change in the future

const isSuperAdmin = group.isSuperAdmin(inboxId);
```

:::

### List admins

:::code-group

```jsx [JavaScript]
await group.listAdmins()
```

```kotlin [Kotlin]
// Returns a list of inboxIds of Admins
group.listAdmins()
```

```swift [Swift]
try group.listAdmins()
```

```tsx [Node]
Code sample coming soon
```

:::

### List super admins

:::code-group

```jsx [JavaScript]
await group.listSuperAdmins()
```

```kotlin [Kotlin]
// Returns a list of inboxIds of Super Admins
group.listSuperAdmins()
```

```swift [Swift]
try group.listSuperAdmins()
```

```tsx [Node]
Code sample coming soon
```

:::

### Add admin status to inbox ID

:::code-group

```jsx [JavaScript]
await group.addAdmin(client.inboxID)
```

```kotlin [Kotlin]
group.addAdmin(inboxId)
```

```swift [Swift]
try await group.addAdmin(inboxid: inboxID)
```

```tsx [Node]
Code sample coming soon
```

:::

### Add super admin status to inbox ID

:::code-group

```jsx [JavaScript]
await group.addSuperAdmin(client.inboxID)
```

```kotlin [Kotlin]
group.addSuperAdmin(inboxId)
```

```swift [Swift]
try await group.addSuperAdmin(inboxid: inboxID)
```

```tsx [Node]
Code sample coming soon
```

:::

### Remove admin status from inbox ID

:::code-group

```jsx [JavaScript]
await group.removeAdmin(client.inboxID)
```

```kotlin [Kotlin]
group.removeAdmin(inboxId)
```

```swift [Swift]
try await group.removeAdmin(inboxid: inboxid)
```

```tsx [Node]
Code sample coming soon
```

:::

### Remove super admin status from inbox ID

:::code-group

```jsx [JavaScript]
await group.removeSuperAdmin(client.inboxId)
```

```kotlin [Kotlin]
group.removeSuperAdmin(inboxId)
```

```swift [Swift]
try await group.removeSuperAdmin(inboxid: inboxID)
```

```tsx [Node]
Code sample coming soon
```

:::

## Manage group chat membership

### Add members by inbox ID

:::code-group

```jsx [JavaScript]
await group.addMemberInboxIds([inboxId]);
```

```kotlin [Kotlin]
group.addMembersByInboxIds(listOf(client.inboxId))
```

```swift [Swift]
try await group.addMembersByInboxId(inboxIds: [inboxId])
```

```tsx [Node]
// this API is experimental and may change in the future

await group.addMembers([inboxId]);
```

:::

### Add members by address

:::code-group

```jsx [JavaScript]
await group.addMembers([walletAddress]);
```

```kotlin [Kotlin]
group.addMembers(listOf(walletAddress))
```

```swift [Swift]
try await group.addMembers(addresses: [walletAddress])
```

```tsx [Node]
// this API is experimental and may change in the future

await group.addMembers([walletAddress]);
```

:::


### Remove members by inbox ID

:::code-group

```jsx [JavaScript]
await group.removeMemberInboxIds([inboxId]);
```

```kotlin [Kotlin]
group.removeMemberInboxIds(listOf(inboxId))
```

```swift [Swift]
try await group.removeMemberInboxIds(inboxIds: [inboxId])
```

```tsx [Node]
// this API is experimental and may change in the future

await group.removeMembers([inboxId]);
```

:::

### Remove members by address

:::code-group

```jsx [JavaScript]
await group.removeMembers([walletAddress]);
```

```kotlin [Kotlin]
group.removeMembers(listOf(walletAddress))
```

```swift [Swift]
try await group.removeMembers(addresses: [walletAddress])
```

```tsx [Node]
// this API is experimental and may change in the future

await group.removeMembers([walletAddress]);
```

:::

### Get inbox IDs for members

:::code-group

```jsx [JavaScript]
await group.memberInboxIds()
```

```kotlin [Kotlin]
val members = group.members()
val inboxIds = members.map { it.inboxId }

OR

val inboxId = client.inboxIdFromAddress(peerAddress)
```

```swift [Swift]
let members = try group.members.map(\.inboxId).sorted()

OR

try await client.inboxIdFromAddress(address: peerAddress)
```

```tsx [Node]
Code sample coming soon
```

:::

### Get addresses for members

:::code-group

```jsx [JavaScript]
const members = await group.members()
const addresses = members.map(member => member.addresses)
```

```kotlin [Kotlin]
val members = group.members()
val addresses = members.map { it.addresses }
```

```swift [Swift]
let peerMembers = try Conversation.group(group).peerAddresses.sorted()
```

```tsx [Node]
// this API is experimental and may change in the future
// sync group first

await group.sync();
const members = group.members;
```

:::

### Get the inbox ID that added the current member

:::code-group

```jsx [JavaScript]
// this API is experimental and may change in the future

const addedByInboxId =await group.addedByInboxId();
```

```kotlin [Kotlin]
val addedByAddress = group.addedByInboxId();
```

```swift [Swift]
try await group.addedByInboxId();
```

```tsx [Node]
// this API is experimental and may change in the future

const addedByInboxId = await group.addedByInboxId;
```

:::