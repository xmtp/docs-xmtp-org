# Upgrade from a legacy XMTP V2 SDK to a stable XMTP V3 SDK

This document is for you if you are upgrading from a legacy XMTP V2 SDK. Legacy XMTP V2 SDKs include:

- JavaScript SDK vx.x.x
- React Native SDK &lt;v3
- Android SDK &lt;v3
- iOS SDK &lt;v3

:::tip[Upgrading from a legacy XMTP V3 SDK?]

Legacy XMTP V3 SDKs include Browser SDK v0.x.x-&lt;v2.0.11, Node SDK v0.x.x-&lt;v2.0.6, React Native SDK v3.x.x-&lt;v4.0.5, Android SDK v3.x.x-&lt;v4.0.5, and iOS SDK v3.x.x-&lt;v4.0.7. To learn how to upgrade to stable XMTP V3, see [Upgrade from a legacy XMTP V3 SDK](/upgrade-from-legacy-V3).

:::

XMTP V3 provides support for the features expected by modern messaging apps while laying a strong foundation for the future. This is a stable and performant release that will allow for new features and is not expected to receive breaking changes in the near-term.

As developers on V2 explore XMTP V3, many have found that its new architecture provides an opportunity to rethink and refine their approach to messaging. While upgrading from V2 is possible, some teams chose to rebuild with V3 from the start to take full advantage of its performance, security, and scalability improvements. Evaluate your needs and consider the path that makes the most sense for your app.

