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
        <script
          src="/popup.js"
          async
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
    { text: "XMTP status", link: "https://status.xmtp.org/" },
    { text: "XMTP.chat", link: "https://xmtp.chat/" },
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
      text: "Intro to XMTP",
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
        {
          text: "Build with LLMs",
          link: "/intro/build-with-llms",
        },
        {
          text: "Dev support",
          link: "/intro/dev-support",
        },
        {
          text: "XMTP Improvement Proposals",
          link: "/intro/xips",
        },
      ],
    },
    {
      text: "Quickstart: Build a chat inbox",
      link: "/inboxes/quickstart",
      items: [],
    },
    {
      text: "Quickstart: Build an agent",
      link: "/agents/build-an-agent",
      items: [],
    },
    {
      text: "Build core messaging",
      collapsed: false,
      items: [
          {
            text: "Pick an SDK",
            link: "/inboxes/pick-an-sdk",
          },
          {
            text: "Create an EOA or SCW signer",
            link: "/inboxes/create-a-signer",
          },
          {
            text: "Create a client",
            link: "/inboxes/create-a-client",
          },
          {
            text: "Create conversations",
            link: "/inboxes/create-conversations",
          },
          {
            text: "Send messages",
            link: "/inboxes/send-messages",
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
            text: "Manage inboxes",
            link: "/inboxes/manage-inboxes",
          },
        ]
      },
      {
        text: "List, stream, and sync",
        collapsed: false,
        items: [
            {
              text: "List and stream conversations and messages",
              link: "/inboxes/list-and-stream",
            },
            {
              text: "Sync conversations and messages",
              link: "/inboxes/sync-and-syncall",
            },
            {
              text: "Sync preferences",
              link: "/inboxes/sync-preferences",
            },
            {
              text: "History sync",
              link: "/inboxes/history-sync",
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
          text: "Support user consent",
          collapsed: false,
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
          ]
        },
        {
          text: "Upgrade to a stable XMTP V3 SDK",
          collapsed: false,
          items: [
            {
              text: "From a legacy XMTP V2 SDK",
              link: "/upgrade-from-legacy-V2",
            },
            {
              text: "From a legacy XMTP V3 SDK",
              link: "/upgrade-from-legacy-V3",
            },
          ],
        },    
      {
      text: "Network",
      collapsed: false,
      items: [
        {
          text: "Run a network node",
          link: "/network/run-a-node",
        },
        {
          text: "Testnet nodes",
          link: "/network/network-nodes",
        },
      ],
    },
    {
      text: "Protocol concepts",
      collapsed: false,
      items: [
        {
          text: "Security",
          link: "/protocol/security",
        },
        {
          text: "Encryption ↗",
          link: "https://xmtp.org/encryption",
        },
        {
          text: "Identity ↗",
          link: "https://xmtp.org/identity",
        },
        {
          text: "Consent ↗",
          link: "https://xmtp.org/consent",
        },
        {
          text: "Decentralization ↗",
          link: "https://xmtp.org/decentralizing-xmtp",
        },
        {
          text: "Wallet signatures",
          link: "/protocol/signatures",
        },
      ],
    },
    {
      text: "💬 Doc feedback",
      link: "/doc-feedback",
      items: [],
    },
  ],
});
