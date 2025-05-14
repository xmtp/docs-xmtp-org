// public/popup.js

function createPopup() {
  const popup = document.createElement("div");
  popup.innerHTML = `
    <div style="position: fixed; bottom: 20px; right: 20px; background: white; border: 1px solid #ccc; padding: 1rem; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
      <p>This is your test popup! 🎉</p>
      <button id="close-popup">Close</button>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById("close-popup")?.addEventListener("click", () => {
    popup.remove();
  });
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    createPopup(); // always show popup on page load
  });
}