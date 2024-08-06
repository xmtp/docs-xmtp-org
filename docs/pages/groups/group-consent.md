# Handle user consent in group chat

With XMTP, in addition to permissions that enable members to add and remove members, user consent preferences also apply.

[User consent preferences](https://xmtp.org/consent) enable you to give a user the option to allow or deny contact from a group ID, inbox ID, or address.

For example, your app can check `inboxId` values using the `isInboxIdAllowed()` or `isInboxIdDenied()` functions. Then, based on your app's design and the user's settings, your app can determine how and whether a group chat and message should be displayed for a user.

To learn more, see [Spam Protection](https://github.com/xmtp/xmtp-dot-org/blob/678ec45d3c4d85ae304314685ed88f26cb7d4506/docs/v3/group-chat.md#spam-protection).

To learn how to allow and deny contact by address, see [Universal allow/block preferences](https://xmtp.org/consent#enable-user-consent-preferences).

To learn how to keep user consent preferences synchronized, see [Synchronize user consent preferences](https://xmtp.org/consent#synchronize-user-consent-preferences).

## Allow or deny contact by wallet in group chat

:::code-group

```jsx [JavaScript]
// Allow
await contact.allow([walletAddress]);

// Deny
await contact.deny([walletAddress]);
```

```kotlin [Kotlin]
Code sample coming soon
```

```swift [Swift]
// Allow
try await contact.allowInboxes(inboxIDs: [inboxID])
```

```tsx [Node]
Code sample coming soon
```

:::

## Allow or deny contact by inbox ID in group chat

:::code-group

```jsx [JavaScript]
// Allow
await contact.allowGroup([groupId]);

// Deny
await contact.denyGroup([groupId]);
```

```kotlin [Kotlin]
// Allow
contacts.allowInboxes(listOf(inboxID))

// Deny
contacts.denyInboxes(listOf(inboxID))
```

```swift [Swift]
// Allow
try await contact.allowInboxes(inboxIds: [inboxID])

//Deny
try await contact.denyInboxes(inboxIds: [inboxID])
```

```tsx [Node]
Code sample coming soon
```

:::

## Allow or deny contact by group chat ID

:::code-group

```jsx [JavaScript]
// Allow group
await contact.allowGroup([groupId]);

// Deny a group
await contact.denyGroup([groupId]);
```

```kotlin [Kotlin]
// Allow
contact.allowGroups(listOf(group.id))

// Deny
contact.denyGroups(listOf(group.id))
```

```swift [Swift]
Code sample coming soon
```

```tsx [Node]
Code sample coming soon
```

:::

## Allow or deny contact from inbox ID

Enable a user to explicitly allow or deny contact from an inbox ID.

:::code-group

```jsx [JavaScript]
// Allow
await client.contacts.allowInboxes([client.inboxId])

// Deny
await client.contacts.denyInboxes([client.inboxId])
```

```kotlin [Kotlin]
// Allow
client.contacts.allowInboxes(listOf(client.inboxID))

// Deny
client.contacts.denyInboxes(listOf(client.inboxID))
```

```swift [Swift]
// Allow
try await client.contacts.allowInboxes(inboxIds: [client.inboxID])

// Deny
try await client.contacts.denyInboxes(inboxIds: [client.inboxID])
```

```tsx [Node]
Code sample coming soon
```

:::

## Check consent for group chat ID

Check if contact from a group chat ID is allowed or denied for a user.

:::code-group

```jsx [JavaScript]
// Check if contact by a group is allowed for a member
const isAllowed = await group.isGroupAllowed(groupId);

// Check if contact by a group is denied for a member
const isDenied = await group.isGroupDenied(groupId);
```

```kotlin [Kotlin]
contact.isGroupAllowed(group.id)
```

```swift [Swift]
await contact.isGroupAllowed(groupId: groupID)
```

```tsx [Node]
Code sample coming soon
```

:::

## Check consent for inbox ID

Check if contact from an inbox ID is allowed or denied for a user.

:::code-group

```jsx [JavaScript]
await client.contacts.isInboxAllowed(client.inboxId)
```

```kotlin [Kotlin]
contacts.isInboxAllowed(client.inboxId)
```

```swift [Swift]
await contact.isInboxAllowed(inboxId: client.inboxID)
```

```tsx [Node]
Code sample coming soon
```

:::