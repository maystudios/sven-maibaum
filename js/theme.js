// js/theme.js

// Diese Funktion ist global, damit header.js sie nach dem Laden aufrufen kann
window.initThemeToggle = () => {
  const root = document.documentElement;
  
  // Versuche den Button zu finden
  const btn = document.getElementById('theme-toggle');
  const iconDark = document.getElementById('theme-toggle-dark-icon');
  const iconLight = document.getElementById('theme-toggle-light-icon');

  const updateIcons = (theme) => {
    const isDark = theme === 'dark';
    if (iconDark) iconDark.classList.toggle('hidden', !isDark);
    if (iconLight) iconLight.classList.toggle('hidden', isDark);
  };

  // Hilfsfunktion um Klasse und Attribut synchron zu halten
  const setThemeState = (theme) => {
      root.setAttribute('data-theme', theme);
      if (theme === 'dark') {
          root.classList.add('dark');
      } else {
          root.classList.remove('dark');
      }
  };

  // Aktuelles Theme lesen und initial setzen
  const currentTheme = root.getAttribute('data-theme') || 'light';
  setThemeState(currentTheme);
  updateIcons(currentTheme);

  const toggleTheme = (e) => {
    if(e) e.preventDefault();
    
    // Prüfen was aktuell gesetzt ist
    const isDarkCurrent = root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark';
    const next = isDarkCurrent ? 'light' : 'dark';
    
    setThemeState(next);
    localStorage.setItem('theme', next);
    updateIcons(next);
    
    // Repaint Fix für Safari/Glassmorphism Header
    const header = document.querySelector('header');
    if(header) {
        header.style.transform = 'translateZ(0)';
        requestAnimationFrame(() => header.style.transform = '');
    }
  };

  if (btn) {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', toggleTheme);
  }
};

document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    
    const root = document.documentElement;
    root.setAttribute('data-theme', initial);
    if (initial === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');

    window.initThemeToggle();
});

document.addEventListener('headerLoaded', () => {
    window.initThemeToggle();
});