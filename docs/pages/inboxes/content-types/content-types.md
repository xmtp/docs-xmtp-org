# Understand content types with XMTP

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

```jsx [Browser]
await conversation.send("gm");
```

```jsx [React Native]
await conversation.send("gm");
```

```kotlin [Kotlin]
conversation.send(text = "gm")
```

```swift [Swift]
try await conversation.send(content: "gm")
```

:::

## Standards-track content types

A standards-track content type is one that's being actively reviewed for adoption as a standard content type through the XIP process.

Here are standards-track content types that you can review, test, and adopt in your app today:

- [Attachment content type](/inboxes/content-types/attachments/#support-attachments-smaller-than-1mb): Use to send attachments smaller than 1MB.
- [Remote attachment content type](/inboxes/content-types/attachments#support-remote-attachments-of-any-size): Use to send attachments of any size.
- [Read receipt content type](/inboxes/content-types/read-receipts): Use to send a read receipt, which is a `timestamp` that indicates when a message was read. 
- [Reaction content type](/inboxes/content-types/reactions): Use a reaction to send a quick and often emoji-based way to respond to a message. 
- [Reply content type](/inboxes/content-types/replies): Use a reply to send a direct response to a specific message in a conversation. Users can select and reply to a particular message instead of sending a new one.
- [On-chain transaction reference content type](/inboxes/content-types/transaction-refs): Use to send references to on-chain transactions, such as crypto payments.

## Create a custom content type

Any developer building with XMTP can create a custom content type and immediately start using it in their app. Unlike a standard content type, use of a custom content type doesn't require prerequisite formal adoption through the XRC and XIP processes.

To learn more, see [Build custom content types](/inboxes/content-types/custom).