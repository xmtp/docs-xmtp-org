# Update your app or agent to use an XMTP SDK with Gateway Service support

Starting on November 15, 2025, you'll be able to update your app or agent to use an XMTP SDK version that supports XMTP Gateway Service helpers, enabling your app or agent to communicate with your XMTP Gateway Service.

The minimum supported SDK version for each platform will be:

- Agent SDK v2.0.0
- Browser SDK v6.0.0
- Node SDK v5.0.0
- React Native SDK v6.0.0
- Kotlin SDK v5.0.0
- Swift SDK v5.0.0

## FAQ

### Will updating to an SDK that uses the decentralized network impact performance and network speed?

Most SDK actions will have comparable performance on the decentralized network. All reads (`sync*`, `stream*`, etc.) and the most common writes (`conversation.send`) will have similar performance.

However, the following actions will have an estimated ~500ms slowdown:

- Registering a new identity to the network (first-time client setup)
- Adding members to a group
- Updating group metadata

### Will existing local databases persist after updating my SDK?

Local databases will be fully migrated. No messages will be lost during the transition.

### Can I update my app or agent to use the new SDK version starting on November 15, or do I need to wait until December 9?

Yes, you can use the new SDK version starting on November 15. The SDK versions released on November 15 will work in backward compatibility mode with the centralized network. Once you upgrade and have your [Gateway Service](/fund-agents-apps/run-gateway) properly set up, the transition on December 9 will happen automatically.

On December 9, the centralized network will start returning a special error code that tells clients to switch over to the decentralized network. If you're already using the November 15 SDK version, this switch will happen automatically without requiring any action on your part.
