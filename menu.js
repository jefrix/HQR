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

    // Handle navigation for all links (both internal and external)
    document.querySelectorAll('.main-nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            const href = this.getAttribute('href');

            // Check if the link is an external URL or relative path (not starting with #)
            if (href && !href.startsWith('#')) {
                // Navigate to external/relative URL
                window.location.href = href;
            } else {
                // Handle internal anchors (smooth scrolling)
                const section = document.querySelector(href);
                if (section) {
                    section.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
