import * as React from 'react';
import * as ReactDOM from 'react-dom';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StepName = 'identity' | 'connect' | 'send' | 'stream';

const STEP_ANALYTICS: Record<StepName, string> = {
  identity: '2-starter-code',
  connect: '3-connect',
  send: '4-send',
  stream: '5-stream',
};

type Identity = {
  privateKey: Uint8Array;
  address: string;
  privateKeyHex: string;
};

// ---------------------------------------------------------------------------
// Static code snippets
// ---------------------------------------------------------------------------

export const STATIC_CODE = {
  viteConfig: `import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    exclude: ["@xmtp/browser-sdk", "@xmtp/wasm-bindings"],
  },
});`,

  indexHtml: `<h1>&nbsp;&nbsp;&nbsp;XMTP Quickstart</h1>
<div class="card">
  <input id="message" type="text" placeholder="Type a message..." />
  <button id="send">Send</button>
</div>
<div id="messages"></div>`,
};

// ---------------------------------------------------------------------------
// Code generators — return interpolated code strings with real key bytes
// ---------------------------------------------------------------------------

const BROWSER_CODE = {

  identity: (appIdentity: Identity, inboxIdentity: Identity) => {
    const hex = appIdentity.privateKeyHex.replace(/^0x/, '');
    return `import "./style.css";
import { Client, IdentifierKind } from "@xmtp/browser-sdk";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { keccak_256 } from "@noble/hashes/sha3.js";

// Your app's private key and address (ephemeral — dev only)
const privateKey = Uint8Array.fromHex("${hex}");
const address = "${appIdentity.address}";

// The XMTP Live Inbox address (the other side of the conversation)
const otherAddress = "${inboxIdentity.address}";

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
  identifier: otherAddress,
  identifierKind: IdentifierKind.Ethereum,
});

const sendMessage = async () => {
  const input = document.getElementById("message");
  if (!input.value) return;
  await dm.sendText(input.value);
  input.value = "";
};

document.getElementById("send")?.addEventListener("click", sendMessage);
document.getElementById("message")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});`,

  stream: () =>
    `const stream = await dm.stream();
for await (const message of stream) {
  if (message?.content) {
    const el = document.createElement("p");
    el.textContent = \`\${message.senderInboxId === client.inboxId ? "Quickstart App" : "Live Inbox"}: \${message.content}\`;
    document.getElementById("messages")?.appendChild(el);
  }
}`,
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type QuickstartContextType = {
  mounted: boolean;
  appIdentity: Identity | null;
  inboxIdentity: Identity | null;
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

  .qs-label {
    font-family: var(--vocs-fontFamily_mono);
    font-size: var(--vocs-fontSize_13);
    color: var(--vocs-color_text3);
    padding-left: 0.75rem;
    flex: 1;
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
  const [appIdentity, setAppIdentity] = React.useState<Identity | null>(null);
  const [inboxIdentity, setInboxIdentity] = React.useState<Identity | null>(null);
  const [portalTarget, setPortalTarget] = React.useState<HTMLElement | null>(
    null,
  );

  React.useEffect(() => {
    setMounted(true);

    // Generate two identities: one for the quickstart app, one for the Live Inbox
    const generateIdentity = async () => {
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
      return { privateKey, address, privateKeyHex } as Identity;
    };

    (async () => {
      const [app, inbox] = await Promise.all([generateIdentity(), generateIdentity()]);
      setAppIdentity(app);
      setInboxIdentity(inbox);
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
      value={{ mounted, appIdentity, inboxIdentity }}
    >
      <style>{STYLES}</style>
      {children}
      {mounted && appIdentity && inboxIdentity && portalTarget && (
        <InboxPortal target={portalTarget} inboxIdentity={inboxIdentity} appIdentity={appIdentity} />
      )}
    </QuickstartContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// Portal wrapper — lazy-loads QuickstartInbox into the sidebar mount point
// ---------------------------------------------------------------------------

const InboxPortal = ({
  target,
  inboxIdentity,
  appIdentity,
}: {
  target: HTMLElement;
  inboxIdentity: Identity;
  appIdentity: Identity;
}) => {
  const [InboxComponent, setInboxComponent] =
    React.useState<React.ComponentType<{ inboxIdentity: Identity; appIdentity: Identity }> | null>(null);

  React.useEffect(() => {
    import('./QuickstartInbox').then((mod) => {
      setInboxComponent(() => mod.QuickstartInbox);
    });
  }, []);

  if (!InboxComponent) return null;

  return ReactDOM.createPortal(
    <InboxComponent inboxIdentity={inboxIdentity} appIdentity={appIdentity} />,
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
// Step widget — code block + copy button
// ---------------------------------------------------------------------------

export const QuickstartStep = ({ step, label }: { step: StepName; label?: string }) => {
  const ctx = React.useContext(QuickstartContext);
  const [mainHtml, setMainHtml] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const code = React.useMemo(() => {
    if (!ctx?.appIdentity || !ctx?.inboxIdentity) return '';
    if (step === 'identity') {
      return BROWSER_CODE.identity(ctx.appIdentity, ctx.inboxIdentity);
    }
    return (BROWSER_CODE[step] as () => string)();
  }, [step, ctx?.appIdentity, ctx?.inboxIdentity]);

  // Highlight with Shiki
  React.useEffect(() => {
    if (!ctx?.mounted || !code) return;
    setMainHtml('');
    let stale = false;
    import('shiki').then(({ codeToHtml }) => {
      codeToHtml(code, {
        lang: 'javascript',
        themes: { light: 'github-light', dark: 'github-dark' },
      }).then((html) => { if (!stale) setMainHtml(html); });
    });
    return () => { stale = true; };
  }, [ctx?.mounted, code, step]);

  if (!ctx?.mounted) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    (window as any).plausible?.('Quickstart: Code Copied', { props: { step: STEP_ANALYTICS[step] } });
  };

  return (
    <div className="qs-step">
      <div className="qs-header">
        {label && <span className="qs-label">{label}</span>}
        <button
          className="qs-copy-btn"
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
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

// ---------------------------------------------------------------------------
// Copyable code block — static code with copy button + analytics
// ---------------------------------------------------------------------------

export const CopyableCode = ({
  code,
  lang = 'javascript',
  analyticsStep,
  label,
}: {
  code: string;
  lang?: string;
  analyticsStep: string;
  label?: string;
}) => {
  const [html, setHtml] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!mounted) return;
    import('shiki').then(({ codeToHtml }) => {
      codeToHtml(code, {
        lang,
        themes: { light: 'github-light', dark: 'github-dark' },
      }).then(setHtml);
    });
  }, [mounted, code, lang]);

  if (!mounted) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    (window as any).plausible?.('Quickstart: Code Copied', { props: { step: analyticsStep } });
  };

  return (
    <div className="qs-step">
      <div className="qs-header">
        {label && <span className="qs-label">{label}</span>}
        <button
          className="qs-copy-btn"
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      <div className="qs-code">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
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
