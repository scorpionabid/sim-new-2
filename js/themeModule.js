// Theme Module - Dark/Light Mode Toggle
class ThemeModule {
    constructor() {
        this.themeToggleBtn = document.getElementById('theme-toggle-btn');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.animationModule = null;
    }

    // Set animation module reference
    setAnimationModule(animationModule) {
        this.animationModule = animationModule;
    }

    // Enhanced Dark Mode Toggle
    setupThemeToggle() {
        // Apply saved theme
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    // Toggle between light and dark themes
    toggleTheme() {
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
        
        // Update particles theme if animation module is available
        if (this.animationModule) {
            this.animationModule.updateParticlesTheme(this.currentTheme);
        }
    }

    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Set theme programmatically
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.currentTheme = theme;
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            localStorage.setItem('theme', this.currentTheme);
            
            // Update particles theme if animation module is available
            if (this.animationModule) {
                this.animationModule.updateParticlesTheme(this.currentTheme);
            }
        }
    }

    // Initialize theme module
    init() {
        this.setupThemeToggle();
    }
}

// Export for use in main script
window.ThemeModule = ThemeModule;