# Create a EOA or SCW signer 

This code defines two functions that convert different types of Ethereum accounts—Externally Owned Accounts (EOAs) and Smart Contract Wallets (SCWs)—into a unified `Signer` interface.

This ensures that both account types conform to a common interface for message signing and deriving shared secrets as per MLS (Message Layer Security) requirements. `SigningKey` now supports only one sign method: `sign(signatureText: String): SignedData`.

## Create an EOA signer

For an EOA, the `convertEOAToSigner` function creates a signer that can get the account identity and sign messages and has placeholder methods for chain ID and block number. 

:::code-group 

```tsx [Browser] 
import type { Signer } from "@xmtp/browser-sdk"; 

const accountIdentity = { 
  kind: "ETHEREUM", // Specifies the identity type 
  identifier: "0x...", // Ethereum address as the identifier 
}; 

const signer: Signer = { 
  getIdentity: () => accountIdentity, 
  signMessage: async (message) => { 
    // return value from a signing method here 
  }, 
}; 
```

```tsx [Node] 
import type { Signer } from "@xmtp/node-sdk"; 

const accountIdentity = { 
  kind: "ETHEREUM", // Specifies the identity type 
  identifier: "0x...", // Ethereum address as the identifier 
}; 

const signer: Signer = { 
  getIdentity: () => accountIdentity, 
  signMessage: async (message) => { 
    // return value from a signing method here 
  }, 
}; 
```

```tsx [React Native] 
// Example EOA Signer 
export function convertEOAToSigner(eoaAccount: EOAAccount): Signer {
  return {
    getIdentifier: async () => new PublicIdentity(eoaAccount.address, 'ETHEREUM'),
    getChainId: () => undefined, // Provide a chain ID if available or return undefined
    getBlockNumber: () => undefined, // Block number is typically not available in Wallet, return undefined
    signerType: () => 'EOA', // "EOA" indicates an externally owned account
    signMessage: async (message: string) => {
      const signature = await eoaAccount.signMessage(message)

      return {
        signature,
      }
    },
  }
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

## Create an SCW signer

For an SCW, the `convertSCWToSigner` function similarly creates a signer but includes a specific implementation for chain ID and an optional block number computation.

:::code-group 

```tsx [Browser] 
import type { Signer } from "@xmtp/browser-sdk"; 

const accountIdentity = { 
  kind: "ETHEREUM", // Specifies the identity type 
  identifier: "0x...", // Smart Contract Wallet address 
}; 

const signer: Signer = { 
  getIdentity: () => accountIdentity, 
  signMessage: async (message) => { 
    // return value from a signing method here 
  }, 
  // These methods are required for smart contract wallets 
  getBlockNumber: () => undefined, // Optional block number 
  getChainId: () => BigInt(8453), // Example: Base chain ID 
};
```

```tsx [Node]
import type { Signer } from "@xmtp/node-sdk";

const accountIdentity = { 
  kind: "ETHEREUM", // Specifies the identity type 
  identifier: "0x...", // Smart Contract Wallet address 
};

const signer: Signer = { 
  getIdentity: () => accountIdentity, 
  signMessage: async (message) => { 
    // return value from a signing method here 
  },
  // These methods are required for smart contract wallets 
  getBlockNumber: () => undefined, // Optional block number 
  getChainId: () => BigInt(8453), // Example: Base chain ID 
}; 
```

```tsx [React Native] 
// Example SCW Signer 
export function convertSCWToSigner(scwAccount: SCWAccount): Signer {
  return {
    getIdentifier: async () => new PublicIdentity(scwAccount.address, 'ETHEREUM'),
    getChainId: () => 8453, // https://chainlist.org/ 
    getBlockNumber: () => undefined, // Optional: will be computed at runtime
    signerType: () => 'SCW', // "SCW" indicates an externally owned account
    signMessage: async (message: string) => {
      const byteArray = await scwAccount.signMessage(message); 
      const signature = ethers.utils.hexlify(byteArray); // Convert to hex string 
      
      return {
        signature,
      }
    },
  }
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
