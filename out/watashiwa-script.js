/* =====================================================
   Watashiwa Art — interactions
   GSAP + ScrollTrigger + Three.js
   ===================================================== */

import * as THREE from "three";

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

// Rough low-end device detection so we can lighten heavy effects.
const isLowPower =
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
  (navigator.deviceMemory && navigator.deviceMemory <= 4);

/* -----------------------------------------------------
   0. Shared runtime — one set of global listeners, rAF-batched.
   Prevents duplicate scroll/mousemove handlers and layout thrashing.
   ----------------------------------------------------- */
const rt = {
  scrollY: window.scrollY,
  docHeight: Math.max(document.documentElement.scrollHeight - window.innerHeight, 0),
  mouseX: window.innerWidth / 2,
  mouseY: window.innerHeight / 2,
  hidden: document.hidden,
};

const scrollSubs = new Set();
const pointerSubs = new Set();
const visSubs = new Set();
const resizeSubs = new Set();

let scrollTicking = false;
function flushScroll() {
  scrollTicking = false;
  rt.scrollY = window.scrollY;
  scrollSubs.forEach((fn) => fn(rt.scrollY));
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(flushScroll);
    }
  },
  { passive: true }
);

if (!isTouch) {
  window.addEventListener(
    "mousemove",
    (e) => {
      rt.mouseX = e.clientX;
      rt.mouseY = e.clientY;
      pointerSubs.forEach((fn) => fn(e));
    },
    { passive: true }
  );
}

document.addEventListener("visibilitychange", () => {
  rt.hidden = document.hidden;
  visSubs.forEach((fn) => fn(rt.hidden));
});

let resizeTimer;
window.addEventListener(
  "resize",
  () => {
    // Cache layout-affecting reads once per resize; debounce heavy work.
    rt.docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => resizeSubs.forEach((fn) => fn()), 150);
  },
  { passive: true }
);

/* -----------------------------------------------------
   1. Loading screen
   ----------------------------------------------------- */
function initLoader() {
  const fill = document.getElementById("loaderFill");
  const count = document.getElementById("loaderCount");
  let progress = 0;

  const tick = () => {
    progress += Math.random() * 12 + 4;
    if (progress >= 100) progress = 100;
    if (fill) fill.style.width = progress + "%";
    if (count) count.textContent = Math.floor(progress);

    if (progress < 100) {
      setTimeout(tick, 120);
    } else {
      setTimeout(() => {
        document.body.classList.add("is-loaded");
        startIntro();
      }, 400);
    }
  };
  tick();
}

/* -----------------------------------------------------
   2. Custom animated cursor
   ----------------------------------------------------- */
function initCursor() {
  if (isTouch) return;
  const cursor = document.getElementById("cursor");
  const dot = document.getElementById("cursorDot");
  if (!cursor || !dot) return;

  let cx = rt.mouseX;
  let cy = rt.mouseY;
  let rafId = null;

  // The trailing cursor only needs to animate while it's catching up to the
  // pointer. It parks itself once it settles, so it costs nothing when idle.
  const render = () => {
    const dx = rt.mouseX - cx;
    const dy = rt.mouseY - cy;
    cx += dx * 0.15;
    cy += dy * 0.15;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;

    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      rafId = requestAnimationFrame(render);
    } else {
      rafId = null;
    }
  };

  const wake = () => {
    if (rafId === null && !rt.hidden) rafId = requestAnimationFrame(render);
  };

  pointerSubs.add((e) => {
    // The dot tracks the pointer 1:1 (cheap, no smoothing loop needed).
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    wake();
  });

  visSubs.add((hidden) => {
    if (hidden && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!hidden) {
      wake();
    }
  });

  const labelMap = { view: "View", play: "Play" };

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    const type = el.getAttribute("data-cursor");
    el.addEventListener("mouseenter", () => {
      if (type === "hover") {
        cursor.classList.add("is-hover");
      } else if (labelMap[type]) {
        cursor.classList.add("is-label");
        cursor.setAttribute("data-label", labelMap[type]);
      }
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-hover", "is-label");
      cursor.removeAttribute("data-label");
    });
  });

  document.addEventListener("mouseleave", () => (cursor.style.opacity = "0"));
  document.addEventListener("mouseenter", () => (cursor.style.opacity = "1"));
}

/* -----------------------------------------------------
   3. Navigation
   ----------------------------------------------------- */
function initNav() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  let scrolled = false;
  const onScroll = (y) => {
    const next = y > 40;
    if (next !== scrolled) {
      scrolled = next;
      nav.classList.toggle("is-scrolled", next);
    }
  };
  onScroll(rt.scrollY);
  scrollSubs.add(onScroll);

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }
}

/* -----------------------------------------------------
   4. Scroll progress bar
   ----------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;
  // Uses the cached document height (rt.docHeight) to avoid a layout read
  // (scrollHeight/innerHeight) on every scroll frame.
  const onScroll = (y) => {
    const pct = rt.docHeight > 0 ? (y / rt.docHeight) * 100 : 0;
    bar.style.transform = `scaleX(${pct / 100})`;
  };
  onScroll(rt.scrollY);
  scrollSubs.add(onScroll);
  resizeSubs.add(() => onScroll(rt.scrollY));
}

/* -----------------------------------------------------
   5. Three.js hero particles
   ----------------------------------------------------- */
