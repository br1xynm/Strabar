/* ==========================================================================
   STRABAR — Cookie consent (vanilla JS)
   Honesty note: this site currently sets ONLY strictly necessary storage
   (your language choice and this very consent record, both in localStorage).
   No analytics or marketing cookies/trackers are loaded. The categories
   below exist so consent choices are ready the day those are introduced —
   toggling "Analytics"/"Marketing" today has no visible effect yet.
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "strabar_cookie_consent";

  const banner = document.getElementById("cookie-banner");
  const modalOverlay = document.getElementById("cookie-modal");
  const modalPanel = modalOverlay ? modalOverlay.querySelector(".modal-panel") : null;

  if (!banner || !modalOverlay) return;

  const toggles = {
    analytics: document.getElementById("cookie-toggle-analytics"),
    preferences: document.getElementById("cookie-toggle-preferences"),
    marketing: document.getElementById("cookie-toggle-marketing"),
  };

  function readConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(consent) {
    const payload = Object.assign({ necessary: true }, consent, { updatedAt: new Date().toISOString() });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      /* localStorage unavailable — consent simply won't persist across visits */
    }
    return payload;
  }

  function hideBanner() {
    banner.classList.remove("is-visible");
  }

  function showBanner() {
    banner.classList.add("is-visible");
  }

  function openModal(prefill) {
    const consent = prefill || readConsent() || { analytics: false, preferences: false, marketing: false };
    if (toggles.analytics) toggles.analytics.checked = !!consent.analytics;
    if (toggles.preferences) toggles.preferences.checked = !!consent.preferences;
    if (toggles.marketing) toggles.marketing.checked = !!consent.marketing;
    modalOverlay.classList.add("is-visible");
    modalOverlay.setAttribute("aria-hidden", "false");
    if (modalPanel) {
      const firstFocusable = modalPanel.querySelector("button, input");
      if (firstFocusable) firstFocusable.focus();
    }
  }

  function closeModal() {
    modalOverlay.classList.remove("is-visible");
    modalOverlay.setAttribute("aria-hidden", "true");
  }

  function acceptAll() {
    writeConsent({ analytics: true, preferences: true, marketing: true });
    hideBanner();
    closeModal();
  }

  function rejectNonEssential() {
    writeConsent({ analytics: false, preferences: false, marketing: false });
    hideBanner();
    closeModal();
  }

  function saveFromModal() {
    writeConsent({
      analytics: toggles.analytics ? toggles.analytics.checked : false,
      preferences: toggles.preferences ? toggles.preferences.checked : false,
      marketing: toggles.marketing ? toggles.marketing.checked : false,
    });
    hideBanner();
    closeModal();
  }

  document.querySelectorAll("[data-cookie-action]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const action = el.getAttribute("data-cookie-action");
      if (action === "accept-all") {
        e.preventDefault();
        acceptAll();
      } else if (action === "reject-all") {
        e.preventDefault();
        rejectNonEssential();
      } else if (action === "configure") {
        e.preventDefault();
        openModal();
      } else if (action === "save") {
        e.preventDefault();
        saveFromModal();
      } else if (action === "close") {
        e.preventDefault();
        closeModal();
      }
    });
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("is-visible")) closeModal();
  });

  // Footer "cookie preferences" link — always reopens the modal, wherever it lives
  document.querySelectorAll("[data-cookie-reopen]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // First visit: show the banner after a short delay so it doesn't ambush the load
  const existing = readConsent();
  if (!existing) {
    window.setTimeout(showBanner, 900);
  }

  window.StrabarCookies = { openPreferences: () => openModal(), getConsent: readConsent };
})();
