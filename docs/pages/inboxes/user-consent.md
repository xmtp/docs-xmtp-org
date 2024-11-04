# Support user consent preferences and spam-free inboxes

In any open and permissionless messaging ecosystem, spam is an inevitable reality, and XMTP is no exception.

However, with XMTP, you can give your users inboxes that are **spam-free spaces for chosen contacts only** by supporting user consent preferences.

Use the following methods to provide users with control over their messaging experience, ensuring their inboxes are tailored to their preferences and free from spam.

## Get new consent records from the network - coming soon

Get the latest consent records from the network:

```tsx [React Native]
await alix.syncConsent()
```

## Get the consent state of a conversation

Check the current consent state of a specific conversation:

```tsx [React Native]
await conversation.consentState()
```

*Replaces V2 `client.contact.isGroupAllowed(groupId)`* 

## Update the conversation consent state

Update the consent state of a conversation to allow or deny messages:

```tsx [React Native]
await conversation.updateConsent('allowed') // 'allowed' | 'denied'
```

*Replaces V2 `client.contact.allowGroups([groupIds])`*

## Stream consent records in real-time - coming soon

Listen for real-time updates to consent records:

```tsx [React Native]
await alix.streamConsent()
```

## How user consent preferences work

With user consent preferences, a wallet address registered on the XMTP network can have one of three user consent preference values in relation to another user's wallet address:

- Unknown
- Allowed
- Denied

For example:

1. `alix.eth` starts a conversation with `bo.eth`. At this time, `alix.eth` is unknown to `bo.eth` and the conversation displays in a message requests UI.

2. When `bo.eth` views the message request, they express their user consent preference to **Block** or **Accept** `alix.eth` as a contact.

   - If `bo.eth` accepts `alix.eth` as a contact, their conversation displays in `bo.eth`'s main inbox. Because only contacts `bo.eth` accepts display in their main inbox, their inbox remains spam-free.

   - If `bo.eth` blocks contact with `alix.eth`, remove the conversation from `bo.eth`'s view. In an appropriate location in your app, give the user the option to unblock the contact.

These user consent preferences are stored privately in an encrypted consent list on the XMTP network. The consent list is accessible by all apps that a user has authorized. This means a user can accept, or block, a contact once and have that consent respected across all other XMTP apps they use.

## How user consent preferences are set

Here are some of the ways user consent preferences are set:

### Unknown

Conversation created in an app on an SDK version **with** user consent support:

- For a new conversation that a peer contact wants to start with a user, the consent preference is set to `unknown`.

Conversation created in an app on an SDK version **without** user consent support:

- For all conversations with any peer contact, the consent preference is set to `unknown`.

### Allowed

Conversation created in an app on an SDK version **with** user consent support:

- For a new conversation that a user created with a peer contact, the SDK sets the consent preference to `allowed`.

  The user’s creation of the conversation with the contact is considered consent.

- For an existing conversation created by a peer contact that hasn’t had its consent preference updated on the network (`unknown`) and that the user responds to, the SDK will update the consent preference to `allowed`.

  The user's response to the conversation is considered consent.

- For a peer contact that a user has taken the action to allow, subscribe to, or enable notifications from, for example, the app must update the consent preference to `allowed`.

Conversation created in an app on an SDK version **without** user consent support:

- There are no scenarios in which a user consent preference will be set to `allowed`.

### Denied

Conversation created in an app on an SDK version **with** user consent support:

- For a peer contact that a user has taken the action to block, unsubscribe from, or disable notifications from, for example, the app must update the consent preference to `denied`.

Conversation created in an app on an SDK version **without** user consent support:

- There are no scenarios in which a user consent preference will be set to `denied`.

## Use consent preferences to respect user intent

Your app should aim to handle consent preferences appropriately because they are an expression of user intent.

For example, if a user blocked a contact, your app should respect the user's intent to not see messages from the blocked contact. Handling the consent preference incorrectly and showing the user messages from the blocked contact may cause the user to lose trust in your app.

Be sure to load the latest consent list from the network at appropriate steps in your app flow to ensure that your app can operate using the latest data.

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