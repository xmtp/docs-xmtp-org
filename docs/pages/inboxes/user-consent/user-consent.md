# Understand how user consent preferences support spam-free inboxes

In any open and permissionless messaging ecosystem, spam is an inevitable reality, and XMTP is no exception.

However, with XMTP, you can give your users inboxes that are **spam-free spaces for chosen contacts only** by supporting user consent preferences.

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

Your app should aim to handle consent preferences appropriately because they are an expression of user intent.

For example, if a user blocked a contact, your app should respect the user's intent to not see messages from the blocked contact. Handling the consent preference incorrectly and showing the user messages from the blocked contact may cause the user to lose trust in your app.

These user consent preferences are stored privately in an encrypted consent list on the XMTP network. The consent list is accessible by all apps that a user has authorized. This means a user can accept, or block, a contact once and have that consent respected across all other XMTP apps they use.

Be sure to load the latest consent list from the network at appropriate steps in your app flow to ensure that your app can operate using the latest data.

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
