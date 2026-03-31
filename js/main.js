/* ========================================
   Okinawa Hibachi & Sushi — Marietta
   Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initBackToTop();
  initSmoothScroll();
  initContactForm();
  initMenuFilter();
  initPhoneFormat();
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

/* --- Phone Formatting --- */
function initPhoneFormat() {
  const phoneInput = document.querySelector('input[name="phone"]');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 10) val = val.slice(0, 10);
    if (val.length >= 7) {
      e.target.value = `(${val.slice(0,3)}) ${val.slice(3,6)}-${val.slice(6)}`;
    } else if (val.length >= 4) {
      e.target.value = `(${val.slice(0,3)}) ${val.slice(3)}`;
    } else if (val.length > 0) {
      e.target.value = `(${val}`;
    }
  });
}

/* --- Contact Form --- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name = form.querySelector('[name="contactName"]');
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');
    let valid = true;

    if (!name.value.trim()) { showError(name, 'Name is required'); valid = false; }
    if (!email.value.trim() || !isValidEmail(email.value)) { showError(email, 'Valid email is required'); valid = false; }
    if (!phone.value.trim()) { showError(phone, 'Phone is required'); valid = false; }

    if (!valid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const apiBase = getApiBase();
      const formData = new FormData(form);
      formData.append('business', 'okinawa-marietta');
      formData.append('type', 'contact');

      const res = await fetch(`${apiBase}/send-contact.php`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        showModal('success', 'Message Sent!', 'Thank you for reaching out. We\'ll get back to you shortly.');
        form.reset();
      } else {
        showModal('error', 'Oops!', data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      showModal('error', 'Oops!', 'Could not send your message. Please call us instead.');
    }

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  });
}

function getApiBase() {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:8888/dashboard/api';
  }
  return 'https://okinawamarietta.com/api';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, msg) {
  const group = input.closest('.form-group');
  group.classList.add('has-error');
  const errEl = group.querySelector('.error-msg');
  if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
}

function clearErrors() {
  document.querySelectorAll('.form-group.has-error').forEach(g => {
    g.classList.remove('has-error');
    const errEl = g.querySelector('.error-msg');
    if (errEl) errEl.style.display = 'none';
  });
}

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

/* --- Menu Filter --- */
function initMenuFilter() {
  const buttons = document.querySelectorAll('.menu-nav-btn');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filter;

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

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
