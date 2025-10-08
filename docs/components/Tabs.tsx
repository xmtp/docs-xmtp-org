import React from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import "./Tabs.css";

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

const Root: React.FC<TabsProps> = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const switchToTabContainingHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;

      setTimeout(() => {
        const allHeadings = document.querySelectorAll(`[id="${hash}"]`);

        allHeadings.forEach((heading) => {
          const tabContent = heading.closest('[data-value]');
          if (tabContent && rootRef.current?.contains(tabContent)) {
            const tabValue = tabContent.getAttribute('data-value');
            if (tabValue && tabValue !== activeTab) {
              setActiveTab(tabValue);
              setTimeout(() => {
                heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }
          }
        });
      }, 100);
    };

    // Check on mount
    switchToTabContainingHash();

    // Listen for hash changes
    window.addEventListener('hashchange', switchToTabContainingHash);

    // Poll for hash changes (fallback for cases where hashchange doesn't fire)
    const interval = setInterval(() => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const heading = document.getElementById(hash);
        if (heading) {
          const tabContent = heading.closest('[data-value]');
          if (tabContent) {
            const tabValue = tabContent.getAttribute('data-value');
            if (tabValue && tabValue !== activeTab) {
              setActiveTab(tabValue);
            }
          }
        }
      }
    }, 500);

    return () => {
      window.removeEventListener('hashchange', switchToTabContainingHash);
      clearInterval(interval);
    };
  }, [activeTab]);

  return (
    <RadixTabs.Root value={activeTab} onValueChange={setActiveTab} className="tabs-root" ref={rootRef as any}>
      {children}
    </RadixTabs.Root>
  );
};

const List: React.FC<TabsListProps> = ({ children }) => (
  <RadixTabs.List className="tabs-list">{children}</RadixTabs.List>
);

const Trigger: React.FC<TabsTriggerProps> = ({ value, children }) => (
  <RadixTabs.Trigger value={value} className="tabs-trigger">
    {children}
  </RadixTabs.Trigger>
);

const Content: React.FC<TabsContentProps> = ({ value, children }) => (
  <RadixTabs.Content value={value} className="tabs-content" forceMount data-value={value}>
    {children}
  </RadixTabs.Content>
);

export const Tabs = {
  Root,
  List,
  Trigger,
  Content,
};
