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
  SNIPPET FROM NAOMI
  ```

  ```swift [Swift]
  SNIPPET FROM NAOMI
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
  class SCWWallet : SigningKey {
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
  SNIPPET FROM NAOMI
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
Client.createV3(SigningKey, {
  env: "production", // 'local' | 'dev' | 'production'
  enableV3: true,
  dbEncryptionKey: keyBytes, // 32 bytes
});

// Should work the same as it does in V2 `Client.create(SigningKey, ClientOptions)`
```

```kotlin [Kotlin]
val options = ClientOptions(
    ClientOptions.Api(XMTPEnvironment.PRODUCTION, true),
    appContext = ApplicationContext(),
    dbEncryptionKey = keyBytes
)
val client = Client().create(
        account = SigningKey,
        options = options
    )
```

```swift [Swift]
SNIPPET FROM NAOMI
```

:::

### Build an existing client

Build, or resume, an existing client that's logged in and has an existing local database.

:::code-group

```tsx [React Native]
Client.buildV3(address, {
  env: "production", // 'local' | 'dev' | 'production'
  enableV3: true,
  dbEncryptionKey: keyBytes, // 32 bytes
});

// Replaces V2 `Client.createFromKeyBundle(bundle)`
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
SNIPPET FROM NAOMI
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
const canMessage = await client.canGroupMessage([
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
SNIPPET FROM NAOMI
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
SNIPPET FROM NAOMI
```

```swift [Swift]
SNIPPET FROM NAOMI
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

// Replaces V2 functionality `client.conversations.newConversation(address)`
```

```kotlin [Kotlin]
SNIPPET FROM NAOMI
```

```swift [Swift]
SNIPPET FROM NAOMI
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
await alix.conversations.syncConversations();

// Does not refetch existing conversations
```

```kotlin [Kotlin]
SNIPPET FROM NAOMI
```

```swift [Swift]
SNIPPET FROM NAOMI
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
SNIPPET FROM NAOMI
```

```swift [Swift]
SNIPPET FROM NAOMI
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
// List ConversationContainer items by createdAt date
await alix.conversations.listConversations();

// List ConversationContainer items by lastMessage but only return specified fields
await alix.conversations.listConversations(
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

// Replaces V2 functionality `client.conversations.list()`
```

```kotlin [Kotlin]
SNIPPET FROM NAOMI
```

```swift [Swift]
SNIPPET FROM NAOMI
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
await alix.conversations.streamConversations(
  async (conversation: ConversationContainer<any>) => {
    // Received a conversation
  }
);

// Replaces V2 `client.conversations.stream()`
```

```kotlin [Kotlin]
SNIPPET FROM NAOMI
```

```swift [Swift]
SNIPPET FROM NAOMI
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
await alix.conversations.streamAllConversationMessages(
  async (message: DecodedMessage<any>) => {
    // Received a message
  }
);

// Replaces V2 `client.conversations.streamAllMessages()`
```

```kotlin [Kotlin]
SNIPPET FROM NAOMI
```

```swift [Swift]
SNIPPET FROM NAOMI
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
await alix.conversations.findDm(bo.address);
```

```kotlin [Kotlin]
SNIPPET FROM NAOMI
```

```swift [Swift]
SNIPPET FROM NAOMI
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
