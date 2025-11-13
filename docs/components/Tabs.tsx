import * as React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';

type TabsRootProps = {
  defaultValue: string;
  children: React.ReactNode;
};

type TabsListProps = {
  children: React.ReactNode;
};

type TabsTriggerProps = {
  value: string;
  children: React.ReactNode;
};

type TabsContentProps = {
  value: string;
  children: React.ReactNode;
};

const Root = ({ defaultValue, children }: TabsRootProps) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const lastProcessedHash = React.useRef<string>('');

  React.useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    const switchToTabContainingHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash || hash === lastProcessedHash.current) return;

      const timeoutId = setTimeout(() => {
        const heading = document.getElementById(hash);
        if (!heading) return;

        const tabContent = heading.closest('[data-value]');
        if (tabContent && rootRef.current?.contains(tabContent)) {
          const tabValue = tabContent.getAttribute('data-value');
          if (tabValue) {
            setActiveTab(tabValue);
            lastProcessedHash.current = hash;
            const scrollTimeoutId = setTimeout(() => {
              heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            timeouts.push(scrollTimeoutId);
          }
        }
      }, 100);
      timeouts.push(timeoutId);
    };

    switchToTabContainingHash();
    window.addEventListener('hashchange', switchToTabContainingHash);

    const interval = setInterval(() => {
      switchToTabContainingHash();
    }, 500);

    return () => {
      window.removeEventListener('hashchange', switchToTabContainingHash);
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      <style>{`
        .tabs-root {
          display: flex;
          flex-direction: column;
          margin: 1.5rem 0;
        }

        .tabs-list {
          display: flex;
          border-bottom: 1px solid var(--vocs-color_border);
          gap: 0;
        }

        .tabs-trigger {
          all: unset;
          font-family: inherit;
          background-color: transparent;
          padding: 0.75rem 1.5rem;
          height: 45px;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9375rem;
          line-height: 1;
          color: var(--vocs-color_text3);
          user-select: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .tabs-trigger:hover {
          color: var(--vocs-color_text);
          background-color: var(--vocs-color_background2);
        }

        .tabs-trigger[data-state="active"] {
          color: var(--vocs-color_text);
          border-bottom-color: var(--vocs-color_link);
          font-weight: 500;
        }

        .tabs-trigger:focus-visible {
          outline: 2px solid var(--vocs-color_link);
          outline-offset: 2px;
        }

        .tabs-content {
          padding: 1.5rem 0;
          outline: none;
        }

        .tabs-content[data-state="inactive"] {
          display: block !important;
          position: absolute;
          opacity: 0;
          pointer-events: none;
          height: 0;
          overflow: hidden;
          visibility: hidden;
        }

        .tabs-content:focus {
          outline: none;
        }

        .tabs-content > *:not(:last-child) {
          margin-bottom: var(--vocs-space_24);
        }

        .tabs-content > *:last-child {
          margin-bottom: 0;
        }
      `}</style>
      <RadixTabs.Root
        value={activeTab}
        onValueChange={setActiveTab}
        className="tabs-root"
        ref={rootRef}
      >
        {children}
      </RadixTabs.Root>
    </>
  );
};

const List = ({ children }: TabsListProps) => (
  <RadixTabs.List className="tabs-list">{children}</RadixTabs.List>
);

const Trigger = ({ value, children }: TabsTriggerProps) => (
  <RadixTabs.Trigger value={value} className="tabs-trigger">
    {children}
  </RadixTabs.Trigger>
);

const Content = ({ value, children }: TabsContentProps) => (
  <RadixTabs.Content
    value={value}
    className="tabs-content"
    forceMount
    data-value={value}
  >
    {children}
  </RadixTabs.Content>
);

export const Tabs = { Root, List, Trigger, Content };
