import { useEffect } from "react";

const STORAGE_KEY = "xmtp-docs:tab-prefs";

/**
 * Stored format: Array of { label, siblings }
 * - label: the selected tab text (e.g. "React Native")
 * - siblings: all tab labels in that group (e.g. ["Browser","Node","React Native","Kotlin","Swift"])
 * A pref only applies to a tablist whose labels overlap with the stored siblings.
 */
type Pref = { label: string; siblings: string[] };

function getPrefs(): Pref[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    // Handle migration from old string[] format (validate entire array)
    if (parsed.length > 0 && parsed.every((item) => typeof item === "string")) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    // Validate that parsed is an array of Pref objects
    const isValidPrefArray = parsed.every((item) => {
      if (!item || typeof item !== "object") return false;
      const maybePref = item as { label?: unknown; siblings?: unknown };
      if (typeof maybePref.label !== "string") return false;
      if (!Array.isArray(maybePref.siblings)) return false;
      return maybePref.siblings.every((s) => typeof s === "string");
    });

    if (!isValidPrefArray) {
      return [];
    }

    return parsed as Pref[];
  } catch {
    return [];
  }
}

function savePref(label: string, siblings: string[]) {
  // Remove any existing pref whose siblings overlap with this group
  const prefs = getPrefs().filter(
    (p) => !p.siblings.some((s) => siblings.includes(s))
  );
  prefs.unshift({ label, siblings });
  if (prefs.length > 10) prefs.length = 10;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage errors (e.g., quota exceeded or disabled storage)
  }
}

/** Activate a Radix tab trigger — Radix listens on mousedown, not click. */
function activateTab(tab: HTMLElement) {
  tab.dispatchEvent(new MouseEvent("mousedown", { button: 0, bubbles: true }));
  tab.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
}

function getTabLabels(tablist: Element): string[] {
  return Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]'))
    .map((t) => t.textContent?.trim() || "")
    .filter((label) => label !== "");
}

function applyPrefsToTablist(tablist: Element, prefs: Pref[]) {
  const tabs = Array.from(
    tablist.querySelectorAll<HTMLElement>('[role="tab"]')
  );
  if (tabs.length === 0) return false; // not ready yet

  const labels = tabs.map((t) => t.textContent?.trim() || "");

  // Find the first pref whose siblings overlap with this tablist's labels
  for (const pref of prefs) {
    if (!pref.siblings.some((s) => labels.includes(s))) continue;
    const match = tabs.find(
      (t) =>
        t.textContent?.trim() === pref.label &&
        t.getAttribute("data-state") !== "active"
    );
    if (match) {
      activateTab(match);
    }
    return true; // processed (whether or not we activated — the group matched)
  }

  return true; // no matching pref, but tablist is ready
}

export default function TabSync() {
  useEffect(() => {
    let syncing = false;
    const applied = new WeakSet<Element>();

    function applyPrefsToNewTablists() {
      const prefs = getPrefs();
      if (prefs.length === 0) return;

      document.querySelectorAll('[role="tablist"]').forEach((tl) => {
        if (applied.has(tl)) return;
        const ready = applyPrefsToTablist(tl, prefs);
        if (ready) applied.add(tl); // only mark done if tabs were rendered
      });
    }

    function handleMouseDown(e: MouseEvent) {
      if (syncing) return;

      const target = (e.target as HTMLElement)?.closest?.(
        '[role="tab"]'
      ) as HTMLElement | null;
      if (!target) return;

      const tablist = target.closest('[role="tablist"]');
      if (!tablist) return;

      const label = target.textContent?.trim();
      if (!label) return;

      const siblings = getTabLabels(tablist);
      savePref(label, siblings);

      // Sync other tablists on the page that share labels with this group
      syncing = true;
      try {
        document.querySelectorAll('[role="tablist"]').forEach((tl) => {
          if (tl === tablist) return;
          const tlLabels = getTabLabels(tl);
          if (!tlLabels.includes(label)) return;

          const match = Array.from(
            tl.querySelectorAll<HTMLElement>('[role="tab"]')
          ).find(
            (t) =>
              t.textContent?.trim() === label &&
              t.getAttribute("data-state") !== "active"
          );
          if (match) activateTab(match);
        });
      } finally {
        syncing = false;
      }
    }

    document.addEventListener("mousedown", handleMouseDown, true);

    // Apply on mount
    applyPrefsToNewTablists();

    // MutationObserver for new tablists (SPA navigation or lazy rendering).
    // WeakSet prevents re-processing → no loops.
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyPrefsToNewTablists, 80);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Catch SPA navigation via a custom navigation event emitted from a
    // single, shared history patch.
    function onNav() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyPrefsToNewTablists, 150);
    }

    window.addEventListener("xmtp:nav", onNav);
    ensureHistoryPatched();

    function ensureHistoryPatched() {
      interface WindowWithTabSync extends Window {
        __tabSyncHistoryPatched?: boolean;
      }
      const win = window as WindowWithTabSync;
      if (win.__tabSyncHistoryPatched) {
        return;
      }

      const originalPushState = history.pushState.bind(history);
      const originalReplaceState = history.replaceState.bind(history);

      function dispatchNavEvent() {
        window.dispatchEvent(new Event("xmtp:nav"));
      }

      history.pushState = function (...args: Parameters<typeof originalPushState>) {
        originalPushState(...args);
        dispatchNavEvent();
      };

      history.replaceState = function (
        ...args: Parameters<typeof originalReplaceState>
      ) {
        originalReplaceState(...args);
        dispatchNavEvent();
      };

      // popstate and the history patches are intentionally left global for the
      // lifetime of the page — they dispatch the "xmtp:nav" custom event that
      // each TabSync instance subscribes to and cleans up individually.
      window.addEventListener("popstate", dispatchNavEvent);

      win.__tabSyncHistoryPatched = true;
    }

    return () => {
      document.removeEventListener("mousedown", handleMouseDown, true);
      observer.disconnect();
      clearTimeout(debounceTimer);
      window.removeEventListener("xmtp:nav", onNav);
    };
  }, []);

  return null;
}
