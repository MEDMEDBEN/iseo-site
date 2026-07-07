/* ============================================================
   ISEO Premium — interactions & 3D
   Requires (CDN): Lenis, GSAP, ScrollTrigger, Three.js
   ============================================================ */

/* ---------- SVG icons ---------- */
const ICON = {
  cylinder:'<circle cx="12" cy="12" r="4"/><path d="M12 16v5"/><path d="M10 21h4"/>',
  padlock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  safe:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M12 10v-1M12 15v1M14 12h1M9 12h1"/>',
  access:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 12a3 3 0 1 1 6 0c0 2-3 2.5-3 4"/><path d="M12 18h.01"/>',
  install:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5Z"/>',
  bolt:'<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
  shield:'<path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z"/><path d="m9.5 12 1.8 1.8L15 10"/>',
  key:'<circle cx="8" cy="8" r="4"/><path d="m11 11 9 9"/><path d="m16 16 2-2M18.5 18.5 20 17"/>',
  headset:'<path d="M4 13a8 8 0 0 1 16 0"/><rect x="2" y="13" width="4" height="7" rx="1.5"/><rect x="18" y="13" width="4" height="7" rx="1.5"/><path d="M20 20a4 4 0 0 1-4 3h-2"/>',
  truck:'<path d="M3 6h11v9H3z"/><path d="M14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  arrow:'<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  phone:'<path d="M4 4h5l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v5a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2Z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  pin:'<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chat:'<path d="M4 5h16v11H9l-4 4V5Z"/><path d="M8 10h8M8 13h5"/>',
  spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
};
const svg = (name, w=24) => `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICON[name]||''}</svg>`;
window.svg = svg;

/* image fallback: swap broken photos for a branded gradient */
window.imgFallback = (el) => { el.classList.add('img-fallback'); el.removeAttribute('src'); };

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderDynamic();
  initCursor();
  initNav();
  initLoader();
  initReveal();
  initCounters();
  initMagnetic();
  initTilt();
  initHeroSlideshow();
  initLenisGsap();
  initCinemaDoors();
  initGallery();
});

/* ---------- Render data-driven sections ---------- */
function renderDynamic() {
  const cats = document.getElementById('cats');
  if (cats && window.ISEO_CATS) cats.innerHTML = window.ISEO_CATS.map(c => `
    <a class="cat cursor-target" href="produits.html#${c.id}">
      <div class="cat__ico">${svg(c.icon)}</div>
      <div><h3>${c.name}</h3><span>${c.count} produits</span></div>
      <div class="cat__glow"></div>
    </a>`).join('');

  const grid = document.getElementById('prod-grid');
  if (grid && window.ISEO_PRODUCTS) {
    const list = grid.dataset.limit ? window.ISEO_PRODUCTS.slice(0, +grid.dataset.limit) : window.ISEO_PRODUCTS;
    grid.innerHTML = list.map(cardHTML).join('');
    bindCardSpotlight(grid);
  }

  const serv = document.getElementById('serv-list');
  if (serv && window.ISEO_SERVICES) serv.innerHTML = window.ISEO_SERVICES.map(s => `
    <div class="serv cursor-target reveal">
      <div class="serv__num">${s.n}</div>
      <div class="serv__main"><h3>${s.name}</h3><p>${s.desc}</p></div>
      <div class="serv__ico">${svg(s.icon)}</div>
    </div>`).join('');

  const steps = document.getElementById('steps');
  if (steps && window.ISEO_STEPS) steps.innerHTML = window.ISEO_STEPS.map(s => `
    <div class="step reveal"><b>${s.n}</b><h4>${s.t}</h4><p>${s.d}</p></div>`).join('');
}

function cardHTML(p) {
  const tagTxt = { best:'Best-seller', secure:'Haute sécurité', new:'Nouveau' }[p.tag];
  return `
  <article class="pcard cursor-target" data-cat="${p.cat}">
    <div class="pcard__media">
      ${tagTxt ? `<span class="pcard__tag ${p.tag}">${tagTxt}</span>` : ''}
      <img class="media-img" src="${p.img}" alt="${p.name}" loading="lazy" onerror="imgFallback(this)">
      <div class="pcard__spot"></div>
    </div>
    <div class="pcard__body">
      <span class="pcard__ref">Réf. ${p.ref}</span>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="pcard__foot">
        <span class="price">${fmtDA(p.price)}</span>
        <button class="pcard__btn" aria-label="Voir">${svg('arrow',18)}</button>
      </div>
    </div>
  </article>`;
}

