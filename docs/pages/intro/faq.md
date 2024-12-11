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

### Message payload storage

Here are some options for storing encrypted message payload content:

- [IPFS](https://ipfs.io/)
- [ThirdwebStorage](https://portal.thirdweb.com/storage)
- [web3.storage](https://web3.storage/)

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
- [zk-EVM](https://linea.build/)
- [Optimism](https://www.optimism.io/)
- [Polygon](https://polygon.technology/)
- [Scroll](https://www.scroll.io/)

## Build with XMTP

### Which languages does the XMTP SDK support?

XMTP SDKs are [available for multiple languages](/inboxes/get-started).

### Which web3 libraries does the XMTP SDK require?

The XMTP SDK currently requires you to use [ethers](https://ethers.org/) or another web3 library capable of supplying an [ethers Signer](https://docs.ethers.io/v5/api/signer/), such as [wagmi](https://wagmi.sh/).

### Where can I get official XMTP brand assets?

See the [XMTP brand guidelines](https://github.com/xmtp/brand) GitHub repo.

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

- An onchain smart contract node registry, which lists the currently active set of XMTP nodes
- An off-chain broadcast network of nodes run by a set of independent third parties, which handles the majority of the messaging data (loosely ordered, low latency)
- A series of onhain smart contracts on an XMTP L3, which handles account information and the most critical messaging data (strictly ordered, medium latency)

To follow and provide feedback on this work, see the [Replication tracking task](https://github.com/xmtp/xmtpd/issues/118) in the `xmtpd` repo.

### Is XMTP a blockchain?

XMTP is not a blockchain. Nodes on the XMTP network run software to store and transfer messages between blockchain accounts. For secure and reliable delivery of messages, the nodes participate in a consensus mechanism.

Ephemera is researching various consensus protocols that would allow the network to operate in a decentralized fashion while maintaining its current emphasis on user privacy and low-latency message delivery.

### Will I be able to run my own XMTP node?

Ephemera is in the process of building the replication mechanisms required to enable third-parties to run XMTP nodes and participate in network decentralization.

To follow and provide feedback on this work, see the [Replication tracking task](https://github.com/xmtp/xmtpd/issues/118) in the [xmtpd repo](https://github.com/xmtp/xmtpd).

### Does XMTP have a token?

XMTP does not currently have a token. Disregard any information regarding airdrops or token sales. If and when an official token is introduced, announcements will be made exclusively through XMTP's official channels.

## Fees

### Does XMTP have fees?

XMTP core developers and researchers are working on a specific fee model for XMTP, with the following guiding principles in mind:

- Fees will be dynamic to protect the network from Denial of Service (DoS) attacks.
- Infrastructure costs for the network must remain low even when decentralized, and comparable to the costs for an equivalent centralized messaging service.
- There must be a low "take rate": the biggest driver of cost must be infrastructure costs, with any remaining cost returned to the network.

Have questions or feedback about the fee model for XMTP? See [XMTP fees: Guiding principles and FAQ](https://community.xmtp.org/t/xmtp-fees-guiding-principles-and-faq/795) in the XMTP Community Forums.

## Security

### Has XMTP undergone a security audit?

A security assessment of [LibXMTP](https://github.com/xmtp/libxmtp) and its use of Messaging Layer Security (MLS) was completed by [NCC Group](https://www.nccgroup.com/) in Dec 2024. 

See [Public Report: XMTP MLS Implementation Review](https://www.nccgroup.com/us/research-blog/public-report-xmtp-mls-implementation-review/).

## Storage

### Where are XMTP messages stored?

XMTP stores messages in the XMTP network before and after retrieval. App-specific message storage policies may vary.

### What are the XMTP message retention policies?

#### For XMTP’s blockchain and node databases:

Currently, encrypted payloads are stored indefinitely.

In the coming year, a retention policy will be added. 

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

### What are XMTP message storage and retrieval costs?

Messages are stored off-chain on the XMTP network, with all nodes currently hosted by Ephemera. Ephemera currently absorbs all message storage and retrieval costs.

Today, there are no message storage and retrieval-related fees incurred by developers for building with the XMTP SDK.

## Messages

### Which message formats does XMTP support?

XMTP transports a message payload as a set of bytes that can represent any format that a developer wants to support, such as plain text, JSON, or non-text binary or media content.

With XMTP, these message formats are called content types. Currently, there are two basic content types available. These content types aim to establish broad compatibility among apps built with XMTP.

The XMTP community can propose and adopt standards for other content types, either informally or through a governance process.

To learn more about content types, see [Content types](/inboxes/content-types/content-types).

To learn more about the XMTP improvement proposals governance process, see [What is an XIP?](https://github.com/xmtp/XIPs/blob/main/XIPs/xip-0-purpose-process.md)
 
### Does XMTP have a maximum message size?

Yes. Messages sent on the XMTP network are limited to just short of 1MB (1048214 bytes).

For this reason, XMTP supports [remote attachments](/inboxes/content-types/attachments).

### Does XMTP support message deletion and editing?

Not currently. However, Ephemera is exploring ways to support message deletion and editing.

Have ideas about message deletion and editing? Post to the [XMTP Community Forums](https://community.xmtp.org/c/development/ideas/54).

### Is XMTP more like email or chat?

XMTP enables developers to implement messaging features and UX paradigms that best fit their needs. As a result, messages sent using apps built with XMTP might resemble many typical forms of communication, such as email, direct and group messaging, broadcasts, text messaging, push notifications, and more.

## What is Ephemera?

Ephemera is a web3 software company that contributes to XMTP, an open network, protocol, and standards for secure messaging between blockchain accounts.

Ephemera employees work alongside other XMTP community members to build with and extend XMTP. Community [contributions and participation](https://community.xmtp.org/) are critical to the development and adoption of XMTP.

Ephemera focuses on serving developers. We build [SDKs](/inboxes/get-started), developer tools, and example apps that help developers build great experiences with XMTP.

Ephemera [acquired Converse](https://paragraph.xyz/@ephemera/converse) in June 2024 and [open-sourced it](https://github.com/ephemeraHQ/converse-app) for the entire XMTP network.
