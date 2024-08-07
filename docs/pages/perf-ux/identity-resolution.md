---
description: "Learn about identity resolution in apps built with XMTP."
---

# Resolve identities in an app built with XMTP

When you build with XMTP, there’s no cold start for your app and your users. As soon as your app plugs into the XMTP network, it can reach today’s most popular and meaningful identities. XMTP’s interoperability and composability help ensure that the network can continue to grow and bring messaging to every identity—via your app.

In this context, **identity** refers to:

- Wallet addresses, such as raw 0x addresses like `0x4b70d04124c2996De29e0caa050A49822Faec6Cc`
- Human-readable domain names associated with wallet addresses. These domain names are provided by name services, such as Ethereum Name Service (ENS) and Unstoppable Domains (UNS).

As a UX best practice, build your app to enable a user to enter a domain name in the **To** field and have the identity resolve to its associated raw wallet address. For example, a user should be able to enter `gm.xmtp.eth` in your **To** field and have your app forward-resolve and display the identity's associated wallet address `0x937C0d4a6294cdfa575de17382c7076b579DC176`.

Your app should also be able to accept a raw wallet address and reverse-resolve and display the identity's associated domain name, if available.

When displaying a name, also look for and display its associated avatar. For example, when displaying a Lens name, look for and display a Lens profile photo. For raw 0x addresses, display blockies as avatars.

## Third-party identity resolution tools

This list of third-party identity resolution tools is provided for informational purposes only.

:::tip

Is your app using a great tool to resolve identities? Open an [issue](https://github.com/xmtp/docs-xmtp-org/issues) to share information about it.

:::

### Airstack

Airstack provides tools to resolve [ENS](https://docs.airstack.xyz/airstack-docs-and-faqs/guides/resolve-identities/ens), [Farcaster](https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster/resolve-farcaster-users), and [Lens](https://docs.airstack.xyz/airstack-docs-and-faqs/guides/lens/resolve-lens-profiles) identities.

:::note[Lens v1 and v2 support]
_Airstack currently supports identity resolution with both the new Lens V2 handle `namespace/@handlename` format and the legacy V1 `.lens` profile name_
:::

### Everyname

Everyname provides tools to resolve [ENS, Farcaster, Lens, Unstoppable Domains, and other identities](https://docs.everyname.xyz/api/forward-social-profile).

### SimpleHash

[SimpleHash](https://docs.simplehash.com/reference/overview) provides tools to resolve ENS and Base Name Service identities.

### Unstoppable Domains

Unstoppable Domains provides tools to resolve [Unstoppable Domains](https://docs.unstoppabledomains.com/resolution/overview/) identities.
