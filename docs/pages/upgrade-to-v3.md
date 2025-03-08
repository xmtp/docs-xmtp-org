# Upgrade to XMTP V3

The process to upgrade an app built with XMTP V2 to V3 is designed to be straightforward, with most functions in V3 working as they did in V2. However, there are some notable differences, which we cover here.

:::info[Key takeaways]
- **Primary XMTP identifier is now an inboxId instead of an Ethereum address**. As covered further in this document, this inbox can have a list of identities including Ethereum addresses as well as other types in the future, such as Passkeys and Bitcoin**.
- **Most core methods from V2 work in a similar way in V3**, with some notable differences that are covered in this document.
- **We recommend that apps upgrade directly to V3**, giving people access to a pure V3+ messaging experience with stronger encryption and laying the foundation for decentralization of the network. To learn more, see the [FAQ](/upgrade-to-v3#faq).
- ⛔️ **Rolling brownouts of the V2 network start on April 1, 2025. V2 will be deprecated on May 1, 2025**, after which all V2 conversations and messages will become read-only. To learn more, see [XIP 53: XIP V2 deprecation plan](https://community.xmtp.org/t/xip-53-xmtp-v2-deprecation-plan/867). Users will still be able to access their V2 communications in read-only format using [https://legacy.xmtp.chat/](https://legacy.xmtp.chat/).
:::

## Upgrade availability

- 🟢 **The mobile app upgrade path is ready**. This includes apps built with React Native, Kotlin, or Swift.

- 🟢 **The web app upgrade path is ready**. For detailed guidance, try [xmtp.chat](https://xmtp.chat/), an interactive developer tool and chat app built with XMTP V3.

- 🟢 **The agent upgrade path is ready**. For detailed guidance, [open an issue](https://github.com/xmtp/xmtp-js/issues) in the Node SDK GitHub repo.

## Primary XMTP identifier is now a flexible identity object, not an Ethereum address

XMTP is evolving from using Ethereum account addresses (0x...) as the primary identifier to an inbox-based identity model. This change allows for broader support of different authentication mechanisms, including the currently supported Externally Owned Accounts (EOAs) and Smart Contract Wallets (SCWs), as well as future support for Passkeys.

Instead of assuming an Ethereum address as the unique identifier, developers should default to using the `inboxId`, where possible. Inboxes will have a list of identity objects that explicitly includes the identity type (kind) and the identifier.

With this new model, apps reference identities or inbox IDs, rather than Ethereum addresses. Some identity types (like Passkeys) do not have an associated address, so identities and inbox IDs provide a consistent way to identify users across different authentication methods.

This change ensures that XMTP identities are more extensible and adaptable, accommodating future improvements in authentication methods while maintaining backward compatibility for Ethereum-based accounts.

### Example: Supporting multiple identity types

With this new model, an app can now distinguish different identity types when creating a signer

:::tip

Passkeys are not yet supported and are referenced here just to illustrate the flexibility of the new identity model.

:::

```tsx
function createSigner(account): Signer {
  return {
    getIdentity: async () => ({
      kind: account.isSCW ? "ETHEREUM" : "PASSKEY",
      identifier: account.address || account.passkeyId,
    }),
    signMessage: async (message) => {
      return account.signMessage(message);
    },
    getChainId: account.isSCW ? () => BigInt(8453) : undefined,
    getBlockNumber: account.isSCW ? () => undefined : undefined,
  };
}
```

### Before: Using getAddress()

Previously, developers used `getAddress()` to retrieve an account’s Ethereum address:

```tsx
const signer: Signer = {
  getAddress: () => "0x123...",
  signMessage: async (message) => {
    // return signed message
  },
};
```

While this approach worked for EOAs, it assumed that all accounts were Ethereum addresses and did not allow for other identity types.

### After: Using getIdentity()

Now, `getIdentity()` returns an identity object, allowing for multiple types of accounts:

```tsx
const signer: Signer = {
  getIdentity: () => ({
    kind: "ETHEREUM", // Identity type (ETHEREUM, PASSKEY, etc.)
    identifier: "0x123...", // Account identifier
  }),
  signMessage: async (message) => {
    // return signed message
  },
};
```

### Before: newConveration()

Previously, developers used an Ethereum address to create a new DM conversation:

```tsx
const dm = await alix.conversations.findOrCreateDm(bo.address);
```

### After: newConveration()

Now, developers can use `inboxId` to create a new DM conversation because with the new flexible identity model, they cannot rely on the existence of an address.

```tsx
const dm = await alix.conversations.findOrCreateDm(bo.inboxId);
```

## Core methods from V2 work in a similar way in V3

Most core methods from V2, such as `newConversation`, `list`, `stream`, and `streamAllMessages`, work in a similar way in V3. 

However, key differences include:

- `newConversation` no longer takes addresses, but rather inbox IDs, as covered in [Primary XMTP identifier is now a flexible identity object, not an Ethereum address](#primary-xmtp-identifier-is-now-a-flexible-identity-object-not-an-ethereum-address)

- Prior to V3, a conversation could represent a V1 or V2 conversation. In V3, a conversation can represent a group chat or direct message (DM).

To learn more, see [Build a chat inbox](/inboxes/build-inbox).

## Local databases mean no need to export/import topic data

- In V2, we needed to manually create and manage a local database for performance. Additionally, when moving across different SDKs, you could export a topic and then import it into the other SDK to shorten the performance loop. This was particularly useful when handling push notifications in React Native apps to increase the speed of exporting and importing a conversation across SDKs.
- In V3, a client automatically creates and manages a local database per installation, so performance issues are no longer an issue. When moving across installations, use message history to move data between installations. In the case of React Native push notifications, the database is accessible from both the native layer and React Native.

## Loading messages

- In V2, we used `listBatchMessages` to load all messages across conversations to help performantly load a conversation list in descending order by last message.
- In V3, because there is a local database, we can simply use `list()`, which returns a list of conversations in descending order by last message, or by a conversation's `createdAt` value if it has no messages.

## Push notification differences

### Decryption

- In V1 and V2, we used intros V1 (`fromIntro`) and invites V2 (`fromInvite`) to decrypt invites and intros.
- In V3, new conversations are called welcomes, and we use `fromWelcome` to decrypt them.

### Getting topic IDs

- In V2, we used `/xmtp/0/invite-$address/proto` to get the topic identifier for a new conversation.
- In V3, we use `/xmtp/mls/1/w-$installationId/proto` to get the topic identifier for a new group chat or DM conversation.

## Installation-specific private keys

In V2, we had a `privateKeyBundle` that could be exported and imported into any SDK to create a client. This allowed users to migrate their identity across SDKs without re-signing with their wallet. In V2, we also had a consistent identity key that we used to sign and verify messages, and their static nature could make them a vulnerability over time.

In V3, we have installation-specific key bundles that are stored securely in the managed local database and rotated periodically, which adds a significant layer of security. This means that after a V3 client is created, it is as simple as calling the `build` method with an address and a `dbEncryptionKey`, which retrieves the appropriate key bundle from the local database. With the added security of installation-based keys, it is no longer possible to export and import them into other clients. Calling create will create a new installation if a local database is not already present. Provided the same wallet is used for signing, your `inboxID` will be the same across all installations.

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

<<<<<<<<<We're no longer doing consent based on address. It's going to be based on inbox id like there just needs to be like
a really clear call out of the transition from inbox id to Doc.>>>>>>>>>

## Summary of notable changes

<<<<<<<<<<<<If you want to still do it by address, like a new conversation. We will still allow that, and I can give you the code snippet for it. It'll be new conversation with identity.
and then the identity will be like it'll be like a map, or whatever of like ethereum
and then the ethereum address.
So instead of being a string, it's like,
yeah. So like, if you give me like,
maybe it's in this section. I can. I can do the code snippets of like the difference between the 2.
>>>>>>>>>>>>

| Purpose | V2 method | V3 equivalent |
| --- | --- | --- |
| Loading messages | `listBatchMessages` | `list()` |
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
