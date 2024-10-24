---
description: "Learn about spam filters for apps built with XMTP."
---

# Filter spam in apps built with XMTP

In any open and permissionless messaging ecosystem, spam is an inevitable reality and XMTP is no exception. However, with XMTP, spam doesn’t have to negatively impact the user experience.

Implement [user consent preferences](/consent/user-consent) in your app to allow only conversations with approved contacts to display in a user's main inbox. Approved contacts include those the user initiated the conversation with or explicitly approved.

<block-approve>

While the user's main inbox only displays conversations with approved contacts, you can then handle contact requests from unknown contacts in a separate UI.

<requests link screenshot>

These unknown contact requests may include:

- Contacts the user might know
- Contacts the user might not know
- Spam

You can then filter these unknown contacts to identify:

- Contacts the user might know or want to know, and display them on a **You might know** tab, for example.
- Contacts the user might not know and not want to know, which might include spam, and display them on a **Hidden requests** tab, for example.

## Identify contacts the user might know

To identify contacts the user might know or want to know, you can look for signals in onchain data that imply an affinity between contacts. You can then display those messages on a **You might know** tab, for example. 

<you might know>

For example, you can look at:

- Transactional history
	- Direct transfers of tokens or NFTs between addresses
  - Both addresses owner the same digital assets, such as tokens or NFTs
  - Both addresses interacted with the same smart contract, such as staking pools, DAOs, or NFT minting contracts
  - Both addresses hold the same ERC-20 governance tokens or community-specific assets

- DAO and governance participation 
	- Both addresses voted on the same governance proposal
  - Both addresses are members of the same DAO
  
- Social and event-based interactions
  - Both addresses hold the same POAP token
  - Both addresses received the same airdrop
  
- Frequent onchain interaction patterns
	- Multiple transactions between addresses in a short period can indicate a stronger relationship
  - Gas payer relationships in which an address has frequently paid gas fees on the other address' behalf can indicate a stronger relationship

- Referrals or mentions on decentralized social platforms
  - One address holds a subdomain in the other address' ENS domain
  - An address mentioned the other address on a decentralized social platform, such as Farcaster or Lens, which might indicate mutual awareness.

- Bridge activities
  - Both addresses bridged assets using the same cross-chain protocol, which might indicate a shared interest across networks.

## Identify contacts the user might not know, including spammy or harmful requests

To identify contacts the user might not know or not want to know, which might include spam, you can consciously decide to scan messages in an unencrypted state to find messages that might contain spammy or harmful language. You can also look for an absence of onchain interaction data between the addresses, which might indicate that there is no affinity between addresses. You can then filter the appropriate messages to display on a **Hidden requests** tab, for example. 

<hidden>

The decision to scan unencrypted messages is yours as the app developer. If you take this approach:

- Handle unencrypted messages with extreme care and don't store unencrypted messages beyond the time necessary to scan them.
- Consider telling users that your app scans unencrypted messages for spammy or harmful language.
- Consider making spam and harmful message detection optional for users who prefer to not have their messages scanned.

You might also consider using spam management tools to detect and filter out spammy contact requests to display in a spam inbox.

## Spam management tools

Experiment with these spam filtering tools provided as public goods by members of the XMTP community.

- [Malicious Ethereum addresses](https://github.com/3numdao/dsbdao)  
  Decentralized Spam Bustaz DAO (DSBDAO) is a database of known malicious Ethereum addresses. Use this information to create sender address-based client-side filtering criteria. Created by [@boscolochris](https://twitter.com/boscolochris) and [@dawufi](https://warpcast.com/dawufi) and hosted by [3NUM](https://3num.co/).

- [Web2 spam domains](https://github.com/chainjet/xmtp-denylist)  
  `xmtp-denylist` is a public repo that lists web2 domains used in phishing spam. Created by [ChainJet](https://chainjet.io/).

- [Unstoppable Domains spam report](https://docs.unstoppabledomains.com/openapi/messaging-v1/#tag/Chat/paths/~1xmtp~1spam~1%7Baddress%7D/get)  
  A public API endpoint to query whether Unstoppable Domains users have marked an Ethereum address as a source of unwanted spam. Use this information to create sender address-based client-side filtering criteria. Created by [Unstoppable Domains](https://unstoppabledomains.com/).

:::tip

Is your app using a great third-party or public good tool to filter spam and keep inboxes safe? Open an [issue](https://github.com/xmtp/docs-xmtp-org/issues) to share information about it.

:::
