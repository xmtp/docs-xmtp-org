# Update your app to use an XMTP SDK with Gateway support

Starting on October 7, 2025, you'll be able to update your app to use an XMTP SDK version that supports XMTP Gateway helpers, enabling your app to communicate with your XMTP Gateway.

- [Browser SDK >=vX.X](#TODO)
- [Node SDK >=vX.X](#TODO)
- [React Native SDK >=vX.X](#TODO)
- [Kotlin SDK >=vX.X](#TODO)
- [Swift SDK >=vX.X](#TODO)

## Prerequisites

- [XMTP Gateway](/fund-apps/run-gateway) is running, or using built-in XMTP Gateway provided by XMTP Node SDK, with authentication working
- [Payer created and funded](/fund-apps/fund-payer) with USDC on Base
  
## Update your app

:::code-group

```jsx [Browser]
const client = await Client.create(signer, {
  env: 'mainnet',
  payerService: YOUR_PAYER_URL,
  payerAuthTokenFetcher: authTokenFetcher
})

```

```jsx [Node]
"@xmtp/sdk-js": "^12.0.0"  // Update version, payer included

```

```swift [Swift]
// iOS example
let client = try await XMTPClient.create(
  wallet: wallet,
  options: .init(
    api: .init(env: .mainnet),
    payerEndpoint: YOUR_PAYER_URL
  )
)

```

:::