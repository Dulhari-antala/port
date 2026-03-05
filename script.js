document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    // Disable on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

            // Smoother follower
            requestAnimationFrame(() => {
                follower.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
            });
        });

        // Hover effect for cursor
        const interactables = document.querySelectorAll('a, button, .work-item, .card, .tool-card');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.style.width = '60px';
                follower.style.height = '60px';
                follower.style.transform = `translate(${window.event.clientX - 27}px, ${window.event.clientY - 27}px)`;
                follower.style.background = 'rgba(255, 255, 255, 0.05)';
            });
            el.addEventListener('mouseleave', () => {
                follower.style.width = '30px';
                follower.style.height = '30px';
                follower.style.background = 'none';
            });
        });
    }

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu when link is clicked
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.innerHTML = '☰';
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');

                // If it's a staggered container, handle children
                if (el.classList.contains('reveal-stagger')) {
                    const children = el.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                            child.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                        }, index * 100);
                    });
                }
            }
        });
    };

    // Scroll Progress & Effects
    window.addEventListener('scroll', () => {
        // Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) progressBar.style.width = scrolled + "%";

        // Sticky Header & Reveal
        revealOnScroll();

        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back to Top Visibility
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });

    // Background VFX: Generate Beams
    const createBeams = () => {
        const container = document.getElementById('bg-vfx-container');
        if (!container) return;

        for (let i = 0; i < 12; i++) {
            const beam = document.createElement('div');
            beam.className = 'beam';
            beam.style.left = `${Math.random() * 100}%`;
            beam.style.top = `${Math.random() * 100}%`;
            beam.style.animationDelay = `${Math.random() * 8}s`;
            beam.style.animationDuration = `${8 + Math.random() * 12}s`;

            // Randomly assign tri-colors logic is handled by CSS nth-child
            container.appendChild(beam);
        }
    };
    createBeams();

    // Performance Optimization: Play on Hover + Mute Toggle
    const projectItems = document.querySelectorAll('.work-item');
    projectItems.forEach(item => {
        const video = item.querySelector('video');
        const muteBtn = item.querySelector('.mute-toggle');
        const muteIcon = muteBtn ? muteBtn.querySelector('img') : null;

        item.addEventListener('mouseenter', () => {
            video.play().catch(() => { });
        });

        item.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });

        if (muteBtn && video) {
            muteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent other interactions
                video.muted = !video.muted;

                if (video.muted) {
                    muteIcon.src = "https://api.iconify.design/lucide:volume-x.svg?color=white";
                } else {
                    muteIcon.src = "https://api.iconify.design/lucide:volume-2.svg?color=white";
                }
            });
        }
    });

    revealOnScroll(); // Run once on load

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Image Mask Tilt Interaction
    const masks = document.querySelectorAll('.image-mask');
    masks.forEach(mask => {
        mask.parentElement.addEventListener('mousemove', (e) => {
            const rect = mask.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            mask.style.transform = `perspective(1000px) rotateY(${x * 15}deg) rotateX(${y * -15}deg) scale(1.05)`;
        });
        mask.parentElement.addEventListener('mouseleave', () => {
            mask.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)`;
        });
    });

    // Magnetic Button Effect
    const magneticBtns = document.querySelectorAll('.magnetic-wrap');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - Math.round(rect.left + rect.width / 2);
            const y = e.clientY - Math.round(rect.top + rect.height / 2);

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            const innerBtn = btn.querySelector('a, button');
            if (innerBtn) innerBtn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
            const innerBtn = btn.querySelector('a, button');
            if (innerBtn) innerBtn.style.transform = `translate(0px, 0px)`;
        });
    });

    // Error handling for images (removes broken img tags during development)
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.getAttribute('src')) {
            img.style.background = '#1a1a1a';
            img.style.display = 'block';
            img.style.minHeight = '100px';
        }
    });
});
