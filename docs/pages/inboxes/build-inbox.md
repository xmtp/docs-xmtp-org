# Build a chat inbox

## Create or build a client

### Create an account SigningKey

This code defines two functions that convert different types of Ethereum accounts—Externally Owned Accounts (EOAs) and Smart Contract Wallets (SCWs)—into a unified `Signer` interface. This ensures that both account types conform to a common interface for message signing and deriving shared secrets as per MLS (Message Layer Security) requirements.

- For an EOA, the `convertEOAToSigner` function creates a signer that can get the account address and sign messages and has placeholder methods for wallet type, chain ID, and block number.

  :::code-group

  ```tsx [React Native]
  // Example EOA
  export function convertEOAToSigner(eoaAccount: EOAAccount): Signer {
    return {
      getAddress: async () => eoaAccount.address,
      signMessage: async (message: string | Uint8Array) =>
        eoaAccount.signMessage({
          message: typeof message === "string" ? message : { raw: message },
        }),
      walletType: () => undefined, // Default: 'EOA'
      getChainId: () => undefined,
      getBlockNumber: () => undefined,
    };
  }
  ```

  ```kotlin [Kotlin]
  class EOAWallet : SigningKey {
    override val address: String
        get() = walletAddress

    override suspend fun sign(message: String): Signature {
			val signature = key.sign(data)
			return signature
    }

    override suspend fun sign(data: ByteArray): Signature {
			val signature = key.sign(message: message)
			return signature
    }
  }
  ```

  ```swift [Swift]
	public struct EOAWallet: SigningKey {
		public var address: String {
			walletAddress
		}

		public func sign(_ data: Data) async throws -> XMTPiOS.Signature {
			let signature = try await key.sign(data)
			return signature
		}

		public func sign(message: String) async throws -> XMTPiOS.Signature {
			let signature = try await key.sign(message: message)
			return signature
		}
	}
  ```

  :::

- For an SCW, the `convertSCWToSigner` function similarly creates a signer but includes specific implementations for wallet type and chain ID, and an optional block number computation.

  :::code-group

  ```tsx [React Native]
  // Example SCW
  export function convertSCWToSigner(scwAccount: SCWAccount): Signer {
    return {
      getAddress: async () => scwAccount.address,
      signMessage: async (message: string) => {
        const byteArray = await scwAccount.signMessage(message);
        return ethers.utils.hexlify(byteArray); // Convert to hex string
      },
      walletType: () => "SCW",
      getChainId: async () => 8453, // https://chainlist.org/
      getBlockNumber: async () => undefined, // Optional: will be computed at run
    };
  }
  ```

  ```kotlin [Kotlin]
  class SCWallet : SigningKey {
    override val address: String
        get() = walletAddress

    override val type: WalletType
        get() = WalletType.SCW

    override var chainId: Long? = 8453, // https://chainlist.org/

    override var blockNumber: Long? = null, // Optional: will be computed at run

    override suspend fun signSCW(message: String): ByteArray {
        val digest = Signature.newBuilder().build().ethHash(message)
        val replaySafeHash = smartWallet.replaySafeHash(digest).send()
        val signature =
            Sign.signMessage(replaySafeHash, contractDeployerCredentials.ecKeyPair, false)
        val signatureBytes = signature.r + signature.s + signature.v
        val tokens = listOf(
            Uint(BigInteger.ZERO),
            DynamicBytes(signatureBytes)
        )
        val encoded = FunctionEncoder.encodeConstructor(tokens)
        val encodedBytes = Numeric.hexStringToByteArray(encoded)

        return encodedBytes
    }
  }
  ```

  ```swift [Swift]
	public struct SCWallet: SigningKey {
		public var address: String {
			walletAddress
		}

    public var chainId: Int64? {
			8453
		}

    public var blockNumber: Int64? {
			nil
		}

    public var type: WalletType {
			.SCW
		}

		public func signSCW(message: String) async throws -> Data {
			let signature = try await key.sign(message: message)
			return signature.hexStringToByteArray
		}
	}
  ```

  :::

### Create an XMTP client

