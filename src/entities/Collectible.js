import { Graphics } from 'pixi.js';

export class Collectible {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.collected = false;

        // Create graphics (bone shape approximation using rectangles)
        this.sprite = new Graphics();

        // Draw a simple bone shape with two circles and a rectangle
        this.sprite.circle(-6, 0, 4); // Left end
        this.sprite.circle(6, 0, 4);  // Right end
        this.sprite.rect(-6, -2, 12, 4); // Middle part
        this.sprite.fill({ color: 0xFFEB3B }); // Yellow
        this.sprite.stroke({ width: 1, color: 0xFFA000 }); // Orange outline

        this.sprite.x = x + this.width / 2;
        this.sprite.y = y + this.height / 2;

        // Animation properties
        this.bobOffset = 0;
        this.bobSpeed = 3;
    }

    update(deltaTime) {
        if (this.collected) return;

        // Bob up and down
        this.bobOffset += this.bobSpeed * deltaTime;
        this.sprite.y = this.y + this.height / 2 + Math.sin(this.bobOffset) * 3;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    collect() {
        this.collected = true;
    }

    addToStage(container) {
        container.addChild(this.sprite);
    }

    removeFromStage(container) {
        container.removeChild(this.sprite);
    }
}
