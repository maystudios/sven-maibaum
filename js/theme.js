// js/theme.js

// Diese Funktion ist global, damit header.js sie nach dem Laden aufrufen kann
window.initThemeToggle = () => {
  const root = document.documentElement;
  
  const btn = document.getElementById('theme-toggle');
  const iconDark = document.getElementById('theme-toggle-dark-icon');
  const iconLight = document.getElementById('theme-toggle-light-icon');

  const updateIcons = (theme) => {
    const isDark = theme === 'dark';
    if (iconDark) iconDark.classList.toggle('hidden', !isDark);
    if (iconLight) iconLight.classList.toggle('hidden', isDark);
  };

  // Aktuelles Theme lesen
  const currentTheme = root.getAttribute('data-theme') || 'light';
  updateIcons(currentTheme);

  const toggleTheme = () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcons(next);
    
    // Repaint Fix für Safari/Glassmorphism
    const header = document.querySelector('header');
    if(header) {
        header.style.transform = 'translateZ(0)';
        requestAnimationFrame(() => header.style.transform = '');
    }
  };

  if (btn) {
      // Alten Listener entfernen durch Klonen (verhindert doppelte Events)
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', toggleTheme);
  }
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialer Check beim Seitenladen
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initial);
});

// Reagiert, falls header.js das Event feuert bevor window.initThemeToggle verfügbar war
document.addEventListener('headerLoaded', () => {
    window.initThemeToggle();
});