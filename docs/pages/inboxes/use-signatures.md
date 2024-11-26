# Use signatures with XMTP

With XMTP, you can use various types of signatures to sign and verify payloads.

## Sign with an external wallet

When a user creates, adds, removes, or revokes an XMTP inbox’s address or installation, a signature from an external wallet is required.

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
