/**
 * AudioManager.js
 * -----------------------------------------------------------------------
 * Central hub for music and SFX playback. The project ships without
 * binary audio files (keeps the repo self-contained and instantly
 * runnable), so this manager generates short SFX procedurally with the
 * WebAudio API and simply no-ops music if no track was registered.
 *
 * To add real audio later:
 *   1. Preload files in PreloadScene with this.load.audio(key, url)
 *   2. Call audio.registerMusic(key) / the SFX keys already used below
 *      will automatically prefer a loaded Phaser sound over the
 *      generated beep if present.
 * Nothing in gameplay code needs to change.
 * -----------------------------------------------------------------------
 */
export class AudioManager {
  constructor(scene) {
    this.scene = scene;
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;
    this.muted = false;
    this.currentMusic = null;
    this._ctx = null;
  }

  get ctx() {
    if (!this._ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this._ctx = AC ? new AC() : null;
    }
    return this._ctx;
  }

  setMusicVolume(v) {
    this.musicVolume = Phaser.Math.Clamp(v, 0, 1);
    if (this.currentMusic) this.currentMusic.setVolume(this.musicVolume);
  }

  setSfxVolume(v) {
    this.sfxVolume = Phaser.Math.Clamp(v, 0, 1);
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.currentMusic) this.currentMusic.setMute(this.muted);
    return this.muted;
  }

  /** Plays a registered Phaser music key on loop, if it exists. Silent no-op otherwise. */
  playMusic(key) {
    if (!this.scene.cache.audio.exists(key)) return; // graceful fallback - no file shipped
    if (this.currentMusic) this.currentMusic.stop();
    this.currentMusic = this.scene.sound.add(key, { loop: true, volume: this.musicVolume, mute: this.muted });
    this.currentMusic.play();
  }

  stopMusic() {
    if (this.currentMusic) this.currentMusic.stop();
  }

  /**
   * Plays a short procedural blip for the given sfx id if no real sound file
   * was loaded under that key. This keeps the game "audio-ready" out of the
   * box while remaining trivially upgradable to real SFX files.
   */
  playSfx(id) {
    if (this.muted) return;
    if (this.scene.cache.audio.exists(id)) {
      this.scene.sound.play(id, { volume: this.sfxVolume });
      return;
    }
    this._beep(SFX_PROFILES[id] || SFX_PROFILES.default);
  }

  _beep({ freq, duration, type }) {
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = this.sfxVolume * 0.2;
    osc.connect(gain).connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.start(now);
    osc.stop(now + duration);
  }
}

const SFX_PROFILES = {
  jump: { freq: 520, duration: 0.15, type: 'square' },
  land: { freq: 180, duration: 0.1, type: 'sine' },
  coin: { freq: 900, duration: 0.12, type: 'triangle' },
  crystal: { freq: 1200, duration: 0.2, type: 'triangle' },
  hurt: { freq: 140, duration: 0.25, type: 'sawtooth' },
  attack: { freq: 400, duration: 0.12, type: 'square' },
  break: { freq: 220, duration: 0.15, type: 'square' },
  checkpoint: { freq: 700, duration: 0.3, type: 'sine' },
  portal: { freq: 300, duration: 0.5, type: 'sine' },
  enemyDown: { freq: 250, duration: 0.18, type: 'sawtooth' },
  default: { freq: 440, duration: 0.1, type: 'sine' },
};
