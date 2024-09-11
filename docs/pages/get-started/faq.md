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

XMTP supports group chat in React Native, Android, iOS, and Node.js SDKs.

:::info[For more info]
See [Build group chat with MLS and XMTP](/groups/build-group-chat)
:::

To learn more about when group chat will be available for the web, see the XMTP Developer Community Call about [wen group chat web](https://www.youtube.com/watch?v=qnCeXsqqKcY).

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

Ephemera is in the process of building the replication and incentive mechanisms required to decentralize the network. These mechanisms include:

- An on-chain smart contract node registry, which lists the currently active set of XMTP nodes
- An off-chain broadcast network of nodes run by a set of independent third parties, which handles the majority of the messaging data (loosely ordered, low latency)
- A series of on-chain smart contracts on an XMTP L3, which handles account information and the most critical messaging data (strictly ordered, medium latency)

To follow and provide feedback on this work, see the [Replication tracking task](https://github.com/xmtp/xmtpd/issues/118) in the `xmtpd` repo.

### Is XMTP a blockchain?

XMTP is not a blockchain. Nodes on the XMTP network run software to store and transfer messages between blockchain accounts. For secure and reliable delivery of messages, the nodes participate in a consensus mechanism.

Ephemera is researching various consensus protocols that would allow the network to operate in a decentralized fashion while maintaining its current emphasis on user privacy and low-latency message delivery.

### Will I be able to run my own XMTP node?

Yes, you will be able to run a node. 

Ephemera is in the process of building the replication mechanisms required to enable third-parties to run XMTP nodes and participate in network decentralization.

To follow and provide feedback on this work, see the [Replication tracking task](https://github.com/xmtp/xmtpd/issues/118) in the `xmtpd` repo.

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

XMTP core developers and researchers are working on a specific fee model for XMTP, with the following guiding principles in mind:

- Infrastructure costs for the network must remain low even when decentralized, and comparable to the costs for an equivalent centralized messaging service.
- There must be a sizable free tier for most end users, with the low cost per-user subsidized by the largest apps and bulk senders.
- There must be a low "take rate": the biggest driver of cost must be infrastructure costs, with any remaining cost returned to the network.

Have questions or feedback about the fee model for XMTP? See [XMTP fees: Guiding principles and FAQ](https://community.xmtp.org/t/xmtp-fees-guiding-principles-and-faq/795) in the XMTP Community Forums.

## Security

### Has XMTP undergone a security audit?

A security audit of [LibXMTP](https://github.com/xmtp/libxmtp) and its use of Messaging Layer Security (MLS) will begin in Q4 2024. The audit will be performed by [NCC Group](https://www.nccgroup.com/).

The [XMTP JavaScript SDK](https://github.com/xmtp/xmtp-js) (`xmtp-js`) was verified by [CertiK](https://www.certik.com/company/about) on Feb 6, 2023. Read their [XMTP security assessment](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/REP-final-20230207T000355Z.pdf).

### How does XMTP establish a secure and fraud-proof relationship between identities?

With XMTP, the concept of an identity centers on an inbox ID that has a constantly changing set of identities that can be either wallets or app installations.

1. A user starts with an Ethereum wallet and installs an XMTP-enabled app.

2. The user creates an XMTP inbox ID, which can represent a set of identities (wallets and app installations).

3. The first wallet to claim an inbox ID becomes the first member of the set and is designated as the "recovery address."

4. For each app installation, an installation key is generated by the app.

5. Additional wallets and app installations can be added to the set through a two-way signature process:
   - A signature from a key currently in the set
   - A signature from the key being added to the set

6. Wallets and app installations can be removed from the set using a signature from the recovery address.

7. Changes to an inbox ID's set of identities are published as "identity updates" to the XMTP network, which stores them as an "inbox log."

MLS credentials contain only the inbox ID. When a client receives a credential, they verify it by:
- Downloading the inbox log for that inbox ID
- Reading through the series of updates
- Verifying that the installation key is a current valid member of the set

For group chats, XMTP uses the MLS protocol to manage secure communication between multiple parties.

For a first-time XMTP user, the process typically involves:
- One wallet signature to claim the Inbox ID and add the installation key (these can be batched)
- One installation key signature (handled invisibly by the app) to consent to being added to the inbox ID.

This process requires only one visible signature from the end user, in addition to any XMTP v2 signatures.

For more details, see [Group chat concepts and protocols](/protocol/v3/group-chat#security-and-encryption) and [Identity in XMTP v3](/protocol/v3/identity)

#### XMTP v2

In v2, blockchain accounts sign and advertise a set of keys to start using XMTP. These keys are used to establish a shared secret between the blockchain accounts. The shared secret is then used to generate a key for encrypting an invitation, allowing the blockchain accounts to start exchanging messages. No third-party apps or relayers are involved in this process.

For more details, see [Key generation and usage in XMTP v2](/protocol/v2/key-generation-and-usage) and [Invitation and message encryption with XMTP v2](/protocol/v2/invitation-and-message-encryption).

### Does each blockchain account address have a corresponding XMTP identity?

With XMTP v2, each blockchain account address is represented by an XMTP identity key. This identity key is a part of a key bundle that only the address that generated it can use to authenticate messages.

To learn more about XMTP v2 identity keys, see [Key generation and usage in XMTP](/protocol/v2/key-generation-and-usage).

With XMTP v3, there is no identity key. Instead, identity is managed using an inbox ID, which enables multi-wallet identity upport. 

To learn more about XMTP v3 inbox IDs, see [How does XMTP establish a secure and fraud-proof relationship between identities?](#how-does-xmtp-establish-a-secure-and-fraud-proof-relationship-between-identities).

### Why do apps built with XMTP v2 require a user to sign with their blockchain account private keys each time they start a new messaging session? How is this different with XMTP v3?

With XMTP v2, When a user starts a new messaging session, they must sign with their blockchain account private key to decrypt their XMTP key bundle. The key bundle is then used for invitation and message decryption.

Because there is no secure place in the browser to persist a decrypted key bundle, the app can use the bundle for the current session only. Once the user starts a new session, such as after refreshing their browser, they must sign again to decrypt their key bundle.

To learn more about these keys, see [Key generation and usage in XMTP](/protocol/v2/key-generation-and-usage).

With XMTP v3, needing to sign is no longer based on new sessions, but rather on new app instances.

For example, a first-time user of XMTP first signs with a wallet signature to claim an inbox ID. They also provide a wallet signature to certify that the app-generated installation key is allowed to act on behalf of the inbox ID and can therefore be added to the inbox log's set of authorized keys. These signatures must be provided for each new app instance, or installation.

To learn more about the signatures required for XMTP v3, see [How does XMTP establish a secure and fraud-proof relationship between identities?](#how-does-xmtp-establish-a-secure-and-fraud-proof-relationship-between-identities).

## Storage

### Where are XMTP messages stored?

XMTP stores messages in the XMTP network before and after retrieval. App-specific message storage policies may vary.

### What are the XMTP message retention policies?

#### For XMTP’s blockchain and node databases:

Currently, encrypted payloads are stored indefinitely.

In the coming year, a retention policy is likely to be added. 

This retention policy would represent a minimum retention period, not a maximum.

For example, a retention policy may look something like the following, though specifics are subject to change:
  - One year for messages
  - Indefinite storage for account information and personal preferences  

The team is researching a way to provide this indefinite storage and have it scale forever. 
- If research shows that it's possible, we'll share a plan for how it will be achieved. 
- If research shows that it isn't possible, we'll share a plan that shows how retention periods will provide a permanent solution to storage scaling.

Have questions or feedback regarding message storage and retention? Post to the [XMTP Community Forums](https://community.xmtp.org/c/development/ideas/54).

#### For the on-device database managed by the XMTP SDK:

Messages are stored for as long as the user decides to keep them. However, encryption keys are regularly rotated.

### What are the costs of XMTP message storage and retrieval?

Messages are stored off-chain on the XMTP network, with all nodes currently hosted by Ephemera. Ephemera currently absorbs all message storage and retrieval costs.

There are no message storage and retrieval-related fees incurred by developers for building with the XMTP SDK.

## Messages

### Which message formats does XMTP support?

XMTP transports a message payload as a set of bytes that can represent any format that a developer wants to support, such as plain text, JSON, or non-text binary or media content.

With XMTP, these message formats are called content types. Currently, there are two basic content types available. These content types aim to establish broad compatibility among apps built with XMTP.

The XMTP community can propose and adopt standards for other content types, either informally or through a governance process.

To learn more about content types, see [Content types](/content-types/content-types).

To learn more about the XMTP improvement proposals governance process, see [What is an XIP?](https://github.com/xmtp/XIPs/blob/main/XIPs/xip-0-purpose-process.md)

### Which message metadata does XMTP support?
 
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
