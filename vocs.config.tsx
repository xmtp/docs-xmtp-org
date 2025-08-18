import { defineConfig } from "vocs";
import { sidebarConfig } from "./shared-sidebar.config";

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
  sidebar: sidebarConfig,
});
