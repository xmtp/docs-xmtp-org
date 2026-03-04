import * as React from 'react';
import * as ReactDOM from 'react-dom';

type StepStatus = 'locked' | 'active' | 'running' | 'completed';

interface LogEntry {
  type: 'info' | 'success' | 'error';
  text: string;
  timestamp: Date;
}

const STEP_LABELS = [
  'Install',
  'Create Client',
  'Send Message',
  'Stream Messages',
] as const;

const STEP_CODE = [
  `npm install @xmtp/browser-sdk viem`,
  `import { Client, IdentifierKind } from "@xmtp/browser-sdk";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { toBytes } from "viem";

// Create an ephemeral wallet
const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

// Build the signer
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

// Create the XMTP client
const client = await Client.create(signer, {
  env: "dev",
});

console.log("Client created! Inbox ID:", client.inboxId);`,
  `// Create a DM conversation with the chat buddy
const dm = await client.conversations.createDmWithIdentifier({
  identifier: buddyAddress,
  identifierKind: IdentifierKind.Ethereum,
});

// Send a message
await dm.sendText("Hello from the quickstart!");

console.log("Message sent!");`,
  `// Stream incoming messages
const stream = await dm.stream();

for await (const message of stream) {
  console.log(\`\${message.senderInboxId}: \${message.content}\`);
}`,
];

