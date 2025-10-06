# Use fallback text for content type compatibility

When building with XMTP, you can't know in advance whether a recipient's app will support a given content type, especially a [custom one](/chat-apps/content-types/custom). Likewise, your own app might receive messages with content types it doesn't support.

To prevent a poor user experience or app crashes, you should use the `fallback` property.

**For sending:** When sending a message with a custom content type, always provide a `fallback` string. This string offers a human-readable representation of the content. If the recipient's app doesn't support your custom type, it can display the `fallback` text instead. To learn more, see [Build custom content types](/chat-apps/content-types/custom).

**For receiving:** When your app receives a message, check if it supports the message's `contentType`. If not, render the `fallback` text.

However, some content types, especially those not meant for display (like read receipts), won't have a `fallback`. In these `undefined` cases, you should generally ignore the message entirely. Displaying a generic "unsupported content" message for every silent background event would create a poor user experience and clutter the chat. The code examples below show how to handle both scenarios.

:::code-group

```js [Browser]
const codec = client.codecFor(content.contentType);
if (!codec) {
  /*Not supported content type*/
  if (message.fallback !== undefined) {
    return message.fallback;
  }
  // Handle other types like ReadReceipts which are not meant to be displayed
}
```

```js [Node]
const codec = client.codecFor(content.contentType);
if (!codec) {
  /*Not supported content type*/
  if (message.fallback !== undefined) {
    return message.fallback;
  }
  // Handle other types like ReadReceipts which are not meant to be displayed
}
```

```jsx [React Native]
//contentTypeID has the following structure `${contentType.authorityId}/${contentType.typeId}:${contentType.versionMajor}.${contentType.versionMinor}`;
const isRegistered = message.contentTypeID in client.codecRegistry;
if (!isRegistered) {
  // Not supported content type
  if (message?.fallback != null) {
    return message?.fallback;
  }
  // Handle other types like ReadReceipts which are not meant to be displayed
}
```

```kotlin [Kotlin]
val codec = client.codecRegistry.find(options?.contentType)
if (!codec) {
  /*Not supported content type*/
  if (message.fallback != null) {
    return message.fallback
  }
  // Handle other types like ReadReceipts which are not meant to be displayed
}
```

```swift [Swift]
let codec = client.codecRegistry.find(for: contentType)
if (!codec) {
  /*Not supported content type*/
  if (message.fallback != null) {
    return message.fallback
  }
  // Handle other types like ReadReceipts which are not meant to be displayed
}
```

:::
