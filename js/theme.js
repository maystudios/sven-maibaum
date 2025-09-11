// /js/theme.js
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // Desktop
  const btn = document.getElementById('theme-toggle');
  const iconDark = document.getElementById('theme-toggle-dark-icon');   // Mond
  const iconLight = document.getElementById('theme-toggle-light-icon'); // Sonne

  // Mobile
  const btnMobile = document.getElementById('theme-toggle-mobile');
  const iconDarkM = document.getElementById('theme-toggle-dark-icon-mobile');
  const iconLightM = document.getElementById('theme-toggle-light-icon-mobile');

  // Safari/Chrome Glassmorphism repaint kick (fixed header)
  const repaintFixedGlass = () => {
    const header = document.querySelector('header.glassmorphism');
    if (!header) return;
    header.style.transform = 'translateZ(0)';
    requestAnimationFrame(() => { header.style.transform = ''; });
  };

  const syncIcons = (mode) => {
    const isDark = mode === 'dark';

    // Desktop icons
    if (iconDark && iconLight) {
      iconDark.classList.toggle('hidden', !isDark);
      iconLight.classList.toggle('hidden', isDark);
    }
    if (btn) btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');

    // Mobile icons
    if (iconDarkM && iconLightM) {
      iconDarkM.classList.toggle('hidden', !isDark);
      iconLightM.classList.toggle('hidden', isDark);
    }
    if (btnMobile) btnMobile.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  };

  const applyTheme = (theme, { persist = true } = {}) => {
    const mode = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', mode);
    syncIcons(mode);

    if (persist) localStorage.setItem('theme', mode);
    else localStorage.removeItem('theme');

    repaintFixedGlass();
  };

  // ---- Initialzustand ----
  // Head-Inline-Script hat bereits data-theme gesetzt (savedTheme / prefers-color-scheme).
  const savedTheme = localStorage.getItem('theme');
  const currentAttr = root.getAttribute('data-theme'); // 'dark' | 'light' | null

  if (savedTheme && savedTheme !== currentAttr) {
    applyTheme(savedTheme, { persist: true });
  } else {
    applyTheme(currentAttr === 'dark' ? 'dark' : 'light', { persist: !!savedTheme });
  }

  // ---- Event-Handler (Desktop & Mobile) ----
  const toggle = () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next, { persist: true });
  };

  if (btn) btn.addEventListener('click', toggle);
  if (btnMobile) btnMobile.addEventListener('click', toggle);

  // ---- Auf Systempräferenzen reagieren (nur wenn kein savedTheme gesetzt) ----
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const onMediaChange = (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light', { persist: false });
    }
  };
  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', onMediaChange);
  } else if (typeof media.addListener === 'function') {
    media.addListener(onMediaChange);
  }
});
