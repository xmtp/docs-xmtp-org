---
description: "If you're building a production-grade app, be sure to use a local-first architecture to help you build a performant app."
---

# Use local-first architecture

If you're building a production-grade app, be sure to use a local-first architecture to help you build a performant app. Using a local-first architecture means building your app so a client prioritizes using local storage on the device where it’s running.

For example, use the XMTP SDK to initially retrieve existing message data from the XMTP network and place it in local storage. Then, asynchronously load new and updated message data as needed.

Here’s an overview of how your app frontend, local storage, client SDK, and the XMTP network work together in this local-first approach:

![Local-first architecture](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/local-first-arch.jpeg)

## Mobile apps

When building a mobile app with the XMTP V3 [React Native](https://github.com/xmtp/xmtp-react-native), [Android](https://github.com/xmtp/xmtp-android), and [iOS](https://github.com/xmtp/xmtp-ios) SDKs, LibXMTP will [create and manage a local database](/protocol/v3/group-chat#local-database-and-syncing) for you.

However, you should create and manage an additional separate local database if your app:

- Supports [reactions](/content-types/reaction) and [replies](/content-types/reply)
- Supports 1:1 messaging backed by [XMTP V2 infrastructure](/protocol/v2/architectural-overview.md)

Use this separate local database to store reactions and replies content types, enabling your app to performantly display them with their referenced messages when rendering message lists.

## Web apps

- When building a web app with the [React SDK](https://github.com/xmtp/xmtp-web/tree/main/packages/react-sdk), the local-first architecture is automatically provided by the SDK.

- When building a web app with the [xmtp-js SDK](https://github.com/xmtp/xmtp-js), you can use the browser `localStorage` as the local cache to store encrypted data, decrypting data each time before display. You might also consider [using Dexie to manage your web app's local data](#manage-local-data-with-dexie-in-a-web-app-built-with-xmtp-js).

For more performance best practices, see [Optimize performance of your app](/resources/get-featured)