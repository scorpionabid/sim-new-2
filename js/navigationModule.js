// Navigation Module - Smooth Scroll, Navbar Effects, Progress Indicator
class NavigationModule {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('nav a[href^="#"]');
        this.scrollIndicator = null;
    }

    // Create scroll progress indicator
    createScrollIndicator() {
        this.scrollIndicator = document.createElement('div');
        this.scrollIndicator.className = 'scroll-indicator';
        document.body.appendChild(this.scrollIndicator);

        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            this.scrollIndicator.style.transform = `scaleX(${scrollPercent / 100})`;
        });
    }

    // Enhanced smooth scrolling
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Update active nav link
                    this.updateActiveNavLink(link);
                }
            });
        });
    }

    // Update active navigation link
    updateActiveNavLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    // Enhanced navbar scroll effects
    setupNavbarScroll() {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Add/remove scrolled class
            if (currentScrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll (optional - disabled for better UX)
            // if (currentScrollY > lastScrollY && currentScrollY > 100) {
            //     this.navbar.style.transform = 'translateY(-100%)';
            // } else {
            //     this.navbar.style.transform = 'translateY(0)';
            // }

            lastScrollY = currentScrollY;
        });
    }

    // Setup keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC key to close dropdowns
            if (e.key === 'Escape') {
                const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
                openDropdowns.forEach(dropdown => {
                    const toggle = dropdown.previousElementSibling;
                    if (toggle) {
                        bootstrap.Dropdown.getInstance(toggle)?.hide();
                    }
                });
            }

            // Tab key navigation enhancement
            if (e.key === 'Tab') {
                const focusableElements = document.querySelectorAll(
                    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
                );
                
                // Add focus outline for keyboard users
                focusableElements.forEach(el => {
                    el.addEventListener('focus', () => el.style.outline = '2px solid var(--primary-color)');
                    el.addEventListener('blur', () => el.style.outline = 'none');
                });
            }
        });
    }

    // Initialize navigation module
    init() {
        this.createScrollIndicator();
        this.setupSmoothScrolling();
        this.setupNavbarScroll();
        this.setupKeyboardNavigation();
    }
}

// Export for use in main script
window.NavigationModule = NavigationModule;