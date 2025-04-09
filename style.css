// Smooth Scrolling for Navigation
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Tile Click Effects
const tiles = document.querySelectorAll('.tile, .vibe-tile');
tiles.forEach(tile => {
    tile.addEventListener('click', () => {
        tile.style.boxShadow = '0 6px 25px rgba(0, 255, 150, 0.5)';
        setTimeout(() => {
            tile.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        }, 300);
    });
});

// CTA Button Pulse on Click
const ctaButtons = document.querySelectorAll('.cta-btn');
ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault(); // Remove this if you want real navigation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    });
});