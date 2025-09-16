export default function Footer() {
  return (
    <div style={{ textAlign: "center" }}>
      <div>
        <small>
          <a
            href="https://xmtp.org/"
            target="_blank"
            style={{
              "--vocs_ExternalLink_iconUrl":
                "url(/.vocs/icons/arrow-diagonal.svg)",
            }}
            className="vocs_Anchor vocs_Link vocs_Link_accent_underlined vocs_ExternalLink">
            XMTP.org
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </small>
        <small>
          <a
            href="https://status.xmtp.org/"
            target="_blank"
            style={{
              "--vocs_ExternalLink_iconUrl":
                "url(/.vocs/icons/arrow-diagonal.svg)",
            }}
            className="vocs_Anchor vocs_Link vocs_Link_accent_underlined vocs_ExternalLink">
            XMTP status
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </small>
        <small>
          <a
            href="https://xmtp.chat/"
            target="_blank"
            style={{
              "--vocs_ExternalLink_iconUrl":
                "url(/.vocs/icons/arrow-diagonal.svg)",
            }}
            className="vocs_Anchor vocs_Link vocs_Link_accent_underlined vocs_ExternalLink">
            XMTP.chat
          </a>
        </small>
      </div>
      <div>
        <small>
          <a
            href="/privacy"
            className="vocs_Anchor vocs_Link vocs_Link_accent_underlined">
            Privacy policy
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a
            href="/terms"
            className="vocs_Anchor vocs_Link vocs_Link_accent_underlined">
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
            className="vocs_Anchor vocs_Link vocs_Link_accent_underlined vocs_ExternalLink">
            CC BY 4.0
          </a>
          &nbsp;&nbsp;Copyright © 2024-present XMTP.
        </small>
      </div>
    </div>
  );
}
