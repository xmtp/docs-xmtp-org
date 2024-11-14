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

If your custom content type generates interest within the developer community, consider proposing it as a standard content type through the [XIP process](/protocol/xips).

This document describes how to build custom content types using two examples:

- Build a basic custom content type that multiplies numbers
- Build an advanced custom content type that sends a transaction hash

## Basic: Build a custom content type that multiplies numbers

### Create the content type

Create the custom content type by creating a new file

:::code-group

```jsx [React Native]
import { content } from '@xmtp/proto'

import {JSContentCodec, Client, Conversation, DecodedMessage } from '@xmtp/react-native-sdk';

type EncodedContent = content.EncodedContent
type ContentTypeId = content.ContentTypeId

const ContentTypeMultiplyNumbers: ContentTypeId = {
  authorityId: 'com.example',
  typeId: 'multiplyNumbers',
  versionMajor: 1,
  versionMinor: 1,
}
class MultiplyNumbers {
  public readonly num1: number
  public readonly num2: number
  public readonly result: number

  constructor(num1: number, num2: number, result: number) {
    this.num1 = num1
    this.num2 = num2
    this.result = result
  }
}

class ContentTypeMultiplyNumberCodec
  implements JSContentCodec<MultiplyNumbers>
{
  get contentType() {
    return ContentTypeMultiplyNumbers
  }

  encode(decoded: MultiplyNumbers): EncodedContent {
    return {
      type: ContentTypeMultiplyNumbers,
      parameters: {
        num1: decoded.num1.toString(),
        num2: decoded.num2.toString(),
      },
      content: new Uint8Array(),
    }
  }

  decode(encoded: EncodedContent): MultiplyNumbers {
    const num1 = parseFloat(encoded.parameters['num1'] ?? '0')
    const num2 = parseFloat(encoded.parameters['num2'] ?? '0')
    return new MultiplyNumbers(num1, num2, num1 * num2)
  }

  fallback(content: MultiplyNumbers): string {
    return `MultiplyNumbersCodec is not supported`
  }

  // This method is optional and can be used to determine if the content type should trigger a push notification
  shouldPush(): boolean {
    return true;
  }
}
```

```kotlin [Kotlin]
import org.json.JSONObject
import org.xmtp.android.library.codecs.ContentTypeId
import org.xmtp.android.library.codecs.ContentTypeIdBuilder
import org.xmtp.android.library.codecs.ContentCodec
import org.xmtp.android.library.codecs.EncodedContent

data class NumberPair(val a: Double, val b: Double, var result: Double = 0.0)

data class MultiplyNumberCodec(
    override var contentType: ContentTypeId = ContentTypeIdBuilder.builderFromAuthorityId(
        authorityId = "your.domain",
        typeId = "multiply-number",
        versionMajor = 1,
        versionMinor = 0
    )
) : ContentCodec<NumberPair> {
    override fun encode(content: NumberPair): EncodedContent {
        val jsonObject = JSONObject()
        jsonObject.put("a", content.a)
        jsonObject.put("b", content.b)
        return EncodedContent.newBuilder().also {
            it.type = contentType
            it.content = jsonObject.toString().toByteStringUtf8()
        }.build()
    }

    override fun decode(content: EncodedContent): NumberPair {
        val jsonObject = JSONObject(content.content.toStringUtf8())
        val a = jsonObject.getDouble("a")
        val b = jsonObject.getDouble("b")
        val numberPair = NumberPair(a, b, a * b)
        return numberPair
    }

    override fun fallback(content: NumberPair): String? {
        return "Error: This app does not support numbers."
    }

    // This method is optional and can be used to determine if the content type should have a push notification
    override fun shouldPush(): Boolean {
      return true;
    }
}
```

```swift [Swift]
// A test of this content type can be found in the following PR: https://github.com/xmtp/xmtp-ios/pull/211
import XMTP

public struct MultiplyNumbers {
    public var num1: Double
    public var num2: Double
    public var result: Double?

    public init(num1: Double, num2: Double, result: Double? = nil) {
        self.num1 = num1
        self.num2 = num2
        self.result = result
    }
}

public struct MultiplyNumbersCodec: ContentCodec {
	public typealias T = MultiplyNumbers

	public var contentType: ContentTypeID {
		ContentTypeID(authorityID: "example.com", typeID: "number", versionMajor: 1, versionMinor: 1)
	}

  public func encode(content: MultiplyNumbers, client: Client) throws -> EncodedContent {
        var encodedContent = EncodedContent()
        encodedContent.type = contentType
        encodedContent.parameters["num1"] = String(content.num1)
        encodedContent.parameters["num2"] = String(content.num2)
        return encodedContent
    }

	public func decode(content: EncodedContent, client _: Client) throws -> MultiplyNumbers {
        guard let num1Str = content.parameters["num1"], let num1 = Double(num1Str),
              let num2Str = content.parameters["num2"], let num2 = Double(num2Str) else {
            throw CodecError.invalidContent
        }
        return MultiplyNumbers(num1: num1, num2: num2, result: num1 * num2)
    }

    public func fallback(content: MultiplyNumbers) throws -> String? {
		return "MultiplyNumbersCodec is not supported"
	}


    // This method is optional and can be used to determine if the content type should have a push notification
    public func shouldPush() -> Bool {
      return true;
    }
}
```

:::

### Configure the content type

Import and register the custom content type.

:::code-group

```jsx [React Native]
import { ContentTypeMultiplyNumberCodec } from "./xmtp-content-type-number";

const client = await Client.create({
  env: "production",
  codecs: [new ContentTypeMultiplyNumberCodec()],
});
```

```kotlin [Kotlin]
import org.xmtp.android.library.codecs.ContentTypeMultiplyNumberCodec

Client.register(codec = ContentTypeMultiplyNumberCodec())
```

