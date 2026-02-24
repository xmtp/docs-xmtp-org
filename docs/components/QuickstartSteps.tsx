import * as React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';

const AGENT_ADDRESS = '0xf9244662f952d6ef83bd0719ddb5a27fbb2fe1bc';

type StepName =
  | 'install'
  | 'wallet'
  | 'connect'
  | 'conversation'
  | 'send'
  | 'reply';
type StepStatus = 'idle' | 'running' | 'done' | 'error';
type TabVariant = 'cli' | 'browser';

// ---------------------------------------------------------------------------
// Code constants — displayed in the UI. CLI shows bash, Browser shows TS.
// ---------------------------------------------------------------------------

const CLI_CODE: Record<StepName, string> = {
  install: 'npm install -g @xmtp/cli',
  wallet: 'xmtp init',
  connect: 'xmtp client info',
  conversation: `xmtp conversations create-dm ${AGENT_ADDRESS} --json`,
  send: 'xmtp conversation send-text <conversation-id> "gm"',
  reply: 'xmtp conversation messages <conversation-id> --sync --json',
};

const BROWSER_CODE: Record<StepName, string> = {
  install: 'npm install @xmtp/browser-sdk @noble/curves @noble/hashes',
  wallet: `import { secp256k1 } from "@noble/curves/secp256k1";
import { keccak_256 } from "@noble/hashes/sha3";

// Generate an ephemeral wallet — no wallet extension needed
const privateKey = crypto.getRandomValues(new Uint8Array(32));
const publicKey = secp256k1.getPublicKey(privateKey, false);
const addressBytes = keccak_256(publicKey.slice(1)).slice(-20);
const address = "0x" + Array.from(addressBytes, b =>
  b.toString(16).padStart(2, "0")).join("");`,
  connect: `import { Client, IdentifierKind } from "@xmtp/browser-sdk";

// XMTP authenticates via a signer — wraps your wallet's sign function
const signer = {
  type: "EOA",
  getIdentifier: () => ({
    identifier: address.toLowerCase(),
    identifierKind: IdentifierKind.Ethereum,
  }),
  signMessage: async (message) => {
    const prefix = "\\x19Ethereum Signed Message:\\n" + message.length;
    const hash = keccak_256(new TextEncoder().encode(prefix + message));
    const sig = secp256k1.sign(hash, privateKey);
    return new Uint8Array([...sig.toCompactRawBytes(), sig.recovery + 27]);
  },
};

// Connect to the dev network with an in-memory database
const client = await Client.create(signer, {
  env: "dev",
  dbPath: null,
});`,
  conversation: `const dm = await client.conversations.createDmWithIdentifier({
  identifier: "${AGENT_ADDRESS}",
  identifierKind: IdentifierKind.Ethereum,
});`,
  send: 'await dm.sendText("gm");',
  reply: `await dm.sync();
const messages = await dm.messages();
const reply = messages.find(m => m.senderInboxId !== client.inboxId);
console.log("Agent:", reply.content);`,
};

// Step N's Run is disabled until PREV_STEP[N] is 'done'.
const PREV_STEP: Record<StepName, StepName | null> = {
  install: null,
  wallet: null, // first runnable step — always available
  connect: 'wallet',
  conversation: 'connect',
  send: 'conversation',
  reply: 'send',
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type QuickstartContextType = {
  mounted: boolean;
  activeTab: TabVariant;
  setActiveTab: (tab: TabVariant) => void;
  statuses: Record<StepName, StepStatus>;
  outputs: Record<StepName, string>;
  run: (step: StepName) => void;
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

  .qs-actions {
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--vocs-color_border);
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .qs-btn {
    all: unset;
    font-family: inherit;
    font-size: var(--vocs-fontSize_14);
    font-weight: 500;
    padding: 0.4rem 1rem;
    border-radius: var(--vocs-borderRadius_4);
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
    color: var(--vocs-color_background);
    background-color: var(--vocs-color_text);
  }

  .qs-btn:hover:not(:disabled) {
    opacity: 0.85;
  }

  .qs-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .qs-btn-done {
    color: var(--vocs-color_successText);
    background-color: var(--vocs-color_successBackground);
    cursor: default;
  }

  .qs-btn-done:hover {
    opacity: 1;
  }

  .qs-output {
    margin: 0;
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--vocs-color_border);
    background-color: var(--vocs-color_background);
    font-family: var(--vocs-fontFamily_mono);
    font-size: var(--vocs-fontSize_13);
    line-height: 1.7;
    color: var(--vocs-color_text2);
    white-space: pre-wrap;
    word-break: break-all;
  }

  .qs-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid var(--vocs-color_text3);
    border-top-color: transparent;
    border-radius: 50%;
    animation: qs-spin 0.6s linear infinite;
    vertical-align: middle;
  }

  @keyframes qs-spin {
    to { transform: rotate(360deg); }
  }
