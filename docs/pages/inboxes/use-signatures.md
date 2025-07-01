# Use signatures with XMTP

With XMTP, you can use various types of signatures to sign and verify payloads.

## Sign with an external wallet

When a user creates, adds, removes, or revokes an XMTP inbox’s identity or installation, a signature is required.

## Advanced signature management (v4.2.5+)

The React Native SDK v4.2.5 introduces advanced signature management functions that provide fine-grained control over the signature process for installation revocation and other operations. These functions are particularly useful when you need to manage signatures independently of the main client workflows.

### Static signature management

These functions allow you to manage signatures statically without requiring an active client instance:

:::code-group

```jsx [React Native]
// Generate signature text for revoking installations
const signatureText = await ffiStaticRevokeInstallationsSignatureText(
  'production', // environment
  identity,     // PublicIdentity 
  inboxId,      // InboxId
  installationIds // InstallationId[]
)

// Add ECDSA signature (for EOA wallets)
await ffiStaticAddEcdsaSignature(
  signatureType,
  signatureBytes
)

// Add Smart Contract Wallet signature
await ffiStaticAddScwSignature(
  signatureType,
  signatureBytes,
  address,
  chainId,
  blockNumber // optional
)

// Apply the signature to complete the operation
await ffiStaticApplySignature(
  'production', // environment
  signatureType
)
```

:::

:::warning[Advanced usage]

These functions are delicate and should be used with caution. They are intended for advanced use cases where you need to manage the signature flow independently. For standard installation revocation, use the regular `revokeInstallations()` method instead.

:::

### Client-based signature management

These functions work with an active client instance for installation revocation:

:::code-group

```jsx [React Native]
// Generate signature text for revoking installations (client-based)
const signatureText = await client.ffiRevokeInstallationsSignatureText(installationIds)

// Generate signature text for revoking all other installations
const signatureText = await client.ffiRevokeAllOtherInstallationsSignatureText()

// Generate signature text for wallet operations
const addWalletText = await client.ffiAddWalletSignatureText(
  identityToAdd,
  allowReassignInboxId
)
const removeWalletText = await client.ffiRevokeWalletSignatureText(identityToRemove)

// Apply signature request after external signing
await client.ffiApplySignatureRequest()
```

:::

## Sign with an XMTP key

You can sign something with XMTP keys. For example, you can sign with XMTP keys to send a payload to a backend.

:::code-group

```js [Node]
const signature = client.signWithInstallationKey(signatureText);
```

```jsx [React Native]
const signature = await client.signWithInstallationKey(signatureText)
```

```kotlin [Kotlin]
val signature = client.signWithInstallationKey(signatureText)
```

```swift [Swift]
let signature = try client.signWithInstallationKey(message: signatureText)
```

:::

## Verify with the same installation that signed

 You can also sign with XMTP keys and verify that a payload was sent by the same client. 

:::code-group

```js [Node]
const isValidSignature = client.verifySignedWithInstallationKey(signatureText, signature);
```

```jsx [React Native]
const isVerified = await client.verifySignature(signatureText, signature)
```

```kotlin [Kotlin]
val isVerified = client.verifySignature(signatureText, signature)
```

```swift [Swift]
let isVerified = try client.verifySignature(
            message: signatureText, 
            signature: signature
        )

```

:::

## Verify with the same inbox ID that signed

You can use an XMTP key’s `installationId` to create a signature, then pass both the signature and `installationId` to another `installationId` with the same `inboxId` to verify that the signature came from a trusted sender.

:::code-group

```js [Node]
const isValidSignature = client.verifySignedWithPrivateKey(signatureText, signature, installationId);
```

```kotlin [Kotlin]
val isVerified = client.verifySignatureWithInstallationId(
            signatureText, 
            signature, 
            installationId
      )
```

```swift [Swift]
let isVerified = try client.verifySignatureWithInstallationId(
                message: signatureText,
                signature: signature,
                installationId: installationId
            )
```

:::
