// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMobileMenuButton = document.getElementById('close-mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

    if (mobileMenuButton && mobileMenu && closeMobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.remove('-translate-x-full');
            mobileMenu.classList.add('translate-x-0');
            mobileMenuButton.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = () => {
            mobileMenu.classList.add('-translate-x-full');
            mobileMenu.classList.remove('translate-x-0');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };

        closeMobileMenuButton.addEventListener('click', closeMenu);
        mobileMenuLinks.forEach(link => {
            if (link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', closeMenu);
            }
        });
    }

    // Set current year in footer (für index.html)
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Smooth scroll for navigation links on the main page (index.html)
    if (document.getElementById('home')) { 
        document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
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
                            behavior: "smooth"
                        });
                    }
                }
            });
        });
    }

    // Intersection Observer for Scroll Animations
    const animatedSections = document.querySelectorAll('.fade-in-up');
    if (typeof IntersectionObserver !== 'undefined') {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observerInstance.unobserve(entry.target); 
                }
            });
        }, observerOptions);

        animatedSections.forEach(section => {
            observer.observe(section);
        });
    } else {
        animatedSections.forEach(section => {
            section.classList.add('visible');
        });
    }

    // Project filtering
    const filterButtons = document.querySelectorAll('#project-filters .filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            projectCards.forEach(card => {
                const tags = card.dataset.tags ? card.dataset.tags.split(' ') : [];
                if (filter === 'all' || tags.includes(filter)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Der alte Code für das Kontaktformular (id="contactForm") wurde entfernt,
    // da Formspree die Formularverarbeitung übernimmt.
});
