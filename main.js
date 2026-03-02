/* VIO — Shared JavaScript v2.0 */

// ─── Progress Bar ───────────────────────────────────────────
const progressBar = document.getElementById('progress-bar');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = Math.min(scrolled, 100) + '%';
  });
}

// ─── Header scroll effect ────────────────────────────────────
window.addEventListener('scroll', () => {
  document.querySelector('header')?.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── Mobile menu ─────────────────────────────────────────────
const mobileBtn = document.getElementById('mobile-menu-button');
const mobileNav = document.getElementById('mobile-nav');
if (mobileBtn && mobileNav) {
  mobileBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    mobileBtn.innerHTML = isOpen ? '&times;' : '&#9776;';
    mobileBtn.setAttribute('aria-expanded', isOpen);
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      mobileBtn.innerHTML = '&#9776;';
    });
  });
}

// ─── Hero entrance animation ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelector('.hero-section')?.classList.add('animate-in');
    // Animate page hero intros
    const pageHeroContent = document.querySelectorAll('.page-hero h1, .page-hero p, .page-hero .btn, .page-hero .breadcrumb');
    pageHeroContent.forEach((el, i) => {
      el.style.cssText = `opacity:0;transform:translateY(20px);transition:opacity .7s ease ${0.1 + i * 0.15}s,transform .7s ease ${0.1 + i * 0.15}s`;
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'none'; }, 80);
    });
  }, 100);
});

// ─── Scroll-triggered animations ─────────────────────────────
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
  const grid = el.closest('.grid');
  if (grid) {
    const siblings = Array.from(grid.querySelectorAll('.animate-on-scroll'));
    const idx = siblings.indexOf(el);
    el.style.setProperty('--delay', `${idx * 0.1}s`);
  }
  observer.observe(el);
});

// ─── Smooth anchor scrolling ──────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ─── Back to Top ──────────────────────────────────────────────
const backBtn = document.getElementById('backToTopBtn');
if (backBtn) {
  window.addEventListener('scroll', () => backBtn.classList.toggle('show', window.scrollY > 300));
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ─── Footer year ──────────────────────────────────────────────
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ─── Newsletter form ──────────────────────────────────────────
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn = form.querySelector('button');
    if (!input?.value) return;
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = '#047857';
    input.value = '';
    input.placeholder = 'Thank you for subscribing!';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
      btn.style.background = '';
      input.placeholder = 'Your email address';
    }, 3000);
  });
});

// ─── Portfolio filter tabs ────────────────────────────────────
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      if (filter === 'all' || card.dataset.category?.includes(filter)) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity .4s ease, transform .4s ease';
          card.style.opacity = '1';
          card.style.transform = 'none';
        });
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ─── Animated counters ────────────────────────────────────────
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = () => {
    start += Math.ceil(target / (duration / 16));
    if (start >= target) { el.textContent = target + (el.dataset.suffix || ''); return; }
    el.textContent = start + (el.dataset.suffix || '');
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.count));
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ─── Sticky active nav ────────────────────────────────────────
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});
