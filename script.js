/* =============================================
   script.js — Parth Tiwari Portfolio
   ============================================= */

/* ── NAV SCROLL ─────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── MOBILE NAV ─────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  const spans  = navToggle.querySelectorAll('span');
  if (isOpen) {
    anime({ targets: spans[0], rotate: 45,  translateY: 7,  duration: 280, easing: 'easeOutQuad' });
    anime({ targets: spans[1], opacity: 0,  duration: 180 });
    anime({ targets: spans[2], rotate: -45, translateY: -7, duration: 280, easing: 'easeOutQuad' });
  } else {
    anime({ targets: spans[0], rotate: 0, translateY: 0, duration: 280, easing: 'easeOutQuad' });
    anime({ targets: spans[1], opacity: 1, duration: 200 });
    anime({ targets: spans[2], rotate: 0, translateY: 0, duration: 280, easing: 'easeOutQuad' });
  }
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    anime({ targets: spans[0], rotate: 0, translateY: 0, duration: 280, easing: 'easeOutQuad' });
    anime({ targets: spans[1], opacity: 1, duration: 200 });
    anime({ targets: spans[2], rotate: 0, translateY: 0, duration: 280, easing: 'easeOutQuad' });
  });
});
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) navLinks.classList.remove('open');
});

/* ── THREE.JS HERO (dark section) ───────────── */
(function initThree() {
  const canvas   = document.getElementById('heroCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0f1117, 1);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 500;

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', resize);
  resize();

  /* ── Stars ── */
  const COUNT   = 1600;
  const starGeo = new THREE.BufferGeometry();
  const pos     = new Float32Array(COUNT * 3);
  const col     = new Float32Array(COUNT * 3);

  const palette = [
    [0.24, 0.51, 0.97],
    [0.37, 0.64, 0.98],
    [0.08, 0.75, 0.90],
    [0.80, 0.90, 1.00],
    [1.00, 1.00, 1.00],
  ];

  for (let i = 0; i < COUNT; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 1800;
    pos[i*3+1] = (Math.random() - 0.5) * 1600;
    pos[i*3+2] = (Math.random() - 0.5) * 700;
    const c = palette[Math.floor(Math.random() * palette.length)];
    col[i*3]   = c[0]; col[i*3+1] = c[1]; col[i*3+2] = c[2];
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  starGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  const stars = new THREE.Points(starGeo,
    new THREE.PointsMaterial({ size: 1.8, vertexColors: true, transparent: true, opacity: 0.75, sizeAttenuation: true })
  );
  scene.add(stars);

  /* ── Network nodes ── */
  const N_NODES = 70;
  const nodes   = [];
  const nodePos = new Float32Array(N_NODES * 3);
  const nodeVel = [];

  for (let i = 0; i < N_NODES; i++) {
    const x = (Math.random() - 0.5) * 1100;
    const y = (Math.random() - 0.5) * 650;
    const z = (Math.random() - 0.5) * 150;
    nodes.push({ x, y, z });
    nodePos[i*3] = x; nodePos[i*3+1] = y; nodePos[i*3+2] = z;
    nodeVel.push({
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      vz: (Math.random() - 0.5) * 0.08,
    });
  }
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
  scene.add(new THREE.Points(nodeGeo,
    new THREE.PointsMaterial({ color: 0x3b82f6, size: 3.5, transparent: true, opacity: 0.6 })
  ));

  /* ── Lines ── */
  const MAX_LINES = 180;
  const linePosArr = new Float32Array(MAX_LINES * 6);
  const lineGeo    = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePosArr, 3));
  const lineSegs = new THREE.LineSegments(lineGeo,
    new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.07 })
  );
  scene.add(lineSegs);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    stars.rotation.y += 0.00018;
    stars.rotation.x += 0.00004;

    camera.position.x += (mouseX * 35 - camera.position.x) * 0.018;
    camera.position.y += (-mouseY * 25 - camera.position.y) * 0.018;

    const np = nodeGeo.attributes.position.array;
    for (let i = 0; i < N_NODES; i++) {
      nodes[i].x += nodeVel[i].vx;
      nodes[i].y += nodeVel[i].vy;
      nodes[i].z += nodeVel[i].vz;
      if (Math.abs(nodes[i].x) > 550) nodeVel[i].vx *= -1;
      if (Math.abs(nodes[i].y) > 325) nodeVel[i].vy *= -1;
      if (Math.abs(nodes[i].z) > 75)  nodeVel[i].vz *= -1;
      np[i*3] = nodes[i].x; np[i*3+1] = nodes[i].y; np[i*3+2] = nodes[i].z;
    }
    nodeGeo.attributes.position.needsUpdate = true;

    if (frame % 3 === 0) {
      const lp   = lineGeo.attributes.position.array;
      let   li   = 0;
      const THRESH = 170;
      for (let i = 0; i < N_NODES && li < MAX_LINES * 6; i++) {
        for (let j = i + 1; j < N_NODES && li < MAX_LINES * 6; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (Math.sqrt(dx*dx + dy*dy) < THRESH) {
            lp[li++]=nodes[i].x; lp[li++]=nodes[i].y; lp[li++]=nodes[i].z;
            lp[li++]=nodes[j].x; lp[li++]=nodes[j].y; lp[li++]=nodes[j].z;
          }
        }
      }
      for (let i = li; i < MAX_LINES * 6; i++) lp[i] = 0;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, li / 3);
    }

    renderer.render(scene, camera);
  }
  animate();
})();

