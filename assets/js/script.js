/*
 * Filename: script.js
 * Description: High-performance interactive script for Surya Plaza Hotel.
 * Version: 2.1
 * Features: Mobile Nav, Theme Toggle, Glassmorphism Header, Staggered Scroll Animations.
*/

document.addEventListener('DOMContentLoaded', () => {

    const init = () => {
        initMobileNav();
        initThemeToggle();
        initGlassmorphismHeader();
        initScrollAnimations();
        initGallery(); 
        initAttractionsNav();
        initPolicyNav();
        initStickySidebar();
    };

    const initMobileNav = () => {
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                document.body.classList.toggle('mobile-nav-open');
            });
        }
    };

    const initThemeToggle = () => {
        const toggle = document.getElementById('theme-toggle');
        const html = document.documentElement;
        
        // Check for saved theme in localStorage or user's OS preference
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
                localStorage.setItem('theme', newTheme); // Save preference
            });
        }
    };

    const initGlassmorphismHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;

        // Use a throttled scroll listener for performance
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

    const initScrollAnimations = () => {
        // Observer for simple fade-in elements
        const fadeInObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in').forEach(el => fadeInObserver.observe(el));

        // Observer for staggered grid animations
        const staggerObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const elements = entry.target.children;
                    for (let i = 0; i < elements.length; i++) {
                        elements[i].style.transitionDelay = `${i * 100}ms`;
                        elements[i].style.opacity = '1';
                        elements[i].style.transform = 'translateY(0)';
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.grid-stagger').forEach(grid => staggerObserver.observe(grid));
    };

    init();
});

const initGallery = () => {
    // Only run this code if we are on the gallery page
    const galleryGrid = document.querySelector('.gallery-grid, .venue-gallery-grid');
    if (!galleryGrid) return;

    // --- Gallery Filtering Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --- Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    let allVisibleItems = [];
    let currentIndex = 0;

    const updateVisibleItems = () => {
        allVisibleItems = Array.from(document.querySelectorAll('.gallery-item')).filter(
            item => item.style.display !== 'none'
        );
    };

    const openLightbox = (clickedIndex) => {
        updateVisibleItems();
        currentIndex = clickedIndex;
        const item = allVisibleItems[currentIndex];
        lightboxImg.src = item.href;
        lightboxCaption.textContent = item.dataset.caption || '';
        lightbox.classList.add('active');
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
    };

    const showPrev = () => {
        currentIndex = (currentIndex - 1 + allVisibleItems.length) % allVisibleItems.length;
        openLightbox(currentIndex);
    };

    const showNext = () => {
        currentIndex = (currentIndex + 1) % allVisibleItems.length;
        openLightbox(currentIndex);
    };
    
    galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            updateVisibleItems();
            const clickedIndex = allVisibleItems.indexOf(item);
            openLightbox(clickedIndex);
        });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrev);
    lightbox.querySelector('.lightbox-next').addEventListener('click', showNext);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        }
    });
};

const initAttractionsNav = () => {
    const attractionsNav = document.querySelector('.attractions-nav');
    if (!attractionsNav) return;

    const navLinks = attractionsNav.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.attraction-category');
    const header = document.querySelector('.site-header');

    const observerOptions = {
        root: null,
        // Adjust rootMargin to account for both sticky headers
        rootMargin: `-${header.offsetHeight + attractionsNav.offsetHeight}px 0px -40% 0px`,
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
};

const initPolicyNav = () => {
    const policyNav = document.querySelector('.policy-nav');
    if (!policyNav) return;

    const navLinks = policyNav.querySelectorAll('.policy-nav-link');
    const sections = document.querySelectorAll('.policy-section');
    const header = document.querySelector('.site-header');

    const observerOptions = {
        root: null,
        rootMargin: `-${header.offsetHeight + 40}px 0px -60% 0px`,
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
};

const initStickySidebar = () => {
    const sidebar = document.querySelector('.policy-sidebar');
    if (!sidebar) return;

    // This function will handle the sticky logic.
    // For simplicity with the current design, the CSS `position: sticky` is sufficient
    // and a JS implementation is not required unless more complex behavior is needed.
    // The CSS rule `position: sticky; top: ...` handles this automatically.
    // No further JS is needed for this feature.
};