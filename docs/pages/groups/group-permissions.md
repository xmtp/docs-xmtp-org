# Handle group chat permissions

Robust group chat permissions are key to providing users with a friendly and safe group chat experience.

## Available permissions and options

These are the permissions allowed for a group:

- Add member
- Remove member
- Update metadata
- Add admin
- Remove admin
- Update permissions

These are the permission options available for each permission:

- Unspecified
- Allow
- Deny
- Allow if admin or super admin
- Allow if super admin

You can list, add, and remove members from a group chat. Only the group chat creator (super admin) has permission to add or remove members. This restriction ensures that only authorized individuals can modify the participant list.

## Manage group chat admins

There are two kinds of administrators: super admins and admins. The group creator starts as a super admin, who has the most permissions so that a normal admin cannot remove the creator or destroy a group.

While group membership is inherent to the MLS group, administrators are specified through the group metadata. Updating the metadata is how you add or remove admins and specify who are admins versus super admins.

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

```jsx [React Native]
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

```jsx [React Native]
//Assume group is an existing group chat object for client
const isSuperAdmin = await group.isSuperAdmin(client.inboxID);
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

```jsx [React Native]
await group.listAdmins();
```

```kotlin [Kotlin]
// Returns a list of inboxIds of Admins
group.listAdmins()
```

```swift [Swift]
try group.listAdmins()
```

```tsx [Node]
// this API is experimental and may change in the future

const admins = group.admins;
```

:::

### List super admins

:::code-group

```jsx [React Native]
await group.listSuperAdmins();
```

```kotlin [Kotlin]
// Returns a list of inboxIds of Super Admins
group.listSuperAdmins()
```

```swift [Swift]
try group.listSuperAdmins()
```

```tsx [Node]
// this API is experimental and may change in the future

const superAdmins = group.superAdmins;
```

:::

### Add admin status to inbox ID

:::code-group

```jsx [React Native]
await group.addAdmin(client.inboxID);
```

```kotlin [Kotlin]
group.addAdmin(inboxId)
```

```swift [Swift]
try await group.addAdmin(inboxid: inboxID)
```

```tsx [Node]
// this API is experimental and may change in the future

await group.addAdmin(inboxId);
```

:::

### Add super admin status to inbox ID

:::code-group

```jsx [React Native]
await group.addSuperAdmin(client.inboxID);
```

```kotlin [Kotlin]
group.addSuperAdmin(inboxId)
```

```swift [Swift]
try await group.addSuperAdmin(inboxid: inboxID)
```

```tsx [Node]
// this API is experimental and may change in the future

await group.addSuperAdmin(inboxId);
```

:::

### Remove admin status from inbox ID

:::code-group

```jsx [React Native]
await group.removeAdmin(client.inboxID);
```

```kotlin [Kotlin]
group.removeAdmin(inboxId)
```

```swift [Swift]
try await group.removeAdmin(inboxid: inboxid)
```

```tsx [Node]
// this API is experimental and may change in the future

await group.removeAdmin(inboxId);
```

:::

### Remove super admin status from inbox ID

:::code-group

```jsx [React Native]
await group.removeSuperAdmin(client.inboxId);
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

```jsx [React Native]
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

await group.addMembersByInboxId([inboxId]);
```

:::

### Add members by address

:::code-group

```jsx [React Native]
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

```jsx [React Native]
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

await group.removeMembersByInboxId([inboxId]);
```

:::

### Remove members by address

:::code-group

```jsx [React Native]
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

```jsx [React Native]
await group.memberInboxIds();
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
// this API is experimental and may change in the future

const inboxId = await client.getInboxIdByAddress(address);
```

:::

### Get addresses for members

:::code-group

```jsx [React Native]
const members = await group.members();
const addresses = members.map((member) => member.addresses);
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

// get group members
const members = group.members;

// map inbox ID to account addresses
const inboxIdAddressMap = new Map(
  members.map((member) => [member.inboxId, member.accountAddresses]),
);
```

:::

### Get the inbox ID that added the current member

:::code-group

```jsx [React Native]
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
// note that this can only be done with the JS SDK (@xmtp/xmtp-js)

await client.contacts.allow([walletAddress]);
```

:::

## SDK method call flow to add and remove members

![Add and remove members](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/add-remove.png)

When you add or remove members from a group, a proposal/commit message is sent to all the installations in the group. When the commit happens, the cryptographic state of the group is changed. This allows new members to receive messages but not decrypt older ones and prevents removed members from decrypting messages after their departure.
