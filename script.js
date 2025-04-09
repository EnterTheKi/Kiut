document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.glass-nav') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
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
                hamburger.setAttribute('aria-expanded', 'false');
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

    // Language switcher
    const langButtons = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('[data-en][data-hu]');
    const body = document.body;

    function updateLanguage(lang) {
        body.setAttribute('data-lang', lang);
        
        translatableElements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                element.textContent = text;
            }
        });

        langButtons.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
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
    let trackUpdateInterval;

    // Initialize audio
    function initAudio() {
        audio.volume = volumeSlider.value;
        
        // Try autoplay with user gesture
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                playBtn.textContent = '⏸';
            }).catch(e => {
                console.log('Autoplay prevented:', e);
                handlePlayError();
            });
        }
    }

    function handlePlayError() {
        playBtn.textContent = '⏵';
        const lang = body.getAttribute('data-lang');
        trackName.textContent = lang === 'hu' 
            ? 'Kattints a lejátszás gombra a vaporwave rádió indításához!' 
            : 'Click play to start the vaporwave radio!';
        
        // Clear any existing interval
        if (trackUpdateInterval) {
            clearInterval(trackUpdateInterval);
        }
    }

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                playBtn.textContent = '⏸';
                // Start track updates when playback starts
                fetchTrackTitle();
                trackUpdateInterval = setInterval(fetchTrackTitle, 60000);
            }).catch(e => {
                console.log('Play failed:', e);
                handlePlayError();
            });
        } else {
            audio.pause();
            playBtn.textContent = '⏵';
            // Clear interval when paused
            if (trackUpdateInterval) {
                clearInterval(trackUpdateInterval);
            }
        }
    });

    stopBtn.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
        playBtn.textContent = '⏵';
        // Clear interval when stopped
        if (trackUpdateInterval) {
            clearInterval(trackUpdateInterval);
        }
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
                if (data.channels && data.channels.length > 0) {
                    const currentTrack = data.channels[0].now_playing;
                    trackName.textContent = `${currentTrack.artist} - ${currentTrack.title}`;
                    trackName.style.color = '';
                } else {
                    throw new Error('No channel data available');
                }
            })
            .catch(error => {
                console.error('Track fetch failed:', error);
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

    // Initialize track info
    fetchTrackTitle();
    trackUpdateInterval = setInterval(fetchTrackTitle, 60000);

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

    // Check for dark mode preference
    const darkModePref = localStorage.getItem('darkMode');
    if (darkModePref === 'enabled') {
        updateDarkMode(true);
    } else if (darkModePref === 'disabled') {
        updateDarkMode(false);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        updateDarkMode(true);
    }

    // Initialize audio after everything is ready
    initAudio();
});