function initParticles() {
  const canvas = document.getElementById("particles");
  if (!canvas || prefersReduced) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 60;

  // antialias off (points don't benefit), and cap the pixel ratio to keep the
  // fragment count down on high-DPI screens — the biggest GPU cost here.
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "high-performance",
  });
  const maxDpr = isLowPower ? 1 : 1.5;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Particle field — scale count with device capability and screen size.
  const COUNT = isLowPower ? 350 : window.innerWidth < 768 ? 500 : 900;
  const positions = new Float32Array(COUNT * 3);
  const colorChoices = [
    new THREE.Color(0xe63946),
    new THREE.Color(0xd4af37),
    new THREE.Color(0x4fc3f7),
    new THREE.Color(0x8b5cf6),
    new THREE.Color(0xf5f5f5),
  ];
  const colors = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 140;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

    const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.55,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let targetX = 0;
  let targetY = 0;
  pointerSubs.add((e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.6;
  });

  // Render only while the hero canvas is on screen AND the tab is visible.
  let inView = true;
  let running = false;
  let rafId = null;
  const clock = new THREE.Clock();

  const frame = () => {
    const t = clock.getElapsedTime();
    points.rotation.y = t * 0.04 + targetX;
    points.rotation.x = targetY * 0.5;
    points.position.y = rt.scrollY * 0.02;
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running || !inView || rt.hidden) return;
    running = true;
    clock.start();
    rafId = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    clock.stop();
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      inView = entries[0].isIntersecting;
      inView ? start() : stop();
    },
    { threshold: 0.01 }
  );
  io.observe(canvas);

  visSubs.add((hidden) => (hidden ? stop() : start()));

  resizeSubs.add(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Free GPU resources when the page is torn down.
  window.addEventListener(
    "pagehide",
    () => {
      stop();
      io.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
    { once: true }
  );

  start();
}

/* -----------------------------------------------------
   6. Hero intro timeline (runs after loader)
   ----------------------------------------------------- */
function startIntro() {
  if (prefersReduced || typeof gsap === "undefined") {
    document
      .querySelectorAll("[data-reveal], [data-reveal-line] > *")
      .forEach((el) => (el.style.opacity = "1"));
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(".nav", { y: -40, opacity: 0, duration: 0.8 })
    .to(
      ".hero__title [data-reveal-line] .line, .hero .line",
      { y: 0, opacity: 1, duration: 1, stagger: 0.12 },
      "-=0.3"
    );

  // Animate hero title lines individually
  gsap.set(".hero__title .line", { y: "110%", opacity: 1 });
  gsap.to(".hero__title .line", {
    y: "0%",
    duration: 1.1,
    stagger: 0.14,
    ease: "power4.out",
    delay: 0.2,
  });

  gsap.to(".hero__eyebrow, .hero__subtitle, .hero__actions, .hero__stats", {
    opacity: 1,
    y: 0,
    duration: 0.9,
    stagger: 0.12,
    delay: 0.7,
    ease: "power3.out",
  });
  gsap.from(".hero__eyebrow, .hero__subtitle, .hero__actions, .hero__stats", {
    y: 24,
    duration: 0.9,
    stagger: 0.12,
    delay: 0.7,
    ease: "power3.out",
  });

  animateCounters();
}

/* -----------------------------------------------------
   7. Floating parallax elements
   ----------------------------------------------------- */
function initFloaters() {
  if (prefersReduced || typeof gsap === "undefined") return;
  gsap.utils.toArray(".floater").forEach((el, i) => {
    gsap.to(el, {
      y: i % 2 === 0 ? "+=30" : "-=30",
      x: i % 2 === 0 ? "-=15" : "+=15",
      rotation: i % 2 === 0 ? 8 : -8,
      duration: 6 + i,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });
}

/* -----------------------------------------------------
   8. Scroll reveals + parallax with ScrollTrigger
   ----------------------------------------------------- */
function initScrollReveals() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => (el.style.opacity = "1"));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  // Avoid ScrollTrigger refresh churn from mobile URL-bar resize events.
  ScrollTrigger.config({ ignoreMobileResize: true });

  if (prefersReduced) {
    document.querySelectorAll("[data-reveal]").forEach((el) => (el.style.opacity = "1"));
    return;
  }

  // Reveal elements outside the hero (hero handled by intro). One batched
  // observer instead of a ScrollTrigger per element, and `once` disposes each
  // trigger after it fires so nothing keeps recomputing on scroll.
  const reveals = gsap.utils
    .toArray("[data-reveal]")
    .filter((el) => !el.closest(".hero"));
  gsap.set(reveals, { opacity: 0, y: 40 });
  ScrollTrigger.batch(reveals, {
    start: "top 85%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        overwrite: true,
      }),
  });

  // Hero video subtle parallax
  gsap.to(".hero__video", {
    yPercent: 15,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // Card media parallax — skip the scrub work on low-power devices.
  if (!isLowPower) {
    gsap.utils.toArray(".card").forEach((card) => {
      gsap.fromTo(
        card,
        { yPercent: 6 },
        {
          yPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    });
  }
}

/* -----------------------------------------------------
   9. Animated stat counters
   ----------------------------------------------------- */
function animateCounters() {
  const nums = document.querySelectorAll("[data-count]");
  nums.forEach((el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    if (typeof gsap === "undefined") {
      el.textContent = target;
      return;
    }
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      delay: 1,
      ease: "power2.out",
      onUpdate: () => (el.textContent = Math.floor(obj.val)),
    });
  });
}

/* -----------------------------------------------------
   10. Newsletter form (placeholder handler)
   ----------------------------------------------------- */
function initForm() {
  const form = document.getElementById("joinForm");
  const note = document.getElementById("joinNote");
  const email = document.getElementById("joinEmail");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = email.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!valid) {
      note.style.color = "var(--crimson)";
      note.textContent = "Please enter a valid email address.";
      return;
    }
    note.style.color = "var(--gold)";
    note.textContent = "Thank you — your invitation is on its way.";
    form.reset();
  });
}

/* -----------------------------------------------------
   Footer year
   ----------------------------------------------------- */
function initYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

/* =====================================================
   11. Documentary data — History of Animation
   ===================================================== */
const ANIMATION_HISTORY = [
  {
    era: "c. 180 AD",
    title: "Ancient Optical Toys",
    kicker: "The First Illusions of Motion",
    body:
      "Long before film, humans chased the illusion of movement. Early devices such as the thaumatrope and painted spinning discs exploited persistence of vision, proving that a rapid sequence of still images could trick the eye into seeing life.",
    facts: ["Persistence of vision", "Hand-painted discs", "Pre-cinema era"],
    img: "/assets/images/anim-01-optical-toys.jpg",
  },
  {
    era: "1659",
    title: "The Magic Lantern",
    kicker: "Projected Light & Painted Glass",
    body:
      "Christiaan Huygens' magic lantern projected hand-painted glass slides onto walls, delighting audiences with ghostly moving images. It was the ancestor of every projector and the first mass spectacle of projected imagery.",
    facts: ["Glass slide projection", "Phantasmagoria shows", "Ancestor of cinema"],
    img: "/assets/images/anim-02-magic-lantern.jpg",
  },
  {
    era: "1834",
    title: "The Zoetrope",
    kicker: "The Wheel of Life",
    body:
      "A spinning drum lined with a strip of sequential drawings, viewed through slits, produced fluid motion. The zoetrope made animation a shareable parlour marvel and standardised the idea of the frame sequence.",
    facts: ["Sequential frames", "Slit-viewing drum", "Parlour entertainment"],
    img: "/assets/images/anim-03-zoetrope.jpg",
  },
  {
    era: "1877",
    title: "The Praxinoscope",
    kicker: "Émile Reynaud's Mirror Magic",
    body:
      "Reynaud replaced the zoetrope's slits with an inner ring of mirrors, delivering brighter, smoother motion. His later Théâtre Optique projected the first animated films to a paying public — arguably the birth of the medium.",
    facts: ["Mirror reflection", "Théâtre Optique", "First projected cartoons"],
    img: "/assets/images/anim-04-praxinoscope.jpg",
  },
  {
    era: "1900s–1927",
    title: "The Silent Era",
    kicker: "Pioneers of the Drawn Frame",
    body:
      "Artists like Winsor McCay and the early studios hand-inked thousands of drawings. Techniques such as cel animation and registration pegs were invented, turning animation from novelty into an industry.",
    facts: ["Cel animation invented", "Winsor McCay", "Studio pipelines"],
    img: "/assets/images/anim-05-silent-era.jpg",
  },
  {
    era: "1928–1937",
    title: "The Disney Revolution",
    kicker: "Sound, Color & Feature Films",
    body:
      "Synchronised sound, full color and the first feature-length animated film transformed cartoons into emotional cinema. Multiplane cameras added depth, and character animation became a serious craft.",
    facts: ["Synchronised sound", "Technicolor", "First animated feature"],
    img: "/assets/images/anim-06-disney.jpg",
  },
  {
    era: "1940s–1950s",
    title: "The Golden Age",
    kicker: "Studios at Their Peak",
    body:
      "Rival studios pushed timing, squash-and-stretch and comedic staging to dazzling heights. The theatrical short cartoon became a beloved, refined art form watched by millions worldwide.",
    facts: ["Theatrical shorts", "Principles of animation", "Mass audiences"],
    img: "/assets/images/anim-07-golden-age.jpg",
  },
  {
    era: "1958–1980s",
    title: "Television Animation",
    kicker: "Limited Animation for the Small Screen",
    body:
      "To meet the relentless pace of broadcast, studios pioneered limited animation — reusing cels and holding frames. It made daily and weekly serialized cartoons economically possible for the first time.",
    facts: ["Limited animation", "Serialized series", "Broadcast economics"],
    img: "/assets/images/anim-08-tv.jpg",
  },
  {
    era: "1970s–1990s",
    title: "Computer Animation",
    kicker: "The Digital Toolset Emerges",
    body:
      "Early vector graphics, motion control and digital ink-and-paint began replacing manual processes. Computers first assisted, then generated, imagery — quietly rewriting how frames were produced.",
    facts: ["Digital ink & paint", "Vector graphics", "Motion control"],
    img: "/assets/images/anim-09-computer.jpg",
  },
  {
    era: "1995",
    title: "The CGI Revolution",
    kicker: "The First Fully Computer-Animated Feature",
    body:
      "The arrival of the first feature made entirely with computer graphics proved 3D animation could carry a full narrative. Rendering, rigging and simulation became the new frontier of the art form.",
    facts: ["Full 3D features", "Rigging & rendering", "Physics simulation"],
    img: "/assets/images/anim-10-cgi.jpg",
  },
  {
    era: "2000s–Today",
    title: "Modern Digital Animation",
    kicker: "Hybrid Craft & Global Reach",
    body:
      "Today hand-drawn tradition, 3D pipelines and real-time engines blend freely. Streaming has globalised animation, while new tools let small teams achieve what once required entire studios.",
    facts: ["Real-time engines", "2D + 3D hybrids", "Global streaming"],
    img: "/assets/images/anim-11-modern.jpg",
  },
];

