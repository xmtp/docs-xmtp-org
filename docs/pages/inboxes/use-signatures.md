# Use signatures with XMTP

There are several types of signatures used with XMTP.

## Sign with an external wallet

When a user creates, adds, removes, or revokes an XMTP inbox’s address or installation, a signature from an external wallet is required.

## Verify with an external wallet

 You can sign with an external wallet to verify that a payload was sent by a trusted sender. 

```jsx
// Kotlin
val isVerified = client.verifySignatureWithInstallationId(
            "message", 
            signature, 
            installationId
      )

// Swift
let isVerified = try client.verifySignatureWithInstallationId(
                message: "message",
                signature: signature,
                installationId: installationId
            )

```

## Sign with an XMTP key

You can sign something with XMTP keys. For example, you can sign with XMTP keys to send a payload to a backend.

```jsx
// RN
const signature = await client.signWithInstallationKey("message")

// Kotlin
val signature = client.signWithInstallationKey("message")

// Swift
let signature = try client.signWithInstallationKey(message: "message")
```

## Verify with XMTP keys

 You can also sign with XMTP keys to verify that a payload was sent by a trusted sender. 

```jsx
// RN
const isVerified = await client.verifySignature("message", signature)

// Kotlin
val isVerified = client.verifySignature("message", signature)

// Swift
let isVerified = try client.verifySignature(
            message: "message", 
            signature: signature
        )

```
