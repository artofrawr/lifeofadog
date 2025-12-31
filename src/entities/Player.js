import { Sprite, Texture, Assets, Graphics, AnimatedSprite, Rectangle } from 'pixi.js';
import * as Physics from '../game/Physics.js';

export class Player {
    constructor(x, y, soundManager = null) {
        this.x = x;
        this.y = y;
        this.spriteWidth = 128;   // Full sprite frame dimensions
        this.spriteHeight = 128;

        // Collision hitbox (actual visible dog area)
        this.width = 50;   // Approximate width of visible dog
        this.height = 85;  // Approximate height of visible dog
        this.hitboxOffsetX = 35;  // Offset from sprite left edge to hitbox
        this.hitboxOffsetY = 35;  // Offset from sprite top edge to hitbox

        this.velocity = { x: 0, y: 0 };
        this.isGrounded = false;
        this.coyoteTimer = 0;
        this.facingRight = true;
        this.soundManager = soundManager;

        // Animation state
        this.currentAnimation = 'idle'; // 'walking', 'jumping', 'idle'
        this.idleSprite = null;
        this.walkingSprite = null;
        this.jumpingSprite = null;
        this.sprite = null;
        this.stageContainer = null;

        // Create sprite placeholder (will be loaded asynchronously)
        // Start with a temporary fallback sprite
        this.sprite = this.createFallbackSprite(x, y);
        this.loadSprites(x, y);
    }

    async loadSprites(x, y) {
        // Load sprite sheets
        const idleUrl = '/assets/sprites/dog/Sprite-0002.png';
        const walkingUrl = '/assets/sprites/dog/Sprite-0001.png';
        const jumpingUrl = '/assets/sprites/dog/Sprite-0006.png';

        try {
            // Load all textures
            const [idleTexture, walkingTexture, jumpingTexture] = await Promise.all([
                Assets.load(idleUrl),
                Assets.load(walkingUrl),
                Assets.load(jumpingUrl)
            ]);

            // Extract frames from idle sprite sheet (8 frames)
            const idleFrames = this.extractFrames(idleTexture, 8);

            // Extract frames from walking sprite sheet (8 frames)
            const walkingFrames = this.extractFrames(walkingTexture, 8);

            // Extract frames from jumping sprite sheet (11 frames)
            const jumpingFrames = this.extractFrames(jumpingTexture, 11);

            // Create animated sprites
            this.idleSprite = new AnimatedSprite(idleFrames);
            this.idleSprite.animationSpeed = 0.1; // Slower for idle breathing
            this.idleSprite.play();

            this.walkingSprite = new AnimatedSprite(walkingFrames);
            this.walkingSprite.animationSpeed = 0.2; // Adjust speed as needed
            this.walkingSprite.play();

            this.jumpingSprite = new AnimatedSprite(jumpingFrames);
            this.jumpingSprite.animationSpeed = 0.15; // Adjust speed as needed
            this.jumpingSprite.play();

            // Remove old sprite if it exists
            if (this.sprite && this.sprite.parent) {
                this.sprite.parent.removeChild(this.sprite);
            }

            // Start with idle sprite
            this.sprite = this.idleSprite;

            // Set position (use natural sprite dimensions, no forced width/height)
            // Use center anchor for easier flipping
            this.sprite.anchor.set(0.5, 0.5);
            // Position sprite center at hitbox center
            this.sprite.x = x + this.width / 2;
            this.sprite.y = y + this.height / 2;
            this.sprite.scale.x = this.facingRight ? 1 : -1;

            // Re-add to stage if it was already added
            if (this.stageContainer) {
                this.stageContainer.addChild(this.sprite);
            }

            this.currentAnimation = 'idle';
        } catch (error) {
            console.warn('Failed to load dog sprites, using fallback:', error);
            // Keep using the fallback sprite
        }
    }

    extractFrames(baseTexture, frameCount) {
        const frames = [];
        const frameWidth = baseTexture.width / frameCount;
        const frameHeight = baseTexture.height;

        for (let i = 0; i < frameCount; i++) {
            const rect = new Rectangle(i * frameWidth, 0, frameWidth, frameHeight);
            const frame = new Texture({
                source: baseTexture.source,
                frame: rect
            });
            frames.push(frame);
        }

        return frames;
    }