```swift [Swift]
Client.register(codec: ContentTypeMultiplyNumberCodec())
```

:::

### Send the content

Send a message using the custom content type. This code sample demonstrates how to use the `MultiplyCodec` custom content type to perform multiplication operations.

:::code-group

```jsx [React Native]
const multiplyNumbers = new MultiplyNumbers(3, 7);
await bobConvo.send(multiplyNumbers, {
  contentType: ContentTypeMultiplyNumbers,
});
```

```kotlin [Kotlin]
import org.xmtp.android.library.codecs.ContentTypeMultiplyNumberCodec

val numbers = NumberPair(
    a = 3,
    b = 7,
)

conversation.send(
    content = numbers,
    options = SendOptions(contentType = ContentTypeMultiplyNumberCodec().contentType),
)
```

```swift [Swift]
let multiplyNumbers = MultiplyNumbers(num1: 3, num2: 2)
try await aliceConversation.send(content: multiplyNumbers, options: .init(contentType: ContentTypeMultiplyNumberCodec().contentType))
```

:::

### Receive the content

To use the result of the multiplication operation, add a renderer for the custom content type.

To handle unsupported content types, see the [fallback](/inboxes/build-inbox/#handle-unsupported-content-types) section.

:::code-group

```jsx [React Native]
// Because of this message content is now a function which returns the actual content. 
// You can get that content by call `message.content()` now instead of message.content. 
// This may involve more filtering on the message side to make sure you are handling different contentTypes appropriately.

if (message.contentTypeId === "com.example/multiplyNumbers:1.1") {
  return message.content(); // 21
}
```

```swift [Swift]
if let content: MultiplyNumbers = try? messages[0].content() {
    //content.result
}
```

:::

## Advanced: Build a custom content type to send a transaction hash

This tutorial covers how to build a custom content type that sends transaction hashes on the Polygon blockchain. This example also describes how to use the custom content type to render the transaction hash.

:::warning

Be aware that a custom content type may not be automatically recognized or supported by other applications, which could result in it being overlooked or only its fallback text being displayed.

:::

### Create the custom content type

Create a new file, `xmtp-content-type-transaction-hash.tsx`. This file hosts the `TransactionHash` class for encoding and decoding the custom content type.

```jsx [JavaScript]
import { ContentTypeId } from "@xmtp/xmtp-js";

export const ContentTypeTransactionHash = new ContentTypeId({
  authorityId: "your.domain",
  typeId: "transaction-hash",
  versionMajor: 1,
  versionMinor: 0,
});

export class ContentTypeTransactionHashCodec {
  get contentType() {
    return ContentTypeTransactionHash;
  }

  encode(hash) {
    return {
      type: ContentTypeTransactionHash,
      parameters: {},
      content: new TextEncoder().encode(hash),
    };
  }

  decode(content: { content: any }) {
    const uint8Array = content.content;
    const hash = new TextDecoder().decode(uint8Array);
    return hash;
  }
}
```

### Import and register the custom content type

```jsx [JavaScript]
import {
  ContentTypeTransactionHash,
  ContentTypeTransactionHashCodec,
} from "./xmtp-content-type-transaction-hash";

const xmtp = await Client.create(signer, {
  env: "dev",
});
xmtp.registerCodec(new ContentTypeTransactionHashCodec());
```

### Send a message using the custom content type

This code sample demonstrates how to use the `TransactionHash` content type to send a transaction.

```jsx [JavaScript]
// Create a wallet from a known private key
const wallet = new ethers.Wallet(privateKey);
console.log(`Wallet address: ${wallet.address}`);

//im using a burner wallet with MATIC from a faucet
//https://faucet.polygon.technology/

// Set up provider for Polygon Testnet (Mumbai)
const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc-mumbai.maticvigil.com",
);

// Connect the wallet to the provider
const signer = wallet.connect(provider);

// Define the recipient address and amount
const amount = ethers.utils.parseEther("0.01"); // Amount in ETH (0.01 in this case)

// Create a transaction
const transaction = {
  to: recipientAddress,
  value: amount,
};

// Sign and send the transaction
const tx = await signer.sendTransaction(transaction);
console.log(`Transaction hash: ${tx.hash}`);

const conversation = await xmtp.conversations.newConversation(WALLET_TO);
await conversation
  .send(tx.hash, {
    contentType: ContentTypeTransactionHash,
  })
  .then(() => {
    console.log("Transaction data sent", tx.hash);
  })
  .catch((error) => {
    console.log("Error sending transaction data: ", error);
  });
```

### Use the result of the hash

Add an async renderer for the custom content type.

```jsx [JavaScript]
if (message.contentType.sameAs(ContentTypeTransactionHash)) {
  // Handle ContentTypeAttachment
  return (
    <TransactionMonitor key={message.id} encodedContent={message.content} />
  );
}

const TransactionMonitor = ({ encodedContent }) => {
  const [retryCount, setRetryCount] = useState(0);

  const [transactionValue, setTransactionValue] = useState(null);

  useEffect(() => {
    const fetchTransactionReceipt = async () => {
      console.log(encodedContent);
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc-mumbai.maticvigil.com",
      );
      const receipt = await provider.getTransactionReceipt(encodedContent);
      const tx = await provider.getTransaction(encodedContent);
      if (tx && tx.value) {
        setTransactionValue(ethers.utils.formatEther(tx.value));
      }
    };
    fetchTransactionReceipt();
  }, [encodedContent, retryCount]);

  return transactionValue ? (
    <div>Transaction value: {transactionValue} ETH</div>
  ) : (
    <div>
      Waiting for transaction to be mined...
      <button onClick={() => setRetryCount(retryCount + 1)}>
        Refresh Status 🔄
      </button>
    </div>
  );
};
```