function bindCardSpotlight(root) {
  root.querySelectorAll('.pcard__media').forEach(m => {
    m.addEventListener('pointermove', e => {
      const r = m.getBoundingClientRect();
      m.querySelector('.pcard__spot').style.setProperty('--mx', `${e.clientX - r.left}px`);
      m.querySelector('.pcard__spot').style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* ---------- Custom cursor ---------- */
function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;
  let rx = 0, ry = 0, dx = 0, dy = 0;
  window.addEventListener('pointermove', e => {
    dx = e.clientX; dy = e.clientY;
    dot.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
  });
  const loop = () => {
    rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  };
  loop();
  const hoverSel = 'a, button, .cursor-target, input, textarea, select';
  document.addEventListener('pointerover', e => { if (e.target.closest(hoverSel)) ring.classList.add('hover'); });
  document.addEventListener('pointerout',  e => { if (e.target.closest(hoverSel)) ring.classList.remove('hover'); });
}

/* ---------- Nav ---------- */
function initNav() {
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  const burger = document.querySelector('.burger');
  const drawer = document.querySelector('.drawer');
  if (burger && drawer) {
    burger.addEventListener('click', () => drawer.classList.toggle('open'));
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));
  }
}

/* ---------- Loader ---------- */
function initLoader() {
  const loader = document.querySelector('.loader');
  if (!loader) return;
  const bar = loader.querySelector('.loader__bar i');
  const count = loader.querySelector('.loader__count');
  let p = 0;
  const t = setInterval(() => {
    p = Math.min(100, p + Math.random() * 18);
    if (bar) bar.style.width = p + '%';
    if (count) count.textContent = Math.floor(p) + '%';
    if (p >= 100) {
      clearInterval(t);
      setTimeout(() => {
        loader.style.transition = 'opacity .7s, visibility .7s';
        loader.style.opacity = '0'; loader.style.visibility = 'hidden';
        document.body.classList.add('loaded');
        playHero();
      }, 250);
    }
  }, 130);
}

function playHero() {
  document.querySelectorAll('.hero .display .ln > span').forEach((s, i) => {
    s.style.transition = 'transform 1s var(--ease), opacity 1s';
    s.style.transform = 'translateY(0)'; s.style.opacity = '1';
    s.style.transitionDelay = (0.1 + i * 0.08) + 's';
  });
  document.querySelectorAll('.hero [data-hero]').forEach((el, i) => {
    el.style.transition = 'transform 1s var(--ease), opacity 1s';
    el.style.transitionDelay = (0.35 + i * 0.1) + 's';
    el.style.transform = 'none'; el.style.opacity = '1';
  });
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal, [data-stagger]').forEach(el => io.observe(el));
}

/* ---------- Counters ---------- */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count, dur = 1600, t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        const val = Math.floor((1 - Math.pow(1 - k, 3)) * target);
        el.textContent = val.toLocaleString('fr-FR');
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step); io.unobserve(el);
    });
  }, { threshold: 0.6 });
  els.forEach(el => io.observe(el));
}

/* ---------- Magnetic buttons ---------- */
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(m => {
    const strength = 0.35;
    m.addEventListener('pointermove', e => {
      const r = m.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      m.style.transform = `translate(${x}px,${y}px)`;
    });
    m.addEventListener('pointerleave', () => { m.style.transform = 'translate(0,0)'; });
  });
}

/* ---------- Subtle tilt on cards ---------- */
function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(c => {
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - .5) * -6;
      const ry = ((e.clientX - r.left) / r.width - .5) * 6;
      c.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    c.addEventListener('pointerleave', () => c.style.transform = '');
  });
}

/* ---------- Lenis + GSAP parallax ---------- */
function initLenisGsap() {
  let lenis;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.1 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.length > 1) { e.preventDefault(); const el = document.querySelector(id); if (el) lenis.scrollTo(el, { offset: -70 }); }
      });
    });
  }
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) lenis.on('scroll', ScrollTrigger.update);
    gsap.to('[data-para]', {
      yPercent: (i, el) => -(parseFloat(el.dataset.para) || 12),
      ease: 'none',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true }
    });
    gsap.utils.toArray('[data-parallax-img]').forEach(img => {
      gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: img, scrub: true } });
    });
  }
}

