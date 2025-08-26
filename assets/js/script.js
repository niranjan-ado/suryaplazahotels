/*
 * Filename: script.js
 * Description: High-performance interactive script for Surya Plaza Hotel.
 * Version: 3.0 (Production Ready)
 * Features: Mobile Nav, Theme Toggle, Glassmorphism Header, Animations, Gallery, Sticky Navs.
*/

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Toggles the mobile navigation menu.
     */
    const initMobileNav = () => {
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                document.body.classList.toggle('mobile-nav-open');
            });
        }
    };

    /**
     * Manages the light/dark theme toggle and respects user preferences.
     */
    const initThemeToggle = () => {
        const toggle = document.getElementById('theme-toggle');
        const html = document.documentElement;
        
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.setAttribute('data-theme', 'light');
        }

        if (toggle) {
            toggle.addEventListener('click', () => {
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    };

    /**
     * Applies a 'scrolled' class to the header for the glassmorphism effect.
     */
    const initGlassmorphismHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;

        let isTicking = false;
        const toggleHeaderClass = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            isTicking = false;
        };

        window.addEventListener('scroll', () => {
            if (!isTicking) {
                window.requestAnimationFrame(toggleHeaderClass);
                isTicking = true;
            }
        });
    };

    /**
     * Initializes performant scroll-triggered fade-in and stagger animations.
     */
    const initScrollAnimations = () => {
        const fadeInObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in').forEach(el => fadeInObserver.observe(el));

        const staggerObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const elements = entry.target.children;
                    for (let i = 0; i < elements.length; i++) {
                        elements[i].style.transitionDelay = `${i * 100}ms`;
                        elements[i].classList.add('is-visible');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.grid-stagger').forEach(grid => staggerObserver.observe(grid));
    };
    
    /**
     * Powers the interactive gallery with filtering and a lightbox.
     */
    const initGallery = () => {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;

        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.getElementById('lightbox');
        
        if (!lightbox) return;

        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        let allVisibleItems = [];
        let currentIndex = 0;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.dataset.filter;
                galleryItems.forEach(item => {
                    item.style.display = (filter === 'all' || item.dataset.category === filter) ? 'block' : 'none';
                });
            });
        });

        const updateVisibleItems = () => {
            allVisibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
        };

        const openLightbox = (clickedIndex) => {
            currentIndex = clickedIndex;
            const item = allVisibleItems[currentIndex];
            lightboxImg.src = item.href;
            lightboxCaption.textContent = item.dataset.caption || '';
            lightbox.classList.add('active');
        };

        const closeLightbox = () => lightbox.classList.remove('active');
        const showPrev = () => openLightbox((currentIndex - 1 + allVisibleItems.length) % allVisibleItems.length);
        const showNext = () => openLightbox((currentIndex + 1) % allVisibleItems.length);
        
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                updateVisibleItems();
                openLightbox(allVisibleItems.indexOf(item));
            });
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrev);
        lightbox.querySelector('.lightbox-next').addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => e.target === lightbox && closeLightbox());
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    };

    /**
     * Manages the active state for the sticky attractions navigation bar.
     */
    const initAttractionsNav = () => {
        const attractionsNav = document.querySelector('.attractions-nav');
        if (!attractionsNav) return;

        const navLinks = attractionsNav.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.attraction-category');
        const header = document.querySelector('.site-header');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { rootMargin: `-${header.offsetHeight + attractionsNav.offsetHeight}px 0px -40% 0px` });

        sections.forEach(section => observer.observe(section));
    };

    /**
     * Manages the active state for the sticky policy page navigation.
     */
    const initPolicyNav = () => {
        const policyNav = document.querySelector('.policy-nav');
        if (!policyNav) return;

        const navLinks = policyNav.querySelectorAll('.policy-nav-link');
        const sections = document.querySelectorAll('.policy-section');
        const header = document.querySelector('.site-header');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { rootMargin: `-${header.offsetHeight + 40}px 0px -60% 0px` });

        sections.forEach(section => observer.observe(section));
    };

    /**
     * Main initialization function to run all site scripts.
     */
    const init = () => {
        initMobileNav();
        initThemeToggle();
        initGlassmorphismHeader();
        initScrollAnimations();
        initGallery();
        initAttractionsNav();
        initPolicyNav();
    };

    // Run all initialization functions
    init();
});