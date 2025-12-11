// Shared sidebar configuration - single source of truth
// This eliminates duplication between vocs.config.tsx and AutoBreadcrumb.tsx

export const sidebarConfig = {
  '/agents/':  [
    {
      text: "Get started",
      collapsed: false,
      items: [
        {
          text: "Introduction",
          link: "/agents/get-started/intro",
        },
        {
          text: "Quickstart",
          link: "/agents/get-started/build-an-agent",
        },
        {
          text: "FAQ",
          link: "/agents/get-started/faq",
        },
        {
          text: "Cursor rules",
          link: "https://github.com/xmtplabs/xmtp-agent-examples/blob/main/.cursor/rules/xmtp.mdc",
        },
        { text: 'Join the XMTP Dev Community',
          link: 'https://forms.gle/hesZ55WGMjJnZ7sQA',
        },
      ],
    },
    {
      text: "Build agents",
      collapsed: false,
      items: [
        {
          text: "Create a client",
          link: "/agents/build-agents/create-a-client",
        },
        {
          text: "Local database",
          link: "/agents/build-agents/local-database",
        },
        {
          text: "Stream messages",
          link: "/agents/build-agents/stream",
        },
        {
          text: "Create conversations",
          link: "/agents/build-agents/create-conversations",
        },
        {
          text: "Group chats",
          link: "/agents/build-agents/groups",
        },
        {
          text: "Group permissions",
          link: "/agents/build-agents/group-permissions",
        },
      ],
    },
    {
      text: "Core concepts",
      collapsed: false,
      items: [
        {
          text: "Identity",
          link: "/agents/concepts/identity",
        },
        {
          text: "Events",
          link: "/agents/concepts/event-driven",
        },
        {
          text: "Middleware",
          link: "/agents/concepts/middleware",
        },
        {
          text: "Filters",
          link: "/agents/concepts/filters",
        },
        {
          text: "Context",
          link: "/agents/concepts/context",
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
          text: "Reactions",
          link: "/agents/content-types/reactions",
        },
        {
          text: "Replies",
          link: "/agents/content-types/replies",
        },
        {
          text: "Group updates",
          link: "/agents/content-types/group-updates",
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
          text: "Transaction references",
          link: "/agents/content-types/transaction-refs",
        },
        {
          text: "Markdown",
          link: "/agents/content-types/markdown",
        },
      ],
    },
    {
      text: "Examples",
      link: "https://github.com/xmtplabs/xmtp-agent-examples",
      items: [],
    },
    {
      text: "Deployment",
      collapsed: false,
      items: [
        {
          text: "Debug agents",
          link: "/agents/deploy/debug-agents",
        },
        {
          text: "Deploy agents",
          link: "/agents/deploy/deploy-agent",
        },
        {
          text: "Security",
          link: "/agents/deploy/agent-security",
        },
        {
          text: "Rate limits",
          link: "/agents/deploy/rate-limits",
        },
      ],
    },
  ],  
  '/network/': [
    {
      text: "Run a network node",
      link: "/network/run-a-node",
    },
    {
      text: "Testnet nodes",
      link: "/network/network-nodes",
    },
  ],
  '/fund-agents-apps/': [
        {
          text: "Get started",
          link: "/fund-agents-apps/get-started",
        },
        {
          text: "Calculate fees",
          link: "/fund-agents-apps/calculate-fees",
        },
        {
          text: "Fund an app or agent",
          link: "/fund-agents-apps/fund-your-app",
        },
        {
          text: "Run your XMTP Gateway Service",
          link: "/fund-agents-apps/run-gateway",
        },
        {
          text: "Update your SDK",
          link: "/fund-agents-apps/update-sdk",
        },
        {
          text: "Glossary",
          link: "/fund-agents-apps/glossary",
        },
      ],
  '/protocol/': [
    {
      text: "Overview",
      link: "/protocol/overview",
    },
    {
      text: "Encryption",
      collapsed: false,
      items: [
        {
          text: "Security",
          link: "/protocol/security",
        },
        {
          text: "Epochs",
          link: "/protocol/epochs",
        },
        {
          text: "Envelope types",
          link: "/protocol/envelope-types",
        },
      ],
    },
    {
      text: "Identity",
      collapsed: false,
      items: [
        {
          text: "Inboxes, identities, and installations",
          link: "/protocol/identity",
        },
        {
          text: "Wallet signatures",
          link: "/protocol/signatures",
        },
      ],
    },
    {
      text: "Delivery",
      collapsed: false,
      items: [
        {
          text: "Topics",
          link: "/protocol/topics",
        },
        {
          text: "Cursors",
          link: "/protocol/cursors",
        },
        {
          text: "Intents",
          link: "/protocol/intents",
        },
      ],
    },
    {
      text: "Evolution",
      collapsed: false,
      items: [
        {
          text: "XMTP Improvement Proposals",
          link: "/protocol/xips",
        },
      ],
    },
    {
      text: "Vision",
      collapsed: false,
      items: [
        {
          text: "Security",
          link: "https://xmtp.org/security",
        },      
        {
          text: "Identity",
          link: "https://xmtp.org/identity",
        },     
        {
          text: "Digital money",
          link: "https://xmtp.org/digital-money",
        }, 
        {
          text: "Consent",
          link: "https://xmtp.org/consent",
        }, 
        {
          text: "Decentralization",
          link: "https://xmtp.org/decentralization",
        }, 
      ],
    },
  ],
  '/chat-apps/': [
    {
      text: "Intro to XMTP",
      collapsed: false,
      items: [
        {
          text: "Get started",
          link: "/chat-apps/intro/get-started",
        },
        {
          text: "Why XMTP?",
          link: "/chat-apps/intro/why-xmtp",
        },
        {
          text: "FAQ",
          link: "/chat-apps/intro/faq",
        },
        {
          text: "Build with LLMs",
          link: "/chat-apps/intro/build-with-llms",
        },
        {
          text: "Dev support",
          link: "/chat-apps/intro/dev-support",
        },
        {
          text: "Roadmap",
          link: "https://github.com/orgs/xmtp/projects/34/views/1",
        },
        { text: 'Join the XMTP Dev Community',
          link: 'https://forms.gle/hesZ55WGMjJnZ7sQA',
        },
      ],
    },
    {
      text: "SDKs",
      collapsed: false,
      items: [
        {
          text: "Browser SDK",
          link: "/chat-apps/sdks/browser",
        },
        {
          text: "Node SDK",
          link: "/chat-apps/sdks/node",
        },
        {
          text: "React Native SDK",
          link: "/chat-apps/sdks/react-native",
        },
        {
          text: "Android SDK",
          link: "/chat-apps/sdks/android",
        },
        {
          text: "iOS SDK",
          link: "/chat-apps/sdks/ios",
        },
      ],
    },
    {
      text: "Build core messaging",
      collapsed: false,
      items: [
        {
          text: "Create an EOA or SCW signer",
          link: "/chat-apps/core-messaging/create-a-signer",
        },
        {
          text: "Create a client",
          link: "/chat-apps/core-messaging/create-a-client",
        },
        {
          text: "Create conversations",
          link: "/chat-apps/core-messaging/create-conversations",
        },
        {
          text: "Send messages",
          link: "/chat-apps/core-messaging/send-messages",
        },
        {
          text: "Support disappearing messages",
          link: "/chat-apps/core-messaging/disappearing-messages",
        },
        {
          text: "Manage group permissions",
          link: "/chat-apps/core-messaging/group-permissions",
        },
        {
          text: "Manage group metadata",
          link: "/chat-apps/core-messaging/group-metadata",
        },
        {
          text: "Support group invite links",
          link: "/chat-apps/core-messaging/support-group-invite-links",
        },
        {
          text: "Manage inboxes, IDs, and installations",
          link: "/chat-apps/core-messaging/manage-inboxes",
        },
        {
          text: "Observe rate limits",
          link: "/chat-apps/core-messaging/rate-limits",
        },
      ],
    },
    {
      text: "Fund an app",
      collapsed: false,
      items: [
        {
          text: "Get started",
          link: "/fund-agents-apps/get-started",
        },
        {
          text: "Calculate fees",
          link: "/fund-agents-apps/calculate-fees",
        },
        {
          text: "Fund an app",
          link: "/fund-agents-apps/fund-your-app",
        },
        {
          text: "Run your XMTP Gateway Service",
          link: "/fund-agents-apps/run-gateway",
        },
        {
          text: "Update your SDK",
          link: "/fund-agents-apps/update-sdk",
        },
        {
          text: "Glossary",
          link: "/fund-agents-apps/glossary",
        },
      ],
    },
    {
      text: "List, stream, sync, & back up",
      collapsed: false,
      items: [
        {
          text: "List conversations",
          link: "/chat-apps/list-stream-sync/list",
        },
        {
          text: "List messages",
          link: "/chat-apps/list-stream-sync/list-messages",
        },
        {
          text: "Stream conversations and messages",
          link: "/chat-apps/list-stream-sync/stream",
        },
        {
          text: "Sync conversations and messages",
          link: "/chat-apps/list-stream-sync/sync-and-syncall",
        },
        {
          text: "Sync preferences",
          link: "/chat-apps/list-stream-sync/sync-preferences",
        },
        {
          text: "Support backups",
          link: "/chat-apps/list-stream-sync/archive-backups",
        },
        {
          text: "History sync",
          link: "/chat-apps/list-stream-sync/history-sync",
        },
      ],
    },
    {
      text: "Support rich content types",
      collapsed: false,
      items: [
        {
          text: "Understand content types",
          link: "/chat-apps/content-types/content-types",
        },
        {
          text: "Attachments",
          link: "/chat-apps/content-types/attachments",
        },
        {
          text: "Onchain transactions",
          link: "/chat-apps/content-types/transactions",
        },
        {
          text: "Onchain transaction references",
          link: "/chat-apps/content-types/transaction-refs",
        },
        {
          text: "Reactions",
          link: "/chat-apps/content-types/reactions",
        },
        {
          text: "Replies",
          link: "/chat-apps/content-types/replies",
        },
        {
          text: "Read receipts",
          link: "/chat-apps/content-types/read-receipts",
        },
        {
          text: "Custom content",
          link: "/chat-apps/content-types/custom",
        },
        {
          text: "Fallback text for compatibility",
          link: "/chat-apps/content-types/fallback",
        },
      ],
    },
    {
      text: "Support spam-free chat apps",
      collapsed: false,
      items: [
        {
          text: "Understand user consent",
          link: "/chat-apps/user-consent/user-consent",
        },
        {
          text: "Support user consent",
          link: "/chat-apps/user-consent/support-user-consent",
        },
      ],
    },
    {
      text: "Support push notifications",
      collapsed: false,
      items: [
        {
          text: "Understand push notifications",
          link: "/chat-apps/push-notifs/understand-push-notifs",
        },
        {
          text: "Support push notifications",
          link: "/chat-apps/push-notifs/push-notifs",
        },
        {
          text: "Run a push notifications server",
          link: "/chat-apps/push-notifs/pn-server",
        },
        {
          text: "Try Android push notifications",
          link: "/chat-apps/push-notifs/android-pn",
        },
        {
          text: "Try iOS push notifications",
          link: "/chat-apps/push-notifs/ios-pn",
        },
      ],
    },
    {
      text: "Debug your app",
      link: "/chat-apps/debug-your-app",
      items: [],
    },
    {
      text: "Sign and verify payloads",
      link: "/chat-apps/use-signatures",
      items: [],
    },
  ],
};
