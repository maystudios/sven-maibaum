// Portfolio/js/architect-showcase.js
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYearShowcase');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Modal elements
    const modal = document.getElementById('componentInfoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const closeModalButton = document.getElementById('closeModalButton');

    // Diagram components
    const diagramComponents = document.querySelectorAll('.diagram-component');

    // Data for modal content (simplified from the document)
    const componentDetails = {
        'hexagon-core-details': {
            title: 'Hexagonaler Kern (Geschäftslogik)',
            description: 'Der Kern des Moduls enthält die reine Geschäftslogik, unabhängig von externer Infrastruktur. Er definiert, was die Anwendung kann, nicht wie es technisch umgesetzt wird.',
            points: [
                'Bildet die strukturelle Grundlage für einzelne Geschäftsmodule.',
                'Trennt klar die Geschäftslogik von Infrastruktur und externen Anbindungen.',
                'Interaktionen erfolgen ausschließlich über definierte Schnittstellen (Ports).'
            ],
            tags: ['Domain Logic', 'Business Rules', 'Encapsulation']
        },
        'input-port-details': {
            title: 'Input Port (Driving Port)',
            description: 'Definiert, wie der Kern von außen angestoßen wird. Dient als Schnittstelle für Anwendungsdienste, die von Adaptern aufgerufen werden.',
            points: [
                'Ermöglicht Aufrufe von UI-Adaptern, Test-Adaptern oder Event-Listener-Adaptern.',
                'Kapselt Anwendungsfälle (Use Cases).'
            ],
            tags: ['API', 'Use Cases', 'Application Services']
        },
        'output-port-details': {
            title: 'Output Port (Driven Port)',
            description: 'Definiert, wie der Kern mit externen Systemen oder Infrastrukturkomponenten interagiert, ohne direkte Abhängigkeiten zu diesen aufzubauen.',
            points: [
                'Wird von Adaptern implementiert (z.B. Datenbankzugriff, Event-Publizierung).',
                'Beispiele: Repository-Port, Event-Publisher-Port.'
            ],
            tags: ['Abstractions', 'Infrastructure Interface']
        },
        'adapter-details': {
            title: 'Adapter',
            description: 'Adapter verbinden den hexagonalen Kern mit der Außenwelt. Sie implementieren Output-Ports oder rufen Input-Ports auf.',
            points: [
                'Driving Adapter (Input): Konvertieren externe Anfragen (HTTP, Events) in Aufrufe an Input-Ports (z.B. UI-Controller, Event-Listener).',
                'Driven Adapter (Output): Implementieren Output-Ports für die Interaktion mit Infrastruktur (z.B. Datenbank-Repositories, Message Broker Clients).'
            ],
            tags: ['Infrastructure', 'Integration', 'Decoupling']
        },
        'event-bus-details': {
            title: 'Interner Event-Bus / Broker',
            description: 'Ermöglicht die asynchrone und entkoppelte Kommunikation zwischen den verschiedenen hexagonalen Modulen innerhalb des Monolithen.',
            points: [
                'Empfängt Ereignisse von Event-Produzenten (Module).',
                'Leitet Ereignisse an interessierte Event-Konsumenten (andere Module) weiter.',
                'Kann In-Prozess implementiert sein für Monolithen.'
            ],
            tags: ['EDA', 'Asynchronous', 'Decoupling', 'Pub/Sub']
        },
         'database-details-a': {
            title: 'Logische Datenbank (Modul A)',
            description: 'Jedes Geschäftsmodul (Hexagon) ist für seine eigenen Daten zuständig und besitzt logisch seine eigene Datenbank (z.B. eigenes Schema, eigene Tabellen).',
            points: [
                'Datenhoheit liegt beim Modul.',
                'Andere Module dürfen nicht direkt auf die Datenbanktabellen eines fremden Moduls zugreifen.',
                'Zugriff auf fremde Daten erfolgt über die API (Ports) des jeweiligen Moduls oder durch Reaktion auf publizierte Ereignisse.'
            ],
            tags: ['Data Ownership', 'Encapsulation', 'Schema per Module']
        },
        'database-details-b': {
            title: 'Logische Datenbank (Modul B)',
            description: 'Jedes Geschäftsmodul (Hexagon) ist für seine eigenen Daten zuständig und besitzt logisch seine eigene Datenbank (z.B. eigenes Schema, eigene Tabellen).',
            points: [
                'Datenhoheit liegt beim Modul.',
                'Andere Module dürfen nicht direkt auf die Datenbanktabellen eines fremden Moduls zugreifen.',
                'Zugriff auf fremde Daten erfolgt über die API (Ports) des jeweiligen Moduls oder durch Reaktion auf publizierte Ereignisse.'
            ],
            tags: ['Data Ownership', 'Encapsulation', 'Schema per Module']
        }
    };

    // Function to show the modal with details for a given component key
    function showModal(componentKey) {
        const details = componentDetails[componentKey];
        if (!details) {
            // Log a warning if details for the given key are not found
            console.warn('Details not found for key:', componentKey);
            // Set a default title and message if details are missing
            modalTitle.textContent = 'Information';
            modalBody.innerHTML = '<p>Keine Details für diese Komponente verfügbar.</p>';
        } else {
            // Populate modal with title and description
            modalTitle.textContent = details.title;
            let bodyHtml = `<p>${details.description}</p>`;
            
            // Add points to modal body if they exist
            if (details.points && details.points.length > 0) {
                bodyHtml += '<ul>';
                details.points.forEach(point => {
                    bodyHtml += `<li>${point}</li>`;
                });
                bodyHtml += '</ul>';
            }
            
            // Add tags to modal body if they exist
            if (details.tags && details.tags.length > 0) {
                bodyHtml += '<div class="mt-4">';
                details.tags.forEach(tag => {
                    // Determine tag color based on content (can be expanded)
                    let tagColorClass = 'tech-tag-gray'; // Default color
                    if (tag.toLowerCase().includes('eda') || tag.toLowerCase().includes('async')) tagColorClass = 'tech-tag-red';
                    else if (tag.toLowerCase().includes('api') || tag.toLowerCase().includes('use cases')) tagColorClass = 'tech-tag-green';
                    else if (tag.toLowerCase().includes('domain') || tag.toLowerCase().includes('business')) tagColorClass = 'tech-tag-purple';
                    else if (tag.toLowerCase().includes('infra') || tag.toLowerCase().includes('integration')) tagColorClass = 'tech-tag-blue';

                    bodyHtml += `<span class="tech-tag ${tagColorClass}">${tag}</span> `;
                });
                bodyHtml += '</div>';
            }
            modalBody.innerHTML = bodyHtml; // Set the constructed HTML to modal body
        }
        // Make the modal visible
        if(modal) modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scroll when modal is open
    }

    // Function to hide the modal
    function hideModal() {
        if(modal) modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore background scroll
    }

    // Add click event listeners to all diagram components
    if (diagramComponents) {
        diagramComponents.forEach(component => {
            component.addEventListener('click', () => {
                const detailKey = component.dataset.details; // Get detail key from data attribute
                if (detailKey) {
                    showModal(detailKey);
                } else {
                    // Fallback: if no specific key, try to generate one from the title (less reliable)
                    const titleKey = component.dataset.title ? component.dataset.title.toLowerCase().replace(/\s+/g, '-') : null;
                    if (titleKey) {
                         showModal(titleKey);
                    } else {
                        showModal('default-error'); // Show a generic error if no key can be determined
                    }
                }
            });
        });
    }

    // Add click event listener to the close button of the modal
    if (closeModalButton) {
        closeModalButton.addEventListener('click', hideModal);
    }

    // Add keyboard event listener to close modal on 'Escape' key press
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            hideModal();
        }
    });

    // Add click event listener to close modal when clicking outside the modal content
    if (modal) {
        modal.addEventListener('click', (event) => {
            // Check if the click target is the modal backdrop itself, not its content
            if (event.target === modal) {
                hideModal();
            }
        });
    }

    // Intersection Observer for Scroll Animations
    // This ensures elements with 'fade-in-up' class animate when they enter the viewport
    const animatedSections = document.querySelectorAll('.fade-in-up');
    if (typeof IntersectionObserver !== 'undefined' && animatedSections) {
        const observerOptions = {
            root: null, // Observe in relation to the viewport
            rootMargin: '0px', // No margin around the viewport
            threshold: 0.1 // Trigger when 10% of the element is visible
        };

        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible'); // Add 'visible' class to trigger animation
                    observerInstance.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, observerOptions);

        animatedSections.forEach(section => {
            observer.observe(section); // Start observing each animated section
        });
    } else if (animatedSections) {
        // Fallback for browsers that don't support IntersectionObserver
        // Makes all elements visible immediately
        animatedSections.forEach(section => {
            section.classList.add('visible');
        });
    }
});
