// MediTech+ Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initThemeToggle();
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initHeaderScroll();
    initContactForm();
    initScrollToTop();
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add a subtle animation to the toggle
        themeToggle.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

// Mobile Menu Functionality
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Open mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close mobile menu
    if (navClose) {
        navClose.addEventListener('click', function() {
            navMenu.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('show') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
}

// Update Active Navigation Link
function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.card, .stat, .section__header');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class for styling
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        
        // Update active nav link based on scroll position
        updateActiveNavOnScroll();
    });
}

// Update Active Nav Link on Scroll
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && 
            window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.querySelector('.contact__form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form
            if (validateForm(formObject)) {
                handleFormSubmission(formObject, contactForm);
            }
        });
    }
}

// Form Validation
function validateForm(data) {
    const errors = [];
    
    // Required fields validation
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    // Phone validation (optional but if provided should be valid)
    if (data.phone && !isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
    }
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation helper
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Show form errors
function showFormErrors(errors) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.style.cssText = `
        background: #fee;
        border: 1px solid #fcc;
        color: #c33;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    `;
    
    const errorList = document.createElement('ul');
    errorList.style.cssText = 'margin: 0; padding-left: 1.5rem;';
    
    errors.forEach(error => {
        const listItem = document.createElement('li');
        listItem.textContent = error;
        errorList.appendChild(listItem);
    });
    
    errorContainer.appendChild(errorList);
    
    // Insert error container at the top of the form
    const form = document.querySelector('.contact__form');
    form.insertBefore(errorContainer, form.firstChild);
    
    // Scroll to error
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Handle form submission
function handleFormSubmission(data, form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showFormSuccess();
        form.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Show form success message
function showFormSuccess() {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.form-error, .form-success');
    existingMessages.forEach(message => message.remove());
    
    // Create success message
    const successContainer = document.createElement('div');
    successContainer.className = 'form-success';
    successContainer.style.cssText = `
        background: #efe;
        border: 1px solid #cfc;
        color: #363;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        text-align: center;
    `;
    
    successContainer.innerHTML = `
        <p><strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon.</p>
    `;
    
    // Insert success message at the top of the form
    const form = document.querySelector('.contact__form');
    form.insertBefore(successContainer, form.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successContainer.remove();
    }, 5000);
}

// Scroll to Top Functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18,15 12,9 6,15"></polyline>
        </svg>
    `;
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    
    // Add styles
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: var(--brand-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 112, 243, 0.3);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.1)';
        this.style.boxShadow = '0 6px 20px rgba(0, 112, 243, 0.4)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(0, 112, 243, 0.3)';
    });
}

// CTA Button Functionality
document.addEventListener('click', function(e) {
    // Handle CTA buttons
    if (e.target.classList.contains('cta-btn') || 
        e.target.textContent === 'Get Started' ||
        e.target.textContent === 'Start Consultation') {
        
        // Scroll to contact section
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = contactSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Handle "Learn More" button
    if (e.target.textContent === 'Learn More') {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = aboutSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(function() {
    updateActiveNavOnScroll();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add loading animation to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') && !e.target.disabled) {
        const button = e.target;
        const originalText = button.textContent;
        
        // Add ripple effect
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        // Add ripple animation keyframes if not already added
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Initialize lazy loading for better performance
function initLazyLoading() {
    const lazyElements = document.querySelectorAll('.lazy');
    
    if ('IntersectionObserver' in window) {
        const lazyObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyElement = entry.target;
                    lazyElement.classList.remove('lazy');
                    lazyObserver.unobserve(lazyElement);
                }
            });
        });
        
        lazyElements.forEach(element => {
            lazyObserver.observe(element);
        });
    }
}

// Call lazy loading initialization
initLazyLoading();

// Analytics and tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    // Replace with actual analytics implementation
    console.log('Track Event:', eventName, eventData);
}

// Track important user interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn--primary')) {
        trackEvent('cta_click', {
            button_text: e.target.textContent,
            page_section: e.target.closest('section')?.id || 'unknown'
        });
    }
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment and implement service worker if needed
        // navigator.serviceWorker.register('/sw.js');
    });
}