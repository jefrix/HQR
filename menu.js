// menu.js
document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle (mobile only)
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    navList.classList.remove('active');
                }
            });
        });
    }

    // Handle navigation for all links (internal anchors, external pages, and self-references)
    document.querySelectorAll('.main-nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            const href = this.getAttribute('href');

            // Check if the link is empty or invalid
            if (!href) return;

            // Get the current page URL
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';

            // Handle different types of links
            if (href.startsWith('#')) {
                // Internal anchor link (within the current page)
                const section = document.querySelector(href);
                if (section) {
                    section.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } else if (href === window.location.pathname || href === currentPage) {
                // Self-reference (e.g., "reconciliation.html" on reconciliation.html)
                // No navigation needed, but ensure smooth scrolling if it includes a hash
                const hash = href.split('#')[1];
                if (hash) {
                    const section = document.querySelector('#' + hash);
                    if (section) {
                        section.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            } else {
                // External or cross-page link (e.g., "index.html#abstract", "reconciliation.html")
                // Navigate to the full URL
                const fullUrl = href.startsWith('/') ? window.location.origin + href : href;
                window.location.href = fullUrl;
            }
        });
    });
});
