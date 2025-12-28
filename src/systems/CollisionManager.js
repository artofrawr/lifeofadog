// AABB (Axis-Aligned Bounding Box) collision detection
export class CollisionManager {
    // Check if two rectangles overlap
    static checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    // Check if rect1 is standing on top of rect2
    static isOnTop(rect1, velocity, rect2, threshold = 5) {
        return (
            velocity.y >= 0 && // Moving down or stationary
            rect1.y + rect1.height <= rect2.y + threshold &&
            rect1.y + rect1.height >= rect2.y - threshold &&
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x
        );
    }

    // Get overlap amount on Y axis
    static getYOverlap(rect1, rect2) {
        const rect1Bottom = rect1.y + rect1.height;
        const rect2Bottom = rect2.y + rect2.height;

        if (rect1.y < rect2.y) {
            return rect1Bottom - rect2.y;
        } else {
            return rect2Bottom - rect1.y;
        }
    }
}
