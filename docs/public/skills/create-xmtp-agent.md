# Create XMTP Agent

Scaffold a new project that connects an agent to the XMTP network for secure messaging.

The XMTP Agent SDK is a messaging framework, not an agent framework. It gives your agent the ability to send and receive encrypted messages. Your agent provides the brain (AI, rules, or any logic). The SDK provides the network connection.

## Architecture — three layers

1. **Brain** — your agent's logic (Claude, OpenAI, rules, or anything else)
2. **Messaging framework** — XMTP Agent SDK (encrypted send/receive over XMTP)
3. **Glue** — your code wiring messages to the brain and back

## Project structure

```
project/
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── Dockerfile
└── .dockerignore
```

## package.json

```json
{
  "name": "my-xmtp-agent",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx --watch src/index.ts",
    "start": "tsx src/index.ts"
  },
  "engines": {
    "node": ">=22"
  }
}
```

**Install dependencies:**

```bash
# Always needed
npm install @xmtp/agent-sdk dotenv
npm install -D typescript tsx @types/node

# Add one of these depending on the brain:
npm install @anthropic-ai/sdk    # Claude brain
npm install openai               # OpenAI brain
```

## .env.example

```
XMTP_WALLET_KEY=
XMTP_DB_ENCRYPTION_KEY=
XMTP_ENV=dev
XMTP_DB_DIRECTORY=
# Add ANTHROPIC_API_KEY or OPENAI_API_KEY depending on brain
```

## src/index.ts — Claude brain

```typescript
import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { Agent } from "@xmtp/agent-sdk";

// 1. BRAIN — your agent's logic
const anthropic = new Anthropic();
const SYSTEM_PROMPT = `[REPLACE: Define your agent's personality and rules here.]`;

async function think(input: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: input }],
  });
  const block = response.content[0];
  return block?.type === "text" ? block.text : "I couldn't generate a response.";
}

// 2. MESSAGING FRAMEWORK — connects your agent to XMTP
const agent = await Agent.createFromEnv();

// 3. GLUE — wires messages to the brain and back
agent.on("text", async (ctx) => {
  const input = ctx.message.content;
  const response = await think(input);
  await ctx.conversation.sendText(response);
});

agent.on("start", () => {
  console.log(`Agent online: ${agent.address}`);
  console.log(`Chat: http://xmtp.chat/dm/${agent.address}`);
});

agent.on("unhandledError", (error) => { console.error("Error:", error); });

await agent.start();
```

## src/index.ts — OpenAI brain swap

Replace the brain section with:

```typescript
import OpenAI from "openai";
const openai = new OpenAI();
const SYSTEM_PROMPT = `[REPLACE: Your agent's personality]`;

async function think(input: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: input },
    ],
  });
  return response.choices[0]?.message?.content ?? "I couldn't generate a response.";
}
```

## src/index.ts — Rules brain swap

Replace the brain section with:

```typescript
function think(input: string): string {
  const lower = input.toLowerCase().trim();
  // [REPLACE: Add your rules/logic here]
  return "I received your message.";
}
```

## Dockerfile

`ca-certificates` is required. Without it, gRPC/TLS connections fail with `[Error: transport error] { code: 'GenericFailure' }`.

```dockerfile
FROM node:22-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY src ./src
COPY tsconfig.json ./

CMD ["npm", "start"]
```

## .dockerignore

```
node_modules
*.db3*
.env
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "target": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["node"]
  },
  "include": ["**/*.ts"]
}
```

## .gitignore

```
node_modules/
*.db3*
.env
```

## Critical notes

| Concern | Detail |
|---|---|
| Wallet key format | Must include `0x` prefix |
| Key loading | Use `Agent.createFromEnv()` — normalizes format automatically |
| Node version | 22+ required |
| Production visibility | Set `XMTP_ENV=production` for production apps like xmtp.chat |
| Docker TLS | Must include `ca-certificates` in image |
| Database persistence | Persist DB directory across deploys — installation limit is 10 |
