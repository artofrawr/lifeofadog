import { Graphics } from 'pixi.js';

export class Enemy {
    constructor(x, y, patrolStart, patrolEnd) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;

        // Patrol points
        this.patrolStart = patrolStart;
        this.patrolEnd = patrolEnd;
        this.speed = 1.5;
        this.direction = 1; // 1 for right, -1 for left

        // Create graphics (simple cat-like enemy)
        this.sprite = new Graphics();

        // Body
        this.sprite.rect(0, 10, this.width, this.height - 10);
        this.sprite.fill({ color: 0xFF5252 }); // Red

        // Ears (triangles approximated as small rectangles)
        this.sprite.rect(5, 5, 5, 8);
        this.sprite.rect(20, 5, 5, 8);
        this.sprite.fill({ color: 0xFF5252 });

        this.sprite.stroke({ width: 2, color: 0xC62828 }); // Dark red outline

        // Set pivot to center so flipping works correctly
        this.sprite.pivot.set(this.width / 2, this.height / 2);

        this.sprite.x = x + this.width / 2;
        this.sprite.y = y + this.height / 2;
    }

    update(deltaTime) {
        // Move back and forth between patrol points
        this.x += this.speed * this.direction * deltaTime;

        // Reverse direction at patrol bounds
        if (this.x <= this.patrolStart) {
            this.x = this.patrolStart;
            this.direction = 1;
        } else if (this.x >= this.patrolEnd) {
            this.x = this.patrolEnd;
            this.direction = -1;
        }

        // Update sprite position (account for pivot being at center)
        this.sprite.x = this.x + this.width / 2;

        // Flip sprite based on direction
        this.sprite.scale.x = this.direction;
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