/* Documentary data — History of Japanese Anime */
const ANIME_HISTORY = [
  {
    era: "1917",
    title: "Early Japanese Animation",
    kicker: "The First Domestic Films",
    body:
      "Japan's earliest animators produced short silent films using paper and chalkboard techniques. Working largely alone, these pioneers established a homegrown tradition distinct from Western studios.",
    facts: ["Silent shorts", "Paper animation", "Lone pioneers"],
    img: "/assets/images/anime-01-early.jpg",
  },
  {
    era: "1946–1989",
    title: "Osamu Tezuka",
    kicker: "The God of Manga & Anime",
    body:
      "Tezuka's cinematic paneling and expressive characters revolutionised manga, and his studio brought that energy to the screen. He defined the large-eyed style and industrial workflow that would shape everything after.",
    facts: ["Cinematic paneling", "Expressive style", "Studio founder"],
    img: "/assets/images/anime-02-tezuka.jpg",
  },
  {
    era: "1963",
    title: "Astro Boy",
    kicker: "Weekly TV Anime is Born",
    body:
      "The first hit weekly animated TV series in Japan established limited-animation techniques and the serialized model. Its success proved a sustainable domestic anime industry was possible.",
    facts: ["First weekly TV anime", "Limited animation", "Serialized model"],
    img: "/assets/images/anime-03-astroboy.jpg",
  },
  {
    era: "1970s",
    title: "The 1970s",
    kicker: "Giant Robots & Space Epics",
    body:
      "Mecha and sprawling space operas gave anime ambitious science-fiction storytelling and merchandising power. A generation of directors matured, laying groundwork for the coming boom.",
    facts: ["Mecha genre", "Space opera", "Merchandising"],
    img: "/assets/images/anime-04-70s.jpg",
  },
  {
    era: "1980s",
    title: "The 1980s Boom",
    kicker: "OVAs & Cinematic Ambition",
    body:
      "Home video birthed the OVA format, freeing creators from broadcast limits. Lavish theatrical films pushed detail and scale, earning anime international critical attention for the first time.",
    facts: ["OVA format", "Theatrical features", "Global attention"],
    img: "/assets/images/anime-05-80s.jpg",
  },
  {
    era: "1990s",
    title: "1990s Classics",
    kicker: "The Golden Wave",
    body:
      "Landmark TV series and films fused psychological depth, complex worldbuilding and dazzling sakuga. Anime became a defining cultural export, building devoted fandoms across the globe.",
    facts: ["Psychological depth", "Sakuga highlights", "Global fandom"],
    img: "/assets/images/anime-06-90s.jpg",
  },
  {
    era: "2000s",
    title: "2000s Digital Era",
    kicker: "From Cel to Pixel",
    body:
      "Studios abandoned physical cels for fully digital production. Digital compositing, color and 3D integration expanded visual possibilities while accelerating output for a growing worldwide market.",
    facts: ["Digital production", "3D integration", "Faster pipelines"],
    img: "/assets/images/anime-07-2000s.jpg",
  },
  {
    era: "2010s–Today",
    title: "The Modern Industry",
    kicker: "Streaming & Worldwide Demand",
    body:
      "Global streaming platforms fund and distribute anime instantly worldwide. Record box-office hits and viral series have made anime a mainstream pillar of global entertainment culture.",
    facts: ["Global streaming", "Record box office", "Mainstream culture"],
    img: "/assets/images/anime-08-modern.jpg",
  },
];

const DOC_DATA = { animation: ANIMATION_HISTORY, anime: ANIME_HISTORY };

/* =====================================================
   12. Render interactive documentary timelines
   ===================================================== */
function initDocTimelines() {
  document.querySelectorAll(".doc-timeline").forEach((root) => {
    const key = root.getAttribute("data-doc");
    const data = DOC_DATA[key];
    if (!data) return;

    const nav = root.querySelector(".doc-timeline__nav");
    const host = root.querySelector("[data-panel-host]");
    if (!nav || !host) return;

    // Build chapter chips
    data.forEach((item, i) => {
      const btn = document.createElement("button");
      btn.className = "doc-chip";
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("data-cursor", "hover");
      btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
      btn.innerHTML =
        '<span class="doc-chip__dot" aria-hidden="true"></span>' +
        '<span class="doc-chip__era">' + item.era + "</span>" +
        '<span class="doc-chip__name">' + item.title + "</span>";
      btn.addEventListener("click", () => setPanel(i));
      nav.appendChild(btn);
    });

    const chips = Array.from(nav.querySelectorAll(".doc-chip"));

    function render(item) {
      const factList = item.facts
        .map((f) => '<li class="doc-panel__fact">' + f + "</li>")
        .join("");
      host.innerHTML =
        '<div class="doc-panel__media">' +
          '<span class="doc-panel__badge">' + item.era + "</span>" +
          '<img src="' + item.img + '" alt="' + item.title + '" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" />' +
        "</div>" +
        '<div class="doc-panel__text">' +
          '<p class="doc-panel__kicker">' + item.kicker + "</p>" +
          '<h3 class="doc-panel__title">' + item.title + "</h3>" +
          '<p class="doc-panel__body">' + item.body + "</p>" +
          '<ul class="doc-panel__facts">' + factList + "</ul>" +
        "</div>";
    }

    function setPanel(i) {
      chips.forEach((c, idx) => {
        c.classList.toggle("is-active", idx === i);
        c.setAttribute("aria-selected", idx === i ? "true" : "false");
      });
      chips[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });

      render(data[i]);

      if (typeof gsap !== "undefined" && !prefersReduced) {
        gsap.fromTo(
          host.children,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }
        );
      }
    }

    chips[0].classList.add("is-active");
    render(data[0]);
  });
}

/* =====================================================
   13. Animation studios — premium glass cards
   ===================================================== */
