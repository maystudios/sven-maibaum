// /js/philosophy.js
// Lädt /components/philosophy.html (wie der Footer-Loader) ODER initialisiert direkt,
// falls die Section bereits serverseitig eingebunden ist.

(function () {
  const CANDIDATES = [
    '/components/philosophy.html',
    'components/philosophy.html',
    './components/philosophy.html'
  ];

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const tryFetch = async (urls) => {
    for (const url of urls) {
      try {
        const res = await fetch(url, { credentials: 'same-origin' });
        if (res.ok) return await res.text();
      } catch (_) { /* nächster Kandidat */ }
    }
    throw new Error('Philosophy konnte nicht geladen werden.');
  };

  // Disclosure/Accordion-Initialisierung
  const initPhilosophy = () => {
    const root = document.getElementById('philosophy');
    if (!root) return;

    const disclosures = root.querySelectorAll('[data-disclosure]');
    disclosures.forEach((card, idx) => {
      const btn = card.querySelector('[data-disclosure-btn]');
      const panel = card.querySelector('[data-disclosure-panel]');
      const chevron = card.querySelector('[data-chevron]');
      if (!btn || !panel) return;

      // IDs/ARIA
      if (!panel.id) {
        panel.id = `ph-panel-${idx + 1}`;
      }
      btn.setAttribute('aria-controls', panel.id);
      btn.setAttribute('aria-expanded', 'false');

      // Startzustand geschlossen
      panel.hidden = false; // wir steuern über max-height (nicht hidden), sonst Flackern
      panel.style.overflow = 'hidden';
      panel.style.maxHeight = '0px';
      if (!prefersReduced) {
        panel.style.transition = panel.style.transition || 'max-height 240ms ease';
      }

      const setExpanded = (expanded) => {
        btn.setAttribute('aria-expanded', String(expanded));
        if (!prefersReduced) {
          if (expanded) {
            // zuerst eine feste Höhe für die Transition setzen, danach auf 'none' schalten
            const target = panel.scrollHeight;
            panel.style.maxHeight = target + 'px';
            if (chevron) chevron.style.transform = 'rotate(180deg)';
          } else {
            // von auto → feste Höhe → 0 animieren
            if (panel.style.maxHeight === 'none') {
              panel.style.maxHeight = panel.scrollHeight + 'px';
              // Reflow erzwingen
              // eslint-disable-next-line no-unused-expressions
              panel.offsetHeight;
            }
            panel.style.maxHeight = '0px';
            if (chevron) chevron.style.transform = 'rotate(0deg)';
          }
        } else {
          panel.style.maxHeight = expanded ? 'none' : '0px';
          if (chevron) chevron.style.transform = expanded ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      };

      // Nach der Öffnungs-Transition auf "none" setzen, damit der Inhalt mitwächst
      panel.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'max-height') return;
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        if (expanded) {
          panel.style.maxHeight = 'none';
        }
      });

      // Toggle
      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        setExpanded(!isOpen);
      });

      // ESC zum Schließen, wenn Fokus im Panel
      panel.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
          setExpanded(false);
          btn.focus();
        }
      });
    });
  };

  const mountOrInit = async () => {
    // Fall A: Section ist bereits im DOM vorhanden (serverseitig eingebaut)
    const existing = document.getElementById('philosophy');
    if (existing) {
      initPhilosophy();
      return;
    }

    // Fall B: Wir haben einen Mount-Point, laden Partial und ersetzen ihn
    const mount = document.getElementById('philosophy-root');
    if (!mount) {
      // Weder Section noch Mount vorhanden → nichts zu tun
      return;
    }

    try {
      const html = await tryFetch(CANDIDATES);
      // Wir erwarten, dass das Partial bereits <section id="philosophy"> enthält.
      mount.outerHTML = html;

      // optionales Fade-In direkt triggern (wenn du .fade-in-up nutzt)
      requestAnimationFrame(() => {
        const sec = document.getElementById('philosophy');
        if (sec && sec.classList.contains('fade-in-up')) {
          sec.classList.add('visible');
        }
      });

      // Disclosure initialisieren
      initPhilosophy();
    } catch (err) {
      console.warn('[philosophy] Laden fehlgeschlagen:', err);
      // Fallback-UI
      const year = new Date().getFullYear();
      mount.outerHTML = `
        <section id="philosophy" class="section-padding fade-in-up">
          <div class="container mx-auto px-6">
            <div class="glassmorphism p-6 rounded-xl shadow-xl text-center">
              <p class="text-sm opacity-80">
                Die Philosophie-Sektion konnte aktuell nicht geladen werden. (${year})
              </p>
            </div>
          </div>
        </section>`;
      initPhilosophy();
    }
  };

  // Initial ausführen, wenn DOM bereit (defer reicht meist, hier doppelt sicher)
  document.addEventListener('DOMContentLoaded', mountOrInit);
})();