    updateAnimation() {
        if (!this.idleSprite || !this.walkingSprite || !this.jumpingSprite) {
            return;
        }

        // Determine current animation state
        let targetAnimation = 'idle';

        if (!this.isGrounded) {
            // In the air (jumping or falling)
            targetAnimation = 'jumping';
        } else if (Math.abs(this.velocity.x) > 0.1) {
            // Moving horizontally on ground
            targetAnimation = 'walking';
        } else {
            // Standing still on ground
            targetAnimation = 'idle';
        }

        // Switch sprite if animation changed
        if (targetAnimation !== this.currentAnimation) {
            const oldSprite = this.sprite;

            this.currentAnimation = targetAnimation;

            switch (targetAnimation) {
                case 'walking':
                    this.sprite = this.walkingSprite;
                    this.sprite.play();
                    break;
                case 'jumping':
                    this.sprite = this.jumpingSprite;
                    this.sprite.play();
                    break;
                case 'idle':
                default:
                    this.sprite = this.idleSprite;
                    this.sprite.play();
                    break;
            }

            // Replace sprite in the scene if needed
            if (oldSprite && oldSprite !== this.sprite && this.stageContainer) {
                const index = this.stageContainer.getChildIndex(oldSprite);
                this.stageContainer.removeChildAt(index);
                this.stageContainer.addChildAt(this.sprite, index);

                // Copy position and scale
                this.sprite.x = oldSprite.x;
                this.sprite.y = oldSprite.y;
                this.sprite.anchor.set(0.5, 0.5);
                this.sprite.scale.x = this.facingRight ? 1 : -1;
            }
        }
    }

    createFallbackSprite(x, y) {
        // Simple dog-like placeholder sprite (matches hitbox size)
        const graphics = new Graphics();

        // Body (brown) - scaled to hitbox
        graphics.rect(10, 15, 30, 40);
        graphics.fill({ color: 0xD2691E });

        // Head (brown)
        graphics.circle(35, 20, 15);
        graphics.fill({ color: 0xD2691E });

        // Ears (darker brown)
        graphics.circle(25, 10, 8);
        graphics.circle(45, 10, 8);
        graphics.fill({ color: 0x8B4513 });

        // Nose (black)
        graphics.circle(42, 22, 3);
        graphics.fill({ color: 0x000000 });

        // Eye (black)
        graphics.circle(38, 18, 2.5);
        graphics.fill({ color: 0x000000 });

        // Legs (darker brown)
        graphics.rect(15, 55, 8, 15);
        graphics.rect(30, 55, 8, 15);
        graphics.fill({ color: 0x8B4513 });

        // Tail
        graphics.circle(8, 35, 5);
        graphics.fill({ color: 0xD2691E });

        // Position at hitbox center
        graphics.x = x + this.width / 2;
        graphics.y = y + this.height / 2;
        graphics.pivot.set(this.width / 2, this.height / 2);
        return graphics;
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

            // Play jump sound
            if (this.soundManager) {
                this.soundManager.playSound('jump');
            }
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

        // Update animation based on state
        this.updateAnimation();

        // Update sprite (only if it exists)
        // Position sprite center at hitbox center
        if (this.sprite) {
            this.sprite.x = this.x + this.width / 2;
            this.sprite.y = this.y + this.height / 2;
            this.sprite.scale.x = this.facingRight ? 1 : -1;
        }
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
        if (this.sprite) {
            this.stageContainer = container;
            container.addChild(this.sprite);
        }
    }

    removeFromStage(container) {
        if (this.sprite && container) {
            container.removeChild(this.sprite);
        }
        this.stageContainer = null;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = { x: 0, y: 0 };
        this.isGrounded = false;
        this.coyoteTimer = 0;
        if (this.sprite) {
            this.sprite.x = x + this.width / 2;
            this.sprite.y = y + this.height / 2;
        }
    }
}
