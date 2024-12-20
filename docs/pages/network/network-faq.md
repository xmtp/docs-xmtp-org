# FAQ about the XMTP network

To follow and provide feedback on the engineering work covered in this FAQ, see the [Replication tracking task](https://github.com/xmtp/xmtpd/issues/118) in the [xmtpd repo](https://github.com/xmtp/xmtpd).

## Is the XMTP network decentralized?

**A testnet of the decentralized XMTP network was launched in early December 2024.** 🎉 

- To learn about the testnet and how the XMTP network will be decentralized, see [Decentralizing XMTP](https://xmtp.org/decentralizing-xmtp).
- To learn about xmtpd (XMTP daemon), the node software that powers the testnet and will power the mainnet of the decentralized XMTP network, see the [xmtpd repo](https://github.com/xmtp/xmtpd).
- To learn about how xmtpd can be run on Helm and Terraform infrastructure, see the [xmtpd-infrastructure repo](https://github.com/xmtp/xmtpd-infrastructure).

All of the nodes in the `dev` and `production` XMTP network environments are still operated by [Ephemera](https://ephemerahq.com/) (the company) and powered by [xmtp-node-go](https://github.com/xmtp/xmtp-node-go).

These nodes in the `dev` and `production` XMTP network environments operate in US jurisdiction in compliance with Office of Foreign Assets Control (OFAC) sanctions and Committee on Foreign Investment in the United States (CFIUS) export compliance regulations. Accordingly, IP-based geoblocking is in place for the following countries/territories:

- Cuba
- Iran
- North Korea 
- Syria
- The Crimea, Donetsk People’s Republic, and Luhansk People’s Republic regions of Ukraine

## Is XMTP a blockchain?

The testnet of the decentralized XMTP network includes two distributed systems:

- The XMTP broadcast network
- The XMTP appchain, which is an L3 blockchain securing all metadata that require strict ordering.

To learn more, see [Decentralizing XMTP](https://xmtp.org/decentralizing-xmtp).

The `dev` and `production` XMTP network environments do not use a blockchain. Nodes in these networks run software to store and transfer messages between blockchain accounts. For secure and reliable delivery of messages, the nodes participate in a consensus mechanism.

## Will I be able to run my own XMTP node?

At this time, not everyone will be able to run an XMTP node in the production decentralized XMTP network. 

To learn more, see [Decentralizing XMTP](https://xmtp.org/decentralizing-xmtp).

## Does XMTP have a token?

XMTP does not currently have a token. Disregard any information regarding airdrops or token sales. If and when an official token is introduced, announcements will be made exclusively through XMTP's official channels.
