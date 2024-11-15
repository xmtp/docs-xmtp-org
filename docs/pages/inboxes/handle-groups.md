# Set group chat permissions and metadata

## Handle group chat permissions

Robust group chat permissions are key to providing users with a friendly and safe group chat experience.

### Available permissions and options

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

### Manage group chat admins

There are two kinds of administrators: super admins and admins. The group creator starts as a super admin, who has the most permissions so that a normal admin cannot remove the creator or destroy a group.

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

#### Check if inbox ID is an admin

:::code-group

```js [Browser]
const isAdmin = group.isAdmin(inboxId);
```

```js [Node]
const isAdmin = group.isAdmin(inboxId);
```

```tsx [React Native]
// Assume group is an existing group chat object for client
const isAdmin = await.group.isAdmin(adminClient.inboxID);
```

```kotlin [Kotlin]
//Assume group is an existing group chat object for client
val isInboxIDAdmin = group.isAdmin(inboxId)
```

```swift [Swift]
// Assume group is an existing group chat object for client
try group.isAdmin(client.inboxID)
```

:::

#### Check if inbox ID is a super admin

:::code-group

```js [Browser]
const isSuperAdmin = group.isSuperAdmin(inboxId);
```

```js [Node]
const isSuperAdmin = group.isSuperAdmin(inboxId);
```

```tsx [React Native]
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

:::

#### List admins

:::code-group

```js [Browser]
const admins = group.admins;
```

```js [Node]
const admins = group.admins;
```

```tsx [React Native]
await group.listAdmins();
```

```kotlin [Kotlin]
// Returns a list of inboxIds of Admins
group.listAdmins()
```

```swift [Swift]
try group.listAdmins()
```

:::

#### List super admins

:::code-group

```js [Browser]
const superAdmins = group.superAdmins;
```

```js [Node]
const superAdmins = group.superAdmins;
```

```tsx [React Native]
await group.listSuperAdmins();
```

```kotlin [Kotlin]
// Returns a list of inboxIds of Super Admins
group.listSuperAdmins()
```

```swift [Swift]
try group.listSuperAdmins()
```

:::

#### Add admin status to inbox ID

:::code-group

```js [Browser]
await group.addAdmin(inboxId);
```

```js [Node]
await group.addAdmin(inboxId);
```

```tsx [React Native]
await group.addAdmin(client.inboxID);
```

```kotlin [Kotlin]
group.addAdmin(inboxId)
```

```swift [Swift]
try await group.addAdmin(inboxid: inboxID)
```

:::

#### Add super admin status to inbox ID

:::code-group

```js [Browser]
await group.addSuperAdmin(inboxId);
```

```js [Node]
await group.addSuperAdmin(inboxId);
```

```tsx [React Native]
await group.addSuperAdmin(client.inboxID);
```

```kotlin [Kotlin]
group.addSuperAdmin(inboxId)
```

```swift [Swift]
try await group.addSuperAdmin(inboxid: inboxID)
```

:::

#### Remove admin status from inbox ID

:::code-group

```js [Browser]
await group.removeAdmin(inboxId);
```

```js [Node]
await group.removeAdmin(inboxId);
```

```tsx [React Native]
await group.removeAdmin(client.inboxID);
```

```kotlin [Kotlin]
group.removeAdmin(inboxId)
```

```swift [Swift]
try await group.removeAdmin(inboxid: inboxid)
```

:::

#### Remove super admin status from inbox ID

:::code-group

```js [Browser]
await group.removeSuperAdmin(inboxId);
```

```js [Node]
await group.removeSuperAdmin(inboxId);
```

```tsx [React Native]
await group.removeSuperAdmin(client.inboxId);
```

```kotlin [Kotlin]
group.removeSuperAdmin(inboxId)
```

```swift [Swift]
try await group.removeSuperAdmin(inboxid: inboxID)
```

:::

### Manage group chat membership

#### Add members by inbox ID

:::code-group

```js [Browser]
await group.addMembersByInboxId([inboxId]);
```

```js [Node]
await group.addMembersByInboxId([inboxId]);
```

```tsx [React Native]
await group.addMemberInboxIds([inboxId]);
```

```kotlin [Kotlin]
group.addMembersByInboxIds(listOf(client.inboxId))
```

```swift [Swift]
try await group.addMembersByInboxId(inboxIds: [inboxId])
```

:::

#### Add members by address

:::code-group

```js [Browser]
await group.addMembers([walletAddress]);
```

```js [Node]
await group.addMembers([walletAddress]);
```

```tsx [React Native]
await group.addMembers([walletAddress]);
```

```kotlin [Kotlin]
group.addMembers(listOf(walletAddress))
```

```swift [Swift]
try await group.addMembers(addresses: [walletAddress])
```

:::

#### Remove members by inbox ID

:::code-group

```js [Browser]
await group.removeMembersByInboxId([inboxId]);
```

```js [Node]
await group.removeMembersByInboxId([inboxId]);
```

```tsx [React Native]
await group.removeMemberInboxIds([inboxId]);
```

```kotlin [Kotlin]
group.removeMemberInboxIds(listOf(inboxId))
```

```swift [Swift]
try await group.removeMemberInboxIds(inboxIds: [inboxId])
```

:::

#### Remove members by address

:::code-group

```js [Browser]
await group.removeMembers([walletAddress]);
```

```js [Node]
await group.removeMembers([walletAddress]);
```

```tsx [React Native]
await group.removeMembers([walletAddress]);
```

```kotlin [Kotlin]
group.removeMembers(listOf(walletAddress))
```

```swift [Swift]
try await group.removeMembers(addresses: [walletAddress])
```

:::

#### Get inbox IDs for members

:::code-group

```js [Browser]
const inboxId = await client.findInboxIdByAddress(address);
```

```js [Node]
const inboxId = await client.getInboxIdByAddress(address);
```

```tsx [React Native]
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

