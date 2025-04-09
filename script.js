// Select all tiles
const tiles = document.querySelectorAll('.tile');

// Add click effect to each tile
tiles.forEach(tile => {
    tile.addEventListener('click', () => {
        tile.style.boxShadow = '0 6px 20px rgba(0, 255, 150, 0.5)';
        setTimeout(() => {
            tile.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        }, 300); // Reset shadow after 300ms
    });
});