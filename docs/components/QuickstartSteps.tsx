import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as RadixTabs from '@radix-ui/react-tabs';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StepName = 'identity' | 'connect' | 'send' | 'stream';
type TabVariant = 'cli' | 'browser';

type Identity = {
  privateKey: Uint8Array;
  address: string;
  privateKeyHex: string;
};

// ---------------------------------------------------------------------------
// Code generators — return interpolated code strings with real key bytes
// ---------------------------------------------------------------------------

const BROWSER_CODE = {

  identity: (identity: Identity) => {
    const bytes = Array.from(identity.privateKey).join(', ');
    return `import { Client, IdentifierKind } from "@xmtp/browser-sdk";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { keccak_256 } from "@noble/hashes/sha3.js";

// Private key and address from the docs page widget (ephemeral — dev only)
const privateKey = new Uint8Array([${bytes}]);
const address = "${identity.address}";

// Create an XMTP-compatible signer
const signer = {
  type: "EOA",
  getIdentifier: () => ({
    identifier: address.toLowerCase(),
    identifierKind: IdentifierKind.Ethereum,
  }),
  signMessage: async (message) => {
    const prefix = "\\x19Ethereum Signed Message:\\n" + message.length;
    const hash = keccak_256(new TextEncoder().encode(prefix + message));
    const sig = secp256k1.sign(hash, privateKey, { prehash: false, format: "recovered" });
    return new Uint8Array([...sig.slice(1), sig[0] + 27]);
  },
};

async function main() {
  // Step 3 goes here
  // Step 4 goes here
  // Step 5 goes here
}

main().catch((e) => {
  document.getElementById("messages").innerText = "Error: " + e.message;
});`;
  },

  connect: () =>
    `const client = await Client.create(signer, {
  env: "dev",
  dbPath: null,
});
document.getElementById("messages").innerText = "Connected! Inbox ID: " + client.inboxId;`,

  send: () =>
    `const dm = await client.conversations.createDmWithIdentifier({
  identifier: address,
  identifierKind: IdentifierKind.Ethereum,
});

document.getElementById("send")?.addEventListener("click", async () => {
  const input = document.getElementById("message");
  if (!input.value) return;
  await dm.sendText(input.value);
  input.value = "";
});`,

  stream: () =>
    `const stream = await dm.stream();
for await (const message of stream) {
  if (message?.content) {
    const el = document.createElement("p");
    el.textContent = \`\${message.senderInboxId === client.inboxId ? "You" : "Them"}: \${message.content}\`;
    document.getElementById("messages")?.appendChild(el);
  }
}`,
};