/* ── HERO ENTRY ANIMATIONS ──────────────────── */
window.addEventListener('load', () => {
  anime.timeline({ easing: 'easeOutExpo' })
    .add({ targets: '#heroBadge',   opacity: [0,1], translateY: [20,0], duration: 700 })
    .add({ targets: '#heroName',    opacity: [0,1], translateY: [50,0], duration: 900 }, '-=350')
    .add({ targets: '#heroTitles',  opacity: [0,1], translateY: [18,0], duration: 650 }, '-=550')
    .add({ targets: '#heroTagline', opacity: [0,1], translateY: [18,0], duration: 650 }, '-=450')
    .add({ targets: '#heroButtons', opacity: [0,1], translateY: [18,0], duration: 600 }, '-=400')
    .add({ targets: '#heroScroll',  opacity: [0,1], translateY: [10,0], duration: 500 }, '-=200');
});

/* ── ROTATING TITLE HIGHLIGHT ───────────────── */
(function rotateTitles() {
  const items = document.querySelectorAll('.title-item');
  let cur = 0;
  function tick() {
    items.forEach((el, i) => {
      el.classList.toggle('active-title', i === cur);
      el.style.opacity = i === cur ? '1' : '0.4';
    });
    cur = (cur + 1) % items.length;
  }
  tick();
  setInterval(tick, 2400);
})();

/* ── SCROLL REVEAL ──────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-up');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(
        entry.target.parentElement.querySelectorAll('.reveal, .reveal-up')
      );
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 75);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ── SKILL PILLS STAGGER ────────────────────── */
(function skillPills() {
  const cats = document.querySelectorAll('.skill-category');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      anime({
        targets: entry.target.querySelectorAll('.pill'),
        opacity:    [0, 1],
        translateY: [10, 0],
        delay:      anime.stagger(55, { start: 150 }),
        duration:   450,
        easing:     'easeOutQuad',
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  cats.forEach(c => obs.observe(c));
})();

/* ── STAT COUNTERS ──────────────────────────── */
(function counters() {
  const stats = document.querySelectorAll('.stat-num');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el      = entry.target;
      const raw     = el.textContent.trim();
      const num     = parseFloat(raw);
      const suffix  = raw.replace(/[\d.]/g, '');
      const decimal = raw.includes('.') ? raw.split('.')[1].length : 0;
      anime({
        targets: { v: 0 },
        v: num,
        duration: 1500,
        easing:   'easeOutExpo',
        update(a) {
          const v = a.animations[0].currentValue;
          el.textContent = decimal ? v.toFixed(decimal) + suffix : Math.floor(v) + suffix;
        },
      });
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  stats.forEach(s => obs.observe(s));
})();

/* ── BLOG CARD HOVER TILT ───────────────────── */
document.querySelectorAll('.blog-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.35s, border-color 0.35s';
  });
});

/* ── PROJECT CARD SPOTLIGHT ─────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width)  * 100;
    const y = ((e.clientY - r.top)  / r.height) * 100;
    card.style.setProperty('--gx', `${x}%`);
    card.style.setProperty('--gy', `${y}%`);
  });
});

/* ── SMOOTH SCROLL ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const tgt = document.querySelector(a.getAttribute('href'));
    if (!tgt) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 8;
    window.scrollTo({ top: tgt.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

/* ── ACTIVE NAV LINK ────────────────────────── */
(function activeNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) cur = s.id; });
    links.forEach(a => {
      const active = a.getAttribute('href') === `#${cur}`;
      a.style.color = active ? 'var(--blue)' : '';
    });
  }, { passive: true });
})();

/* ── CONTACT FORM ───────────────────────────── */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const suc = document.getElementById('formSuccess');
  anime({ targets: btn, scale: [1, 0.95, 1], duration: 280, easing: 'easeInOutQuad' });
  setTimeout(() => {
    suc.style.display = 'block';
    anime({ targets: suc, opacity: [0, 1], translateY: [8, 0], duration: 380, easing: 'easeOutQuad' });
    e.target.reset();
  }, 350);
}