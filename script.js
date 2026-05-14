document.addEventListener('DOMContentLoaded', function() {
    // 1. Mobile Menu Toggle
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            const icon = hamburgerBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // 2. Typing Effect (Efek Mengetik Dinamis)
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const words = ["Software Engineer Enthusiast", "Data Scientist", "App Developer", "Creative Videographer"];
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
                setTimeout(type, 2000); // Jeda setelah selesai mengetik kata
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(type, 500); // Jeda sebelum mengetik kata baru
            } else {
                setTimeout(type, isDeleting ? 40 : 100);
            }
        }
        type();
    }

    // 3. Scroll Animation (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });

    // ==========================================
    // 4. Integrasi GitHub API Dinamis
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
            // URL Provider Utama
            const primaryUrl = `https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=radical&bg_color=0a0a0a&text_color=ffffff&title_color=ffffff&icon_color=3b82f6&border_color=333333`;
            // URL Provider Alternatif (Cadangan)
            const fallbackUrl = `https://streak-stats.demolab.com/?user=${githubUsername}&theme=radical&background=0a0a0a&border=333333&text=ffffff&labels=ffffff&ring=3b82f6&fire=3b82f6`;
            
            ghStatsImg.src = primaryUrl;
            
            ghStatsImg.onload = () => {
                ghStatsImg.classList.remove('hidden');
            };
            
            ghStatsImg.onerror = () => {
                // Jika URL utama gagal, coba fallback url
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
            .then(response => response.json())
            .then(data => {
                ghAvatar.src = data.avatar_url;
                ghAvatar.classList.remove('hidden');
                ghAvatarPlaceholder.classList.add('hidden');
                
                ghName.textContent = data.name || data.login;
                ghBio.textContent = data.bio || 'Tidak ada bio yang tersedia.';
                ghReposCount.textContent = data.public_repos || 0;
                ghFollowers.textContent = data.followers || 0;
                ghLink.href = data.html_url;
            })
            .catch(error => console.error('Error memuat profil GitHub:', error));

        // Fetch Repositori Terbaru (Maksimal 3)
        fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=3`)
            .then(response => response.json())
            .then(repos => {
                ghReposContainer.innerHTML = ''; // Bersihkan skeleton loading
                
                // Gunakan kelas CSS warna yang sudah kita buat sebelumnya
                const glowClasses = ['glow-red', 'glow-yellow', 'glow-green', 'glow-blue'];
                
                repos.forEach((repo, index) => {
                    const glowClass = glowClasses[index % glowClasses.length];
                    const lang = repo.language || 'Code';
                    
                    const repoHTML = `
                        <a href="${repo.html_url}" target="_blank" class="block bg-[#0a0a0a] rounded-2xl p-6 border border-gray-800 transition duration-300 transform hover:-translate-y-1 ${glowClass}">
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
            })
            .catch(error => {
                console.error('Error memuat repo GitHub:', error);
                ghReposContainer.innerHTML = '<p class="text-red-500 col-span-2">Gagal memuat repositori terbaru.</p>';
            });
    }
});