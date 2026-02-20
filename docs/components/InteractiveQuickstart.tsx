import * as React from 'react';

// The gm agent on the dev network — source at agents/hello-world/index.ts
const AGENT_ADDRESS = '0xf9244662f952d6ef83bd0719ddb5a27fbb2fe1bc';

type StepStatus = 'idle' | 'running' | 'done' | 'error';

// These code strings are displayed in the UI to show users what each step does.
// They mirror the actual runtime code in the runStep functions below.

const CODE_STEP_1 = `import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

// Generate an ephemeral wallet — no wallet extension needed
const key = generatePrivateKey();
const account = privateKeyToAccount(key);`;

const CODE_STEP_2 = `import { Client, IdentifierKind } from "@xmtp/browser-sdk";
import { toBytes } from "viem";

// Create a signer that XMTP uses to authenticate your wallet
const signer = {
  type: "EOA",
  getIdentifier: () => ({
    identifier: account.address.toLowerCase(),
    identifierKind: IdentifierKind.Ethereum,
  }),
  signMessage: async (message) => {
    const signature = await account.signMessage({ message });
    return toBytes(signature);
  },
};

// Connect to XMTP with an in-memory database (no persistence needed for a demo)
const client = await Client.create(signer, {
  env: "dev",
  dbPath: null,
});`;

const CODE_STEP_3 = `// Start a DM conversation with the agent
const dm = await client.conversations.createDmWithIdentifier({
  identifier: "${AGENT_ADDRESS}",
  identifierKind: IdentifierKind.Ethereum,
});

await dm.sendText("gm");

// Sync the conversation and check for new messages
await dm.sync();
const messages = await dm.messages();
const reply = messages.find((m) => m.senderInboxId !== client.inboxId);
console.log("Agent:", reply.content);`;

