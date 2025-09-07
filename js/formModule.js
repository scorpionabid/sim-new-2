// Form Validation Module
class FormModule {
    constructor() {
        this.contactForm = document.getElementById('contact-form');
    }

    // Enhanced form validation setup
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

    // Initialize form module
    init() {
        this.setupFormValidation();
    }
}

// Export for use in main script
window.FormModule = FormModule;