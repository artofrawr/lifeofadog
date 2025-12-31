export class SoundManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.musicVolume = 0.3;  // Background music at 30% volume
        this.sfxVolume = 0.5;    // Sound effects at 50% volume
    }

    // Load a sound effect
    loadSound(name, path) {
        const audio = new Audio(path);
        audio.volume = this.sfxVolume;
        this.sounds[name] = audio;
    }

    // Load background music
    loadMusic(path) {
        this.music = new Audio(path);
        this.music.volume = this.musicVolume;
        this.music.loop = true;
    }

    // Play a sound effect
    playSound(name) {
        if (this.sounds[name]) {
            // Clone the audio so we can play overlapping sounds
            const sound = this.sounds[name].cloneNode();
            sound.volume = this.sfxVolume;
            sound.play().catch(err => {
                console.warn(`Failed to play sound "${name}":`, err);
            });
        }
    }

    // Play background music
    playMusic() {
        if (this.music) {
            this.music.play().catch(err => {
                console.warn('Failed to play background music:', err);
            });
        }
    }

    // Stop background music
    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }
    }

    // Pause background music
    pauseMusic() {
        if (this.music) {
            this.music.pause();
        }
    }

    // Resume background music
    resumeMusic() {
        if (this.music) {
            this.music.play().catch(err => {
                console.warn('Failed to resume background music:', err);
            });
        }
    }

    // Set music volume (0.0 to 1.0)
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.music) {
            this.music.volume = this.musicVolume;
        }
    }

    // Set sound effects volume (0.0 to 1.0)
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
}
