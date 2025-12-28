# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Life of a Dog" is a 2D side-scrolling platform game featuring a dog character. Inspired by Yoshi's Island aesthetics (hand-drawn, whimsical style), built with Pixi.js.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev         # Start development server (http://localhost:5173)
npm run build       # Build for production
npm run preview     # Preview production build
```

## Technology Stack

- **Pixi.js v8**: 2D WebGL rendering engine
- **Vite v5**: Build tool and dev server
- **JavaScript ES Modules**: No TypeScript or transpilation
- **Custom Physics**: Simple gravity and AABB collision detection (no external physics library)

## Project Structure

```
src/
├── main.js                 # Entry point, initializes Pixi app
├── game/
│   ├── Game.js            # Main game loop, state management, level orchestration
│   └── Physics.js         # Physics constants and helper functions
├── entities/              # Game objects
│   ├── Player.js          # Dog character with movement and collision
│   ├── Platform.js        # Static platforms
│   ├── Collectible.js     # Bones (animated, collectible items)
│   └── Enemy.js           # Patrolling enemies
├── systems/               # Core systems
│   ├── InputManager.js    # Keyboard input handling
│   └── CollisionManager.js # AABB collision detection utilities
└── levels/
    └── level1.js          # Level layout data
```

## Architecture

### Game Loop (src/game/Game.js)
- Main game class manages game state (PLAYING, WON, LOST)
- Update loop: player → collectibles → enemies → camera → win/lose checks
- Uses Pixi ticker for frame-based updates with deltaTime

### Entity System
- All entities have: position, dimensions, sprite, getBounds(), update()
- Player handles input, physics, and platform collision
- Enemies patrol between waypoints
- Collectibles have bobbing animation

### Camera System
- World container moves (camera follows player horizontally)
- Smooth lerp follow with level bounds clamping
- Player positioned at 1/3 screen width for better lookahead

### Physics
- Custom implementation (no library)
- Gravity constant: 0.6 pixels/frame²
- AABB collision detection for all interactions
- Platform collision: only when player moving downward
- Coyote time: 0.1s grace period for jumping after leaving platform

### Rendering
- Uses Pixi.Graphics for placeholder shapes (colored rectangles/circles)
- Ready to swap for sprite-based rendering (Pixi.Sprite/AnimatedSprite)
- UI overlays use HTML/CSS positioned absolutely over canvas

## Current Art Style

Currently using colored geometric placeholders:
- **Player (dog)**: Brown rectangles forming dog shape
- **Platforms**: Green rectangles with darker outline
- **Collectibles (bones)**: Yellow circles/rectangles
- **Enemies**: Red rectangles

To add real sprites: place assets in `public/assets/` and update entity constructors to use `Pixi.Sprite` instead of `Graphics`.

## Game Controls

- **Arrow Keys** or **WASD**: Move left/right
- **Space**: Jump
- **R** or **Enter**: Restart after win/lose

## Level Design

Levels defined in `src/levels/level1.js` as data:
- Platform positions and sizes
- Collectible positions
- Enemy patrol paths (start/end x coordinates)
- Player start position
- Goal position (win condition)
- Level bounds (fall death)
