# Deploy XMTP Agent to Railway

Deploy an agent that's connected to the XMTP network to a cloud platform like Railway.

## Pre-deployment checklist

- Agent runs locally via `npx tsx src/index.ts`
- `Dockerfile` exists with `ca-certificates` installed
- `.dockerignore` excludes `.env`, `node_modules`, `*.db3*`
- `.env` has all required variables

## Dockerfile

The `ca-certificates` package is essential. Without it, gRPC/TLS connections to the XMTP network fail with `[Error: transport error] { code: 'GenericFailure' }`.

```dockerfile
FROM node:22-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* .yarnrc.yml* ./
RUN npm install || yarn install --immutable
COPY src ./src
COPY tsconfig.json ./
CMD ["npm", "start"]
```

## Railway deployment steps

```bash
npm install -g @railway/cli
railway login
railway init
railway up
railway service link <service-name>
```

Set environment variables. `XMTP_WALLET_KEY` must include the `0x` prefix:

```bash
railway variables set \
  "XMTP_WALLET_KEY=0x..." \
  "XMTP_DB_ENCRYPTION_KEY=0x..." \
  "XMTP_ENV=production" \
  "ANTHROPIC_API_KEY=sk-ant-..."
```

Check logs with `railway service logs`. A successful start shows the agent address and a chat URL.

## Persistent storage

Each new XMTP installation counts toward a 10-installation-per-inbox limit. Railway's filesystem is ephemeral by default — configure a volume and set `XMTP_DB_DIRECTORY` to the mount path so the database persists across redeploys. The same applies to other platforms like Fly.io.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `transport error` / `GenericFailure` | Add `ca-certificates` to Dockerfile |
| Wallet key format error | Prefix key with `0x` |
| Encryption key error | Use consistent `XMTP_DB_ENCRYPTION_KEY` |
| Installation count warnings | Configure persistent DB storage |
