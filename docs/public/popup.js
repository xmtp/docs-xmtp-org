function shouldShowPopup() {
  // Testing mode - uncomment the line below to force popup to show immediately
  // localStorage.setItem("testingMode", "true");

  // Check if testing mode is enabled
  if (localStorage.getItem('testingMode') === 'true') {
    return true;
  }

  if (localStorage.getItem('popupDismissed') === 'true') return false;

  const now = Date.now();
  const lastVisit = Number(localStorage.getItem('lastVisit') || '0');
  const sessionCount = Number(localStorage.getItem('sessionCount') || '0');

  const THIRTY_MINUTES = 30 * 60 * 1000; // 30 minutes in milliseconds

  // If this is a new session (30+ min later), increment session count
  if (now - lastVisit > THIRTY_MINUTES) {
    localStorage.setItem('sessionCount', (sessionCount + 1).toString());
  }

  // Update last visit time
  localStorage.setItem('lastVisit', now.toString());

  // Show only on the 3rd session
  return sessionCount + 1 === 3;
}

function createPopup() {
  const popup = document.createElement('div');
  popup.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-width: 320px;
      font-family: sans-serif;
      z-index: 1000;
    ">
      <button id="popup-close" aria-label="Don't show again" style="
        position: absolute;
        top: 8px;
        right: 10px;
        border: none;
        background: none;
        font-size: 1.2rem;
        color: #888;
        cursor: pointer;
      ">×</button>
      <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">📣 Got feedback?</h3>
      <p style="margin: 0 0 1rem 0; font-size: 0.9rem; line-height: 1.4;">
        Help us improve the XMTP docs—get a $50 gift card.
      </p>
      <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
        <button id="popup-dismiss" style="
          background: none;
          border: none;
          color: #666;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0.4rem 0.6rem;
        ">Maybe later</button>
        <button id="popup-feedback" style="
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.85rem;
          padding: 0.4rem 0.8rem;
          cursor: pointer;
        ">Give feedback</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  // X: Never show again
  document.getElementById('popup-close')?.addEventListener('click', () => {
    localStorage.setItem('popupDismissed', 'true');
    popup.remove();
  });

  // Maybe later: Reset counters
  document.getElementById('popup-dismiss')?.addEventListener('click', () => {
    localStorage.removeItem('sessionCount');
    localStorage.removeItem('lastVisit');
    popup.remove();
  });

  // Feedback: Never show again
  document.getElementById('popup-feedback')?.addEventListener('click', () => {
    localStorage.setItem('popupDismissed', 'true');
    window.open('https://tally.so/r/wdVqdy', '_blank');
    popup.remove();
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    if (shouldShowPopup()) {
      createPopup();
    }
  });
}

window.addEventListener('beforeunload', () => {
  const popupStillVisible = document.getElementById('popup-feedback') !== null;

  if (popupStillVisible) {
    // Treat it like "Maybe later"
    localStorage.removeItem('sessionCount');
    localStorage.removeItem('lastVisit');
  }
});
