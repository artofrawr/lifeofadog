import { Graphics, Sprite, Assets } from 'pixi.js';

export class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;   // 2x the original size
        this.height = 60;

        // Create fallback graphics first
        this.sprite = this.createFallbackSprite(x, y);

        // Load actual sprite
        this.loadSprite(x, y);
    }

    async loadSprite(x, y) {
        try {
            const texture = await Assets.load('/assets/sprites/poop.png');

            // Remove fallback sprite
            if (this.sprite && this.sprite.parent) {
                this.sprite.parent.removeChild(this.sprite);
            }

            // Create new sprite
            this.sprite = new Sprite(texture);

            // Scale to match obstacle size (1024px -> ~60px)
            const scale = this.width / texture.width;
            this.sprite.scale.set(scale, scale);

            // Center the sprite on the obstacle position
            this.sprite.anchor.set(0.5, 0.5);
            this.sprite.x = x + this.width / 2;
            this.sprite.y = y + this.height / 2;

            // Re-add to stage if it was already added
            if (this.stageContainer) {
                this.stageContainer.addChild(this.sprite);
            }
        } catch (error) {
            console.warn('Failed to load poop sprite, using fallback:', error);
        }
    }

    createFallbackSprite(x, y) {
        // Simple fallback graphics
        const graphics = new Graphics();
        graphics.circle(12, 15, 10);
        graphics.circle(8, 8, 7);
        graphics.circle(16, 8, 7);
        graphics.fill({ color: 0x8B4513 });
        graphics.stroke({ width: 2, color: 0x654321 });
        graphics.x = x;
        graphics.y = y;
        return graphics;
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
        this.stageContainer = container;
        container.addChild(this.sprite);
    }

    removeFromStage(container) {
        if (this.sprite && container) {
            container.removeChild(this.sprite);
        }
        this.stageContainer = null;
    }
}
