import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
// Relative path needed because usePageData isn't in vocs package exports
import { usePageData } from '../../node_modules/vocs/_lib/app/hooks/usePageData.js';

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginLeft: '0.2em', flexShrink: 0, opacity: 0.8 }}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export default function PageActions() {
  const { content } = usePageData();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const isHomepage = location.pathname === '/';

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(content ?? '');
    setCopied(true);
  }, [content]);

  const pageURL = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return window.location.origin + location.pathname;
  }, [location.pathname]);

  if (isHomepage) return null;

  const prompt = `Please research and analyze this page: ${pageURL} so I can ask you questions about it.`;
  const encodedPrompt = encodeURIComponent(prompt);

  const chatGPTLink = `https://chatgpt.com?hints=search&q=${encodedPrompt}`;
  const claudeLink = `https://claude.ai/new?q=${encodedPrompt}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5em', marginTop: '0.25em', marginBottom: '0.75em' }}>
      <button
        type="button"
        onClick={copy}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontSize: '0.8125rem',
          color: copied ? 'var(--vocs-color_textAccent)' : 'var(--vocs-color_text3)',
          fontFamily: 'inherit',
        }}
      >
        {copied ? 'Copied!' : 'Copy page'}
      </button>
      <span style={{ color: 'var(--vocs-color_text4)', fontSize: '0.8125rem', userSelect: 'none' }}>|</span>
      <a
        href={chatGPTLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: '0.8125rem',
          color: 'var(--vocs-color_text3)',
          textDecoration: 'none',
        }}
      >
        Ask in ChatGPT<ExternalLinkIcon />
      </a>
      <span style={{ color: 'var(--vocs-color_text4)', fontSize: '0.8125rem', userSelect: 'none' }}>|</span>
      <a
        href={claudeLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: '0.8125rem',
          color: 'var(--vocs-color_text3)',
          textDecoration: 'none',
        }}
      >
        Ask in Claude<ExternalLinkIcon />
      </a>
    </div>
  );
}
