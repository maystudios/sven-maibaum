// js/script.js

document.addEventListener('DOMContentLoaded', () => {
  // =========================
  // Mobile Menu Toggle + A11y
  // =========================
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const closeMobileMenuButton = document.getElementById('close-mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

  // Fokus-Trap/ESC: State & Handler
  const focusableSel =
    'a[href], button, textarea, input, select, details,[tabindex]:not([tabindex="-1"])';
  let lastFocusedBeforeMenu = null;
  let escKeyHandler = null;
  let trapTabHandler = null;

  // Menü schließen (mit A11y-Cleanup)
  function closeMenu() {
    if (!mobileMenu || !mobileMenuButton) return;

    // Off-Canvas animieren/zurück
    mobileMenu.classList.add('-translate-x-full');
    mobileMenu.classList.remove('translate-x-0');
    mobileMenuButton.setAttribute('aria-expanded', 'false');

    // Scroll wieder erlauben
    document.body.style.overflow = '';

    // A11y-Cleanup
    mobileMenu.removeAttribute('aria-modal');
    mobileMenu.removeAttribute('aria-label');

    // Event-Listener entfernen
    if (escKeyHandler) {
      document.removeEventListener('keydown', escKeyHandler);
      escKeyHandler = null;
    }
    if (trapTabHandler) {
      mobileMenu.removeEventListener('keydown', trapTabHandler);
      trapTabHandler = null;
    }

    // Fokus zurück an Auslöser
    if (lastFocusedBeforeMenu && typeof lastFocusedBeforeMenu.focus === 'function') {
      lastFocusedBeforeMenu.focus();
    }
  }

  if (mobileMenuButton && mobileMenu && closeMobileMenuButton) {
    // Menü öffnen
    mobileMenuButton.addEventListener('click', () => {
      // Zustand & A11y-Attribute setzen
      mobileMenu.classList.remove('-translate-x-full');
      mobileMenu.classList.add('translate-x-0');
      mobileMenuButton.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      // Dialog-A11y
      mobileMenu.setAttribute('aria-modal', 'true');
      mobileMenu.setAttribute('aria-label', 'Hauptmenü');

      // Fokus-Management
      lastFocusedBeforeMenu = document.activeElement || mobileMenuButton;
      // ersten fokussierbaren Knoten fokussieren
      requestAnimationFrame(() => {
        const focusables = mobileMenu.querySelectorAll(focusableSel);
        if (focusables.length > 0) {
          (focusables[0]).focus();
        } else {
          // Fallback: Menü selbst fokussierbar machen
          mobileMenu.setAttribute('tabindex', '-1');
          mobileMenu.focus();
        }
      });

      // ESC schließt Menü
      escKeyHandler = (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
          e.preventDefault();
          closeMenu();
        }
      };
      document.addEventListener('keydown', escKeyHandler);

      // Fokus-Trap (TAB zyklisch im Menü halten)
      trapTabHandler = (e) => {
        if (e.key !== 'Tab') return;

        const nodes = mobileMenu.querySelectorAll(focusableSel);
        if (!nodes.length) return;

        const first = nodes[0];
        const last = nodes[nodes.length - 1];

        // Shift+Tab auf erstem -> Fokus zum letzten
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
        // Tab auf letztem -> Fokus zum ersten
        else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };
      mobileMenu.addEventListener('keydown', trapTabHandler);
    });

    // Schließen per Button (X)
    closeMobileMenuButton.addEventListener('click', closeMenu);

    // Schließen, wenn interner Link (#anker) geklickt wird
    mobileMenuLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) {
        link.addEventListener('click', closeMenu);
      }
    });
  }

  // =========================
  // Footer: aktuelles Jahr
  // =========================
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // ===================================================
  // Smooth scroll für In-Page-Links (nur auf der Index)
  // ===================================================
  if (document.getElementById('home')) {
    // Links wie href="#about"
    document.querySelectorAll('a.nav-link[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId.startsWith('#') && targetId.length > 1) {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            e.preventDefault();

            const header = document.querySelector('header.fixed');
            const headerOffset = header ? header.offsetHeight : 0;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          }
        }
      });
    });

    // Optional: Links wie href="/index.html#projects" ohne Reload smooth scrollen
    document.querySelectorAll('a.nav-link[href^="/index.html#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        const hash = href && href.includes('#') ? '#' + href.split('#')[1] : '';
        if (!hash) return;

        const target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();
        const header = document.querySelector('header.fixed');
        const headerOffset = header ? header.offsetHeight : 0;
        const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        history.replaceState(null, '', hash);
      });
    });
  }

  // ======================================
  // Intersection Observer (Scroll-Animation)
  // ======================================
  const animatedSections = document.querySelectorAll('.fade-in-up');
  if (typeof IntersectionObserver !== 'undefined') {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observerInstance.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedSections.forEach((section) => observer.observe(section));
  } else {
    animatedSections.forEach((section) => section.classList.add('visible'));
  }

  // ==================
  // Projekt-Filter UI
  // ==================
  const filterButtons = document.querySelectorAll('#project-filters .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // aktiv-Status
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // filtern + A11y
      projectCards.forEach((card) => {
        const tags = card.dataset.tags ? card.dataset.tags.split(' ') : [];
        const match = filter === 'all' || tags.includes(filter);
        card.classList.toggle('hidden', !match);
        card.setAttribute('aria-hidden', match ? 'false' : 'true');
        card.tabIndex = match ? 0 : -1;
      });
    });
  });

  // Hinweis: Der alte Code für ein eigenes Kontaktformular (id="contactForm")
  // wurde bewusst entfernt, da Formspree die Verarbeitung übernimmt.
});
