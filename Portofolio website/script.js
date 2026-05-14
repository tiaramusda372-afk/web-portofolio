/* =========================================================
   TIARA RIZKA PORTFOLIO — script.js — FINAL
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* -------------------------------------------------------
     1. NAVBAR scroll + active link
  ------------------------------------------------------- */
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', onScroll, { passive: true });

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    setActiveNav();
    revealEls();
    animSkills();
  }

  function setActiveNav() {
    let cur = '';
    document.querySelectorAll('section[id], footer[id]').forEach(s => {
      if (window.scrollY >= s.offsetTop - 130) cur = s.id;
    });
    document.querySelectorAll('.npi').forEach(a => {
      a.classList.remove('active-link');
      if (a.getAttribute('href') === '#' + cur) a.classList.add('active-link');
    });
  }

  /* -------------------------------------------------------
     2. SMOOTH SCROLL
  ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' }); }
    });
  });

  /* -------------------------------------------------------
     3. SCROLL REVEAL
  ------------------------------------------------------- */
  const revealCfg = [
    ['.about-ttl',     'r-left'],
    ['.about-img-wrap','r-left'],
    ['.about-text',    'r-right'],
    ['.skills-ttl',    ''],
    ['.proj-ttl',      ''],
    ['.proj-sub',      ''],
    ['.proj-mywork',   ''],
    ['.slider-wrap',   ''],
    ['.con-ttl',       ''],
    ['.con-card',      'r-zoom'],
    ['.ft-ttl',        ''],
  ];
  revealCfg.forEach(([sel, cls]) => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('reveal');
      if (cls) el.classList.add(cls);
    });
  });

  function revealEls() {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 70) {
        setTimeout(() => el.classList.add('visible'), parseInt(el.dataset.delay || 0));
      }
    });
  }

  /* -------------------------------------------------------
     4. SKILL PROGRESS BARS
  ------------------------------------------------------- */
  let skillsDone = false;
  function animSkills() {
    if (skillsDone) return;
    const sec = document.getElementById('skills');
    if (!sec || sec.getBoundingClientRect().top > window.innerHeight - 80) return;
    skillsDone = true;
    document.querySelectorAll('.sk-card').forEach((card, i) => {
      setTimeout(() => {
        card.classList.add('visible');
        const bar = card.querySelector('.sk-bar');
        if (bar) setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 80);
      }, i * 130);
    });
  }

  /* -------------------------------------------------------
     5. PROJECT SLIDER
  ------------------------------------------------------- */
  const track   = document.getElementById('sliderTr');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dots    = document.querySelectorAll('.sdot');
  const TOTAL   = track ? track.children.length : 0;
  let cur = 0;

  const vis   = () => window.innerWidth < 768 ? 1 : 3;
  const maxI  = () => Math.max(0, TOTAL - vis());
  const cardW = () => track && track.children[0] ? track.children[0].offsetWidth + 18 : 0;

  function goTo(idx) {
    cur = Math.max(0, Math.min(idx, maxI()));
    if (track) track.style.transform = `translateX(-${cur * cardW()}px)`;
    dots.forEach(d => d.classList.remove('active'));
    if (dots[cur]) dots[cur].classList.add('active');
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(cur - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(cur + 1));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)));
  window.addEventListener('resize', () => goTo(Math.min(cur, maxI())));

  // Drag
  let dragX = 0, dragging = false;
  if (track) {
    track.addEventListener('mousedown', e => {
      dragging = true; dragX = e.clientX;
      track.style.transition = 'none'; e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      track.style.transform = `translateX(${-(cur * cardW() - (e.clientX - dragX))}px)`;
    });
    window.addEventListener('mouseup', e => {
      if (!dragging) return;
      dragging = false; track.style.transition = '';
      const d = e.clientX - dragX;
      if (d < -60) goTo(cur + 1);
      else if (d > 60) goTo(cur - 1);
      else goTo(cur);
    });
    let tX = 0;
    track.addEventListener('touchstart', e => { tX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const d = e.changedTouches[0].clientX - tX;
      if (d < -60) goTo(cur + 1);
      else if (d > 60) goTo(cur - 1);
    });
  }

  /* -------------------------------------------------------
     6. CONTACT FORM
  ------------------------------------------------------- */
  const sendBtn = document.getElementById('sendBtn');
  const toast   = document.getElementById('toast');
  const FIELDS  = [
    { id: 'f_name',  label: 'Nama' },
    { id: 'f_phone', label: 'Phone' },
    { id: 'f_email', label: 'Email' },
    { id: 'f_pass',  label: 'Password' },
    { id: 'f_msg',   label: 'Pesan' },
  ];

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      let hasErr = false;
      FIELDS.forEach(f => {
        const el = document.getElementById(f.id);
        if (!el) return;
        el.classList.remove('err');
        if (!el.value.trim()) { el.classList.add('err'); hasErr = true; }
      });
      const em = document.getElementById('f_email');
      if (em && em.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) {
        em.classList.add('err'); hasErr = true;
      }
      if (hasErr) return;
      const orig = sendBtn.innerHTML;
      sendBtn.disabled = true;
      sendBtn.textContent = 'Mengirim...';
      setTimeout(() => {
        FIELDS.forEach(f => { const el = document.getElementById(f.id); if (el) el.value = ''; });
        sendBtn.disabled = false;
        sendBtn.innerHTML = orig;
        showToast();
      }, 900);
    });
  }
  FIELDS.forEach(f => {
    const el = document.getElementById(f.id);
    if (el) el.addEventListener('input', () => el.classList.remove('err'));
  });

  function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => {
      toast.style.animation = 'tOut .4s ease forwards';
      setTimeout(() => { toast.classList.remove('show'); toast.style.animation = ''; }, 400);
    }, 3200);
  }

  /* -------------------------------------------------------
     7. HERO PARTICLES
  ------------------------------------------------------- */
  (function () {
    const hero = document.querySelector('.sec-hero');
    if (!hero) return;
    const s = document.createElement('style');
    s.textContent = `@keyframes ptf{0%{transform:translate(0,0);opacity:.15}100%{transform:translate(var(--tx),var(--ty));opacity:.7}}`;
    document.head.appendChild(s);
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('span');
      p.style.cssText = `position:absolute;width:${(Math.random()*3.5+1.5).toFixed(1)}px;height:${(Math.random()*3.5+1.5).toFixed(1)}px;border-radius:50%;background:rgba(66,165,245,${(.12+Math.random()*.3).toFixed(2)});top:${(Math.random()*100).toFixed(1)}%;left:${(Math.random()*100).toFixed(1)}%;--tx:${((Math.random()-.5)*44).toFixed(0)}px;--ty:${(-(14+Math.random()*28)).toFixed(0)}px;animation:ptf ${(5+Math.random()*6).toFixed(1)}s ${(Math.random()*4).toFixed(1)}s ease-in-out infinite alternate;pointer-events:none;z-index:0;`;
      hero.appendChild(p);
    }
  })();

  /* Initial trigger */
  setTimeout(() => { revealEls(); animSkills(); }, 150);
});