import { Graphics } from 'pixi.js';
import * as Physics from '../game/Physics.js';

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 40;

        this.velocity = { x: 0, y: 0 };
        this.isGrounded = false;
        this.coyoteTimer = 0;
        this.facingRight = true;

        // Create player graphics (simple dog shape)
        this.sprite = new Graphics();
        this.createDogShape();

        this.sprite.x = x;
        this.sprite.y = y;
    }

    createDogShape() {
        // Body
        this.sprite.rect(0, 15, 28, 20);
        this.sprite.fill({ color: 0xD2691E }); // Brown

        // Head
        this.sprite.circle(25, 15, 10);
        this.sprite.fill({ color: 0xD2691E });

        // Ears
        this.sprite.circle(20, 8, 5);
        this.sprite.circle(30, 8, 5);
        this.sprite.fill({ color: 0x8B4513 }); // Darker brown

        // Nose
        this.sprite.circle(30, 15, 3);
        this.sprite.fill({ color: 0x000000 }); // Black

        // Eye
        this.sprite.circle(27, 12, 2);
        this.sprite.fill({ color: 0x000000 });

        // Legs (simple rectangles)
        this.sprite.rect(5, 35, 4, 5);
        this.sprite.rect(15, 35, 4, 5);
        this.sprite.fill({ color: 0x8B4513 });

        this.sprite.stroke({ width: 2, color: 0x000000 }); // Black outline
    }

    update(deltaTime, input, platforms) {
        // Handle horizontal movement
        if (input.isLeft()) {
            this.velocity.x -= Physics.ACCELERATION;
            this.facingRight = false;
        } else if (input.isRight()) {
            this.velocity.x += Physics.ACCELERATION;
            this.facingRight = true;
        }

        // Clamp horizontal velocity
        this.velocity.x = Math.max(-Physics.MOVE_SPEED, Math.min(Physics.MOVE_SPEED, this.velocity.x));

        // Apply friction
        Physics.applyFriction(this.velocity, deltaTime);

        // Handle jumping
        const canJump = this.isGrounded || this.coyoteTimer > 0;
        if (input.isJump() && canJump) {
            this.velocity.y = Physics.JUMP_FORCE;
            this.isGrounded = false;
            this.coyoteTimer = 0;
        }

        // Apply gravity
        Physics.applyGravity(this.velocity, deltaTime);

        // Update position
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Check platform collisions
        this.handlePlatformCollisions(platforms);

        // Update coyote timer
        if (!this.isGrounded) {
            this.coyoteTimer -= deltaTime / 60; // Convert to seconds
        }

        // Update sprite
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.scale.x = this.facingRight ? 1 : -1;
    }

    handlePlatformCollisions(platforms) {
        const wasGrounded = this.isGrounded;
        this.isGrounded = false;

        for (const platform of platforms) {
            const platformBounds = platform.getBounds();

            // Check if player is landing on top of platform
            if (this.velocity.y >= 0) {
                // Check if player's bottom is overlapping with platform top
                const playerBottom = this.y + this.height;
                const platformTop = platformBounds.y;

                const isOverlapping =
                    playerBottom >= platformTop &&
                    playerBottom <= platformTop + 15 && // Threshold for landing
                    this.x + this.width > platformBounds.x &&
                    this.x < platformBounds.x + platformBounds.width;

                if (isOverlapping) {
                    this.y = platformTop - this.height;
                    this.velocity.y = 0;
                    this.isGrounded = true;
                }
            }
        }

        // Start coyote timer when leaving ground
        if (wasGrounded && !this.isGrounded) {
            this.coyoteTimer = Physics.COYOTE_TIME;
        }
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

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = { x: 0, y: 0 };
        this.isGrounded = false;
        this.coyoteTimer = 0;
        this.sprite.x = x;
        this.sprite.y = y;
    }
}
