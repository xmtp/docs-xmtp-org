# Support user consent preferences to provide spam-free inboxes

Use the following methods to provide users with control over their messaging experience, ensuring their inboxes are tailored to their preferences and spam-free.

## Get new consent records from the network

Get the latest consent records from the network:

:::code-group

```tsx [React Native]
await alix.syncConsent();
```

```kotlin [Kotlin]
alix.preferences.syncConsent()
```

```swift [Swift]
try await alix.preferences.syncConsent()
```

:::

## Get the consent state of a conversation

Check the current consent state of a specific conversation:

:::code-group

```js [Browser]
import { ConsentEntityType } from "@xmtp/browser-sdk";

// get consent state from the client
const conversationConsentState = await client.getConsentState(
  ConsentEntityType.GroupId,
  groupId
);

// or get consent state directly from a conversation
const groupConversation = await client.conversations.findConversationById(
  groupId
);
const groupConversationConsentState = await groupConversation.consentState();
```

```js [Node]
import { ConsentEntityType } from "@xmtp/node-sdk";

// get consent state from the client
const conversationConsentState = await client.getConsentState(
  ConsentEntityType.GroupId,
  groupId
);

// or get consent state directly from a conversation
const groupConversation = await client.conversations.findConversationById(
  groupId
);
const groupConversationConsentState = await groupConversation.consentState();
```

```tsx [React Native]
await conversation.consentState();
```

```kotlin [Kotlin]
conversation.consentState()
```

```swift [Swift]
try conversation.consentState()
```

:::

## Update the conversation consent state

Update the consent state of a conversation to allow or deny messages:

:::code-group

```js [Browser]
import { ConsentEntityType, ConsentState } from "@xmtp/browser-sdk";

// set consent state from the client (can set multiple states at once)
await client.setConsentStates([
  {
    entityId: groupId,
    entityType: ConsentEntityType.GroupId,
    state: ConsentState.Allowed,
  },
]);

// set consent state directly on a conversation
const groupConversation = await client.conversations.findConversationById(
  groupId
);
await groupConversation.updateConsentState(ConsentState.Allowed);
```

```js [Node]
import { ConsentEntityType, ConsentState } from "@xmtp/node-sdk";

// set consent state from the client (can set multiple states at once)
await client.setConsentStates([
  {
    entityId: groupId,
    entityType: ConsentEntityType.GroupId,
    state: ConsentState.Allowed,
  },
]);

// set consent state directly on a conversation
const groupConversation = await client.conversations.findConversationById(
  groupId
);
await groupConversation.updateConsentState(ConsentState.Allowed);
```

```tsx [React Native]
await conversation.updateConsent("allowed"); // 'allowed' | 'denied'
```

```kotlin [Kotlin]
conversation.updateConsent(ALLOWED) // ALLOWED | DENIED
```

```swift [Swift]
try await conversation.updateConsent(.allowed) // .allowed | .denied
```

:::

## Stream consent records in real-time - coming soon

Listen for real-time updates to consent records:

:::code-group

```tsx [React Native]
await alix.streamConsent();
```

```kotlin [Kotlin]
alix.preferences.streamConsent().collect {
  // Received consent
}
```

````swift [Swift]
for await consent in try await alix.preferences.streamConsent() {
  // Received consent
}```

:::

## Handle unknown contacts

With user consent preferences, a wallet address registered on the XMTP network can have one of three user consent preference values in relation to another user's wallet address:

- Unknown
- Allowed
- Denied

You can implement user consent preferences to give your users inboxes that are **spam-free spaces for allowed contacts only**.

You can then handle message requests from unknown contacts in a separate UI.

These message requests from unknown contacts could be from:

- Contacts the user might know
- Contacts the user might not know
- Spammy or scammy contacts

You can filter these unknown contacts to:

- Identify contacts the user might know or want to know and display them on a **You might know** tab, for example.
- Identify contacts the user might not know and not want to know, which might include spam, and display them on a **Hidden requests** tab, for example.

### Identify contacts the user might know

To identify contacts the user might know or want to know, you can look for signals in onchain data that imply an affinity between addresses. You can then display appropriate messages on a **You might know** tab, for example.

<div>
<img src="https://raw.githubusercontent.com/xmtp/docs-xmtp-org/refs/heads/main/docs/pages/img/you-might-know-tab.jpg" width="400" />
</div>

### Identify contacts the user might not know, including spammy or scammy requests

To identify contacts the user might not know or not want to know, which might include spam, you can consciously decide to scan messages in an unencrypted state to find messages that might contain spammy or scammy content. You can also look for an absence of onchain interaction data between the addresses, which might indicate that there is no affinity between addresses. You can then filter the appropriate messages to display on a **Hidden requests** tab, for example.

<div>
<img src="https://raw.githubusercontent.com/xmtp/docs-xmtp-org/refs/heads/main/docs/pages/img/hidden-requests-tab.jpg" width="400" />
</div>

The decision to scan unencrypted messages is yours as the app developer. If you take this approach:

- Handle unencrypted messages with extreme care, and don't store unencrypted messages beyond the time necessary to scan them.
- Consider telling users that your app scans unencrypted messages for spammy or scammy content.
- Consider making spam and scam message detection optional for users who prefer not to have their messages scanned.

### Why is content moderation handled by apps and not XMTP?

XMTP is a decentralized, open protocol built to ensure private, secure, and censorship-resistant communication. As such, XMTP can't read unencrypted messages, and therefore, it also can't scan or filter message contents for spammy or scammy material.

The protocol can analyze onchain data signals, such as shared activity between wallet addresses, to infer potential affinities between addresses. However, because all XMTP repositories are open source, malicious actors could inspect these methods and develop workarounds to bypass them.

Additionally, applying spam filtering or content moderation directly at the protocol level would introduce centralization, which goes against the decentralized, permissionless, and open ethos of XMTP and web3. A protocol-driven approach could limit interoperability and trust by imposing subjective rules about content across all apps.

Instead, content filtering and moderation should be implemented at the app layer. Apps can decide how opinionated or lenient they want to be, tailoring their filtering approach to the needs of their users. For example, one app may choose to aggressively scan and block spam to provide a highly curated experience, attracting users who value more protection. Another app may opt for minimal or no filtering, appealing to users who prioritize full control and unfiltered communication.

This flexibility enables different apps to serve different user preferences, fostering an ecosystem where users can choose the experience that best suits them. Whether an app scans messages or not, XMTP ensures that developers remain free to build in line with their own values, without imposing restrictions at the infrastructure level. This separation between the protocol and app layers is crucial to maintaining XMTP’s commitment to openness, interoperability, and user choice.

:::tip

Is your app using a great third-party or public good tool to help with spam and keep inboxes safe? Open an [issue](https://github.com/xmtp/docs-xmtp-org/issues) to share information about it.

:::
````
