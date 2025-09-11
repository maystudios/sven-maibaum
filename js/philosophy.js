// /js/philosophy.js
(function () {
  // 1) Component Loader (wie footer.js)
  const candidates = [
    '/components/philosophy.html',
    'components/philosophy.html',
    './components/philosophy.html'
  ];

  const mount = document.getElementById('philosophy-root');
  if (!mount) return;

  const tryFetch = async (urls) => {
    for (const url of urls) {
      try {
        const res = await fetch(url, { credentials: 'same-origin' });
        if (res.ok) return await res.text();
      } catch (_) { /* next */ }
    }
    throw new Error('Philosophy component konnte nicht geladen werden.');
  };

  // 2) Content-Daten für Info-Karte (ALLES hier gebündelt)
  const info = {
    modular: {
      title: 'Modular & erweiterbar',
      body: [
        'Systeme sind nie wirklich „fertig“. Ich designe APIs und Grenzen so, dass sie Erweiterungen aushalten – ohne Refactor-Lawinen.',
        'Hexagonal / Ports-&-Adapters, klare Abhängigkeitsrichtung, Events für Entkopplung wo sinnvoll.'
      ],
      bullets: [
        'Stabile Domänengrenzen, klare Verantwortlichkeiten',
        'Versionierbare Schnittstellen (API-Verträge)',
        'Kompatibel mit „modularer Monolith“ und Microservice-Cut'
      ],
      tags: ['Modular Monolith', 'Ports & Adapters', 'Extensibility']
    },
    clean: {
      title: 'Clean Code & Design',
      body: [
        'Lesbar, testbar, änderbar – das zählt nachhaltig mehr als „clevere“ Einzeiler.',
        'Naming, klare Module, geringe Kopplung, hohe Kohäsion, sinnvolle Comments & Docs.'
      ],
      bullets: [
        'SOLID / KISS / YAGNI pragmatisch anwenden',
        'Automatisierte Tests & Linting',
        'Architektur-Fitnessfunktionen (Build-Guardrails)'
      ],
      tags: ['Clean Code', 'Testing', 'Maintainability']
    },
    proto: {
      title: 'Schnell prototypen & lernen',
      body: [
        'Ich validiere früh: kleine Prototypen geben schnelle Erkenntnisse – auch wenn wir sie verwerfen.',
        'Fail-fast, aber nachhaltig: Prototyp ≠ Müllcode – Erkenntnisse fließen kuratiert ins Produkt.'
      ],
      bullets: [
        'Spike/Prototype → Decision Record',
        'Messbare Hypothesen statt Bauchgefühl',
        'Zeitbudget & Exit-Kriterien definieren'
      ],
      tags: ['Prototyping', 'Lean Learning', 'ADR']
    },
    core: {
      title: 'Core-Systeme & Dev-Tools',
      body: [
        'Ich baue gern Grundlagen, die anderen den Alltag erleichtern: Utility-Libs, Reusable Widgets/Plugins, CI-Snippets.',
        'Viele kleine 1%-Verbesserungen ergeben spürbare Velocity-Gewinne.'
      ],
      bullets: [
        'Wiederverwendbare Komponenten/Blueprint-Libraries',
        'Gute Defaults, klare Doku, Beispielprojekte',
        '„Golden Path“ + Guardrails'
      ],
      tags: ['DX', 'Tooling', 'Reuse']
    }
  };

  // 3) Hilfsfunktionen für das Overlay
  const el = {
    overlay: null,
    close: null,
    title: null,
    body: null,
    tags: null
  };

  const openOverlay = (key) => {
    const data = info[key];
    if (!data || !el.overlay) return;

    // Titel
    el.title.textContent = data.title;

    // Body (Absätze + Bullets)
    const paras = (data.body || []).map(p => `<p>${p}</p>`).join('');
    const bullets = (data.bullets && data.bullets.length)
      ? `<ul class="list-disc list-inside space-y-1">${data.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`
      : '';

    el.body.innerHTML = `${paras}${bullets}`;

    // Tags
    el.tags.innerHTML = (data.tags || [])
      .map(t => `<span class="tech-tag">${t}</span>`)
      .join(' ');

    // Anzeigen + Scroll lock
    el.overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // Fokus für A11y
    el.close.focus();
  };

  const closeOverlay = () => {
    if (!el.overlay) return;
    el.overlay.classList.add('hidden');
    document.body.style.overflow = '';
  };

  // 4) Initialisieren
  (async () => {
    try {
      const html = await tryFetch(candidates);
      mount.innerHTML = html;

      // Query Overlay-Elemente nach dem Einfügen
      el.overlay = mount.querySelector('#philosophy-overlay');
      el.close   = mount.querySelector('#philosophy-close');
      el.title   = mount.querySelector('#philosophy-title');
      el.body    = mount.querySelector('#philosophy-body');
      el.tags    = mount.querySelector('#philosophy-tags');

      // Klick-Handler auf Kacheln
      mount.querySelectorAll('.phil-card').forEach(card => {
        card.addEventListener('click', () => {
          const key = card.getAttribute('data-key');
          openOverlay(key);
        });
      });

      // Overlay Close-Handler
      if (el.close) el.close.addEventListener('click', closeOverlay);
      if (el.overlay) {
        el.overlay.addEventListener('click', (e) => {
          if (e.target === el.overlay) closeOverlay();
        });
      }
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && el.overlay && !el.overlay.classList.contains('hidden')) {
          closeOverlay();
        }
      });

      // Optional: Scroll-In Animation aktivieren (wie im Showcase)
      const animated = mount.querySelectorAll('.fade-in-up');
      if (typeof IntersectionObserver !== 'undefined' && animated.length) {
        const obs = new IntersectionObserver((entries, o) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              o.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        animated.forEach(elm => obs.observe(elm));
      } else {
        animated.forEach(elm => elm.classList.add('visible'));
      }
    } catch (err) {
      console.warn(err);
      // Fallback Minimal-Content
      mount.innerHTML = `
        <section class="section-padding">
          <div class="container mx-auto px-6 text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-4 gradient-text">Meine Arbeitsphilosophie</h2>
            <p>Komponente konnte nicht geladen werden.</p>
          </div>
        </section>
      `;
    }
  })();
})();
