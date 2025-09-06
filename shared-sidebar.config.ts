// Shared sidebar configuration - single source of truth
// This eliminates duplication between vocs.config.tsx and AutoBreadcrumb.tsx

export const sidebarConfig = {
  '/agents/': [
    {
      text: "Get started",
      collapsed: false,
      items: [
        {
          text: "Tutorial: Build an agent 🤖",
          link: "/agents/get-started/build-an-agent",
        },
        {
          text: "What is XMTP?",
          link: "/agents/get-started/intro",
        },
        {
          text: "FAQ",
          link: "/agents/get-started/faq",
        },
      ],
    },
    {
      text: "Build core messaging",
      collapsed: false,
      items: [
        {
          text: "Create an EOA, SCW, or passkey signer",
          link: "/agents/core-messaging/create-a-signer",
        },
        {
          text: "Create a client",
          link: "/agents/core-messaging/create-a-client",
        },
        {
          text: "Send messages",
          link: "/agents/core-messaging/send-messages",
        },
        {
          text: "Stream messages",
          link: "/agents/core-messaging/stream",
        },
        {
          text: "Create conversations",
          link: "/agents/core-messaging/create-conversations",
        },
        {
          text: "Manage agent installations",
          link: "/agents/core-messaging/agent-installations",
        },
        {
          text: "Manage group permissions",
          link: "/agents/core-messaging/group-permissions",
        },
        {
          text: "Manage group metadata",
          link: "/agents/core-messaging/group-metadata",
        },
        {
          text: "Observe rate limits",
          link: "/agents/core-messaging/rate-limits",
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
      text: "Debug agents",
      link: "/agents/debug-agents",
      items: [],
    },
    {
      text: "Deploy agents",
      link: "/agents/deploy-agent",
      items: [],
    },
    {
      text: "Security",
      link: "/agents/agent-security",
      items: [],
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
  '/protocol/': [
    {
      text: "Overview",
      link: "/protocol/overview",
    },
    {
      text: "XMTP Improvement Proposals",
      link: "/protocol/xips",
    },
    {
      text: "Security",
      link: "/protocol/security",
    },
    {
      text: "Topics",
      link: "/protocol/topics",
    },
    {
      text: "Envelope types",
      link: "/protocol/envelope-types",
    },
    {
      text: "Epochs",
      link: "/protocol/epochs",
    },
    {
      text: "Intents",
      link: "/protocol/intents",
    },
    {
      text: "Cursors",
      link: "/protocol/cursors",
    },
    {
      text: "Wallet signatures",
      link: "/protocol/signatures",
    },
    {
      text: "Encryption",
      link: "https://xmtp.org/vision/concepts/encryption",
    },
    {
      text: "Identity",
      link: "https://xmtp.org/vision/concepts/identity",
    },
    {
      text: "Consent",
      link: "https://xmtp.org/vision/concepts/consent",
    },
    {
      text: "Decentralization",
      link: "https://xmtp.org/vision/concepts/decentralizing-xmtp",
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
          text: "Create an EOA, SCW, or passkey signer",
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
      text: "List, stream, sync, & back up",
      collapsed: false,
      items: [
        {
          text: "List conversations",
          link: "/chat-apps/list-stream-sync/list",
        },
        {
          text: "Stream messages",
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