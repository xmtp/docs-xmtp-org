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
    {
      text: "Dev support",
      link: "https://community.xmtp.org/c/dev-support/76",
    },
    { text: "XMTP.org", link: "https://xmtp.org/" },
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
  sidebar: [
    {
      text: "📋 Documentation status",
      link: "/doc-status",
      items: [],
    },
    {
      text: "🚀 Upgrade to XMTP V3",
      link: "/upgrade-to-v3",
      items: [],
    },
    {
      text: "Intro",
      collapsed: false,
      items: [
        {
          text: "What is XMTP?",
          link: "/intro/intro",
        },
        {
          text: "FAQ",
          link: "/intro/faq",
        },
      ],
    },
    {
      text: "Build chat inboxes",
      collapsed: false,
      items: [
        {
          text: "Get started",
          link: "/inboxes/get-started",
        },
        {
          text: "Build a chat inbox",
          link: "/inboxes/build-inbox",
        },
        {
          text: "Manage inboxes",
          link: "/inboxes/manage-inboxes",
        },
        {
          text: "Enable history sync",
          link: "/inboxes/history-sync",
        },
        {
          text: "Support spam-free inboxes",
          collapsed: true,
          items: [
            {
              text: "How spam-free inboxes work",
              link: "/inboxes/user-consent/user-consent",
            },
            {
              text: "Support spam-free inboxes",
              link: "/inboxes/user-consent/support-user-consent",
            },
          ],
        },
        {
          text: "Support content types",
          collapsed: true,
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
              text: "Onchain transaction references",
              link: "/inboxes/content-types/transaction-refs",
            },
            {
              text: "Custom content",
              link: "/inboxes/content-types/custom",
            },
          ],
        },
        {
          text: "Support push notifications",
          collapsed: true,
          items: [
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
          text: "Manage group permissions",
          link: "/inboxes/group-permissions",
        },
        {
          text: "Manage group metadata",
          link: "/inboxes/group-metadata",
        },
        {
          text: "Use signatures",
          link: "/inboxes/use-signatures",
        },
        {
          text: "Debug your app",
          link: "/inboxes/debug-your-app",
        },
        {
          text: "SDK references",
          link: "/inboxes/references",
        },
      ],
    },
    {
      text: "Agent communication",
      collapsed: false,
      items: [
        {
          text: "Security & interoperability",
          link: "/agents/secure-agents",
        },
        {
          text: "Plugins",
          link: "/agents/plugin",
        },
        {
          text: "Build with MessageKit ↗",
          link: "https://message-kit.org/",
        },
      ],
    },
    {
      text: "Network FAQ",
      link: "/network/network-faq",
    },
    {
      text: "Protocol concepts",
      collapsed: false,
      items: [
        {
          text: "XMTP MLS protocol spec",
          link: "/protocol/specs",
        },
        {
          text: "Wallet signatures",
          link: "/protocol/signatures",
        },
        {
          text: "XIPs",
          link: "/protocol/xips",
        },
      ],
    },
  ],
});
