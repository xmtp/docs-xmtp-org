# Launch checklist

To be featured on the [xmtp.org](https://xmtp.org/) home page and receive amplification from XMTP's social channels, follow this checklist. Meeting these criteria helps you provide a best-in-class messaging experience with your client.

## A. Follow this quality checklist

Before launching, ensure your app meets the following criteria:

### Meet performance benchmarks

- [ ] Implement a [Local-first cache](/perf-ux/local-first).
- [ ] Cache conversation list `conversations.list()` to boost performance by 90%.
- [ ] Serialize securely stored `DecodedMessage` histories to reduce redundant downloads and decryptions.
- [ ] Implement message [pagination](/dms/messages#list-messages-in-a-conversation-with-pagination).
- [ ] Compress message content with a suitable compression algorithm.
- [ ] Follow the [testing tutorial](/perf-ux/debug-and-test)
- [ ] (Bonus) Implement [optimistic sending](/perf-ux/optimistic-sending).

### Meet reliability benchmarks

- [ ] No duplicate conversations should be created or displayed. If duplicates exist, only the latest conversation should be visible.
- [ ] The app should be stable and not crash frequently.
- [ ] No visible critical bugs.
- [ ] Make sure to use the latest [XMTP client SDK](/get-started/examples).
- [ ] Always set an `appVersion` [value](/dms/client#configure-the-client).

### Support content types

- [ ] Support image [remote attachments](/content-types/remote-attachment).
- [ ] Support [message replies](/content-types/reply)
- [ ] Support [message reactions](/content-types/reaction)
- [ ] (Bonus) Support [onchain transaction references](/content-types/transaction-ref)

### Support identity resolution

- [ ] Offer forward and reverse [identity resolution](/perf-ux/identity-resolution) support for ENS.
- [ ] (Bonus) Support for UNS, cb.id, .lens, Cyberconnect.

### Track basic and privacy-preserving metrics

Enable your app to keep track of:

- [ ] Number of active wallets: At least one message sent.
- [ ] Number of active conversations: At least one message.
- [ ] Number of returning conversations: A minimum of one message from each participant.

## B. Launch your app

Way to go! 🎉 Here are some resources and ideas for promoting your app launch:

- Check out these launch posts for apps built with XMTP:
    - [Coinbase Wallet](https://x.com/CoinbaseWallet/status/1679178581224873985?s=20)
    - [Converse](https://x.com/converseapp_/status/1648362598058819585)
    - [Lenster](https://x.com/lensterxyz/status/1588203593257009152?s=20&t=wHy9mBrNR5ri146CbhCMUw)
    - [Orb](https://x.com/orbapp_/status/1618659601154715649?s=20)
    - [Bello](https://x.com/xmtp_/status/1693978790618095972)
- Need an XMTP logo for your announcement?
  - See the [XMTP Brand Guidelines](https://github.com/xmtp/brand)
- Tag the XMTP team to help amplify your launch
  - [@xmtp4all](https://lenster.xyz/u/xmtp4all) on Lens
  - [@xmtp\_](https://x.com/xmtp_) on X (Twitter)
  - [@xmtp](https://warpcast.com/xmtp) on Farcaster
  - [@xmtp_network](https://www.threads.net/@xmtp_network) on Threads
- Have your app added to the [XMTP home page](https://xmtp.org/)
  - [Submit this form](https://forms.gle/p1VgVtkoGfHXANXt5)
- Have your project repo added to [awesome-xmtp](https://github.com/xmtp/awesome-xmtp)
  - [Create a PR](https://github.com/xmtp/awesome-xmtp)
- Create a commemorative [POAP](https://app.poap.xyz/) for your launch to reward early users

## C. Keep in touch post-launch

- Keep in touch using the [XMTP Community Forums](https://community.xmtp.org/). This helps ensure that you hear about the latest SDK and content type releases, as well as upgrade and deprecation notices.
- Contribute to the XMTP [GitHub Repos](https://github.com/xmtp): If you have code improvements, bug fixes, or features that could benefit the XMTP ecosystem, consider contributing to the XMTP GitHub repositories. By doing this, you not only improve the protocol but also gain valuable experience and recognition within the community. Make sure to follow the guidelines laid out for pull requests and XMTP Improvement Proposals.
