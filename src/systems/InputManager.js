export class InputManager {
    constructor() {
        this.keys = {};
        this.setupKeyboardListeners();
    }

    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    isPressed(key) {
        return this.keys[key] === true;
    }

    isLeft() {
        return this.isPressed('ArrowLeft') || this.isPressed('KeyA');
    }

    isRight() {
        return this.isPressed('ArrowRight') || this.isPressed('KeyD');
    }

    isJump() {
        return this.isPressed('Space') || this.isPressed('ArrowUp') || this.isPressed('KeyW');
    }

    isRestart() {
        return this.isPressed('KeyR') || this.isPressed('Enter');
    }
}
