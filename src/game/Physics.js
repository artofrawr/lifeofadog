// Physics constants
export const GRAVITY = 0.6;
export const MAX_FALL_SPEED = 15;
export const JUMP_FORCE = -15;  // Increased for bigger dog sprite
export const MOVE_SPEED = 6;    // Increased from 4 for faster horizontal movement
export const ACCELERATION = 1.0; // Increased from 0.5 for quicker acceleration
export const FRICTION = 0.8;
export const COYOTE_TIME = 0.1; // seconds - grace period for jumping after leaving platform

// Helper functions
export function applyGravity(velocity, deltaTime) {
    velocity.y += GRAVITY * deltaTime;
    if (velocity.y > MAX_FALL_SPEED) {
        velocity.y = MAX_FALL_SPEED;
    }
}

export function applyFriction(velocity, deltaTime) {
    velocity.x *= Math.pow(FRICTION, deltaTime);
    // Stop completely if moving very slowly
    if (Math.abs(velocity.x) < 0.1) {
        velocity.x = 0;
    }
}
