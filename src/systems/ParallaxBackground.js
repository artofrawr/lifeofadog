import { Container, Sprite, Assets, TilingSprite } from 'pixi.js';

export class ParallaxBackground {
    constructor(app) {
        this.app = app;
        this.container = new Container();
        this.layers = [];
        this.loaded = false;

        // Parallax layer configuration
        // Layers further back scroll slower (lower scroll factor)
        this.layerConfig = [
            { path: '/assets/bg/nature_3/1.png', scrollFactor: 0.05 },  // Sky/clouds - slowest
            { path: '/assets/bg/nature_3/2.png', scrollFactor: 0.15 },  // Mountains - slow
            { path: '/assets/bg/nature_3/3.png', scrollFactor: 0.25 },  // Mist/fog - medium
            { path: '/assets/bg/nature_3/4.png', scrollFactor: 0.4 },   // Trees - faster
        ];
    }

    async load() {
        try {
            // Load all background textures
            const textures = await Promise.all(
                this.layerConfig.map(config => Assets.load(config.path))
            );

            // Create tiling sprites for each layer
            for (let i = 0; i < textures.length; i++) {
                const texture = textures[i];
                const config = this.layerConfig[i];

                // Calculate scale to fit screen height while maintaining aspect ratio
                const scale = this.app.screen.height / texture.height;
                const scaledWidth = texture.width * scale;

                // Create a TilingSprite that repeats horizontally
                const tilingSprite = new TilingSprite({
                    texture: texture,
                    width: this.app.screen.width * 3, // Make it wide enough to cover scrolling
                    height: texture.height
                });

                // Scale to fill screen height while maintaining aspect ratio
                tilingSprite.scale.set(scale, scale);

                // Position at top of screen
                tilingSprite.y = 0;

                this.layers.push({
                    sprite: tilingSprite,
                    scrollFactor: config.scrollFactor,
                    scale: scale
                });

                this.container.addChild(tilingSprite);
            }

            this.loaded = true;
        } catch (error) {
            console.warn('Failed to load parallax background:', error);
        }
    }

    update(cameraX) {
        if (!this.loaded) return;

        // Update each layer based on camera position and its scroll factor
        for (const layer of this.layers) {
            // Move the tiling offset based on camera position
            // Negative cameraX means camera moved right, so we want to move texture left
            layer.sprite.tilePosition.x = cameraX * layer.scrollFactor;
        }
    }

    addToStage(stage) {
        // Add to the very back of the stage
        stage.addChildAt(this.container, 0);
    }

    removeFromStage(stage) {
        stage.removeChild(this.container);
    }
}