const STUDIOS = [
  {
    name: "Studio Ghibli",
    jp: "スタジオジブリ",
    founder: "Miyazaki, Takahata & Suzuki",
    founded: "1985",
    best: "Timeless hand-drawn fantasy features",
    achievement: "Academy Award–winning animated films",
    site: "https://www.ghibli.jp/",
    youtube: "https://www.youtube.com/@ghibli",
    accent: "gold",
  },
  {
    name: "MAPPA",
    jp: "マッパ",
    founder: "Masao Maruyama",
    founded: "2011",
    best: "High-intensity modern action series",
    achievement: "Global streaming phenomena",
    site: "https://www.mappa.co.jp/",
    youtube: "https://www.youtube.com/@mappa_info",
    accent: "crimson",
  },
  {
    name: "WIT Studio",
    jp: "ウィットスタジオ",
    founder: "Nakatake & George Wada",
    founded: "2012",
    best: "Dynamic, kinetic action animation",
    achievement: "Acclaimed high-fidelity TV productions",
    site: "https://witstudio.co.jp/",
    youtube: "https://www.youtube.com/@witstudio",
    accent: "blue",
  },
  {
    name: "Ufotable",
    jp: "ユーフォーテーブル",
    founder: "Hikaru Kondo",
    founded: "2000",
    best: "Lavish effects-driven battle scenes",
    achievement: "Record-breaking animated films",
    site: "https://www.ufotable.com/",
    youtube: "https://www.youtube.com/@ufotable",
    accent: "crimson",
  },
  {
    name: "Kyoto Animation",
    jp: "京都アニメーション",
    founder: "Yoko Hatta",
    founded: "1981",
    best: "Delicate, expressive character drama",
    achievement: "Renowned in-house craft & consistency",
    site: "https://www.kyotoanimation.co.jp/",
    youtube: "https://www.youtube.com/@kyotoanimation",
    accent: "blue",
  },
  {
    name: "Production I.G",
    jp: "プロダクションI.G",
    founder: "Ishikawa & Goto",
    founded: "1987",
    best: "Cerebral sci-fi & cyberpunk",
    achievement: "Internationally influential filmmaking",
    site: "https://www.production-ig.co.jp/",
    youtube: "https://www.youtube.com/@productionig",
    accent: "purple",
  },
  {
    name: "Bones",
    jp: "ボンズ",
    founder: "Minami, Ōsaka & Kawamoto",
    founded: "1998",
    best: "Fluid, energetic action storytelling",
    achievement: "Beloved long-running franchises",
    site: "https://www.bones.co.jp/",
    youtube: "https://www.youtube.com/@bones_official",
    accent: "crimson",
  },
  {
    name: "Madhouse",
    jp: "マッドハウス",
    founder: "Maruyama, Dezaki & others",
    founded: "1972",
    best: "Diverse, director-driven classics",
    achievement: "Decades of critically praised works",
    site: "https://www.madhouse.co.jp/",
    youtube: null,
    accent: "gold",
  },
  {
    name: "Sunrise",
    jp: "サンライズ",
    founder: "Former Mushi Production staff",
    founded: "1972",
    best: "Landmark giant-robot sagas",
    achievement: "Founder of the modern mecha genre",
    site: "https://www.sunrise-inc.co.jp/",
    youtube: "https://www.youtube.com/@SUNRISE_channel",
    accent: "blue",
  },
  {
    name: "A-1 Pictures",
    jp: "エーワン・ピクチャーズ",
    founder: "Aniplex",
    founded: "2005",
    best: "Polished, wide-ranging productions",
    achievement: "Numerous chart-topping hit series",
    site: "https://a1p.jp/",
    youtube: null,
    accent: "gold",
  },
  {
    name: "Trigger",
    jp: "トリガー",
    founder: "Imaishi & Otsuka",
    founded: "2011",
    best: "Bold, exuberant stylised action",
    achievement: "Cult-favourite original works",
    site: "https://www.st-trigger.co.jp/",
    youtube: "https://www.youtube.com/@TRIGGER.official",
    accent: "crimson",
  },
  {
    name: "Toei Animation",
    jp: "東映アニメーション",
    founder: "Toei Company",
    founded: "1948",
    best: "Iconic long-running adventure epics",
    achievement: "One of anime's oldest, most influential studios",
    site: "https://www.toei-anim.co.jp/",
    youtube: "https://www.youtube.com/@toeianimation",
    accent: "gold",
  },
];

function initStudioCards() {
  const grid = document.getElementById("studioCards");
  if (!grid) return;

  const ytIcon =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 12s0-3.9-.5-5.8a3 3 0 0 0-2.1-2.1C18.5 3.5 12 3.5 12 3.5s-6.5 0-8.4.6A3 3 0 0 0 1.5 6.2C1 8.1 1 12 1 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 8.4.6 8.4.6s6.5 0 8.4-.6a3 3 0 0 0 2.1-2.1C23 15.9 23 12 23 12zM9.8 15.5v-7l6.1 3.5-6.1 3.5z"/></svg>';
  const linkIcon =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 3h7v7M21 3l-9 9M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  STUDIOS.forEach((s) => {
    const card = document.createElement("article");
    card.className = "studio-card studio-card--" + s.accent;
    card.setAttribute("data-reveal", "");
    card.setAttribute("data-cursor", "hover");
    card.innerHTML =
      '<div class="studio-card__glow" aria-hidden="true"></div>' +
      '<div class="studio-card__top">' +
        '<span class="studio-card__logo" aria-hidden="true">' + s.jp + "</span>" +
        '<span class="studio-card__year">Est. ' + s.founded + "</span>" +
      "</div>" +
      '<h3 class="studio-card__name">' + s.name + "</h3>" +
      '<dl class="studio-card__facts">' +
        "<div><dt>Founder</dt><dd>" + s.founder + "</dd></div>" +
        "<div><dt>Founded</dt><dd>" + s.founded + "</dd></div>" +
        "<div><dt>Best Works</dt><dd>" + s.best + "</dd></div>" +
        "<div><dt>Achievements</dt><dd>" + s.achievement + "</dd></div>" +
      "</dl>" +
      '<div class="studio-card__actions">' +
        '<a class="studio-btn studio-btn--site" href="' + s.site + '" target="_blank" rel="noopener noreferrer" data-cursor="hover">' +
          linkIcon + "Website</a>" +
        (s.youtube
          ? '<a class="studio-btn studio-btn--yt" href="' + s.youtube + '" target="_blank" rel="noopener noreferrer" data-cursor="hover">' +
            ytIcon + "YouTube</a>"
          : "") +
      "</div>";
    grid.appendChild(card);
  });
}

/* =====================================================
   14. Popular Anime — data + premium cards + trailers
   ===================================================== */
