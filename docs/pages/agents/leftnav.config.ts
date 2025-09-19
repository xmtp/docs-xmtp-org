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
        text: "Group metadata",
        link: "../agents/build-agents/group-metadata",
      },
      {
        text: "Group permissions",
        link: "../agents/build-agents/group-permissions",
      },
    ],
  },
  {
    text: "Core concepts",
    collapsed: false,
    items: [
      {
        text: "Identity",
        link: "../agents/concepts/identity",
      },
      {
        text: "Manage installations",
        link: "../agents/concepts/installations",
      },
      {
        text: "Event-driven architecture",
        link: "../agents/concepts/event-driven",
      },
      {
        text: "Middleware",
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
    text: "Support rich content types",
    collapsed: false,
    items: [
      {
        text: "Understand content types",
        link: "/agents/content-types/content-types",
      },
      {
        text: "Attachments",
        link: "/agents/content-types/attachments",
      },
      {
        text: "Onchain transactions",
        link: "/agents/content-types/transactions",
      },
      {
        text: "Onchain transaction references",
        link: "/agents/content-types/transaction-refs",
      },
      {
        text: "Reactions",
        link: "/agents/content-types/reactions",
      },
      {
        text: "Replies",
        link: "/agents/content-types/replies",
      },
    ],
  },
  {
    text: "Examples",
    link: "https://github.com/ephemeraHQ/xmtp-agent-examples",
    items: [],
  },
  {
    text: "Deployment",
    collapsed: false,
    items: [
      {
        text: "Debug agents",
        link: "../agents/deploy/debug-agents",
      },
      {
        text: "Deploy agents",
        link: "../agents/deploy/deploy-agent",
      },
      {
        text: "Security",
        link: "../agents/deploy/agent-security",
      },
      {
        text: "Rate limits",
        link: "../agents/deploy/rate-limits",
      },
    ],
  },
];
