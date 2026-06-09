/* ============================================================
   SCENTALICIOUS — main.js
   Luxury Interactions & Animations
   ============================================================ */

'use strict';

/* ─── NAVBAR ─── */
const navbar = document.querySelector('.navbar');
const navHamburger = document.getElementById('nav-hamburger');
const navMobileMenu = document.getElementById('nav-mobile-menu');
const navMobileClose = document.getElementById('nav-mobile-close');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
});

// Hamburger toggle
if (navHamburger) {
  navHamburger.addEventListener('click', () => {
    navMobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}

if (navMobileClose) {
  navMobileClose.addEventListener('click', () => {
    navMobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── ACTIVE NAV LINK ─── */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (navLink) {
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        navLink.classList.add('active');
      }
    }
  });
}

/* ─── SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

/* ─── SCROLL REVEAL ─── */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ─── HERO PARTICLE SYSTEM ─── */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let particles = [];
let animFrame;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  if (!canvas) return;
  const count = Math.floor((canvas.width * canvas.height) / 18000);
  particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.05,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2 - 0.15,
      life: Math.random() * Math.PI * 2,
      lifeSpeed: Math.random() * 0.008 + 0.003,
      isGold: Math.random() < 0.3
    });
  }
}

function drawParticles() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.life += p.lifeSpeed;
    p.x += p.vx + Math.sin(p.life * 0.5) * 0.2;
    p.y += p.vy + Math.cos(p.life * 0.7) * 0.1;

    const currentOpacity = p.opacity * (0.5 + Math.sin(p.life) * 0.5);

    // Wrap around
    if (p.y < -10) p.y = canvas.height + 10;
    if (p.x < -10) p.x = canvas.width + 10;
    if (p.x > canvas.width + 10) p.x = -10;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    if (p.isGold) {
      ctx.fillStyle = `rgba(176, 141, 87, ${currentOpacity})`;
    } else {
      ctx.fillStyle = `rgba(111, 90, 55, ${currentOpacity * 0.6})`;
    }
    ctx.fill();

    // Soft glow for gold particles
    if (p.isGold && p.radius > 1.5) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
      gradient.addColorStop(0, `rgba(176, 141, 87, ${currentOpacity * 0.15})`);
      gradient.addColorStop(1, 'rgba(176, 141, 87, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  });

  animFrame = requestAnimationFrame(drawParticles);
}

// Only run particles in hero section
function initParticles() {
  if (!canvas) return;
  resizeCanvas();
  createParticles();
  drawParticles();
}

// Pause particles when hero not in view
const heroSection = document.getElementById('hero');
if (heroSection && canvas) {
  const heroObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animFrame) drawParticles();
      } else {
        cancelAnimationFrame(animFrame);
        animFrame = null;
      }
    });
  }, { threshold: 0 });
  heroObs.observe(heroSection);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  createParticles();
});

/* ─── QUEEN CARDS — Color background change on hover ─── */
const queenCards = document.querySelectorAll('.queen-card');

queenCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    const color = this.dataset.color;
    if (color) {
      // Very soft tint — just the card background changes via CSS ::before
      // already handled in CSS; just add subtle glow
      this.style.boxShadow = `0 40px 80px rgba(0,0,0,0.14), 0 0 40px ${color}22`;
    }
  });

  card.addEventListener('mouseleave', function() {
    this.style.boxShadow = '';
  });
});

/* ─── FRAGRANCE NOTE BARS — Trigger on hover via JS for better control ─── */
const fragranceCols = document.querySelectorAll('.fragrance-col');

fragranceCols.forEach(col => {
  const bars = col.querySelectorAll('.note-bar');

  col.addEventListener('mouseenter', () => {
    bars.forEach((bar, i) => {
      setTimeout(() => {
        bar.style.transform = 'scaleX(1)';
      }, i * 80);
    });
  });

  col.addEventListener('mouseleave', () => {
    bars.forEach(bar => {
      bar.style.transform = 'scaleX(0)';
    });
  });
});

/* ─── COUNTER ANIMATION (optional luxury detail) ─── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counters = document.querySelectorAll('[data-target]');
if (counters.length) {
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));
}

/* ─── QUEEN ACCORDION TOGGLE (TOUCH/MOBILE SUPPORT) ─── */
const qaItems = document.querySelectorAll('.qa-item');
qaItems.forEach(item => {
  item.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    qaItems.forEach(i => i.classList.remove('active'));
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// Prevent immediate redirect on mobile/touch when clicking collapsed cards
const orderButtons = document.querySelectorAll('.qa-order-btn');
orderButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const item = btn.closest('.qa-item');
    if (!item.classList.contains('active')) {
      e.preventDefault();
      e.stopPropagation();
      qaItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    } else {
      e.stopPropagation();
    }
  });
});

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  updateActiveNavLink();
});
