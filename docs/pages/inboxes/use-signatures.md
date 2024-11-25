# Use signatures with XMTP

With XMTP, you can use various types of signatures to sign and verify payloads.

To learn about the end user signing experience with apps built with XMTP, see [Wallet signatures with XMTP](/protocol/signatures).

## Sign with an external wallet

When a user creates, adds, removes, or revokes an XMTP inbox’s address or installation, a signature from an external wallet is required.

## Verify with an external wallet

 You can sign with an external wallet to verify that a payload was sent by a trusted sender. 

:::code-group

```kotlin [Kotlin]
val isVerified = client.verifySignatureWithInstallationId(
            "message", 
            signature, 
            installationId
      )
```

```swift [Swift]
let isVerified = try client.verifySignatureWithInstallationId(
                message: "message",
                signature: signature,
                installationId: installationId
            )
```

:::

## Sign with an XMTP key

You can sign something with XMTP keys. For example, you can sign with XMTP keys to send a payload to a backend.

:::code-group

```js [Node]
const signature = client.signWithInstallationKey(signatureText);
```

```jsx [React Native]
const signature = await client.signWithInstallationKey("message")
```

```kotlin [Kotlin]
val signature = client.signWithInstallationKey("message")
```

```swift [Swift]
let signature = try client.signWithInstallationKey(message: "message")
```

:::

## Verify with XMTP keys

 You can also sign with XMTP keys to verify that a payload was sent by a trusted sender. 

:::code-group

```js [Node]
const isValidSignature = client.verifySignedWithInstallationKey(signatureText, signature);
```

```jsx [React Native]
const isVerified = await client.verifySignature("message", signature)
```

```kotlin [Kotlin]
val isVerified = client.verifySignature("message", signature)
```

```swift [Swift]
let isVerified = try client.verifySignature(
            message: "message", 
            signature: signature
        )

```

:::
