import { defineConfig } from "vocs";

// console.log('Loading Vocs config...')

export default defineConfig({
  head: () => {
    // console.log(`Generating head content... ${new Date().toISOString()}`)
    return (
      <>
        <script
          src="https://plausible.io/js/script.js"
          data-domain="docs.xmtp.org"
          defer
        />
      </>
    );
  },
  title: "XMTP Documentation",
  description:
    "Documentation for XMTP, the open and secure messaging protocol for web3",
  editLink: {
    pattern: "https://github.com/xmtp/docs-xmtp-org/edit/main/docs/pages/:path",
    text: "Suggest changes to this page",
  },
  logoUrl: {
    light: "/logomark-dark-purple.png",
    dark: "/logomark-light-purple.png",
  },
  iconUrl: "/x-mark-blue.png",
  topNav: [
    {
      text: "Support 💬",
      link: "https://converse.xyz/group-invite/a0XKzl9oVpWNXcuYDZLMf",
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
      text: "Overview",
      collapsed: true,
      items: [
        {
          text: "Intro to XMTP",
          link: "/get-started/intro",
        },
        {
          text: "FAQ",
          link: "/get-started/faq",
        },
      ],
    },
    {
      text: "Build chat bots with MessageKit ↗",
      link: "https://messagekit.ephemerahq.com/",
      items: [], // Add this line
    },
    {
      text: "Embed a chat widget",
      link: "/chat-widget/chat-widget",
      items: [], // Add this line
    },
    {
      text: "Broadcast notifications",
      collapsed: true,
      items: [
        {
          text: "Use case",
          link: "/consent/build-engagement",
        },
        {
          text: "Enable subscriptions",
          link: "/consent/subscribe",
        },
        {
          text: "Broadcast notifications",
          link: "/consent/broadcast",
        },
        {
          text: "Quickstart repos",
          link: "#TODO",
        },
      ],
    },
    {
      "text": "Build inboxes",
      "collapsed": true,
      "items": [
        {
          "text": "Create or build client",
          "link": "/inboxes/create-client"
        },
        {
          "text": "Build the inbox",
          "link": "/inboxes/build-inbox"
        },
        {
          "text": "Support spam-free inboxes",
          "link": "/inboxes/support-consent"
        },
        {
          "text": "Support push notifications",
          "link": "/inboxes/push-notifications"
        },
        {
          "text": "Support content types",
          "link": "/inboxes/content-types",
        },
      ],
    },
    {
      text: "Learn protocol concepts",
      collapsed: true,
      items: [
        {
          text: "Protocol spec ↗",
          link: "https://github.com/xmtp/libxmtp/blob/main/xmtp_mls/README.md",
        },
        {
          text: "Account signatures",
          link: "/protocol/signatures",
        },
        {
          text: "Security and encryption",
          link: "/protocol/security-encryption",
        },
        {
          text: "Multi-wallet identity",
          link: "/protocol/v3/identity",
        },
        {
          text: "Message history",
          link: "/protocol/v3/message-history",
        },
        {
          text: "Smart wallet support",
          link: "/protocol/v3/smart-wallet",
        },
        {
          text: "XIPs",
          link: "/protocol/xips",
        },
      ],
    },
  ],
});
