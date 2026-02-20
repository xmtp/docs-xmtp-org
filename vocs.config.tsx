import { defineConfig } from 'vocs';
import { sidebarConfig } from './shared-sidebar.config';

// console.log('Loading Vocs config...')

export default defineConfig({
  vite: {
    optimizeDeps: {
      exclude: ['@xmtp/browser-sdk', '@xmtp/wasm-bindings'],
    },
    server: {
      fs: {
        strict: false,
      },
    },
  },
  theme: {
    accentColor: {
      // Primary indigo button colors
      backgroundAccent: { light: '#4F46E5', dark: '#4F46E5' },
      backgroundAccentHover: { light: '#4338CA', dark: '#4338CA' },
      backgroundAccentText: { light: 'white', dark: 'white' },

      // Text accent colors for links and highlights
      textAccent: { light: '#4F46E5', dark: '#A5B4FC' },
      textAccentHover: { light: '#4338CA', dark: '#C7D2FE' },

      // Border accent colors
      borderAccent: { light: '#4F46E5', dark: '#A5B4FC' },
    },
  },
  search: {
    // Boost documents based on their section to help differentiate similar page names
    boostDocument(documentId) {
      // Boost agents section pages slightly
      if (documentId.includes('/agents/')) {
        return 1.2;
      }
      // Boost chat-apps section pages slightly
      if (documentId.includes('/chat-apps/')) {
        return 1.1;
      }
      // Default boost for other sections
      return 1;
    },
    // Filter and process search results to add section context
    filter(result) {
      // Add section info to the result for display purposes
      if (result.id.includes('/agents/')) {
        result.section = 'Build agents';
      } else if (result.id.includes('/chat-apps/')) {
        result.section = 'Build chat apps';
      } else if (result.id.includes('/protocol/')) {
        result.section = 'Protocol';
      } else if (result.id.includes('/network/')) {
        result.section = 'Network';
      } else if (result.id.includes('/fund-agents-apps/')) {
        result.section = 'Fund agents and apps';
      }
      return true; // Include all results
    },
  },
  head: () => {
    // console.log(`Generating head content... ${new Date().toISOString()}`)
    return (
      <>
        {/* Privacy-friendly analytics by Plausible */}
        <script async src="https://plausible.io/js/pa-Ck_8Ax5131WKaGcJv5brM.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
  plausible.init()`,
          }}
        />
        <script src="/popup.js" async />
      </>
    );
  },
  title: 'Build with XMTP',
  description:
    'XMTP is a secure and decentralized protocol for building communication platforms for the next phase of the internet.',
  logoUrl: {
    light: '/logomark-light-purple.png',
    dark: '/logomark-dark-purple.png',
  },
  iconUrl: '/x-mark-blue-lightmode.png',
  topNav: [
    {
      text: 'Build agents',
      link: '/agents/get-started/build-an-agent',
      match: '/agents',
    },
    {
      text: 'Build chat apps',
      link: '/chat-apps/intro/get-started',
      match: '/chat-apps',
    },
    { text: 'Protocol', link: '/protocol/overview' },
    { text: 'Network', link: '/network/run-a-node' },
    {
      text: '🚀 Try docs MCP server',
      link: 'https://github.com/xmtp/xmtp-docs-mcp',
    },
    { text: 'Join XMTP Switchboard Community', link: 'https://switchboard.xmtp.org/' },
  ],
  ogImageUrl: {
    '/': '/xmtp-og-card.jpeg',
    '/docs':
      'https://vocs.dev/api/og?logo=%logo&title=%title&description=%description',
  },
  socials: [
    {
      icon: 'github',
      link: 'https://github.com/xmtp',
    },
  ],
  sidebar: sidebarConfig,
  editLink: {
    pattern: 'https://github.com/xmtp/docs-xmtp-org/edit/main/docs/pages/:path',
    text: 'Edit this page on GitHub',
  },
});
