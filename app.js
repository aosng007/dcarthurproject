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
  var themes = ['style-minimal.css', 'style-corporate.css', 'style-hampton.css'];
  var labels = ['Minimal', 'Corporate', 'Hampton'];
  var saved = localStorage.getItem('dcap-theme');
  if (saved && themes.indexOf(saved) !== -1) sheet.setAttribute('href', saved);
  function currentIndex() {
    var href = sheet.getAttribute('href');
    for (var i = 0; i < themes.length; i++) {
      if (href === themes[i] || href.endsWith('/' + themes[i])) return i;
    }
    return 0;
  }
  function updateBtn() {
    var next = (currentIndex() + 1) % themes.length;
    btn.textContent = 'Switch to ' + labels[next];
  }
  updateBtn();
  btn.addEventListener('click', function () {
    var next = (currentIndex() + 1) % themes.length;
    sheet.setAttribute('href', themes[next]);
    localStorage.setItem('dcap-theme', themes[next]);
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

// Contact page: FAQ accordion — wired via JS event listeners to stay CSP-compliant
(function () {
  var faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  function toggleFaq(item) {
    var isOpen = item.classList.contains('open');
    faqItems.forEach(function (i) { i.classList.remove('open'); });
    if (!isOpen) item.classList.add('open');
  }

  document.querySelectorAll('.faq-question').forEach(function (question) {
    question.addEventListener('click', function () {
      var item = question.closest('.faq-item');
      if (item) toggleFaq(item);
    });
    question.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var item = question.closest('.faq-item');
        if (item) toggleFaq(item);
      }
    });
  });
})();

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
