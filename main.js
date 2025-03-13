// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        easing: 'ease-out-cubic'
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Auto-scroll functionality
    let autoScrollInterval;
    let scrollingDown = true;
    const scrollStep = 1;
    const scrollInterval = 20;

    function autoScroll() {
        if (scrollingDown) {
            window.scrollBy(0, scrollStep);
            if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
                scrollingDown = false;
            }
        } else {
            window.scrollBy(0, -scrollStep);
            if (window.scrollY <= 0) {
                scrollingDown = true;
            }
        }
    }

    const autoScrollBtn = document.getElementById('autoScrollBtn');
    if (autoScrollBtn) { // Check if the button exists
        autoScrollBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            if (this.classList.contains('active')) {
                autoScrollInterval = setInterval(autoScroll, scrollInterval);
            } else {
                clearInterval(autoScrollInterval);
            }
        });
    }


    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const headerOffset = 72;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                document.querySelector('.navbar-toggler').click();
            }
        });
    });

    // Add active class to nav items on scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.navbar-nav .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') && item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });
});