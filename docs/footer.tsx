import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

const UTTERANCES_CONFIG = {
  repo: 'xmtp/docs-xmtp-org',
  issueTerm: 'pathname',
  label: 'comment-docs',
} as const;

// Detect current Vocs theme
function getVocsTheme(): 'github-dark' | 'github-light' {
  // Check localStorage
  try {
    const stored = localStorage.getItem('vocs.theme');
    if (stored === 'dark') return 'github-dark';
    if (stored === 'light') return 'github-light';
  } catch {}

  // Check data-theme attribute
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'dark') return 'github-dark';
  if (theme === 'light') return 'github-light';

  // Check dark class
  if (document.documentElement.classList.contains('dark')) {
    return 'github-dark';
  }

  // Fallback to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'github-dark'
    : 'github-light';
}

function Utterances() {
  const commentBox = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (!commentBox.current || location.pathname === '/') return;

    // Clear container and inject Utterances script
    commentBox.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', UTTERANCES_CONFIG.repo);
    script.setAttribute('issue-term', UTTERANCES_CONFIG.issueTerm);
    script.setAttribute('label', UTTERANCES_CONFIG.label);
    script.setAttribute('theme', getVocsTheme());
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    commentBox.current.appendChild(script);

    // Sync theme changes with Utterances iframe (debounced)
    let timeoutId: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const iframe = document.querySelector<HTMLIFrameElement>('.utterances-frame');
        iframe?.contentWindow?.postMessage(
          { type: 'set-theme', theme: getVocsTheme() },
          'https://utteranc.es'
        );
      }, 100);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [location.pathname]);

  if (location.pathname === '/') return null;

  return (
    <div>
      <hr style={{
        marginBottom: '1em',
        marginLeft: '1.5em',
        marginRight: '1.5em',
        borderColor: 'var(--vocs-color_border)'
      }} />
      <p style={{
        fontSize: '0.9em',
        fontWeight: 400,
        color: 'var(--vocs-color_text2)',
        marginTop: '0.5em',
        marginBottom: '-0.5em',
      }}>
        Building with XMTP and have a question about this documentation? Leave a comment.
      </p>
      <div ref={commentBox} />
    </div>
  );
}

export default function Footer() {
  return (
    <div style={{ textAlign: "center" }}>
      <Utterances />
      <div>
        <small>
          <a
            href="https://xmtp.org/"
            target="_blank"
            style={{
              "--vocs_ExternalLink_iconUrl":
                "url(/.vocs/icons/arrow-diagonal.svg)",
            }}
            className="vocs_Anchor vocs_Link vocs_Link_accent_underlined vocs_ExternalLink"
          >
            XMTP.org
          </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </small>
        <small>
        <a
            href="https://status.xmtp.org/"
            target="_blank"
            style={{
              "--vocs_ExternalLink_iconUrl":
                "url(/.vocs/icons/arrow-diagonal.svg)",
            }}
            className="vocs_Anchor vocs_Link vocs_Link_accent_underlined vocs_ExternalLink"
          >
            XMTP status
          </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </small>
        <small>
        <a
            href="https://xmtp.chat/"
            target="_blank"
            style={{
              "--vocs_ExternalLink_iconUrl":
                "url(/.vocs/icons/arrow-diagonal.svg)",
            }}
            className="vocs_Anchor vocs_Link vocs_Link_accent_underlined vocs_ExternalLink"
          >
            XMTP.chat
          </a>
        </small>
      </div>
      <div>
      <small>
          <a
            href="/privacy"
            className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
          >
            Privacy policy
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a
            href="/terms"
            className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
          >
            Terms of service
          </a>
        </small>
      </div>
      <div>
        <small>         
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            style={{
              "--vocs_ExternalLink_iconUrl":
                "url(/.vocs/icons/arrow-diagonal.svg)",
            }}
            className="vocs_Anchor vocs_Link vocs_Link_accent_underlined vocs_ExternalLink"
          >
            CC BY 4.0
          </a>
          &nbsp;&nbsp;Copyright © 2024-present XMTP.</small>
      </div>
    </div>
  );
}
