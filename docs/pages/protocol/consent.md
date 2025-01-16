# Consent in XMTP

:::info[Key takeaways]

- **What is consent?** Simply put, consent is who you allow and who you block
- **Why it matters:** Your choices about who can message you should be private and work across all apps
- **How it works:** Each wallet maintains a private, encrypted list of allowed and blocked addresses
- **Future-proof:** XMTP is making it easier to manage messaging permissions while keeping your choices private

:::

## Understand consent

Consent in XMTP manages who can message you across all apps you use:

**For direct messages**, it's about who you allow and who you block:

- Allow certain addresses to message you
- Block addresses you don't want to hear from

**For group chats**, it's about which groups you want to participate in:

- Join the group to receive its messages
- Block to stop receiving messages from the group

In both cases, new messages and invites stay in your message requests until you make a decision.

## Privacy-first design

Your choices about who can message you are private. This means:

- Only you can see who you've allowed or blocked
- Your choices are encrypted and visible only to you
- No one else can see your messaging preferences
- Blocked users don't know they're blocked

## How consent works

The XMTP network maintains three private states for each potential messaging relationship:

```rust
pub enum ConsentState {
    Unknown,    // Default state for new contacts
    Allowed,    // Contacts you've allowed
    Denied,     // Contacts you've blocked
}
```

:::note[Implementation note]

Currently, consent preferences are client-side filters—they help apps determine which messages to show in your inbox, but don't prevent message transmission at the network level. 

To learn about future plans to implement network-level consent enforcement, see [The future of consent](https://xmtp.org/roadmap#the-future-of-consent).

:::

When you receive a new message, it appears in your message requests. Apps typically show:

- Main inbox: Messages from allowed addresses and joined groups
- Message requests: New messages and invites you haven't decided about
- Hidden: Messages from blocked addresses and groups

## FAQ

### If I block someone, will they know?

No, blocked users aren't notified of their status. From their perspective, it appears the same as if you haven't responded to their message.

### Can I revoke consent after granting it?

Yes, you can always privately revoke consent. The other party won't be notified, but you'll no longer see their messages.

### What happens if someone I blocked is in a group chat with me?

Apps typically show you that the blocked user sent a message but protect you from its content with a "tap to unhide" option. However, the exact UI implementation may vary by app.

### Does blocking someone remove our message history?

No, blocking only affects new messages. Previous conversations remain in your app but may be hidden from view depending on the app's design.

### What happens when someone messages me from a different wallet than before?

Each wallet address is treated separately for consent purposes. If someone messages you from a new address, that message will appear in your message requests, even if you've allowed their other address.

### Can I mute conversations?

No. Currently, you cannot mute conversations.

To learn about future plans to add muting capabilities to the protocol, see [The future of consent](https://xmtp.org/roadmap#the-future-of-consent).
