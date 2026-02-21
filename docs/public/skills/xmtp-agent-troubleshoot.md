# XMTP Agent Troubleshooting

Diagnose and fix common issues when connecting agents to the XMTP network.

## Transport error / GenericFailure

The `node:22-slim` Docker image lacks CA certificates needed for TLS. Fix:

```dockerfile
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
```

Works locally but fails in Docker? Almost certainly this issue.

## Wallet key format

`Agent.createFromEnv()` requires the `0x` prefix:

- Correct: `XMTP_WALLET_KEY=0xabc123...`
- Wrong: `XMTP_WALLET_KEY=abc123...`

## PRAGMA key error

Encryption key mismatch with existing database. Either keep `XMTP_DB_ENCRYPTION_KEY` consistent or delete `xmtp-*.db3*` files to start fresh.

## Too many installations

Limit is 10 installations per inbox. Set `XMTP_DB_DIRECTORY` to a persistent path per deployment environment. Revoke extras via `Client.revokeInstallations()`.

## Association error: Missing identity update

Caused by switching `XMTP_ENV` (e.g., dev → production) without clearing the database. The dev and production networks have separate identity registries. Fix: delete `xmtp-*.db3*` files or use a separate `XMTP_DB_DIRECTORY` per environment.

## Infinite loops (raw SDK)

Filter self-messages manually:

```typescript
if (message.senderInboxId === client.inboxId) continue;
```

## Debugging

- Enable verbose logging: `XMTP_FORCE_DEBUG_LEVEL=debug`
- Test agents at `xmtp.chat/dm/<address>`
- Use `logDetails(agent)` for full client info
