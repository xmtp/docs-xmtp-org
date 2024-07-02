import './style.css';

export default function Footer() {
    return (
      <div style={{ textAlign: 'center' }}>
        <div><small><a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" className="ext-link">CC BY 4.0</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="privacy" className="int-link">Privacy policy</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="terms" className="int-link">Terms of service</a></small></div>
        <div><small>Copyright © 2024-present XMTP.</small></div>
      </div>
    )
  }