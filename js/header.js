(function () {
    const mount = document.querySelector('header');
    if (!mount) return;

    // Pfad-Korrektur für Unterordner
    const isPagesDir = window.location.pathname.includes('/pages/') || window.location.pathname.includes('/blog/');
    const basePath = isPagesDir ? '../' : './';
    const headerUrl = basePath + 'components/header.html';

    fetch(headerUrl)
        .then(response => {
            if (!response.ok) throw new Error('Header loading failed');
            return response.text();
        })
        .then(html => {
            mount.innerHTML = html;
            
            // 1. Links anpassen für Unterordner
            if (isPagesDir) {
                const links = mount.querySelectorAll('a');
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('/')) {
                        link.setAttribute('href', '..' + href);
                    }
                });
            }

            // 2. Mobile Menu initialisieren
            initMobileMenu();

            // 3. Theme Toggle binden (oder neu initialisieren)
            if (window.initThemeToggle) {
                window.initThemeToggle();
            } else {
                document.dispatchEvent(new Event('headerLoaded'));
            }
        })
        .catch(err => console.error('Error loading header:', err));

    function initMobileMenu() {
        const btn = document.getElementById('mobile-menu-button');
        const closeBtn = document.getElementById('close-mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        const links = document.querySelectorAll('.mobile-menu-link');

        if (!btn || !menu) return;

        const openMenu = () => {
            menu.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden'; // Scrollen verhindern
        };

        const closeMenu = () => {
            menu.classList.add('translate-x-full');
            document.body.style.overflow = ''; // Scrollen erlauben
        };

        btn.addEventListener('click', openMenu);
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeMenu);
        }
        
        // Menü schließen bei Klick auf einen Link
        links.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
})();