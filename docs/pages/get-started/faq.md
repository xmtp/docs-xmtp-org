# FAQ about XMTP

Get answers to the most frequently asked questions about XMTP.

## What works with XMTP?

In the spirit of web3 composability, here are **just a few** of the building blocks that work well with XMTP. Building your app with these tools can help you deliver and distribute an app—faster and with quality.

:::tip
This list is not exhaustive and is just a starting point. A highly extensible protocol like XMTP can work with more tools than those listed in each section.
:::

### Wallet connectors

Here are some options for connecting wallets to your app built with XMTP:

- [RainbowKit](https://www.rainbowkit.com/)  
  Support for WalletConnect v2 is now standard in RainbowKit. To learn how to upgrade, see [Migrating to WalletConnect v2](https://www.rainbowkit.com/guides/walletconnect-v2).
- [Thirdweb](https://thirdweb.com/)
- [WalletConnect](https://walletconnect.com/)
- [wagmi](https://wagmi.sh/)

:::info[For more info]
See this example implementation in the [XMTP React Native example app](https://github.com/xmtp/xmtp-react-native/blob/40638c09fd60df58609732a3fa549d45526fae0b/example/README.md#configure-thirdweb-client-api).
:::

### Message payload storage

Here are some options for storing encrypted message payload content:

- [IPFS](https://ipfs.io/)
- [ThirdwebStorage](https://portal.thirdweb.com/storage)
- [web3.storage](https://web3.storage/)

:::info[For more info]
See [Remote attachment content type](https://github.com/xmtp/xmtp-js-content-types/tree/main/packages/content-type-remote-attachment). Specifically, storage use is described in the [Upload the encrypted attachment](https://github.com/xmtp/xmtp-js-content-types/tree/main/packages/) section.
:::

### Decentralized social

Here are some decentralized social protocols that work with XMTP:

- [CyberConnect](https://link3.to/cyberconnect)  
  For more info, see [CyberConnect & XMTP Integration Demo App](https://github.com/cyberconnecthq/cc-xmtp-chatapp) and [Integrating XMTP into CyberConnect](https://cyberconnect.hashnode.dev/integrating-xmtp-into-cyberconnect-a-guide)
- [Lens](https://www.lens.xyz/)  
  For more info, see the [Hey Lens app](https://github.com/heyxyz/hey) GitHub repo.

### Wallet apps

XMTP can be used with EVM-compatible wallet apps that support ECDSA signing on the secp256k1 elliptic curve. These include common wallet apps such as:

- [Coinbase Wallet](https://www.coinbase.com/wallet)
- [MetaMask](https://metamask.io/)
- [Rainbow Wallet](https://rainbow.me/)
- Most wallets in the [WalletConnect network](https://explorer.walletconnect.com/?type=wallet)

The XMTP SDK **does not** include a wallet app abstraction, as XMTP assumes that developers have a way to obtain a wallet app connection.

### Chains

XMTP works with externally owned accounts (EOAs) on Ethereum and Ethereum side-chains and L2s.

Because all Ethereum Virtual Machine (EVM) chains share the same Ethereum wallet and address format and XMTP messages are stored off-chain, XMTP is interoperable across EVM chains, including testnets. (XMTP itself does not use EVMs.)

For example, whether a user has their wallet app connected to Ethereum or an Ethereum side-chain or L2, their private key can generate and retrieve their XMTP key pair to give them access to XMTP.

XMTP is also chain-agnostic, so multi-chain support is possible.

Here are just a few chains that work with XMTP:

- [Arbitrum](https://arbitrum.foundation/)
- [Avalanche](https://www.avax.com/)
- [Base](https://base.org/)
- [(BNB) Chain](https://www.bnbchain.org/)
- [Ethereum](https://ethereum.org/)
- [Hermez](https://docs.hermez.io/Hermez_1.0/about/scalability/)
- [zk-EVM](https://linea.build/)
- [Optimism](https://www.optimism.io/)
- [Polygon](https://polygon.technology/)
- [Scroll](https://www.scroll.io/)

### Smart contract wallets

To learn more about XMTP support for smart contract wallets, see this XIP in **Draft** status: [XIP-44: Smart Contract Wallet Support](https://community.xmtp.org/t/xip-44-smart-contract-wallet-support/627).

## Build with XMTP

### Which languages and environments does the XMTP SDK support?

XMTP SDKs are [available for multiple languages](/get-started/examples/#sdks).

### Which web3 libraries does the XMTP SDK require?

The XMTP SDK currently requires you to use [ethers](https://ethers.org/) or another web3 library capable of supplying an [ethers Signer](https://docs.ethers.io/v5/api/signer/), such as [wagmi](https://wagmi.sh/).

### Is XMTP compatible with viem?

Yes, though not by default. To make them compatible, you must create a wrapper around viem. For example, see this [Hey](https://github.com/heyxyz/hey/blob/19e5911cd3b0d4f2c391d1a1180a7ea5d9335bf3/apps/web/src/hooks/useEthersWalletClient.tsx#L6) implementation.

```tsx
import { ZERO_ADDRESS } from "@lenster/data/constants";
import { CHAIN_ID } from "src/constants";
import type { Address } from "viem";
import { useWalletClient } from "wagmi";

const useEthersWalletClient = (): {
  data: {
    getAddress: () => Promise<Address>;
    signMessage: (message: string) => Promise<string>;
  };
  isLoading: boolean;
} => {
  const { data, isLoading } = useWalletClient({ chainId: CHAIN_ID });

  const ethersWalletClient = {
    getAddress: async (): Promise<Address> => {
      return (await data?.account.address) ?? ZERO_ADDRESS;
    },
    signMessage: async (message: string): Promise<string> => {
      const signature = await data?.signMessage({ message });
      return signature ?? null; //lenster uses empty string which could be risky
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { signMessage, ...rest } = data ?? {};

  const mergedWalletClient = {
    data: {
      ...ethersWalletClient,
      ...{ ...rest },
    },
  };

  return { data: mergedWalletClient.data, isLoading };
};

export default useEthersWalletClient;
```

You can then call viem as shown in this [Hey](https://github.com/heyxyz/hey/blob/19e5911cd3b0d4f2c391d1a1180a7ea5d9335bf3/apps/web/src/hooks/useXmtpClient.tsx#L12) implementation.

```tsx
const { data: walletClient, isLoading } = useEthersWalletClient();
```

### Does XMTP work with Bun?

Currently, Bun does not offer full compatibility with XMTP. Use Yarn as an alternative to prevent any issues.

### How do I configure my project to work with XMTP?

Depending on your project setup, you may need to make some configuration changes to ensure compatibility with XMTP. These changes primarily involve adding support for Node.js-specific features that XMTP requires, such as the `Buffer` object, and ensuring proper resolution of dependencies. Here are some common scenarios:

:::details[React Scripts 5]

- **CRACO**: (Create React App Configuration Override) is a community solution for adding custom configurations to Create React App. It allows you to customize your configuration without ejecting from the default setup provided by Create React App.

  **Install react-app-rewired**:

  ```bash
  npm install craco
  ```

  Create the `craco.config.js` in your root directory:

  ```jsx
  const webpack = require("webpack");
  module.exports = {
    webpack: {
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        }),
      ],
      resolve: {
        fallback: {
          buffer: require.resolve("buffer/"),
        },
      },
    },
  };
  ```

- **React-App-Rewired**: `react-app-rewired` is a tool to tweak the Create React App (CRA) configuration without ejecting, similar to CRACO. Here's how you can use it:

  **Install react-app-rewired**:

  ```
  npm install react-app-rewired
  ```

  **Modify the `scripts` in your `package.json`**:
  Replace `react-scripts` with `react-app-rewired`. For example:

  ```json
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-app-rewired eject"
  }
  ```

  **Create a `config-overrides.js` file**:
  In the root of your project, create a `config-overrides.js` file. This file will be used to modify the webpack config.

  ```javascript
  const webpack = require("webpack");

  module.exports = function override(config, env) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve("buffer/"),
    };
    config.plugins = (config.plugins || []).concat([
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    ]);
    return config;
  };
  ```

- **Eject method**: Ejecting from CRA gives you full control over the configuration, but it's a one-way operation. Once you eject, you can't go back to the abstracted CRA setup.

  **Eject the application**:

  ```
  npm run eject
  ```

  **Modify the webpack configuration**:
  After ejecting, you'll have access to the `config` folder. Modify the `webpack.config.js` file:

  ```javascript
  const webpack = require("webpack");

  // Inside the module.exports object
  module.exports = {
    // ... other configurations

    resolve: {
      // ... other resolve options
      fallback: {
        // ... other fallback options
        buffer: require.resolve("buffer/"),
      },
    },
    plugins: [
      // ... other plugins
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    ],
  };
  ```

  :::

:::details[WEBPACK]

Webpack: `vue.config.js` or `webpack.config.js`:

```jsx
const webpack = require("webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    ],
  },
  transpileDependencies: true,
};
```

:::

:::details[VITE]

Vite: `vite.config.js`:

```jsx
import { defineConfig } from "vite";
import { Buffer } from "buffer";

export default defineConfig({
  /**/
  define: {
    global: {
      Buffer: Buffer,
    },
  },
  /**/
});
```

:::

:::details[NuxtJS]

NuxtJS: `nuxt.config.js`:

```tsx
export default {
  build: {
    extend(config, { isClient }) {
      if (isClient) {
        config.node = {
          Buffer: true,
        };
      }
    },
  },
};
```

:::

### Where can I get official XMTP brand assets?

See the [XMTP brand guidelines](https://github.com/xmtp/brand) GitHub repo.

### How should I handle the XMTP onboarding flow in my app?

In your app onboarding flow, enable your users to activate XMTP messaging. User access to messaging can help with app engagement and re-engagement.

For example, here is a prompt to activate XMTP DMs in the onboarding flow to [claim a Lens handle](https://claim.lens.xyz/):

![activatedmsscreen-width-500px](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/activate-dms-screen.png)

In your app onboarding flow, also request user permission to display app-specific push notifications. Enabling push notifications can help with user engagement and retention by allowing your app to reach users outside of active sessions. 

Push notifications are particularly valuable for messaging apps, as they help ensure users don't miss important communications and can respond promptly to new messages.

### Is there a way to get a list of all current XMTP-enabled wallets?

XMTP doesn't provide a direct method to fetch all XMTP-enabled wallet addresses in bulk. You might consider using a third-party service to do so instead of building the functionality yourself.

[Blaze CRM](https://www.withblaze.app/) is one known service. It compiles lists of XMTP addresses by querying the XMTP `canMessage` API over time.

The XMTP ecosystem is continually evolving. If you know of other reliable services providing this functionality, please consider sharing them in the [XMTP Community Forums](https://community.xmtp.org/c/development/third-party-tools/74).

### Does XMTP support group chat?

Yes. XMTP V3 supports group chat in React Native, Android, iOS, and Node.js SDKs.

:::info[For more info]
See [Build group chat with MLS and XMTP](/groups/build-group-chat)
:::

## Network

### Is the XMTP network decentralized?

Currently, [Ephemera](https://ephemerahq.com/) (the company) operates all of the network nodes in the two available XMTP network environments: `dev` and `production`.

These network nodes operate in US jurisdiction in compliance with Office of Foreign Assets Control (OFAC) sanctions and Committee on Foreign Investment in the United States (CFIUS) export compliance regulations. Accordingly, IP-based geoblocking is in place for the following countries/territories:

- Cuba
- Iran
- North Korea
- Syria
- The Crimea, Donetsk People’s Republic, and Luhansk People’s Republic regions of Ukraine

To explore the software for the nodes that currently form the XMTP network, see the [xmtp-node-go repo](https://github.com/xmtp/xmtp-node-go).

Ephemera is working toward a phased decentralization of the network.

Decentralization of the XMTP network will be achieved by a diverse set of independent third parties operating nodes all over the world. Decentralization is a top priority and is required to ensure that XMTP is able to serve everyone on the planet.

### Is XMTP a blockchain?

XMTP is not a blockchain. Nodes on the XMTP network run software to store and transfer messages between blockchain accounts. For secure and reliable delivery of messages, the nodes participate in a consensus mechanism.

Ephemera is researching various consensus protocols that would allow the network to operate in a decentralized fashion while maintaining its current emphasis on user privacy and low-latency message delivery.

### Will I be able to run my own XMTP node?

Yes, you will be able to run a node.

Ephemera is working toward a phased decentralization of the network.

### Does XMTP have a token?

XMTP does not currently have a token. Disregard any information regarding airdrops or token sales. If and when an official token is introduced, announcements will be made exclusively through XMTP's official channels.

### What is the relationship between Waku and XMTP?

XMTP currently uses the Waku protocol to relay messages between network nodes.

Waku is an unopinionated transport layer built around the libp2p publish/subscribe model. Waku is intentionally open-ended when it comes to handling options like message encoding and encryption, which content topics to use, and how to create and manage encryption keys linked to blockchain account addresses.

XMTP provides a standardized approach to addressing these options, focusing on maximizing compatibility across apps and ensuring message security and deliverability, while also enabling as many developers as possible to use XMTP to build interoperable messaging apps.

### How do XMTP clients communicate with XMTP nodes?

Clients communicate with XMTP nodes through a gRPC (or JSON/HTTP) message API.

### What is the expected network latency for message delivery and retrieval?

XMTP provides perceptibly real-time message delivery and retrieval. The network does not provide service level guarantees.

## Fees

### Who pays to keep the network running?

Ephemera is committed to keeping the network running. Future incentive mechanisms will enable the network to run autonomously of Ephemera.

### Will XMTP charge messaging fees?

Currently, messaging incurs no fee. As XMTP decentralizes, messaging between participants that opt-in will remain free, while unsolicited messages may incur fees or see token staking requirements.

There are no messaging-related fees incurred by developers for building with the XMTP SDK.

### What are the costs of XMTP message storage and retrieval?

Messages are stored off-chain on the XMTP network, with all nodes currently hosted by Ephemera. Ephemera currently absorbs all message storage and retrieval costs.

There are no message storage and retrieval-related fees incurred by developers for building with the XMTP SDK.

## Security

### Has XMTP undergone a security audit?

The [XMTP JavaScript SDK](https://github.com/xmtp/xmtp-js) (`xmtp-js`) was verified by [CertiK](https://www.certik.com/company/about) on Feb 6, 2023. Read their [XMTP security assessment](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/REP-final-20230207T000355Z.pdf).

### How does XMTP establish a secure and fraud-proof relationship between two identities?

XMTP V3 uses a combination of Ethereum wallet signatures and MLS (Messaging Layer Security):

1. A user starts with an Ethereum wallet and installs an XMTP-enabled app.

2. The user creates an XMTP identity, which involves generating an identity key.

3. For each app or device, an installation key is created and signed by the identity key.

4. The installation key is used to create an MLS credential, which is signed by the Ethereum wallet.

5. The MLS credential contains the wallet address and a hash of the installation's signature verification key.

6. For group chats, XMTP uses the MLS protocol to manage secure communication between multiple parties.

For more details, see [Group chat concepts and protocols](/protocol/v3/group-chat#security-and-encryption) and [Identity in XMTP v3](/protocol/v3/identity)

In this regard, XMTP V3 provides several improvements over V2:

- Enhanced security: V3 implements the MLS protocol, which provides stronger security guarantees including forward secrecy and post-compromise security.

- Group chat support: V3 natively supports secure group chats, allowing multiple participants to communicate securely in a single conversation.

- Scalability: The MLS protocol used in v3 is designed to scale efficiently, supporting larger groups and more frequent updates.

- Improved key management: V3's use of installation keys and MLS credentials provides a more robust and flexible key management system.

- Better privacy: V3 includes features to enhance user privacy, such as hiding sender metadata in group chats.

- Future-proofing: The adoption of MLS, an emerging standard for secure messaging, positions XMTP to be compatible with future developments in secure communication protocols.

- Interoperability: By using MLS, XMTP v3 aligns with industry standards, potentially allowing for easier interoperability with other secure messaging systems in the future.

These improvements make XMTP v3 a secure, scalable, and feature-rich protocol for decentralized messaging, particularly suited for apps requiring high levels of security and support for group communications.

#### XMTP v2

In V2, blockchain accounts sign and advertise a set of keys to start using XMTP. These keys are used to establish a shared secret between the blockchain accounts. The shared secret is then used to generate a key for encrypting an invitation, allowing the blockchain accounts to start exchanging messages. No third-party apps or relayers are involved in this process.

For more details, see [Key generation and usage in XMTP v2](/protocol/v2/key-generation-and-usage) and [Invitation and message encryption with XMTP v2](/protocol/v2/invitation-and-message-encryption).

### Does each blockchain account address have a corresponding XMTP identity?

Yes. In XMTP V3, each blockchain account address is associated with an XMTP identity.

1. When a user first uses XMTP with a particular blockchain account, they create an "identity key" for that account.

2. This identity key is used to sign "installation keys" for each app or device where the user uses XMTP.

3. The installation keys are then used to create and sign MLS credentials, which are used for secure communication in individual and group chats.

To learn more about identity in XMTP v3, see [Identity in XMTP v3](/protocol/v3/identity).

In this regard, XMTP V3 provides several improvements over V2:

- Multi-device support: V3's use of installation keys allows users to have multiple devices or apps associated with a single blockchain identity, improving user experience and flexibility.

- Enhanced security: The multi-layered key structure (identity key, installation keys, MLS credentials) provides better isolation and security, reducing the risk if a single device or app is compromised.

- Scalability: The V3 approach scales better for users with multiple devices or apps, without requiring a new full identity setup for each.

- Revocation and rotation: V3 allows for more granular key management, including the ability to revoke specific installation keys without affecting the entire identity.

These improvements make XMTP V3 robust, flexible, and secure in its handling of user identities, particularly for users engaging with multiple devices or apps.

#### XMTP V2

Yes. Each blockchain account address is represented by an XMTP identity key. This identity key is a part of a key bundle that only the address that generated it can use to authenticate messages.

To learn more about XMTP identity keys, see [Key generation and usage in XMTP](/protocol/v2/key-generation-and-usage).

### Why do apps built with XMTP require a user to sign with their blockchain account private keys each time they start a new messaging session?

In XMTP V3, users need to authenticate with their blockchain account when starting a new messaging session in this way:

- Initial authentication: When a user first uses XMTP with their blockchain account, they need to sign a message to create their XMTP identity key.

- Session keys: For subsequent sessions, users need to sign to access their installation keys, which are used to create session-specific MLS credentials.

This signing process ensures that only the legitimate owner of the blockchain account can access their XMTP messages and participate in conversations.

Due to security constraints in web browsers, it's generally not safe to store decrypted keys persistently. This necessitates reauthentication for each new session.

If you're using the JavaScript client SDK, you might consider [manually handling private key storage](/dms/client#saving-keys), but this approach **requires extreme caution** and should only be implemented with a thorough understanding of the security implications.

The XMTP team continues to research and develop more user-friendly approaches to secure key management based on developer and community feedback.

For more details on identity and key management in XMTP V3, see [Identity in XMTP v3](/protocol/v3/identity).

#### XMTP V2 

When a user starts a new messaging session, they must sign with their blockchain account private key to decrypt their XMTP key bundle. The key bundle is then used for invitation and message decryption.

Because there is no secure place in the browser to persist a decrypted key bundle, the app can use the bundle for the current session only. Once the user starts a new session, such as after refreshing their browser, they must sign again to decrypt their key bundle.

To learn more about these keys, see [Key generation and usage in XMTP](/protocol/v2/key-generation-and-usage).

## Storage

### Where are XMTP messages stored?

XMTP stores messages in the XMTP network before and after retrieval. App-specific message storage policies may vary.

### What are the XMTP message retention policies?

XMTP provides both `production` and `dev` network environments to support the development phases of your project.

The `production` network is configured to store messages indefinitely.

XMTP may occasionally delete messages and keys from the `dev` network and will provide advance notice in the [XMTP Discord community](https://discord.gg/xmtp) and [XMTP Announcements forum](https://community.xmtp.org/c/start-here/announcements/7).

Different approaches to long-term message storage are currently being researched.

## Messages

### Which message formats does XMTP support?

XMTP transports a message payload as a set of bytes that can represent any format that a developer wants to support, such as plain text, JSON, or non-text binary or media content.

With XMTP, these message formats are called content types. Currently, there are two basic content types available. These content types aim to establish broad compatibility among apps built with XMTP.

The XMTP community can propose and adopt standards for other content types, either informally or through a governance process.

To learn more about content types, see [Content types](/content-types/content-types).

To learn more about the XMTP improvement proposals governance process, see [What is an XIP?](https://github.com/xmtp/XIPs/blob/main/XIPs/xip-0-purpose-process.md)

### Which message metadata does XMTP support?

Message payloads in XMTP V3 include timestamps, which are now more rigorously handled and they were in V2:

- Server-side timestamps: When a message is received by an XMTP node, the node adds its own timestamp to the message.

- Client-side timestamps: The sending client can still include its own timestamp in the message payload.

- Timestamp verification: XMTP nodes perform basic checks on client-provided timestamps. If a timestamp is too far in the future or past, the message may be rejected.

- Ordering: Messages are primarily ordered based on the server-side timestamps, which helps prevent manipulation of message order by clients.

This approach provides a reliable basis for message ordering and helps mitigate some potential issues with client-manipulated timestamps. However, it's important to note that perfect clock synchronization across a distributed system remains a challenge, and apps should be designed with this in mind.

For more details on message handling in XMTP v3, see [Message delivery in XMTP v3](#TODO).

#### XMTP V2

Message payloads include references to timestamps. However, timestamps are not independently verified and can be set to any value by the sending app.

### Does XMTP have a maximum message size?

Yes. Messages sent on the XMTP network are limited to just short of 1MB (1048214 bytes).

For this reason, XMTP supports [remote attachments](/content-types/remote-attachment).

### Does XMTP support message attachments?

Yes. See [Support attachments in your app built with XMTP](/content-types/remote-attachment).

### Does XMTP support deleting and editing messages?

Not currently. However, Ephemera is exploring ways to support message deletion and editing.

Have ideas about message deletion and editing? Post to the [XMTP Community Forums](https://community.xmtp.org/c/development/ideas/54).

## Message patterns

### Is XMTP more like email or chat?

XMTP enables developers to implement messaging features and UX paradigms that best fit their needs. As a result, messages sent using apps built with XMTP might resemble many typical forms of communication, such as email, direct and group messaging, broadcasts, text messaging, push notifications, and more.

### Does XMTP support real-time conversations?

Real-time chat is a core use case for XMTP and is demonstrated by the open source Converse messenger app.

- [Try the app](https://app-preview.converse.xyz/) connected to the XMTP `dev` network
- [Try the app](https://app.converse.xyz/) connected to the XMTP `production` network

To learn more about how the Converse messenger app is built, see the [converse-app repo](https://github.com/ephemeraHQ/converse-app).

### Does XMTP support broadcast messaging?

Yes. See [Broadcast messages with XMTP](/consent/broadcast).

## Ephemera

### What is Ephemera?

Ephemera is a web3 software company that contributes to XMTP, an open network, protocol, and standards for secure messaging between blockchain accounts.

Ephemera employees work alongside other XMTP community members to build with and extend XMTP. Community [contributions and participation](https://community.xmtp.org/) are critical to the development and adoption of XMTP.

Ephemera focuses on serving developers. We build [SDKs, developer tools, and example apps](/get-started/examples) that help developers build great experiences with XMTP.

Ephemera [acquired Converse](https://paragraph.xyz/@ephemera/converse) in June 2024 and [open-sourced it](https://github.com/ephemeraHQ/converse-app) for the entire XMTP network.
