import React, { useState, useEffect } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AutoBreadcrumbProps {
  path?: BreadcrumbItem[];
}

// Mirror the sidebar structure from vocs.config.tsx
const sidebarConfig = {
  '/agents/': [
    {
      text: "Intro to XMTP",
      collapsed: false,
      items: [
        { text: "What is XMTP?", link: "/agents/intro/intro" },
        { text: "FAQ", link: "/agents/intro/faq" },
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
        { text: "Create an EOA or SCW signer", link: "/agents/core-messaging/create-a-signer" },
        { text: "Create a client", link: "/agents/core-messaging/create-a-client" },
        { text: "Send messages", link: "/agents/core-messaging/send-messages" },
        { text: "Stream messages", link: "/agents/core-messaging/stream" },
        { text: "Create conversations", link: "/agents/core-messaging/create-conversations" },
        { text: "Manage group permissions", link: "/agents/core-messaging/group-permissions" },
        { text: "Manage group metadata", link: "/agents/core-messaging/group-metadata" },
        { text: "Manage inboxes", link: "/agents/core-messaging/manage-inboxes" },
        { text: "Rate limits", link: "/agents/core-messaging/rate-limits" },
      ],
    },
    {
      text: "Support rich content types",
      collapsed: false,
      items: [
        { text: "Understand content types", link: "/agents/content-types/content-types" },
        { text: "Attachments", link: "/agents/content-types/attachments" },
        { text: "Onchain transactions", link: "/agents/content-types/transactions" },
        { text: "Onchain transaction references", link: "/agents/content-types/transaction-refs" },
        { text: "Reactions", link: "/agents/content-types/reactions" },
        { text: "Replies", link: "/agents/content-types/replies" },
        { text: "Read receipts", link: "/agents/content-types/read-receipts" },
      ],
    },
  ],
  '/network/': [
    { text: "Run a network node", link: "/network/run-a-node" },
    { text: "Testnet nodes", link: "/network/network-nodes" },
  ],
  '/protocol/': [
    { text: "Envelope types", link: "/protocol/envelope-types" },
    { text: "Topics", link: "/protocol/topics" },
    { text: "Cursors", link: "/protocol/cursors" },
    { text: "Security", link: "/protocol/security" },
    { text: "Wallet signatures", link: "/protocol/signatures" },
    { text: "XMTP Improvement Proposals", link: "/intro/xips" },
  ],
  '/inboxes/': [
    {
      text: "Intro to XMTP",
      collapsed: false,
      items: [
        { text: "What is XMTP?", link: "/inboxes/intro/intro" },
        { text: "FAQ", link: "/inboxes/intro/faq" },
        { text: "Build with LLMs", link: "/inboxes/intro/build-with-llms" },
        { text: "Dev support", link: "/inboxes/intro/dev-support" },
      ],
    },
    {
      text: "Get started",
      collapsed: false,
      items: [
        { text: "Browser SDK", link: "/inboxes/sdks/browser" },
        { text: "Node SDK", link: "/inboxes/sdks/node" },
        { text: "React Native SDK", link: "/inboxes/sdks/react-native" },
        { text: "Android SDK", link: "/inboxes/sdks/android" },
        { text: "iOS SDK", link: "/inboxes/sdks/ios" },
      ],
    },
    {
      text: "Build core messaging",
      collapsed: false,
      items: [
        { text: "Create an EOA or SCW signer", link: "/inboxes/core-messaging/create-a-signer" },
        { text: "Create a client", link: "/inboxes/core-messaging/create-a-client" },
        { text: "Create conversations", link: "/inboxes/core-messaging/create-conversations" },
        { text: "Send messages", link: "/inboxes/core-messaging/send-messages" },
        { text: "Manage group permissions", link: "/inboxes/core-messaging/group-permissions" },
        { text: "Manage group metadata", link: "/inboxes/core-messaging/group-metadata" },
        { text: "Support group invite links", link: "/inboxes/core-messaging/support-group-invite-links" },
        { text: "Manage inboxes, IDs, and installations", link: "/inboxes/core-messaging/manage-inboxes" },
        { text: "Observe rate limits", link: "/inboxes/core-messaging/rate-limits" },
      ],
    },
    {
      text: "List, stream, and sync",
      collapsed: false,
      items: [
        { text: "List conversations", link: "/inboxes/list-stream-sync/list" },
        { text: "Stream messages", link: "/inboxes/list-stream-sync/stream" },
        { text: "Sync conversations and messages", link: "/inboxes/list-stream-sync/sync-and-syncall" },
        { text: "Sync preferences", link: "/inboxes/list-stream-sync/sync-preferences" },
        { text: "History sync", link: "/inboxes/list-stream-sync/history-sync" },
      ],
    },
    {
      text: "Support rich content types",
      collapsed: false,
      items: [
        { text: "Understand content types", link: "/inboxes/content-types/content-types" },
        { text: "Attachments", link: "/inboxes/content-types/attachments" },
        { text: "Onchain transactions", link: "/inboxes/content-types/transactions" },
        { text: "Onchain transaction references", link: "/inboxes/content-types/transaction-refs" },
        { text: "Reactions", link: "/inboxes/content-types/reactions" },
        { text: "Replies", link: "/inboxes/content-types/replies" },
        { text: "Read receipts", link: "/inboxes/content-types/read-receipts" },
        { text: "Custom content", link: "/inboxes/content-types/custom" },
        { text: "Fallback text for compatibility", link: "/inboxes/content-types/fallback" },
      ],
    },
    {
      text: "Support spam-free inboxes",
      collapsed: false,
      items: [
        { text: "Understand user consent", link: "/inboxes/user-consent/user-consent" },
        { text: "Support user consent", link: "/inboxes/user-consent/support-user-consent" },
      ],
    },
    {
      text: "Support push notifications",
      collapsed: false,
      items: [
        { text: "Understand push notifications", link: "/inboxes/push-notifs/understand-push-notifs" },
        { text: "Support push notifications", link: "/inboxes/push-notifs/push-notifs" },
        { text: "Run a push notifications server", link: "/inboxes/push-notifs/pn-server" },
        { text: "Try Android push notifications", link: "/inboxes/push-notifs/android-pn" },
        { text: "Try iOS push notifications", link: "/inboxes/push-notifs/ios-pn" },
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
};

export default function AutoBreadcrumb({ path }: AutoBreadcrumbProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => { 
    setIsMounted(true); 
  }, []);
  
  // Prevent hydration mismatches by not rendering until mounted
  if (!isMounted) return null;
  
  // Get current path from browser if available (for client-side)
  const getCurrentPath = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '';
  };

  const currentPath = getCurrentPath();
  
  // If custom path is provided, use it
  if (path && path.length > 0) {
    return (
      <nav aria-label="Breadcrumb" className="breadcrumb-nav">
        <ol className="breadcrumb-list">
          {path.map((item, index) => (
            <li key={index} className="breadcrumb-item">
              <a href={item.href} className="breadcrumb-link">
                {item.label}
              </a>
              {index < path.length - 1 && (
                <span className="breadcrumb-separator" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // Auto-generate breadcrumb based on sidebar structure
  const generateBreadcrumb = (path: string) => {
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Determine section
    let sectionKey = '';
    let sectionName = '';
    let sectionHref = '';
    
    if (path.startsWith('/agents')) {
      sectionKey = '/agents/';
      sectionName = 'Build agents';
      sectionHref = '/agents/intro/intro';
    } else if (path.startsWith('/inboxes')) {
      sectionKey = '/inboxes/';
      sectionName = 'Build inboxes';
      sectionHref = '/inboxes/intro/intro';
    } else if (path.startsWith('/protocol')) {
      sectionKey = '/protocol/';
      sectionName = 'Protocol';
      sectionHref = '/protocol/envelope-types';
    } else if (path.startsWith('/network')) {
      sectionKey = '/network/';
      sectionName = 'Network';
      sectionHref = '/network/run-a-node';
    }
    
    if (!sectionKey) return [];
    
    // Always add the main section
    breadcrumbs.push({
      label: sectionName,
      href: sectionHref
    });
    
    // Find if this page is nested in a subsection
    const sidebarSection = sidebarConfig[sectionKey as keyof typeof sidebarConfig];
    if (sidebarSection) {
      for (const section of sidebarSection) {
        // Handle flat structure (like Protocol and Network sections)
        if (typeof section === 'object' && 'link' in section && !('items' in section)) {
          // This is a direct page item (flat structure)
          if (section.link === path) {
            // This is a top-level page, just return the section breadcrumb
            return breadcrumbs;
          }
        }
        // Handle nested structure (like Agents and Inboxes sections)
        else if (typeof section === 'object' && 'items' in section) {
          // Check if this is a direct page (like build-an-agent)
          if ('link' in section && section.link === path) {
            // This is a top-level page, just return the section breadcrumb
            return breadcrumbs;
          }
          
          // Check if this page is in a subsection
          if (section.items && section.items.length > 0) {
            for (const item of section.items) {
              if (item.link === path) {
                // Found the page in this subsection
                breadcrumbs.push({
                  label: section.text.replace(' 🤖', ''), // Remove emojis
                  href: undefined // Don't make subsection clickable for now
                });
                return breadcrumbs;
              }
            }
          }
        }
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumb(currentPath);
  
  if (breadcrumbs.length === 0) {
    return null; // No breadcrumb for homepage or unknown sections
  }

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb-nav">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {item.href ? (
              <a href={item.href} className="breadcrumb-link">
                {item.label}
              </a>
            ) : (
              <span className="breadcrumb-current">
                {item.label}
              </span>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className="breadcrumb-separator" aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
