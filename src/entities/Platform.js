import { Graphics } from 'pixi.js';

export class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Create graphics
        this.sprite = new Graphics();
        this.sprite.rect(0, 0, width, height);
        this.sprite.fill({ color: 0x4CAF50 }); // Green platform
        this.sprite.stroke({ width: 2, color: 0x2E7D32 }); // Darker green outline

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
