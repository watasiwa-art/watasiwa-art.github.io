/* ============================================================
   Watashiwa Art — Interactions, GSAP & Three.js
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('is-loading');

  /* ---------------- Loader ---------------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const bar = loader.querySelector('.loader__bar span');
    if (bar) bar.animate([{ width: '0%' }, { width: '100%' }], { duration: 900, fill: 'forwards', easing: 'ease' });
    setTimeout(() => {
      loader.classList.add('is-done');
      document.body.classList.remove('is-loading');
      startIntro();
    }, 1000);
  });

  /* ---------------- Year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Nav ---------------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav__links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---------------- Cursor glow ---------------- */
  const glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(hover: hover)').matches) {
    let gx = 0, gy = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', e => { gx = e.clientX; gy = e.clientY; });
    (function loop() {
      cx += (gx - cx) * 0.12; cy += (gy - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------------- Gallery data ---------------- */
  const galleryItems = [
    { cat: 'artwork', img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80', title: 'Ink & Motion', tag: 'Anime Artwork' },
    { cat: 'background', img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', title: 'Golden Fields', tag: 'Background Painting' },
    { cat: 'character', img: 'https://images.unsplash.com/photo-1607604276583-eef5d76aa3d9?w=800&q=80', title: 'Character Study', tag: 'Character Design' },
    { cat: 'background', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', title: 'Misty Valley', tag: 'Background Painting' },
    { cat: 'artwork', img: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&q=80', title: 'Neon Dream', tag: 'Anime Artwork' },
    { cat: 'character', img: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=800&q=80', title: 'Silent Hero', tag: 'Character Design' },
    { cat: 'background', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', title: 'Forest Path', tag: 'Background Painting' },
    { cat: 'artwork', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80', title: 'Watercolor Sky', tag: 'Anime Artwork' },
    { cat: 'character', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80', title: 'Studio Sketch', tag: 'Character Design' }
  ];

  const grid = document.getElementById('galleryGrid');
  function renderGallery(filter) {
    grid.innerHTML = '';
    galleryItems
      .filter(i => filter === 'all' || i.cat === filter)
      .forEach(i => {
        const el = document.createElement('figure');
        el.className = 'gcard';
        el.innerHTML =
          '<img src="' + i.img + '" alt="' + i.title + ' — ' + i.tag + '" loading="lazy" />' +
          '<figcaption class="gcard__cap"><span>' + i.tag + '</span><h4>' + i.title + '</h4></figcaption>';
        grid.appendChild(el);
      });
  }
  renderGallery('all');

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      renderGallery(chip.dataset.filter);
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  /* ---------------- Process steps ---------------- */
  const steps = [
    { t: 'Idea', d: 'Every animation begins with a spark — a concept, a feeling, a story worth telling. Direction, tone, and vision are born here.' },
    { t: 'Storyboard', d: 'The story is sketched shot by shot, defining framing, camera movement, and the rhythm of the scene before a single drawing is finalized.' },
    { t: 'Layout', d: 'Backgrounds, perspective, and character positioning are planned in space, establishing the stage on which the action will unfold.' },
    { t: 'Key Animation', d: 'The most important poses — the keys — are drawn by lead animators, capturing the essence of movement and emotion.' },
    { t: 'In-between', d: 'Frames are filled between the keys to create smooth, continuous motion, breathing life and fluidity into the action.' },
    { t: 'Background', d: 'Painted backgrounds establish mood, depth, and atmosphere, turning line work into a believable, lived-in world.' },
    { t: 'Color', d: 'Every cel and element is colored with careful palettes, unifying characters and environments under consistent light.' },
    { t: 'Composite', d: 'Layers, effects, lighting, and camera are combined into the final frame — the moment drawings truly become cinema.' }
  ];

  const stepsEl = document.getElementById('processSteps');
  const track = document.getElementById('processTrack');
  const pdNum = document.querySelector('.process__num');
  const pdTitle = document.getElementById('pdTitle');
  const pdText = document.getElementById('pdText');

  steps.forEach((s, idx) => {
    const li = document.createElement('li');
    li.className = 'process__step' + (idx === 0 ? ' is-active' : '');
    li.innerHTML = '<span class="dot"></span><span class="label">' + s.t + '</span>';
    li.addEventListener('mouseenter', () => setStep(idx));
    li.addEventListener('click', () => setStep(idx));
    stepsEl.appendChild(li);
  });

  function setStep(idx) {
    const s = steps[idx];
    document.querySelectorAll('.process__step').forEach((el, i) => el.classList.toggle('is-active', i <= idx));
    track.style.setProperty('--fill', (idx / (steps.length - 1)) * 100 + '%');
    if (window.gsap && !reduceMotion) {
      gsap.fromTo('#processDetail', { opacity: 0.3, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    }
    pdNum.textContent = String(idx + 1).padStart(2, '0');
    pdTitle.textContent = s.t;
    pdText.textContent = s.d;
  }
  setStep(0);

  /* ---------------- GSAP scroll animations ---------------- */
  function startIntro() {
    if (!window.gsap || reduceMotion) {
      document.querySelectorAll('[data-anim]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
      document.querySelector('.skills')?.classList.add('is-in');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Hero intro
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero__title .line em, .hero__title .line', { yPercent: 110, duration: 1.1, stagger: 0.12 })
      .from('.hero__eyebrow', { y: 24, opacity: 0, duration: 0.8 }, '-=0.7')
      .from('.hero__lead', { y: 24, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.hero__actions', { y: 24, opacity: 0, duration: 0.8 }, '-=0.6');

    // Parallax hero video
    gsap.to('.hero__video', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Generic reveals
    gsap.utils.toArray('[data-anim="up"]').forEach(el => {
      gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' } });
    });

    // Timeline cards
    gsap.utils.toArray('[data-anim="tl"]').forEach(el => {
      gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' } });
    });

    // Studio cards
    gsap.utils.toArray('[data-anim="card"]').forEach((el, i) => {
      gsap.from(el, { y: 60, opacity: 0, duration: 0.9, ease: 'power3.out', delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: el, start: 'top 90%' } });
    });

    // Timeline progress line
    const tlLine = document.getElementById('timelineLine');
    if (tlLine) {
      ScrollTrigger.create({
        trigger: '.timeline', start: 'top 60%', end: 'bottom 70%', scrub: true,
        onUpdate: self => tlLine.style.setProperty('--progress', (self.progress * 100) + '%')
      });
    }

    // Skills bars
    ScrollTrigger.create({ trigger: '#skills', start: 'top 80%', once: true,
      onEnter: () => document.querySelector('.skills').classList.add('is-in') });

    ScrollTrigger.refresh();
  }

  /* ---------------- Three.js particle field ---------------- */
  (function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas || !window.THREE || reduceMotion) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
    camera.position.z = 60;

    const COUNT = 700;
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 180;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
      speeds[i] = 0.02 + Math.random() * 0.06;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xe23b41, size: 0.9, transparent: true, opacity: 0.75,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // second, dimmer gold layer
    const geo2 = geo.clone();
    const mat2 = new THREE.PointsMaterial({ color: 0xd9b46a, size: 0.6, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false });
    const points2 = new THREE.Points(geo2, mat2);
    points2.position.z = -20;
    scene.add(points2);

    let mx = 0, my = 0;
    window.addEventListener('mousemove', e => {
      mx = (e.clientX / window.innerWidth - 0.5);
      my = (e.clientY / window.innerHeight - 0.5);
    });

    function resize() {
      const hero = document.getElementById('hero');
      const w = hero.clientWidth, h = hero.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    const pos = geo.attributes.position.array;
    function animate() {
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3 + 1] += speeds[i];
        if (pos[i * 3 + 1] > 60) pos[i * 3 + 1] = -60;
      }
      geo.attributes.position.needsUpdate = true;
      geo2.attributes.position.needsUpdate = true;

      points.rotation.y += 0.0006;
      points2.rotation.y -= 0.0004;
      camera.position.x += (mx * 12 - camera.position.x) * 0.04;
      camera.position.y += (-my * 8 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  })();
})();
