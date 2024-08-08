# Handle group chat metadata

Group chats can have metadata, like names and images. Metadata can help users more easily identify their group chats. You can also set group chat metadata when [creating a group chat](/groups/build-group-chat#create-a-group-chat).

## Get a group chat name

:::code-group

```jsx [React Native]
const groupName =await group.groupName();
```

```kotlin [Kotlin]
group.name
```

```swift [Swift]
try group.groupname()
```

```tsx [Node]
// this API is experimental and may change in the future

const groupName = group.name;
```

:::

## Update a group chat name

:::code-group

```jsx [React Native]
await group.updateName("New Group Name");
```

```kotlin [Kotlin]
group.updateGroupName("New Group Name")
```

```swift [Swift]
try await group.updateGroupName(groupname: "New Group Name")
```

```tsx [Node]
// this API is experimental and may change in the future

await group.updateName("New Group Name");
```

:::

## Get a group chat image URL

:::code-group

```jsx [React Native]
const groupName = await group.imageUrlSquare();
```

```kotlin [Kotlin]
group.imageURLSquare
```

```swift [Swift]
try group.groupImageUrlSquare()
```

```tsx [Node]
// this API is experimental and may change in the future

const groupImageUrl = group.imageUrl;
```

:::

## Update a group chat image URL

:::code-group

```jsx [React Native]
await group.updateImageUrlSquare("ImageURL");
```

```kotlin [Kotlin]
group.updateGroupImageUrlSquare("newurl.com")
```

```swift [Swift]
try await group.updateGroupImageUrlSquare(imageUrlSquare: "newurl.com")
```

```tsx [Node]
// this API is experimental and may change in the future

await group.updateImageUrl("newurl.com");
```

:::
