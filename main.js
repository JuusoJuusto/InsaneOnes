/* ============================================================================
   InsaneOnes — main.js
   Reads everything from config.js (window.SITE), then wires up the page.
   You normally don't need to edit this file. Content lives in config.js.
   ============================================================================ */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var lenis = null;

  /* ---- tiny helpers ------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function resolve(path) { return String(path).split(".").reduce(function (o, k) { return (o == null ? undefined : o[k]); }, SITE); }
  function isExternal(url) { return /^https?:\/\//i.test(url || ""); }

  /* ---- smooth scrolling (Lenis, with graceful native fallback) ------------ */
  function initSmoothScroll() {
    if (prefersReduced || !window.Lenis || !finePointer) return;
    lenis = new window.Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.6 });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
  function initAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -72 });
      else target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    });
  }

  /* ---- hydrate from config ------------------------------------------------ */
  function hydrate() {
    $all("[data-bind]").forEach(function (node) {
      var v = resolve(node.getAttribute("data-bind"));
      if (v != null && typeof v !== "object") node.textContent = v;
    });
    $all("[data-href]").forEach(function (node) {
      var v = resolve(node.getAttribute("data-href"));
      if (v) { node.setAttribute("href", v); if (isExternal(v)) { node.setAttribute("target", "_blank"); node.setAttribute("rel", "noopener noreferrer"); } }
    });

    var titleLine = $(".hero__title-line");
    if (titleLine) titleLine.setAttribute("data-ghost", titleLine.textContent);

    var aboutBody = $("#about-body");
    if (aboutBody && SITE.about && SITE.about.body) aboutBody.innerHTML = SITE.about.body.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    var quote = $("#about-quote");
    if (quote && SITE.about && SITE.about.pullQuote) quote.textContent = SITE.about.pullQuote;
    else if (quote) quote.remove();

    renderLaws();
    renderRules();
    renderShop();
    renderSteps();
    renderGallery();
    renderUpdates();
    renderFaq();
    renderFooter();

    var year = $("#year"); if (year) year.textContent = new Date().getFullYear();
  }

  function renderLaws() {
    var list = $("#laws-list"); if (!list || !SITE.laws) return;
    SITE.laws.forEach(function (law, i) {
      var li = el("li", "law reveal"); li.style.setProperty("--i", i);
      var c = el("div", "law__content");
      c.appendChild(el("h3", "law__title", esc(law.title)));
      c.appendChild(el("p", "law__body", esc(law.body)));
      li.appendChild(c);
      list.appendChild(li);
    });
  }

  function renderShop() {
    if (SITE.shop && SITE.shop.comingSoon) { var ss = $("#shop"); if (ss) ss.classList.add("shop-soon"); }
    var grid = $("#shop-grid"); if (grid && SITE.shop && SITE.shop.features) {
      SITE.shop.features.forEach(function (f, i) {
        var li = el("li", "shop-item reveal"); li.style.setProperty("--i", i);
        li.innerHTML = '<span class="shop-item__mark" aria-hidden="true"></span>' +
          '<h3 class="shop-item__name">' + esc(f.name) + "</h3>" +
          '<p class="shop-item__body">' + esc(f.body) + "</p>";
        grid.appendChild(li);
      });
    }
    var cta = $("#shop-cta");
    if (cta && SITE.shop && SITE.shop.url) {
      var a = el("a", "btn btn--blood", '<span>' + esc(SITE.shop.cta || "Open the store") + "</span>");
      a.href = SITE.shop.url;
      if (isExternal(SITE.shop.url)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      cta.appendChild(a);
    }
  }

  function renderSteps() {
    var list = $("#join-steps"); if (!list || !SITE.join || !SITE.join.steps) return;
    SITE.join.steps.forEach(function (s, i) {
      var li = el("li", "join-step reveal"); li.style.setProperty("--i", i);
      li.appendChild(el("div", "join-step__num"));
      var c = el("div", "join-step__content");
      c.appendChild(el("p", "join-step__title", esc(s.title)));
      c.appendChild(el("p", "join-step__body", esc(s.body)));
      li.appendChild(c);
      list.appendChild(li);
    });
  }

  var SCENE_GLOWS = [
    "oklch(0.56 0.205 22 / 0.42)", "oklch(0.62 0.16 45 / 0.34)", "oklch(0.58 0.13 250 / 0.30)",
    "oklch(0.62 0.16 150 / 0.22)", "oklch(0.52 0.16 300 / 0.26)", "oklch(0.50 0.20 18 / 0.40)"
  ];

  var galleryImages = [], lightboxIndex = 0;

  function renderGallery() {
    var grid = $("#gallery-grid"); if (!grid || !SITE.gallery || !SITE.gallery.shots) return;
    galleryImages.length = 0;
    var zoomSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/></svg>';
    SITE.gallery.shots.forEach(function (shot, i) {
      var li = el("li", "shot reveal"); li.style.setProperty("--i", i);
      if (shot.src) {
        var btn = el("button", "shot__btn"); btn.type = "button";
        btn.setAttribute("aria-label", "View screenshot: " + (shot.caption || ""));
        btn.innerHTML = '<img src="' + esc(shot.src) + '" alt="' + esc(shot.alt || shot.caption || "") + '" loading="lazy" />' +
          '<span class="shot__glow" aria-hidden="true"></span>' +
          '<span class="shot__zoom" aria-hidden="true">' + zoomSvg + "</span>" +
          '<span class="shot__cap">' + esc(shot.caption || "") + "</span>";
        var gi = galleryImages.push({ src: shot.src, caption: shot.caption || "", alt: shot.alt || shot.caption || "" }) - 1;
        btn.addEventListener("click", function () { openLightbox(gi); });
        li.appendChild(btn);
      } else {
        var scene = el("div", "shot__btn");
        scene.innerHTML = '<span class="shot__scene" style="--scene-glow:' + SCENE_GLOWS[i % SCENE_GLOWS.length] + '"></span>' +
          '<span class="shot__glow" aria-hidden="true"></span>' +
          '<span class="shot__noise"></span>' +
          '<span class="shot__cap">' + esc(shot.caption || "") + "</span>";
        li.appendChild(scene);
      }
      grid.appendChild(li);
    });
  }

  function renderRules() {
    var list = $("#rules-list");
    if (!list) return;
    if (!SITE.rules || !SITE.rules.items || !SITE.rules.items.length) { var s = $("#rules"); if (s) s.remove(); return; }
    SITE.rules.items.forEach(function (r, i) {
      var li = el("li", "rule reveal"); li.style.setProperty("--i", i);
      li.innerHTML = '<span class="rule__x" aria-hidden="true">✕</span><span>' + esc(r) + "</span>";
      list.appendChild(li);
    });
  }

  function renderUpdates() {
    var list = $("#updates-list");
    if (!list) return;
    if (!SITE.updates || !SITE.updates.items || !SITE.updates.items.length) {
      var sec = $("#updates"); if (sec) sec.remove(); return;
    }
    SITE.updates.items.forEach(function (u, i) {
      var li = el("li", "update reveal"); li.style.setProperty("--i", i);
      li.innerHTML =
        '<div class="update__meta">' +
          (u.date ? '<span class="update__date">' + esc(u.date) + "</span>" : "") +
          (u.tag ? '<span class="update__tag">' + esc(u.tag) + "</span>" : "") +
        "</div>" +
        '<h3 class="update__title">' + esc(u.title) + "</h3>" +
        '<p class="update__body">' + esc(u.body) + "</p>";
      list.appendChild(li);
    });
  }

  function renderFaq() {
    var list = $("#faq-list"); if (!list || !SITE.faq || !SITE.faq.items) return;
    SITE.faq.items.forEach(function (item, i) {
      var wrap = el("div", "faq__item reveal"); wrap.style.setProperty("--i", i);
      var id = "faq-a-" + i;
      var q = el("button", "faq__q"); q.type = "button";
      q.setAttribute("aria-expanded", "false"); q.setAttribute("aria-controls", id);
      q.innerHTML = "<span>" + esc(item.q) + '</span><span class="faq__icon" aria-hidden="true"></span>';
      var a = el("div", "faq__a"); a.id = id;
      a.appendChild(el("div", "faq__a-inner", "<p>" + esc(item.a) + "</p>"));
      q.addEventListener("click", function () { toggleFaq(wrap, q, a); });
      wrap.appendChild(q); wrap.appendChild(a);
      list.appendChild(wrap);
    });
  }
  function toggleFaq(item, q, a) {
    var inner = a.firstElementChild;
    var open = item.classList.toggle("is-open");
    q.setAttribute("aria-expanded", String(open));
    if (open) {
      a.style.height = inner.offsetHeight + "px";
      a.addEventListener("transitionend", function te() { if (item.classList.contains("is-open")) a.style.height = "auto"; a.removeEventListener("transitionend", te); });
    } else {
      a.style.height = inner.offsetHeight + "px";
      requestAnimationFrame(function () { a.style.height = "0px"; });
    }
  }

  function renderFooter() {
    var links = $("#footer-links");
    if (links && SITE.footer && SITE.footer.links) SITE.footer.links.forEach(function (l) {
      var a = el("a", null, esc(l.label)); a.href = l.url || "#";
      if (isExternal(l.url)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      links.appendChild(a);
    });
    var socials = $("#footer-socials");
    if (socials && SITE.footer && SITE.footer.socials) SITE.footer.socials.forEach(function (s) {
      var li = el("li"); var a = el("a", null, esc(s.label)); a.href = s.url || "#";
      if (isExternal(s.url)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      li.appendChild(a); socials.appendChild(li);
    });
  }

  /* ---- copy to clipboard -------------------------------------------------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (res, rej) {
      try { var ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.focus(); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); res(); }
      catch (e) { rej(e); }
    });
  }
  var toastTimer;
  function showToast(msg) {
    var t = $("#toast"); if (!t) return;
    t.textContent = msg; t.classList.add("is-show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("is-show"); }, 2200);
  }
  function initCopy() {
    document.addEventListener("click", function (e) {
      var target = e.target.closest("[data-copy]"); if (!target) return;
      var value = resolve(target.getAttribute("data-copy")); if (!value) return;
      copyText(value).then(function () {
        showToast("Copied  " + value);
        target.classList.add("is-copied");
        var label = target.querySelector(".join-box__copy-text"); var prev = label ? label.textContent : null;
        if (label) label.textContent = "Copied";
        setTimeout(function () { target.classList.remove("is-copied"); if (label && prev) label.textContent = prev; }, 1700);
      }).catch(function () { showToast("Press Ctrl+C to copy: " + value); });
    });
  }

  /* ---- nav + unified scroll manager (state, progress, parallax) ----------- */
  function initNav() {
    var toggle = $("#navToggle"), menu = $("#mobileNav");
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        var open = menu.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });
      menu.addEventListener("click", function (e) { if (e.target.closest("a")) { menu.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open menu"); } });
    }
  }
  function initScrollFx() {
    var nav = $("#nav"), bar = $("#scrollProgress"), parallax = $all("[data-parallax]");
    var docEl = document.documentElement, ticking = false;
    function update() {
      var y = window.scrollY || docEl.scrollTop;
      if (nav) nav.classList.toggle("is-scrolled", y > 24);
      if (bar) { var h = docEl.scrollHeight - window.innerHeight; bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0) + ")"; }
      if (!prefersReduced) parallax.forEach(function (l) { l.style.transform = "translate3d(0," + (y * parseFloat(l.dataset.parallax || 0)).toFixed(1) + "px,0)"; });
      ticking = false;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    update(); window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll, { passive: true });
  }

  /* ---- count-up ----------------------------------------------------------- */
  function countUp(node, to) {
    to = parseInt(to, 10) || 0;
    if (prefersReduced || to === 0) { node.textContent = to; return; }
    var start = performance.now(), dur = 900;
    (function tick(now) {
      var p = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  /* ---- live status (server card + telemetry) ------------------------------ */
  function parseMotd(m) {
    if (!m) return "";
    var c = (m.clean != null) ? m.clean : m;          // mcstatus.io: string · mcsrvstat: array
    if (Array.isArray(c)) c = c.join("\n");
    return String(c).replace(/\n{2,}/g, "\n").trim();
  }
  function normalize(d) {
    return {
      online: !!d.online,
      count: d.players ? d.players.online : null,
      max: d.players ? d.players.max : null,
      version: (d.version && d.version.name_clean) ? d.version.name_clean : (typeof d.version === "string" ? d.version : null),
      motd: parseMotd(d.motd),
      icon: d.icon || null
    };
  }
  function fetchStatus(host) {
    var endpoints = [
      "https://api.mcstatus.io/v2/status/java/" + encodeURIComponent(host),
      "https://api.mcsrvstat.us/3/" + encodeURIComponent(host)
    ];
    return endpoints.reduce(function (chain, url) {
      return chain.catch(function () {
        return fetch(url).then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); })
          .then(function (d) { if (!d || typeof d.online === "undefined") throw new Error("shape"); return d; });
      });
    }, Promise.reject());
  }
  function initStatus() {
    var dot = $("#statusDot"), text = $("#statusText"), players = $("#playersOnline"), unit = players ? players.nextElementSibling : null, chip = $("#statusChip");
    var card = $("#serverCard"), scDot = $("#scDot"), scState = $("#scState"), scPlayers = $("#scPlayers"), scMax = $("#scPlayersMax"), scVer = $("#scVer"), scMotd = $("#scMotd"), scIcon = $("#scIcon"), scIconWrap = scIcon ? scIcon.parentNode : null;

    if (!SITE.liveStatus) {
      if (chip) chip.style.display = "none";
      if (players) { var it = players.closest(".telemetry__item"); if (it) it.style.display = "none"; }
      var sep = $("#telemetry .telemetry__sep"); if (sep) sep.style.display = "none";
      var statusSection = $("#status"); if (statusSection) statusSection.style.display = "none";
      return;
    }
    if (!SITE.statusHost) return;

    function offline(label) {
      if (dot) dot.setAttribute("data-state", "offline");
      if (text) text.textContent = label;
      if (players) players.textContent = "0";
      if (card) card.setAttribute("data-state", "offline");
      if (scDot) scDot.setAttribute("data-state", "offline");
      if (scState) scState.textContent = label;
      if (scPlayers) scPlayers.textContent = "0";
      if (scMotd) scMotd.textContent = "This server is offline or unreachable right now.";
      if (scVer) scVer.textContent = SITE.version || "—";
      if (scIconWrap) scIconWrap.classList.add("is-empty");
    }

    fetchStatus(SITE.statusHost).then(function (raw) {
      var d = normalize(raw);
      if (!d.online) { offline("Server offline"); return; }
      // telemetry
      if (dot) dot.setAttribute("data-state", "online");
      if (text) text.textContent = "Server online";
      if (players && d.count != null) countUp(players, d.count);
      if (unit && d.max != null) unit.textContent = "/ " + d.max + " online";
      // server card
      if (card) card.setAttribute("data-state", "online");
      if (scDot) scDot.setAttribute("data-state", "online");
      if (scState) scState.textContent = "Online";
      if (scPlayers && d.count != null) countUp(scPlayers, d.count);
      if (scMax && d.max != null) scMax.textContent = " / " + d.max;
      if (scVer) scVer.textContent = d.version || SITE.version || "—";
      if (scMotd) scMotd.textContent = d.motd ? d.motd : "Survival anarchy SMP. Connect on any version.";
      if (scIcon && scIconWrap) { if (d.icon) { scIcon.src = d.icon; scIconWrap.classList.remove("is-empty"); } else scIconWrap.classList.add("is-empty"); }
    }).catch(function () {
      if (dot) dot.setAttribute("data-state", "unknown");
      if (text) text.textContent = "Status unavailable";
      if (players) players.textContent = "—";
      if (card) card.setAttribute("data-state", "unknown");
      if (scDot) scDot.setAttribute("data-state", "unknown");
      if (scState) scState.textContent = "Status unavailable";
      if (scMotd) scMotd.textContent = "Couldn't reach the status service. The server may still be online, try connecting.";
      if (scPlayers) scPlayers.textContent = "—";
      if (scVer) scVer.textContent = SITE.version || "—";
      if (scIconWrap) scIconWrap.classList.add("is-empty");
    });
  }

  /* ---- lightbox ----------------------------------------------------------- */
  function showLightboxImage() {
    var im = galleryImages[lightboxIndex]; if (!im) return;
    var img = $("#lightboxImg"); img.src = im.src; img.alt = im.alt || im.caption || "";
    var cap = $("#lightboxCap"); if (cap) cap.textContent = im.caption || "";
    var multi = galleryImages.length > 1;
    var count = $("#lightboxCount"); if (count) count.textContent = multi ? (lightboxIndex + 1) + " / " + galleryImages.length : "";
    var prev = $("#lightboxPrev"), next = $("#lightboxNext");
    if (prev) prev.style.display = multi ? "" : "none";
    if (next) next.style.display = multi ? "" : "none";
  }
  function lightboxNav(dir) {
    if (!galleryImages.length) return;
    lightboxIndex = (lightboxIndex + dir + galleryImages.length) % galleryImages.length;
    showLightboxImage();
  }
  function initLightbox() {
    var dlg = $("#lightbox"); if (!dlg) return;
    var closeBtn = $("#lightboxClose");
    if (closeBtn) closeBtn.addEventListener("click", function () { closeDialog(dlg); });
    var prev = $("#lightboxPrev"), next = $("#lightboxNext");
    if (prev) prev.addEventListener("click", function (e) { e.stopPropagation(); lightboxNav(-1); });
    if (next) next.addEventListener("click", function (e) { e.stopPropagation(); lightboxNav(1); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) closeDialog(dlg); });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") lightboxNav(-1);
      else if (e.key === "ArrowRight") lightboxNav(1);
    });
  }
  function openLightbox(index) {
    var dlg = $("#lightbox"); if (!dlg) return;
    lightboxIndex = index || 0;
    showLightboxImage();
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }
  function closeDialog(dlg) { if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open"); }

  /* ---- scroll reveals (fade + wipe), with no-blank failsafe --------------- */
  function initReveals() {
    var nodes = $all(".reveal, .reveal-wipe");
    function revealAll() { nodes.forEach(function (n) { n.classList.add("is-visible"); }); }
    if (prefersReduced || !("IntersectionObserver" in window)) { revealAll(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var n = entry.target, i = parseInt(n.style.getPropertyValue("--i") || "0", 10);
        n.style.transitionDelay = Math.min(i, 8) * 60 + "ms";
        n.classList.add("is-visible"); io.unobserve(n);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    nodes.forEach(function (n) { io.observe(n); });
    var failsafe = setTimeout(revealAll, 2600);
    window.addEventListener("scroll", function once() { clearTimeout(failsafe); }, { passive: true, once: true });
  }

  /* ---- magnetic buttons + gallery cursor glow ----------------------------- */
  function initMagnetic() {
    if (prefersReduced || !finePointer) return;
    $all(".hero__cta .btn, .cta__inner .btn--lg").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5) * 10 + "px");
        btn.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5) * 10 + "px");
      });
      btn.addEventListener("mouseleave", function () { btn.style.setProperty("--mx", "0px"); btn.style.setProperty("--my", "0px"); });
    });
  }
  function initGlow() {
    if (prefersReduced || !finePointer) return;
    $all(".shot").forEach(function (shot) {
      shot.addEventListener("mousemove", function (e) {
        var r = shot.getBoundingClientRect();
        shot.style.setProperty("--gx", ((e.clientX - r.left) / r.width * 100) + "%");
        shot.style.setProperty("--gy", ((e.clientY - r.top) / r.height * 100) + "%");
      });
    });
  }

  /* ---- ambient ash + ember canvas ---------------------------------------- */
  function initAsh() {
    var canvas = $("#ashCanvas"); if (!canvas) return;
    var hero = $(".hero"), ctx = canvas.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, particles = [], raf = null;
    function size() { w = hero.offsetWidth; h = hero.offsetHeight; canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + "px"; canvas.style.height = h + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function make(ember) {
      return { x: Math.random() * w, y: ember ? h + Math.random() * 40 : Math.random() * h, r: ember ? 0.8 + Math.random() * 1.4 : 0.5 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.25, vy: ember ? -(0.25 + Math.random() * 0.5) : (0.15 + Math.random() * 0.5),
        a: ember ? 0.5 + Math.random() * 0.4 : 0.12 + Math.random() * 0.4, ember: ember, tw: Math.random() * Math.PI * 2 };
    }
    function seed() { particles = []; var count = Math.round(Math.min(70, Math.max(28, w / 16))); for (var i = 0; i < count; i++) particles.push(make(Math.random() < 0.22)); }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i]; p.x += p.vx; p.y += p.vy; p.tw += 0.05;
        var flick = p.ember ? (0.6 + Math.abs(Math.sin(p.tw)) * 0.4) : 1;
        if (p.ember) { ctx.fillStyle = "rgba(220,78,46," + (p.a * flick) + ")"; ctx.shadowColor = "rgba(220,78,46,0.8)"; ctx.shadowBlur = 6; }
        else { ctx.fillStyle = "rgba(205,205,215," + p.a + ")"; ctx.shadowBlur = 0; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        if (p.ember && p.y < -10) { Object.assign(p, make(true)); p.y = h + 10; }
        if (!p.ember && p.y > h + 10) { Object.assign(p, make(false)); p.y = -10; }
        if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20;
      }
      ctx.shadowBlur = 0; raf = requestAnimationFrame(draw);
    }
    function start() { if (!raf) raf = requestAnimationFrame(draw); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    size(); seed();
    if (prefersReduced) { draw(); stop(); return; }
    start();
    window.addEventListener("resize", function () { size(); seed(); });
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { (e[0].isIntersecting && !document.hidden) ? start() : stop(); }, { threshold: 0 }).observe(hero);
  }

  /* ---- launch countdown --------------------------------------------------- */
  function initCountdown() {
    var section = $("#countdown"); if (!section) return;
    var cfg = SITE.launch;
    if (!cfg || cfg.enabled === false || !cfg.date) { section.remove(); return; }
    var target = new Date(cfg.date).getTime();
    if (isNaN(target)) { section.remove(); return; }

    var labelEl = $("#cdLabel"); if (labelEl && cfg.label) labelEl.textContent = cfg.label;
    var dateEl = $("#cdDate"); if (dateEl && cfg.dateText) dateEl.textContent = cfg.dateText;
    var days = $("#cdDays"), hours = $("#cdHours"), mins = $("#cdMins"), secs = $("#cdSecs");
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    var timer;
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) { if (timer) clearInterval(timer); section.remove(); return; }
      days.textContent = pad(Math.floor(diff / 86400000));
      hours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
      mins.textContent = pad(Math.floor((diff % 3600000) / 60000));
      secs.textContent = pad(Math.floor((diff % 60000) / 1000));
    }
    tick();
    timer = setInterval(tick, 1000);
  }

  /* ---- Discord "coming soon" popup (intercept Discord clicks until launch) - */
  function initDiscordSoon() {
    if (!SITE.discordComingSoon) return;
    var dlg = $("#discordModal");
    function close() { if (!dlg) return; if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open"); }
    function open() { if (!dlg) return; if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", ""); }
    if (dlg) {
      ["#discordModalClose", "#discordModalGotit", "#discordModalCopy"].forEach(function (sel) {
        var b = $(sel); if (b) b.addEventListener("click", close);
      });
      dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });
    }
    // Any Discord link/button opens the popup instead of navigating.
    document.addEventListener("click", function (e) {
      var el = e.target.closest("a, button"); if (!el) return;
      var href = el.getAttribute("href");
      if (!el.matches('[data-href="discordUrl"]') && !(href && href === SITE.discordUrl)) return;
      e.preventDefault();
      open();
    }, true);
  }

  /* ---- auto-update: refresh open tabs when a new version is deployed ------- */
  function initAutoUpdate() {
    if (SITE.autoUpdate === false) return;
    var files = ["/", "/config.js", "/styles.css", "/main.js"];
    var current = null, checking = false, pending = false;
    function signature() {
      return Promise.all(files.map(function (f) {
        return fetch(f + (f.indexOf("?") < 0 ? "?" : "&") + "_=" + Date.now(), { method: "HEAD", cache: "no-store" })
          .then(function (r) { return r.headers.get("etag") || r.headers.get("last-modified") || r.headers.get("content-length") || ""; })
          .catch(function () { return "err"; });
      })).then(function (p) { return p.join("|"); });
    }
    function maybeReload() {
      if (!pending) return;
      if (document.querySelector("dialog[open]")) return;      // don't interrupt a popup
      if (document.hidden) { location.reload(); return; }       // refresh silently in the background
      pending = false;
      showToast("Refreshing for the latest version…");
      setTimeout(function () { location.reload(); }, 1600);
    }
    function check() {
      if (checking || navigator.onLine === false) return;
      checking = true;
      signature().then(function (sig) {
        checking = false;
        if (sig.indexOf("err") !== -1) return;                 // ignore transient network errors
        if (current === null) { current = sig; return; }       // establish baseline
        if (sig !== current) { current = sig; pending = true; }
        maybeReload();
      }).catch(function () { checking = false; });
    }
    check();
    setInterval(check, 90000);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) check(); });
  }

  /* ---- boot --------------------------------------------------------------- */
  function boot() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    initSmoothScroll();
    if (!location.hash) { window.scrollTo(0, 0); if (lenis) lenis.scrollTo(0, { immediate: true }); }

    hydrate();
    initCountdown();
    initCopy();
    initNav();
    initScrollFx();
    initAnchors();
    initStatus();
    initLightbox();
    initDiscordSoon();
    initReveals();
    initMagnetic();
    initGlow();
    initAsh();
    initAutoUpdate();

    // Hero entrance: trigger after first paint so the choreography plays cleanly.
    requestAnimationFrame(function () { requestAnimationFrame(function () { document.documentElement.classList.add("is-ready"); }); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
