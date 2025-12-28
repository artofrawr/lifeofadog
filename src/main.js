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

    // Create and start the game
    const game = new Game(app);
    game.start();
}

// Start the game
init();
