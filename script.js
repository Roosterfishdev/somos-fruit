(function () {
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");
  var yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (toggle && nav && menu) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
      });
    });
  }

  var links = document.querySelectorAll('.nav__links a[href^="#"]');
  var sections = [];
  links.forEach(function (a) {
    var id = a.getAttribute("href");
    if (id && id.length > 1) {
      var el = document.querySelector(id);
      if (el) sections.push({ id: id, el: el, link: a });
    }
  });

  function onScroll() {
    var y = window.scrollY + 120;
    var current = "#inicio";
    sections.forEach(function (s) {
      if (s.el.offsetTop <= y) current = s.id;
    });
    links.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ——— Scroll Animations ———
  var observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Export observer globally for dynamic content
  window.animationObserver = observer;

  // Wait for DOM to be fully loaded before observing elements
  document.addEventListener('DOMContentLoaded', function() {
    var animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(function(el) {
      observer.observe(el);
    });
  });

  // Also run immediately in case DOM is already loaded
  if (document.readyState === 'loading') {
    // DOMContentLoaded listener above will handle it
  } else {
    // DOM is already loaded
    var animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(function(el) {
      observer.observe(el);
    });
  }
})();
