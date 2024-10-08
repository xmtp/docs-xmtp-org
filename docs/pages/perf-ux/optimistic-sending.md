# Optimistically send messages

When a user sends a message with XMTP, they might experience a slight delay between sending the message and seeing their sent message display in their app UI.

Typically, the slight delay is caused by the app needing to wait for the XMTP network to finish processing the message before the app can display the message in its UI.

Messaging without optimistic sending:

![Messaging without optimistic sending. Note the slight delay after clicking Send.](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/without-opt-sending.gif)

Note the slight delay after clicking **Send**.

Implement optimistic sending to immediately display the sent message in the sender’s UI while processing the message in the background. This provides the user with immediate feedback and enables them to continue messaging without waiting for their previous message to finish processing.

Messaging with optimistic sending:

![Messaging with optimistic sending. The message displays immediately for the sender, with a checkmark indicator displaying once the message has been successfully sent.](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/with-opt-sending.gif)

The message displays immediately for the sender, with a checkmark indicator displaying once the message has been successfully sent.

## Preserve message order

It’s important to preserve order when sending messages optimistically so that the messages appear on the network in the order they are sent. If a message is being processed when a user attempts to send another message, the new message should wait for the current message to be processed before being sent.

## Handle send statuses

- After initially sending an optimistic message, show the user an indicator that the message is still being processed.
- After successfully sending an optimistic message, show the user a success indicator.

## Handle messages that fail to send

If an optimistic message fails to send, give the user an option to retry sending the message or cancel sending. Use a try/catch block to intercept errors and allow the user to retry or cancel.

## Prepare message before sending

Use an XMTP SDK to prepare a message before sending it. This will encrypt and package the message in the proper format for the XMTP network. After preparing the message, it’s ready to be sent optimistically.

```tsx [JavaScript]
// standard (string) message
const preparedTextMessage = await conversation.prepareMessage(messageText);

// custom content type
const preparedCustomContentMessage = await conversation.prepareMessage(
  customContent,
  {
    contentType,
  },
);
```

## Send prepared message

After preparing an optimistic message, use its `send` method to send it.

```tsx [JavaScript]
try {
  preparedMessage.send();
} catch (e) {
  // handle error, enable canceling and retries (see below)
}
```
