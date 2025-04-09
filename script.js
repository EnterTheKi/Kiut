document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector 
   
('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            } else {
                window.location.href = targetId;
            }
        });
    });

    // Tile click effects
    const tiles = document.querySelectorAll('.tile, .vibe-tile');
    tiles.forEach(tile => {
        tile.addEventListener('click', () => {
            tile.style.transform = 'scale(0.98)';
            tile.style.boxShadow = '0 8px 25px rgba(76, 122, 107, 0.5)';
            setTimeout(() => {
                tile.style.transform = '';
                tile.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
            }, 300);
        });
    });

    // CTA button effects
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (!button.getAttribute('href').startsWith('#')) return;
            e.preventDefault();
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Language switcher
    const langButtons = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('[data-en][data-hu]');
    const body = document.body;

    function updateLanguage(lang) {
        body.setAttribute('data-lang', lang);
        
        translatableElements.forEach(element => {
            element.textContent = element.getAttribute(`data-${lang}`);
        });

        langButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.lang-btn[data-lang="${lang}"]`).classList.add('active');
        fetchTrackTitle();
    }

    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            updateLanguage(lang);
            localStorage.setItem('preferredLanguage', lang);
        });
    });

    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    updateLanguage(savedLanguage);

    // Music player controls
    const audio = document.getElementById('radio-player');
    const playBtn = document.getElementById('play');
    const stopBtn = document.getElementById('stop');
    const volumeSlider = document.getElementById('volume');
    const trackName = document.getElementById('track-name');

    audio.volume = volumeSlider.value;
    audio.play().then(() => {
        playBtn.textContent = '⏸';
    }).catch(e => {
        console.log('Autoplay prevented:', e);
        playBtn.textContent = '⏵';
        const lang = body.getAttribute('data-lang');
        trackName.textContent = lang === 'hu' 
            ? 'Kattints a lejátszás gombra a vaporwave rádió indításához!' 
            : 'Click play to start the vaporwave radio!';
        setTimeout(() => fetchTrackTitle(), 5000);
    });

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                playBtn.textContent = '⏸';
            }).catch(e => {
                console.log('Play failed:', e);
            });
        } else {
            audio.pause();
            playBtn.textContent = '⏵';
        }
    });

    stopBtn.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
        playBtn.textContent = '⏵';
    });

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
        localStorage.setItem('volumeLevel', volumeSlider.value);
    });

    const savedVolume = localStorage.getItem('volumeLevel') || 0.5;
    volumeSlider.value = savedVolume;
    audio.volume = savedVolume;

    function fetchTrackTitle() {
        fetch('https://somafm.com/songs/vaporwaves.json')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const currentTrack = data.channels[0].now_playing;
                const lang = body.getAttribute('data-lang');
                trackName.textContent = lang === 'hu' 
                    ? `${currentTrack.artist} - ${currentTrack.title}` 
                    : `${currentTrack.artist} - ${currentTrack.title}`;
            })
            .catch(error => {
                console.error('Track fetch failed:', {
                    message: error.message,
                    status: error.status || 'N/A'
                });
                const lang = body.getAttribute('data-lang');
                trackName.textContent = lang === 'hu' 
                    ? 'SomaFM Vaporwaves - Pihentető Hullámok' 
                    : 'SomaFM Vaporwaves - Relaxing Waves';
                trackName.style.color = '#ff5555';
                setTimeout(() => {
                    trackName.style.color = '';
                }, 5000);
            });
    }

    fetchTrackTitle();
    setInterval(fetchTrackTitle, 60000);

    // Dark mode toggle
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    function updateDarkMode(isDark) {
        if (isDark) {
            body.classList.add('dark-mode');
            darkModeToggle.textContent = '☾';
            darkModeToggle.setAttribute('aria-label', body.getAttribute('data-lang') === 'hu' 
                ? 'Váltás világos módra' 
                : 'Switch to Light Mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            darkModeToggle.textContent = '☀';
            darkModeToggle.setAttribute('aria-label', body.getAttribute('data-lang') === 'hu' 
                ? 'Váltás sötét módra' 
                : 'Switch to Dark Mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    }

    darkModeToggle.addEventListener('click', () => {
        updateDarkMode(!body.classList.contains('dark-mode'));
    });

    const darkModePref = localStorage.getItem('darkMode');
    if (darkModePref === 'enabled') {
        updateDarkMode(true);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        updateDarkMode(true);
    }
});