const POPULAR_ANIME = [
  {
    title: "Attack on Titan",
    jp: "進撃の巨人",
    studio: "WIT Studio · MAPPA",
    year: "2013–2023",
    genre: "Dark Fantasy · Action",
    summary:
      "Humanity's last survivors huddle behind colossal walls, hunted by man-eating giants. A sweeping tragedy of freedom, war and the terrible cost of the truth behind the walls.",
    popularity: "One of the best-selling manga and most-watched anime of all time",
    awards: "Harvey Award · multiple Crunchyroll Anime Awards",
    site: "https://shingeki.tv/",
    trailer: "iHZv1rHy3zw",
    img: "/assets/images/anime/attack-on-titan.webp",
    accent: "crimson",
  },
  {
    title: "Demon Slayer",
    jp: "鬼滅の刃",
    studio: "Ufotable",
    year: "2019–present",
    genre: "Dark Fantasy · Action",
    summary:
      "After demons slaughter his family, a kind-hearted boy becomes a demon slayer to save his transformed sister — through breathtaking, water-like sword animation.",
    popularity: "Record-shattering box office and global streaming success",
    awards: "Multiple Crunchyroll Anime Awards including Anime of the Year",
    site: "https://kimetsu.com/anime/",
    trailer: "wyiZWYMilgk",
    img: "/assets/images/anime/demon-slayer.webp",
    accent: "blue",
  },
  {
    title: "Jujutsu Kaisen",
    jp: "呪術廻戦",
    studio: "MAPPA",
    year: "2020–present",
    genre: "Dark Fantasy · Supernatural",
    summary:
      "A student swallows a cursed relic and joins a secret school of sorcerers battling the malevolent spirits born from human negativity.",
    popularity: "A defining global hit of its generation",
    awards: "Crunchyroll Anime Awards — multiple wins",
    site: "https://jujutsukaisen.jp/",
    trailer: "pkKu9hLT-t8",
    img: "/assets/images/anime/jujutsu-kaisen.webp",
    accent: "purple",
  },
  {
    title: "Chainsaw Man",
    jp: "チェンソーマン",
    studio: "MAPPA",
    year: "2022–present",
    genre: "Action · Horror",
    summary:
      "A destitute young man fused with his chainsaw devil-dog becomes a devil hunter, in a raw, chaotic story about desire, poverty and being human.",
    popularity: "A breakout modern manga and anime phenomenon",
    awards: "Harvey Award nominee · widespread critical acclaim",
    site: "https://chainsawman.dog/",
    trailer: "l96zmDlWCBk",
    img: "/assets/images/anime/chainsaw-man.webp",
    accent: "crimson",
  },
  {
    title: "Frieren",
    jp: "葬送のフリーレン",
    studio: "Madhouse",
    year: "2023–present",
    genre: "Adventure · Drama",
    summary:
      "An elven mage who outlives her hero companions sets out to understand the humans she never took the time to know — a quiet meditation on memory and time.",
    popularity: "A critical darling and beloved modern classic",
    awards: "Anime of the Year, Crunchyroll Anime Awards",
    site: "https://frieren-anime.jp/",
    trailer: "Iwr1aLEDpe4",
    img: "/assets/images/anime/frieren.webp",
    accent: "gold",
  },
  {
    title: "Solo Leveling",
    jp: "俺だけレベルアップな件",
    studio: "A-1 Pictures",
    year: "2024–present",
    genre: "Action · Fantasy",
    summary:
      "The world's weakest hunter gains the unique power to grow infinitely stronger, rising from the bottom to become a shadow monarch.",
    popularity: "The most anticipated action anime of its debut year",
    awards: "New Anime of the Year, Crunchyroll Anime Awards",
    site: "https://sololeveling-anime.net/",
    trailer: "YvGSK8mIlt8",
    img: "/assets/images/anime/solo-leveling.webp",
    accent: "purple",
  },
  {
    title: "Spy × Family",
    jp: "スパイファミリー",
    studio: "WIT Studio · CloverWorks",
    year: "2022–present",
    genre: "Comedy · Action",
    summary:
      "A master spy, a telepathic child and an assassin form a fake family for a mission — and slowly, accidentally, become a real one.",
    popularity: "A worldwide feel-good sensation",
    awards: "Multiple Crunchyroll Anime Award nominations",
    site: "https://spy-family.net/",
    trailer: "ofXigq9aIpo",
    img: "/assets/images/anime/spy-family.webp",
    accent: "crimson",
  },
  {
    title: "Vinland Saga",
    jp: "ヴィンランド・サガ",
    studio: "WIT Studio · MAPPA",
    year: "2019–present",
    genre: "Historical · Drama",
    summary:
      "A young Viking consumed by revenge journeys through a brutal age, searching for a life beyond violence in the legendary land of Vinland.",
    popularity: "Widely regarded as a modern masterpiece",
    awards: "Kodansha Manga Award · Eisner Award nominee",
    site: "https://vinlandsaga.jp/",
    trailer: "H3fS-bZ4e2E",
    img: "/assets/images/anime/vinland-saga.webp",
    accent: "blue",
  },
  {
    title: "Blue Lock",
    jp: "ブルーロック",
    studio: "8bit",
    year: "2022–present",
    genre: "Sports · Thriller",
    summary:
      "Japan's top strikers are locked in a ruthless facility to forge the ultimate egoist — a hyper-stylised, high-stakes take on football.",
    popularity: "A best-selling sports manga adapted to acclaim",
    awards: "Kodansha Manga Award (Shōnen)",
    site: "https://bluelock-pj.com/",
    trailer: "ZLVUIpbbpXc",
    img: "/assets/images/anime/blue-lock.webp",
    accent: "blue",
  },
  {
    title: "Oshi no Ko",
    jp: "推しの子",
    studio: "Doga Kobo",
    year: "2023–present",
    genre: "Drama · Mystery",
    summary:
      "Reborn as the children of their favourite idol, two souls confront the dazzling and dark realities of the entertainment industry.",
    popularity: "A viral hit with a record-breaking opening theme",
    awards: "Manga Taishō · Tezuka Osamu Cultural Prize nominee",
    site: "https://ichigoproduction.com/",
    trailer: "owauGV029V8",
    img: "/assets/images/anime/oshi-no-ko.webp",
    accent: "crimson",
  },
  {
    title: "Dandadan",
    jp: "ダンダダン",
    studio: "Science SARU",
    year: "2024–present",
    genre: "Action · Supernatural Comedy",
    summary:
      "Two teens argue over whether ghosts or aliens are real — then discover both exist, launching a wild, kinetic, heartfelt paranormal ride.",
    popularity: "One of the most explosive recent debuts",
    awards: "Highly acclaimed by critics worldwide",
    site: "https://dandadan.net/",
    trailer: "0XJxfbN36Uw",
    img: "/assets/images/anime/dandadan.webp",
    accent: "gold",
  },
  {
    title: "Kaiju No. 8",
    jp: "怪獣8号",
    studio: "Production I.G",
    year: "2024–present",
    genre: "Action · Sci-Fi",
    summary:
      "A cleanup worker who dreamed of joining the Defense Force gains the power to become a kaiju — and must hide his monstrous secret.",
    popularity: "A chart-topping manga with a blockbuster adaptation",
    awards: "Widely nominated across major anime awards",
    site: "https://kaiju-no8.com/",
    trailer: "FsAKMsUjaK0",
    img: "/assets/images/anime/kaiju-no-8.webp",
    accent: "blue",
  },
  {
    title: "The Apothecary Diaries",
    jp: "薬屋のひとりごと",
    studio: "OLM · TOHO Animation",
    year: "2023–present",
    genre: "Historical · Mystery",
    summary:
      "A sharp-witted apothecary sold into an imperial palace solves poisonings and court intrigue with cool, clinical brilliance.",
    popularity: "A beloved, critically praised sleeper hit",
    awards: "Anime of the Year winner, Crunchyroll Anime Awards",
    site: "https://kusuriyanohitorigoto.jp/",
    trailer: "XYNGkSvFT8c",
    img: "/assets/images/anime/apothecary-diaries.webp",
    accent: "gold",
  },
  {
    title: "Witch Hat Atelier",
    jp: "とんがり帽子のアトリエ",
    studio: "Bug Films",
    year: "2025–present",
    genre: "Fantasy · Adventure",
    summary:
      "A girl who believed magic was beyond her discovers it is simply drawn — and apprentices herself to a world of ink, wonder and quiet rules.",
    popularity: "One of the most admired fantasy manga of the decade",
    awards: "Eisner Award winner · Harvey Award winner",
    site: "https://www.witch-hat-anime.com/",
    trailer: "hMmBSCQs1H4",
    img: "/assets/images/anime/witch-hat-atelier.webp",
    accent: "blue",
  },
  {
    title: "Spirited Away",
    jp: "千と千尋の神隠し",
    studio: "Studio Ghibli",
    year: "2001",
    genre: "Fantasy · Adventure",
    summary:
      "A sullen young girl wanders into a spirit world and must work in a bathhouse for the gods to free her parents — Miyazaki's timeless masterpiece of courage and wonder.",
    popularity: "The highest-grossing Japanese film for two decades and a global icon",
    awards: "Academy Award for Best Animated Feature · Golden Bear, Berlin",
    site: "https://www.ghibli.jp/works/chihiro/",
    trailer: "ByXuk9QqQkk",
    img: "/assets/images/anime/spirited-away.webp",
    accent: "gold",
  },
];

