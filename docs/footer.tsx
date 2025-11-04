import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

const UTTERANCES_CONFIG = {
  repo: 'xmtp/docs-xmtp-org',
  issueTerm: 'pathname',
  label: 'comment-docs',
} as const;

function Utterances() {
  const commentBox = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // Don't render utterances on home page
    if (location.pathname === '/') {
      // Clear any existing utterances when navigating to home page
      if (commentBox.current) {
        commentBox.current.innerHTML = '';
      }
      return;
    }

    const getVocsTheme = () => {
      // Check localStorage for Vocs theme
      let stored: string | null = null;
      try {
        stored = localStorage.getItem('vocs.theme');
      } catch {}
      if (stored === 'dark') return 'github-dark';
      if (stored === 'light') return 'github-light';

      // Check data attribute on html element
      const htmlTheme = document.documentElement.getAttribute('data-theme');
      if (htmlTheme === 'dark') return 'github-dark';
      if (htmlTheme === 'light') return 'github-light';

      // Check class on html element
      if (document.documentElement.classList.contains('dark')) return 'github-dark';

      // Fallback to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'github-dark'
        : 'github-light';
    };

    // Clear any existing utterances before injecting new script
    if (commentBox.current) {
      commentBox.current.innerHTML = '';
    }

    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('src', 'https://utteranc.es/client.js');
    scriptEl.setAttribute('repo', UTTERANCES_CONFIG.repo);
    scriptEl.setAttribute('issue-term', UTTERANCES_CONFIG.issueTerm);
    scriptEl.setAttribute('label', UTTERANCES_CONFIG.label);
    scriptEl.setAttribute('theme', getVocsTheme());
    scriptEl.setAttribute('crossorigin', 'anonymous');
    scriptEl.setAttribute('async', 'true');

    if (commentBox.current) {
      commentBox.current.appendChild(scriptEl);
    }

    // Watch for DOM changes (class/attribute changes) when Vocs theme toggles
    let debounceTimer: NodeJS.Timeout | null = null;
    const observer = new MutationObserver(() => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        const iframe = document.querySelector<HTMLIFrameElement>('.utterances-frame');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            { type: 'set-theme', theme: getVocsTheme() },
            'https://utteranc.es'
          );
        }
      }, 100);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'data-color-scheme'],
    });

    return () => {
      observer.disconnect();
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [location.pathname]);

  // Don't render on home page
  if (isHomePage) return null;

  return <div ref={commentBox} />;
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
