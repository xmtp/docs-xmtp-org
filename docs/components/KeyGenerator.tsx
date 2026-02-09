import * as React from 'react';

function generateRandomHex(bytes: number): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
}

export const KeyGenerator = () => {
  const [mounted, setMounted] = React.useState(false);
  const [walletKey, setWalletKey] = React.useState('');
  const [dbKey, setDbKey] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const generate = () => {
    setWalletKey(`0x${generateRandomHex(32)}`);
    setDbKey(`0x${generateRandomHex(32)}`);
    setCopied(false);
  };

  React.useEffect(() => {
    generate();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const envContent = `XMTP_WALLET_KEY=${walletKey}\nXMTP_DB_ENCRYPTION_KEY=${dbKey}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(envContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        .keygen {
          border: 1px solid var(--vocs-color_border);
          border-radius: var(--vocs-borderRadius_4);
          overflow: hidden;
          margin: 1rem 0;
        }

        .keygen-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 1rem;
          background-color: var(--vocs-color_background2);
          border-bottom: 1px solid var(--vocs-color_border);
        }

        .keygen-title {
          font-size: var(--vocs-fontSize_14);
          font-weight: 500;
          color: var(--vocs-color_text2);
        }

        .keygen-actions {
          display: flex;
          gap: 0.5rem;
        }

        .keygen-btn {
          all: unset;
          font-family: inherit;
          font-size: var(--vocs-fontSize_13);
          font-weight: 500;
          padding: 0.3rem 0.75rem;
          border-radius: var(--vocs-borderRadius_4);
          cursor: pointer;
          transition: all 0.15s ease;
          user-select: none;
        }

        .keygen-btn-generate {
          color: var(--vocs-color_text2);
          background-color: transparent;
          border: 1px solid var(--vocs-color_border);
        }

        .keygen-btn-generate:hover {
          color: var(--vocs-color_text);
          border-color: var(--vocs-color_text3);
        }

        .keygen-btn-copy {
          color: var(--vocs-color_background);
          background-color: var(--vocs-color_text);
        }

        .keygen-btn-copy:hover {
          opacity: 0.85;
        }

        .keygen-btn-copied {
          color: var(--vocs-color_successText);
          background-color: var(--vocs-color_successBackground);
        }

        .keygen-code {
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
      `}</style>
      <div className="keygen">
        <div className="keygen-header">
          <span className="keygen-title">.env</span>
          <div className="keygen-actions">
            <button
              className="keygen-btn keygen-btn-generate"
              onClick={generate}
            >
              Regenerate
            </button>
            <button
              className={`keygen-btn ${copied ? 'keygen-btn-copied' : 'keygen-btn-copy'}`}
              onClick={copyToClipboard}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="keygen-code">{envContent}</div>
      </div>
    </>
  );
};
