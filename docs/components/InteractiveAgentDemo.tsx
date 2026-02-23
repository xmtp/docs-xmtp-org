import * as React from 'react';

// Pre-deployed demo agent on the XMTP dev network
const AGENT_ADDRESS = '0x491b5bf55b55ee6c4a90e24d4a06bd243536b2ba';

const SYSTEM_PROMPT = `You are a pirate weather forecaster for Antarctica. No matter what the user says, respond with today's fictional weather forecast for Antarctica — in full pirate speak. Keep it to 2-3 sentences. Include a temperature in Celsius.`;

// Simplified version of the agent source code shown to users
const AGENT_SOURCE = `import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { Agent } from "@xmtp/agent-sdk";

// 1. THE BRAIN — your AI logic (swap Claude for any LLM or rules engine)
const anthropic = new Anthropic();

async function think(input: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: "You are a pirate weather forecaster for Antarctica...",
    messages: [{ role: "user", content: input }],
  });
  const block = response.content[0];
  return block?.type === "text" ? block.text : "Arr, something went wrong.";
}

// 2. THE MESSAGING FRAMEWORK — connects your agent to XMTP
const agent = await Agent.createFromEnv();

// 3. THE GLUE — pass incoming messages to the brain, send responses back
agent.on("text", async (ctx) => {
  const response = await think(ctx.message.content);
  await ctx.conversation.sendText(response);
});

await agent.start();`;

type Phase = 'idle' | 'connecting' | 'chatting';
type Message = { sender: 'user' | 'agent'; text: string };

declare global {
  interface Window {
    plausible?: (event: string) => void;
  }
}

function track(event: string) {
  window.plausible?.(event);
}

