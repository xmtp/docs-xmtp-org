# Create a EOA or SCW signer

XMTP SDKs support message signing with 2 different types of Ethereum accounts: Externally Owned Accounts (EOAs) and Smart Contract Wallets (SCWs). All SDK clients accept a signer object (or instance), which provides a method for signing messages.

## Create an Externally Owned Account signer

The EOA signer must have 3 properties: the account type, a function that returns the account identifier, and a function that signs messages.

:::code-group

```tsx [Browser]
import type { Signer, Identifier } from "@xmtp/browser-sdk";

const accountIdentifier: Identifier = {
  identifier: "0x...", // Ethereum address as the identifier
  identifierKind: "Ethereum", // Specifies the identity type
};

const signer: Signer = {
  type: "EOA",
  getIdentifier: () => accountIdentifier,
  signMessage: async (message: string): Uint8Array => {
    // typically, signing methods return a hex string
    // this string must be converted to bytes and returned in this function
  },
};
```

```tsx [Node]
import type { Signer, Identifier, IdentifierKind } from "@xmtp/node-sdk";

const accountIdentifier: Identifier = {
  identifier: "0x...", // Ethereum address as the identifier
  identifierKind: IdentifierKind.Ethereum, // Specifies the identity type
};

const signer: Signer = {
  type: "EOA",
  getIdentity: () => accountIdentifier,
  signMessage: async (message: string): Uint8Array => {
    // typically, signing methods return a hex string
    // this string must be converted to bytes and returned in this function
  },
};
```

```tsx [React Native]
// Example EOA Signer
export function convertEOAToSigner(eoaAccount: EOAAccount): Signer {
  return {
    getIdentifier: async () =>
      new PublicIdentity(eoaAccount.address, "ETHEREUM"),
    getChainId: () => undefined, // Provide a chain ID if available or return undefined
    getBlockNumber: () => undefined, // Block number is typically not available in Wallet, return undefined
    signerType: () => "EOA", // "EOA" indicates an externally owned account
    signMessage: async (message: string) => {
      const signature = await eoaAccount.signMessage(message);

      return {
        signature,
      };
    },
  };
}
```

```kotlin [Kotlin]
class EOAWallet : SigningKey {
    override val publicIdentity: PublicIdentity
      get() = PublicIdentity(
          IdentityKind.ETHEREUM,
          key.publicAddress
      )
    override val type: SignerType
      get() = SignerType.EOA

    override suspend fun sign(message: String): SignedData {
        val signature = key.sign(message = message)
        return SignedData(signature)
    }
}
```

```swift [Swift]
public struct EOAWallet: SigningKey {
    public var identity: PublicIdentity {
      return PublicIdentity(kind: .ethereum, identifier: key.publicAddress)
    }

    public var type: SignerType { .EOA }

    public func sign(message: String) async throws -> SignedData {
        let signature = try await key.sign(message: message)
        return SignedData(signature)
    }
}
```

:::

## Create a Smart Contract Wallet signer

The SCW signer has the same 3 required properties as the EOA signer, but also requires a function that returns the chain ID of the blockchain being used and an optional function that returns the block number to verify signatures against. If a function is not provided to retrieve the block number, the latest block number will be used.

Here is a list of supported chain IDs:

- chain_rpc_1     = string
- chain_rpc_8453  = string
- chain_rpc_42161 = string
- chain_rpc_10    = string
- chain_rpc_137   = string
- chain_rpc_324   = string
- chain_rpc_59144 = string
- chain_rpc_480   = string

