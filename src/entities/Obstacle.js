import { Graphics } from 'pixi.js';

export class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;

        // Create graphics (simple obstacle - will be poop pile later)
        this.sprite = new Graphics();

        // Draw a simple mound shape
        this.sprite.circle(12, 15, 10);  // Bottom circle
        this.sprite.circle(8, 8, 7);     // Top left
        this.sprite.circle(16, 8, 7);    // Top right
        this.sprite.fill({ color: 0x8B4513 }); // Brown

        this.sprite.stroke({ width: 2, color: 0x654321 }); // Darker brown outline

        this.sprite.x = x;
        this.sprite.y = y;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    addToStage(container) {
        container.addChild(this.sprite);
    }

    removeFromStage(container) {
        container.removeChild(this.sprite);
    }
}
