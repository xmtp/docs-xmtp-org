---
description: "Learn about wallet signature types when using XMTP"
---

# Wallet signatures with XMTP

Learn about the types of wallet address signatures you might be prompted to provide when using apps built with XMTP. These signatures are always made with a specific wallet address controlled by your wallet.

## First-time app installation use

The first time you use an installation of an app built with XMTP, a **Sign this message?** window displays to request that you sign an **XMTP : Authenticate to inbox** message. For example:

```text
XMTP : Authenticate to inbox

Inbox ID: ${INBOX_ID}
Current time: ${YYYY-MM-DD HH:MM:SS UTC}
```

More specifically, the message will request that you sign:

- A **Grant messaging access to app** message to grant the app installation access to messaging owned by your signing wallet address. For example:

  ```text
  - Grant messaging access to app
    (ID: ${hex(INSTALLATION_PUBLIC_KEY)})
  ```

- A **Create inbox** message to create an XMTP inbox owned by your signing address, but only if you have never used an app installation built with XMTP v3 before. For example:

  ```text
  - Create inbox
    (Owner: ${INITIAL_ADDRESS})
  ```

Sign the **XMTP : Authenticate to inbox** message with your wallet address to consent to the message requests.

<img width="400" src="https://raw.githubusercontent.com/xmtp/docs-xmtp-org/refs/heads/main/docs/pages/img/authen-to-inbox.PNG" alt="MetaMask wallet browser extension Sign this message? window showing an XMTP: Authenticate to inbox message" />

## Sign to add another address to your inbox

You can add another wallet address to your inbox at any time. For example, you might have started using an app with one wallet address and now want to use the app with an additional wallet address.

If you decide to add another wallet address to your inbox, a **Sign this message?** window displays to request that you sign an **XMTP : Authenticate to inbox** message. Specifically, the message requests that you sign a **Link address to inbox** message. for example:

```text
- Link address to inbox
  (Address: ${ASSOCIATED_ADDRESS})
```

Sign with the wallet address you want to add to grant it access to the inbox. You can now use your inbox to exchange messages using the wallet address you just added.

## Sign to remove address from your inbox

You can remove a wallet address from your inbox at any time.

If you decide to remove a wallet address from your inbox, a **Sign this message?** window displays to request that you sign an **XMTP : Authenticate to inbox** message. Specifically, the message requests that you sign an **Unlink address from inbox** message. For example:

```text
- Unlink address from inbox
  (Address: ${ASSOCIATED_ADDRESS})
```

Sign with the wallet address you want to remove to unlink it from your inbox. You can no longer access your inbox using the wallet address you removed.

## Sign to change inbox recovery address

The first time you used an app installation built with XMTP v3, the wallet address you used to create an inbox is automatically set as the inbox recovery address. You can change the recovery address to a different wallet address at any time.

If you decide to change the recovery address, a **Sign this message?** window displays to request that you sign an **XMTP : Authenticate to inbox** message. Specifically, the message requests that you sign a **Change inbox recovery address** message. For example:

```text
- Change inbox recovery address
  (Address: ${NEW_RECOVERY_ADDRESS})
```

Sign with the wallet address you want to set as the recovery address to change the recovery address.

## Sign to consent to receive broadcast messages

When you click a **Subscribe** button built with XMTP’s consent standards, you're prompted to sign an **XMTP : Grant inbox consent to sender** message.

For example, here’s the MetaMask **Signature request** window that displays when clicking the **Subscribe** button on this [example subscription page](https://subscribe-broadcast.vercel.app/subscribe/button) connected to the XMTP `dev` network. You typically see **Subscribe** buttons like this on a web page or in a dapp.

![MetaMask wallet browser extension Signature request window showing an "XMTP: Grant inbox consent to sender" message](https://raw.githubusercontent.com/xmtp/docs-xmtp-org/main/docs/pages/img/consent-proof-sign.png)

When you click **Sign**, you're consenting to receive broadcast messages from the publisher at your connected wallet address. You can see the publisher's sending address in the **Signature request** window.

When you provide consent, you're adding the publisher's address to your personal XMTP allowed contacts list. This enables messages from the publisher to be displayed in your main inbox instead of being treated as a message from an unknown sender and placed in a secondary view.

To learn about XMTP's consent standards, see [Understand how user consent preferences support spam-free inboxes](/inboxes/user-consent/user-consent).
