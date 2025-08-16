import { defineConfig } from "vocs";

// console.log('Loading Vocs config...')

export default defineConfig({
  head: () => {
    // console.log(`Generating head content... ${new Date().toISOString()}`)
    return (
      <>
        <script
          src="https://plausible.io/js/script.outbound-links.js"
          data-domain="docs.xmtp.org"
          defer
        />
        <script src="/popup.js" async />
        <script src="/mobile-nav.js" defer />
      </>
    );
  },
  title: "Build with XMTP",
  description:
    "XMTP is a secure and decentralized protocol for building communication platforms for the next phase of the internet.",
  logoUrl: {
    light: "/logomark-light-purple.png",
    dark: "/logomark-dark-purple.png",
  },
  iconUrl: "/x-mark-blue.png",
  topNav: [
    { text: "Build agents", link: '/agents/intro/intro', match: '/agents' },
    { text: "Build inboxes", link: '/inboxes/intro/intro', match: '/inboxes' },
    { text: "Protocol", link: '/protocol/envelope-types' },
    { text: "Network", link: '/network/run-a-node' },
  ],
  ogImageUrl: {
    "/": "/xmtp-og-card.jpeg",
    "/docs":
      "https://vocs.dev/api/og?logo=%logo&title=%title&description=%description",
  },
  socials: [
    {
      icon: "github",
      link: "https://github.com/xmtp",
    },
  ],
  sidebar: {
    '/agents/': [
    {
      text: "Intro to XMTP",
      collapsed: false,
      items: [
        {
          text: "What is XMTP?",
          link: "/agents/intro/intro",
        },
        {
          text: "FAQ",
          link: "/agents/intro/faq",
        },
      ],
    },
    {
      text: "Tutorial: Build an agent 🤖",
      link: "/agents/build-an-agent",
      items: [],
    },
    {
      text: "Build core messaging",
      collapsed: false,
      items: [
        {
          text: "Create an EOA or SCW signer",
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
          link: "/agents/list-stream-sync/stream",
        },
        {
          text: "Create conversations",
          link: "/agents/core-messaging/create-conversations",
        },
        {
          text: "Manage group permissions",
          link: "/agents/core-messaging/group-permissions",
        },
        {
          text: "Manage group metadata",
          link: "/agents/core-messaging/group-metadata",
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
        {
          text: "Read receipts",
          link: "/agents/content-types/read-receipts",
        },
      ],
    },
    {
      text: "Manage agent installations",
      link: "/agents/agent-installations",
      items: [],
    },
    {
      text: "Test agents",
      link: "/agents/test-agents",
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
          text: "Envelope types",
          link: "/protocol/envelope-types",
        },
        {
          text: "Topics",
          link: "/protocol/topics",
        },
        {
          text: "Cursors",
          link: "/protocol/cursors",
        },
        {
          text: "Security",
          link: "/protocol/security",
        },
        {
          text: "Encryption ↗",
          link: "https://xmtp.org/docs/concepts/encryption",
        },
        {
          text: "Identity ↗",
          link: "https://xmtp.org/docs/concepts/identity",
        },
        {
          text: "Consent ↗",
          link: "https://xmtp.org/docs/concepts/consent",
        },
        {
          text: "Decentralization ↗",
          link: "https://xmtp.org/docs/concepts/decentralizing-xmtp",
        },
        {
          text: "Wallet signatures",
          link: "/protocol/signatures",
        },
        {
          text: "XMTP Improvement Proposals",
          link: "/intro/xips",
        },
      ],
  '/inboxes/': [
    {
      text: "Intro to XMTP",
      collapsed: false,
      items: [
        {
          text: "What is XMTP?",
          link: "/inboxes/intro/intro",
        },
        {
          text: "Upcoming releases ↗",
          link: "https://ephemerahq.notion.site/upcoming-xmtp-releases",
        },
        {
          text: "FAQ",
          link: "/inboxes/intro/faq",
        },
        {
          text: "Build with LLMs",
          link: "/inboxes/intro/build-with-llms",
        },
        {
          text: "Dev support",
          link: "/inboxes/intro/dev-support",
        },
      ],
    },
    {
      text: "Get started",
      collapsed: false,
      items: [
        {
          text: "Browser SDK",
          link: "/inboxes/sdks/browser",
        },
        {
          text: "Node SDK",
          link: "/inboxes/sdks/node",
        },
        {
          text: "React Native SDK",
          link: "/inboxes/sdks/react-native",
        },
        {
          text: "Android SDK",
          link: "/inboxes/sdks/android",
        },
        {
          text: "iOS SDK",
          link: "/inboxes/sdks/ios",
        },
      ],
    },
    {
      text: "Build core messaging",
      collapsed: false,
      items: [
        {
          text: "Create an EOA or SCW signer",
          link: "/inboxes/core-messaging/create-a-signer",
        },
        {
          text: "Create a client",
          link: "/inboxes/core-messaging/create-a-client",
        },
        {
          text: "Create conversations",
          link: "/inboxes/core-messaging/create-conversations",
        },
        {
          text: "Send messages",
          link: "/inboxes/core-messaging/send-messages",
        },
        {
          text: "Manage group permissions",
          link: "/inboxes/core-messaging/group-permissions",
        },
        {
          text: "Manage group metadata",
          link: "/inboxes/core-messaging/group-metadata",
        },
        {
          text: "Support group invite links",
          link: "/inboxes/core-messaging/support-group-invite-links",
        },
        {
          text: "Manage inboxes, IDs, and installations",
          link: "/inboxes/core-messaging/manage-inboxes",
        },
        {
          text: "Observe rate limits",
          link: "/inboxes/core-messaging/rate-limits",
        },
      ],
    },
    {
      text: "List, stream, and sync",
      collapsed: false,
      items: [
        {
          text: "List conversations",
          link: "/inboxes/list-stream-sync/list",
        },
        {
          text: "Stream messages",
          link: "/inboxes/list-stream-sync/stream",
        },
        {
          text: "Sync conversations and messages",
          link: "/inboxes/list-stream-sync/sync-and-syncall",
        },
        {
          text: "Sync preferences",
          link: "/inboxes/list-stream-sync/sync-preferences",
        },
        {
          text: "History sync",
          link: "/inboxes/list-stream-sync/history-sync",
        },
      ],
    },
    {
      text: "Support rich content types",
      collapsed: false,
      items: [
        {
          text: "Understand content types",
          link: "/inboxes/content-types/content-types",
        },
        {
          text: "Attachments",
          link: "/inboxes/content-types/attachments",
        },
        {
          text: "Onchain transactions",
          link: "/inboxes/content-types/transactions",
        },
        {
          text: "Onchain transaction references",
          link: "/inboxes/content-types/transaction-refs",
        },
        {
          text: "Reactions",
          link: "/inboxes/content-types/reactions",
        },
        {
          text: "Replies",
          link: "/inboxes/content-types/replies",
        },
        {
          text: "Read receipts",
          link: "/inboxes/content-types/read-receipts",
        },
        {
          text: "Custom content",
          link: "/inboxes/content-types/custom",
        },
        {
          text: "Fallback text for compatibility",
          link: "/inboxes/content-types/fallback",
        },
      ],
    },
    {
      text: "Support spam-free inboxes",
      collapsed: false,
      items: [
        {
          text: "Understand user consent",
          link: "/inboxes/user-consent/user-consent",
        },
        {
          text: "Support user consent",
          link: "/inboxes/user-consent/support-user-consent",
        },
      ],
    },
    {
      text: "Support push notifications",
      collapsed: false,
      items: [
        {
          text: "Understand push notifications",
          link: "/inboxes/push-notifs/understand-push-notifs",
        },
        {
          text: "Support push notifications",
          link: "/inboxes/push-notifs/push-notifs",
        },
        {
          text: "Run a push notifications server",
          link: "/inboxes/push-notifs/pn-server",
        },
        {
          text: "Try Android push notifications",
          link: "/inboxes/push-notifs/android-pn",
        },
        {
          text: "Try iOS push notifications",
          link: "/inboxes/push-notifs/ios-pn",
        },
      ],
    },
    {
      text: "Debug your app",
      link: "/inboxes/debug-your-app",
      items: [],
    },
    {
      text: "Sign and verify payloads",
      link: "/inboxes/use-signatures",
      items: [],
    },
  ],
  },
});
