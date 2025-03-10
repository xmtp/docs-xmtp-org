# Manage group chat metadata

Group chats can have metadata, like names, descriptions, and images. Metadata can help users more easily identify their group chats. You can set group chat metadata when [creating a group chat](/inboxes/build-inbox#create-a-new-group-chat), and get and update metadata using these methods.

## Get a group chat name

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

## Update a group chat name

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
group.updateName("New Group Name")
```

```swift [Swift]
try await group.updateName(groupname: "New Group Name")
```

:::

## Get a group chat description

:::code-group

```js [Browser]
const groupDescription = group.description;
```

```js [Node]
const groupDescription = group.description;
```

```tsx [React Native]
const groupDescription = await group.groupDescription();
```

```kotlin [Kotlin]
group.description
```

```swift [Swift]
try group.groupDescription()
```

:::

## Update a group chat description

:::code-group

```js [Browser]
await group.updateDescription("New Group Description");
```

```js [Node]
await group.updateDescription("New Group Description");
```

```tsx [React Native]
await group.updateDescription("New Group Description");
```

```kotlin [Kotlin]
group.updateDescription("New Group Description")
```

```swift [Swift]
try await group.updateDescription(Description: "New Group Description")
```

:::

## Get a group chat image URL

:::code-group

```js [Browser]
const groupImageUrl = group.imageUrl;
```

```js [Node]
const groupImageUrl = group.imageUrl;
```

```tsx [React Native]
const groupName = await group.imageUrl();
```

```kotlin [Kotlin]
group.imageURL
```

```swift [Swift]
try group.groupImageUrl()
```

:::

## Update a group chat image URL

:::code-group

```js [Node]
await group.updateImageUrl("newurl.com");
```

```js [Node]
await group.updateImageUrl("newurl.com");
```

```tsx [React Native]
await group.updateImageUrl("ImageURL");
```

```kotlin [Kotlin]
group.updateImageUrl("newurl.com")
```

```swift [Swift]
try await group.updateImageUrl(imageUrl: "newurl.com")
```

:::
