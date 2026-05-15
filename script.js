document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 0. CREATE DYNAMIC ELEMENTS
    // ==========================================

    // Scroll Progress Bar
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.width = '0%';
    document.body.prepend(progressBar);

    // Cursor Follower (desktop only)
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor = document.createElement('div');
        cursor.id = 'cursor-follower';
        document.body.appendChild(cursor);

        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        function animateCursor() {
            followerX += (cursorX - followerX) * 0.12;
            followerY += (cursorY - followerY) * 0.12;
            cursor.style.left = followerX + 'px';
            cursor.style.top = followerY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Enlarge on hover of links/buttons
        document.querySelectorAll('a, button, .glow-red, .glow-yellow, .glow-green, .glow-blue, .glow-white').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });
    }

    // Particles in Hero Section
    const heroSection = document.getElementById('beranda');
    if (heroSection) {
        const particlesContainer = document.createElement('div');
        particlesContainer.id = 'particles-container';
        heroSection.style.position = 'relative';
        heroSection.prepend(particlesContainer);

        const colors = ['#ef4444', '#eab308', '#22c55e', '#3b82f6', '#ffffff'];
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDuration = (8 + Math.random() * 15) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.width = (2 + Math.random() * 3) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    // ==========================================
    // 1. Mobile Menu Toggle
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', function() {
            hamburgerBtn.classList.toggle('active');
            
            if (mobileMenu.classList.contains('opacity-0')) {
                // Tampilkan menu
                mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
                mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
                document.body.style.overflow = 'hidden'; // Cegah scroll background
            } else {
                // Sembunyikan menu
                mobileMenu.classList.add('opacity-0', 'pointer-events-none');
                mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                mobileMenu.classList.add('opacity-0', 'pointer-events-none');
                mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================
    // 2. Typing Effect (Efek Mengetik Dinamis)
    // ==========================================
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const words = ["Web Developer", "Mobile App Developer", "Software Engineer Enthusiast", "Tech Explorer"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            const currentChar = isDeleting 
                ? currentWord.substring(0, charIndex - 1) 
                : currentWord.substring(0, charIndex + 1);
                
            typingTextElement.textContent = currentChar;
            charIndex += isDeleting ? -1 : 1;

            if (!isDeleting && charIndex === currentWord.length + 1) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 40 : 100);
            }
        }
        type();
    }

    // ==========================================
    // 3. Advanced Scroll Animations (Intersection Observer)
    // ==========================================
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });

    document.querySelectorAll('.scroll-animate').forEach(el => {
        scrollObserver.observe(el);
    });

    // ==========================================
    // 4. Scroll Progress Bar + Navbar Effect
    // ==========================================
    const navbar = document.querySelector('nav');
    
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
        
        // Navbar scroll effect
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    // ==========================================
    // 5. Active Nav Link Highlighting
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    function highlightNavLink() {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('nav-active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('nav-active');
                    }
                });
            }
        });
    }

    // ==========================================
    // 6. Parallax Effect on Scroll
    // ==========================================
    function parallaxScroll() {
        const scrollY = window.scrollY;
        
        // Hero parallax (move content slightly)
        if (heroSection) {
            const heroContent = heroSection.querySelector('.scroll-animate');
            const heroImage = heroSection.querySelector('.float-animate');
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
                heroContent.style.opacity = Math.max(0, 1 - scrollY / 700);
            }
            if (heroImage) {
                heroImage.style.transform = `translateY(${scrollY * 0.08}px)`;
            }
        }
    }

    // ==========================================
    // 7. Combined Scroll Handler (throttled with rAF)
    // ==========================================
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                highlightNavLink();
                parallaxScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    // Initial calls
    updateScrollProgress();
    highlightNavLink();

    // ==========================================
    // 8. 3D Tilt Effect on Cards
    // ==========================================
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
            });
        });
    }

    // ==========================================
    // 9. Magnetic Button Effect
    // ==========================================
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ==========================================
    // 10. Counter Animation (for GitHub Stats etc.)
    // ==========================================
    window.animateCounter = function(element, target, duration = 1500) {
        const start = parseInt(element.textContent) || 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (target - start) * eased);
            element.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    };

    // ==========================================
    // 11. Smooth Reveal for Section Borders
    // ==========================================
    // Replace top borders with animated glow lines
    document.querySelectorAll('section').forEach(section => {
        if (section.classList.contains('border-t')) {
            const glowLine = document.createElement('div');
            glowLine.classList.add('section-glow-line');
            section.prepend(glowLine);
        }
    });

    // ==========================================
    // 12. Ripple effect on buttons
    // ==========================================
    document.querySelectorAll('a[href^="#"], .ripple').forEach(el => {
        el.classList.add('ripple');
    });

    // ==========================================
    // 13. Text Reveal Animation for Section Headers
    // ==========================================
    document.querySelectorAll('.text-reveal').forEach(el => {
        const text = el.textContent;
        el.innerHTML = '';
        text.split(' ').forEach((word, index) => {
            const span = document.createElement('span');
            span.classList.add('word');
            span.textContent = word + ' ';
            span.style.transitionDelay = (index * 0.08) + 's';
            el.appendChild(span);
        });
    });

    // Observe text-reveal elements
    const textRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                textRevealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.text-reveal').forEach(el => {
        textRevealObserver.observe(el);
    });

    // ==========================================
    // 14. Image Reveal on Scroll
    // ==========================================
    const imgRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                imgRevealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.img-reveal').forEach(el => {
        imgRevealObserver.observe(el);
    });

    // ==========================================
    // 15. Skill Bar Animation
    // ==========================================
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const targetWidth = fill.getAttribute('data-width');
                setTimeout(() => {
                    fill.style.width = targetWidth;
                }, 200);
                skillObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-bar-fill').forEach(el => {
        skillObserver.observe(el);
    });


    // ==========================================
    // 20. Integrasi GitHub API Dinamis
    // ==========================================
    const githubUsername = 'serverheru';

    const ghUsernameDisplay = document.getElementById('gh-username-display');
    const ghAvatar = document.getElementById('gh-avatar');
    const ghAvatarPlaceholder = document.getElementById('gh-avatar-placeholder');
    const ghName = document.getElementById('gh-name');
    const ghBio = document.getElementById('gh-bio');
    const ghReposCount = document.getElementById('gh-repos');
    const ghFollowers = document.getElementById('gh-followers');
    const ghLink = document.getElementById('gh-link');
    const ghReposContainer = document.getElementById('gh-repos-container');
    const ghStatsImg = document.getElementById('gh-stats-img');
    const ghContribImg = document.getElementById('gh-contrib-img');

    if (ghUsernameDisplay) {
        ghUsernameDisplay.textContent = '@' + githubUsername;
        
        // Memasang Widget Statistik Eksternal
        if(ghStatsImg) {
            const primaryUrl = `https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=radical&bg_color=0a0a0a&text_color=ffffff&title_color=ffffff&icon_color=3b82f6&border_color=333333`;
            const fallbackUrl = `https://streak-stats.demolab.com/?user=${githubUsername}&theme=radical&background=0a0a0a&border=333333&text=ffffff&labels=ffffff&ring=3b82f6&fire=3b82f6`;
            
            ghStatsImg.src = primaryUrl;
            
            ghStatsImg.onload = () => {
                ghStatsImg.classList.remove('hidden');
            };
            
            ghStatsImg.onerror = () => {
                ghStatsImg.onerror = () => {
                    ghStatsImg.parentElement.innerHTML = '<div class="text-gray-500 text-sm mt-10 p-4 border border-gray-800 rounded-xl bg-[#0a0a0a] inline-block"><i class="fas fa-exclamation-triangle text-yellow-500 mb-2 text-xl"></i><br>Server API Statistik GitHub sedang penuh (Rate Limit) atau diblokir oleh AdBlock.<br>Silakan coba muat ulang halaman (refresh) beberapa saat lagi.</div>';
                };
                ghStatsImg.src = fallbackUrl;
            };
        }

        // Memasang Widget Kontribusi (Titik Hijau)
        if(ghContribImg) {
            const skeleton = document.getElementById('gh-contrib-skeleton');
            ghContribImg.src = `https://ghchart.rshah.org/${githubUsername}`;
            ghContribImg.onload = () => {
                if (skeleton) skeleton.classList.add('hidden');
                ghContribImg.classList.remove('opacity-0');
                ghContribImg.classList.add('opacity-90');
            };
            ghContribImg.onerror = () => {
                if (skeleton) skeleton.classList.add('hidden');
                ghContribImg.parentElement.innerHTML = '<p class="text-gray-500 text-sm mt-4 text-center"><i class="fas fa-exclamation-circle text-yellow-500 mr-2"></i>Gagal memuat grafik kontribusi. Coba muat ulang beberapa saat lagi.</p>';
            };
        }

        // Fetch Data Profil GitHub
        fetch(`https://api.github.com/users/${githubUsername}`)
            .then(response => {
                if (!response.ok) throw new Error('Limit API GitHub tercapai');
                return response.json();
            })
            .then(data => {
                ghAvatar.src = data.avatar_url;
                ghAvatar.classList.remove('hidden');
                ghAvatarPlaceholder.classList.add('hidden');
                
                ghName.textContent = data.name || data.login;
                ghBio.textContent = data.bio || 'Tidak ada bio yang tersedia.';
                
                // Animate counters
                if (window.animateCounter) {
                    animateCounter(ghReposCount, data.public_repos || 0);
                    animateCounter(ghFollowers, data.followers || 0);
                } else {
                    ghReposCount.textContent = data.public_repos || 0;
                    ghFollowers.textContent = data.followers || 0;
                }
                
                ghLink.href = data.html_url;
            })
            .catch(error => console.error('Error memuat profil GitHub:', error));

        // Fetch Repositori Terbaru (Maksimal 3)
        fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=3`)
            .then(response => {
                if (!response.ok) throw new Error('Limit API GitHub tercapai');
                return response.json();
            })
            .then(repos => {
                if (!Array.isArray(repos)) throw new Error('Data repositori tidak valid');
                ghReposContainer.innerHTML = '';
                
                const glowClasses = ['glow-red', 'glow-yellow', 'glow-green', 'glow-blue'];
                
                repos.forEach((repo, index) => {
                    const glowClass = glowClasses[index % glowClasses.length];
                    const lang = repo.language || 'Code';
                    
                    const repoHTML = `
                        <a href="${repo.html_url}" target="_blank" class="block bg-[#0a0a0a] rounded-2xl p-6 border border-gray-800 transition duration-300 transform hover:-translate-y-2 ${glowClass} tilt-card scroll-animate" data-anim="scale-up" data-delay="${(index + 1) * 200}">
                            <div class="flex justify-between items-start mb-4">
                                <h4 class="text-lg font-bold text-white truncate pr-2" title="${repo.name}">${repo.name}</h4>
                                <i class="fab fa-github text-xl text-gray-600"></i>
                            </div>
                            <p class="text-gray-400 text-sm mb-5 h-10 overflow-hidden line-clamp-2">${repo.description || 'Tidak ada deskripsi untuk repositori ini.'}</p>
                            <div class="flex items-center gap-4 text-xs font-bold text-gray-500">
                                <span><i class="fas fa-circle text-[10px] mr-1.5 text-gray-400"></i>${lang}</span>
                                <span><i class="fas fa-star text-[10px] mr-1 text-yellow-500"></i>${repo.stargazers_count}</span>
                                <span><i class="fas fa-code-branch text-[10px] mr-1 text-green-500"></i>${repo.forks_count}</span>
                            </div>
                        </a>
                    `;
                    ghReposContainer.innerHTML += repoHTML;
                });

                // Re-observe newly added scroll-animate elements
                ghReposContainer.querySelectorAll('.scroll-animate').forEach(el => {
                    scrollObserver.observe(el);
                });
                // Re-observe newly added tilt-cards
                if (window.matchMedia('(pointer: fine)').matches) {
                    ghReposContainer.querySelectorAll('.tilt-card').forEach(card => {
                        card.addEventListener('mousemove', (e) => {
                            const rect = card.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            const centerX = rect.width / 2;
                            const centerY = rect.height / 2;
                            const rotateX = ((y - centerY) / centerY) * -8;
                            const rotateY = ((x - centerX) / centerX) * 8;
                            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
                        });
                        card.addEventListener('mouseleave', () => {
                            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
                        });
                    });
                }
            })
            .catch(error => {
                console.error('Error memuat repo GitHub:', error);
                ghReposContainer.innerHTML = `
                    <div class="col-span-1 sm:col-span-2 xl:col-span-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                        <i class="fas fa-exclamation-triangle text-red-500 text-2xl mb-3"></i>
                        <p class="text-red-400 font-medium">Gagal memuat repositori terbaru</p>
                        <p class="text-red-500/70 text-sm mt-1">Hal ini biasa terjadi karena batasan akses server (Rate Limit). Silakan muat ulang halaman beberapa saat lagi.</p>
                    </div>
                `;
            });
    }

    // ==========================================
    // 21. Mouse Drag to Scroll (Horizontal Sliders)
    // ==========================================
    const sliders = document.querySelectorAll('.slider-container');
    
    sliders.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        // Setup tombol prev/next jika ada
        const btnPrev = slider.parentElement.querySelector('.slider-btn-prev');
        const btnNext = slider.parentElement.querySelector('.slider-btn-next');
        
        if (btnPrev && btnNext) {
            btnPrev.addEventListener('click', () => {
                slider.scrollBy({ left: -slider.offsetWidth * 0.8, behavior: 'smooth' });
            });
            btnNext.addEventListener('click', () => {
                slider.scrollBy({ left: slider.offsetWidth * 0.8, behavior: 'smooth' });
            });
        }

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            // Disable snap sementara saat diseret agar mulus
            slider.style.scrollBehavior = 'auto'; 
            slider.style.scrollSnapType = 'none'; 
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        
        const stopDrag = () => {
            isDown = false;
            // Kembalikan smooth dan snap otomatis
            slider.style.scrollBehavior = 'smooth';
            slider.style.scrollSnapType = 'x mandatory';
        };
        
        slider.addEventListener('mouseleave', stopDrag);
        slider.addEventListener('mouseup', stopDrag);
        
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Kecepatan seret mouse
            slider.scrollLeft = scrollLeft - walk;
        });
    });
});