import { Agent } from "@xmtp/agent-sdk";

const agent = await Agent.createFromEnv();

agent.on("text", async (ctx) => {
  await ctx.conversation.sendText("gm");
});

agent.on("start", (ctx) => {
  console.log(`Agent is running at ${ctx.client.accountIdentifier?.identifier}`);
});

await agent.start();