function initPopularAnime() {
  const grid = document.getElementById("animeGrid");
  if (!grid) return;

  const linkIcon =
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 3h7v7M21 3l-9 9M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const playIcon =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

  POPULAR_ANIME.forEach((a) => {
    const card = document.createElement("article");
    card.className = "anime-card anime-card--" + a.accent;
    card.setAttribute("data-reveal", "");
    card.innerHTML =
      '<div class="anime-card__media" data-cursor="play" role="button" tabindex="0" aria-label="Play ' + a.title + ' trailer">' +
        '<img src="' + a.img + '" alt="' + a.title + ' key art" loading="lazy" decoding="async" width="1024" height="1024" ' +
        'onerror="this.classList.add(\'is-missing\');this.removeAttribute(\'src\');this.setAttribute(\'data-fallback\',\'' + a.img + '\')" />' +
        '<span class="anime-card__genre">' + a.genre + "</span>" +
        '<span class="anime-card__jp" aria-hidden="true">' + a.jp + "</span>" +
        '<span class="anime-card__playbtn" aria-hidden="true">' + playIcon + "Trailer</span>" +
      "</div>" +
      '<div class="anime-card__body">' +
        '<div class="anime-card__head">' +
          '<h3 class="anime-card__title">' + a.title + "</h3>" +
          '<span class="anime-card__year">' + a.year + "</span>" +
        "</div>" +
        '<p class="anime-card__studio">' + a.studio + "</p>" +
        '<p class="anime-card__summary">' + a.summary + "</p>" +
        '<dl class="anime-card__facts">' +
          "<div><dt>Popularity</dt><dd>" + a.popularity + "</dd></div>" +
          "<div><dt>Awards</dt><dd>" + a.awards + "</dd></div>" +
        "</dl>" +
        '<div class="anime-card__actions">' +
          '<button class="anime-btn anime-btn--play" type="button" data-cursor="hover">' + playIcon + "Official Trailer</button>" +
          '<a class="anime-btn anime-btn--site" href="' + a.site + '" target="_blank" rel="noopener noreferrer" data-cursor="hover">' + linkIcon + "Website</a>" +
        "</div>" +
      "</div>";

    const open = () => {
      lastTrailerTrigger = document.activeElement;
      openTrailer(a.trailer, a.title);
    };
    card.querySelector(".anime-card__media").addEventListener("click", open);
    card.querySelector(".anime-card__media").addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
    card.querySelector(".anime-btn--play").addEventListener("click", open);

    grid.appendChild(card);
  });
}

/* Trailer lightbox */
let lastTrailerTrigger = null;

function initTrailerModal() {
  const modal = document.getElementById("trailerModal");
  if (!modal) return;
  modal.querySelectorAll("[data-trailer-close]").forEach((el) =>
    el.addEventListener("click", closeTrailer)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeTrailer();
  });
}

function openTrailer(id, title) {
  const modal = document.getElementById("trailerModal");
  const frame = document.getElementById("trailerFrame");
  if (!modal || !frame) return;
  frame.innerHTML =
    '<iframe src="https://www.youtube-nocookie.com/embed/' + id +
    '?autoplay=1&rel=0" title="' + title + ' official trailer" ' +
    'frameborder="0" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" ' +
    'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  modal.querySelector(".trailer-modal__close")?.focus();
  if (typeof gsap !== "undefined" && !prefersReduced) {
    gsap.fromTo(".trailer-modal__inner", { opacity: 0, scale: 0.92, y: 24 },
      { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "power3.out" });
  }
}

function closeTrailer() {
  const modal = document.getElementById("trailerModal");
  const frame = document.getElementById("trailerFrame");
  if (!modal || !modal.classList.contains("is-open")) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  frame.innerHTML = "";
  if (lastTrailerTrigger instanceof HTMLElement) lastTrailerTrigger.focus();
  lastTrailerTrigger = null;
}

/* =====================================================
   15. Legendary Creators
   ===================================================== */
const CREATORS = [
  {
    name: "Hayao Miyazaki",
    jp: "宮崎 駿",
    role: "Director · Co-founder, Studio Ghibli",
    img: "/assets/images/creators/miyazaki.webp",
    bio: "A humanist storyteller whose hand-drawn worlds brim with flight, wind and wonder, Miyazaki is the most celebrated animator of his generation.",
    career: "Began in television animation before co-founding Studio Ghibli in 1985, directing a run of beloved features across four decades.",
    works: ["Spirited Away", "My Neighbor Totoro", "Princess Mononoke", "Howl's Moving Castle"],
    legacy: "Won the Academy Award for Best Animated Feature twice and an Honorary Oscar, elevating animation to world cinema.",
    accent: "gold",
  },
  {
    name: "Osamu Tezuka",
    jp: "手塚 治虫",
    role: "Mangaka · Founder, Mushi Production",
    img: "/assets/images/creators/tezuka.webp",
    bio: "Revered as the 'God of Manga', Tezuka's cinematic storytelling and expressive characters defined the language of both manga and anime.",
    career: "Prolific author of hundreds of works who launched Japan's first weekly TV anime and industrialised its production.",
    works: ["Astro Boy", "Black Jack", "Kimba the White Lion", "Phoenix"],
    legacy: "His visual grammar and workflow shaped virtually every artist who followed; the Tezuka Award bears his name.",
    accent: "crimson",
  },
  {
    name: "Makoto Shinkai",
    jp: "新海 誠",
    role: "Director · Writer",
    img: "/assets/images/creators/shinkai.webp",
    bio: "Known for luminous skies and tender long-distance longing, Shinkai fuses breathtaking backgrounds with intimate emotional storytelling.",
    career: "Started as a near-solo digital creator before scaling to blockbuster features that top box offices worldwide.",
    works: ["Your Name", "Weathering with You", "Suzume", "5 Centimeters per Second"],
    legacy: "Your Name became one of the highest-grossing anime films ever, defining a new mainstream era.",
    accent: "blue",
  },
  {
    name: "Satoshi Kon",
    jp: "今 敏",
    role: "Director · Screenwriter",
    img: "/assets/images/creators/kon.webp",
    bio: "A visionary of memory, identity and dreams, Kon blurred reality and illusion with razor-sharp editing years ahead of his time.",
    career: "A former manga artist who directed four features and a series before his untimely death, each a masterclass in montage.",
    works: ["Perfect Blue", "Paprika", "Millennium Actress", "Paranoia Agent"],
    legacy: "His match-cut editing and dreamlike structure influenced filmmakers far beyond animation.",
    accent: "purple",
  },
  {
    name: "Mamoru Hosoda",
    jp: "細田 守",
    role: "Director · Founder, Studio Chizu",
    img: "/assets/images/creators/hosoda.webp",
    bio: "A chronicler of family, growth and the digital age, Hosoda pairs warm humanism with bold explorations of virtual worlds.",
    career: "Rose through television animation before founding Studio Chizu, becoming one of anime's leading contemporary auteurs.",
    works: ["Wolf Children", "Summer Wars", "Mirai", "The Boy and the Beast"],
    legacy: "Mirai earned an Academy Award nomination, cementing his global standing.",
    accent: "gold",
  },
  {
    name: "Hideaki Anno",
    jp: "庵野 秀明",
    role: "Director · Co-founder, Studio Khara",
    img: "/assets/images/creators/anno.webp",
    bio: "A restless deconstructionist, Anno turned the mecha genre inward, mixing spectacle with raw psychological introspection.",
    career: "An acclaimed animator turned director who reinvented giant-robot storytelling and later live-action tokusatsu.",
    works: ["Neon Genesis Evangelion", "The End of Evangelion", "Rebuild of Evangelion", "Shin Godzilla"],
    legacy: "Evangelion reshaped anime's themes, aesthetics and industry economics for decades.",
    accent: "crimson",
  },
  {
    name: "Naoko Yamada",
    jp: "山田 尚子",
    role: "Director",
    img: "/assets/images/creators/yamada.webp",
    bio: "A master of quiet gesture and body language, Yamada renders adolescence, music and empathy with rare delicacy.",
    career: "Directed acclaimed television and film work at Kyoto Animation before continuing her singular style at new studios.",
    works: ["A Silent Voice", "K-On!", "Liz and the Blue Bird", "The Colors Within"],
    legacy: "One of anime's most distinctive contemporary directors and a leading voice among its women filmmakers.",
    accent: "blue",
  },
];