export const QuickstartWizard = () => {
  const [mounted, setMounted] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [stepStatuses, setStepStatuses] = React.useState<StepStatus[]>([
    'active',
    'locked',
    'locked',
    'locked',
  ]);
  const [logs, setLogs] = React.useState<LogEntry[][]>([[], [], [], []]);
  const [copied, setCopied] = React.useState(false);
  const [buddyOnline, setBuddyOnline] = React.useState(false);
  const [messageInput, setMessageInput] = React.useState('Hello from the quickstart!');
  const [chatMessages, setChatMessages] = React.useState<
    { sender: 'you' | 'buddy'; text: string }[]
  >([]);
  const [splitPercent, setSplitPercent] = React.useState(50);
  const [isDragging, setIsDragging] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [buddyInitializing, setBuddyInitializing] = React.useState(false);
  const [sidebarInput, setSidebarInput] = React.useState('');
  const contentRef = React.useRef<HTMLDivElement>(null);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // Refs for XMTP clients and conversation
  const userClientRef = React.useRef<any>(null);
  const buddyClientRef = React.useRef<any>(null);
  const dmRef = React.useRef<any>(null);
  const buddyStreamRef = React.useRef<any>(null);
  const userStreamRef = React.useRef<any>(null);

  React.useEffect(() => {
    setMounted(true);
    return () => {
      // Cleanup on unmount
      buddyStreamRef.current?.return?.();
      userStreamRef.current?.return?.();
      userClientRef.current?.close?.();
      buddyClientRef.current?.close?.();
    };
  }, []);

  // Auto-scroll sidebar chat when new messages arrive
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Draggable divider handlers
  React.useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      const container = contentRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPercent(Math.min(75, Math.max(25, pct)));
    };

    const onMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  if (!mounted) return null;

  const addLog = (step: number, type: LogEntry['type'], text: string) => {
    setLogs((prev) => {
      const next = [...prev];
      next[step] = [...next[step], { type, text, timestamp: new Date() }];
      return next;
    });
  };

  const setStepStatus = (step: number, status: StepStatus) => {
    setStepStatuses((prev) => {
      const next = [...prev];
      next[step] = status;
      return next;
    });
  };

  const advanceToStep = (step: number) => {
    setCurrentStep(step);
    setStepStatuses((prev) => {
      const next = [...prev];
      next[step] = 'active';
      return next;
    });
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(STEP_CODE[currentStep]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Create the buddy XMTP client (idempotent — safe to call multiple times)
  const initBuddyClient = async () => {
    if (buddyClientRef.current) return buddyClientRef.current;

    const { generatePrivateKey, privateKeyToAccount } = await import(
      'viem/accounts'
    );
    const { toBytes } = await import('viem');
    const { Client, IdentifierKind } = await import('@xmtp/browser-sdk');

    const buddyKey = generatePrivateKey();
    const buddyAccount = privateKeyToAccount(buddyKey);

    const buddySigner = {
      type: 'EOA' as const,
      getIdentifier: () => ({
        identifier: buddyAccount.address.toLowerCase(),
        identifierKind: IdentifierKind.Ethereum,
      }),
      signMessage: async (message: string) => {
        const signature = await buddyAccount.signMessage({ message });
        return toBytes(signature);
      },
    };

    const buddyClient = await Client.create(buddySigner, { env: 'dev' });
    buddyClientRef.current = buddyClient;
    setBuddyOnline(true);
    return buddyClient;
  };

  // Init buddy from badge click — opens sidebar
  const initBuddy = async () => {
    if (buddyOnline || buddyInitializing) {
      setSidebarOpen(true);
      return;
    }
    setBuddyInitializing(true);
    try {
      await initBuddyClient();
      // Start echo if user client already exists
      if (userClientRef.current) {
        startBuddyEcho(buddyClientRef.current, userClientRef.current.inboxId);
      }
      setSidebarOpen(true);
    } catch (err) {
      console.error('Failed to init buddy:', err);
    } finally {
      setBuddyInitializing(false);
    }
  };

  // Step 0: Install (just marks as complete)
  const runInstall = async () => {
    setStepStatus(0, 'running');
    addLog(0, 'info', '$ npm install @xmtp/browser-sdk viem');
    await sleep(600);
    addLog(0, 'success', 'Dependencies installed successfully.');
    setStepStatus(0, 'completed');
    advanceToStep(1);
  };

  // Step 1: Create Client (user only — buddy is created independently or auto-initialized)
  const runCreateClient = async () => {
    setStepStatus(1, 'running');
    try {
      addLog(1, 'info', 'Generating ephemeral wallet...');

      const { generatePrivateKey, privateKeyToAccount } = await import(
        'viem/accounts'
      );
      const { toBytes } = await import('viem');
      const { Client, IdentifierKind } = await import('@xmtp/browser-sdk');

      // User wallet
      const userKey = generatePrivateKey();
      const userAccount = privateKeyToAccount(userKey);
      addLog(1, 'info', `Your wallet: ${userAccount.address}`);

      // Create user signer
      const userSigner = {
        type: 'EOA' as const,
        getIdentifier: () => ({
          identifier: userAccount.address.toLowerCase(),
          identifierKind: IdentifierKind.Ethereum,
        }),
        signMessage: async (message: string) => {
          const signature = await userAccount.signMessage({ message });
          return toBytes(signature);
        },
      };

      addLog(1, 'info', 'Creating your XMTP client...');
      const userClient = await Client.create(userSigner, {
        env: 'dev',
      });
      userClientRef.current = userClient;
      addLog(1, 'success', `Your client created! Inbox ID: ${userClient.inboxId}`);

      // Ensure buddy is initialized (auto-init if user hasn't clicked the badge)
      addLog(1, 'info', 'Connecting chat buddy...');
      const buddyClient = await initBuddyClient();
      startBuddyEcho(buddyClient, userClient.inboxId);
      addLog(1, 'success', 'Chat buddy connected!');

      setStepStatus(1, 'completed');
      advanceToStep(2);
    } catch (err: any) {
      addLog(1, 'error', `Error: ${err.message}`);
      setStepStatus(1, 'active');
    }
  };

  // Start the buddy's echo stream
  const startBuddyEcho = async (buddyClient: any, userInboxId: string) => {
    if (buddyStreamRef.current) return; // Already streaming
    try {
      const stream = buddyClient.conversations.streamAllMessages({
        onValue: async (message: any) => {
          // Only echo messages from the user (not from the buddy itself)
          if (message.senderInboxId === userInboxId) {
            const conversation =
              await buddyClient.conversations.getConversationById(
                message.conversationId
              );
            if (conversation) {
              const echoText = `You said: ${message.content}`;
              await conversation.sendText(echoText);
              // Add echo to sidebar chat
              setChatMessages((prev) => [
                ...prev,
                { sender: 'buddy', text: echoText },
              ]);
            }
          }
        },
        onError: (error: any) => {
          console.error('Buddy stream error:', error);
        },
      });
      buddyStreamRef.current = stream;
    } catch (err) {
      console.error('Failed to start buddy echo:', err);
    }
  };

  // Step 2: Send Message
  const runSendMessage = async () => {
    setStepStatus(2, 'running');
    try {
      const { IdentifierKind } = await import('@xmtp/browser-sdk');
      const userClient = userClientRef.current;
      const buddyClient = buddyClientRef.current;

      if (!userClient || !buddyClient) {
        addLog(2, 'error', 'Clients not initialized. Complete step 2 first.');
        setStepStatus(2, 'active');
        return;
      }

      const buddyIdentifier = buddyClient.accountIdentifier;
      addLog(2, 'info', `Creating DM with chat buddy...`);

      const dm = await userClient.conversations.createDmWithIdentifier({
        identifier: buddyIdentifier.identifier,
        identifierKind: IdentifierKind.Ethereum,
      });
      dmRef.current = dm;
      addLog(2, 'success', `DM conversation created!`);

      addLog(2, 'info', `Sending: "${messageInput}"`);
      await dm.sendText(messageInput);
      addLog(2, 'success', 'Message sent!');

      // Add to sidebar chat
      setChatMessages((prev) => [...prev, { sender: 'you', text: messageInput }]);

      setStepStatus(2, 'completed');
      advanceToStep(3);
    } catch (err: any) {
      addLog(2, 'error', `Error: ${err.message}`);
      setStepStatus(2, 'active');
    }
  };

  // Step 3: Stream Messages
  const runStreamMessages = async () => {
    setStepStatus(3, 'running');
    try {
      const dm = dmRef.current;
      const userClient = userClientRef.current;

      if (!dm || !userClient) {
        addLog(3, 'error', 'Conversation not initialized. Complete step 3 first.');
        setStepStatus(3, 'active');
        return;
      }

      addLog(3, 'info', 'Syncing conversation...');

      // Sync to get the buddy's echo
      await dm.sync();
      const messages = await dm.messages();

      for (const msg of messages) {
        // Skip non-text messages (e.g., group membership changes)
        if (typeof msg.content !== 'string') continue;
        const isUser = msg.senderInboxId === userClient.inboxId;
        const sender = isUser ? 'You' : 'Chat Buddy';
        addLog(3, isUser ? 'info' : 'success', `${sender}: ${msg.content}`);
      }

      setStepStatus(3, 'completed');
      addLog(
        3,
        'success',
        'Quickstart complete! You just sent and received your first XMTP messages.'
      );
    } catch (err: any) {
      addLog(3, 'error', `Error: ${err.message}`);
      setStepStatus(3, 'active');
    }
  };

  // Send a message from the sidebar chat input
  const sendFromSidebar = async () => {
    if (!sidebarInput.trim() || !dmRef.current) return;
    const text = sidebarInput.trim();
    setSidebarInput('');
    setChatMessages((prev) => [...prev, { sender: 'you', text }]);
    try {
      await dmRef.current.sendText(text);
    } catch (err) {
      console.error('Failed to send from sidebar:', err);
    }
  };

  const runStep = () => {
    switch (currentStep) {
      case 0:
        return runInstall();
      case 1:
        return runCreateClient();
      case 2:
        return runSendMessage();
      case 3:
        return runStreamMessages();
    }
  };

  const currentStatus = stepStatuses[currentStep];
  const isRunning = currentStatus === 'running';
  const isCompleted = currentStatus === 'completed';
  const allDone = stepStatuses.every((s) => s === 'completed');

  // Sidebar portal — renders into document.body with fixed positioning
  const sidebar =
    sidebarOpen && typeof document !== 'undefined'
      ? ReactDOM.createPortal(
          <div className="wizard-sidebar">
            <div className="wizard-sidebar-header">
              <div className="wizard-buddy-avatar">CB</div>
              <div className="wizard-buddy-info">
                <span className="wizard-buddy-name">Chat Buddy</span>
                <span className="wizard-buddy-status">
                  <span
                    className="wizard-buddy-status-dot"
                    data-online={buddyOnline ? 'true' : 'false'}
                  />
                  {buddyOnline ? 'Online' : 'Connecting...'}
                </span>
              </div>
              <button
                className="wizard-sidebar-close"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                ✕
              </button>
            </div>
            <div className="wizard-sidebar-body">
              {chatMessages.length === 0 ? (
                <div className="wizard-sidebar-empty">
                  {dmRef.current
                    ? 'Send a message to start chatting'
                    : 'Run the wizard steps to start chatting with the buddy'}
                </div>
              ) : (
                <div className="wizard-chat">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className="wizard-chat-bubble"
                      data-sender={msg.sender}
                    >
                      <div className="wizard-chat-label">
                        {msg.sender === 'you' ? 'You' : 'Chat Buddy'}
                      </div>
                      {msg.text}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>
            {dmRef.current && (
              <div className="wizard-sidebar-footer">
                <input
                  className="wizard-input"
                  type="text"
                  value={sidebarInput}
                  onChange={(e) => setSidebarInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendFromSidebar();
                  }}
                  placeholder="Type a message..."
                />
                <button
                  className="wizard-btn wizard-btn-primary"
                  onClick={sendFromSidebar}
                  disabled={!sidebarInput.trim()}
                  style={{ padding: '0.4rem 0.75rem' }}
                >
                  Send
                </button>
              </div>
            )}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <style>{`
        .wizard {
          border: 1px solid var(--vocs-color_border);
          border-radius: var(--vocs-borderRadius_4);
          overflow: hidden;
          margin: 1.5rem 0;
        }

        .wizard-steps {
          display: flex;
          border-bottom: 1px solid var(--vocs-color_border);
          background-color: var(--vocs-color_background2);
          overflow-x: auto;
        }

        .wizard-step {
          all: unset;
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          font-family: inherit;
          font-size: var(--vocs-fontSize_13);
          font-weight: 500;
          color: var(--vocs-color_text3);
          cursor: pointer;
          transition: all 0.15s ease;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
        }

        .wizard-step:not(:last-child) {
          border-right: 1px solid var(--vocs-color_border);
        }

        .wizard-step[data-status="active"] {
          color: var(--vocs-color_text);
          border-bottom-color: var(--vocs-color_borderAccent);
          background-color: var(--vocs-color_background);
        }

        .wizard-step[data-status="running"] {
          color: var(--vocs-color_textAccent);
          border-bottom-color: var(--vocs-color_borderAccent);
          background-color: var(--vocs-color_background);
        }

        .wizard-step[data-status="completed"] {
          color: var(--vocs-color_text2);
          cursor: pointer;
        }

        .wizard-step[data-status="locked"] {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .wizard-step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          font-size: var(--vocs-fontSize_12);
          font-weight: 600;
          flex-shrink: 0;
          background-color: var(--vocs-color_background3);
          color: var(--vocs-color_text3);
        }

        .wizard-step[data-status="active"] .wizard-step-number,
        .wizard-step[data-status="running"] .wizard-step-number {
          background-color: var(--vocs-color_backgroundAccent);
          color: var(--vocs-color_backgroundAccentText);
        }

        .wizard-step[data-status="completed"] .wizard-step-number {
          background-color: var(--vocs-color_successBackground);
          color: var(--vocs-color_successText);
        }

        .wizard-content {
          display: flex;
          min-height: 300px;
        }

        @media (max-width: 768px) {
          .wizard-content {
            flex-direction: column;
          }
        }

        .wizard-code {
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .wizard-code {
            width: 100% !important;
            border-bottom: 1px solid var(--vocs-color_border);
          }
        }

        .wizard-divider {
          width: 5px;
          cursor: col-resize;
          background-color: var(--vocs-color_border);
          flex-shrink: 0;
          position: relative;
          transition: background-color 0.15s ease;
        }

        .wizard-divider::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 3px;
          height: 24px;
          border-radius: 2px;
          background-color: var(--vocs-color_text3);
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .wizard-divider:hover,
        .wizard-divider[data-dragging="true"] {
          background-color: var(--vocs-color_borderAccent);
        }

        .wizard-divider:hover::after,
        .wizard-divider[data-dragging="true"]::after {
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .wizard-divider {
            display: none;
          }
        }

        .wizard-output {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .wizard-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1rem;
          background-color: var(--vocs-color_background2);
          border-bottom: 1px solid var(--vocs-color_border);
          font-size: var(--vocs-fontSize_13);
          font-weight: 500;
          color: var(--vocs-color_text2);
        }

        .wizard-code-content {
          flex: 1;
          padding: 1rem;
          background-color: var(--vocs-color_background3);
          overflow: auto;
          max-height: 350px;
        }

        .wizard-code-content pre {
          margin: 0;
          font-family: var(--vocs-fontFamily_mono);
          font-size: var(--vocs-fontSize_13);
          line-height: 1.7;
          color: var(--vocs-color_text);
          white-space: pre;
        }

        .wizard-output-content {
          flex: 1;
          padding: 1rem;
          overflow: auto;
          max-height: 350px;
          background-color: var(--vocs-color_background);
        }

        .wizard-log {
          font-family: var(--vocs-fontFamily_mono);
          font-size: var(--vocs-fontSize_12);
          line-height: 1.8;
          margin: 0;
          padding: 0.15rem 0;
        }

        .wizard-log[data-type="info"] {
          color: var(--vocs-color_text2);
        }

        .wizard-log[data-type="success"] {
          color: var(--vocs-color_successText);
        }

        .wizard-log[data-type="error"] {
          color: var(--vocs-color_dangerText);
        }

        .wizard-output-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 200px;
          color: var(--vocs-color_text3);
          font-size: var(--vocs-fontSize_14);
        }

        .wizard-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-top: 1px solid var(--vocs-color_border);
          background-color: var(--vocs-color_background2);
        }

        .wizard-message-input {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          margin-right: 1rem;
        }

        .wizard-input {
          all: unset;
          font-family: var(--vocs-fontFamily_mono);
          font-size: var(--vocs-fontSize_13);
          padding: 0.4rem 0.75rem;
          border: 1px solid var(--vocs-color_border);
          border-radius: var(--vocs-borderRadius_4);
          color: var(--vocs-color_text);
          background-color: var(--vocs-color_background);
          flex: 1;
        }

        .wizard-input:focus {
          border-color: var(--vocs-color_borderAccent);
        }

        .wizard-btn {
          all: unset;
          font-family: inherit;
          font-size: var(--vocs-fontSize_13);
          font-weight: 500;
          padding: 0.4rem 1rem;
          border-radius: var(--vocs-borderRadius_4);
          cursor: pointer;
          transition: all 0.15s ease;
          user-select: none;
          white-space: nowrap;
        }

        .wizard-btn-primary {
          color: var(--vocs-color_backgroundAccentText);
          background-color: var(--vocs-color_backgroundAccent);
        }

        .wizard-btn-primary:hover:not(:disabled) {
          background-color: var(--vocs-color_backgroundAccentHover);
        }

        .wizard-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .wizard-btn-secondary {
          color: var(--vocs-color_text2);
          background-color: transparent;
          border: 1px solid var(--vocs-color_border);
        }

        .wizard-btn-secondary:hover {
          color: var(--vocs-color_text);
          border-color: var(--vocs-color_text3);
        }

        .wizard-buddy-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: var(--vocs-fontSize_12);
          color: var(--vocs-color_text3);
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .wizard-buddy-badge:hover {
          color: var(--vocs-color_text);
        }

        .wizard-buddy-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--vocs-color_text3);
        }

        .wizard-buddy-dot[data-online="true"] {
          background-color: #22c55e;
        }

        @keyframes wizard-spin {
          to { transform: rotate(360deg); }
        }

        .wizard-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid var(--vocs-color_backgroundAccentText);
          border-top-color: transparent;
          border-radius: 50%;
          animation: wizard-spin 0.6s linear infinite;
        }

        .wizard-spinner-small {
          display: inline-block;
          width: 10px;
          height: 10px;
          border: 1.5px solid var(--vocs-color_text3);
          border-top-color: transparent;
          border-radius: 50%;
          animation: wizard-spin 0.6s linear infinite;
        }

        .wizard-done-banner {
          padding: 1rem;
          text-align: center;
          background-color: var(--vocs-color_successBackground);
          color: var(--vocs-color_successText);
          font-size: var(--vocs-fontSize_14);
          font-weight: 500;
          border-top: 1px solid var(--vocs-color_border);
        }

        .wizard-done-links {
          margin-top: 0.5rem;
          font-weight: 400;
          font-size: var(--vocs-fontSize_13);
        }

        .wizard-done-links a {
          color: var(--vocs-color_textAccent);
          text-decoration: underline;
        }

        .wizard-chat {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1rem;
        }

        .wizard-chat-bubble {
          max-width: 80%;
          padding: 0.5rem 0.75rem;
          border-radius: 12px;
          font-size: var(--vocs-fontSize_13);
          line-height: 1.5;
          word-break: break-word;
        }

        .wizard-chat-bubble[data-sender="you"] {
          align-self: flex-end;
          background-color: var(--vocs-color_backgroundAccent);
          color: var(--vocs-color_backgroundAccentText);
          border-bottom-right-radius: 4px;
        }

        .wizard-chat-bubble[data-sender="buddy"] {
          align-self: flex-start;
          background-color: var(--vocs-color_background3);
          color: var(--vocs-color_text);
          border-bottom-left-radius: 4px;
        }

        .wizard-chat-label {
          font-size: var(--vocs-fontSize_11);
          font-weight: 600;
          margin-bottom: 0.15rem;
          color: var(--vocs-color_text3);
        }

        .wizard-chat-bubble[data-sender="buddy"] .wizard-chat-label {
          color: var(--vocs-color_successText);
        }

        .wizard-buddy-avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background-color: var(--vocs-color_backgroundAccent);
          color: var(--vocs-color_backgroundAccentText);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--vocs-fontSize_13);
          font-weight: 700;
          flex-shrink: 0;
        }

        .wizard-buddy-info {
          display: flex;
          flex-direction: column;
        }

        .wizard-buddy-name {
          font-size: var(--vocs-fontSize_13);
          font-weight: 600;
          color: var(--vocs-color_text);
        }

        .wizard-buddy-status {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: var(--vocs-fontSize_11);
          color: var(--vocs-color_text3);
        }

        .wizard-buddy-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--vocs-color_text3);
        }

        .wizard-buddy-status-dot[data-online="true"] {
          background-color: #22c55e;
        }

        /* Sidebar — docks in the right gutter (TOC area) */
        .wizard-sidebar {
          position: fixed;
          top: 64px;
          right: 0;
          width: 300px;
          height: calc(100vh - 64px);
          z-index: 50;
          display: flex;
          flex-direction: column;
          border-left: 1px solid var(--vocs-color_border);
          background-color: var(--vocs-color_background);
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
        }

        @media (max-width: 1280px) {
          .wizard-sidebar {
            display: none;
          }
        }

        .wizard-sidebar-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--vocs-color_border);
          background-color: var(--vocs-color_background2);
        }

        .wizard-sidebar-close {
          all: unset;
          margin-left: auto;
          cursor: pointer;
          color: var(--vocs-color_text3);
          font-size: var(--vocs-fontSize_14);
          padding: 0.25rem;
          line-height: 1;
          border-radius: var(--vocs-borderRadius_4);
          transition: color 0.15s ease;
        }

        .wizard-sidebar-close:hover {
          color: var(--vocs-color_text);
        }

        .wizard-sidebar-body {
          flex: 1;
          overflow-y: auto;
        }

        .wizard-sidebar-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 2rem;
          text-align: center;
          color: var(--vocs-color_text3);
          font-size: var(--vocs-fontSize_13);
          line-height: 1.6;
        }

        .wizard-sidebar-footer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-top: 1px solid var(--vocs-color_border);
          background-color: var(--vocs-color_background2);
        }
      `}</style>

      <div className="wizard">
        {/* Step indicator */}
        <div className="wizard-steps">
          {STEP_LABELS.map((label, i) => (
            <button
              key={i}
              className="wizard-step"
              data-status={stepStatuses[i]}
              onClick={() => {
                if (stepStatuses[i] === 'completed' || stepStatuses[i] === 'active') {
                  setCurrentStep(i);
                }
              }}
            >
              <span className="wizard-step-number">
                {stepStatuses[i] === 'completed' ? '✓' : i + 1}
              </span>
              {label}
            </button>
          ))}
        </div>

        {/* Main content: code + divider + output */}
        <div className="wizard-content" ref={contentRef}>
          {/* Code panel */}
          <div className="wizard-code" style={{ width: `${splitPercent}%` }}>
            <div className="wizard-panel-header">
              <span>Code</span>
              <button
                className={`wizard-btn wizard-btn-secondary`}
                onClick={copyCode}
                style={{
                  padding: '0.2rem 0.6rem',
                  fontSize: 'var(--vocs-fontSize_12)',
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="wizard-code-content">
              <pre>{STEP_CODE[currentStep]}</pre>
            </div>
          </div>

          {/* Draggable divider */}
          <div
            className="wizard-divider"
            data-dragging={isDragging ? 'true' : 'false'}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
          />

          {/* Output panel */}
          <div className="wizard-output">
            <div className="wizard-panel-header">
              <span>Output</span>
              <span className="wizard-buddy-badge" onClick={initBuddy}>
                {buddyInitializing ? (
                  <>
                    <span className="wizard-spinner-small" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <span
                      className="wizard-buddy-dot"
                      data-online={buddyOnline ? 'true' : 'false'}
                    />
                    Chat Buddy: {buddyOnline ? 'online' : 'offline'}
                  </>
                )}
              </span>
            </div>
            <div className="wizard-output-content">
              {logs[currentStep].length === 0 ? (
                <div className="wizard-output-empty">
                  Click &quot;Run Step&quot; to execute this code
                </div>
              ) : (
                logs[currentStep].map((log, i) => (
                  <p key={i} className="wizard-log" data-type={log.type}>
                    {log.text}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer with action button */}
        {allDone ? (
          <div className="wizard-done-banner">
            Quickstart complete! You just sent and received XMTP messages.
            <div className="wizard-done-links">
              <a href="/chat-apps/intro/get-started">Get started building</a>
              {' · '}
              <a href="/chat-apps/sdks/browser">Browser SDK docs</a>
              {' · '}
              <a href="/chat-apps/core-messaging/create-a-client">Create a client</a>
            </div>
          </div>
        ) : (
          <div className="wizard-footer">
            {currentStep === 2 ? (
              <div className="wizard-message-input">
                <input
                  className="wizard-input"
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  disabled={isRunning || isCompleted}
                />
              </div>
            ) : (
              <div />
            )}
            <button
              className="wizard-btn wizard-btn-primary"
              onClick={runStep}
              disabled={isRunning || isCompleted}
            >
              {isRunning ? (
                <span className="wizard-spinner" />
              ) : isCompleted ? (
                'Completed'
              ) : (
                `Run Step ${currentStep + 1}`
              )}
            </button>
          </div>
        )}
      </div>

      {/* Chat Buddy sidebar — rendered as a portal into document.body */}
      {sidebar}
    </>
  );
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
