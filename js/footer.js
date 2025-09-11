// /js/footer.js
(function () {
  const candidates = [
    '/components/footer.html',
    'components/footer.html',
    './components/footer.html'
  ];

  const mount = document.getElementById('site-footer-root');
  if (!mount) return;

  // Lade Footer-Datei aus den möglichen Pfaden
  const tryFetch = async (urls) => {
    for (const url of urls) {
      try {
        const res = await fetch(url, { credentials: 'same-origin' });
        if (res.ok) return await res.text();
      } catch (_) { /* Nächster Kandidat */ }
    }
    throw new Error('Footer konnte nicht geladen werden.');
  };

  // Setze Copyright-Jahr
  const hydrateYear = (root) => {
    const y = root.querySelector('#currentYear');
    if (y) y.textContent = new Date().getFullYear();
  };

  (async () => {
    try {
      const html = await tryFetch(candidates);
      mount.innerHTML = html;

      // Jahr setzen
      hydrateYear(mount);
    } catch (err) {
      console.warn(err);
      // Fallback minimaler Footer
      mount.innerHTML = `
        <footer class="footer glassmorphism border-t">
          <div class="container mx-auto px-6 py-4 text-sm text-center">
            © <span id="currentYear">${new Date().getFullYear()}</span> Sven Maibaum
          </div>
        </footer>
      `;
    }
  })();
})();
