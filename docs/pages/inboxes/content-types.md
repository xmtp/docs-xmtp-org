# Support content types with XMTP

When you build an app with XMTP, all messages are encoded with a content type to ensure that an XMTP client knows how to encode and decode messages, ensuring interoperability and consistent display of messages across apps.

In addition, message payloads are transported as a set of bytes. This means that payloads can carry any content type that a client supports, such as plain text, JSON, or even non-text binary or media content.

At a high level, there are three categories of content types with XMTP:

- Standard
- Standards-track
- Custom

## Standard content types

A standard content type is one that has undergone the XMTP Request for Comment (XRC) process and has been adopted as an [XMTP Improvement Proposal](https://github.com/xmtp/XIPs#readme) (XIP).

Once adopted, a standard content type is bundled in XMTP client SDKs. A developer can then import the standard content type from an SDK for use in their app.

Here is the current standard content type:

### Text content type

An app built with XMTP uses the `TextCodec` (plain text) standard content type by default. This means that if your app is sending plain text messages only, you don’t need to perform any additional steps related to content types.

:::code-group

```jsx [JavaScript]
await conversation.send("gm");
```

```jsx [React]
await sendMessage(conversation, "gm");
```

```swift [Swift]
try await conversation.send(content: "gm")
```

```kotlin [Kotlin]
conversation.send(text = "gm")
```

```jsx [React Native]
await conversation.send("gm");
```

:::

## Standards-track content types

A standards-track content type is one that is being actively reviewed for adoption as a standard content type through the XIP process.

Here are standards-track content types that you can review, test, and adopt in your app today:

- [Remote attachment content type](#TODO)
    Use to send a remote attachment of any size using the `RemoteAttachmentCodec` and a storage provider.

- [Read receipt content type](#TODO)

    Use to send a read receipt, which is a `timestamp` that indicates when a message was read. The read receipt is sent as a message and you can use it to calculate the time since the last message was read.

- [Reaction content type](#TODO)

    Use a reaction to send a quick and often emoji-based way to respond to a message. Reactions are usually limited to a predefined set of emojis or symbols provided by the messaging app.

- [Reply content type](#TODO)

    Use a reply to send a direct response to a specific message in a conversation. Users can select and reply to a particular message instead of sending a new one.

- [On-chain transaction reference content type](#TODO)

    Use to send references to on-chain transactions, such as crypto payments.

## Custom content type

Any developer building with XMTP can create a custom content type and immediately start using it in their app. Unlike a standard content type, use of a custom content type doesn't require prerequisite formal adoption through the XRC and XIP processes.

For example, if you need a content type that isn't covered by a standard or standards-track content type, you can create a custom content type and begin using it immediately in your app.

:::caution

Be aware that your custom content type may not be automatically recognized or supported by other applications, which could result in it being overlooked or only its fallback text being displayed.

:::

If another app wants to display your custom content type, they must implement your custom content type in their code exactly as it's defined in your code.

Fallback plain text is "alt text"-like description text that you can associate with a custom content type if you are concerned that a receiving app might not be able to handle the content. If the receiving app is unable to handle the custom content, it displays the fallback plain text instead.
