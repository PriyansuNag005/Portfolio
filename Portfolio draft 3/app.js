// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing Portfolio...');
    
    // Initialize theme management
    initThemeToggle();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize resume download
    initResumeDownload();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize animations
    initAnimations();
    
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1500);
    
    console.log('Portfolio initialization complete! 🚀');
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) {
        console.log('Theme toggle button not found');
        return;
    }
    
    // Get current theme from localStorage or default to dark
    let currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply initial theme
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Add click event listener
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Theme toggle clicked, current theme:', currentTheme);
        
        // Toggle theme
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply new theme
        document.body.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);
        
        // Save to localStorage
        localStorage.setItem('theme', currentTheme);
        
        console.log('Theme changed to:', currentTheme);
        showNotification(`Switched to ${currentTheme} theme`, 'success');
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    console.log('Theme toggle initialized with theme:', currentTheme);
}

// Navigation Functionality
function initNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link, a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const href = this.getAttribute('href');
            console.log('Navigation link clicked:', href);
            
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    console.log('Scrolling to section:', targetId);
                    
                    const navHeight = 80;
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navMenu = document.getElementById('navMenu');
                    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                    if (navMenu && mobileMenuToggle) {
                        navMenu.classList.remove('active');
                        mobileMenuToggle.classList.remove('active');
                    }
                    
                    // Update active nav link immediately
                    document.querySelectorAll('.nav-link').forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    showNotification(`Navigated to ${targetId} section`, 'info');
                } else {
                    console.warn('Target section not found:', targetId);
                }
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
    
    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    // Remove active class from all nav links
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to current section's nav link
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, {
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    console.log('Navigation initialized with', navLinks.length, 'links');
}

// Resume Download Functionality
function initResumeDownload() {
    const downloadBtn = document.getElementById('downloadResume');
    if (!downloadBtn) {
        console.log('Download resume button not found');
        return;
    }
    
    downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Download resume button clicked');
        
        // Show loading state
        const originalText = this.textContent;
        this.textContent = 'Generating PDF...';
        this.disabled = true;
        
        // Generate resume HTML
        const resumeHTML = generateResumeHTML();
        
        // Create new window for printing
        setTimeout(() => {
            try {
                const printWindow = window.open('', '_blank', 'width=900,height=700');
                if (printWindow) {
                    printWindow.document.write(resumeHTML);
                    printWindow.document.close();
                    
                    // Wait for content to load then trigger print
                    printWindow.onload = function() {
                        setTimeout(() => {
                            printWindow.focus();
                            printWindow.print();
                        }, 500);
                    };
                    
                    showNotification('Resume opened in new window for printing/download!', 'success');
                } else {
                    throw new Error('Could not open print window - popup blocked?');
                }
            } catch (error) {
                console.error('Error generating resume:', error);
                showNotification('Could not open resume window. Please allow popups and try again.', 'error');
            }
            
            // Reset button state
            this.textContent = originalText;
            this.disabled = false;
        }, 1000);
    });
    
    console.log('Resume download initialized');
}

// Contact Form Functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.log('Contact form not found');
        return;
    }
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Contact form submitted');
        
        const formData = new FormData(this);
        const data = {
            name: formData.get('name')?.trim(),
            email: formData.get('email')?.trim(),
            subject: formData.get('subject')?.trim(),
            message: formData.get('message')?.trim()
        };
        
        console.log('Form data:', data);
        
        // Basic validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (data.name.length < 2) {
            showNotification('Name must be at least 2 characters long', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        if (data.subject.length < 3) {
            showNotification('Subject must be at least 3 characters long', 'error');
            return;
        }
        
        if (data.message.length < 10) {
            showNotification('Message must be at least 10 characters long', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate processing
        setTimeout(() => {
            try {
                // Create mailto link
                const subject = encodeURIComponent(data.subject);
                const body = encodeURIComponent(`Hi Priyansu,

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}

---
Sent from your portfolio website contact form.`);
                const mailtoLink = `mailto:priyansunag005@gmail.com?subject=${subject}&body=${body}`;
                
                // Open email client
                window.location.href = mailtoLink;
                
                showNotification('Email client opened! Your message is ready to send.', 'success');
                
                // Reset form after successful submission
                this.reset();
                
                console.log('Form submitted successfully');
            } catch (error) {
                console.error('Error creating mailto link:', error);
                showNotification('Error preparing email. Please try again.', 'error');
            }
            
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
    
    // Add real-time validation feedback
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error state on input
            this.style.borderColor = '';
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }
        
        if (!isValid) {
            field.style.borderColor = '#ef4444';
        } else {
            field.style.borderColor = '#22c55e';
        }
    }
    
    console.log('Contact form initialized with validation');
}

// Animation Functionality
function initAnimations() {
    // Animate elements on scroll
    const animatedElements = document.querySelectorAll(
        '.education-card, .cert-card, .project-card, .skill-category, .fact-card'
    );
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
    
    // Animate progress bars
    const progressBars = document.querySelectorAll('.progress-fill, .skill-progress');
    if (progressBars.length > 0) {
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.style.width;
                    entry.target.style.width = '0%';
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 200);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => progressObserver.observe(bar));
    }
    
    console.log('Animations initialized');
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Remove existing notifications first
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 350px;
        word-wrap: break-word;
        font-size: 14px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        ${type === 'success' ? 'background: linear-gradient(135deg, #22c55e, #16a34a);' : 
          type === 'error' ? 'background: linear-gradient(135deg, #ef4444, #dc2626);' :
          'background: linear-gradient(135deg, #8b5cf6, #7c3aed);'}
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Slide out and remove
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
}

