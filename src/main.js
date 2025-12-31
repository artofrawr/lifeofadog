import { Application } from 'pixi.js';
import { Game } from './game/Game.js';

// Initialize Pixi Application
const app = new Application();

async function init() {
    // Initialize the application
    await app.init({
        width: 800,
        height: 600,
        backgroundColor: 0x87CEEB,
        antialias: true,
    });

    // Add canvas to the game container
    const gameContainer = document.getElementById('game-container');
    gameContainer.appendChild(app.canvas);

    // Create the game (but don't start music yet)
    const game = new Game(app);
    await game.start();

    // Wait for user click to start music
    const clickToStart = document.getElementById('click-to-start');
    clickToStart.addEventListener('click', () => {
        // Start background music
        game.sound.playMusic();
        // Hide overlay
        clickToStart.style.display = 'none';
    });
}

// Start the game
init();
