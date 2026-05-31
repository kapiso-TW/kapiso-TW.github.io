/**
 * 臺灣生態保育專題 - Phase 3 互動控制與動畫腳本
 * Taiwan Wildlife Conservation - Phase 3 Controller Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // DOM Elements
    const bodyElement = document.body;
    const dashboard = document.getElementById('theme-hub-dashboard');
    const contentContainer = document.getElementById('content-container');
    const hubCards = document.querySelectorAll('.hub-card');
    const btnReturnHub = document.getElementById('btn-return-hub-floating');
    const appHeader = document.querySelector('.app-header');
    const sections = document.querySelectorAll('.content-section');
    
    const btnToggleIndex = document.getElementById('btn-toggle-index');
    const indexDrawer = document.getElementById('index-drawer');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    // 2. Hub Dashboard Selection Handler
    hubCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetTheme = card.getAttribute('data-target');
            enterThemeSection(targetTheme);
        });
    });

    function enterThemeSection(themeId) {
        // Apply target theme classes
        bodyElement.className = '';
        bodyElement.classList.add(`theme-${themeId}`);

        // Hide dashboard, show content container
        dashboard.classList.remove('dashboard-active');
        dashboard.style.display = 'none';
        contentContainer.style.display = 'flex';

        // Switch to the target content section
        sections.forEach(sec => sec.classList.remove('active'));
        const targetSection = document.getElementById(`section-${themeId}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Show the floating buttons
        btnToggleIndex.classList.remove('hide');
        btnReturnHub.classList.remove('hide');

        // Reset header scroll state
        appHeader.classList.remove('scrolled');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Trigger scroll reveal checking since viewport contents changed
        setTimeout(checkScrollReveals, 50);
    }

    // 3. Return to Theme Selection Hub
    btnReturnHub.addEventListener('click', () => {
        // Reset body class back to hub theme
        bodyElement.className = '';
        bodyElement.classList.add('theme-hub');

        // Show dashboard, hide content
        contentContainer.style.display = 'none';
        dashboard.style.display = 'flex';
        
        // Add tiny timeout to trigger fade-in transition
        setTimeout(() => {
            dashboard.classList.add('dashboard-active');
        }, 10);

        // Hide the index floating button & drawer
        btnToggleIndex.classList.add('hide');
        btnReturnHub.classList.add('hide');
        indexDrawer.classList.remove('active');

        // Reset scroll header state
        appHeader.classList.remove('scrolled');
    });

    // 4. Scroll-Responsive Header Collapse Behavior
    window.addEventListener('scroll', () => {
        // Only run when NOT on the landing dashboard (theme-hub)
        if (!bodyElement.classList.contains('theme-hub')) {
            if (window.scrollY > 60) {
                appHeader.classList.add('scrolled');
            } else {
                appHeader.classList.remove('scrolled');
            }
        }
    });

    // 5. Slide-out Drawer Navigation & Cross-Section Redirection
    btnToggleIndex.addEventListener('click', () => {
        indexDrawer.classList.add('active');
    });

    btnCloseDrawer.addEventListener('click', () => {
        indexDrawer.classList.remove('active');
    });

    drawerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSectionTheme = link.getAttribute('data-section');
            const targetElement = document.querySelector(targetId);

            // Close the drawer
            indexDrawer.classList.remove('active');

            // CRITICAL FIX: If target section is hidden, switch theme/section first!
            const currentTheme = bodyElement.className.replace('theme-', '');
            
            if (currentTheme !== targetSectionTheme) {
                // Perform section switch first
                enterThemeSection(targetSectionTheme);
            }

            // Perform smooth scroll with offset after section is visible
            setTimeout(() => {
                const updatedTargetElement = document.querySelector(targetId);
                if (updatedTargetElement) {
                    const headerHeight = appHeader.offsetHeight || 60;
                    const elementPosition = updatedTargetElement.getBoundingClientRect().top + window.scrollY;
                    // Subtract dynamic header height and some safety padding
                    const offsetPosition = elementPosition - headerHeight - 15;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 250); // Timeout ensures CSS layout settles after theme switch
        });
    });

    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
        if (indexDrawer.classList.contains('active') && 
            !indexDrawer.contains(e.target) && 
            !btnToggleIndex.contains(e.target)) {
            indexDrawer.classList.remove('active');
        }
    });

    // 6. Scroll Reveal Animation using Intersection Observer
    let observer;
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.08,
                rootMargin: '0px 0px -40px 0px'
            };

            observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        // Unobserve once revealed to keep layout performant
                        obs.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            revealElements.forEach(el => observer.observe(el));
        } else {
            // Fallback for older browsers
            revealElements.forEach(el => el.classList.add('in-view'));
        }
    }

    // Helper to re-evaluate scroll reveals (useful after dynamic display changes)
    function checkScrollReveals() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (observer) {
            revealElements.forEach(el => {
                if (!el.classList.contains('in-view')) {
                    observer.observe(el);
                }
            });
        }
    }

    // Initialize reveal observer
    initScrollReveal();

    // 7. Practical Conservation Commitment Form
    const commitForm = document.getElementById('commit-form');
    const commitSuccessMsg = document.getElementById('commit-success-msg');

    if (commitForm) {
        commitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check checkboxes
            const checkedOptions = commitForm.querySelectorAll('input[name="commit"]:checked');
            
            if (checkedOptions.length === 0) {
                alert('請至少選擇一項您願意在生活中付諸行動的保育承諾，謝謝您！');
                return;
            }

            // Hide form and show success message
            commitForm.style.display = 'none';
            commitSuccessMsg.classList.remove('hide');
        });
    }
});
