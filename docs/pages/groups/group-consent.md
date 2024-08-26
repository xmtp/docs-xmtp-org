# Handle user consent in group chat

In addition to permissions that enable designated members to add and remove members from a group chat, user consent preferences also apply.

User consent preferences enable a user to allow or deny contact from a group ID, inbox ID, or address in a group chat context.

For example, your app can check `inboxId` values using the `isInboxIdAllowed()` or `isInboxIdDenied()` functions. Then, based on your app's design and the user's settings, your app can determine how and whether a group chat and message should be displayed for a user.

User consent preferences also exist in the 1:1 chat context. To learn more, see [Understand user consent](/consent/user-consent).

## Allow or deny contact by wallet in group chat

:::code-group

```jsx [React Native]
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
// note that this can only be done with the JS SDK (@xmtp/xmtp-js)

await client.contacts.allow([walletAddress]);
```

:::

## Allow or deny contact by inbox ID in group chat

:::code-group

```jsx [React Native]
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
// note that this can only be done with the JS SDK (@xmtp/xmtp-js)

// allow
await client.contacts.allowInboxes([inboxID]);

// deny
await client.contacts.denyInboxes([inboxID]);
```

:::

## Allow or deny contact by group chat ID

:::code-group

```jsx [React Native]
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
// note that this can only be done with the JS SDK (@xmtp/xmtp-js)

// allow
await client.contacts.allowGroups([groupId]);

// deny
await client.contacts.denyGroups([groupId]);
```

:::

## Allow or deny contact from inbox ID

Enable a user to explicitly allow or deny contact from an inbox ID.

:::code-group

```jsx [React Native]
// Allow
await client.contacts.allowInboxes([client.inboxId]);

// Deny
await client.contacts.denyInboxes([client.inboxId]);
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

```jsx [React Native]
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
// note that this can only be done with the JS SDK (@xmtp/xmtp-js)

// is group allowed?
await client.contacts.isGroupAllowed(groupId);

// is group denied?
await client.contacts.isGroupDenied(groupId);
```

:::

## Check consent for inbox ID

Check if contact from an inbox ID is allowed or denied for a user.

:::code-group

```jsx [React Native]
await client.contacts.isInboxAllowed(client.inboxId);
```

```kotlin [Kotlin]
contacts.isInboxAllowed(client.inboxId)
```

```swift [Swift]
await contact.isInboxAllowed(inboxId: client.inboxID)
```

```tsx [Node]
// note that this can only be done with the JS SDK (@xmtp/xmtp-js)

// is inbox allowed?
await client.contacts.isInboxAllowed(inboxId);

// is inbox denied?
await client.contacts.isInboxDenied(inboxId);
```

:::

## Stream user consent

To learn how to stream user consent preferences, see [Stream the consent list](/consent/consent-methods#stream-the-consent-list).

## Synchronize user consent

To learn how to keep user consent preferences synchronized, see [Synchronize user consent preferences](/consent/consent-methods#synchronize-user-consent-preferences).
