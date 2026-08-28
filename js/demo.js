/* ==========================================================================
   STRABAR — Interactive demo (vanilla JS, no backend)
   Two modes:
   1) "Track a night" — simulates start → GPS tracking → +beer stops → finish → share
   2) "Explore routes" — pick a sample popular route and browse its stops/stats
   ========================================================================== */

(function () {
  "use strict";

  const root = document.getElementById("demo");
  if (!root) return;

  const t = (key) => (window.StrabarI18n ? window.StrabarI18n.t(key) : key);

  /* ---------------- Shared toast ---------------- */
  const toastEl = document.getElementById("demo-toast");
  let toastTimer = null;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove("is-visible"), 3200);
  }

  /* ---------------- Tabs ---------------- */
  const tabButtons = root.querySelectorAll(".demo-tab");
  const panels = root.querySelectorAll(".demo-panel");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      tabButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
      tabButtons.forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
      panels.forEach((p) => p.classList.toggle("is-active", p.getAttribute("data-panel") === target));
    });
  });

  /* =====================================================================
     MODE 1 — Track a night
     ===================================================================== */
  const BAR_NAMES = [
    "Casa Almirall",
    "Bar La Confianza",
    "El Rincón del Vermut",
    "La Terraza Norte",
    "Bodega Nou Barris",
    "Sala Comtal",
    "El Ultimo Trago",
    "Cafè del Born",
  ];

  const PIN_POSITIONS = [
    { top: "58%", left: "22%" },
    { top: "34%", left: "40%" },
    { top: "64%", left: "55%" },
    { top: "24%", left: "66%" },
    { top: "48%", left: "78%" },
    { top: "72%", left: "34%" },
    { top: "18%", left: "50%" },
    { top: "40%", left: "20%" },
  ];

  const trackState = {
    status: "ready", // ready | tracking | finished
    seconds: 0,
    beers: 0,
    distanceKm: 0,
    timerId: null,
  };

  const screens = {
    ready: root.querySelector('[data-demo-screen="ready"]'),
    tracking: root.querySelector('[data-demo-screen="tracking"]'),
    finished: root.querySelector('[data-demo-screen="finished"]'),
  };
  const mapEl = root.querySelector("[data-demo-map]");
  const elapsedEl = root.querySelector("[data-demo-elapsed]");
  const logEl = root.querySelector("[data-demo-log]");
  const btnStart = root.querySelector("[data-demo-start]");
  const btnBeer = root.querySelector("[data-demo-beer]");
  const btnFinish = root.querySelector("[data-demo-finish]");
  const btnShare = root.querySelector("[data-demo-share]");
  const btnRestart = root.querySelector("[data-demo-restart]");
  const stateLabelEl = root.querySelector("[data-demo-state-label]");

  const outDistance = root.querySelectorAll("[data-demo-out-distance]");
  const outTime = root.querySelectorAll("[data-demo-out-time]");
  const outBeers = root.querySelectorAll("[data-demo-out-beers]");
  const outPace = root.querySelectorAll("[data-demo-out-pace]");

  function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `00:${m}:${s}`;
  }

  function formatPace(seconds, beers) {
    if (!beers) return "—";
    const perBeer = seconds / beers;
    if (perBeer < 60) return `<1 min/beer`;
    return `${Math.round(perBeer / 60)} min/beer`;
  }

  function renderTrackOutputs() {
    outDistance.forEach((el) => (el.textContent = `${trackState.distanceKm.toFixed(2)} km`));
    outTime.forEach((el) => (el.textContent = formatTime(trackState.seconds)));
    outBeers.forEach((el) => (el.textContent = String(trackState.beers)));
    outPace.forEach((el) => (el.textContent = formatPace(trackState.seconds, trackState.beers)));
    if (elapsedEl) elapsedEl.textContent = formatTime(trackState.seconds);
  }

  function setScreen(status) {
    trackState.status = status;
    Object.keys(screens).forEach((key) => {
      if (screens[key]) screens[key].hidden = key !== status;
    });
    if (stateLabelEl) {
      const labelKey =
        status === "ready" ? "demo.stateReady" : status === "tracking" ? "demo.stateTracking" : "demo.stateFinished";
      stateLabelEl.textContent = t(labelKey);
    }
    if (btnStart) btnStart.hidden = status !== "ready";
    if (btnBeer) btnBeer.hidden = status !== "tracking";
    if (btnFinish) btnFinish.hidden = status !== "tracking";
    if (btnShare) btnShare.hidden = status !== "finished";
    if (btnRestart) btnRestart.hidden = status !== "finished";
  }

  function startTracking() {
    trackState.seconds = 0;
    trackState.beers = 0;
    trackState.distanceKm = 0;
    if (mapEl) mapEl.querySelectorAll(".pin").forEach((p) => p.remove());
    if (logEl) logEl.innerHTML = "";
    setScreen("tracking");
    renderTrackOutputs();
    window.clearInterval(trackState.timerId);
    trackState.timerId = window.setInterval(() => {
      trackState.seconds += 1;
      renderTrackOutputs();
    }, 1000);
  }

  function addBeerStop() {
    if (trackState.status !== "tracking") return;
    if (trackState.beers >= BAR_NAMES.length) {
      showToast(t("demo.toastBeer"));
      return;
    }
    const idx = trackState.beers;
    trackState.beers += 1;
    trackState.distanceKm += 0.3 + Math.random() * 0.5;
    renderTrackOutputs();

    if (mapEl) {
      const SVG_NS = "http://www.w3.org/2000/svg";
      const pin = document.createElementNS(SVG_NS, "svg");
      pin.setAttribute("class", "pin");
      pin.setAttribute("viewBox", "0 0 48 48");
      pin.style.top = PIN_POSITIONS[idx % PIN_POSITIONS.length].top;
      pin.style.left = PIN_POSITIONS[idx % PIN_POSITIONS.length].left;
      const use = document.createElementNS(SVG_NS, "use");
      use.setAttribute("href", "#icon-logo");
      pin.appendChild(use);
      mapEl.appendChild(pin);
    }

    if (logEl) {
      const item = document.createElement("li");
      item.className = "demo-stop-item";
      item.innerHTML = `<span class="dot"></span><strong>${BAR_NAMES[idx]}</strong><span>${formatTime(
        trackState.seconds
      )}</span>`;
      logEl.prepend(item);
    }

    showToast(t("demo.toastBeer"));
  }

  function finishTracking() {
    if (trackState.status !== "tracking") return;
    window.clearInterval(trackState.timerId);
    setScreen("finished");
    renderTrackOutputs();
    showToast(t("demo.toastFinish"));
  }

  function shareStrabar() {
    showToast(t("demo.toastShare"));
  }

  function restartTracking() {
    window.clearInterval(trackState.timerId);
    trackState.seconds = 0;
    trackState.beers = 0;
    trackState.distanceKm = 0;
    if (mapEl) mapEl.querySelectorAll(".pin").forEach((p) => p.remove());
    if (logEl) logEl.innerHTML = "";
    setScreen("ready");
    renderTrackOutputs();
  }

  if (btnStart) btnStart.addEventListener("click", startTracking);
  if (btnBeer) btnBeer.addEventListener("click", addBeerStop);
  if (btnFinish) btnFinish.addEventListener("click", finishTracking);
  if (btnShare) btnShare.addEventListener("click", shareStrabar);
  if (btnRestart) btnRestart.addEventListener("click", restartTracking);

  setScreen("ready");
  renderTrackOutputs();

  document.addEventListener("strabar:langchange", () => setScreen(trackState.status));

  /* =====================================================================
     MODE 2 — Explore popular routes
     ===================================================================== */
  const ROUTES = [
    {
      id: "gothic",
      name: "Gothic Quarter Night",
      distance: "3.1 km",
      duration: "48 min",
      beers: 5,
      stops: [
        { name: "Plaça Reial", note: "Meeting point" },
        { name: "Casa Almirall", note: "Vermouth stop" },
        { name: "Sala Comtal", note: "Live music" },
        { name: "El Ultimo Trago", note: "Late-night cocktails" },
        { name: "Cafè del Born", note: "Closing spot" },
      ],
    },
    {
      id: "poblenou",
      name: "Poblenou After Dark",
      distance: "4.6 km",
      duration: "1h 05min",
      beers: 6,
      stops: [
        { name: "Rambla del Poblenou", note: "Starting walk" },
        { name: "La Terraza Norte", note: "Rooftop views" },
        { name: "Bodega Nou Barris", note: "Local wine bar" },
        { name: "El Rincón del Vermut", note: "Tapas + vermut" },
        { name: "Platja del Bogatell", note: "Beachfront break" },
        { name: "Bar La Confianza", note: "Final round" },
      ],
    },
    {
      id: "gracia",
      name: "Gràcia Discovery",
      distance: "2.4 km",
      duration: "39 min",
      beers: 4,
      stops: [
        { name: "Plaça del Sol", note: "Starting point" },
        { name: "Cafè del Born", note: "Craft beer" },
        { name: "Sala Comtal", note: "Terrace" },
        { name: "El Ultimo Trago", note: "Closing spot" },
      ],
    },
  ];

  const routeChipsWrap = root.querySelector("[data-route-picker]");
  const routeTitleEl = root.querySelector("[data-route-title]");
  const routeStopsEl = root.querySelector("[data-route-stops]");
  const routeDistanceEl = root.querySelector("[data-route-distance]");
  const routeDurationEl = root.querySelector("[data-route-duration]");
  const routeBeersEl = root.querySelector("[data-route-beers]");

  function renderRoute(route) {
    if (routeTitleEl) routeTitleEl.textContent = route.name;
    if (routeDistanceEl) routeDistanceEl.textContent = route.distance;
    if (routeDurationEl) routeDurationEl.textContent = route.duration;
    if (routeBeersEl) routeBeersEl.textContent = String(route.beers);
    if (routeStopsEl) {
      routeStopsEl.innerHTML = "";
      route.stops.forEach((stop, i) => {
        const li = document.createElement("li");
        li.className = "route-stop";
        li.innerHTML = `<span class="num">${i + 1}</span><span><strong>${stop.name}</strong><small>${
          stop.note
        }</small></span>`;
        routeStopsEl.appendChild(li);
      });
    }
  }

  if (routeChipsWrap) {
    const chips = routeChipsWrap.querySelectorAll(".route-chip");
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.toggle("is-active", c === chip));
        const route = ROUTES.find((r) => r.id === chip.getAttribute("data-route"));
        if (route) renderRoute(route);
      });
    });
    if (chips.length) renderRoute(ROUTES[0]);
  }
})();