const CLI_CODE = {

  identity: (identity: Identity) => BROWSER_CODE.identity(identity),
  connect: () => BROWSER_CODE.connect(),
  send: () => BROWSER_CODE.send(),
  stream: () => BROWSER_CODE.stream(),
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type QuickstartContextType = {
  mounted: boolean;
  activeTab: TabVariant;
  setActiveTab: (tab: TabVariant) => void;
  identity: Identity | null;
};

const QuickstartContext = React.createContext<QuickstartContextType | null>(
  null,
);

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const STYLES = `
  .qs-step {
    border: 1px solid var(--vocs-color_border);
    border-radius: var(--vocs-borderRadius_4);
    overflow: hidden;
    margin: 1rem 0;
  }

  .qs-header {
    display: flex;
    align-items: center;
    background-color: var(--vocs-color_background2);
    border-bottom: 1px solid var(--vocs-color_border);
  }

  .qs-tab-list {
    display: flex;
    flex: 1;
  }

  .qs-tab-trigger {
    all: unset;
    font-family: inherit;
    font-size: var(--vocs-fontSize_14);
    font-weight: 400;
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: var(--vocs-color_text3);
    border-bottom: 2px solid transparent;
    transition: color 0.15s, border-color 0.15s;
    user-select: none;
  }

  .qs-tab-trigger:hover {
    color: var(--vocs-color_text);
  }

  .qs-tab-trigger[data-state="active"] {
    color: var(--vocs-color_text);
    font-weight: 500;
    border-bottom-color: var(--vocs-color_link);
  }

  .qs-copy-btn {
    all: unset;
    cursor: pointer;
    color: var(--vocs-color_text3);
    padding: 0.375rem;
    margin-right: 0.5rem;
    border-radius: var(--vocs-borderRadius_4);
    display: flex;
    align-items: center;
    transition: color 0.15s;
  }

  .qs-copy-btn:hover {
    color: var(--vocs-color_text);
  }

  .qs-code {
    overflow-x: auto;
  }

  .qs-code pre {
    margin: 0 !important;
    padding: 1rem !important;
    font-family: var(--vocs-fontFamily_mono) !important;
    font-size: var(--vocs-fontSize_13) !important;
    line-height: 1.7 !important;
    white-space: pre !important;
    overflow-x: auto !important;
  }

  .qs-code pre code {
    font-size: inherit !important;
    line-height: inherit !important;
  }

  .qs-code .shiki {
    background-color: var(--vocs-color_background3) !important;
  }

  .shiki span {
    color: var(--shiki-light);
  }

  html.dark .shiki span {
    color: var(--shiki-dark);
  }
`;

// ---------------------------------------------------------------------------
// Provider — generates identity on mount, shares via context
// ---------------------------------------------------------------------------

export const QuickstartProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mounted, setMounted] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabVariant>('browser');
  const [identity, setIdentity] = React.useState<Identity | null>(null);
  const [portalTarget, setPortalTarget] = React.useState<HTMLElement | null>(
    null,
  );

  React.useEffect(() => {
    setMounted(true);

    // Generate identity
    (async () => {
      const { secp256k1 } = await import('@noble/curves/secp256k1');
      const { keccak_256 } = await import('@noble/hashes/sha3');
      const privateKey = crypto.getRandomValues(new Uint8Array(32));
      const publicKey = secp256k1.getPublicKey(privateKey, false);
      const addressBytes = keccak_256(publicKey.slice(1)).slice(-20);
      const address =
        '0x' +
        Array.from(addressBytes, (b: number) =>
          b.toString(16).padStart(2, '0'),
        ).join('');
      const privateKeyHex =
        '0x' +
        Array.from(privateKey, (b: number) =>
          b.toString(16).padStart(2, '0'),
        ).join('');
      setIdentity({ privateKey, address, privateKeyHex });
    })();

    // Keep portal target in sync — vocs may re-render the outline sidebar,
    // replacing the DOM node. Poll briefly then observe for changes.
    const findTarget = () => document.getElementById('qs-inbox-mount');

    const syncTarget = () => {
      const el = findTarget();
      setPortalTarget((prev) => (el && el !== prev ? el : prev ?? el));
    };

    syncTarget();

    // Poll a few times in case the sidebar renders after us
    const timers = [100, 500, 1500].map((ms) => setTimeout(syncTarget, ms));

    // Watch for the mount point being replaced
    const observer = new MutationObserver(syncTarget);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      timers.forEach(clearTimeout);
      observer.disconnect();
    };
  }, []);

  return (
    <QuickstartContext.Provider
      value={{ mounted, activeTab, setActiveTab, identity }}
    >
      <style>{STYLES}</style>
      {children}
      {mounted && identity && portalTarget && (
        <InboxPortal target={portalTarget} identity={identity} />
      )}
    </QuickstartContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// Portal wrapper — lazy-loads QuickstartInbox into the sidebar mount point
// ---------------------------------------------------------------------------

const InboxPortal = ({
  target,
  identity,
}: {
  target: HTMLElement;
  identity: Identity;
}) => {
  const [InboxComponent, setInboxComponent] =
    React.useState<React.ComponentType<{ identity: Identity }> | null>(null);

  React.useEffect(() => {
    import('./QuickstartInbox').then((mod) => {
      setInboxComponent(() => mod.QuickstartInbox);
    });
  }, []);

  if (!InboxComponent) return null;

  return ReactDOM.createPortal(
    <InboxComponent identity={identity} />,
    target,
  );
};

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ---------------------------------------------------------------------------
// Step widget — tabbed code block + copy (no run button)
// ---------------------------------------------------------------------------

export const QuickstartStep = ({ step }: { step: StepName }) => {
  const ctx = React.useContext(QuickstartContext);
  const [mainHtml, setMainHtml] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const code = React.useMemo(() => {
    if (!ctx?.identity) return '';
    const gen =
      ctx.activeTab === 'cli' ? CLI_CODE[step] : BROWSER_CODE[step];
    return (gen as (id: Identity) => string)(ctx.identity);
  }, [step, ctx?.identity, ctx?.activeTab]);

  // Highlight with Shiki
  React.useEffect(() => {
    if (!ctx?.mounted || !code) return;
    import('shiki').then(({ codeToHtml }) => {
      const lang = 'javascript';
      codeToHtml(code, {
        lang,
        themes: { light: 'github-light', dark: 'github-dark' },
      }).then(setMainHtml);
    });
  }, [ctx?.mounted, code, step]);

  if (!ctx?.mounted) return null;

  const { activeTab, setActiveTab } = ctx;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="qs-step">
      <RadixTabs.Root
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabVariant)}
      >
        <div className="qs-header">
          <RadixTabs.List className="qs-tab-list">
            <RadixTabs.Trigger
              value="browser"
              className="qs-tab-trigger"
            >
              Browser
            </RadixTabs.Trigger>
            <RadixTabs.Trigger
              value="cli"
              className="qs-tab-trigger"
            >
              CLI
            </RadixTabs.Trigger>
          </RadixTabs.List>
          <button
            className="qs-copy-btn"
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>
      </RadixTabs.Root>
      <div className="qs-code">
        {mainHtml ? (
          <div dangerouslySetInnerHTML={{ __html: mainHtml }} />
        ) : (
          <pre
            style={{
              margin: 0,
              padding: '1rem',
              fontFamily: 'var(--vocs-fontFamily_mono)',
              fontSize: 'var(--vocs-fontSize_13)',
              lineHeight: 1.7,
              backgroundColor: 'var(--vocs-color_background3)',
              color: 'var(--vocs-color_text)',
              whiteSpace: 'pre',
            }}
          >
            {code}
          </pre>
        )}
      </div>
    </div>
  );
};
