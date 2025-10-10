# Get started with funding an app or agent to send messages with XMTP

Starting December 9, 2025, apps and agents must pay fees to send messages on the decentralized XMTP Broadcast Network.

This guide provides a timeline and checklist to prepare your app for this transition.

## Key production milestones

- **October 15, 2025**:
  - The XMTP Gateway Service library is available in Go.
  - **→ Deploy your gateway service.**
- **November 1, 2025**:
  - XMTP payer wallets can be funded on mainnet.
  - **→ Fund your payer wallet.**
- **November 15 2025**:
  - All client SDKs and are compatible with mainnet.
  - **→ Update your client SDKs.**
- **December 9, 2025**:
  - All message traffic is routed through the decentralized network.
  - **→ Older client SDKs are incompatible.**

## Required tasks

Complete these tasks by **December 9, 2025**, to ensure your app can send messages on the decentralized XMTP Broadcast Network.

1. **From October 15**: Deploy the [XMTP Gateway Service](/fund-agents-apps/run-gateway) to enable your app or agent to send messages and pay fees on XMTP mainnet.
2. **From November 1**: [Fund your app](/fund-agents-apps/fund-your-app) using the XMTP Funding Portal. We recommend funding 3-6 months of estimated usage.
3. **From November 15**: Update your app to use a [decentralization-ready XMTP SDK](/fund-agents-apps/update-sdk) to connect to your XMTP Gateway Service.

## Recommended next steps

- Learn about [XMTP fees](/fund-agents-apps/calculate-fees).
- Test your implementation:
  - Verify that your [XMTP Gateway Service](/fund-agents-apps/run-gateway) and [funding](/fund-agents-apps/fund-your-app) are working correctly.
- [Set up monitoring](/fund-agents-apps/run-gateway#metrics-and-observability) and automated tests for your XMTP Gateway Service.
