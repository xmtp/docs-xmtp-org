import * as React from 'react';

const AGENT_ADDRESS = '0xf9244662f952d6ef83bd0719ddb5a27fbb2fe1bc';

type OutputLine = {
  text: string;
  type: 'command' | 'output' | 'error' | 'info';
};

const bytesToHex = (bytes: Uint8Array, prefix = false): string => {
  const hex = Array.from(bytes, (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');
  return prefix ? '0x' + hex : hex;
};

const formatTimestamp = (ns: bigint | string | undefined): string => {
  if (ns == null) return 'Unknown';
  const ms = Number(BigInt(ns) / BigInt(1_000_000));
  return new Date(ms)
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d{3}Z$/, '');
};

const formatObject = (
  obj: Record<string, string>,
  indent = 2,
): string => {
  const entries = Object.entries(obj).filter(
    ([, v]) => v != null && v !== '',
  );
  if (entries.length === 0) return '';
  const maxKeyLen = Math.max(...entries.map(([k]) => k.length));
  return entries
    .map(
      ([key, value]) =>
        `${' '.repeat(indent)}${key.padEnd(maxKeyLen)}  ${value}`,
    )
    .join('\n');
};

const formatTable = (rows: Record<string, string>[]): string => {
  if (rows.length === 0) return '(empty)';
  const keys = Object.keys(rows[0]);
  const widths = keys.map((key) =>
    Math.max(key.length, ...rows.map((row) => (row[key] || '').length)),
  );
  const header = keys
    .map((key, i) => key.padEnd(widths[i]))
    .join('  ');
  const separator = widths.map((w) => '-'.repeat(w)).join('  ');
  const body = rows
    .map((row) =>
      keys
        .map((key, i) => (row[key] || '').padEnd(widths[i]))
        .join('  '),
    )
    .join('\n');
  return `${header}\n${separator}\n${body}`;
};

export const TerminalQuickstart = () => {
  const [mounted, setMounted] = React.useState(false);
  const [lines, setLines] = React.useState<OutputLine[]>([
    {
      text: 'XMTP CLI (browser). Type "help" for available commands.',
      type: 'info',
    },
  ]);
  const [input, setInput] = React.useState('');
  const [isRunning, setIsRunning] = React.useState(false);
  const [lastConvId, setLastConvId] = React.useState<string | null>(
    null,
  );
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(
    null,
  );

  const clientRef = React.useRef<any>(null);
  const walletRef = React.useRef<any>(null);
  const conversationsRef = React.useRef<Map<string, any>>(new Map());
  const outputRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const mountedRef = React.useRef(true);
  const historyRef = React.useRef<string[]>([]);
  const historyIndexRef = React.useRef(-1);

  React.useEffect(() => {
    setMounted(true);
    return () => {
      mountedRef.current = false;
      clientRef.current?.close?.();
    };
  }, []);

  React.useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  if (!mounted) return null;

  const addLines = (newLines: OutputLine[]) => {
    if (mountedRef.current) {
      setLines((prev) => [...prev, ...newLines]);
    }
  };

  const addOutput = (text: string) =>
    addLines([{ text, type: 'output' }]);
  const addError = (text: string) =>
    addLines([{ text, type: 'error' }]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      if (mountedRef.current) setCopiedIndex(null);
    }, 1500);
  };

  const guideCommands: { cmd: string; hint?: string }[] = [
    { cmd: 'init' },
    { cmd: 'client info' },
    { cmd: `conversations create-dm ${AGENT_ADDRESS}` },
    {
      cmd: lastConvId
        ? `conversation send-text ${lastConvId} "gm"`
        : 'conversation send-text <id> "gm"',
      hint: lastConvId ? undefined : 'use the id from step 3',
    },
    {
      cmd: lastConvId
        ? `conversation messages ${lastConvId}`
        : 'conversation messages <id>',
      hint: lastConvId ? undefined : "see the agent's reply",
    },
  ];

  // --- Command handlers ---

  const handleHelp = () => {
    addLines([
      { text: 'Available commands:', type: 'output' },
      { text: '\u00A0', type: 'output' },
      {
        text: '  init                                  Generate keys and connect to XMTP',
        type: 'output',
      },
      {
        text: '  client info                           Show client details',
        type: 'output',
      },
      {
        text: '  conversations create-dm <address>     Create a DM conversation',
        type: 'output',
      },
      {
        text: '  conversation send-text <id> "msg"     Send a text message',
        type: 'output',
      },
      {
        text: '  conversation messages <id>            List messages in a conversation',
        type: 'output',
      },
      {
        text: '  clear                                 Clear terminal',
        type: 'output',
      },
      {
        text: '  help                                  Show this help',
        type: 'output',
      },
    ]);
  };

  const handleInit = async () => {
    addOutput('Generating keys...');

    const { secp256k1 } = await import('@noble/curves/secp256k1');
    const { keccak_256 } = await import('@noble/hashes/sha3');

    const privateKey = crypto.getRandomValues(new Uint8Array(32));
    const publicKey = secp256k1.getPublicKey(privateKey, false);
    const addressBytes = keccak_256(publicKey.slice(1)).slice(-20);
    const address = '0x' + bytesToHex(addressBytes);

    const dbKeyHex = bytesToHex(
      crypto.getRandomValues(new Uint8Array(32)),
    );

    walletRef.current = { privateKey, address, secp256k1, keccak_256 };

    addLines([
      {
        text: `XMTP_WALLET_KEY=${bytesToHex(privateKey, true)}`,
        type: 'output',
      },
      {
        text: `XMTP_DB_ENCRYPTION_KEY=${dbKeyHex}`,
        type: 'output',
      },
      { text: 'XMTP_ENV=dev', type: 'output' },
      { text: '\u00A0', type: 'output' },
      {
        text: 'Connecting to XMTP dev network...',
        type: 'output',
      },
    ]);

    const { Client, IdentifierKind } = await import(
      '@xmtp/browser-sdk'
    );

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
    addOutput('Connected.');
  };

  const handleClientInfo = () => {
    if (!clientRef.current) {
      addError('Not connected. Run "init" first.');
      return;
    }
    const client = clientRef.current;
    const wallet = walletRef.current;

    addLines([
      { text: 'Client', type: 'output' },
      { text: '\u00A0', type: 'output' },
      {
        text: formatObject({
          address: wallet.address,
          inboxId: client.inboxId || '',
          installationId: client.installationId || '',
          isRegistered: 'true',
          env: 'dev',
        }),
        type: 'output',
      },
    ]);
  };

  const handleCreateDm = async (peerAddress: string) => {
    if (!clientRef.current) {
      addError('Not connected. Run "init" first.');
      return;
    }
    if (!peerAddress) {
      addError('Usage: conversations create-dm <address>');
      return;
    }

    const { IdentifierKind } = await import('@xmtp/browser-sdk');
    const client = clientRef.current;

    const dm = await client.conversations.createDmWithIdentifier({
      identifier: peerAddress,
      identifierKind: IdentifierKind.Ethereum,
    });

    conversationsRef.current.set(dm.id, dm);
    setLastConvId(dm.id);

    let peerInboxId = '';
    try {
      peerInboxId = await dm.peerInboxId();
    } catch {
      // peerInboxId not available
    }

    addOutput(
      formatObject({
        id: dm.id,
        peerInboxId,
        createdAt: formatTimestamp(dm.createdAtNs),
      }),
    );
  };

  const handleSendText = async (convId: string, text: string) => {
    if (!clientRef.current) {
      addError('Not connected. Run "init" first.');
      return;
    }
    if (!convId || !text) {
      addError('Usage: conversation send-text <id> "message"');
      return;
    }

    const conv = conversationsRef.current.get(convId);
    if (!conv) {
      addError(`Conversation not found: ${convId}`);
      return;
    }

    const messageId = await conv.sendText(text);

    addOutput(
      formatObject({
        success: 'true',
        messageId: messageId != null ? String(messageId) : '',
        text,
      }),
    );
  };

  const handleMessages = async (convId: string) => {
    if (!clientRef.current) {
      addError('Not connected. Run "init" first.');
      return;
    }
    if (!convId) {
      addError('Usage: conversation messages <id>');
      return;
    }

    const conv = conversationsRef.current.get(convId);
    if (!conv) {
      addError(`Conversation not found: ${convId}`);
      return;
    }

    await conv.sync();
    const messages = await conv.messages();

    if (!messages || messages.length === 0) {
      addOutput('(no messages)');
      return;
    }

    const rows = messages.map((m: any) => ({
      senderInboxId:
        (m.senderInboxId || '').substring(0, 12) + '...',
      content:
        typeof m.content === 'string'
          ? m.content
          : JSON.stringify(m.content),
      sentAt: formatTimestamp(m.sentAtNs),
    }));

    addOutput(formatTable(rows));
  };

  // --- Command dispatcher ---

  const handleCommand = async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    // clear doesn't echo itself
    if (trimmed === 'clear') {
      setLines([]);
      return;
    }

    // Echo the command
    setLines((prev) => [
      ...prev,
      { text: `$ xmtp ${trimmed}`, type: 'command' as const },
    ]);
    setIsRunning(true);

    try {
      if (trimmed === 'help' || trimmed === '--help') {
        handleHelp();
      } else if (trimmed === 'init') {
        await handleInit();
      } else if (trimmed === 'client info') {
        handleClientInfo();
      } else if (trimmed.startsWith('conversations create-dm')) {
        const address = trimmed
          .slice('conversations create-dm'.length)
          .trim();
        await handleCreateDm(address);
      } else if (trimmed.startsWith('conversation send-text')) {
        const rest = trimmed
          .slice('conversation send-text'.length)
          .trim();
        const spaceIdx = rest.indexOf(' ');
        if (spaceIdx === -1) {
          addError(
            'Usage: conversation send-text <id> "message"',
          );
        } else {
          const id = rest.slice(0, spaceIdx);
          let text = rest.slice(spaceIdx + 1).trim();
          // Strip surrounding quotes
          if (
            (text.startsWith('"') && text.endsWith('"')) ||
            (text.startsWith("'") && text.endsWith("'"))
          ) {
            text = text.slice(1, -1);
          }
          await handleSendText(id, text);
        }
      } else if (trimmed.startsWith('conversation messages')) {
        const rest = trimmed
          .slice('conversation messages'.length)
          .trim();
        const id = rest.split(/\s+/)[0];
        if (!id) {
          addError('Usage: conversation messages <id>');
        } else {
          await handleMessages(id);
        }
      } else {
        addError(
          `Unknown command: ${trimmed}\nType "help" for available commands.`,
        );
      }
    } catch (e: any) {
      addError(`Error: ${e.message}`);
    } finally {
      if (mountedRef.current) setIsRunning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRunning || !input.trim()) return;
    const cmd = input;
    historyRef.current.push(cmd);
    historyIndexRef.current = -1;
    setInput('');
    handleCommand(cmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const history = historyRef.current;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex =
        historyIndexRef.current === -1
          ? history.length - 1
          : Math.max(0, historyIndexRef.current - 1);
      historyIndexRef.current = newIndex;
      setInput(history[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndexRef.current === -1) return;
      const newIndex = historyIndexRef.current + 1;
      if (newIndex >= history.length) {
        historyIndexRef.current = -1;
        setInput('');
      } else {
        historyIndexRef.current = newIndex;
        setInput(history[newIndex]);
      }
    }
  };

  return (
    <>
      <style>{`
        .tq-window {
          border: 1px solid var(--vocs-color_border);
          border-radius: 8px;
          overflow: hidden;
          margin: 1.5rem 0;
          font-family: 'SF Mono', 'Monaco', 'Menlo', 'Courier New', monospace;
          font-size: 13px;
          line-height: 1.5;
        }

        .tq-chrome {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #2d2d2d;
          border-bottom: 1px solid #1a1a1a;
        }

        .tq-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .tq-dot-red { background: #ff5f56; }
        .tq-dot-yellow { background: #ffbd2e; }
        .tq-dot-green { background: #27c93f; }

        .tq-body {
          background: #1a1a1a;
          color: #e0e0e0;
          padding: 12px;
          max-height: 400px;
          overflow-y: auto;
          cursor: text;
        }

        .tq-line {
          white-space: pre-wrap;
          word-break: break-all;
          min-height: 1em;
        }

        .tq-command {
          color: #27c93f;
        }

        .tq-output {
          color: #e0e0e0;
        }

        .tq-error {
          color: #ff5f56;
        }

        .tq-info {
          color: #999;
        }

        .tq-input-line {
          display: flex;
          align-items: center;
          margin: 0;
          padding: 0;
          border: none;
          background: none;
        }

        .tq-prompt {
          color: #27c93f;
          white-space: pre;
        }

        .tq-input {
          all: unset;
          flex: 1;
          color: #e0e0e0;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          caret-color: #27c93f;
        }

        .tq-input:disabled {
          opacity: 0.5;
        }

        .tq-guide {
          margin-top: 1rem;
          padding: 1rem;
          border: 1px solid var(--vocs-color_border);
          border-radius: var(--vocs-borderRadius_4);
          background: var(--vocs-color_background2);
        }

        .tq-guide-title {
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-size: var(--vocs-fontSize_14);
        }

        .tq-guide-list {
          margin: 0;
          padding-left: 1.5rem;
          list-style: none;
          counter-reset: guide-step;
        }

        .tq-guide-item {
          counter-increment: guide-step;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.5rem 0;
          font-size: var(--vocs-fontSize_13);
        }

        .tq-guide-item::before {
          content: counter(guide-step) ".";
          color: var(--vocs-color_text3);
          font-size: var(--vocs-fontSize_13);
          min-width: 1.2em;
        }

        .tq-guide-cmd {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--vocs-color_background3);
          padding: 0.2rem 0.5rem;
          border-radius: var(--vocs-borderRadius_4);
          font-family: var(--vocs-fontFamily_mono);
          font-size: var(--vocs-fontSize_13);
          line-height: 1.6;
          max-width: 100%;
          overflow-x: auto;
        }

        .tq-guide-cmd code {
          white-space: nowrap;
          font-size: inherit;
        }

        .tq-guide-copy {
          all: unset;
          cursor: pointer;
          color: var(--vocs-color_text3);
          padding: 2px;
          border-radius: 3px;
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
          transition: color 0.15s;
        }

        .tq-guide-copy:hover {
          color: var(--vocs-color_text);
        }

        .tq-guide-copy-done {
          color: var(--vocs-color_successText);
        }

        .tq-guide-copy-done:hover {
          color: var(--vocs-color_successText);
        }

        .tq-guide-hint {
          color: var(--vocs-color_text3);
          font-size: var(--vocs-fontSize_13);
          white-space: nowrap;
        }
      `}</style>

      <div className="tq-window">
        <div className="tq-chrome">
          <span className="tq-dot tq-dot-red" />
          <span className="tq-dot tq-dot-yellow" />
          <span className="tq-dot tq-dot-green" />
        </div>
        <div
          className="tq-body"
          ref={outputRef}
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <div key={i} className={`tq-line tq-${line.type}`}>
              {line.text || '\u00A0'}
            </div>
          ))}
          <form
            className="tq-input-line"
            onSubmit={handleSubmit}
          >
            <span className="tq-prompt">$ xmtp </span>
            <input
              ref={inputRef}
              className="tq-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isRunning}
              spellCheck={false}
              autoComplete="off"
            />
          </form>
        </div>
      </div>

      <div className="tq-guide">
        <div className="tq-guide-title">
          Try these commands in order:
        </div>
        <ol className="tq-guide-list">
          {guideCommands.map((item, i) => (
            <li key={i} className="tq-guide-item">
              <span className="tq-guide-cmd">
                <code>{item.cmd}</code>
                <button
                  className={`tq-guide-copy${copiedIndex === i ? ' tq-guide-copy-done' : ''}`}
                  onClick={() => handleCopy(item.cmd, i)}
                  title={
                    copiedIndex === i
                      ? 'Copied!'
                      : 'Copy command'
                  }
                >
                  {copiedIndex === i ? (
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
                  ) : (
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
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                      />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  )}
                </button>
              </span>
              {item.hint && (
                <span className="tq-guide-hint">
                  — {item.hint}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
};
