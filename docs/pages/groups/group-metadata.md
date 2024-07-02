# Handle group chat metadata

Group chats can have metadata, like names and images. Metadata can help users more easily identify their group chats. You can also set group chat metadata when [creating a group chat](#create-a-group-chat).

## Get a group chat name

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
const groupName =await group.groupName();
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
group.name
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
try group.groupname()
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
// this API is experimental and may change in the future

const groupName = group.name;
```

</TabItem>
</Tabs>

### Update a group chat name

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
await group.updateName("New Group Name");
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
group.updateGroupName("New Group Name")
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
try await group.updateGroupName(groupname: "New Group Name")
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
// this API is experimental and may change in the future

await group.updateName("New Group Name");
```

</TabItem>
</Tabs>

### Get a group chat image URL

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
const groupName = await group.imageUrlSquare()
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
group.imageURLSquare
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
try group.groupImageUrlSquare()
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
Code sample coming soon
```

</TabItem>
</Tabs>

### Update a group chat image URL

<Tabs groupId="sdklangs">
<TabItem value="rn" label="React Native" attributes={{className: "rn_tab"}}>

```jsx
await group.updateImageUrlSquare("ImageURL")
```

</TabItem>
<TabItem value="kotlin" label="Kotlin" attributes={{className: "kotlin_tab"}}>

```kotlin
group.updateGroupImageUrlSquare("newurl.com")
```

</TabItem>
<TabItem value="swift" label="Swift"  attributes={{className: "swift_tab"}}>

```swift
try await group.updateGroupImageUrlSquare(imageUrlSquare: "newurl.com")
```

</TabItem>
<TabItem value="node" label="Node"  attributes={{className: "node_tab"}}>

```tsx
Code sample coming soon
```

</TabItem>
</Tabs>
