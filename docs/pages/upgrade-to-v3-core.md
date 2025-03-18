# Upgrade from XMTP V3 to XMTP V3-CORE

This document is for you if you are building on XMTP V3, which includes apps using:

- An XMTP v3.x.x mobile SDK
- An XMTP v0.x.x browser or node SDK

:::tip[Building on XMTP V2?]

If you are building an app on XMTP V3, which includes apps using an XMTP v2.x.x mobile SDK or the XMTP-JS SDK, see [Upgrade from XMTP V2 to XMTP V3-CORE](/upgrade-to-v3).

:::

XMTP V3-CORE provides support for the features expected by modern messaging apps while laying a strong foundation for the future. This is a stable and performant release that will allow for new features and is not expected to receive breaking changes in the near-term.

## Upgrade to XMTP V3-CORE

The process to upgrade an app built with XMTP V3 to V3-CORE is designed to be straightforward, with most functions in V3-CORE working as they did in V3. However, there are some notable differences, which we cover here and in these release notes.

🟢 For mobile apps, **upgrade to an XMTP mobile SDK >=v4.0.0** following the detailed instructions in these release notes:
- [React Native](https://github.com/xmtp/xmtp-js/releases/tag/v4.0.0)
- [Kotlin](https://github.com/xmtp/xmtp-android/releases/tag/v4.0.0)
- [Swift](https://github.com/xmtp/xmtp-ios/releases/tag/v4.0.0)

🟢 For web apps, **upgrade to an XMTP web SDK >=v1.0.0** following the detailed instructions in these release notes:
- [Browser](https://github.com/xmtp/xmtp-js/releases/tag/v1.0.0)
- [Node](https://github.com/xmtp/xmtp-js/releases/tag/v1.0.0)
- For additional guidance, try [xmtp.chat](https://xmtp.chat/), an interactive developer tool and chat app built with XMTP V3.

🟢 For agents, **explore [example agents](https://github.com/ephemeraHQ/xmtp-agent-examples)** built with the XMTP Node SDK >=v1.0.0.

## Primary XMTP identifier is now an inbox ID, not an Ethereum address

XMTP is evolving from using Ethereum account addresses (0x...) as the primary identifier to an inbox-based identity model. This change allows for broader support of different authentication mechanisms, including the currently supported [Externally Owned Accounts (EOAs) and Smart Contract Wallets (SCWs)](/inboxes/build-inbox#create-an-account-signer), as well as future support for Passkeys and other identity types.

Instead of assuming an Ethereum address as the unique identifier, developers should default to using the `inboxId`, where possible. An `inboxId` has a list of identity objects that explicitly includes the identity type (kind) and identifier. Some identity types, like Passkeys, do not have an associated onchain address, so using the `inboxId` provides a consistent way to identify users across different authentication methods.

For example:

```json
[
  {
    "kind": "ETHEREUM",
    "identifier": "0x1234567890abcdef1234567890abcdef12345678",
  },
  {
    "kind": "PASSKEY", // not yet supported; provided as an example only.
    "identifier": "AQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMk",
  }
]
```

This change ensures that XMTP identities are more extensible and adaptable, accommodating future improvements in authentication methods while maintaining backward compatibility for Ethereum-based accounts.

### Example: Supporting multiple identity types

With this new model, an app can now distinguish different identity types when creating a signer.

```tsx
function createSigner(account): Signer {
  return {
    getIdentity: async () => ({
      kind: account.isSCW ? "ETHEREUM" : "PASSKEY", // Passkeys are not yet supported; provided as an example only.
      identifier: account.address || account.passkeyId,
    }),
    signMessage: async (message) => {
      return account.signMessage(message);
    },
    getChainId: account.isSCW ? () => BigInt(8453) : undefined,
    getBlockNumber: account.isSCW ? () => undefined : undefined,
  };
}
```

### Before: Using getAddress()

Previously, developers used `getAddress()` to retrieve an account’s Ethereum address:

```tsx
const signer: Signer = {
  getAddress: () => "0x123...",
  signMessage: async (message) => {
    // return signed message
  },
};
```

While this approach worked for EOAs, it assumed that all accounts were Ethereum addresses and did not allow for other identity types.

### After: Using getIdentity()

Now, `getIdentity()` returns an identity object, allowing for multiple types of accounts:

```tsx
const signer: Signer = {
  getIdentity: () => ({
    kind: "ETHEREUM", // Identity type [ETHEREUM, PASSKEY (passkeys are not yet supported), etc.]
    identifier: "0x123...", // Account identifier
  }),
  signMessage: async (message) => {
    // return signed message
  },
};
```

### Before: newConveration()

Previously, developers used an Ethereum address to create a new DM conversation:

```tsx
const dm = await alix.conversations.findOrCreateDm(bo.address);
```

### After: newConveration()

Now, developers can use `inboxId` to create a new DM conversation because with the new flexible identity model, they cannot rely on the existence of an Ethereum address.

```tsx
const dm = await alix.conversations.findOrCreateDm(bo.inboxId);
```