/* ---------- Hero 3D: floating metallic key ---------- */
function initHero3D() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 9);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  };

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(5, 6, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xC6A15B, 1.6); rim.position.set(-6, -2, 4); scene.add(rim);
  const red = new THREE.PointLight(0xB01E28, 2.0, 30); red.position.set(-4, 3, 5); scene.add(red);

  // Group = stylised key
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0xd9d9dc, metalness: 1, roughness: 0.28 });
  const gold  = new THREE.MeshStandardMaterial({ color: 0xC6A15B, metalness: 1, roughness: 0.3 });

  const bow = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.34, 32, 80), gold);
  bow.position.x = -1.7; group.add(bow);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.5, 40), metal);
  collar.rotation.z = Math.PI / 2; collar.position.x = -0.5; group.add(collar);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 3.2, 32), metal);
  shaft.rotation.z = Math.PI / 2; shaft.position.x = 1.3; group.add(shaft);
  const toothGeo = new THREE.BoxGeometry(0.22, 0.42, 0.32);
  [2.1, 2.5, 2.9].forEach((x, i) => { const t = new THREE.Mesh(toothGeo, metal); t.position.set(x, -0.34 - i * 0.02, 0); group.add(t); });
  group.rotation.set(0.2, -0.3, 0.15);
  group.scale.setScalar(1.0);
  scene.add(group);

  // Floating particles
  const pGeo = new THREE.BufferGeometry();
  const N = 90, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i*3]=(Math.random()-.5)*16; pos[i*3+1]=(Math.random()-.5)*10; pos[i*3+2]=(Math.random()-.5)*6; }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xB01E28, size: 0.045, transparent: true, opacity: .5 }));
  scene.add(particles);

  let mx = 0, my = 0;
  window.addEventListener('pointermove', e => { mx = (e.clientX / window.innerWidth - .5); my = (e.clientY / window.innerHeight - .5); });

  const clock = new THREE.Clock();
  let running = true;
  document.addEventListener('visibilitychange', () => running = !document.hidden);
  const tick = () => {
    requestAnimationFrame(tick);
    if (!running) return;
    const t = clock.getElapsedTime();
    group.rotation.y = -0.3 + Math.sin(t * 0.35) * 0.35 + mx * 0.6;
    group.rotation.x = 0.2 + my * 0.35;
    group.position.y = Math.sin(t * 0.8) * 0.18;
    particles.rotation.y = t * 0.03;
    camera.position.x += (mx * 1.2 - camera.position.x) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };
  resize(); window.addEventListener('resize', resize); tick();
}

/* ---------- Hero slideshow (real photos, Ken Burns + crossfade) ---------- */
function initHeroSlideshow() {
  const wrap = document.getElementById('heroSlides');
  if (!wrap) return;
  const slides = [...wrap.querySelectorAll('.hero__slide')];
  const dotsWrap = document.getElementById('heroDots');
  if (dotsWrap) dotsWrap.innerHTML = slides.map((_, i) => `<button aria-label="Slide ${i+1}" class="${i===0?'on':''}"></button>`).join('');
  const dots = dotsWrap ? [...dotsWrap.children] : [];
  let i = 0, timer;
  const go = (n) => {
    slides[i].classList.remove('active'); dots[i] && dots[i].classList.remove('on');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('active'); dots[i] && dots[i].classList.add('on');
  };
  const start = () => { timer = setInterval(() => go(i + 1), 5000); };
  const stop = () => clearInterval(timer);
  dots.forEach((d, n) => d.addEventListener('click', () => { stop(); go(n); start(); }));
  start();
}

/* ---------- Cinematic doors: real photo splits open on scroll ---------- */
function initCinemaDoors() {
  const stage = document.querySelector('#cinema .cinema__stage');
  if (!stage || !window.gsap || !window.ScrollTrigger) return;
  const l = stage.querySelector('.cinema__panel.l');
  const r = stage.querySelector('.cinema__panel.r');
  const seam = document.getElementById('cinemaSeam');
  const inner = document.getElementById('cinemaInner');
  const bgImg = stage.querySelector('.cinema__bg img');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#cinema',
      start: 'top top',
      end: '+=150%',
      scrub: 1,
      pin: stage,
      anticipatePin: 1,
    }
  });
  tl.to(l, { xPercent: -102, ease: 'power2.inOut' }, 0)
    .to(r, { xPercent: 102, ease: 'power2.inOut' }, 0)
    .to(seam, { opacity: 0, duration: .3 }, 0)
    .fromTo(bgImg, { scale: 1.18 }, { scale: 1, ease: 'none' }, 0)
    .to(inner, { opacity: 1, y: 0, ease: 'power2.out' }, 0.35);
}

/* ---------- Horizontal gallery: real photos slide on scroll ---------- */
function initGallery() {
  const section = document.getElementById('gallery');
  const track = document.getElementById('galleryTrack');
  if (!section || !track || !window.gsap || !window.ScrollTrigger) return;
  if (window.innerWidth < 720) return; // native scroll feel on mobile
  const distance = () => track.scrollWidth - window.innerWidth + 80;
  gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + distance(),
      scrub: 1,
      pin: '.gallery__pin',
      invalidateOnRefresh: true,
    }
  });
}