export const InteractiveQuickstart = () => {
  const [mounted, setMounted] = React.useState(false);

  const [step1Status, setStep1Status] = React.useState<StepStatus>('idle');
  const [step2Status, setStep2Status] = React.useState<StepStatus>('idle');
  const [step3Status, setStep3Status] = React.useState<StepStatus>('idle');

  const [step1Output, setStep1Output] = React.useState('');
  const [step2Output, setStep2Output] = React.useState('');
  const [step3Output, setStep3Output] = React.useState('');

  // Refs persist across steps so step 2 can use the wallet from step 1, etc.
  const walletRef = React.useRef<any>(null);
  const clientRef = React.useRef<any>(null);
  const mountedRef = React.useRef(true);

  // Mounted gate: render nothing on the server, only on the client.
  // This avoids SSR issues with browser-only APIs (crypto, Web Workers).
  React.useEffect(() => {
    setMounted(true);
    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (!mounted) return null;

  // Step 1: Generate a throwaway wallet using viem.
  // No network call — instant.
  const runStep1 = async () => {
    setStep1Status('running');
    setStep1Output('');
    try {
      const { generatePrivateKey, privateKeyToAccount } = await import(
        'viem/accounts'
      );
      const key = generatePrivateKey();
      const account = privateKeyToAccount(key);
      walletRef.current = account;
      setStep1Output(`Wallet created: ${account.address}`);
      setStep1Status('done');
    } catch (e: any) {
      setStep1Output(`Error: ${e.message}`);
      setStep1Status('error');
    }
  };

  // Step 2: Create an XMTP client using the wallet from step 1.
  // This loads the browser SDK (Web Worker + WASM), creates a signer,
  // and connects to the XMTP dev network. Takes a few seconds.
  const runStep2 = async () => {
    setStep2Status('running');
    setStep2Output('');
    try {
      const { Client, IdentifierKind } = await import('@xmtp/browser-sdk');
      const { toBytes } = await import('viem');
      const account = walletRef.current;

      const signer = {
        type: 'EOA' as const,
        getIdentifier: () => ({
          identifier: account.address.toLowerCase(),
          identifierKind: IdentifierKind.Ethereum,
        }),
        signMessage: async (message: string) => {
          const signature = await account.signMessage({ message });
          return toBytes(signature);
        },
      };

      setStep2Output('Connecting to XMTP dev network...');

      const client = await Client.create(signer, {
        env: 'dev',
        dbPath: null, // In-memory database — no OPFS needed
      });

      clientRef.current = client;
      setStep2Output(`Connected as ${account.address}`);
      setStep2Status('done');
    } catch (e: any) {
      setStep2Output(`Error: ${e.message}`);
      setStep2Status('error');
    }
  };

  // Step 3: Send "gm" to the agent and poll for a reply.
  // Creates a DM conversation, sends the message, then polls every 2s
  // (up to 40s total) for the agent's response.
  const runStep3 = async () => {
    setStep3Status('running');
    setStep3Output('');
    try {
      const { IdentifierKind } = await import('@xmtp/browser-sdk');
      const client = clientRef.current;

      setStep3Output('Creating conversation with gm agent...');

      const dm = await client.conversations.createDmWithIdentifier({
        identifier: AGENT_ADDRESS,
        identifierKind: IdentifierKind.Ethereum,
      });

      await dm.sendText('gm');
      setStep3Output('You: gm\nWaiting for reply...');

      // Poll for the agent's reply (sync + check messages each iteration)
      const maxAttempts = 20;
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        if (!mountedRef.current) return;
        await dm.sync();
        const messages = await dm.messages();
        const reply = messages.find(
          (m: any) => m.senderInboxId !== client.inboxId,
        );
        if (reply) {
          if (mountedRef.current) {
            setStep3Output(`You: gm\nAgent: ${reply.content}`);
            setStep3Status('done');
          }
          return;
        }
      }

      if (!mountedRef.current) return;
      setStep3Output(
        'You: gm\nMessage sent successfully, but the agent hasn\'t replied yet.\nThe agent may be temporarily offline. Your message was delivered to the XMTP network.',
      );
      setStep3Status('done');
    } catch (e: any) {
      setStep3Output((prev) => prev + `\nError: ${e.message}`);
      setStep3Status('error');
    }
  };

  return (
    <>
      <style>{`
        .iq-step {
          border: 1px solid var(--vocs-color_border);
          border-radius: var(--vocs-borderRadius_4);
          overflow: hidden;
          margin: 1.5rem 0;
        }

        .iq-step-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 1rem;
          background-color: var(--vocs-color_background2);
          border-bottom: 1px solid var(--vocs-color_border);
        }

        .iq-step-title {
          font-size: var(--vocs-fontSize_14);
          font-weight: 500;
          color: var(--vocs-color_text2);
        }

        .iq-code {
          margin: 0;
          padding: 1rem;
          background-color: var(--vocs-color_background3);
          font-family: var(--vocs-fontFamily_mono);
          font-size: var(--vocs-fontSize_13);
          line-height: 1.7;
          color: var(--vocs-color_text);
          white-space: pre;
          overflow-x: auto;
        }

        .iq-actions {
          padding: 0.75rem 1rem;
          border-top: 1px solid var(--vocs-color_border);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .iq-btn {
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

        .iq-btn:hover:not(:disabled) {
          opacity: 0.85;
        }

        .iq-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .iq-btn-done {
          color: var(--vocs-color_successText);
          background-color: var(--vocs-color_successBackground);
          cursor: default;
        }

        .iq-btn-done:hover {
          opacity: 1;
        }

        .iq-output {
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

        .iq-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid var(--vocs-color_text3);
          border-top-color: transparent;
          border-radius: 50%;
          animation: iq-spin 0.6s linear infinite;
          vertical-align: middle;
        }

        @keyframes iq-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Step
        number={1}
        title="Generate a wallet"
        code={CODE_STEP_1}
        status={step1Status}
        output={step1Output}
        onRun={runStep1}
        disabled={false}
      />

      <Step
        number={2}
        title="Connect to XMTP"
        code={CODE_STEP_2}
        status={step2Status}
        output={step2Output}
        onRun={runStep2}
        disabled={step1Status !== 'done'}
      />

      <Step
        number={3}
        title="Send a message and get a reply"
        code={CODE_STEP_3}
        status={step3Status}
        output={step3Output}
        onRun={runStep3}
        disabled={step2Status !== 'done'}
      />
    </>
  );
};

// Renders a single step: header, code block, run button, and output.
function Step({
  number,
  title,
  code,
  status,
  output,
  onRun,
  disabled,
}: {
  number: number;
  title: string;
  code: string;
  status: StepStatus;
  output: string;
  onRun: () => void;
  disabled: boolean;
}) {
  const buttonLabel =
    status === 'running'
      ? 'Running...'
      : status === 'done'
        ? 'Done'
        : status === 'error'
          ? 'Retry'
          : 'Run';

  const buttonClass =
    status === 'done' ? 'iq-btn iq-btn-done' : 'iq-btn';

  return (
    <div className="iq-step">
      <div className="iq-step-header">
        <span className="iq-step-title">
          Step {number}: {title}
        </span>
      </div>
      <pre className="iq-code">{code}</pre>
      <div className="iq-actions">
        <button
          className={buttonClass}
          onClick={onRun}
          disabled={disabled || status === 'running' || status === 'done'}
        >
          {status === 'running' && <span className="iq-spinner" />}{' '}
          {buttonLabel}
        </button>
      </div>
      {output && <pre className="iq-output">{output}</pre>}
    </div>
  );
}