:::

#### Get addresses for members

:::code-group

```js [Browser]
// sync group first
await group.sync();

// get group members
const members = await group.members();

// map inbox ID to account addresses
const inboxIdAddressMap = new Map(
  members.map((member) => [member.inboxId, member.accountAddresses])
);
```

```js [Node]
// sync group first
await group.sync();

// get group members
const members = group.members;

// map inbox ID to account addresses
const inboxIdAddressMap = new Map(
  members.map((member) => [member.inboxId, member.accountAddresses])
);
```

```tsx [React Native]
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

:::

#### Get the inbox ID that added the current member

:::code-group

```js [Browser]
const addedByInboxId = group.addedByInboxId;
```

```js [Node]
const addedByInboxId = group.addedByInboxId;
```

```tsx [React Native]
// this API is experimental and may change in the future

const addedByInboxId = await group.addedByInboxId();
```

```kotlin [Kotlin]
val addedByAddress = group.addedByInboxId();
```

```swift [Swift]
try await group.addedByInboxId();
```

:::

### SDK method call flow to add and remove members

![Add and remove members](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/add-remove.png)

When you add or remove members from a group, a proposal/commit message is sent to all the installations in the group. When the commit happens, the cryptographic state of the group is changed. This allows new members to receive messages but not decrypt older ones and prevents removed members from decrypting messages after their departure.

## Handle group chat metadata

Group chats can have metadata, like names and images. Metadata can help users more easily identify their group chats. You can also set group chat metadata when [creating a group chat](/inboxes/build-inbox#create-a-new-group-chat).

### Get a group chat name

:::code-group

```js [Browser]
const groupName = group.name;
```

```js [Node]
const groupName = group.name;
```

```tsx [React Native]
const groupName = await group.groupName();
```

```kotlin [Kotlin]
group.name
```

```swift [Swift]
try group.groupname()
```

:::

### Update a group chat name

:::code-group

```js [Browser]
await group.updateName("New Group Name");
```

```js [Node]
await group.updateName("New Group Name");
```

```tsx [React Native]
await group.updateName("New Group Name");
```

```kotlin [Kotlin]
group.updateGroupName("New Group Name")
```

```swift [Swift]
try await group.updateGroupName(groupname: "New Group Name")
```

:::

### Get a group chat image URL

:::code-group

```js [Browser]
const groupImageUrl = group.imageUrl;
```

```js [Node]
const groupImageUrl = group.imageUrl;
```

```tsx [React Native]
const groupName = await group.imageUrlSquare();
```

```kotlin [Kotlin]
group.imageURLSquare
```

```swift [Swift]
try group.groupImageUrlSquare()
```

:::

### Update a group chat image URL

:::code-group

```js [Node]
await group.updateImageUrl("newurl.com");
```

```js [Node]
await group.updateImageUrl("newurl.com");
```

```tsx [React Native]
await group.updateImageUrlSquare("ImageURL");
```

```kotlin [Kotlin]
group.updateGroupImageUrlSquare("newurl.com")
```

```swift [Swift]
try await group.updateGroupImageUrlSquare(imageUrlSquare: "newurl.com")
```

:::
