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

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
// Assume group is an existing group chat object for client
const isAdmin = await.group.isAdmin(adminClient.inboxID)
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
//Assume group is an existing group chat object for client
val isInboxIDAdmin = group.isAdmin(inboxId)
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
// Assume group is an existing group chat object for client
try group.isAdmin(client.inboxID)
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
// this API is experimental and may change in the future

const isAdmin = group.isAdmin(inboxId);
```

</TabItem>
</Tabs>

### Check if inbox ID is a super admin

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
//Assume group is an existing group chat object for client
const isSuperAdmin = await group.isSuperAdmin(client.inboxID)
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
//Assume group is an existing group chat object for client
val isInboxIDSuperAdmin = group.isSuperAdmin(inboxId)
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>


```swift
try group.isSuperAdmin(inboxid: inboxID)
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
// this API is experimental and may change in the future

const isSuperAdmin = group.isSuperAdmin(inboxId);
```

</TabItem>
</Tabs>

### List admins

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
await group.listAdmins()
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
// Returns a list of inboxIds of Admins
group.listAdmins()
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
try group.listAdmins()
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
Code sample coming soon
```

</TabItem>
</Tabs>

### List super admins

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
await group.listSuperAdmins()
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
// Returns a list of inboxIds of Super Admins
group.listSuperAdmins()
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
try group.listSuperAdmins()
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
Code sample coming soon
```

</TabItem>
</Tabs>

### Add admin status to inbox ID

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
await group.addAdmin(client.inboxID)
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
group.addAdmin(inboxId)
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
try await group.addAdmin(inboxid: inboxID)
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
Code sample coming soon
```

</TabItem>
</Tabs>

### Add super admin status to inbox ID

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
await group.addSuperAdmin(client.inboxID)
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
group.addSuperAdmin(inboxId)
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
try await group.addSuperAdmin(inboxid: inboxID)
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
Code sample coming soon
```

</TabItem>
</Tabs>

### Remove admin status from inbox ID

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
await group.removeAdmin(client.inboxID)
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
group.removeAdmin(inboxId)
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
try await group.removeAdmin(inboxid: inboxid)
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
Code sample coming soon
```

</TabItem>
</Tabs>

### Remove super admin status from inbox ID

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
await group.removeSuperAdmin(client.inboxId)
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
group.removeSuperAdmin(inboxId)
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
try await group.removeSuperAdmin(inboxid: inboxID)
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
Code sample coming soon
```

</TabItem>
</Tabs>

## Manage group chat membership

### Add members by inbox ID

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
await group.addMemberInboxIds([inboxId]);
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
group.addMembersByInboxIds(listOf(client.inboxId))
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
try await group.addMembersByInboxId(inboxIds: [inboxId])
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
// this API is experimental and may change in the future

await group.addMembers([inboxId]);
```

</TabItem>
</Tabs>

### Add members by address

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
await group.addMembers([walletAddress]);
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
group.addMembers(listOf(walletAddress))
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
try await group.addMembers(addresses: [walletAddress])
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
// this API is experimental and may change in the future

await group.addMembers([walletAddress]);
```

</TabItem>
</Tabs>


### Remove members by inbox ID

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
await group.removeMemberInboxIds([inboxId]);
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
group.removeMemberInboxIds(listOf(inboxId))
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
try await group.removeMemberInboxIds(inboxIds: [inboxId])
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
// this API is experimental and may change in the future

await group.removeMembers([inboxId]);
```

</TabItem>
</Tabs>

### Remove members by address

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
await group.removeMembers([walletAddress]);
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
group.removeMembers(listOf(walletAddress))
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```kotlin
try await group.removeMembers(addresses: [walletAddress])
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
// this API is experimental and may change in the future

await group.removeMembers([walletAddress]);
```

</TabItem>
</Tabs>

### Get inbox IDs for members

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
await group.memberInboxIds()
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
val members = group.members()
val inboxIds = members.map { it.inboxId }

OR

val inboxId = client.inboxIdFromAddress(peerAddress)
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
let members = try group.members.map(\.inboxId).sorted()

OR

try await client.inboxIdFromAddress(address: peerAddress)
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
Code sample coming soon
```

</TabItem>
</Tabs>

### Get addresses for members

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
const members = await group.members()
const addresses = members.map(member => member.addresses)
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
val members = group.members()
val addresses = members.map { it.addresses }
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
let peerMembers = try Conversation.group(group).peerAddresses.sorted()
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
// this API is experimental and may change in the future
// sync group first

await group.sync();
const members = group.members;
```

</TabItem>
</Tabs>

### Get the inbox ID that added the current member

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
// this API is experimental and may change in the future

const addedByInboxId =await group.addedByInboxId();
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
val addedByAddress = group.addedByInboxId();
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
try await group.addedByInboxId();
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
// this API is experimental and may change in the future

const addedByInboxId = await group.addedByInboxId;
```

</TabItem>
</Tabs>