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
  title: "Build with XMTP",
  description:
    "XMTP is an open, secure, and resilient messaging protocol—for the next phase of the internet",
  logoUrl: {
    light: "/logomark-light-purple.png",
    dark: "/logomark-dark-purple.png",
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
      text: "⚡️Documentation preview⚡️",
      link: "", // Add this line,
      items: [ ]
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
      ],
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
          text: "XIPs",
          link: "/protocol/xips",
        },
      ],
    },
  ],
});
