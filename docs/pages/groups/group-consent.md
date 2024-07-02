# Handle user consent in group chat

With XMTP, in addition to permissions that enable members to add and remove members, user consent preferences also apply.

[User consent preferences](https://xmtp.org/consent) enable you to give a user the option to allow or deny contact from a group ID, inbox ID, or address.

For example, your app can check `inboxId` values using the `isInboxIdAllowed()` or `isInboxIdDenied()` functions. Then, based on your app's design and the user's settings, your app can determine how and whether a group chat and message should be displayed for a user.

To learn more, see [Spam Protection](https://github.com/xmtp/xmtp-dot-org/blob/678ec45d3c4d85ae304314685ed88f26cb7d4506/docs/v3/group-chat.md#spam-protection).

To learn how to allow and deny contact by address, see [Universal allow/block preferences](https://xmtp.org/consent#enable-user-consent-preferences).

To learn how to keep user consent preferences synchronized, see [Synchronize user consent preferences](https://xmtp.org/consent#synchronize-user-consent-preferences).

### Allow or deny contact by wallet in group chat

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
// Allow
await contact.allow([walletAddress]);

// Deny
await contact.deny([walletAddress]);
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
Code sample coming soon
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
// Allow
try await contact.allowInboxes(inboxIDs: [inboxID])
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
Code sample coming soon
```

</TabItem>
</Tabs>

### Allow or deny contact by inbox ID in group chat

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
// Allow
await contact.allowGroup([groupId]);

// Deny
await contact.denyGroup([groupId]);
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
// Allow
contacts.allowInboxes(listOf(inboxID))

// Deny
contacts.denyInboxes(listOf(inboxID))
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
// Allow
try await contact.allowInboxes(inboxIds: [inboxID])

//Deny
try await contact.denyInboxes(inboxIds: [inboxID])
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
Code sample coming soon
```

</TabItem>
</Tabs>

### Allow or deny contact by group chat ID

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
// Allow group
await contact.allowGroup([groupId]);

// Deny a group
await contact.denyGroup([groupId]);
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
// Allow
contact.allowGroups(listOf(group.id))

// Deny
contact.denyGroups(listOf(group.id))
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
Code sample coming soon
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
Code sample coming soon
```

</TabItem>
</Tabs>

### Allow or deny contact from inbox ID

Enable a user to explicitly allow or deny contact from an inbox ID.

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
// Allow
await client.contacts.allowInboxes([client.inboxId])

// Deny
await client.contacts.denyInboxes([client.inboxId])

```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
// Allow
client.contacts.allowInboxes(listOf(client.inboxID))

// Deny
client.contacts.denyInboxes(listOf(client.inboxID))
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
// Allow
try await client.contacts.allowInboxes(inboxIds: [client.inboxID])

// Deny
try await client.contacts.denyInboxes(inboxIds: [client.inboxID])
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
Code sample coming soon
```

</TabItem>
</Tabs>

### Check consent for group chat ID

Check if contact from a group chat ID is allowed or denied for a user.

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
// Check if contact by a group is allowed for a member
const isAllowed = await group.isGroupAllowed(groupId);

// Check if contact by a group is denied for a member
const isDenied = await group.isGroupDenied(groupId);
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
contact.isGroupAllowed(group.id)
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
await contact.isGroupAllowed(groupId: groupID)
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
Code sample coming soon
```

</TabItem>
</Tabs>

### Check consent for inbox ID

Check if contact from an inbox ID is allowed or denied for a user.

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
await client.contacts.isInboxAllowed(client.inboxId)
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
contacts.isInboxAllowed(client.inboxId)
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
await contact.isInboxAllowed(inboxId: client.inboxID)
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
Code sample coming soon
```

</TabItem>
</Tabs>