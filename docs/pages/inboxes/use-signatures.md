# Use signatures with XMTP

With XMTP, you can use various types of signatures to sign and verify payloads.

To learn about the end user signing experience with apps built with XMTP, see [Wallet signatures with XMTP](/protocol/signatures).

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

## Verify with the same inboxId that signed

 You can sign with an XMTP keys installationId and then pass that signature and installationId to another installationId on the same inboxId to verify the signature was sent by a trusted sender. 

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
