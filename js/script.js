(function () {
  'use strict';

  const navbar = document.querySelector('.site-navbar');
  const navCollapse = document.querySelector('#primaryNav');
  const navToggler = document.querySelector('.navbar-toggler');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const revealItems = document.querySelectorAll('.reveal');
  const portraitImage = document.querySelector('.portrait-image');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setNavbarState() {
    if (!navbar) {
      return;
    }

    navbar.classList.toggle('navbar-scrolled', window.scrollY > 12);
  }

  function closeMobileNav() {
    if (!navCollapse || !navToggler || window.getComputedStyle(navToggler).display === 'none') {
      return;
    }

    const instance = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse, { toggle: false });
    instance.hide();
  }

  function initRevealObserver() {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach((item) => observer.observe(item));
  }

  function initHeroImage() {
    if (!portraitImage) {
      return;
    }

    const showFallback = () => {
      portraitImage.classList.add('is-loaded');
      portraitImage.style.opacity = '0';
      portraitImage.setAttribute('aria-hidden', 'true');
    };

    if (portraitImage.complete && portraitImage.naturalWidth > 0) {
      portraitImage.classList.add('is-loaded');
      return;
    }

    portraitImage.addEventListener('load', () => {
      portraitImage.classList.add('is-loaded');
    });

    portraitImage.addEventListener('error', showFallback);
  }

  function initPlaceholderLinks() {
    document.querySelectorAll('[data-placeholder]').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (link.target === '_blank') {
          return;
        }

        event.preventDefault();
      });
    });
  }

  function initExpandableSections() {
    document.querySelectorAll('.project-details-toggle, .research-details-toggle').forEach((button) => {
      button.addEventListener('click', () => {
        const details = document.getElementById(button.getAttribute('aria-controls'));
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        if (!details) {
          return;
        }

        button.setAttribute('aria-expanded', String(!isExpanded));
        button.textContent = button.classList.contains('research-details-toggle')
          ? (isExpanded ? 'Research' : 'Hide Research')
          : (isExpanded ? 'View Details' : 'Hide Details');
        details.classList.toggle('is-expanded', !isExpanded);
        details.setAttribute('aria-hidden', String(isExpanded));
      });
    });
  }

  function initCertificateToggle() {
    const toggle = document.querySelector('#certificateToggle');
    const extraCertificates = document.querySelectorAll('.certificate-extra');

    if (!toggle || extraCertificates.length === 0) {
      return;
    }

    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isExpanded));
      toggle.textContent = isExpanded ? 'View All Certificates' : 'Show Fewer Certificates';
      extraCertificates.forEach((certificate) => {
        certificate.classList.toggle('is-visible', !isExpanded);
      });
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  window.addEventListener('scroll', setNavbarState, { passive: true });
  window.addEventListener('load', setNavbarState);

  initRevealObserver();
  initHeroImage();
  initPlaceholderLinks();
  initExpandableSections();
  initCertificateToggle();
  setNavbarState();
})();