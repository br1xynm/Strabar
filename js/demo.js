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
     MODE 2 — Explore public routes (list + interactive map + detail)
     ===================================================================== */
  const ROUTES = [
    {
      id: "gothic",
      name: "Gothic Quarter Night",
      neighborhood: "Gothic Quarter",
      distanceKm: 3.1,
      duration: "48 min",
      beers: 5,
      rating: 4.8,
      ratingCount: 142,
      user: { name: "Marta R.", initial: "M" },
      description:
        "A late-night crawl through the Gothic Quarter's hidden courtyards and vermouth bars, ending with cocktails near the cathedral.",
      photos: 4,
      comments: [
        { name: "Jordi P.", initial: "J", time: "2d", text: "Followed this exact route last Friday — Casa Almirall is a must." },
        { name: "Nia K.", initial: "N", time: "5d", text: "Sala Comtal had a great DJ set that night!" },
      ],
      path: "M70,380 L70,310 L160,310 L160,230 L270,230 L270,150 L380,150 L380,60 L470,60",
      stops: [
        { name: "Plaça Reial", note: "Meeting point", x: 59, y: 357 },
        { name: "Casa Almirall", note: "Vermouth stop", x: 149, y: 287 },
        { name: "Sala Comtal", note: "Live music", x: 259, y: 207 },
        { name: "El Ultimo Trago", note: "Late-night cocktails", x: 369, y: 127 },
        { name: "Cafè del Born", note: "Closing spot", x: 459, y: 37 },
      ],
    },
    {
      id: "poblenou",
      name: "Poblenou After Dark",
      neighborhood: "Poblenou",
      distanceKm: 4.6,
      duration: "1h 05min",
      beers: 6,
      rating: 4.5,
      ratingCount: 98,
      user: { name: "Alex D.", initial: "A" },
      description:
        "Rooftop views, a local wine bar, and a beachfront break before closing the night out in Poblenou.",
      photos: 3,
      comments: [
        { name: "Marta R.", initial: "M", time: "1d", text: "The beachfront break really cools you down mid-route." },
        { name: "Jordi P.", initial: "J", time: "6d", text: "La Terraza Norte has the best views in the neighbourhood." },
      ],
      path: "M70,150 L160,150 L160,60 L270,60 L270,230 L380,230 L380,310 L470,310 L470,380 L560,380",
      stops: [
        { name: "Rambla del Poblenou", note: "Starting walk", x: 59, y: 127 },
        { name: "La Terraza Norte", note: "Rooftop views", x: 149, y: 37 },
        { name: "Bodega Nou Barris", note: "Local wine bar", x: 259, y: 37 },
        { name: "El Rincón del Vermut", note: "Tapas + vermut", x: 259, y: 207 },
        { name: "Platja del Bogatell", note: "Beachfront break", x: 369, y: 287 },
        { name: "Bar La Confianza", note: "Final round", x: 549, y: 357 },
      ],
    },
    {
      id: "gracia",
      name: "Gràcia Discovery",
      neighborhood: "Gràcia",
      distanceKm: 2.4,
      duration: "39 min",
      beers: 4,
      rating: 4.7,
      ratingCount: 76,
      user: { name: "Nia K.", initial: "N" },
      description: "A short, easy-going route around Gràcia's leafy squares — a great way to start the night slow.",
      photos: 2,
      comments: [{ name: "Alex D.", initial: "A", time: "3d", text: "Great warm-up route before heading downtown." }],
      path: "M470,60 L470,150 L270,150 L270,310 L160,310",
      stops: [
        { name: "Plaça del Sol", note: "Starting point", x: 459, y: 37 },
        { name: "Cafè del Born", note: "Craft beer", x: 259, y: 127 },
        { name: "Sala Comtal", note: "Terrace", x: 259, y: 287 },
        { name: "El Ultimo Trago", note: "Closing spot", x: 149, y: 287 },
      ],
    },
  ];

  const explorePanel = root.querySelector('[data-panel="explore"]');
  if (explorePanel) {
    const filterEls = {
      neighborhood: explorePanel.querySelector('[data-explore-filter="neighborhood"]'),
      distance: explorePanel.querySelector('[data-explore-filter="distance"]'),
      rating: explorePanel.querySelector('[data-explore-filter="rating"]'),
      sort: explorePanel.querySelector('[data-explore-filter="sort"]'),
    };
    const listEl = explorePanel.querySelector("[data-explore-list]");
    const emptyEl = explorePanel.querySelector("[data-explore-empty]");
    const pathEl = explorePanel.querySelector("[data-explore-path]");
    const pathCasingEl = explorePanel.querySelector("[data-explore-path-casing]");
    const pinsGroupEl = explorePanel.querySelector("[data-explore-pins]");
    const titleEl = explorePanel.querySelector("[data-explore-title]");
    const metaEl = explorePanel.querySelector("[data-explore-meta]");
    const ratingEl = explorePanel.querySelector("[data-explore-rating]");
    const descEl = explorePanel.querySelector("[data-explore-description]");
    const photosEl = explorePanel.querySelector("[data-explore-photos]");
    const commentsEl = explorePanel.querySelector("[data-explore-comments]");

    let exploreSelectedId = ROUTES[0].id;

    function distanceBucket(km) {
      if (km < 3) return "short";
      if (km <= 5) return "medium";
      return "long";
    }

    function getFilteredSortedRoutes() {
      const nb = filterEls.neighborhood ? filterEls.neighborhood.value : "all";
      const dist = filterEls.distance ? filterEls.distance.value : "all";
      const minRating = filterEls.rating && filterEls.rating.value !== "all" ? parseFloat(filterEls.rating.value) : 0;
      const sort = filterEls.sort ? filterEls.sort.value : "top";

      const list = ROUTES.filter((r) => {
        if (nb !== "all" && r.neighborhood !== nb) return false;
        if (dist !== "all" && distanceBucket(r.distanceKm) !== dist) return false;
        if (r.rating < minRating) return false;
        return true;
      });

      list.sort((a, b) => {
        if (sort === "comments") return b.comments.length - a.comments.length;
        if (sort === "short") return a.distanceKm - b.distanceKm;
        if (sort === "long") return b.distanceKm - a.distanceKm;
        return b.rating - a.rating;
      });

      return list;
    }

    function renderMap(route) {
      if (pathEl) pathEl.setAttribute("d", route.path);
      if (pathCasingEl) pathCasingEl.setAttribute("d", route.path);
      if (pinsGroupEl) {
        const SVG_NS = "http://www.w3.org/2000/svg";
        pinsGroupEl.innerHTML = "";
        route.stops.forEach((stop) => {
          const g = document.createElementNS(SVG_NS, "g");
          g.setAttribute("class", "map-pin");
          const use = document.createElementNS(SVG_NS, "use");
          use.setAttribute("href", "#icon-logo");
          use.setAttribute("x", String(stop.x));
          use.setAttribute("y", String(stop.y));
          use.setAttribute("width", "22");
          use.setAttribute("height", "25");
          const title = document.createElementNS(SVG_NS, "title");
          title.textContent = stop.name;
          g.appendChild(use);
          g.appendChild(title);
          pinsGroupEl.appendChild(g);
        });
      }
    }

    function renderDetail(route) {
      if (titleEl) titleEl.textContent = route.name;
      if (metaEl) metaEl.textContent = `${t("demo.exploreRouteBy")} ${route.user.name} · ${route.neighborhood}`;
      if (ratingEl) {
        ratingEl.innerHTML = `<svg class="icon"><use href="#icon-star" /></svg>${route.rating.toFixed(1)} <small>(${
          route.ratingCount
        } ${t("demo.exploreReviews")})</small>`;
      }
      if (descEl) descEl.textContent = route.description;
      if (photosEl) {
        photosEl.innerHTML = "";
        for (let i = 0; i < route.photos; i += 1) {
          const div = document.createElement("div");
          div.className = "explore-photo";
          div.innerHTML = '<svg class="icon"><use href="#icon-camera" /></svg>';
          photosEl.appendChild(div);
        }
      }
      if (commentsEl) {
        commentsEl.innerHTML = "";
        route.comments.forEach((c) => {
          const li = document.createElement("li");
          li.className = "explore-comment";
          li.innerHTML = `<span class="explore-comment-avatar">${c.initial}</span><div class="explore-comment-body"><strong>${c.name}</strong><span class="explore-comment-time">${c.time}</span><p></p></div>`;
          li.querySelector("p").textContent = c.text;
          commentsEl.appendChild(li);
        });
      }
    }

    function renderList() {
      if (!listEl) return;
      const routes = getFilteredSortedRoutes();
      if (emptyEl) emptyEl.hidden = routes.length > 0;
      listEl.innerHTML = "";
      routes.forEach((route) => {
        const li = document.createElement("li");
        li.className = "explore-route-card" + (route.id === exploreSelectedId ? " is-active" : "");
        li.setAttribute("data-route", route.id);
        li.setAttribute("tabindex", "0");
        li.setAttribute("role", "button");
        li.setAttribute("aria-pressed", String(route.id === exploreSelectedId));
        li.innerHTML = `<div class="explore-route-card-top"><strong></strong><span class="explore-route-rating"><svg class="icon"><use href="#icon-star" /></svg>${route.rating.toFixed(
          1
        )}</span></div><span class="explore-route-chip"></span><div class="explore-route-stats"><span>${route.distanceKm.toFixed(
          1
        )} km</span><span>${route.duration}</span><span>${route.beers} ${t(
          "demo.statBeers"
        )}</span></div><div class="explore-route-user"><span class="explore-route-avatar">${
          route.user.initial
        }</span><span></span></div>`;
        li.querySelector(".explore-route-card-top strong").textContent = route.name;
        li.querySelector(".explore-route-chip").textContent = route.neighborhood;
        li.querySelector(".explore-route-user span:last-child").textContent = route.user.name;
        li.addEventListener("click", () => selectRoute(route.id));
        li.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectRoute(route.id);
          }
        });
        li.addEventListener("mouseenter", () => previewRoute(route.id));
        li.addEventListener("mouseleave", () => previewRoute(exploreSelectedId));
        li.addEventListener("focus", () => previewRoute(route.id));
        li.addEventListener("blur", () => previewRoute(exploreSelectedId));
        listEl.appendChild(li);
      });
    }

    function previewRoute(id) {
      const route = ROUTES.find((r) => r.id === id);
      if (route) renderMap(route);
    }

    function selectRoute(id) {
      const route = ROUTES.find((r) => r.id === id);
      if (!route) return;
      exploreSelectedId = id;
      renderMap(route);
      renderDetail(route);
      renderList();
    }

    Object.values(filterEls).forEach((el) => {
      if (!el) return;
      el.addEventListener("change", () => {
        const routes = getFilteredSortedRoutes();
        if (routes.length && !routes.find((r) => r.id === exploreSelectedId)) {
          selectRoute(routes[0].id);
        } else {
          renderList();
        }
      });
    });

    document.addEventListener("strabar:langchange", () => {
      renderList();
      const route = ROUTES.find((r) => r.id === exploreSelectedId);
      if (route) renderDetail(route);
    });

    renderList();
    selectRoute(ROUTES[0].id);
  }
})();
