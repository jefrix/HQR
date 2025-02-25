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

    // Smooth scrolling for all navigation links
    document.querySelectorAll('.main-nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
