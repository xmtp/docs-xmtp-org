# Update your app or agent to use an XMTP SDK with Gateway Service support

Once [Testnet- and Mainnet-compatible XMTP SDKs are delivered](/fund-agents-apps/get-started#key-milestones-and-actions), you can update your app or agent to a compatible SDK version that includes helpers that enable it to communicate with your XMTP Gateway Service.

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
