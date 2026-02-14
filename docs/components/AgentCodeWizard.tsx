import * as React from 'react';
// @ts-ignore — Vite raw import
import template from './agent-code.template?raw';
import { codeToHtml } from 'shiki/bundle/web';

function generateRandomHex(bytes: number): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
}

type Network = 'dev' | 'production' | 'local';

const networkLabels: Record<Network, string> = {
  production: 'production',
  dev: 'development',
  local: 'local',
};

const networkDescriptions: Record<Network, string> = {
  production:
    'Live network — your agent is discoverable on apps like Base and World',
  dev: 'XMTP test network — best for development and testing',
  local: 'Localhost — Local XMTP backend running in Docker',
};

function renderTemplate(
  tpl: string,
  vars: Record<string, string>,
  flags: Record<string, boolean>
): string {
  // Replace {{#flag}}...{{/flag}} blocks
  let result = tpl.replace(
    /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
    (_, flag, content) => (flags[flag] ? content : '')
  );
  // Replace {{var}} placeholders
  result = result.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
  // Collapse 3+ consecutive newlines into 2
  result = result.replace(/\n{3,}/g, '\n\n');
  return result.trim();
}

function buildCode(walletKey: string, network: Network): string {
  return renderTemplate(template, { walletKey, network }, {});
}

export const AgentCodeWizard = () => {
  const [mounted, setMounted] = React.useState(false);
  const [walletKey, setWalletKey] = React.useState('');
  const [network, setNetwork] = React.useState<Network>('production');
  const [copied, setCopied] = React.useState(false);
  const [highlightedHtml, setHighlightedHtml] = React.useState('');

  const generate = () => {
    setWalletKey(`0x${generateRandomHex(32)}`);
    setCopied(false);
  };

  React.useEffect(() => {
    generate();
    setMounted(true);
  }, []);

  const code = buildCode(walletKey, network);

  React.useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    codeToHtml(code, {
      lang: 'typescript',
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
    }).then((html) => {
      if (!cancelled) setHighlightedHtml(html);
    });
    return () => {
      cancelled = true;
    };
  }, [code, mounted]);

  if (!mounted) return null;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        .wizard {
          border: 1px solid var(--vocs-color_border);
          border-radius: var(--vocs-borderRadius_4);
          overflow: hidden;
          margin: 1rem 0;
        }

        .wizard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 1rem;
          background-color: var(--vocs-color_background2);
          border-bottom: 1px solid var(--vocs-color_border);
        }

        .wizard-title {
          font-size: var(--vocs-fontSize_14);
          font-weight: 500;
          color: var(--vocs-color_text2);
        }

        .wizard-actions {
          display: flex;
          gap: 0.5rem;
        }

        .wizard-btn {
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

        .wizard-btn-generate {
          color: var(--vocs-color_text2);
          background-color: transparent;
          border: 1px solid var(--vocs-color_border);
        }

        .wizard-btn-generate:hover {
          color: var(--vocs-color_text);
          border-color: var(--vocs-color_text3);
        }

        .wizard-btn-copy {
          color: var(--vocs-color_background);
          background-color: var(--vocs-color_text);
        }

        .wizard-btn-copy:hover {
          opacity: 0.85;
        }

        .wizard-btn-copied {
          color: var(--vocs-color_successText);
          background-color: var(--vocs-color_successBackground);
        }

        .wizard-network {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: var(--vocs-color_background2);
          border-bottom: 1px solid var(--vocs-color_border);
        }

        .wizard-network-label {
          font-size: var(--vocs-fontSize_13);
          color: var(--vocs-color_text3);
          margin-right: 0.25rem;
        }

        .wizard-network-desc {
          width: 100%;
          font-size: var(--vocs-fontSize_13);
          color: var(--vocs-color_text3);
          margin: 0;
          padding: 0 0 0.25rem;
        }

        .wizard-network-btn {
          all: unset;
          font-family: var(--vocs-fontFamily_mono);
          font-size: var(--vocs-fontSize_13);
          padding: 0.2rem 0.6rem;
          border-radius: var(--vocs-borderRadius_4);
          cursor: pointer;
          transition: all 0.15s ease;
          user-select: none;
          color: var(--vocs-color_text3);
          border: 1px solid var(--vocs-color_border);
        }

        .wizard-network-btn:hover {
          color: var(--vocs-color_text);
          border-color: var(--vocs-color_text3);
        }

        .wizard-network-btn-active {
          color: var(--vocs-color_background);
          background-color: var(--vocs-color_text);
          border-color: var(--vocs-color_text);
        }

        .wizard-network-btn-active:hover {
          opacity: 0.85;
        }

        .wizard-code {
          margin: 0;
          overflow-x: auto;
        }

        .wizard-code pre {
          margin: 0;
          padding: 1rem;
          font-size: var(--vocs-fontSize_13);
          line-height: 1.7;
        }

        .wizard-code code {
          font-family: var(--vocs-fontFamily_mono);
        }
      `}</style>
      <div className="wizard">
        <div className="wizard-header">
          <span className="wizard-title">agent.ts</span>
          <div className="wizard-actions">
            <button
              className="wizard-btn wizard-btn-generate"
              onClick={generate}
            >
              Regenerate
            </button>
            <button
              className={`wizard-btn ${copied ? 'wizard-btn-copied' : 'wizard-btn-copy'}`}
              onClick={copyToClipboard}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="wizard-network">
          <span className="wizard-network-label">Network:</span>
          {(['production', 'dev', 'local'] as const).map((n) => (
            <button
              key={n}
              className={`wizard-network-btn ${network === n ? 'wizard-network-btn-active' : ''}`}
              onClick={() => {
                setNetwork(n);
                setCopied(false);
              }}
            >
              {networkLabels[n]}
            </button>
          ))}
          <p className="wizard-network-desc">{networkDescriptions[network]}</p>
        </div>
        <div
          className="wizard-code"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </div>
    </>
  );
};
