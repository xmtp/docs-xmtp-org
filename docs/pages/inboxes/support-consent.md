## Support user consent preferences and spam-free inboxes

:::warning[🚧 XMTP V3 Alpha]

The XMTP V3 SDKs are in **alpha** status and ready for you to start experimenting with.
However, we do **not** recommend using alpha software in production apps. Software in this status will change as we add features and iterate based on feedback.


XMTP V3 includes breaking changes from V2, most of which will be mitigated by the SDKs. Guidance about the migration path from V2 to V3 will be delivered in forthcoming XMTP V3 release notes.

Join the [XMTP Devs 💪 group chat](https://converse.xyz/group-invite/e-KZyw77m-7sjUmEk5lgu) in Converse to keep up with the latest updates.

:::

In any open and permissionless messaging ecosystem, spam is an inevitable reality, and XMTP is no exception.

However, with XMTP, you can give your users inboxes that are **spam-free spaces for chosen contacts only** by supporting user consent preferences.

To learn more, see [Understand how user consent preferences enable spam-free inboxes](/consent/user-consent).

Use the following methods to provide users with control over their messaging experience, ensuring their inboxes are tailored to their preferences and free from spam.

### Get new consent records from the network - coming soon

Get the latest consent records from the network:

```tsx [React Native]
await alix.syncConsent()
```

### Get the consent state of a conversation

Check the current consent state of a specific conversation:

```tsx [React Native]
await conversation.consentState()
```

*Replaces V2 `client.contact.isGroupAllowed(groupId)`* 

### Update the conversation consent state

Update the consent state of a conversation to allow or deny messages:

```tsx [React Native]
await conversation.updateConsent('allowed') // 'allowed' | 'denied'
```

*Replaces V2 `client.contact.allowGroups([groupIds])`*

### Stream consent records in real-time - coming soon

Listen for real-time updates to consent records:

```tsx [React Native]
await alix.streamConsent()
```

