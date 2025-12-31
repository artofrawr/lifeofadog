export const level1Data = {
    playerStart: { x: 50, y: 435 },  // Adjusted for 85px tall hitbox (520 - 85 = 435)

    platforms: [
        // Main sidewalk - mostly continuous
        { x: 0, y: 520, width: 600, height: 80 },

        // Small gap to practice jumping
        { x: 680, y: 520, width: 400, height: 80 },

        // Another small gap
        { x: 1160, y: 520, width: 600, height: 80 },
    ],

    collectibles: [
        { x: 150, y: 480 },      // Early on sidewalk
        { x: 400, y: 480 },      // Mid first section
        { x: 800, y: 480 },      // After first jump
        { x: 1000, y: 480 },     // Before second jump
        { x: 1400, y: 480 },     // After second jump
        { x: 1600, y: 480 },     // Near the end
    ],

    obstacles: [
        { x: 250, y: 490 },      // First obstacle to jump over (adjusted to sit on platform)
        { x: 900, y: 490 },      // Second obstacle
        { x: 1500, y: 490 },     // Third obstacle
    ],

    goalX: 1650, // Goal position (winning area)
    bounds: {
        minX: 0,
        maxX: 1800,
        minY: -100,
        maxY: 650  // Falling below this = game over
    }
};
