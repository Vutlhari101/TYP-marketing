// SyncCore Team 46 marketing site: plain JavaScript, no libraries, degrades without it
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // mobile nav
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Close after choosing a destination
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // scroll progress bar
  var bar = document.getElementById('scrollProgress');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (bar) bar.style.width = pct + '%';
    if (toTop) toTop.classList.toggle('is-visible', h.scrollTop > 700);
  }

  // rAF throttle so scrolling stays smooth on a laptop trackpad
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScroll();
      ticking = false;
    });
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  // current section in nav
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // reveal on scroll
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        // Small stagger so a row of cards arrives in sequence, not all at once
        setTimeout(function () { entry.target.classList.add('is-in'); }, i * 70);
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });
    reveals.forEach(function (el) { revealObs.observe(el); });
  }

  // hero number count-up
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));

  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) { el.textContent = String(target); return; }
    var start = null;
    var dur = 900;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var countObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countUp(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { countObs.observe(el); });
    } else {
      counters.forEach(countUp);
    }
  }

  // role tabs
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));

  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var pane = document.getElementById(t.getAttribute('aria-controls'));
      if (!pane) return;
      pane.classList.toggle('is-active', on);
      if (on) { pane.removeAttribute('hidden'); } else { pane.setAttribute('hidden', ''); }
    });
  }

  tabs.forEach(function (tab, i) {
    tab.tabIndex = i === 0 ? 0 : -1;
    tab.addEventListener('click', function () { selectTab(tab); });

    // Arrow keys move between tabs, which is what a tablist is expected to do
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (!next) return;
      e.preventDefault();
      selectTab(next);
      next.focus();
    });
  });

  // screenshot lightbox
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbClose = document.getElementById('lbClose');
  var lastFocus = null;

  function openLightbox(img) {
    if (!lb || !lbImg) return;
    lastFocus = document.activeElement;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lb.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lb) return;
    lb.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (lbImg) lbImg.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-zoom]').forEach(function (figure) {
    var img = figure.querySelector('img');
    if (!img) return;
    figure.tabIndex = 0;
    figure.setAttribute('role', 'button');
    figure.setAttribute('aria-label', 'Enlarge screenshot: ' + img.alt);
    figure.addEventListener('click', function () { openLightbox(img); });
    figure.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img);
      }
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (lb && !lb.hasAttribute('hidden')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'Tab') { e.preventDefault(); lbClose.focus(); }
    }
    if (e.key === 'Escape' && nav && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

  // smooth anchors, header-aware
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var header = document.querySelector('.site-header');
      var offset = header ? header.offsetHeight - 2 : 0;
      var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });
})();
