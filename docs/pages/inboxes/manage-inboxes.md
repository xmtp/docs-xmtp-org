# Manage XMTP inboxes and signatures

# Manage XMTP inboxes

The first time someone uses an installation of your app, your app creates an inbox ID and installation ID associated with their wallet address. To do this, you [create a client](https://docs.xmtp.org/inboxes/build-inbox#create-an-xmtp-client) for their wallet address. 

The client creates an inbox ID and installation ID associated with the wallet address. By default, this wallet address is designated as the recovery address. A recovery address will always have the same inbox ID and cannot be reassigned to a different inbox ID. 

![image.png](Manage%20XMTP%20inboxes%20and%20signatures%2014630823ce92805f9b73e302a4b6beaf/image.png)

Each time you make a subsequent call to create a client for the same wallet address, the client uses the same inbox ID, but creates a new installation ID.

![image.png](Manage%20XMTP%20inboxes%20and%20signatures%2014630823ce92805f9b73e302a4b6beaf/image%201.png)

You can enable a user to add multiple wallet addresses to their inbox. Added addresses use the same inbox ID and the installation ID of the installation used to add the address.

![image.png](Manage%20XMTP%20inboxes%20and%20signatures%2014630823ce92805f9b73e302a4b6beaf/image%202.png)

You can enable a user to remove a wallet address from their inbox. You cannot remove the recovery wallet address. 

## Add a wallet address to an inbox

```jsx
// RN
await client.addAccount(walletToAdd)

// Kotlin
client.addAccount(walletToAdd)

// Swift
try await client.addAccount(newAccount: walletToAdd)
```

## Remove a wallet address from an inbox

<aside>
💡

**Note**: You cannot remove a recovery wallet.

</aside>

```jsx
// RN
await client.removeAccount(recoveryWallet, addressToRemove)

// Kotlin
client.removeAccount(recoveryWallet, addressToRemove)

// Swift
try await client.removeAccount(recoveryAccount: recoveryWallet, addressToRemove: addressToRemove)
```

## Revoke all other installations

Your user may encounter a case where a wallet address for one of their installation IDs gets compromised:

![image.png](Manage%20XMTP%20inboxes%20and%20signatures%2014630823ce92805f9b73e302a4b6beaf/image%203.png)

In this case, you can revoke the address’ access to all other installations:

![image.png](Manage%20XMTP%20inboxes%20and%20signatures%2014630823ce92805f9b73e302a4b6beaf/image%204.png)

```jsx
// RN
await client.revokeAllOtherInstallations(recoveryWallet)

// Kotlin
client.revokeAllOtherInstallations(recoveryWallet)

// Swift
try await client.revokeAllOtherInstallations(signingKey: recoveryWallet)
```

## View the inbox state

Find an `inboxId` for an address:

```jsx
// RN
const inboxId = await client.inboxIdFromAddress(address)

// Kotlin
val inboxId = client.inboxIdFromAddress(address)

// Swift
let inboxId = try await client.inboxIdFromAddress(address: address)
```

View the state of any inbox to see the addresses, installations, and other information associated with the `inboxId`.

```jsx
//Request
// RN
const state = await client.inboxState(true)
const states = await client.inboxStates(true, [inboxId, inboxId])

// Kotlin
val state = client.inboxState(true) 
val states = client.inboxStatesForInboxIds(true, listOf(inboxID, inboxID))

// Swift
let state = try await client.inboxState(refreshFromNetwork: true)
let states = try await client.inboxStatesForInboxIds(
	refreshFromNetwork: true,
	inboxIds: [inboxID, inboxID]
)

// Response
InboxState
{
	recoveryAddress: string,
	addresses: string[],
	installations: string[],
	inboxId: string,
}
```

## FAQ

### What happens when a user removes a wallet address?

- If a user has only one wallet address associated with their inbox:
- If a user has multiple wallet addresses associated with their inbox:

### How is the recovery address used?

If a user ???, they can use their recovery address to ???

To do this, provide a UX that enables a user to ???

### If a user created two inboxes using two wallet addresses, is there a way to combine the inboxes?

If a user logs in with wallet address 0x62EE...309c and creates inbox 1 and then logs in with wallet address 0xd0e4...DCe8 and creates inbox 2; there is no way to combine inbox 1 and 2.

![image.png](Manage%20XMTP%20inboxes%20and%20signatures%2014630823ce92805f9b73e302a4b6beaf/image%205.png)

You can add wallet address 0xd0e4...DCe8 to inbox 1, but both address 0x62EE...309c and 0xd0e4...DCe8 would then have access to inbox 1 only. Wallet address 0xd0e4...DCe8 would no longer be able to access inbox 2. 

![image.png](Manage%20XMTP%20inboxes%20and%20signatures%2014630823ce92805f9b73e302a4b6beaf/image%206.png)

To help users avoid this state, ensure that your UX surfaces their ability to add multiple wallet addresses to a single inbox.

### What happens if I remove a wallet address from an inbox ID and then initiate a client with the private key of the removed address?

**Does the client create a new inbox ID or does it match it with the original inbox ID the address was removed from?**

The wallet address used to initiate a client should be matched to its original inbox ID. 

You do have the ability to rotate inbox IDs if a user reaches the limit of 257 identity actions (adding, removing, or revoking addresses or installations). Hopefully, users won’t reach this limit, but if they do, inbox IDs have a nonce and can be created an indefinite number of times. 

However, anytime a new inbox ID is created for an address, the conversations and messages in any existing inbox ID associated with the address are lost.
