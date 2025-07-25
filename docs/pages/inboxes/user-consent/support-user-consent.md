# Support user consent preferences to provide spam-free inboxes

Use the following methods to provide users with control over their messaging experience, ensuring their inboxes are tailored to their preferences and spam-free.

## Sync new consent preferences from the network

You can sync new consent preferences (and HMAC keys) from the network using any of these calls:

- [Sync preferences only](/inboxes/sync-preferences#sync-preferences-1)

- [Sync all new conversations, messages, and preferences](/inboxes/sync-and-syncall#sync-all-new-conversations-messages-and-preferences)

- [Stream all group chat and DM messages and preferences](/inboxes/stream#stream-all-group-chat-and-dm-messages-and-preferences)

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

## Stream consent preferences in real-time 
 
Listen for real-time updates to consent preferences: 

:::code-group

```tsx [Browser]
// Stream consent records in real-time
const stream = await client.preferences.streamConsent()

try {
  for await (const updates of stream) {
    // Received consent updates
    console.log("Consent updates:", updates)
  }
} catch (error) {
  // Log any stream errors
  console.error(error)
}
```

```tsx [Node]
// Stream consent records in real-time
const stream = client.preferences.streamConsent()

try {
  for await (const updates of stream) {
    // Received consent updates
    console.log("Consent updates:", updates)
  }
} catch (error) {
  // Log any stream errors
  console.error(error)
}
```

```tsx [React Native]
await client.preferences.streamConsent()
```

```kotlin [Kotlin]
client.preferences.streamConsent().collect {
  // Received ConsentRecord
}
```

```swift [Swift]
for await consent in try await client.preferences.streamConsent() {
  // Received consent
}
```

:::

## Update consent for an individual in a group chat

Update the consent state for an individual in a group chat:

:::tip[Note]
You may want to enable users to deny or allow a users on an individual basis. You can then update the group chat UI to hide messages from denied individuals.
:::

:::code-group

```js [Browser]
import { ConsentEntityType, ConsentState } from "@xmtp/browser-sdk";

await client.setConsentStates([
  {
    entityId: inboxId,
    entityType: ConsentEntityType.InboxId,
    state: ConsentState.Denied,
  },
]);
```

```js [Node]
import { ConsentEntityType, ConsentState } from "@xmtp/node-sdk";

// set consent state from the client (can set multiple states at once)
await client.setConsentStates([
  {
    entityId: inboxId,
    entityType: ConsentEntityType.InboxId,
    state: ConsentState.Denied,
  },
]);
```

```tsx [React Native]
await client.preferences.setConsentState(
  new ConsentRecord(inboxId, 'inbox_id', 'denied')
)
```

```kotlin [Kotlin]
client.preferences.setConsentState(
    listOf(
        ConsentRecord(
            inboxId,
            EntryType.INBOX_ID,
            ConsentState.DENIED
        )
    )
)
```

```swift [Swift]
try await client.preferences.setConsentState(
  entries: [
    ConsentRecord(
      value: inboxID, 
      entryType: .inbox_id,
      consentType: .denied)
  ])
```

:::

## Get the consent state of an individual in a group chat

Get the consent state of an individual in a group chat:

:::tip[Note]
You may want to enable users to deny or allow a users on an individual basis. You can then update the group chat UI to hide messages from denied individuals.
:::

:::code-group

```js [Browser]
import { ConsentEntityType } from "@xmtp/browser-sdk";

const inboxConsentState = await client.getConsentState(
  ConsentEntityType.InboxId,
  inboxId
);
```

```js [Node]
import { ConsentEntityType } from "@xmtp/node-sdk";

const inboxConsentState = await client.getConsentState(
  ConsentEntityType.InboxId,
  inboxId
);
```

```tsx [React Native]
// Get consent directly on the member
const memberConsentStates = (await group.members()).map(
  (member) => member.consentState()
)

// Get consent from the inboxId
const inboxConsentState = await client.preferences.inboxIdConsentState(inboxId)
```

```kotlin [Kotlin]
// Get consent directly on the member
val memberConsentStates = group.members().map { it.consentState }

// Get consent from the inboxId
val inboxConsentState = client.preferences.inboxIdState(inboxId)
```

```swift [Swift]
// Get consent directly on the member
let memberConsentStates = try await group.members.map(\.consentState)

// Get consent from the inboxId
let inboxConsentState = try await client.preferences.inboxIdState(inboxId: inboxId)
```

:::

## See who created and added you to a group

Get the inbox ID of the individual who added you to a group or created the group to check the consent state for it:

```tsx [React Native]
group.addedByInboxId
await group.creatorInboxId()
```

```kotlin [Kotlin]
group.addedByInboxId()
group.creatorInboxId()
```

```swift [Swift]
try await group.addedByInboxId()
try await group.creatorInboxId()
```

## Handle unknown contacts

With user consent preferences, an inbox ID or conversation ID can have one of three user consent preference values in relation to another user's inbox ID:

- Unknown
- Allowed
- Denied

You can implement user consent preferences to give your users inboxes that are **spam-free spaces for allowed conversations and contacts only**.

You can then handle message requests from unknown contacts in a separate UI.

These message requests from unknown contacts could be from:

- Contacts the user might know
- Contacts the user might not know
- Spammy or scammy contacts

You can filter these unknown contacts to:

- Identify contacts the user might know or want to know and display them on a **You might know** tab, for example.
- Identify contacts the user might not know and not want to know, which might include spam, and display them on a **Hidden requests** tab, for example.

### Identify contacts the user might know

To identify contacts the user might know or want to know, you can look for signals in onchain data that imply an affinity between addresses. 

```kotlin
val inboxState = inboxStateForInboxId(inboxId)
val identities = inboxState.identities
val ethAddresses = identities
    .filter { it.kind == ETHEREUM }
    .map { it.identifier }
```

You can then display appropriate messages on a **You might know** tab, for example. 

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