:::info[Key takeaways]
- **Most core methods from V2 work in a similar way in V3**, with some notable differences that are covered in this document.
- **Primary XMTP identifier is now an inbox ID, not an Ethereum address**. As covered in this document, this inbox can have a list of identities including Ethereum addresses as well as other types in the future, such as Passkeys and Bitcoin**.
- ⛔️ **Rolling brownouts of the V2 network start on May 1, 2025. V2 will be deprecated on June 23, 2025**, after which all V2 conversations and messages will become read-only. To learn more, see [XIP-53: XIP V2 deprecation plan](https://community.xmtp.org/t/xip-53-xmtp-v2-deprecation-plan/867). Users will still be able to access their V2 communications in read-only format using [https://legacy.xmtp.chat/](https://legacy.xmtp.chat/).
:::

## Upgrade to XMTP V3

🟢 For mobile apps, **upgrade to an XMTP mobile SDK >=v4.0.4** following the detailed instructions in these release notes:
- [React Native](https://github.com/xmtp/xmtp-react-native/releases/tag/v4.0.5)
- [Kotlin](https://github.com/xmtp/xmtp-android/releases/tag/4.0.5)
- [Swift](https://github.com/xmtp/xmtp-ios/releases/tag/4.0.7)

🟢 For web apps, **upgrade to an XMTP web SDK >=v1.1.4** or **upgrade to an XMTP node SDK >=v1.0.5** following the detailed instructions in these release notes:
- [Browser](https://github.com/xmtp/xmtp-js/releases/tag/%40xmtp%2Fbrowser-sdk%402.0.11)
- [Node](https://github.com/xmtp/xmtp-js/releases/tag/%40xmtp%2Fnode-sdk%402.0.6)
- For additional guidance, try [xmtp.chat](https://xmtp.chat/), an interactive developer tool and chat app built with XMTP V3.

🟢 For agents, **explore [example agents](https://github.com/ephemeraHQ/xmtp-agent-examples)** built with the XMTP Node SDK >=v1.0.0.

## Primary XMTP identifier is now an inbox ID, not an Ethereum address

XMTP is evolving from using Ethereum account addresses (0x...) as the primary identifier to an inbox-based identity model. This change allows for broader support of different authentication mechanisms, including the currently supported [Externally Owned Accounts (EOAs) and Smart Contract Wallets (SCWs)](/inboxes/create-a-signer), as well as future support for Passkeys and other identity types.

Instead of assuming an Ethereum address as the unique identifier, developers should default to using the `inboxId`, where possible. An `inboxId` has a list of identity objects that explicitly includes the identity type (kind) and identifier. Some identity types, like Passkeys, do not have an associated onchain address, so using the `inboxId` provides a consistent way to identify users across different authentication methods.

For example:

```json
[
  {
    "kind": "ETHEREUM",
    "identifier": "0x1234567890abcdef1234567890abcdef12345678",
  },
  {
    "kind": "PASSKEY", // not yet supported; provided as an example only.
    "identifier": "AQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMk",
  }
]
```

This change ensures that XMTP identities are more extensible and adaptable, accommodating future improvements in authentication methods while maintaining backward compatibility for Ethereum-based accounts.

### Example: Supporting multiple identity types

With this new model, an app can now distinguish different identity types when creating a signer.

```tsx
function createSigner(account): Signer {
  return {
    getIdentity: async () => ({
      kind: account.isSCW ? "ETHEREUM" : "PASSKEY", // Passkeys are not yet supported; provided as an example only.
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
    kind: "ETHEREUM", // Identity type [ETHEREUM, PASSKEY (passkeys are not yet supported), etc.]
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

Now, developers can use `inboxId` to create a new DM conversation because with the new flexible identity model, they cannot rely on the existence of an Ethereum address.

```tsx
const dm = await alix.conversations.findOrCreateDm(bo.inboxId);
```

## Core methods from V2 work in a similar way in V3

Most core methods from V2, such as `newConversation`, `list`, `stream`, and `streamAllMessages`, work in a similar way in V3. 

However, key differences include:

- `newConversation` no longer takes addresses, but rather inbox IDs, as covered in [Primary XMTP identifier is now an inboxId, not an Ethereum address](#primary-xmtp-identifier-is-now-an-inbox-id-not-an-ethereum-address)

- Prior to V3, a conversation could represent a V1 or V2 conversation. In V3, a conversation can represent a group chat or direct message (DM).

To learn more, see [Build a chat inbox](/inboxes/pick-an-sdk).

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
- In V3, we can manage consent via `client.preferences.getInboxIdConsent(inboxId)`. However, we recommend that you now manage consent at the conversation level by `conversationId`. To learn more, see [Support user consent preferences](/inboxes/user-consent/support-user-consent#support-user-consent-preferences-to-provide-spam-free-inboxes).

## Summary of notable changes

| Purpose | V2 method | V3 equivalent |
| --- | --- | --- |
| Create a new conversation | `findOrCreateDm(bo.address);` | `findOrCreateDm(bo.inboxId);` |
| Loading messages | `listBatchMessages` | `list()` |
| Push notification decryption | `fromInvite`, `fromIntro` | `fromWelcome` |
| Get topic IDs for push notifications | `/xmtp/0/invite-$address/proto` | `/xmtp/mls/1/w-$installationId/proto` |
| Create client | `client.createFromKeyBundle` | `client.build` |
| Sign a message | `client.privateKeyBundle.sign(message)` | `client.signWithInstallationKey(message)` |
| Verify a signature | `Signature.verify(signature)` | `client.verifyInstallationSignature(message, signature, installationId)` |
| Manage consent | `client.contacts.consentList` | `client.preferences.getInboxIdConsent(inboxId)` |

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

To ensure continuity, users will still be able to access their V2 communications in read-only format using [https://legacy.xmtp.chat/](https://legacy.xmtp.chat/).

### Can I use V2 conversations to seed the conversation list in my app built with V3?

While we don’t recommend it, you can store V2 conversations in a local database that you manage, and then, on the first install, your app can try to create V3 DM conversations using the peer addresses in the V2 conversations. If you go this route, ensure that you store the **allowed** V2 conversations only so you don’t port over spam.

We don’t recommend using this approach because not all of the peer addresses may be reachable on the V3 network, which means that only some conversations would be seeded.