function initCreators() {
  const list = document.getElementById("creatorList");
  if (!list) return;

  CREATORS.forEach((c, i) => {
    const worksList = c.works
      .map((w) => '<li class="creator__work">' + w + "</li>")
      .join("");
    const row = document.createElement("article");
    row.className = "creator creator--" + c.accent + (i % 2 === 1 ? " creator--flip" : "");
    row.setAttribute("data-reveal", "");
    row.innerHTML =
      '<div class="creator__portrait">' +
        '<img src="' + c.img + '" alt="Photo of ' + c.name + '" loading="lazy" decoding="async" width="1024" height="1024" />' +
        '<span class="creator__jp" aria-hidden="true">' + c.jp + "</span>" +
      "</div>" +
      '<div class="creator__body">' +
        '<p class="creator__role">' + c.role + "</p>" +
        '<h3 class="creator__name">' + c.name + "</h3>" +
        '<p class="creator__bio">' + c.bio + "</p>" +
        '<div class="creator__cols">' +
          '<div class="creator__col"><h4>Career</h4><p>' + c.career + "</p></div>" +
          '<div class="creator__col"><h4>Legacy</h4><p>' + c.legacy + "</p></div>" +
        "</div>" +
        '<div class="creator__works-wrap">' +
          "<h4>Major Works</h4>" +
          '<ul class="creator__works">' + worksList + "</ul>" +
        "</div>" +
      "</div>";
    list.appendChild(row);
  });
}

/* =====================================================
   16. Animation Pipeline — GSAP animated flow
   ===================================================== */
const PIPELINE_STEPS = [
  { n: "01", title: "Idea", jp: "着想", desc: "A concept, theme or image sparks the entire production." },
  { n: "02", title: "Script", jp: "脚本", desc: "The story is written into scenes, dialogue and structure." },
  { n: "03", title: "Storyboard", jp: "絵コンテ", desc: "Rough panels map out shots, timing and camera flow." },
  { n: "04", title: "Layout", jp: "レイアウト", desc: "Compositions, perspective and staging are locked per cut." },
  { n: "05", title: "Key Animation", jp: "原画", desc: "Lead artists draw the defining poses of every motion." },
  { n: "06", title: "In-between", jp: "動画", desc: "Frames between keys are drawn to make motion fluid." },
  { n: "07", title: "Background Art", jp: "背景", desc: "Painted environments give each scene depth and place." },
  { n: "08", title: "Color", jp: "彩色", desc: "Characters and elements are digitally painted and shaded." },
  { n: "09", title: "Compositing", jp: "撮影", desc: "Layers, light and effects are merged into finished shots." },
  { n: "10", title: "Editing", jp: "編集", desc: "Cuts, sound and pacing are assembled into sequences." },
  { n: "11", title: "Final Animation", jp: "完成", desc: "The polished film is mastered and delivered to screens." },
];

function initPipeline() {
  const flow = document.getElementById("pipelineFlow");
  if (!flow) return;

  const arrow =
    '<div class="pipeline__arrow" aria-hidden="true">' +
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4v16M6 14l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    "</div>";

  PIPELINE_STEPS.forEach((s, i) => {
    const step = document.createElement("div");
    step.className = "pipeline__step";
    step.innerHTML =
      '<div class="pipeline__card" data-cursor="hover">' +
        '<span class="pipeline__num">' + s.n + "</span>" +
        '<span class="pipeline__jp" aria-hidden="true">' + s.jp + "</span>" +
        '<h3 class="pipeline__title">' + s.title + "</h3>" +
        '<p class="pipeline__desc">' + s.desc + "</p>" +
      "</div>";
    flow.appendChild(step);
    if (i < PIPELINE_STEPS.length - 1) {
      const a = document.createElement("div");
      a.innerHTML = arrow;
      flow.appendChild(a.firstElementChild);
    }
  });

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReduced) {
    flow.querySelectorAll(".pipeline__step, .pipeline__arrow").forEach((el) => (el.style.opacity = "1"));
    return;
  }

  gsap.utils.toArray("#pipelineFlow .pipeline__step").forEach((step) => {
    gsap.fromTo(
      step,
      { opacity: 0, y: 40, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: step, start: "top 88%", toggleActions: "play none none none" },
      }
    );
  });

  gsap.utils.toArray("#pipelineFlow .pipeline__arrow").forEach((a) => {
    gsap.fromTo(
      a,
      { opacity: 0, y: -8 },
      {
        opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: a, start: "top 90%", toggleActions: "play none none none" },
      }
    );
  });
}

/* =====================================================
   17. Anime Culture — expandable premium glass cards
   ===================================================== */
const CULTURE = [
  {
    key: "manga",
    title: "Manga",
    jp: "漫画",
    accent: "crimson",
    tagline: "The printed source of the anime universe",
    overview:
      "Manga are Japanese comics read across every age and genre. The vast majority of popular anime begin their life as a serialized manga, making it the creative bedrock of the entire medium.",
    history:
      "Rooted in centuries-old illustrated scrolls and ukiyo-e woodblock prints, modern manga crystallised in the postwar era. Osamu Tezuka's cinematic paneling in the late 1940s reinvented the form and established the industry that followed.",
    modern:
      "Weekly and monthly magazines still discover hits, but digital platforms now distribute manga instantly worldwide. Chart-topping series routinely sell hundreds of millions of copies and drive the anime, film and merchandise economy.",
    icon:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h5v18H6a2 2 0 0 1-2-2z"/><path d="M20 5a2 2 0 0 0-2-2h-5v18h5a2 2 0 0 0 2-2z"/></svg>',
  },
  {
    key: "light-novels",
    title: "Light Novels",
    jp: "ライトノベル",
    accent: "gold",
    tagline: "Illustrated prose that fuels adaptations",
    overview:
      "Light novels are young-adult prose works, punctuated by manga-style illustrations. They are a major pipeline for anime, spawning many of the biggest fantasy and isekai franchises.",
    history:
      "Emerging from pulp fiction magazines in the late twentieth century, the format matured in the 1990s and 2000s as dedicated imprints turned breakout titles into multimedia franchises.",
    modern:
      "Web-novel platforms now let amateur authors go viral before being picked up for print and animation, feeding an endless stream of new worlds to the screen.",
    icon:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M18 7h2v13H7"/><path d="M8 8h6M8 11h6"/></svg>',
  },
  {
    key: "voice-acting",
    title: "Voice Acting",
    jp: "声優",
    accent: "blue",
    tagline: "The seiyū who give characters a soul",
    overview:
      "Seiyū (voice actors) are celebrated artists in Japan. Their performances define a character's personality and are central to how audiences bond with a series.",
    history:
      "The profession grew alongside radio drama and early TV anime in the 1960s, gradually evolving into a respected, competitive craft with its own training schools.",
    modern:
      "Top seiyū are pop-culture stars who headline concerts, release music and pack fan events — voice performance is now a genuine celebrity career.",
    icon:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 17v5M8 22h8"/></svg>',
  },
  {
    key: "anime-music",
    title: "Anime Music",
    jp: "アニメ音楽",
    accent: "purple",
    tagline: "Openings, endings and unforgettable scores",
    overview:
      "Music is inseparable from anime — from iconic opening themes to sweeping orchestral scores that carry a story's emotional weight.",
    history:
      "Theme songs became a defining ritual of TV anime from the 1960s onward, and composers steadily elevated soundtracks into standalone artistic works.",
    modern:
      "Anime openings regularly top global streaming charts, and artists gain worldwide fame through a single hit theme, blurring the line between anime and the wider music industry.",
    icon:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  },
  {
    key: "festivals",
    title: "Anime Festivals",
    jp: "アニメの祭典",
    accent: "crimson",
    tagline: "Where global fandom gathers in person",
    overview:
      "Conventions and festivals bring fans, artists and studios together for premieres, panels, screenings and community celebration on a massive scale.",
    history:
      "Fan-run gatherings from the 1970s and 1980s grew into enormous annual events, spreading from Japan to every continent.",
    modern:
      "Today's festivals draw hundreds of thousands of attendees, host world premieres and act as major cultural and economic engines for the industry.",
    icon:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l6-14 6 14M4 20h12M2 20h20"/><path d="M14 6l6 14h2"/><circle cx="10" cy="4" r="1.4"/></svg>',
  },
  {
    key: "cosplay",
    title: "Cosplay",
    jp: "コスプレ",
    accent: "gold",
    tagline: "Fans becoming the characters they love",
    overview:
      "Cosplay is the art of crafting and wearing costumes to embody beloved characters — a creative discipline blending sewing, prop-making and performance.",
    history:
      "The practice gained its name and momentum at Japanese and American conventions in the 1980s, quickly becoming a hallmark of fan culture.",
    modern:
      "Cosplay is now a global creative economy, with professional makers, competitions and social-media stars building careers from their craft.",
    icon:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l3 3-3 2-3-2z"/><path d="M9 8l-4 3 2 3 2-1v7h6v-7l2 1 2-3-4-3"/></svg>',
  },
  {
    key: "merchandise",
    title: "Merchandise",
    jp: "グッズ",
    accent: "blue",
    tagline: "Figures, goods and collectible art",
    overview:
      "From museum-grade figures to everyday goods, merchandise lets fans bring their favourite worlds into daily life — and is a financial pillar of the industry.",
    history:
      "Character goods have accompanied anime since the mecha boom of the 1970s made toy tie-ins essential to a show's financing.",
    modern:
      "Precision-crafted figures, apparel and collaborations form a multibillion-dollar market that often outweighs broadcast revenue itself.",
    icon:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1 12H7z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  },
  {
    key: "streaming",
    title: "Streaming Platforms",
    jp: "配信",
    accent: "purple",
    tagline: "The engine of anime's global boom",
    overview:
      "Streaming services deliver anime to a worldwide audience the moment it airs, erasing the delays and borders that once limited its reach.",
    history:
      "Fan communities and early legal platforms in the 2000s proved global demand; major services soon began licensing and funding anime directly.",
    modern:
      "Platforms now co-produce original series, offer instant subtitles in dozens of languages, and have made anime a mainstream global entertainment category.",
    icon:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M10 8.5l4 2.5-4 2.5z" fill="currentColor" stroke="none"/></svg>',
  },
];

