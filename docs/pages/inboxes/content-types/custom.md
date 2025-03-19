---
description: Learn how to build custom content types
---

# Build custom content types

Any developer building with XMTP can create a custom content type and immediately start using it in their app. Unlike a standard content type, use of a custom content type doesn't require prerequisite formal adoption through the XRC and XIP processes.

Building a custom content type enables you to manage data in a way that's more personalized or specialized to the needs of your app.

For example, if you need a content type that isn't covered by a [standard](/inboxes/content-types/content-types#standard-content-types) or [standards-track](/inboxes/content-types/content-types#standards-track-content-types) content type, you can create a custom content type and begin using it immediately in your app.

:::warning[warning]

Be aware that your custom content type may not be automatically recognized or supported by other apps, which could result in the other apps overlooking or only displaying the fallback text for your custom content type.

:::

Fallback plain text is "alt text"-like description text that you can associate with a custom content type if you are concerned that a receiving app might not be able to handle the content. If the receiving app is unable to handle the custom content, it displays the fallback plain text instead.

If another app wants to display your custom content type, they must implement your custom content type in their code exactly as it's defined in your code.

For more common content types, you can usually find a [standard](/inboxes/content-types/content-types#standard-content-types) or [standards-track](/inboxes/content-types/content-types#standards-track-content-types) content type to serve your needs.

If your custom content type generates interest within the developer community, consider proposing it as a standard content type through the [XIP process](/intro/xips).
