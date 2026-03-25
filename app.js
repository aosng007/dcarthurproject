// Mobile menu
(function () {
  var hamburger = document.getElementById('hamburger');
  var overlay = document.getElementById('mobile-overlay');
  var closeBtn = document.getElementById('mobile-overlay-close');
  if (!hamburger || !overlay || !closeBtn) return;

  function openMenu() {
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    overlay.classList.contains('open') ? closeMenu() : openMenu();
  });
  closeBtn.addEventListener('click', closeMenu);
  overlay.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
})();

// Scroll animations
(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function () { entry.target.classList.add('visible'); }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(function (el) { observer.observe(el); });
})();

// Style Switcher
(function () {
  var sheet = document.getElementById('theme-stylesheet');
  var btn = document.getElementById('style-switcher-btn');
  if (!sheet || !btn) return;
  var saved = localStorage.getItem('dcap-theme');
  if (saved) sheet.setAttribute('href', saved);
  function isMinimal() { return sheet.getAttribute('href').includes('minimal'); }
  function updateBtn() { btn.textContent = isMinimal() ? 'Switch to Corporate' : 'Switch to Minimal'; }
  updateBtn();
  btn.addEventListener('click', function () {
    sheet.setAttribute('href', isMinimal() ? 'style-corporate.css' : 'style-minimal.css');
    localStorage.setItem('dcap-theme', sheet.getAttribute('href'));
    updateBtn();
  });
})();

// Home page: transparent nav becomes solid on scroll
(function () {
  var nav = document.getElementById('main-nav');
  if (!nav || !document.querySelector('.hero')) return;
  function updateNav() {
    nav.classList.toggle('nav-solid', window.scrollY > 60);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();

// Inner pages: nav is always solid
(function () {
  var nav = document.getElementById('main-nav');
  if (!nav || document.querySelector('.hero')) return;
  nav.classList.add('nav-solid');
})();

// Contact page: FAQ accordion — defined globally so HTML onclick="toggleFaq(this)" can call it
function toggleFaq(el) {
  var item = el.closest('.faq-item');
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
}

// Contact page: AJAX form submission
(function () {
  var contactForm = document.getElementById('contact-form');
  var submitBtn = document.getElementById('form-submit-btn');
  if (!contactForm || !submitBtn) return;

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    submitBtn.textContent = 'Sending\u2026';
    submitBtn.disabled = true;
    try {
      var response = await fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      });
      if (response.ok) {
        window.location.href = 'thank-you.html';
      } else {
        throw new Error('Server error');
      }
    } catch {
      submitBtn.textContent = 'Send enquiry \u2192';
      submitBtn.disabled = false;
      contactForm.submit();
    }
  });
})();