function generateResumeHTML() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Priyansu Nag - Resume</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', 'Segoe UI', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background: white; 
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .header { 
            text-align: center; 
            margin-bottom: 40px; 
            border-bottom: 3px solid #8b5cf6; 
            padding-bottom: 20px; 
        }
        .name { 
            font-size: 2.5rem; 
            font-weight: bold; 
            color: #6b21a8; 
            margin-bottom: 10px; 
        }
        .title { 
            font-size: 1.2rem; 
            color: #666; 
            margin-bottom: 10px; 
            font-weight: 500;
        }
        .contact-info { 
            font-size: 0.95rem; 
            color: #666; 
            line-height: 1.4;
        }
        .section { 
            margin-bottom: 30px; 
            page-break-inside: avoid;
        }
        .section-title { 
            font-size: 1.4rem; 
            font-weight: bold; 
            color: #6b21a8; 
            border-bottom: 2px solid #8b5cf6; 
            padding-bottom: 5px; 
            margin-bottom: 20px; 
        }
        .item { 
            margin-bottom: 20px; 
        }
        .item-title { 
            font-weight: bold; 
            font-size: 1.1rem; 
            color: #333; 
            margin-bottom: 2px;
        }
        .item-subtitle { 
            color: #8b5cf6; 
            font-weight: 600; 
            margin-bottom: 2px;
        }
        .item-date { 
            color: #666; 
            font-size: 0.9rem; 
            margin-bottom: 8px;
        }
        .skills-grid { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 20px; 
        }
        .skill-category { 
            background: #f8f9ff; 
            padding: 15px; 
            border-radius: 8px; 
            border-left: 4px solid #8b5cf6; 
        }
        .skill-category h4 { 
            color: #6b21a8; 
            margin-bottom: 10px; 
            font-size: 1rem;
        }
        .skill-list { 
            list-style: none; 
            padding: 0;
        }
        .skill-list li { 
            padding: 2px 0; 
            color: #555; 
            font-size: 0.9rem;
        }
        .achievements { 
            background: #f0f9ff; 
            padding: 20px; 
            border-radius: 8px; 
            border-left: 4px solid #8b5cf6; 
        }
        .achievements ul { 
            padding-left: 20px; 
        }
        .achievements li { 
            margin-bottom: 5px; 
            color: #555; 
        }
        .summary { 
            background: #fefcff; 
            padding: 20px; 
            border-radius: 8px; 
            border-left: 4px solid #8b5cf6; 
            font-size: 1rem;
            line-height: 1.7;
        }
        ul { 
            margin-top: 10px; 
            padding-left: 20px; 
        }
        ul li { 
            margin-bottom: 3px; 
        }
        @media print {
            body { 
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                padding: 20px;
            }
            .section { 
                page-break-inside: avoid; 
            }
            .skills-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        @media screen and (max-width: 768px) {
            .skills-grid {
                grid-template-columns: 1fr;
            }
            .name {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="resume-container">
        <div class="header">
            <div class="name">Priyansu Nag</div>
            <div class="title">B.Com (Hons.) Student | Finance & Accounting Enthusiast | CS Aspirant</div>
            <div class="contact-info">
                📍 Hyderabad, Telangana, India<br>
                ✉️ priyansunag005@gmail.com<br>
                💼 linkedin.com/in/priyansunag
            </div>
        </div>

        <div class="section">
            <div class="section-title">Professional Summary</div>
            <div class="summary">
                Passionate and driven B.Com (Hons.) student at Loyola Academy, actively exploring Human Resources and Finance while pursuing Company Secretary (CS) qualification. Deep interest in corporate governance, compliance, and organizational strategy with focus on financial planning and people management for building resilient, ethical, and successful organizations.
            </div>
        </div>

        <div class="section">
            <div class="section-title">Education</div>
            <div class="item">
                <div class="item-title">Bachelor of Commerce - BCom (Hons.)</div>
                <div class="item-subtitle">Loyola Academy, Hyderabad</div>
                <div class="item-date">Jun 2023 – Jun 2026 | Grade: 9.4 CGPA</div>
                <div>Key Skills: Report Writing, Tally ERP, Accounting, Financial Analysis</div>
            </div>
            <div class="item">
                <div class="item-title">Company Secretary - CS Executive</div>
                <div class="item-subtitle">The Institute of Company Secretaries of India</div>
                <div class="item-date">May 2023 – Dec 2026 | Status: In Progress</div>
                <div>Key Skills: GST, Corporate Governance, Company Law</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Professional Certifications</div>
            <div class="item">
                <div class="item-title">Business Project Management</div>
                <div class="item-subtitle">Udemy (MTF Institute) - July 2025</div>
                <div>Project Planning • Strategic Planning • Team Leadership • Business Efficiency</div>
            </div>
            <div class="item">
                <div class="item-title">ChatGPT and Generative AI</div>
                <div class="item-subtitle">Udemy - June 2025</div>
                <div>Prompt Engineering • Generative AI • Digital Innovation • Technical Fluency</div>
            </div>
            <div class="item">
                <div class="item-title">Investment Management Certificate</div>
                <div class="item-subtitle">SWAYAM MHRD - 2025</div>
                <div>Investment Management • Portfolio Management • Risk Assessment • Financial Planning</div>
            </div>
            <div class="item">
                <div class="item-title">Brand Management Certificate</div>
                <div class="item-subtitle">Professional Development Institute - 2025</div>
                <div>Brand Strategy • Brand Positioning • Consumer Behavior • Marketing Communications • Strategic Thinking</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Project Experience</div>
            <div class="item">
                <div class="item-title">NSW Government Marketing & Communications</div>
                <div class="item-subtitle">Forage - Job Simulation (Completed)</div>
                <div class="item-date">Government Communications Specialist Simulation</div>
                <ul>
                    <li>Developed comprehensive communication plan for advertising campaign</li>
                    <li>Wrote professional newsletter for government agency staff</li>
                    <li>Gained practical experience in government communications protocols</li>
                    <li>Demonstrated strategic thinking and attention to detail in public sector context</li>
                </ul>
                <div style="margin-top: 8px;"><strong>Skills:</strong> Communication Strategy • Content Writing • Project Coordination • Government Relations</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Core Competencies</div>
            <div class="skills-grid">
                <div class="skill-category">
                    <h4>HR & Governance</h4>
                    <ul class="skill-list">
                        <li>Corporate Governance (85%)</li>
                        <li>Recruitment & Talent Management (75%)</li>
                        <li>HR Analytics & Employee Engagement (70%)</li>
                        <li>GST & Tax Compliance (80%)</li>
                        <li>Company Law (75%)</li>
                    </ul>
                </div>
                <div class="skill-category">
                    <h4>Finance & Accounting</h4>
                    <ul class="skill-list">
                        <li>Financial Accounting (90%)</li>
                        <li>Income Tax (80%)</li>
                        <li>Investment Management (75%)</li>
                        <li>Tally ERP (85%)</li>
                        <li>Microsoft Excel (90%)</li>
                    </ul>
                </div>
                <div class="skill-category">
                    <h4>Marketing & Business</h4>
                    <ul class="skill-list">
                        <li>Brand Management (80%)</li>
                        <li>Strategic Planning (75%)</li>
                        <li>Consumer Behavior Analysis (70%)</li>
                        <li>Marketing Communications (75%)</li>
                        <li>Business Strategy (80%)</li>
                    </ul>
                </div>
                <div class="skill-category">
                    <h4>Tools & Professional</h4>
                    <ul class="skill-list">
                        <li>Generative AI & Prompt Engineering (85%)</li>
                        <li>Microsoft Office Suite (90%)</li>
                        <li>Communication & Presentation (85%)</li>
                        <li>Report Writing & Research (90%)</li>
                        <li>Project Planning (80%)</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Key Achievements</div>
            <div class="achievements">
                <ul>
                    <li>Maintained exceptional 9.4 CGPA in B.Com (Hons.) program</li>
                    <li>Successfully completed structured marketing & communications job simulation</li>
                    <li>Earned multiple industry-relevant certifications including Brand Management</li>
                    <li>Currently pursuing prestigious CS Executive qualification</li>
                    <li>Demonstrated proficiency in AI tools and modern workplace technologies</li>
                    <li>Developed expertise across Finance, HR, and Marketing domains</li>
                </ul>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Career Interests & Availability</div>
            <div class="item">
                <div class="item-title">Seeking Opportunities In:</div>
                <div style="margin-top: 8px;">Management Roles • Human Resources Specialist • Tax Associate/Intern • Product Management Specialist • Brand Management roles</div>
            </div>
            <div class="item">
                <div class="item-title">Professional Traits:</div>
                <div>Curious • Reliable • Quick Learner • Collaborative • Detail-oriented • Strategic Thinker</div>
            </div>
            <div class="item">
                <div class="item-title">Availability:</div>
                <div>Open to internships, live projects, and mentorship opportunities in Finance, HR, and Brand Management</div>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// Add some basic error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// Log when script loads
console.log('Portfolio JavaScript loaded successfully!');