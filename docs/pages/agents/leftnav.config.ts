// Agents sidebar configuration
export const agentsSidebarConfig = [
  {
    text: "Get started",
    collapsed: false,
    items: [
      {
        text: "Build XMTP Agents",
        link: "../agents/get-started/intro",
      },
      {
        text: "Tutorial: Build an agent 🤖",
        link: "../agents/get-started/build-an-agent",
      },
      {
        text: "FAQ",
        link: "../agents/get-started/faq",
      },
    ],
  },
  {
    text: "Build core messaging",
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
        text: "Manage agent installations",
        link: "../agents/build-agents/agent-installations",
      },
      {
        text: "Manage group permissions",
        link: "../agents/build-agents/group-permissions",
      },
      {
        text: "Manage group metadata",
        link: "../agents/build-agents/group-metadata",
      },
      {
        text: "Observe rate limits",
        link: "../agents/build-agents/rate-limits",
      },
    ],
  },
  {
    text: "Support rich content types",
    collapsed: false,
    items: [
      {
        text: "Understand content types",
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
    text: "Debug agents",
    link: "../agents/debug-agents",
    items: [],
  },
  {
    text: "Deploy agents",
    link: "../agents/deploy-agent",
    items: [],
  },  
  {
    text: "Examples",
    link: "https://github.com/ephemeraHQ/xmtp-agent-examples",
    items: [],
  },
  {
    text: "Security",
    link: "../agents/agent-security",
    items: [],
  },
];
