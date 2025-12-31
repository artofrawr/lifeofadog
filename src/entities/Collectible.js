import { Sprite, Assets } from 'pixi.js';

export class Collectible {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 45;  
        this.height = 38; 
        this.collected = false;

        // Animation properties
        this.bobOffset = Math.random() * 2 * Math.PI;
        this.bobSpeed = 0.1;

        // Only one sprite instance
        this.sprite = null;
        this.isLoaded = false;
        this.container = null;

        // Load sprite
        this.loadSprite(x, y);
    }

    async loadSprite(x, y) {
        try {
            const texture = await Assets.load('/assets/sprites/bone.png');

            // Only create sprite if it doesn't exist yet
            if (!this.sprite) {
                this.sprite = new Sprite(texture);

                // Scale to match collectible size (804px -> ~45px)
                const scale = this.width / texture.width;
                this.sprite.scale.set(scale, scale);

                // Center the sprite on the collectible position
                this.sprite.anchor.set(0.5, 0.5);
                this.sprite.x = x + this.width / 2;
                this.sprite.y = y + this.height / 2;

                this.isLoaded = true;

                // If container was set before sprite loaded, add it now
                if (this.container) {
                    this.addSpriteToContainer();
                }
            }
        } catch (error) {
            console.warn('Failed to load bone sprite:', error);
        }
    }

    addSpriteToContainer() {
        // ONLY place where sprite is added to container
        if (this.sprite && this.container && !this.sprite.parent) {
            this.container.addChild(this.sprite);
        }
    }

    update(deltaTime) {
        if (this.collected || !this.sprite) return;

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
        this.container = container;
        // Use the single method to add sprite (handles all the checks)
        this.addSpriteToContainer();
    }

    removeFromStage(container) {
        if (this.sprite && this.sprite.parent) {
            this.sprite.parent.removeChild(this.sprite);
        }
        this.container = null;
    }
}
