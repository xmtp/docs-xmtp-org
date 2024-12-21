# Encryption in XMTP

:::info[Key takeaways]

- **Protecting your privacy:** End-to-end encryption secures both your message content and metadata
- **Why it matters:** Your messages stay private with the same security as Signal and WhatsApp
- **How it works:** Uses the IETF-standard Messaging Layer Security (MLS) protocol
- **Future-proof:** MLS provides better efficiency than previous protocols, helping keep network costs low

:::

## End-to-end encrypted messaging

When you send a message with XMTP, it's encrypted from the moment you hit send until it's decrypted on your recipient's device. This end-to-end encryption ensures that no one in between—not even the XMTP network itself—can read your messages. The encryption process protects both the content of your messages and their integrity, creating a secure channel between you and your recipients.

## Privacy by design

Your privacy in XMTP goes beyond just encrypting message content. The protocol also protects metadata—information about who is messaging whom, when messages are sent, and how conversations are structured. While network nodes can see when encrypted messages are transmitted and their size, both message content and recipient information are encrypted. This means nodes can't determine who sent messages or who they're for, keeping your communication patterns private.

## Security that matches the best

XMTP provides the same strong security properties that users expect from apps like Signal and WhatsApp. The protocol provides forward secrecy, which means that even if someone gains access to current encryption keys, they can't read any past messages. And if a key is ever compromised, the system quickly recovers by rotating keys and establishing new secure connections, providing what's known as post-compromise security.

## The technology behind it

### Messaging Layer Security

The [Messaging Layer Security](https://messaginglayersecurity.rocks/) (MLS) protocol is the next generation of secure messaging, recently standardized by the Internet Engineering Task Force (IETF). It builds on the security foundations established by the Signal protocol (used in Signal and WhatsApp). With extensive security research and review behind it, MLS was designed for wide adoption across the messaging industry.

XMTP chose MLS for its combination of strong security and efficient operation. Its streamlined group key management helps keep network costs low, making it particularly well-suited for decentralized messaging.

:::note[See the code]

XMTP's implementation of MLS is open source and can be found at https://github.com/xmtp/libxmtp/tree/main/xmtp_mls

:::

When you start a conversation in XMTP, MLS automatically manages your encryption keys and conversation security. The protocol handles creating new conversations, adding or removing participants, and regularly updating encryption keys to maintain security. Every message you send is encrypted with the latest keys.

## FAQ

### Can XMTP read my messages?

No, messages are encrypted end-to-end. Only participants in a conversation have the keys to decrypt the messages in it.

### How does XMTP's encryption compare to Signal or WhatsApp?

XMTP provides the same security properties (forward secrecy and post-compromise security) as Signal and WhatsApp, using the newer, more efficient MLS protocol.

### Can others see who I'm messaging with?

No. Message recipients are encrypted, so even network nodes cannot see who is messaging whom. Nodes can only see timing and size of encrypted messages.

### What happens if I lose access to my wallet?

You'll need to start new conversations from your new wallet. Messages sent to your old wallet address can't be decrypted without access to that wallet.

### Are group messages as secure as direct messages?

Yes, MLS provides the same security properties for both group and direct messages. In fact, MLS is particularly efficient for group messaging.

### What if I suspect my wallet is compromised?

Due to forward secrecy, even if someone gains access to your wallet, they can't read your past messages. You should start using a new wallet immediately - this ensures they won't be able to read future messages either.

### How does encryption work across different apps?

All XMTP apps use the same MLS protocol, ensuring consistent encryption across the ecosystem.
