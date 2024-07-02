---
description: "Learn about spam filters for apps built with XMTP."
---

# Filter spam in apps built with XMTP

:::tip[FYI]

Third-party and public good tools listed on this page are not official endorsements and are provided for informational purposes only.

Is your app using a great tool to filter spam and keep inboxes safe? Open an [issue](https://github.com/xmtp/docs-xmtp-org/issues) to share information about it.

:::

## Implement XMTP user consent

[Implement user consent preferences](/consent/overview-user-consent) in your app to enable users to manage spammy contacts and conversations.

## Use a third-party tool

Explore these third-party spam filtering tools.

### Airstack spam filters

Learn how to create a split inbox with [Airstack](https://www.airstack.xyz/) that filters senders into three buckets: Primary, General, and Requests. The goal is for the user to never see any spam messages.

- [Primary Inbox](https://docs.airstack.xyz/airstack-docs-and-faqs/guides/xmtp/spam-filters/primary-inbox)  
The Primary Inbox should contain all the users that a given user certainly knows.
- [General Inbox](https://docs.airstack.xyz/airstack-docs-and-faqs/guides/xmtp/spam-filters/general-inbox)  
The General inbox should contain all the users that a given user is likely to know or we have strong signals that they are a good actor.
- [Request Inbox](https://docs.airstack.xyz/airstack-docs-and-faqs/guides/xmtp/spam-filters/request-inbox)  
The Request Inbox is for users unknown to the main user and without any connections. It typically holds spam, which users should avoid.

## Public good tools

Experiment with these spam filtering tools provided as public goods by members of the XMTP community.

- [Malicious Ethereum addresses](https://github.com/3numdao/dsbdao)  
Decentralized Spam Bustaz DAO (DSBDAO) is a database of known malicious Ethereum addresses. Use this information to create sender address-based client-side filtering criteria. Created by [@boscolochris](https://twitter.com/boscolochris) and [@dawufi](https://warpcast.com/dawufi) and hosted by [3NUM](https://3num.co/).

- [Web2 spam domains](https://github.com/chainjet/xmtp-denylist)  
`xmtp-denylist` is a public repo that lists web2 domains used in phishing spam. Created by [ChainJet](https://chainjet.io/).

- [Unstoppable Domains spam report](https://docs.unstoppabledomains.com/openapi/messaging-v1/#tag/Chat/paths/~1xmtp~1spam~1%7Baddress%7D/get)  
A public API endpoint to query whether Unstoppable Domains users have marked an Ethereum address as a source of unwanted spam. Use this information to create sender address-based client-side filtering criteria. Created by [Unstoppable Domains](https://unstoppabledomains.com/).
