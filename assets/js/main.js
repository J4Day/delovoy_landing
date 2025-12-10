/**
 * DELOVOY Business Center Landing
 * Modern UI/UX JavaScript
 */

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initHeader();
    initNavigation();
    initPlanTabs();
    initVideoGallery();
    initContactForm();
    initScrollAnimations();
    initFAQ();
});

// ============================================================================
// LOADER
// ============================================================================

function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('locked');
        }, 1800);
    });

    // Fallback
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('locked');
    }, 3500);
}

// ============================================================================
// HEADER
// ============================================================================

function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show on scroll direction
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }

        lastScroll = currentScroll;
    });
}

// ============================================================================
// NAVIGATION
// ============================================================================

function initNavigation() {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    if (!burger || !nav) return;

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('locked');
    });

    // Close on link click
    const navLinks = nav.querySelectorAll('.header-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('locked');
        });
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const offset = 100;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

// ============================================================================
// PLAN TABS
// ============================================================================

function initPlanTabs() {
    const tabs = document.querySelectorAll('.plans-tab');
    const panels = document.querySelectorAll('.plans-panel');

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPanel = tab.dataset.tab;

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update panels
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.dataset.panel === targetPanel) {
                    panel.classList.add('active');
                }
            });
        });
    });

    // 3D/2D toggle within each panel
    panels.forEach(panel => {
        const toggleBtns = panel.querySelectorAll('.plans-toggle-btn');
        const images = panel.querySelectorAll('.plans-image');

        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;

                // Update buttons
                toggleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update images
                images.forEach(img => {
                    img.classList.remove('active');
                    if (img.dataset.view === view) {
                        img.classList.add('active');
                    }
                });
            });
        });
    });
}

// ============================================================================
// VIDEO GALLERY
// ============================================================================

function initVideoGallery() {
    const galleryCards = document.querySelectorAll('.gallery-card[data-video]');
    const modal = document.getElementById('videoModal');
    if (!modal) return;

    const video = document.getElementById('modalVideo');
    const backdrop = modal.querySelector('.modal-backdrop');
    const closeBtn = modal.querySelector('.modal-close');

    const openModal = (videoSrc) => {
        video.src = videoSrc;
        modal.classList.add('active');
        document.body.classList.add('locked');
        video.play().catch(() => {});
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.classList.remove('locked');
        video.pause();
        video.currentTime = 0;
        video.src = '';
    };

    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const videoSrc = card.dataset.video;
            if (videoSrc) openModal(videoSrc);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ============================================================================
// CONTACT FORM
// ============================================================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    if (!form) return;

    // Phone formatting for Kyrgyzstan
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            // Remove country code if entered
            if (value.startsWith('996')) value = value.substring(3);
            if (value.startsWith('0')) value = value.substring(1);

            let formatted = '';
            if (value.length > 0) formatted = '+996 ' + value.substring(0, 3);
            if (value.length > 3) formatted += ' ' + value.substring(3, 6);
            if (value.length > 6) formatted += ' ' + value.substring(6, 9);

            e.target.value = formatted;
        });

        phoneInput.addEventListener('focus', (e) => {
            if (!e.target.value) {
                e.target.value = '+996 ';
            }
        });
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '<span>Отправка...</span>';
        btn.disabled = true;

        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            interest: formData.get('interest')
        };

        try {
            const response = await fetch('https://delovoy-form.juuzoucode.workers.dev/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                if (successModal) {
                    successModal.classList.add('active');
                    document.body.classList.add('locked');
                }
                form.reset();
            } else {
                alert('Ошибка отправки. Попробуйте позже.');
            }
        } catch (error) {
            alert('Ошибка соединения. Проверьте интернет.');
        }

        btn.innerHTML = originalHTML;
        btn.disabled = false;
    });
}

// Global close modal function
window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('locked');
    }
};

// ============================================================================
// FAQ ACCORDION
// ============================================================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.section-header, .about-grid, .advantage-card, .plans-wrapper, ' +
        '.gallery-card, .pricing-card, .contact-wrapper, .footer-main'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(el);
    });

    // Hero parallax effect
    const heroBg = document.querySelector('.hero-bg-image');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
            }
        });
    }

    // Stats counter animation
    const stats = document.querySelectorAll('.hero-stat-value');
    let statsAnimated = false;

    const animateStats = () => {
        if (statsAnimated) return;

        stats.forEach(stat => {
            const text = stat.textContent.trim();
            const numMatch = text.match(/[\d\s]+/);
            if (!numMatch) return;

            const numStr = numMatch[0].replace(/\s/g, '');
            const target = parseInt(numStr);
            if (isNaN(target)) return;

            const suffix = text.replace(numMatch[0], '');
            const duration = 2000;
            const start = performance.now();
            const hasSpace = text.includes(' ');

            const update = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeOut * target);

                if (hasSpace && current >= 1000) {
                    stat.textContent = current.toLocaleString('ru-RU').replace(',', ' ') + suffix;
                } else {
                    stat.textContent = current + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    stat.textContent = text;
                }
            };

            requestAnimationFrame(update);
        });

        statsAnimated = true;
    };

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateStats, 300);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(heroStats);
    }
}

// ============================================================================
// CONSOLE SIGNATURE
// ============================================================================

console.log(
    '%c ДЕЛОВОЙ %c Business Center ',
    'background: #c9a962; color: #0a0b0d; padding: 8px 16px; font-size: 14px; font-weight: bold; border-radius: 4px 0 0 4px;',
    'background: #08090c; color: #f5f5f7; padding: 8px 16px; font-size: 14px; border-radius: 0 4px 4px 0;'
);
