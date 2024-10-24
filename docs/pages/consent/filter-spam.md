---
description: "Learn about spam filters for apps built with XMTP."
---

# Filter spam in apps built with XMTP

In any open and permissionless messaging ecosystem, spam is an inevitable reality and XMTP is no exception. However, with XMTP, spam doesn’t have to negatively impact the user experience.

Implement [user consent preferences](/consent/user-consent) in your app to allow only conversations with approved contacts to display in a user's main inbox. Approved contacts include those the user initiated the conversation with or explicitly approved.

<div>
<img src="https://raw.githubusercontent.com/xmtp/docs-xmtp-org/refs/heads/main/docs/pages/img/block-accept.jpg" width="500" />
</div>

While the user's main inbox only displays conversations with approved contacts, you can then handle contact requests from unknown contacts in a separate UI.

<div>
<img src="https://raw.githubusercontent.com/xmtp/docs-xmtp-org/refs/heads/main/docs/pages/img/requests-link.jpg" width="500" />
</div>

These unknown contact requests may include:

- Contacts the user might know
- Contacts the user might not know
- Spam

You can then filter these unknown contacts to identify:

- Contacts the user might know or want to know, and display them on a **You might know** tab, for example.
- Contacts the user might not know and not want to know, which might include spam, and display them on a **Hidden requests** tab, for example.

## Identify contacts the user might know

To identify contacts the user might know or want to know, you can look for signals in onchain data that imply an affinity between contacts. You can then display those messages on a **You might know** tab, for example. 

<div>
<img src="https://raw.githubusercontent.com/xmtp/docs-xmtp-org/refs/heads/main/docs/pages/img/you-might-know-tab.jpg" width="500" />
</div>

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

To identify contacts the user might not know or not want to know, which might include spam, you can consciously decide to scan messages in an unencrypted state to find messages that might contain spammy or harmful content. You can also look for an absence of onchain interaction data between the addresses, which might indicate that there is no affinity between addresses. You can then filter the appropriate messages to display on a **Hidden requests** tab, for example. 

<div>
<img src="https://raw.githubusercontent.com/xmtp/docs-xmtp-org/refs/heads/main/docs/pages/img/hidden-requests-tab.jpg" width="500" />
</div>

The decision to scan unencrypted messages is yours as the app developer. If you take this approach:

- Handle unencrypted messages with extreme care and don't store unencrypted messages beyond the time necessary to scan them.
- Consider telling users that your app scans unencrypted messages for spammy or harmful content.
- Consider making spam and harmful message detection optional for users who prefer to not have their messages scanned.

## Why is content moderation handled by apps and not XMTP?

XMTP is a decentralized, open protocol built to ensure private, secure, and censorship-resistant communication. As such, XMTP can't read unencrypted messages and therefore it also can't scan or filter message contents for spam or harmful material.

The protocol can analyze onchain data signals, such as shared activity between wallet addresses, to infer potential affinities between addresses. However, because all XMTP repositories are open source, malicious actors could inspect these methods and develop workarounds to bypass them.

Additionally, applying spam filtering or content moderation directly at the protocol level would introduce centralization, which goes against the decentralized, permissionless, and open ethos of XMTP and web3. A protocol-driven approach could limit interoperability and trust by imposing subjective rules about content across all apps.

Instead, content filtering and moderation should be implemented at the app layer. Apps can decide how opinionated or lenient they want to be, tailoring their filtering approach to the needs of their users. For example, one app may choose to aggressively scan and block spam to provide a highly curated experience, attracting users who value more protection. Another app may opt for minimal or no filtering, appealing to users who prioritize full control and unfiltered communication.

This flexibility enables different apps to serve different user preferences, fostering a ecosystem where users can choose the experience that best suits them. Whether an app scans messages or not, XMTP ensures that developers remain free to build in line with their own values, without imposing restrictions at the infrastructure level. This separation between the protocol and app layers is crucial to maintain XMTP’s commitment to openness, interoperability, and user choice.

:::tip

Is your app using a great third-party or public good tool to help with spam and keep inboxes safe? Open an [issue](https://github.com/xmtp/docs-xmtp-org/issues) to share information about it.

:::