Create an XMTP MLS client that can use the signing capabilities provided by the `SigningKey` parameter. This `SigningKey` links the client to the appropriate EOA or SCW.

:::code-group

```js [Node]
import { Client } from "@xmtp/node-sdk";

const client = await Client.create(alix.address, options /* optional */);
```

```js [Browser]
import { Client } from "@xmtp/browser-sdk";

const client = await Client.create(alix.address, options /* optional */);
```

```tsx [React Native]
Client.create(SigningKey, {
  env: "production", // 'local' | 'dev' | 'production'
  dbEncryptionKey: keyBytes, // 32 bytes
});
```

```kotlin [Kotlin]
val options = ClientOptions(
    ClientOptions.Api(XMTPEnvironment.PRODUCTION, true),
    appContext = ApplicationContext(),
    dbEncryptionKey = keyBytes // 32 bytes
)
val client = Client().create(
        account = SigningKey,
        options = options
    )
```

```swift [Swift]
let options = ClientOptions.init(
  api: .init(env: .production, isSecure: true),
  dbEncryptionKey: keyBytes // 32 bytes
)
let client = try await Client.create(
  account: SigningKey,
  options: options
)
```

:::

#### Configure an XMTP client

You can configure an XMTP client with these parameters of `Client.create`:

| Parameter       | Default                | Description                                  |
| --------------- | ---------------------- | -------------------------------------------- |
| env             | `DEV`                  | Connect to the specified XMTP network environment. Valid values include `DEV`, `PRODUCTION`, or `LOCAL`. For important details about working with these environments, see [XMTP DEV, PRODUCTION, and LOCAL network environments](#xmtp-dev-production-and-local-network-environments). |
| appContext      | `REQUIRED`             | The app context used to create and access the local database. |
| dbEncryptionKey | `REQUIRED`             | A 32-byte `ByteArray` used to encrypt the local database. |
| historySyncUrl  | `https://message-history.dev.ephemera.network/` | The history sync URL used to specify where history can be synced from other devices on the network. For production apps, use `message-history.production.ephemera.network` |
| appVersion      | `undefined`            | Add a client app version identifier that's included with API requests.<br/>For example, you can use the following format: `appVersion: APP_NAME + '/' + APP_VERSION`.<br/>Setting this value provides telemetry that shows which apps are using the XMTP client SDK. This information can help XMTP core developers provide support to app developers, especially around communicating important SDK updates, including deprecations and required updates. |

#### XMTP DEV, PRODUCTION, and LOCAL network environments

XMTP provides `DEV`, `PRODUCTION`, and `LOCAL` network environments to support the development phases of your project.

The `PRODUCTION` and `DEV` networks are completely separate and not interchangeable.

For example, an XMTP identity on the `DEV` network is completely distinct from the XMTP identity on the `PRODUCTION` network, as are the messages associated with these identities. In addition, XMTP identities and messages created on the `DEV` network can't be accessed from or moved to the `PRODUCTION` network, and vice versa.

:::tip
When you [create a client](/inboxes/build-inbox/#create-an-xmtp-client), it connects to the XMTP `DEV` environment by default. Use the `env` parameter to explicitly set your client's network environment.
:::

Here are some best practices for when to use each environment:

- `DEV`: Use to have a client communicate with the `DEV` network. As a best practice, set `env` to `DEV` while developing and testing your app. Follow this best practice to isolate test messages to `DEV` inboxes.

- `PRODUCTION`: Use to have a client communicate with the `PRODUCTION` network. As a best practice, set `env` to `PRODUCTION` when your app is serving real users. Follow this best practice to isolate messages between real-world users to `PRODUCTION` inboxes.

- `LOCAL`: Use to have a client communicate with an XMTP node you are running locally. For example, an XMTP node developer can set `env` to `LOCAL` to generate client traffic to test a node running locally.

The `PRODUCTION` network is configured to store messages indefinitely. XMTP may occasionally delete messages and keys from the `DEV` network, and will provide advance notice in the [XMTP Community Forms](https://community.xmtp.org/).

### Build an existing client

Build, or resume, an existing client that's logged in and has an existing local database.

:::code-group

```tsx [React Native]
Client.build(address, {
  env: "production", // 'local' | 'dev' | 'production'
  dbEncryptionKey: keyBytes, // 32 bytes
});
```

```kotlin [Kotlin]
val options = ClientOptions(
    ClientOptions.Api(XMTPEnvironment.PRODUCTION, true),
    appContext = ApplicationContext(),
    dbEncryptionKey = keyBytes
)
val client = Client().build(
        address = address,
        options = options
    )
```

```swift [Swift]
let options = ClientOptions.init(
  api: .init(env: .production, isSecure: true),
  dbEncryptionKey: keyBytes // 32 bytes
)
let client = try await Client.build(
  address: address,
  options: options
)
```

:::

## Check if an address is reachable

The first step to creating a conversation is to verify that participants’ addresses are reachable on XMTP. The `canGroupMessage` method checks each address’ compatibility, returning a response indicating whether each address can receive messages.

Once you have the verified addresses, you can create a new conversation, whether it's a group chat or direct message (DM).

:::code-group

```js [Node]
import { Client } from "@xmtp/node-sdk";

const client = await Client.create(alix.address);
// response is a Map of string (address) => boolean (is reachable)
const response = await client.canMessage([bo.address, caro.address]);
```

```js [Browser]
import { Client } from "@xmtp/browser-sdk";

const client = await Client.create(alix.address);
// response is a Map of string (address) => boolean (is reachable)
const response = await client.canMessage([bo.address, caro.address]);
```

```tsx [React Native]
// Request
const canMessage = await client.canMessage([
  '0xboAddress',
  '0xV2OnlyAddress',
  '0xBadAddress',
])

// Response
{
  "0xboAddress": true,
  "0xV2OnlyAddress": false,
  "0xBadAddress": false,
}
```

```kotlin [Kotlin]
// Request
val canMessage = client.canMessage(listOf('0xboAddress', '0xV2OnlyAddress','0xBadAddress'))

// Response
[
  "0xboAddress": true,
  "0xV2OnlyAddress": false,
  "0xBadAddress": false,
]
```

```swift [Swift]
// Request
let canMessage = try await client.canMessage(["0xboAddress", "0xV2OnlyAddress","0xBadAddress"])

// Response
[
  "0xboAddress": true,
  "0xV2OnlyAddress": false,
  "0xBadAddress": false,
]
```

:::

:::tip
Regarding how to handle addresses that aren’t reachable, the XMTP V3.0.0 release notes will outline the next steps to ensure smooth onboarding for all participants.
:::

## Create a conversation

### Create a new group chat

Once you have the verified addresses, create a new group chat:

:::code-group

```js [Node]
import { Client } from "@xmtp/node-sdk";

const client = await Client.create(alix.address);
const group = await client.conversations.newGroup(
  [bo.address, caro.address],
  createGroupOptions /* optional */
);
```

```js [Browser]
import { Client } from "@xmtp/browser-sdk";

const client = await Client.create(alix.address);
const group = await client.conversations.newGroup(
  [bo.address, caro.address],
  createGroupOptions /* optional */
);
```

```tsx [React Native]
// New Group
const group = await alix.conversations.newGroup([bo.address, caro.address]);

// New Group with Metadata
const group = await alix.conversations.newGroup([bo.address, caro.address], {
  name: "The Group Name",
  imageUrlSquare: "www.groupImage.com",
  description: "The description of the group",
  permissionLevel: "admin_only", // 'all_members' | 'admin_only'
});
```

```kotlin [Kotlin]
// New Group
val group = alix.conversations.newGroup(listOf(bo.address, caro.address))

// New Group with Metadata
val group = alix.conversations.newGroup(listOf(bo.address, caro.address),
  permissionLevel = GroupPermissionPreconfiguration.ALL_MEMBERS, // ALL_MEMBERS | ADMIN_ONLY
  groupName = "The Group Name",
  groupImageUrlSquare = "www.groupImage.com",
  groupDescription = "The description of the group",
)
```

```swift [Swift]
// New Group
let group = try await alix.conversations.newGroup([bo.address, caro.address])

// New Group with Metadata
let group = try await alix.conversations.newGroup([bo.address, caro.address],
  permissionLevel: .admin_only, // .all_members | .admin_only
  groupName: "The Group Name",
  groupImageUrlSquare: "www.groupImage.com",
  groupDescription: "The description of the group",
)
```

:::

### Create a new DM

Once you have the verified addresses, create a new DM:

:::code-group

```js [Node]
import { Client } from "@xmtp/node-sdk";

const client = await Client.create(alix.address, options /* optional */);
const group = await client.conversations.newDm(bo.address);
```

```js [Browser]
import { Client } from "@xmtp/browser-sdk";

const client = await Client.create(alix.address, options /* optional */);
const group = await client.conversations.newDm(bo.address);
```

```tsx [React Native]
const dm = await alix.conversations.findOrCreateDm(bo.address);
```

```kotlin [Kotlin]
val dm = alix.conversations.findOrCreateDm(bo.address)

// calls the above function under the hood but returns a type conversation instead of a dm
val conversation = client.conversations.newConversation(address)
```

```swift [Swift]
let dm = try await alix.conversations.findOrCreateDm(with: bo.address)

// calls the above function under the hood but returns a type conversation instead of a dm
let conversation = try await client.conversations.newConversation(address)
```

:::

## List conversations and messages

### List new group chats or DMs

Get any new group chats or DMs from the network:

:::code-group

```js [Node]
import { Client } from "@xmtp/node-sdk";

const client = await Client.create(alix.address);
await client.conversations.sync();
```

```js [Browser]
import { Client } from "@xmtp/browser-sdk";

const client = await Client.create(alix.address);
await client.conversations.sync();
```

```tsx [React Native]
await alix.conversations.sync();

// Does not refetch existing conversations
```

```kotlin [Kotlin]
alix.conversations.sync()
```

```swift [Swift]
try await alix.conversations.sync()
```

:::

### List new messages

Get new messages from the network for all existing group chats and DMs in the local database:

:::code-group

```js [Node]
import { Client } from "@xmtp/node-sdk";

const client = await Client.create(alix.address);
await client.conversations.syncAll();
```

```js [Browser]
import { Client } from "@xmtp/browser-sdk";

const client = await Client.create(alix.address);
await client.conversations.syncAll();
```

```tsx [React Native]
await alix.conversations.syncAllConversations();

// Does not refetch existing messages or messages for inactive group chat conversations
```

```kotlin [Kotlin]
alix.conversations.syncAllConversations()
```

```swift [Swift]
try await alix.conversations.syncAllConversations()
```

:::

#### Handle unsupported content types

As more [custom](/inboxes/content-types/content-types#create-a-custom-content-type) and [standards-track](/inboxes/content-types/content-types#standards-track-content-types) content types are introduced into the XMTP ecosystem, your app may encounter content types it does not support. This situation, if not handled properly, could lead to app crashes.

Each message is accompanied by a `contentFallback` property, which offers a descriptive string representing the content type's expected value. It's important to note that content fallbacks are immutable and are predefined in the content type specification. In instances where `contentFallback` is `undefined`, such as read receipts, it indicates that the content is not intended to be rendered. If you're venturing into creating custom content types, you're provided with the flexibility to specify a custom fallback string. For a deeper dive into this, see [Build custom content types](/inboxes/content-types/custom).

:::code-group

```jsx [JavaScript]
const codec = client.codecFor(content.contentType);
if (!codec) {
  /*Not supported content type*/
  if (message.contentFallback !== undefined) {
    return message.contentFallback;
  }
  // Handle other types like ReadReceipts which are not meant to be displayed
}
```

```tsx [React]
import { useClient, ContentTypeId } from "@xmtp/react-sdk";
const { client } = useClient();

const contentType = ContentTypeId.fromString(message.contentType);
const codec = client.codecFor(contentType);
if (!codec) {
  /*Not supported content type*/
  if (message.contentFallback !== undefined) {
    return message.contentFallback;
  }
  // Handle other types like ReadReceipts which are not meant to be displayed
}
```

```kotlin [Kotlin]
val codec = client.codecRegistry.find(options?.contentType)
if (!codec) {
  /*Not supported content type*/
  if (message.contentFallback != null) {
    return message.contentFallback
  }
  // Handle other types like ReadReceipts which are not meant to be displayed
}
```

```swift [Swift]
let codec = client.codecRegistry.find(for: contentType)
if (!codec) {
  /*Not supported content type*/
  if (message.contentFallback != null) {
    return message.contentFallback
  }
  // Handle other types like ReadReceipts which are not meant to be displayed
}
```

```jsx [React Native]
//contentTypeID has the following structure `${contentType.authorityId}/${contentType.typeId}:${contentType.versionMajor}.${contentType.versionMinor}`;
const isRegistered = message.contentTypeID in client.codecRegistry;
if (!isRegistered) {
  // Not supported content type
  if (message?.fallback != null) {
    return message?.fallback;
  }
  // Handle other types like ReadReceipts which are not meant to be displayed
}
```
:::

### List existing group chats or DMs

Get a list of existing group chats or DMs in the local database, ordered either by `createdAt` date or `lastMessage`.

:::code-group

```js [Node]
import { Client } from "@xmtp/node-sdk";

const client = await Client.create(alix.address);
const allConversations = await client.conversations.list();
const allGroups = await client.conversations.listGroups();
const allDms = await client.conversations.listDms();
```

```js [Browser]
import { Client } from "@xmtp/browser-sdk";

const client = await Client.create(alix.address);
const allConversations = await client.conversations.list();
const allGroups = await client.conversations.listGroups();
const allDms = await client.conversations.listDms();
```

```tsx [React Native]
// List Conversation items by createdAt date
await alix.conversations.list();

// List Conversation items by lastMessage but only return specified fields
await alix.conversations.list(
  {
    members: false,
    consentState: false,
    description: false,
    creatorInboxId: false,
    addedByInboxId: false,
    isActive: false,
    lastMessage: true,
  },
  "lastMessage"
); // 'createdAt' | 'lastMessage'
```

```kotlin [Kotlin]
// List conversations (both groups and dms)
val conversations = alix.conversations.list()
val orderFilteredConversations = client.conversations.list(consentState: ALLOWED, order: LAST_MESSAGE)

// List just dms
val conversations = alix.conversations.listDms()
val orderFilteredConversations = client.conversations.listDms(consentState: ALLOWED, order: LAST_MESSAGE)

//List just groups
val conversations = alix.conversations.listGroups()
val orderFilteredConversations = client.conversations.listGroups(consentState: ALLOWED, order: LAST_MESSAGE)

```

```swift [Swift]
// List conversations (both groups and dms)
let conversations = try await alix.conversations.list()
let orderFilteredConversations = try await client.conversations.list(consentState: .allowed, order: .last_message)

// List just dms
let conversations = try await alix.conversations.listDms()
let orderFilteredConversations = try await client.conversations.listDms(consentState: .allowed, order: .last_message)

//List just groups
let conversations = try await alix.conversations.listGroups()
let orderFilteredConversations = try await client.conversations.listGroups(consentState: .allowed, order: .last_message)
```

:::

## Stream conversations and messages

### Stream all group chats and DMs

Listens to the network for new group chats and DMs. Whenever a new conversation starts, it triggers the provided callback function with a [`ConversationContainer` object](#conversationcontainer-interface). This allows the client to immediately respond to any new group chats or DMs initiated by other users.

:::code-group

```js [Node]
import { Client } from "@xmtp/node-sdk";

const client = await Client.create(alix.address);
const stream = await client.conversations.stream();
// to stream only groups, use `client.conversations.streamGroups()`
// to stream only dms, use `client.conversations.streamDms()`

try {
  for await (const conversation of stream) {
    // Received a conversation
  }
} catch (error) {
  // log any stream errors
  console.error(error);
}
```

```tsx [React Native]
await alix.conversations.stream(
  async (conversation: Conversation<any>) => {
    // Received a conversation
  }
);
```

```kotlin [Kotlin]
alix.conversations.stream(type: /* OPTIONAL DMS, GROUPS, ALL */).collect {
  // Received a conversation
}
```

```swift [Swift]
for await convo in try await alix.conversations.stream(type: /* OPTIONAL .dms, .groups, .all */) {
  // Received a conversation
}
```

:::

### Stream all group chat and DM messages

Listens to the network for new messages within all active group chats and DMs. Whenever a new message is sent to any of these conversations, the callback is triggered with a `DecodedMessage` object. This keeps the inbox up to date by streaming in messages as they arrive.

:::code-group

```js [Node]
import { Client } from "@xmtp/node-sdk";

const client = await Client.create(alix.address);
const stream = await client.conversations.streamAllMessages();
// to stream only group messages, use `client.conversations.streamAllGroupMessages()`
// to stream only dm messages, use `client.conversations.streamAllDmMessages()`

try {
  for await (const message of stream) {
    // Received a message
  }
} catch (error) {
  // log any stream errors
  console.error(error);
}
```

```tsx [React Native]
await alix.conversations.streamAllMessages(
  async (message: DecodedMessage<any>) => {
    // Received a message
  }
);
```

```kotlin [Kotlin]
alix.conversations.streamAllMessages(type: /* OPTIONAL DMS, GROUPS, ALL */).collect {
  // Received a message
}
```

```swift [Swift]
for await message in try await alix.conversations.streamAllMessages(type: /* OPTIONAL .dms, .groups, .all */) {
  // Received a message
}
```

:::

## Helper methods and class interfaces

### Conversation helper methods

Use these helper methods to quickly locate and access specific conversations—whether by ID, topic, group ID, or DM address—returning the appropriate ConversationContainer, group, or DM object.

:::code-group

```js [Node]
import { Client } from "@xmtp/node-sdk";

const client = await Client.create(alix.address);

// get a conversation by its ID
const conversationById = await client.conversations.getConversationById(
  conversationId
);

// get a message by its ID
const messageById = await client.conversations.getMessageById(messageId);

// get a 1:1 conversation by a peer's inbox ID
const dmByInboxId = await client.conversations.getDmByInboxId(peerInboxId);
```

```js [Browser]
import { Client } from "@xmtp/browser-sdk";

const client = await Client.create(alix.address);

// get a conversation by its ID
const conversationById = await client.conversations.getConversationById(
  conversationId
);

// get a message by its ID
const messageById = await client.conversations.getMessageById(messageId);

// get a 1:1 conversation by a peer's inbox ID
const dmByInboxId = await client.conversations.getDmByInboxId(peerInboxId);
```

```tsx [React Native]
// Returns a ConversationContainer
await alix.conversations.findConversation(conversation.id);
await alix.conversations.findConversationByTopic(conversation.topic);
// Returns a Group
await alix.conversations.findGroup(group.id);
// Returns a DM
await alix.conversations.findDmByAddress(bo.address);
```

```kotlin [Kotlin]
// Returns a ConversationContainer
alix.conversations.findConversation(conversation.id)
alix.conversations.findConversationByTopic(conversation.topic)
// Returns a Group
alix.conversations.findGroup(group.id)
// Returns a DM
alix.conversations.findDm(bo.address)
```

```swift [Swift]
// Returns a ConversationContainer
try alix.conversations.findConversation(conversation.id)
try alix.conversations.findConversationByTopic(conversation.topic)
// Returns a Group
try alix.conversations.findGroup(group.id)
// Returns a DM
try alix.conversations.findDm(bo.address)
```

:::

### ConversationContainer interface

Serves as a unified structure for managing both group chats and DMs. It provides a consistent set of properties and methods to seamlessly handle various conversation types.

- React Native: https://github.com/xmtp/xmtp-react-native/blob/main/src/lib/ConversationContainer.ts

### Group class

Represents a group chat conversation, providing methods to manage group-specific functionalities such as sending messages, synchronizing state, and handling group membership.

- React Native: https://github.com/xmtp/xmtp-react-native/blob/main/src/lib/Group.ts

### Dm class

Represents a DM conversation, providing methods to manage one-on-one communications, such as sending messages, synchronizing state, and handling message streams.

- React Native: https://github.com/xmtp/xmtp-react-native/blob/main/src/lib/Dm.ts
