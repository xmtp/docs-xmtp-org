## Step 5: Upgrade Client Libraries (October 7)

### The Final Step

Once your infrastructure is ready, upgrading is straightforward:

- XMTP Gateway is running (or using Node.js)
- Authentication is working
- USDC funding process established
- **Just update dependencies and connect**

### Quick Examples

**Node.js** (Built-in payer):

```jsx
"@xmtp/sdk-js": "^12.0.0"  // Update version, payer included

```

**React/Web** (External payer required):

```jsx
const client = await Client.create(signer, {
  env: 'mainnet',
  payerService: YOUR_PAYER_URL,
  payerAuthTokenFetcher: authTokenFetcher
})

```

**Mobile** (External payer required):

```swift
// iOS example
let client = try await XMTPClient.create(
  wallet: wallet,
  options: .init(
    api: .init(env: .mainnet),
    payerEndpoint: YOUR_PAYER_URL
  )
)

```