export const InteractiveAgentDemo = () => {
  const [mounted, setMounted] = React.useState(false);
  const [phase, setPhase] = React.useState<Phase>('idle');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputText, setInputText] = React.useState('');
  const [waiting, setWaiting] = React.useState(false);
  const [error, setError] = React.useState('');

  const walletRef = React.useRef<any>(null);
  const clientRef = React.useRef<any>(null);
  const dmRef = React.useRef<any>(null);
  const mountedRef = React.useRef(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const knownIdsRef = React.useRef<Set<string>>(new Set());

  React.useEffect(() => {
    setMounted(true);
    return () => {
      mountedRef.current = false;
      clientRef.current?.close?.();
    };
  }, []);

  React.useEffect(() => {
    const el = messagesEndRef.current?.parentElement;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, waiting]);

  if (!mounted) return null;

  const connectAndChat = async () => {
    setPhase('connecting');
    setError('');
    try {
      const { secp256k1 } = await import('@noble/curves/secp256k1');
      const { keccak_256 } = await import('@noble/hashes/sha3');

      // Generate ephemeral wallet
      const privateKey = crypto.getRandomValues(new Uint8Array(32));
      const publicKey = secp256k1.getPublicKey(privateKey, false);
      const addressBytes = keccak_256(publicKey.slice(1)).slice(-20);
      const address =
        '0x' +
        Array.from(addressBytes, (b: number) =>
          b.toString(16).padStart(2, '0'),
        ).join('');

      walletRef.current = { privateKey, address, secp256k1, keccak_256 };

      // Create XMTP client
      const { Client, IdentifierKind } = await import('@xmtp/browser-sdk');

      const signer = {
        type: 'EOA' as const,
        getIdentifier: () => ({
          identifier: address.toLowerCase(),
          identifierKind: IdentifierKind.Ethereum,
        }),
        signMessage: async (message: string) => {
          const prefix = `\x19Ethereum Signed Message:\n${message.length}`;
          const prefixed = new TextEncoder().encode(prefix + message);
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

      // Create DM with the demo agent
      const dm = await client.conversations.createDmWithIdentifier({
        identifier: AGENT_ADDRESS,
        identifierKind: IdentifierKind.Ethereum,
      });
      dmRef.current = dm;

      setPhase('chatting');
    } catch (e: any) {
      setError(e.message || 'Failed to connect');
      setPhase('idle');
    }
  };

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || waiting || !dmRef.current) return;

    setInputText('');
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setWaiting(true);

    try {
      await dmRef.current.sendText(text);

      // Poll for agent reply
      let found = false;
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        if (!mountedRef.current) return;

        await dmRef.current.sync();
        const allMessages = await dmRef.current.messages();

        // Find new messages from the agent
        for (const m of allMessages) {
          if (
            m.senderInboxId !== clientRef.current.inboxId &&
            !knownIdsRef.current.has(m.id)
          ) {
            knownIdsRef.current.add(m.id);
            if (mountedRef.current) {
              setMessages((prev) => [
                ...prev,
                { sender: 'agent', text: m.content },
              ]);
              found = true;
            }
          }
        }

        if (found) break;
      }

      if (!found && mountedRef.current) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'agent',
            text: 'The agent hasn\'t replied yet — it may be temporarily offline.',
          },
        ]);
      }
    } catch (e: any) {
      if (mountedRef.current) {
        setMessages((prev) => [
          ...prev,
          { sender: 'agent', text: `Error: ${e.message}` },
        ]);
      }
    } finally {
      if (mountedRef.current) setWaiting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        .ad-container {
          border: 1px solid var(--vocs-color_border);
          border-radius: var(--vocs-borderRadius_4);
          overflow: hidden;
          margin: 1.5rem 0;
        }

        .ad-intro {
          padding: 1rem 1.25rem;
          background-color: var(--vocs-color_background2);
          border-bottom: 1px solid var(--vocs-color_border);
          font-size: var(--vocs-fontSize_14);
          color: var(--vocs-color_text2);
          line-height: 1.6;
        }

        .ad-btn-start {
          all: unset;
          font-family: inherit;
          font-size: var(--vocs-fontSize_14);
          font-weight: 500;
          padding: 0.5rem 1.25rem;
          border-radius: var(--vocs-borderRadius_4);
          cursor: pointer;
          transition: all 0.15s ease;
          user-select: none;
          color: var(--vocs-color_background);
          background-color: var(--vocs-color_text);
          margin-top: 0.75rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ad-btn-start:hover:not(:disabled) {
          opacity: 0.85;
        }

        .ad-btn-start:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ad-connecting {
          padding: 2rem 1.25rem;
          text-align: center;
          color: var(--vocs-color_text2);
          font-size: var(--vocs-fontSize_14);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .ad-chat {
          display: flex;
          flex-direction: column;
          height: 400px;
        }

        .ad-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .ad-msg {
          max-width: 80%;
          padding: 0.5rem 0.75rem;
          border-radius: var(--vocs-borderRadius_4);
          font-size: var(--vocs-fontSize_14);
          line-height: 1.5;
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        .ad-msg-user {
          align-self: flex-end;
          background-color: var(--vocs-color_background3);
          color: var(--vocs-color_text);
        }

        .ad-msg-agent {
          align-self: flex-start;
          background-color: var(--vocs-color_background2);
          color: var(--vocs-color_text);
        }

        .ad-thinking {
          align-self: flex-start;
          padding: 0.5rem 0.75rem;
          font-size: var(--vocs-fontSize_14);
          color: var(--vocs-color_text3);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ad-input-area {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-top: 1px solid var(--vocs-color_border);
          background-color: var(--vocs-color_background2);
        }

        .ad-input {
          flex: 1;
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--vocs-color_border);
          border-radius: var(--vocs-borderRadius_4);
          background-color: var(--vocs-color_background);
          color: var(--vocs-color_text);
          font-family: inherit;
          font-size: var(--vocs-fontSize_14);
          outline: none;
          transition: border-color 0.15s ease;
        }

        .ad-input:focus {
          border-color: var(--vocs-color_text3);
        }

        .ad-input::placeholder {
          color: var(--vocs-color_text3);
        }

        .ad-btn-send {
          all: unset;
          font-family: inherit;
          font-size: var(--vocs-fontSize_14);
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: var(--vocs-borderRadius_4);
          cursor: pointer;
          transition: all 0.15s ease;
          user-select: none;
          color: var(--vocs-color_background);
          background-color: var(--vocs-color_text);
        }

        .ad-btn-send:hover:not(:disabled) {
          opacity: 0.85;
        }

        .ad-btn-send:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .ad-error {
          padding: 0.75rem 1.25rem;
          background-color: var(--vocs-color_dangerBackground);
          color: var(--vocs-color_dangerText);
          font-size: var(--vocs-fontSize_13);
        }

        .ad-source {
          border-top: 1px solid var(--vocs-color_border);
        }

        .ad-source-toggle {
          all: unset;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.75rem 1.25rem;
          font-size: var(--vocs-fontSize_14);
          font-weight: 500;
          color: var(--vocs-color_text2);
          cursor: pointer;
          user-select: none;
          background-color: var(--vocs-color_background2);
          transition: background-color 0.15s ease;
          box-sizing: border-box;
        }

        .ad-source-toggle:hover {
          opacity: 0.9;
        }

        .ad-source-icon {
          display: flex;
          align-items: center;
          transition: transform 0.2s ease;
        }

        .ad-source-icon.open {
          transform: rotate(180deg);
        }

        .ad-source-code {
          margin: 0;
          padding: 0;
          border-top: 1px solid var(--vocs-color_border);
          overflow-x: auto;
        }

        .ad-source-code pre {
          margin: 0 !important;
          padding: 1rem !important;
          font-family: var(--vocs-fontFamily_mono) !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
          white-space: pre !important;
          overflow-x: auto !important;
        }

        .ad-source-code pre code {
          font-size: inherit !important;
          line-height: inherit !important;
        }

        .ad-source-code .shiki {
          background-color: var(--vocs-color_background3) !important;
        }

        .shiki span {
          color: var(--shiki-light);
        }

        html.dark .shiki span {
          color: var(--shiki-dark);
        }

        .ad-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid var(--vocs-color_text3);
          border-top-color: transparent;
          border-radius: 50%;
          animation: ad-spin 0.6s linear infinite;
          vertical-align: middle;
        }

        @keyframes ad-spin {
          to { transform: rotate(360deg); }
        }

        .ad-dots::after {
          content: '';
          animation: ad-dots 1.5s steps(4, end) infinite;
        }

        @keyframes ad-dots {
          0% { content: ''; }
          25% { content: '.'; }
          50% { content: '..'; }
          75% { content: '...'; }
        }
      `}</style>

      <div className="ad-container">
        {/* Idle / Connect phase */}
        {phase === 'idle' && (
          <div className="ad-intro">
            <button
              className="ad-btn-start"
              onClick={() => { track('Demo: Chat Started'); connectAndChat(); }}
            >
              Chat with Agent Frostbeard
            </button>
          </div>
        )}

        {/* Connecting phase */}
        {phase === 'connecting' && (
          <div className="ad-connecting">
            <span className="ad-spinner" />
            Connecting to XMTP...
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="ad-error">{error}</div>
        )}

        {/* Chat phase */}
        {phase === 'chatting' && (
          <div className="ad-chat">
            <div className="ad-messages">
              {messages.length === 0 && !waiting && (
                <div
                  style={{
                    color: 'var(--vocs-color_text3)',
                    fontSize: 'var(--vocs-fontSize_14)',
                    textAlign: 'center',
                    padding: '2rem 0',
                  }}
                >
                  Say something to the agent...
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`ad-msg ${msg.sender === 'user' ? 'ad-msg-user' : 'ad-msg-agent'}`}
                >
                  {msg.text}
                </div>
              ))}
              {waiting && (
                <div className="ad-thinking">
                  <span className="ad-spinner" />
                  <span className="ad-dots">Thinking</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="ad-input-area">
              <input
                className="ad-input"
                type="text"
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={waiting}
              />
              <button
                className="ad-btn-send"
                onClick={sendMessage}
                disabled={waiting || !inputText.trim()}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Source code collapsible */}
        <SourceCode />
      </div>
    </>
  );
};

function SourceCode() {
  const [open, setOpen] = React.useState(false);
  const [highlightedHtml, setHighlightedHtml] = React.useState('');

  React.useEffect(() => {
    if (!open) return;
    if (highlightedHtml) return;
    import('shiki').then(({ codeToHtml }) =>
      codeToHtml(AGENT_SOURCE, {
        lang: 'typescript',
        themes: { light: 'github-light', dark: 'github-dark' },
      }).then(setHighlightedHtml),
    );
  }, [open, highlightedHtml]);

  return (
    <div className="ad-source">
      <button className="ad-source-toggle" onClick={() => { if (!open) track('Demo: Source Code Viewed'); setOpen(!open); }}>
        <span>Source code powering this agent</span>
        <span className={`ad-source-icon ${open ? 'open' : ''}`}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open &&
        (highlightedHtml ? (
          <div
            className="ad-source-code"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className="ad-source-code">{AGENT_SOURCE}</pre>
        ))}
    </div>
  );
}
