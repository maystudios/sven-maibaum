// js/theme.js
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    // Funktion zum Anwenden des Themes und Aktualisieren der Icon-Sichtbarkeit
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeToggleDarkIcon) themeToggleDarkIcon.classList.remove('hidden');
            if (themeToggleLightIcon) themeToggleLightIcon.classList.add('hidden');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeToggleDarkIcon) themeToggleDarkIcon.classList.add('hidden');
            if (themeToggleLightIcon) themeToggleLightIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'light');
        }
    };

    // Überprüft gespeichertes Theme im localStorage oder Systempräferenz
    // Die initiale Theme-Setzung erfolgt bereits durch das Skript im <head>
    // Dieses Skript hier stellt sicher, dass die Icons korrekt sind und der Button funktioniert.
    let currentTheme = document.documentElement.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        if (themeToggleDarkIcon) themeToggleDarkIcon.classList.remove('hidden');
        if (themeToggleLightIcon) themeToggleLightIcon.classList.add('hidden');
    } else {
        if (themeToggleDarkIcon) themeToggleDarkIcon.classList.add('hidden');
        if (themeToggleLightIcon) themeToggleLightIcon.classList.remove('hidden');
    }
    
    // Event-Listener für den Umschalt-Button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // Lauscht auf Änderungen in der Systempräferenz
    // Dies wird nur angewendet, wenn der Benutzer nicht explizit ein Theme gewählt hat.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) { // Nur ändern, wenn keine explizite Wahl getroffen wurde
            if (e.matches) {
                applyTheme('dark');
            } else {
                applyTheme('light');
            }
        }
    });
});