`;

// ---------------------------------------------------------------------------
// Provider — holds shared refs (wallet, client, dm) and runner functions
// ---------------------------------------------------------------------------

export const QuickstartProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mounted, setMounted] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabVariant>('browser');
  const [statuses, setStatuses] = React.useState<
    Record<StepName, StepStatus>
  >({
    install: 'idle',
    wallet: 'idle',
    connect: 'idle',
    conversation: 'idle',
    send: 'idle',
    reply: 'idle',
  });
  const [outputs, setOutputs] = React.useState<Record<StepName, string>>({
    install: '',
    wallet: '',
    connect: '',
    conversation: '',
    send: '',
    reply: '',
  });

  const walletRef = React.useRef<any>(null);
  const clientRef = React.useRef<any>(null);
  const dmRef = React.useRef<any>(null);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    setMounted(true);
    return () => {
      mountedRef.current = false;
      clientRef.current?.close?.();
    };
  }, []);

  const setStepStatus = (step: StepName, status: StepStatus) => {
    if (mountedRef.current)
      setStatuses((prev) => ({ ...prev, [step]: status }));
  };

  const setStepOutput = (step: StepName, output: string) => {
    if (mountedRef.current)
      setOutputs((prev) => ({ ...prev, [step]: output }));
  };

  const run = async (step: StepName) => {
    switch (step) {
      case 'wallet': {
        setStepStatus('wallet', 'running');
        setStepOutput('wallet', '');
        try {
          const { secp256k1 } = await import(
            '@noble/curves/secp256k1'
          );
          const { keccak_256 } = await import(
            '@noble/hashes/sha3'
          );
          const privateKey = crypto.getRandomValues(
            new Uint8Array(32),
          );
          const publicKey = secp256k1.getPublicKey(
            privateKey,
            false,
          );
          const addressBytes = keccak_256(publicKey.slice(1)).slice(
            -20,
          );
          const address =
            '0x' +
            Array.from(addressBytes, (b: number) =>
              b.toString(16).padStart(2, '0'),
            ).join('');
          walletRef.current = {
            privateKey,
            address,
            secp256k1,
            keccak_256,
          };
          setStepOutput('wallet', `Wallet created: ${address}`);
          setStepStatus('wallet', 'done');
        } catch (e: any) {
          setStepOutput('wallet', `Error: ${e.message}`);
          setStepStatus('wallet', 'error');
        }
        break;
      }

      case 'connect': {
        setStepStatus('connect', 'running');
        setStepOutput(
          'connect',
          'Connecting to XMTP dev network...',
        );
        try {
          const { Client, IdentifierKind } = await import(
            '@xmtp/browser-sdk'
          );
          const { privateKey, address, secp256k1, keccak_256 } =
            walletRef.current;
          const signer = {
            type: 'EOA' as const,
            getIdentifier: () => ({
              identifier: address.toLowerCase(),
              identifierKind: IdentifierKind.Ethereum,
            }),
            signMessage: async (message: string) => {
              const prefix = `\x19Ethereum Signed Message:\n${message.length}`;
              const prefixed = new TextEncoder().encode(
                prefix + message,
              );
              const hash = keccak_256(prefixed);
              const sig = secp256k1.sign(hash, privateKey);
              return new Uint8Array([
                ...sig.toCompactRawBytes(),
                sig.recovery + 27,
              ]);
            },
          };
          const client = await Client.create(signer, {
            env: 'dev',
            dbPath: null,
          });
          clientRef.current = client;
          setStepOutput('connect', `Connected as ${address}`);
          setStepStatus('connect', 'done');
        } catch (e: any) {
          setStepOutput('connect', `Error: ${e.message}`);
          setStepStatus('connect', 'error');
        }
        break;
      }

      case 'conversation': {
        setStepStatus('conversation', 'running');
        setStepOutput(
          'conversation',
          'Creating conversation with gm agent...',
        );
        try {
          const { IdentifierKind } = await import(
            '@xmtp/browser-sdk'
          );
          const dm =
            await clientRef.current.conversations.createDmWithIdentifier(
              {
                identifier: AGENT_ADDRESS,
                identifierKind: IdentifierKind.Ethereum,
              },
            );
          dmRef.current = dm;
          setStepOutput(
            'conversation',
            `Conversation created: ${dm.id}`,
          );
          setStepStatus('conversation', 'done');
        } catch (e: any) {
          setStepOutput('conversation', `Error: ${e.message}`);
          setStepStatus('conversation', 'error');
        }
        break;
      }

      case 'send': {
        setStepStatus('send', 'running');
        setStepOutput('send', '');
        try {
          await dmRef.current.sendText('gm');
          setStepOutput('send', 'You: gm');
          setStepStatus('send', 'done');
        } catch (e: any) {
          setStepOutput('send', `Error: ${e.message}`);
          setStepStatus('send', 'error');
        }
        break;
      }

      case 'reply': {
        setStepStatus('reply', 'running');
        setStepOutput('reply', 'Waiting for reply...');
        try {
          const dm = dmRef.current;
          const client = clientRef.current;
          for (let i = 0; i < 20; i++) {
            await new Promise((r) => setTimeout(r, 2000));
            if (!mountedRef.current) return;
            await dm.sync();
            const messages = await dm.messages();
            const reply = messages.find(
              (m: any) => m.senderInboxId !== client.inboxId,
            );
            if (reply) {
              setStepOutput('reply', `Agent: ${reply.content}`);
              setStepStatus('reply', 'done');
              return;
            }
          }
          setStepOutput(
            'reply',
            "Message sent, but the agent hasn't replied yet.\nThe agent may be temporarily offline.",
          );
          setStepStatus('reply', 'done');
        } catch (e: any) {
          setStepOutput('reply', `Error: ${e.message}`);
          setStepStatus('reply', 'error');
        }
        break;
      }
    }
  };

  return (
    <QuickstartContext.Provider
      value={{
        mounted,
        activeTab,
        setActiveTab,
        statuses,
        outputs,
        run,
      }}
    >
      <style>{STYLES}</style>
      {children}
    </QuickstartContext.Provider>
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
// Step widget — tabbed code block + copy + run + output
// ---------------------------------------------------------------------------

export const QuickstartStep = ({ step }: { step: StepName }) => {
  const ctx = React.useContext(QuickstartContext);
  const [cliHtml, setCliHtml] = React.useState('');
  const [browserHtml, setBrowserHtml] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const cliCode = CLI_CODE[step];
  const browserCode = BROWSER_CODE[step];

  React.useEffect(() => {
    if (!ctx?.mounted) return;
    import('shiki').then(({ codeToHtml }) => {
      const browserLang =
        step === 'install' ? 'bash' : 'typescript';
      codeToHtml(cliCode, {
        lang: 'bash',
        themes: { light: 'github-light', dark: 'github-dark' },
      }).then(setCliHtml);
      codeToHtml(browserCode, {
        lang: browserLang,
        themes: { light: 'github-light', dark: 'github-dark' },
      }).then(setBrowserHtml);
    });
  }, [ctx?.mounted, cliCode, browserCode, step]);

  if (!ctx?.mounted) return null;

  const { activeTab, setActiveTab, statuses, outputs, run } = ctx;
  const status = statuses[step];
  const output = outputs[step];
  const isInstall = step === 'install';

  const prevStep = PREV_STEP[step];
  const isRunDisabled =
    isInstall ||
    status === 'running' ||
    status === 'done' ||
    (prevStep !== null && statuses[prevStep] !== 'done');

  const activeCode =
    activeTab === 'cli' ? cliCode : browserCode;
  const activeHtml =
    activeTab === 'cli' ? cliHtml : browserHtml;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const buttonLabel =
    status === 'running'
      ? 'Running...'
      : status === 'done'
        ? 'Done'
        : status === 'error'
          ? 'Retry'
          : 'Run';

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
        {activeHtml ? (
          <div
            dangerouslySetInnerHTML={{ __html: activeHtml }}
          />
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
            {activeCode}
          </pre>
        )}
      </div>

      {!isInstall && (
        <div className="qs-actions">
          <button
            className={
              status === 'done'
                ? 'qs-btn qs-btn-done'
                : 'qs-btn'
            }
            onClick={() => run(step)}
            disabled={isRunDisabled}
          >
            {status === 'running' && (
              <>
                <span className="qs-spinner" />{' '}
              </>
            )}
            {buttonLabel}
          </button>
        </div>
      )}

      {output && <pre className="qs-output">{output}</pre>}
    </div>
  );
};
