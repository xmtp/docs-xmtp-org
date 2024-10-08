# Understand XMTP versions

XMTP currently has three versions: V3, V2, and V1.

## XMTP V3

XMTP V3 refers to the latest version of XMTP, which has the following fundamental characteristics:

- Supports group chat. To learn more, see [Build group chat with MLS and XMTP](/groups/build-group-chat).
- Built on MLS (Message Layer Security), which delivers these [security and encryption guarantees](/protocol/security-encryption)
- Uses app installation-based handling. To learn more, see [Installations](/protocol/v3/identity#installations).
- Uses [LibXMTP](https://github.com/xmtp/libxmtp)
    - Creates and manages an SDK-level local database
    - Creates a V3 client that manages message handling between the app and network
    - Requires syncing groups and messages to pull the latest from the network, otherwise it will pull information from the local database only. To learn more, see [Sync group chats](/groups/build-group-chat#sync-group-chats).
- Introduces inbox identities
    - Inbox identities are created for users by XMTP V3 SDKs
    - Checks will be able to tell if a user has an inbox ID and can therefore be messaged via XMTP V3

The following XMTP SDKs support V3 and V2:

- [XMTP React Native](https://github.com/xmtp/xmtp-react-native)
- [XMTP Android](https://github.com/xmtp/xmtp-android)
- [XMTP iOS](https://github.com/xmtp/xmtp-ios)
- [XMTP Node](https://www.npmjs.com/package/@xmtp/mls-client) (experimental)

To learn more about how XMTP V3 works, see [Learn protocol concepts](/protocol/signatures).

## XMTP V2

XMTP V2 supports one-to-one chat. One-to-one chat will eventually be available through XMTP V3 and be built on MLS.

The following XMTP SDKs support V2:

- [XMTP React Native](https://github.com/xmtp/xmtp-react-native)
- [XMTP Android](https://github.com/xmtp/xmtp-android)
- [XMTP iOS](https://github.com/xmtp/xmtp-ios)
- [XMTP JavaScript](https://github.com/xmtp/xmtp-js)
- [XMTP React](https://github.com/xmtp/xmtp-web/tree/main/packages/react-sdk)
- [XMTP Node](https://www.npmjs.com/package/@xmtp/mls-client) (experimental)

To learn more about how XMTP V2 works, see the sections in [XMTP V2](/protocol/v2/architectural-overview).

## XMTP V1

XMTP V1 was deprecated as of January 2023, and new conversations started using XMTP V2 conversations. 

However, if you have an existing V1 conversation, new messages continue to be sent to it. To learn more, see [Determining whether to use XMTP V2 or V1 topics](/protocol/v2/architectural-overview#determining-whether-to-use-xmtp-v2-or-v1-topics).

XMTP will provide ample advanced notice regarding when writes will be turned off for XMTP V1.
