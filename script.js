/* ============================================================
   TECHYGUIDE – LANDING PAGE JS (LIGHT THEME)
============================================================ */

/* ── 1. NAVBAR ── */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
const floatCta   = document.getElementById('floatingCta');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle('scrolled', scrolled);
  floatCta.classList.toggle('visible', scrolled);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  const [a, b, c] = hamburger.querySelectorAll('span');
  if (open) {
    a.style.cssText = 'transform:rotate(45deg) translateY(7px)';
    b.style.opacity = '0';
    c.style.cssText = 'transform:rotate(-45deg) translateY(-7px)';
  } else {
    [a, b, c].forEach(s => { s.style.cssText = ''; });
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.cssText = ''; });
  });
});


/* ── 2. CUSTOM CURSOR ── */
const cursorDot = document.getElementById('cursorDot');
if (window.matchMedia('(pointer: fine)').matches) {
  cursorDot.style.opacity = '1';
  let cx = 0, cy = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  (function animateCursor() {
    cx += (tx - cx) * 0.14;
    cy += (ty - cy) * 0.14;
    cursorDot.style.left = cx + 'px';
    cursorDot.style.top  = cy + 'px';
    requestAnimationFrame(animateCursor);
  })();
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => { cursorDot.style.cssText += ';width:22px;height:22px;opacity:.5'; });
    el.addEventListener('mouseleave', () => { cursorDot.style.cssText += ';width:10px;height:10px;opacity:1'; });
  });
}


/* ── 3. SCROLL REVEAL ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


/* ── 4. COUNTER ANIMATION ── */
function animateCount(el, target, dur = 1800) {
  const start = performance.now();
  const isLarge = target >= 1000;
  function frame(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = Math.round(target * ease);
    el.textContent = isLarge && val >= 1000 ? Math.round(val / 1000) + 'K' : val;
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = isLarge && target >= 1000 ? Math.round(target / 1000) + 'K' : target;
  }
  requestAnimationFrame(frame);
}

const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const t  = parseInt(el.dataset.target, 10);
      if (!isNaN(t)) animateCount(el, t);
      countObs.unobserve(el);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-target]').forEach(el => countObs.observe(el));


/* ── 5. TESTIMONIALS AUTO-SCROLL ── */
// Auto-scroll testimonials functionality is handled by CSS animation
// No JavaScript needed for the continuous scroll


/* ── 6. FAQ ACCORDION ── */
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});


/* ── 7. LEAD FORM ── */
(function form() {
  const f       = document.getElementById('mainLeadForm');
  const btnText = document.getElementById('submitText');
  const btnLoad = document.getElementById('submitLoader');
  const success = document.getElementById('formSuccess');
  if (!f) return;

  const fields = {
    fname:       { el: f.querySelector('#fname'),       err: f.querySelector('#fnameError'),       valid: v => v.trim().length >= 2 ? '' : 'Please enter your full name.' },
    phone:       { el: f.querySelector('#phone'),       err: f.querySelector('#phoneError'),       valid: v => /^[+\d\s\-()]{7,15}$/.test(v.trim()) ? '' : 'Enter a valid phone number.' },
    email:       { el: f.querySelector('#email'),       err: f.querySelector('#emailError'),       valid: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.' },
    institution: { el: f.querySelector('#institution'), err: f.querySelector('#institutionError'), valid: v => v.trim().length >= 2 ? '' : 'Enter your institution name.' },
    city:        { el: f.querySelector('#city'),        err: f.querySelector('#cityError'),        valid: v => v.trim().length >= 2 ? '' : 'Enter your city.' },
    interest:    { el: f.querySelector('#interest'),    err: f.querySelector('#interestError'),    valid: v => v !== '' ? '' : 'Please select an interest.' },
  };

  Object.values(fields).forEach(({ el, err, valid }) => {
    el.addEventListener('blur', () => { const m = valid(el.value); err.textContent = m; el.classList.toggle('error', !!m); });
    el.addEventListener('input', () => { if (el.classList.contains('error')) { const m = valid(el.value); err.textContent = m; el.classList.toggle('error', !!m); } });
  });

  f.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = true;
    Object.values(fields).forEach(({ el, err, valid }) => {
      const m = valid(el.value);
      err.textContent = m;
      el.classList.toggle('error', !!m);
      if (m) ok = false;
    });
    if (!ok) { f.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }

    btnText.style.display = 'none';
    btnLoad.style.display = 'inline';
    f.querySelector('#submitBtn').disabled = true;

    await new Promise(r => setTimeout(r, 1600));

    f.querySelectorAll('.fg, .form-row, .lfc-top, .btn-submit, .form-note').forEach(el => el.style.display = 'none');
    success.style.display = 'block';

    /* Replace the await above with a real fetch:
    const data = Object.fromEntries(new FormData(f));
    const res  = await fetch('YOUR_ENDPOINT', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
    */
  });
})();


/* ── 8. SMOOTH SCROLL with NAV OFFSET ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const el = document.querySelector(a.getAttribute('href'));
    if (!el) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 12;
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
  });
});


/* ── 9. MARQUEE PAUSE ON HOVER ── */
const marquee = document.querySelector('.marquee-inner');
if (marquee) {
  marquee.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
  marquee.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');
}


/* ── 10. ACTIVE NAV HIGHLIGHT ── */
(function activeNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => {
          l.style.color = l.getAttribute('href') === '#' + id ? 'var(--indigo)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' }).forEach
    ? sections.forEach(s => new IntersectionObserver((en) => {
        en.forEach(e => { if (e.isIntersecting) links.forEach(l => { l.style.color = l.getAttribute('href') === '#'+s.id ? 'var(--indigo)' : ''; }); });
      }, { rootMargin: '-40% 0px -50% 0px' }).observe(s))
    : null;
})();
