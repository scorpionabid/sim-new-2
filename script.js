// Ultra Modern JavaScript with Advanced Features
class SIMPortal {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('nav a[href^="#"]');
        this.contactForm = document.getElementById('contact-form');
        this.scrollIndicator = null;
        this.themeToggleBtn = document.getElementById('theme-toggle-btn');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    // Initialize all advanced features
    init() {
        document.body.classList.add('loading');
        
        this.initParticles();
        this.initAOS();
        this.setupThemeToggle();
        this.createScrollIndicator();
        this.setupSmoothScrolling();
        this.setupNavbarScroll();
        this.setupFormValidation();
        this.setupScrollAnimations();
        this.loadNewsAndAnnouncements();
        this.setupKeyboardNavigation();
        this.initGSAPAnimations();
        
        // Remove loading class and add loaded class
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }, 800);
    }

    // Initialize Particles.js
    initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 80,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: "#667eea"
                    },
                    shape: {
                        type: "circle",
                        stroke: {
                            width: 0,
                            color: "#000000"
                        }
                    },
                    opacity: {
                        value: 0.5,
                        random: false,
                        anim: {
                            enable: false,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: false,
                            speed: 40,
                            size_min: 0.1,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#667eea",
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        random: false,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: {
                            enable: true,
                            mode: "repulse"
                        },
                        onclick: {
                            enable: true,
                            mode: "push"
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 400,
                            line_linked: {
                                opacity: 1
                            }
                        },
                        bubble: {
                            distance: 400,
                            size: 40,
                            duration: 2,
                            opacity: 8,
                            speed: 3
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4
                        },
                        push: {
                            particles_nb: 4
                        },
                        remove: {
                            particles_nb: 2
                        }
                    }
                },
                retina_detect: true
            });
        }
    }

    // Initialize AOS (Animate on Scroll)
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                delay: 100,
                anchorPlacement: 'top-bottom'
            });
        }
    }

    // Initialize GSAP Animations
    initGSAPAnimations() {
        if (typeof gsap !== 'undefined') {
            // Hero section animations
            const tl = gsap.timeline();
            
            tl.from('.hero-section h1', {
                duration: 1.2,
                y: 50,
                opacity: 0,
                ease: 'power3.out'
            })
            .from('.hero-section p', {
                duration: 1,
                y: 30,
                opacity: 0,
                ease: 'power3.out'
            }, '-=0.8')
            .from('.hero-btn', {
                duration: 0.8,
                scale: 0.8,
                opacity: 0,
                ease: 'back.out(1.7)'
            }, '-=0.5');

            // Floating shapes animation
            gsap.to('.shape-1', {
                duration: 6,
                rotation: 360,
                y: -20,
                ease: 'none',
                repeat: -1,
                yoyo: true
            });

            gsap.to('.shape-2', {
                duration: 8,
                rotation: -360,
                y: -30,
                ease: 'none',
                repeat: -1,
                yoyo: true
            });

            gsap.to('.shape-3', {
                duration: 7,
                rotation: 360,
                y: -15,
                ease: 'none',
                repeat: -1,
                yoyo: true
            });
        }
    }

    // Enhanced Dark Mode Toggle
    setupThemeToggle() {
        // Apply saved theme
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => {
                this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', this.currentTheme);
                localStorage.setItem('theme', this.currentTheme);
                
                // Animate icon change
                if (typeof gsap !== 'undefined') {
                    gsap.to(this.themeToggleBtn, {
                        duration: 0.3,
                        rotation: 360,
                        ease: 'power2.out'
                    });
                }
                
                this.updateParticlesTheme();
            });
        }
    }

    // Update particles theme
    updateParticlesTheme() {
        if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
            const particles = pJSDom[0].pJS;
            const newColor = this.currentTheme === 'dark' ? '#cbd5e1' : '#667eea';
            
            particles.particles.color.value = newColor;
            particles.particles.line_linked.color = newColor;
            particles.fn.particlesRefresh();
        }
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

    // Setup scroll animations using Intersection Observer
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe cards and sections
        const elementsToObserve = document.querySelectorAll('.card, section > .container > h2');
        elementsToObserve.forEach(el => observer.observe(el));
    }

    // Enhanced form validation
    setupFormValidation() {
        if (!this.contactForm) return;

        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitForm();
            }
        });

        // Real-time validation
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch (field.type) {
            case 'text':
                if (value === '') {
                    isValid = false;
                    message = 'Bu sahə boş ola bilməz';
                } else if (value.length < 2) {
                    isValid = false;
                    message = 'Minimum 2 simbol daxil edin';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value === '') {
                    isValid = false;
                    message = 'E-poçt ünvanı daxil edin';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    message = 'Düzgün e-poçt formatı daxil edin';
                }
                break;
            default:
                if (field.tagName === 'TEXTAREA' && value === '') {
                    isValid = false;
                    message = 'Mesaj daxil edin';
                } else if (field.tagName === 'TEXTAREA' && value.length < 10) {
                    isValid = false;
                    message = 'Mesaj minimum 10 simbol olmalıdır';
                }
        }

        if (isValid) {
            this.setFieldSuccess(field);
        } else {
            this.setFieldError(field, message);
        }

        return isValid;
    }

    // Set field error state
    setFieldError(field, message) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        // Remove existing error message
        const existingError = field.parentElement.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        field.parentElement.appendChild(errorDiv);
    }

    // Set field success state
    setFieldSuccess(field) {
        field.classList.add('is-valid');
        field.classList.remove('is-invalid');
        
        // Remove error message
        const existingError = field.parentElement.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
    }

    // Clear field error
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const existingError = field.parentElement.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
    }

    // Validate entire form
    validateForm() {
        const fields = this.contactForm.querySelectorAll('input, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Submit form (enhanced with loading state)
    submitForm() {
        const submitButton = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Göndərilir...';

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Show success message
            this.showNotification('Mesajınız uğurla göndərildi!', 'success');
            
            // Reset form
            this.contactForm.reset();
            this.contactForm.querySelectorAll('.is-valid').forEach(field => {
                field.classList.remove('is-valid');
            });
        }, 2000);
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.sim-notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `sim-notification alert alert-${type === 'success' ? 'success' : 'info'} alert-dismissible fade show`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: var(--shadow-lg);
            border: none;
            border-radius: var(--radius-lg);
        `;
        
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 150);
        }, 5000);
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

    // Load news and announcements with enhanced UI
    loadNewsAndAnnouncements() {
        const newsContainer = document.querySelector('#xeberler-elanlar .row');
        if (!newsContainer) return;

        const news = [
            {
                title: 'Yeni Təhsil Proqramı',
                content: 'Azərbaycanda yeni təhsil proqramı tətbiq olunur. Bu proqram müasir tələblərə uyğun olaraq hazırlanmışdır.',
                date: '2024-01-15',
                urgent: false
            },
            {
                title: 'Müəllimlərin İxtisasartırma Kursu',
                content: 'Növbəti ay ərzində müəllimlər üçün yeni ixtisasartırma kursları keçiriləcək. Qeydiyyat açıqdır.',
                date: '2024-01-20',
                urgent: false
            }
        ];

        // Clear existing dynamic content
        const existingCards = newsContainer.querySelectorAll('.dynamic-news-card');
        existingCards.forEach(card => card.remove());

        news.forEach((item, index) => {
            const newsCard = document.createElement('div');
            newsCard.className = 'col-md-6 mb-4 dynamic-news-card';
            newsCard.style.animationDelay = `${index * 0.1}s`;
            
            const urgentBadge = item.urgent ? '<span class="badge bg-danger mb-2">Vacib</span>' : '';
            const formattedDate = new Date(item.date).toLocaleDateString('az-AZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            newsCard.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        ${urgentBadge}
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.content}</p>
                        <small class="text-muted d-block mb-3">
                            <i class="fas fa-calendar-alt me-1"></i>${formattedDate}
                        </small>
                        <a href="#" class="btn btn-outline-primary">Ətraflı</a>
                    </div>
                </div>
            `;
            
            newsContainer.appendChild(newsCard);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SIMPortal();
});

// Add CSS for Bootstrap validation states
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .is-valid {
        border-color: var(--success) !important;
    }
    
    .is-invalid {
        border-color: var(--error) !important;
    }
    
    .invalid-feedback {
        display: block !important;
        color: var(--error);
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    .fade-in-up {
        opacity: 0;
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .sim-notification {
        animation: slideInRight 0.3s ease-out;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(validationStyles);