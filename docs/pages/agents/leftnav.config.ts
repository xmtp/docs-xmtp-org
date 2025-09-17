// Agents sidebar configuration
export const agentsSidebarConfig = [
  {
    text: "Get started",
    collapsed: false,
    items: [
      {
        text: "Build XMTP Agents",
        link: "./get-started/intro",
      },
      {
        text: "Tutorial: Build an agent 🤖",
        link: "./get-started/build-an-agent",
      },
      {
        text: "FAQ",
        link: "./get-started/faq",
      },
    ],
  },
  {
    text: "Build core messaging",
    collapsed: false,
    items: [
      {
        text: "Create an EOA or SCW signer",
        link: "./core-messaging/create-a-signer",
      },
      {
        text: "Create a client",
        link: "./core-messaging/create-a-client",
      },
      {
        text: "Stream messages",
        link: "./core-messaging/stream",
      },
      {
        text: "Create conversations",
        link: "./core-messaging/create-conversations",
      },
      {
        text: "Manage agent installations",
        link: "./core-messaging/agent-installations",
      },
      {
        text: "Manage group permissions",
        link: "./core-messaging/group-permissions",
      },
      {
        text: "Manage group metadata",
        link: "./core-messaging/group-metadata",
      },
      {
        text: "Observe rate limits",
        link: "./core-messaging/rate-limits",
      },
    ],
  },
  {
    text: "Support rich content types",
    collapsed: false,
    items: [
      {
        text: "Understand content types",
        link: "./content-types/content-types",
      },
      {
        text: "Reactions",
        link: "./content-types/reactions",
      },
      {
        text: "Replies",
        link: "./content-types/replies",
      },
      {
        text: "Attachments",
        link: "./content-types/attachments",
      },
      {
        text: "Transactions",
        link: "./content-types/transactions",
      },
      {
        text: "Markdown",
        link: "./content-types/markdown",
      },
      {
        text: "Inline actions",
        link: "./content-types/inline-actions",
      },
    ],
  },
  {
    text: "Debug agents",
    link: "./debug-agents",
    items: [],
  },
  {
    text: "Deploy agents",
    link: "./deploy-agent",
    items: [],
  },
  {
    text: "Security",
    link: "./agent-security",
    items: [],
  },
];
