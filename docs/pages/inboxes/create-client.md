# Create or build a client

## Create an account SigningKey

This code defines two functions that convert different types of Ethereum accounts—Externally Owned Accounts (EOAs) and Smart Contract Wallets (SCWs)—into a unified `Signer` interface. This ensures that both account types conform to a common interface for message signing and deriving shared secrets as per MLS (Message Layer Security) requirements.

- For an EOA, the `convertEOAToSigner` function creates a signer that can get the account address and sign messages and has placeholder methods for wallet type, chain ID, and block number.
    
    ```tsx [React Native]
    // Example EOA
    export function convertEOAToSigner(eoaAccount: EOAAccount): Signer {
      return {
        getAddress: async () => eoaAccount.address,
        signMessage: async (message: string | Uint8Array) =>
          eoaAccount.signMessage({
            message: typeof message === 'string' ? message : { raw: message },
          }),
        walletType: () => undefined, // Default: 'EOA'
        getChainId: () => undefined,
        getBlockNumber: () => undefined,
      }
    }
    ```
    
- For an SCW, the `convertSCWToSigner` function similarly creates a signer but includes specific implementations for wallet type and chain ID, and an optional block number computation.
    
    ```tsx [React Native]
    // Example SCW
    export function convertSCWToSigner(scwAccount: SCWAccount): Signer {
      return {
        getAddress: async () => scwAccount.address,
        signMessage: async (message: string) => {
          const byteArray = await scwAccount.signMessage(message)
          return ethers.utils.hexlify(byteArray) // Convert to hex string
        },
        walletType: () => 'SCW',
        getChainId: async () => 8453, // https://chainlist.org/
        getBlockNumber: async () => undefined, // Optional: will be computed at run
      };
    }
    ```
    

## Create an XMTP client

Create an XMTP MLS client that can use the signing capabilities provided by the `SigningKey` parameter. This `SigningKey` links the client to the appropriate EOA or SCW.

```tsx [React Native]
Client.createV3(SigningKey, {
    env: 'production', // 'local' | 'dev' | 'production'
    enableV3: true,
    dbEncryptionKey: keyBytes, // 32 bytes
  })
```

*Should work the same as it does in V2 `Client.create(SigningKey, ClientOptions)`*