/* Updated menu.js */
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    navList.classList.remove('active');
                }
            });
        });
    }
    document.querySelectorAll('.main-nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (!href) return;
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            if (href.startsWith('#')) {
                const section = document.querySelector(href);
                if (section) {
                    section.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } else if (href === window.location.pathname || href === currentPage) {
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
                const fullUrl = href.startsWith('/') ? window.location.origin + href : href;
                window.location.href = fullUrl;
            }
        });
    });
});
