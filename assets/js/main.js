/*
 * Filename: main.js
 * Description: Final, Consolidated JavaScript for Surya Plaza Hotel (vFinal)
 *
 * Core Functionalities:
 * 1. Header Manager: Controls the sticky/scrolled state of the main header.
 * 2. Mobile Navigation: Toggles the mobile menu.
 * 3. Theme Manager: Handles light/dark/system theme preferences.
 * 4. Scroll Observer: Triggers animations on elements as they enter the viewport.
 * 5. Room Gallery Handler: Manages the interactive thumbnail galleries on the rooms page.
 * 6. Contact Form Handler: Manages the interactive submission process for the contact form.
 * 7. Policy Nav Observer: Manages the active state for the sticky navigation on policy pages.
 * 8. Gallery Page Handler: Manages filtering and lightbox functionality for the gallery page.
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Initializes all interactive components of the site.
     */
    const init = () => {
        initHeaderManager();
        initMobileNavigation();
        initThemeManager();
        initScrollObserver();
        initRoomGallery();
        initContactForm();
        initPolicyNavObserver();
        initGalleryPage(); // <-- Added for Gallery Page
    };

    /**
     * 1. HEADER MANAGER
     */
    const initHeaderManager = () => {
        const header = document.querySelector('.main-header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    };

    /**
     * 2. MOBILE NAVIGATION
     */
    const initMobileNavigation = () => {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mainNav = document.querySelector('.main-nav');

        if (hamburgerBtn && mainNav) {
            hamburgerBtn.addEventListener('click', () => {
                hamburgerBtn.classList.toggle('active');
                mainNav.classList.toggle('active');
            });
        }
    };

    /**
     * 3. THEME MANAGER
     */
    const initThemeManager = () => {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        };

        const getInitialTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) return savedTheme;
            return systemPrefersDark.matches ? 'dark' : 'light';
        };

        applyTheme(getInitialTheme());

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });

        systemPrefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    };

    /**
     * 4. SCROLL OBSERVER
     */
    const initScrollObserver = () => {
        const animatedElements = document.querySelectorAll(
            '.section-title, .story-content, .room-card, .dining-item, .events-image-placeholder, .attraction-card, .media-content-card, .policy-section, .feature-card, .pillar-card, .leadership-card, .sidebar-card, .conduct-card, .transport-card, .contact-info, .contact-form-wrapper, .team-feature-card, .culture-card, .room-detail-card, .event-description, .booking-form-card, .venue-gallery-item, .dining-option-card, .dish-item, .recovery-card, .video-container, .error-container'
        );
        
        if (animatedElements.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        let delay = 0;
        animatedElements.forEach(element => {
            if (element.classList.contains('room-card') || element.classList.contains('feature-card') || element.classList.contains('pillar-card')) {
                element.style.transitionDelay = `${delay}ms`;
                delay += 100;
            }
            observer.observe(element);
        });
    };

    /**
     * 5. ROOM GALLERY HANDLER
     */
    const initRoomGallery = () => {
        const thumbnails = document.querySelectorAll('.thumbnail-item');
        if (thumbnails.length === 0) return;

        thumbnails.forEach(thumb => {
            thumb.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const thumbImg = thumb.querySelector('img');
                const targetId = thumbImg.dataset.target;
                const mainImageEl = document.getElementById(targetId);
                
                if (!mainImageEl || thumb.classList.contains('active')) return;

                const newWebp = thumbImg.dataset.fullWebp;
                const newJpg = thumbImg.dataset.fullJpg || (newWebp ? newWebp.replace('.webp', '.jpg') : '');

                mainImageEl.style.opacity = '0';
                
                setTimeout(() => {
                    const picture = mainImageEl.parentElement;
                    const sourceWebp = picture.querySelector('source[type="image/webp"]');
                    const sourceJpg = picture.querySelector('source[type="image/jpeg"]');

                    if(sourceWebp) sourceWebp.srcset = newWebp;
                    if(sourceJpg) sourceJpg.srcset = newJpg;
                    mainImageEl.src = newJpg;

                    mainImageEl.style.opacity = '1';
                }, 200);

                const parentGallery = thumb.closest('.gallery-thumbnails');
                if (parentGallery) {
                    const currentActive = parentGallery.querySelector('.thumbnail-item.active');
                    if (currentActive) currentActive.classList.remove('active');
                }
                thumb.classList.add('active');
            });
        });
    };
    
    /**
     * 6. CONTACT FORM HANDLER
     */
    const initContactForm = () => {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                btnText.textContent = 'Submitted Successfully!';
                form.reset();
                setTimeout(() => {
                    btnText.textContent = 'Submit Inquiry';
                }, 3000);
            }, 2000);
        });
    };

    /**
     * 7. POLICY NAV OBSERVER
     */
    const initPolicyNavObserver = () => {
        const policyNavLinks = document.querySelectorAll('.policy-nav-link');
        const policySections = document.querySelectorAll('.policy-section');

        if (policyNavLinks.length === 0 || policySections.length === 0) return;

        const observerOptions = {
            root: null, rootMargin: `-120px 0px -60% 0px`, threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    policyNavLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, observerOptions);
        policySections.forEach(section => { observer.observe(section); });
    };

    /**
     * 8. GALLERY PAGE HANDLER (NEW)
     */
    const initGalleryPage = () => {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.getElementById('lightbox');

        if (filterButtons.length === 0 || !lightbox) return;

        // Filtering Logic
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.dataset.filter;
                galleryItems.forEach(item => {
                    item.style.display = 'none';
                    if (filter === 'all' || item.dataset.category === filter) {
                        setTimeout(() => { item.style.display = 'block'; }, 1);
                    }
                });
            });
        });

        // Lightbox Logic
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        let currentIndex = 0;
        const images = Array.from(galleryItems).map(link => ({ src: link.href, caption: link.dataset.caption }));

        const openLightbox = (index) => {
            currentIndex = index;
            lightboxImg.src = images[currentIndex].src;
            lightboxCaption.textContent = images[currentIndex].caption;
            lightbox.classList.add('active');
        };
        const closeLightbox = () => lightbox.classList.remove('active');
        const showPrev = () => { currentIndex = (currentIndex - 1 + images.length) % images.length; openLightbox(currentIndex); };
        const showNext = () => { currentIndex = (currentIndex + 1) % images.length; openLightbox(currentIndex); };

        galleryItems.forEach((link, index) => {
            link.addEventListener('click', (e) => { e.preventDefault(); openLightbox(index); });
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrev);
        lightbox.querySelector('.lightbox-next').addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    };

    // Run the initialization
    init();

});