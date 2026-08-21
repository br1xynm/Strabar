/* ==========================================================================
   STRABAR — Main site behaviour
   Header scroll state, mobile nav, language dropdown, scroll reveal.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------- Header scroll state ---------------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------- Mobile nav ---------------- */
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");
  if (hamburger && mobileNav) {
    const closeMobileNav = () => {
      hamburger.setAttribute("aria-expanded", "false");
      mobileNav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    };
    const toggleMobileNav = () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    };
    hamburger.addEventListener("click", toggleMobileNav);
    mobileNav.querySelectorAll("a, [data-close-nav]").forEach((el) => {
      el.addEventListener("click", closeMobileNav);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobileNav();
    });
  }

  /* ---------------- Language dropdown (desktop) ---------------- */
  const langSwitch = document.querySelector(".lang-switch");
  if (langSwitch) {
    const langBtn = langSwitch.querySelector(".lang-btn");
    const close = () => langSwitch.classList.remove("is-open");
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      langSwitch.classList.toggle("is-open");
    });
    document.addEventListener("click", (e) => {
      if (!langSwitch.contains(e.target)) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    langSwitch.querySelectorAll("[data-lang-option]").forEach((opt) => {
      opt.addEventListener("click", close);
    });
  }

  // Keep the visible lang-btn label in sync with the active language
  document.addEventListener("strabar:langchange", (e) => {
    const label = document.querySelector("[data-lang-current-label]");
    if (label) label.textContent = e.detail.lang.toUpperCase();
  });
  document.addEventListener("DOMContentLoaded", () => {
    const label = document.querySelector("[data-lang-current-label]");
    if (label && window.StrabarI18n) label.textContent = window.StrabarI18n.getLang().toUpperCase();
  });

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------- City map pins: light interactivity ---------------- */
  document.querySelectorAll(".city-map .map-pin").forEach((pin) => {
    pin.addEventListener("click", () => {
      const active = pin.classList.contains("is-hot");
      document.querySelectorAll(".city-map .map-pin").forEach((p) => p.classList.remove("is-hot"));
      if (!active) pin.classList.add("is-hot");
    });
  });
})();
