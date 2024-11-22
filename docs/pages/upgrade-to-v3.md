# Upgrade to XMTP V3

The process to upgrade an app built with XMTP V2 to V3 is designed to be straightforward, with most functions in V3 working as they did in V2. However, there are some notable differences, which we cover here.

:::info[Key takeaways]
- **Most core methods from V2 work in a similar way in V3**, with some notable differences that are covered in this document.
- **We recommend that apps upgrade directly to V3**, giving people access to a pure V3+ messaging experience with stronger encryption and laying the foundation for decentralization of the network. To learn more, see the [FAQ](/upgrade-to-v3#faq).
- **V2 is scheduled for deprecation in Q2 2025**, after which all V2 conversations and messages will become read-only. To ensure users can still access their V2 communications, [Ephemera](https://ephemerahq.com/) will launch a dedicated website where users can sign in with their V2 identities to view their messages. Additional details will be shared as the deprecation date approaches.
:::

## Core methods from V2 work in a similar way in V3

Most core methods from V2, such as `newConversation`, `list`, `stream`, and `streamAllMessages`, work in a similar way in V3. 

However, a key difference is that prior to V3, a conversation could represent a V1 or V2 conversation. In V3, a conversation can represent a group chat or direct message (DM).

To learn more, see [Build a chat inbox](/inboxes/build-inbox).

## Local databases mean no need to export/import topic data

In V3, a client creates and manages a local database. For this reason, we no longer need to export or import topic data.

## Loading messages

- In V2, we used `listBatchMessages` to load all messages across conversations to help performantly load a conversation list in descending order by last message.
- In V3, because there is a local database. we can simply use `list(order: .lastMessage)`.

## Push notification differences

### Decryption

- In V1 and V2, we used intros V1 (`fromIntro`) and invites V2 (`fromInvite`) to decrypt invites and intros.
- In V3, new conversations are called welcomes, and we use `fromWelcome` to decrypt them.

### Getting topic IDs

- In V2, we used `/xmtp/0/invite-$address/proto` to get the topic identifier for a new conversation.
- In V3, we use `/xmtp/mls/1/w-$installationId/proto` to get the topic identifier for a new group chat or DM conversation.

## Installation-specific private keys

In V2, we had a `privateKeyBundle` that could be exported and imported into any SDK to create a client. This allowed users to migrate their identity across SDKs without re-signing with their wallet. In V2, we also had a consistent identity key that we used to sign and verify messages, and their static nature could make them a vulnerability over time.

In V3, we have installation-specific key bundles that stored securely in the managed local database and rotated periodically, which adds a significant layer of security. This means that creating a V3 client is as simple as calling the `build` method with an address and a `dbEncryptionKey`, which retrieves the appropriate key bundle from the local database.

### Create a client

- In V2, `client.createFromKeyBundle`
- In V3, `client.build`

### Sign a message

- In V2, `client.privateKeyBundle.sign(message)`
- In V3, `client.signWithInstallationKey(message)`

### Verify a signature

- In V2, `Signature.verify(signature)`
- In V3, `client.verifyInstallationSignature(message, signature, installationId)`

## Managing consent

- In V2, we managed consent via `client.contacts.consentList`.
- In V3, we can manage consent via `client.preferences.getAddressConsent(address)`. However, we recommend that you now manage consent at the conversation level by `conversationId`. To learn more, see [Support user consent preferences](/inboxes/user-consent/support-user-consent#support-user-consent-preferences-to-provide-spam-free-inboxes).

## Summary of notable changes

| Purpose | V2 method | V3 equivalent |
| --- | --- | --- |
| Loading messages | `listBatchMessages` | `list(order: .lastMessage)` |
| Push notification decryption | `fromInvite`, `fromIntro` | `fromWelcome` |
| Get topic IDs for push notifications | `/xmtp/0/invite-$address/proto` | `/xmtp/mls/1/w-$installationId/proto` |
| Create client | `client.createFromKeyBundle` | `client.build` |
| Sign a message | `client.privateKeyBundle.sign(message)` | `client.signWithInstallationKey(message)` |
| Verify a signature | `Signature.verify(signature)` | `client.verifyInstallationSignature(message, signature, installationId)` |
| Manage consent | `client.contacts.consentList` | `client.preferences.getAddressConsent(address)` |

## FAQ

### Can I use a V2 identity in an app built with V3?

A V2 identity can access V2 functionality only. To access V3 functionality, you must create a new V3 identity.

In V2, creating an identity required two signatures. In V3, we only need one signature. For example:

```kotlin
// Database encryption key for the local database.
const databaseEncryptionKey = new Uint8Array([
  233, 120, 198, 96, 154, 65, 132, 17, 132, 96, 250, 40, 103, 35, 125, 64,
  166, 83, 208, 224, 254, 44, 205, 227, 175, 49, 234, 129, 74, 252, 135, 145,
])

// Creating a new client
const xmtpClient = await Client.create(signer, {
	env: 'production',
	dbEncryptionKey: databaseEncryptionKey, // Required for V3
 })
```

### Can I use V2 consent preferences in an app built with V3?

Because V2 conversations are not automatically ported to V3, V2 consent preferences are less useful in a V3 app. So, when starting V3 conversations, you may need to approve or reject certain users again.

### Can I access V2 conversations and messages in an app built with V3?

V3 delivers an enhanced encryption scheme that is even more secure than V2, laying the groundwork for decentralizing the network. While the difference in encryption schemes makes it challenging to import V2 conversations and messages into an app built with V3, this tradeoff establishes a stronger foundation for security, privacy, and decentralization.

We recommend that apps upgrade directly to V3, giving people access to a pure V3+ messaging experience.

To ensure continuity, Ephemera plans to provide a website where people can sign in with their V2 identities to access their V2 conversations and messages in a read-only format.

### Can I use V2 conversations to seed the conversation list in my app built with V3?

While we don’t recommend it, you can store V2 conversations in a local database that you manage, and then, on the first install, your app can try to create V3 DM conversations using the peer addresses in the V2 conversations. If you go this route, ensure that you store the **allowed** V2 conversations only so you don’t port over spam.

We don’t recommend using this approach because not all of the peer addresses may be reachable on the V3 network, which means that only some conversations would be seeded.