Need support for a different chain ID? Please post your request to the [XMTP Community Forums](https://community.xmtp.org/c/general/ideas/54).

The details of creating an SCW signer are highly dependent on the wallet provider and the library you're using to interact with it. Here are some general guidelines to consider:

- **Wallet provider integration**: Different wallet providers (Safe, Argent, Rainbow, etc.) have different methods for signing messages. See the wallet provider documentation for more details.

- **Library selection**: Choose a library that supports your wallet provider (e.g., viem, ethers.js, web3.js). Each library has its own API for interacting with wallets. See the library documentation for more details.

- **Add an Ethereum-specific prefix**: Before signing, Ethereum requires a specific prefix to be added to the message. To learn more, see [ERC-191: Signed Data Standard](https://eips.ethereum.org/EIPS/eip-191). Libraries and wallet providers might add the prefix for you, so make sure you don't add the prefix twice.

- **Hash the prefixed message with Keccak-256**: The prefixed message is hashed using the Keccak-256 algorithm, which is Ethereum's standard hashing algorithm. This step creates a fixed-length representation of the message, ensuring consistency and security. Note that some wallet providers might handle this hashing internally.

- **Sign the replay-safe hash**: The replay-safe hash is signed using the private key of the SCW. This generates a cryptographic signature that proves ownership of the wallet and ensures the integrity of the message.

- **Convert the signature to a Uint8Array**: The resulting signature is converted to a `Uint8Array` format, which is required by the XMTP SDK for compatibility and further processing.

The code snippets below are examples only and will need to be adapted based on your specific wallet provider and library.

:::code-group

```tsx [Browser]
export const createSCWSigner = (
  address: `0x${string}`,
  walletClient: WalletClient,
  chainId: bigint,
): Signer => {
  return {
    type: "SCW",
    getIdentifier: () => ({
      identifier: address.toLowerCase(),
      identifierKind: "Ethereum",
    }),
    signMessage: async (message: string) => {
      const signature = await walletClient.signMessage({
        account: address,
        message,
      });
      return toBytes(signature);
    },
    getChainId: () => {
      return chainId;
    },
  };
```

```tsx [Node]
import type { Signer, Identifier, IdentifierKind } from "@xmtp/node-sdk";

const accountIdentifier: Identifier = {
  identifier: "0x...", // Ethereum address as the identifier
  identifierKind: IdentifierKind.Ethereum, // Specifies the identity type
};

const signer: Signer = {
  type: "SCW",
  getIdentity: () => accountIdentifier,
  signMessage: async (message: string): Uint8Array => {
    // typically, signing methods return a hex string
    // this string must be converted to bytes and returned in this function
  },
  getChainId: () => BigInt(8453), // Example: Base chain ID
};
```

```tsx [React Native]
// Example SCW Signer
export function convertSCWToSigner(scwAccount: SCWAccount): Signer {
  return {
    getIdentifier: async () =>
      new PublicIdentity(scwAccount.address, "ETHEREUM"),
    getChainId: () => 8453, // https://chainlist.org/
    getBlockNumber: () => undefined, // Optional: will be computed at runtime
    signerType: () => "SCW", // "SCW" indicates smart contract wallet account
    signMessage: async (message: string) => {
      const byteArray = await scwAccount.signMessage(message);
      const signature = ethers.utils.hexlify(byteArray); // Convert to hex string

      return {
        signature,
      };
    },
  };
}
```

```kotlin [Kotlin]
  class SCWallet : SigningKey {
    override val publicIdentity: PublicIdentity
      get() = PublicIdentity(
          IdentityKind.ETHEREUM,
          key.publicAddress
      )
    override val type: SignerType
      get() = SignerType.SCW

    override var chainId: Long? = 8453 // https://chainlist.org/
    override var blockNumber: Long? = null // Optional: will be computed at runtime

    override suspend fun sign(message: String): SignedData {
        val signature = key.sign(message = message)
        return SignedData(signature)
    }
}
```

```swift [Swift]
public struct SCWallet: SigningKey {
    public var identity: PublicIdentity {
      return PublicIdentity(kind: .ethereum, identifier: key.publicAddress)
    }

    public var chainId: Int64? {
        8453
    }

    public var blockNumber: Int64? {
        nil
    }

    public var type: SignerType { .SCW }

    public func sign(message: String) async throws -> SignedData {
        let signature = try await key.sign(message: message)
        return SignedData(signature.hexStringToByteArray )
    }
}
```

:::
