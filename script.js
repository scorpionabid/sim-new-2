// Main SIM Portal Application - Modular Architecture
class SIMPortal {
    constructor() {
        // Initialize modules
        this.animationModule = new AnimationModule();
        this.themeModule = new ThemeModule();
        this.navigationModule = new NavigationModule();
        this.formModule = new FormModule();
        this.newsModule = new NewsModule();
        
        // Set up module connections
        this.themeModule.setAnimationModule(this.animationModule);
        
        this.init();
    }

    // Initialize all modules and features
    init() {
        document.body.classList.add('loading');
        
        // Initialize all modules
        this.animationModule.init();
        this.themeModule.init();
        this.navigationModule.init();
        this.formModule.init();
        this.newsModule.init();
        
        // Remove loading class and add loaded class
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }, 800);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SIMPortal();
});

// Add CSS for Bootstrap validation states and animations
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
    
    @keyframes fadeInUp {
        from { 
            opacity: 0; 
            transform: translateY(30px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
`;
document.head.appendChild(validationStyles);