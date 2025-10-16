import { useEffect, useRef, useState } from 'react';

function Utterances() {
  const commentBox = useRef<HTMLDivElement>(null);
  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    // Check if we're on the home page
    setIsHomePage(window.location.pathname === '/');
  }, []);

  useEffect(() => {
    // Don't render utterances on home page
    if (isHomePage) return;
    const getVocsTheme = () => {
      // Check localStorage for Vocs theme
      const stored = localStorage.getItem('vocs.theme');
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

    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('src', 'https://utteranc.es/client.js');
    scriptEl.setAttribute('repo', 'xmtp/docs-xmtp-org');
    scriptEl.setAttribute('issue-term', 'pathname');
    scriptEl.setAttribute('theme', getVocsTheme());
    scriptEl.setAttribute('crossorigin', 'anonymous');
    scriptEl.setAttribute('async', 'true');

    if (commentBox.current) {
      commentBox.current.appendChild(scriptEl);
    }

    // Watch for theme changes in localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'vocs.theme') {
        const iframe = document.querySelector<HTMLIFrameElement>('.utterances-frame');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            { type: 'set-theme', theme: getVocsTheme() },
            'https://utteranc.es'
          );
        }
      }
    };

    // Watch for DOM changes (class/attribute changes)
    const observer = new MutationObserver(() => {
      const iframe = document.querySelector<HTMLIFrameElement>('.utterances-frame');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { type: 'set-theme', theme: getVocsTheme() },
          'https://utteranc.es'
        );
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'data-color-scheme'],
    });

    window.addEventListener('storage', handleStorageChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isHomePage]);

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
