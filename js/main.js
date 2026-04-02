/* ========================================
   Okinawa Hibachi & Sushi — Marietta
   Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initBackToTop();
  initSmoothScroll();
  initMenuFilter();
});

/* --- Navigation --- */
function initNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');
  const header = document.querySelector('.header');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        overlay.classList.remove('active');
      });
    }

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
      });
    });
  }

  // Scroll header effect
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // Active page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --- Scroll Reveal --- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
}

/* --- Back to Top --- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = document.querySelector('.header')?.offsetHeight || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* --- Modal --- */
function showModal(type, title, message) {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;

  const icon = overlay.querySelector('.modal-icon');
  const h3 = overlay.querySelector('h3');
  const p = overlay.querySelector('p');

  icon.className = 'modal-icon' + (type === 'error' ? ' error' : '');
  icon.innerHTML = type === 'error' ? '<i class="fas fa-times"></i>' : '<i class="fas fa-check"></i>';
  h3.textContent = title;
  p.textContent = message;
  overlay.classList.add('active');
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.remove('active');
}

/* --- Menu Filter / Tabs --- */
function initMenuFilter() {
  const buttons = document.querySelectorAll('.menu-nav-btn');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Image-based menu tabs
      if (btn.dataset.menu) {
        document.querySelectorAll('.menu-images').forEach(panel => {
          panel.style.display = 'none';
        });
        const target = document.getElementById('menu-' + btn.dataset.menu);
        if (target) target.style.display = '';
        return;
      }

      // Legacy text-based filter
      const cat = btn.dataset.filter;
      document.querySelectorAll('.menu-category').forEach(section => {
        if (cat === 'all' || section.dataset.category === cat) {
          section.style.display = '';
        } else {
          section.style.display = 'none';
        }
      });
    });
  });
}
