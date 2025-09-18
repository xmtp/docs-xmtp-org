// Agents sidebar configuration
export const agentsSidebarConfig = [
  {
    text: "Get started",
    collapsed: false,
    items: [
      {
        text: "Introduction",
        link: "../agents/get-started/intro",
      },
      {
        text: "Quickstart",
        link: "../agents/get-started/build-an-agent",
      },
      {
        text: "FAQ",
        link: "../agents/get-started/faq",
      },
    ],
  },
  {
    text: "Build agents",
    collapsed: false,
    items: [
      {
        text: "Create a client",
        link: "../agents/build-agents/create-a-client",
      },
      {
        text: "Stream messages",
        link: "../agents/build-agents/stream",
      },
      {
        text: "Create conversations",
        link: "../agents/build-agents/create-conversations",
      },
      {
        text: "Manage installations",
        link: "../agents/build-agents/agent-installations",
      },
      {
        text: "Group chat",
        link: "../agents/build-agents/group-chat",
      },
      {
        text: "Rate limits",
        link: "../agents/build-agents/rate-limits",
      },
    ],
  },
  {
    text: "Core concepts",
    collapsed: false,
    items: [
      {
        text: "Event-driven architecture",
        link: "../agents/concepts/event-driven",
      },
      {
        text: "Middleware & routing",
        link: "../agents/concepts/middleware",
      },
      {
        text: "Message filters",
        link: "../agents/concepts/filters",
      },
      {
        text: "Context & helpers",
        link: "../agents/concepts/context",
      },
    ],
  },
  {
    text: "Content types",
    collapsed: false,
    items: [
      {
        text: "Overview",
        link: "../agents/content-types/content-types",
      },
      {
        text: "Reactions",
        link: "../agents/content-types/reactions",
      },
      {
        text: "Replies",
        link: "../agents/content-types/replies",
      },
      {
        text: "Attachments",
        link: "../agents/content-types/attachments",
      },
      {
        text: "Transactions",
        link: "../agents/content-types/transactions",
      },
      {
        text: "Markdown",
        link: "../agents/content-types/markdown",
      },
      {
        text: "Inline actions",
        link: "../agents/content-types/inline-actions",
      },
    ],
  },
  {
    text: "Testing & deployment",
    collapsed: false,
    items: [
      {
        text: "Debug agents",
        link: "../agents/testing/debug-agents",
      },
      {
        text: "Deploy agents",
        link: "../agents/deploy/deploy-agent",
      },
      {
        text: "Best practices",
        link: "../agents/deploy/best-practices",
      },
    ],
  },
  {
    text: "Security",
    link: "../agents/agent-security",
    items: [],
  },
  {
    text: "Examples",
    link: "https://github.com/ephemeraHQ/xmtp-agent-examples",
    items: [],
  },
];
