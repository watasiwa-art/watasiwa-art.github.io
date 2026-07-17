/* =========================================================
   WATASHIWA ART — script.js
   Loader, custom cursor, nav behavior, GSAP ScrollTrigger
   reveals, and a Three.js particle field for the hero.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('is-hidden'), 900);
  });
  // Fallback in case 'load' already fired or is slow to fire
  setTimeout(() => loader && loader.classList.add('is-hidden'), 3000);

  /* ---------- CUSTOM CURSOR ---------- */
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  if (cursor && cursorRing && window.matchMedia('(hover: hover)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    const animateRing = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    };
    animateRing();
    document.querySelectorAll('a, button, .studio-card, .anime-card, .pipeline__step').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });
  }

  /* ---------- NAV ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active link highlighting via IntersectionObserver
  const navAnchors = Array.from(document.querySelectorAll('[data-nav]'));
  const sections = navAnchors
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = '#' + entry.target.id;
        const link = navAnchors.find(a => a.getAttribute('href') === id);
        if (!link) return;
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach(sec => observer.observe(sec));
  }

  /* ---------- GSAP SCROLL REVEALS ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero reveal sequence
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
      .to('.hero__title-line', { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, '-=0.4')
      .to('.hero__subtitle', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
      .to('.hero__cta', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');

    // Section heads
    gsap.utils.toArray('.section__head').forEach(head => {
      gsap.from(head.children, {
        opacity: 0, y: 30, duration: 0.8, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: head, start: 'top 80%' }
      });
    });

    // Timeline items
    gsap.utils.toArray('.timeline__item').forEach((item, i) => {
      gsap.to(item, {
        opacity: 1, x: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 85%' }
      });
    });

    // Studio / anime / culture / future cards
    gsap.utils.toArray('.studio-card, .anime-card, .culture-card, .future-card, .creator').forEach((card) => {
      gsap.from(card, {
        opacity: 0, y: 40, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 88%' }
      });
    });

    // Pipeline steps
    gsap.utils.toArray('.pipeline__step').forEach((step, i) => {
      gsap.from(step, {
        opacity: 0, y: 24, duration: 0.6, delay: (i % 5) * 0.05, ease: 'power2.out',
        scrollTrigger: { trigger: step, start: 'top 92%' }
      });
    });
  } else {
    // Graceful fallback: just show everything if GSAP failed to load (e.g. offline)
    document.querySelectorAll('[data-reveal], .timeline__item').forEach(el => {
      el.style.opacity = 1; el.style.transform = 'none';
    });
  }

  /* ---------- THREE.JS HERO PARTICLE FIELD ---------- */
  const canvas = document.getElementById('heroCanvas');
  if (canvas && window.THREE && !reduceMotion) {
    const heroSection = document.getElementById('top');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const setSize = () => {
      const w = heroSection.clientWidth, h = heroSection.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    setSize();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle field — evokes drifting embers / falling sakura light
    const count = window.innerWidth < 700 ? 220 : 500;
    const positions = new Float32Array(count * 3);
    const colorChoices = [
      new THREE.Color(0xE63946),
      new THREE.Color(0xD4AF37),
      new THREE.Color(0x4FC3F7),
      new THREE.Color(0x8B5CF6),
    ];
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5);
      mouseY = (e.clientY / window.innerHeight - 0.5);
    });

    const clock = new THREE.Clock();
    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.02 + mouseX * 0.3;
      points.rotation.x = mouseY * 0.15;
      points.position.y = Math.sin(t * 0.1) * 2;
      renderer.render(scene, camera);
    };
    animate();

    // Pause rendering when hero is off-screen (perf)
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!rafId) animate();
          } else {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        });
      }, { threshold: 0.05 });
      heroObserver.observe(heroSection);
    }

    window.addEventListener('resize', () => {
      setSize();
    });
  }

  /* ---------- GLOBAL sendPrompt helper (for future widget use) ---------- */
  window.sendPrompt = window.sendPrompt || function(){};
});
