---
description: "Learn about spam filters for apps built with XMTP."
---

# Filter spam in apps built with XMTP
  
In any open and permissionless messaging ecosystem, spam is an inevitable reality and XMTP is no exception. However, with XMTP, spam doesn’t have to impact the user experience.

Implement [user consent preferences](/consent/user-consent) in your app to allow only conversations with approved contacts to display in a user's main inbox and have contact requests from unknown users display in a requests inbox, for example.

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
