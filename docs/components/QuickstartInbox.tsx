import * as React from 'react';

type Identity = {
  privateKey: Uint8Array;
  address: string;
  privateKeyHex: string;
};

type Message = {
  id: string;
  sender: 'self' | 'remote';
  text: string;
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const INBOX_STYLES = `
  .qi-card {
    border: 1px solid var(--vocs-color_border);
    border-radius: var(--vocs-borderRadius_4);
    margin-top: 1rem;
    overflow: hidden;
    font-size: var(--vocs-fontSize_13);
  }

  .qi-header {
    padding: 0.75rem;
    background-color: var(--vocs-color_background2);
    border-bottom: 1px solid var(--vocs-color_border);
  }

  .qi-title {
    font-weight: 600;
    font-size: var(--vocs-fontSize_14);
    margin-bottom: 0.5rem;
    color: var(--vocs-color_text);
  }

  .qi-field {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-bottom: 0.25rem;
    color: var(--vocs-color_text3);
    font-family: var(--vocs-fontFamily_mono);
    font-size: 11px;
    line-height: 1.4;
  }

  .qi-field-label {
    flex-shrink: 0;
    font-family: var(--vocs-fontFamily_default);
    color: var(--vocs-color_text2);
  }

  .qi-copy-btn {
    all: unset;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: var(--vocs-borderRadius_4);
    font-size: 11px;
    color: var(--vocs-color_link);
    border: 1px solid var(--vocs-color_border);
    transition: all 0.15s;
    white-space: nowrap;
  }

  .qi-copy-btn:hover {
    background-color: var(--vocs-color_background3);
  }

  .qi-status {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-top: 0.375rem;
    font-size: 11px;
  }

  .qi-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .qi-dot-connecting {
    background-color: var(--vocs-color_warningText, #ca8a04);
    animation: qi-pulse 1.5s ease-in-out infinite;
  }

  .qi-dot-connected {
    background-color: var(--vocs-color_successText, #16a34a);
  }

  .qi-dot-error {
    background-color: var(--vocs-color_dangerText, #dc2626);
  }

  @keyframes qi-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .qi-messages {
    height: 180px;
    overflow-y: auto;
    padding: 0.5rem 0.75rem;
    background-color: var(--vocs-color_background);
  }

  .qi-empty {
    color: var(--vocs-color_text4);
    font-style: italic;
    text-align: center;
    margin-top: 2rem;
    font-size: 11px;
  }

  .qi-msg {
    padding: 0.25rem 0;
    font-size: 12px;
    line-height: 1.4;
    word-break: break-word;
  }

  .qi-msg-self {
    color: var(--vocs-color_text2);
  }

  .qi-msg-remote {
    color: var(--vocs-color_text);
  }

  .qi-msg-label {
    font-weight: 600;
    margin-right: 0.25rem;
  }

  .qi-input-row {
    display: flex;
    border-top: 1px solid var(--vocs-color_border);
  }

  .qi-input {
    flex: 1;
    border: none;
    outline: none;
    padding: 0.5rem 0.75rem;
    font-size: 12px;
    font-family: inherit;
    background: var(--vocs-color_background);
    color: var(--vocs-color_text);
  }

  .qi-input::placeholder {
    color: var(--vocs-color_text4);
  }

  .qi-send-btn {
    all: unset;
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    font-size: 12px;
    font-weight: 500;
    color: var(--vocs-color_link);
    border-left: 1px solid var(--vocs-color_border);
    transition: background-color 0.15s;
  }

  .qi-send-btn:hover {
    background-color: var(--vocs-color_background2);
  }

  .qi-send-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const QuickstartInbox = ({ inboxIdentity, appIdentity }: { inboxIdentity: Identity; appIdentity: Identity }) => {
  const [status, setStatus] = React.useState<
    'connecting' | 'connected' | 'error'
  >('connecting');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputVal, setInputVal] = React.useState('');
  const [copiedAddr, setCopiedAddr] = React.useState(false);
  const [inboxId, setInboxId] = React.useState('');

  const clientRef = React.useRef<any>(null);
  const dmRef = React.useRef<any>(null);
  const getOrCreateDmRef = React.useRef<(() => Promise<any>) | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  React.useEffect(() => {
    const el = messagesEndRef.current?.parentElement;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Initialize XMTP client + DM with quickstart app + stream
  React.useEffect(() => {
    let mounted = true;
    let streamCleanup: (() => void) | null = null;

    (async () => {
      try {
        const { secp256k1 } = await import('@noble/curves/secp256k1');
        const { keccak_256 } = await import('@noble/hashes/sha3');
        const { Client, IdentifierKind } = await import(
          '@xmtp/browser-sdk'
        );

        const signer = {
          type: 'EOA' as const,
          getIdentifier: () => ({
            identifier: inboxIdentity.address.toLowerCase(),
            identifierKind: IdentifierKind.Ethereum,
          }),
          signMessage: async (message: string) => {
            const msgBytes = new TextEncoder().encode(message);
            const prefix = `\x19Ethereum Signed Message:\n${msgBytes.length}`;
            const prefixed = new TextEncoder().encode(prefix + message);
            const hash = keccak_256(prefixed);
            const sig = secp256k1.sign(hash, inboxIdentity.privateKey);
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
        if (!mounted) {
          client.close();
          return;
        }

        clientRef.current = client;
        setInboxId(client.inboxId ?? '');

        // Store a helper to lazily create the DM when the quickstart app is registered
        getOrCreateDmRef.current = async () => {
          if (dmRef.current) return dmRef.current;
          const dm = await client.conversations.createDmWithIdentifier({
            identifier: appIdentity.address.toLowerCase(),
            identifierKind: IdentifierKind.Ethereum,
          });
          dmRef.current = dm;
          return dm;
        };

        if (!mounted) return;
        setStatus('connected');

        // Stream all messages
        const stream = await client.conversations.streamAllMessages();
        streamCleanup = () => stream.return();

        for await (const message of stream) {
          if (!mounted) break;
          if (!message?.content || typeof message.content !== 'string')
            continue;

          const sender =
            message.senderInboxId === client.inboxId
              ? 'self'
              : 'remote';
          setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) return prev;
            return [
              ...prev,
              { id: message.id, sender, text: message.content as string },
            ];
          });
        }
      } catch (e: any) {
        console.error('QuickstartInbox error:', e);
        if (mounted) setStatus('error');
      }
    })();

    return () => {
      mounted = false;
      dmRef.current = null;
      getOrCreateDmRef.current = null;
      streamCleanup?.();
      clientRef.current?.close?.();
    };
  }, [inboxIdentity, appIdentity]);

  const handleSend = async () => {
    const text = inputVal.trim();
    if (!text || !getOrCreateDmRef.current) return;
    setInputVal('');
    try {
      const dm = await getOrCreateDmRef.current();
      await dm.sendText(text);
      (window as any).plausible?.('Quickstart: Message Sent');
    } catch (e) {
      console.error('Send failed:', e);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(inboxIdentity.address);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 1500);
  };

  const truncate = (s: string, n: number) =>
    s.length > n ? s.slice(0, n) + '...' : s;

  return (
    <>
      <style>{INBOX_STYLES}</style>
      <div className="qi-card">
        <div className="qi-header">
          <div className="qi-title">XMTP Live Inbox</div>
          <div className="qi-field">
            <span className="qi-field-label">Address:</span>
            <span>{truncate(inboxIdentity.address, 14)}</span>
          </div>
          {inboxId && (
            <div className="qi-field">
              <span className="qi-field-label">Inbox ID:</span>
              <span>{truncate(inboxId, 14)}</span>
            </div>
          )}
          <div style={{ marginTop: '0.375rem' }}>
            <button className="qi-copy-btn" onClick={handleCopyAddress}>
              {copiedAddr ? 'Copied!' : 'Copy address'}
            </button>
          </div>
          <div className="qi-status">
            <span
              className={`qi-dot qi-dot-${status === 'connected' ? 'connected' : status === 'error' ? 'error' : 'connecting'}`}
            />
            <span style={{ color: 'var(--vocs-color_text3)' }}>
              {status === 'connecting'
                ? 'Connecting...'
                : status === 'connected'
                  ? 'Connected'
                  : 'Connection error'}
            </span>
          </div>
        </div>

        <div className="qi-messages">
          {messages.length === 0 ? (
            <div className="qi-empty">
              Messages will appear here
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`qi-msg qi-msg-${msg.sender}`}
              >
                <span className="qi-msg-label">
                  {msg.sender === 'self' ? 'Live Inbox:' : 'Quickstart App:'}
                </span>
                {msg.text}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="qi-input-row">
          <input
            className="qi-input"
            type="text"
            placeholder={
              status === 'connected'
                ? 'Type a message...'
                : 'Connecting...'
            }
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={status !== 'connected'}
          />
          <button
            className="qi-send-btn"
            onClick={handleSend}
            disabled={status !== 'connected' || !inputVal.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};
