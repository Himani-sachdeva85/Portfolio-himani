/* ==========================================================================
   Himani Sachdeva Portfolio JavaScript Interactivity
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Preloader Handler ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            document.body.style.overflowY = 'auto';
        }, 800); // Small delay to let animations sync
    });

    // Fallback if load event takes too long
    setTimeout(() => {
        if (!preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
            document.body.style.overflowY = 'auto';
        }
    }, 2500);


    // --- 2. Custom Cursor Tracking ---
    const cursorDot = document.getElementById('customCursorDot');
    const cursorOutline = document.getElementById('customCursorOutline');

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    let cursorVisible = false;

    document.addEventListener('mousemove', (e) => {
        if (!cursorVisible) {
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
            cursorVisible = true;
        }

        mouseX = e.clientX;
        mouseY = e.clientY;

        // Position the center dot immediately
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    // Custom cursor trail animation loop
    function animateCursor() {
        // Linear interpolation for smooth lag trail
        const ease = 0.15;
        outlineX += (mouseX - outlineX) * ease;
        outlineY += (mouseY - outlineY) * ease;

        cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover state effects
    const hoverElements = 'a, button, .project-card, .lightbox-trigger, .filter-btn, .theme-toggle-btn';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverElements)) {
            document.body.classList.add('custom-cursor-hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverElements)) {
            document.body.classList.remove('custom-cursor-hover');
        }
    });

    // Hide cursor when leaving screen
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
        cursorVisible = false;
    });


    // --- 3. Light / Dark Theme Controller ---
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let currentTheme = 'dark'; // Dark theme first

    if (savedTheme) {
        currentTheme = savedTheme;
    } else if (!systemPrefersDark) {
        currentTheme = 'light';
    }

    setTheme(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
    });

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
            themeToggleBtn.setAttribute('aria-label', 'Toggle Light Mode');
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            themeToggleBtn.setAttribute('aria-label', 'Toggle Dark Mode');
        }
    }


    // --- 4. Navigation & Scroll Tracking ---
    const navbar = document.getElementById('navbar');
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // 4a. Scroll Progress Indicator
        const scrollPct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgressBar.style.width = `${scrollPct}%`;

        // 4b. Sticky Navbar Blur Effect
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 4c. Scroll Spy Active Links
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // Offset navbar height
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Mobile Hamburger Toggle
    const mobileToggleBtn = document.getElementById('mobileToggleBtn');
    const navMenu = document.getElementById('navMenu');

    mobileToggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        mobileToggleBtn.innerHTML = isActive
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars-staggered"></i>';
        mobileToggleBtn.setAttribute('aria-label', isActive ? 'Close Navigation Menu' : 'Open Navigation Menu');
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggleBtn.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
            mobileToggleBtn.setAttribute('aria-label', 'Open Navigation Menu');
        });
    });


    // --- 5. Typing Animation (Hero Subtitle) ---
    const words = ["Frontend Developer", "UI/UX Designer", "Graphic Designer"];
    const targetSpan = document.querySelector('.typed-text-target');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            targetSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Speed up when backspacing
        } else {
            targetSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Standard typing speed
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 1500; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Small delay before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (targetSpan) {
        setTimeout(typeEffect, 1000);
    }


    // --- 6. Project Category Filtering & Lightbox Array Sync ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // Store current visible images for lightbox cycling
    let activeProjects = Array.from(projectCards);

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Highlight active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            activeProjects = [];

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    activeProjects.push(card);

                    // Fade in transition
                    card.style.display = 'flex';
                    card.classList.remove('fade-out');
                    card.classList.add('fade-in');
                } else {
                    // Fade out transition
                    card.classList.remove('fade-in');
                    card.classList.add('fade-out');
                    setTimeout(() => {
                        if (card.classList.contains('fade-out')) {
                            card.style.display = 'none';
                        }
                    }, 400);
                }
            });
        });
    });


    // --- 7. Interactive Project Lightbox Slider ---
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxCurrentIndex = document.getElementById('lightboxCurrentIndex');
    const lightboxTotalCount = document.getElementById('lightboxTotalCount');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentProjectIndex = 0;

    // Attach click events dynamically on lightbox trigger buttons
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.lightbox-trigger');
        if (trigger) {
            const cardElement = trigger.closest('.project-card');
            currentProjectIndex = activeProjects.indexOf(cardElement);
            openLightbox(currentProjectIndex);
        }
    });

    function openLightbox(index) {
        if (index < 0 || index >= activeProjects.length) return;

        currentProjectIndex = index;
        const currentCard = activeProjects[currentProjectIndex];

        const img = currentCard.querySelector('.project-img');
        const title = currentCard.querySelector('.project-title').textContent;
        const desc = currentCard.querySelector('.project-description').textContent;

        // Transition fade of lightbox content
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.95)';

        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = desc;

            lightboxCurrentIndex.textContent = currentProjectIndex + 1;
            lightboxTotalCount.textContent = activeProjects.length;

            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        }, 150);

        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Unlock scroll
    }

    function showNextProject() {
        const nextIndex = (currentProjectIndex + 1) % activeProjects.length;
        openLightbox(nextIndex);
    }

    function showPrevProject() {
        const prevIndex = (currentProjectIndex - 1 + activeProjects.length) % activeProjects.length;
        openLightbox(prevIndex);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextProject);
    lightboxPrev.addEventListener('click', showPrevProject);

    // Close lightbox on clicking dark background backdrop
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Keyboard support: escape, arrows
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextProject();
        } else if (e.key === 'ArrowLeft') {
            showPrevProject();
        }
    });


    // --- 8. Intersection Observers for Scroll Reveals & Counters ---

    // 8a. Global Scroll Reveal Fade In
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 8b. Statistics Counters Animation
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !countersAnimated) {
            animateCounters();
            countersAnimated = true;
        }
    }, { threshold: 0.25 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 1500; // 1.5 seconds animation
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;

            const timer = setInterval(() => {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = current;
                }
            }, stepTime);
        });
    }

    // 8c. Skills Bar and Circle Animation triggers
    const skillsSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const circularIndicators = document.querySelectorAll('.circle-progress');
    let skillsAnimated = false;

    const skillsObserver = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !skillsAnimated) {
            animateSkills();
            skillsAnimated = true;
        }
    }, { threshold: 0.2 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    function animateSkills() {
        // Animate linear progress bars
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-progress');
            bar.style.width = width;
        });

        // Animate circular skill rings
        circularIndicators.forEach(circle => {
            const targetProgress = parseInt(circle.getAttribute('data-progress'), 10);
            circle.style.setProperty('--percent', targetProgress);
        });
    }


    // --- 9. Form Validation & Submission ---

    emailjs.init({
        publicKey: "ghHPRR3VeKGx5hS9j",
    });

    if (isFormValid) {

        formSubmitBtn.disabled = true;
        formSubmitBtn.innerHTML =
            '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

        emailjs.sendForm(
            "service_n0bqjzm",
            "template_8s32thk",
            "#contactForm"
        )
            .then(function () {

                formStatusMsg.className = "form-status-msg success";
                formStatusMsg.style.display = "block";
                formStatusMsg.textContent =
                    "Thank you! Your message has been sent successfully.";

                contactForm.reset();

                document.querySelectorAll(".form-group").forEach(group => {
                    group.classList.remove("success");
                });

            })
            .catch(function (error) {

                console.log(error);

                formStatusMsg.className = "form-status-msg error";
                formStatusMsg.style.display = "block";
                formStatusMsg.textContent =
                    "Failed to send message. Please try again.";

            })
            .finally(function () {

                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML =
                    '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';

            });

    }
    // Helper validator function
    function validateField(fieldId, regex) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        const isValid = regex.test(field.value.trim());

        if (isValid) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
            return true;
        } else {
            formGroup.classList.remove('success');
            formGroup.classList.add('error');
            return false;
        }
    }

    // Live validation input observers
    const inputs = ['fullName', 'emailAddress', 'subject', 'message'];
    inputs.forEach(id => {
        const inputElement = document.getElementById(id);
        inputElement.addEventListener('input', () => {
            if (id === 'fullName') validateField(id, /^[a-zA-Z\s]{3,30}$/);
            else if (id === 'emailAddress') validateField(id, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
            else if (id === 'subject') validateField(id, /.{3,100}/);
            else if (id === 'message') validateField(id, /.{5,1000}/);
        });
    });


    // --- 10. Scroll To Top Toggle ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            scrollToTopBtn.classList.add('active');
        } else {
            scrollToTopBtn.classList.remove('active');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});
