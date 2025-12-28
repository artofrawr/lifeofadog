import { Container } from 'pixi.js';
import { InputManager } from '../systems/InputManager.js';
import { CollisionManager } from '../systems/CollisionManager.js';
import { Player } from '../entities/Player.js';
import { Platform } from '../entities/Platform.js';
import { Collectible } from '../entities/Collectible.js';
import { Obstacle } from '../entities/Obstacle.js';
import { level1Data } from '../levels/level1.js';

const GameState = {
    PLAYING: 'PLAYING',
    WON: 'WON',
    LOST: 'LOST'
};

export class Game {
    constructor(app) {
        this.app = app;
        this.input = new InputManager();

        // Containers for different layers
        this.worldContainer = new Container();
        this.app.stage.addChild(this.worldContainer);

        // Game state
        this.state = GameState.PLAYING;
        this.score = 0;
        this.cameraX = 0;

        // UI elements
        this.scoreElement = document.getElementById('score');
        this.messageElement = document.getElementById('message');
        this.instructionsElement = document.getElementById('instructions');

        // Initialize level
        this.loadLevel(level1Data);
    }

    loadLevel(levelData) {
        this.platforms = [];
        this.collectibles = [];
        this.obstacles = [];
        this.levelData = levelData;

        // Create platforms
        for (const platformData of levelData.platforms) {
            const platform = new Platform(
                platformData.x,
                platformData.y,
                platformData.width,
                platformData.height
            );
            platform.addToStage(this.worldContainer);
            this.platforms.push(platform);
        }

        // Create collectibles
        for (const collectibleData of levelData.collectibles) {
            const collectible = new Collectible(
                collectibleData.x,
                collectibleData.y
            );
            collectible.addToStage(this.worldContainer);
            this.collectibles.push(collectible);
        }

        // Create obstacles
        if (levelData.obstacles) {
            for (const obstacleData of levelData.obstacles) {
                const obstacle = new Obstacle(
                    obstacleData.x,
                    obstacleData.y
                );
                obstacle.addToStage(this.worldContainer);
                this.obstacles.push(obstacle);
            }
        }

        // Create player
        this.player = new Player(
            levelData.playerStart.x,
            levelData.playerStart.y
        );
        this.player.addToStage(this.worldContainer);
    }

    start() {
        // Start game loop
        this.app.ticker.add((ticker) => this.update(ticker.deltaTime));
    }

    update(deltaTime) {
        if (this.state === GameState.PLAYING) {
            this.updateGameplay(deltaTime);
        } else {
            this.updateGameOver();
        }
    }

    updateGameplay(deltaTime) {
        // Update player
        this.player.update(deltaTime, this.input, this.platforms);

        // Update collectibles
        for (const collectible of this.collectibles) {
            collectible.update(deltaTime);

            // Check collision with player
            if (!collectible.collected) {
                if (CollisionManager.checkCollision(
                    this.player.getBounds(),
                    collectible.getBounds()
                )) {
                    collectible.collect();
                    collectible.removeFromStage(this.worldContainer);
                    this.score++;
                    this.updateScore();
                }
            }
        }

        // Check collision with obstacles (static, no update needed)
        for (const obstacle of this.obstacles) {
            if (CollisionManager.checkCollision(
                this.player.getBounds(),
                obstacle.getBounds()
            )) {
                this.lose();
                return;
            }
        }

        // Update camera to follow player
        this.updateCamera();

        // Check win condition (player reached goal)
        if (this.player.x >= this.levelData.goalX) {
            this.win();
            return;
        }

        // Check lose condition (fell off map)
        if (this.player.y > this.levelData.bounds.maxY) {
            this.lose();
            return;
        }
    }

    updateCamera() {
        // Smooth camera follow
        const targetX = -this.player.x + this.app.screen.width / 3;

        // Clamp camera to level bounds
        const minX = -(this.levelData.bounds.maxX - this.app.screen.width);
        const maxX = 0;

        const clampedX = Math.max(minX, Math.min(maxX, targetX));

        // Smooth lerp
        this.cameraX += (clampedX - this.cameraX) * 0.1;
        this.worldContainer.x = this.cameraX;
    }

    updateScore() {
        this.scoreElement.textContent = `Bones: ${this.score}`;
    }

    updateGameOver() {
        // Check for restart
        if (this.input.isRestart()) {
            this.restart();
        }
    }

    win() {
        this.state = GameState.WON;
        this.showMessage('You Win! 🎉\n\nPress R or Enter to restart');
        this.instructionsElement.style.display = 'none';
    }

    lose() {
        this.state = GameState.LOST;
        this.showMessage('Game Over!\n\nPress R or Enter to restart');
        this.instructionsElement.style.display = 'none';
    }

    showMessage(text) {
        this.messageElement.textContent = text;
        this.messageElement.style.display = 'block';
    }

    hideMessage() {
        this.messageElement.style.display = 'none';
    }

    restart() {
        // Reset game state
        this.state = GameState.PLAYING;
        this.score = 0;
        this.updateScore();
        this.hideMessage();
        this.instructionsElement.style.display = 'block';

        // Reset player
        this.player.reset(
            this.levelData.playerStart.x,
            this.levelData.playerStart.y
        );

        // Reset collectibles
        for (const collectible of this.collectibles) {
            if (collectible.collected) {
                collectible.collected = false;
                collectible.addToStage(this.worldContainer);
            }
        }

        // Reset camera
        this.cameraX = 0;
        this.worldContainer.x = 0;
    }
}
