import { GameConfig } from '../config/GameConfig.js';

/**
 * CameraManager.js
 * -----------------------------------------------------------------------
 * Sets the main camera to smoothly, softly follow the player (small lerp
 * + deadzone so tiny jitter/jumps don't yank the camera) and clamps to
 * level bounds. A tiny helper (shake on damage, flash on checkpoint) also
 * lives here since it is camera-owned behaviour.
 * -----------------------------------------------------------------------
 */
export class CameraManager {
  constructor(scene, target, levelWidth, levelHeight) {
    this.scene = scene;
    this.cam = scene.cameras.main;
    this.cam.setBounds(0, 0, levelWidth, levelHeight);
    this.cam.startFollow(target, true, GameConfig.CAMERA.LERP_X, GameConfig.CAMERA.LERP_Y);
    this.cam.setDeadzone(GameConfig.CAMERA.DEADZONE_W, GameConfig.CAMERA.DEADZONE_H);
  }

  shake(duration = 180, intensity = 0.01) {
    this.cam.shake(duration, intensity);
  }

  flash(duration = 150, r = 255, g = 255, b = 255) {
    this.cam.flash(duration, r, g, b);
  }

  fadeOut(duration, cb) {
    this.cam.fadeOut(duration, 0, 0, 0);
    this.cam.once('camerafadeoutcomplete', cb);
  }

  fadeIn(duration = 400) {
    this.cam.fadeIn(duration, 0, 0, 0);
  }
}