function initCulture() {
  const grid = document.getElementById("cultureGrid");
  if (!grid) return;

  const chevron =
    '<svg class="culture-card__chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  CULTURE.forEach((c) => {
    const panelId = "culture-panel-" + c.key;
    const card = document.createElement("article");
    card.className = "culture-card culture-card--" + c.accent;
    card.setAttribute("role", "listitem");
    card.setAttribute("data-reveal", "");
    card.innerHTML =
      '<div class="culture-card__glow" aria-hidden="true"></div>' +
      '<button class="culture-card__head" type="button" aria-expanded="false" aria-controls="' + panelId + '" data-cursor="hover">' +
        '<span class="culture-card__icon" aria-hidden="true">' + c.icon + "</span>" +
        '<span class="culture-card__heading">' +
          '<span class="culture-card__jp" aria-hidden="true">' + c.jp + "</span>" +
          '<span class="culture-card__title">' + c.title + "</span>" +
          '<span class="culture-card__tagline">' + c.tagline + "</span>" +
        "</span>" +
        chevron +
      "</button>" +
      '<div class="culture-card__panel" id="' + panelId + '" role="region" aria-label="' + c.title + ' details">' +
        '<div class="culture-card__panel-inner">' +
          '<div class="culture-card__block"><h4>Overview</h4><p>' + c.overview + "</p></div>" +
          '<div class="culture-card__block"><h4>Historical significance</h4><p>' + c.history + "</p></div>" +
          '<div class="culture-card__block"><h4>Modern influence</h4><p>' + c.modern + "</p></div>" +
        "</div>" +
      "</div>";

    const head = card.querySelector(".culture-card__head");
    const panel = card.querySelector(".culture-card__panel");

    head.addEventListener("click", () => {
      const open = card.classList.toggle("is-open");
      head.setAttribute("aria-expanded", String(open));
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
    });

    // Keep an open panel correctly sized when the viewport changes.
    resizeSubs.add(() => {
      if (card.classList.contains("is-open")) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });

    grid.appendChild(card);
  });
}

/* =====================================================
   18. Future of Animation — cinematic scroll timeline
   ===================================================== */
const FUTURE = [
  {
    tag: "01",
    title: "AI in Animation",
    jp: "AI アニメーション",
    accent: "blue",
    body:
      "Machine-learning tools now assist with in-betweening, clean-up, upscaling and color, accelerating tedious stages so artists can focus on performance and staging. Used as a brush rather than a replacement, it expands what small teams can achieve.",
    points: ["Assisted in-betweening", "Automated clean-up", "Smart upscaling"],
  },
  {
    tag: "02",
    title: "Hybrid Animation",
    jp: "ハイブリッド",
    accent: "crimson",
    body:
      "The most striking modern work fuses hand-drawn 2D with 3D layouts, giving directors cinematic camera moves while preserving the warmth and line of traditional animation.",
    points: ["2D over 3D layouts", "Cel-shaded rendering", "Drawn + rendered blends"],
  },
  {
    tag: "03",
    title: "Virtual Production",
    jp: "バーチャル制作",
    accent: "gold",
    body:
      "Borrowed from live-action film, LED volumes and real-time environments let creators light, frame and shoot inside fully digital worlds — collapsing the gap between pre-production and final image.",
    points: ["LED volumes", "Live compositing", "In-camera VFX"],
  },
  {
    tag: "04",
    title: "Real-time Rendering",
    jp: "リアルタイム",
    accent: "purple",
    body:
      "Game engines render broadcast-quality frames instantly, turning slow render farms into interactive sessions where lighting and camera can be judged live on set.",
    points: ["Engine-based frames", "Instant iteration", "Interactive lighting"],
  },
  {
    tag: "05",
    title: "Stylized 3D",
    jp: "スタイライズ 3D",
    accent: "blue",
    body:
      "New shading techniques make 3D models read as beautifully drawn 2D art, giving studios the flexibility of CG without sacrificing the distinctive anime aesthetic.",
    points: ["Non-photoreal shading", "Line-art on 3D", "Anime-faithful CG"],
  },
  {
    tag: "06",
    title: "Global Anime Industry",
    jp: "世界産業",
    accent: "crimson",
    body:
      "International funding, co-productions and worldwide simultaneous release have made anime a truly global industry — reshaping budgets, schedules and the kinds of stories that get told.",
    points: ["Global co-productions", "Simultaneous release", "Worldwide funding"],
  },
];

function initFuture() {
  const wrap = document.getElementById("futureTimeline");
  if (!wrap) return;

  FUTURE.forEach((f, i) => {
    const node = document.createElement("article");
    node.className = "future-node future-node--" + f.accent + (i % 2 === 1 ? " future-node--right" : "");
    node.setAttribute("data-reveal", "");
    const pointList = f.points
      .map((p) => '<li class="future-node__point">' + p + "</li>")
      .join("");
    node.innerHTML =
      '<span class="future-node__marker" aria-hidden="true"><span class="future-node__pulse"></span></span>' +
      '<div class="future-node__card" data-cursor="hover">' +
        '<div class="future-node__glow" aria-hidden="true"></div>' +
        '<div class="future-node__top">' +
          '<span class="future-node__tag">' + f.tag + "</span>" +
          '<span class="future-node__jp" aria-hidden="true">' + f.jp + "</span>" +
        "</div>" +
        '<h3 class="future-node__title">' + f.title + "</h3>" +
        '<p class="future-node__body">' + f.body + "</p>" +
        '<ul class="future-node__points">' + pointList + "</ul>" +
      "</div>";
    wrap.appendChild(node);
  });

  const fill = document.getElementById("futureRailFill");
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined" && !prefersReduced) {
    // Progressively fill the rail as the section scrolls through the viewport.
    if (fill) {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        }
      );
    }
  } else if (fill) {
    fill.style.transform = "scaleY(1)";
  }
}

/* -----------------------------------------------------
   Boot
   ----------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initCursor();
  initNav();
  initScrollProgress();
  initParticles();
  initFloaters();
  initDocTimelines();
  initStudioCards();
  initPopularAnime();
  initTrailerModal();
  initCreators();
  initPipeline();
  initCulture();
  initFuture();
  initScrollReveals();
  initForm();
  initYear();
});
