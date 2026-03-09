/**
 * Known AI/bot User-Agent patterns.
 * Each entry: [pattern, label shown in logs]
 */
const AI_BOT_PATTERNS: [RegExp, string][] = [
  // LLM crawlers
  [/GPTBot/i, "GPTBot (OpenAI)"],
  [/ChatGPT-User/i, "ChatGPT-User (OpenAI)"],
  [/OAI-SearchBot/i, "OAI-SearchBot (OpenAI)"],
  [/Claude-Web/i, "Claude-Web (Anthropic)"],
  [/ClaudeBot/i, "ClaudeBot (Anthropic)"],
  [/anthropic-ai/i, "Anthropic AI"],
  [/PerplexityBot/i, "PerplexityBot"],
  [/Perplexity-User/i, "Perplexity-User"],
  [/cohere-ai/i, "Cohere"],
  [/YouBot/i, "YouBot (You.com)"],
  [/Google-Extended/i, "Google-Extended (Gemini)"],

  // Code/dev agents
  [/Devin/i, "Devin"],
  [/Codex/i, "Codex (OpenAI)"],

  // Common crawlers that feed AI
  [/CCBot/i, "CCBot (Common Crawl)"],
  [/Amazonbot/i, "Amazonbot"],
  [/Bytespider/i, "Bytespider (ByteDance)"],
  [/Diffbot/i, "Diffbot"],
  [/FacebookBot/i, "FacebookBot (Meta)"],
  [/meta-externalagent/i, "Meta External Agent"],
  [/Applebot-Extended/i, "Applebot-Extended"],
  [/AI2Bot/i, "AI2Bot (Allen AI)"],
  [/Timpibot/i, "Timpibot"],
  [/ISSCyberRiskCrawler/i, "ISSCyberRiskCrawler"],
  [/Scrapy/i, "Scrapy"],
  [/PetalBot/i, "PetalBot"],
  [/Webz\.io/i, "Webz.io"],

  // Generic AI agent patterns
  [/ai-agent/i, "AI Agent (generic)"],
  [/llm/i, "LLM (generic)"],
  [/langchain/i, "LangChain"],
  [/llamaindex/i, "LlamaIndex"],
];

export default function middleware(request: Request): Response | undefined {
  const ua = request.headers.get("user-agent") || "";
  const url = new URL(request.url);

  // Skip static assets — only log page/doc requests
  if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot|map)$/i.test(url.pathname)) {
    return;
  }

  // Track llms.txt fetches — strong signal of AI/agent tooling
  if (/^\/llms/i.test(url.pathname)) {
    console.log(
      JSON.stringify({
        type: "llms-txt-fetch",
        path: url.pathname,
        ua: ua.slice(0, 300),
        ts: new Date().toISOString(),
      })
    );
  }

  for (const [pattern, label] of AI_BOT_PATTERNS) {
    if (pattern.test(ua)) {
      // Structured JSON log — shows up in Vercel Monitoring > Logs
      console.log(
        JSON.stringify({
          type: "ai-bot-visit",
          bot: label,
          path: url.pathname,
          ua: ua.slice(0, 300),
          ts: new Date().toISOString(),
        })
      );
      return;
    }
  }
}

export const config = {
  matcher: ["/((?!_vercel|_next/static|_next/image|favicon.ico).*)"],
};
