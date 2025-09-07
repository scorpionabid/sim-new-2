// Animation Module - Particles.js, AOS, GSAP
class AnimationModule {
    constructor() {
        this.particles = null;
        this.currentTheme = 'light';
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

    // Update particles theme
    updateParticlesTheme(theme) {
        this.currentTheme = theme;
        if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
            const particles = pJSDom[0].pJS;
            const newColor = theme === 'dark' ? '#cbd5e1' : '#667eea';
            
            particles.particles.color.value = newColor;
            particles.particles.line_linked.color = newColor;
            particles.fn.particlesRefresh();
        }
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

    // Initialize all animations
    init() {
        this.initParticles();
        this.initAOS();
        this.initGSAPAnimations();
        this.setupScrollAnimations();
    }
}

// Export for use in main script
window.AnimationModule = AnimationModule;