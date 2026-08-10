import { GameConfig } from '../config/GameConfig.js';

/**
 * Checkpoint.js
 * -----------------------------------------------------------------------
 * Flag posts placed via LevelData. Touching one for the first time
 * stores the respawn position plus current coins/crystals in GameScene's
 * run-state, plays a small "raise flag" animation, and is idempotent for
 * later re-touches.
 * -----------------------------------------------------------------------
 */
export class CheckpointManager {
  constructor(scene, levelData, audio) {
    this.scene = scene;
    this.audio = audio;
    this.group = scene.physics.add.staticGroup();
    this.activeIndex = -1;

    levelData.checkpoints.forEach((cp, i) => {
      const flag = this.group.create(cp.x, cp.y, 'flag_off');
      flag.setOrigin(0.5, 1);
      flag.setDepth(GameConfig.DEPTH.MAIN_TERRAIN + 1);
      flag.index = i;
      flag.worldX = cp.x;
      flag.worldY = cp.y - 4;
      flag.refreshBody();
    });
  }

  /** Called on overlap. Returns true if this activation is new. */
  activate(flagSprite) {
    if (flagSprite.index === this.activeIndex) return false;
    this.activeIndex = flagSprite.index;
    this.group.getChildren().forEach((f) => f.setTexture(f.index <= this.activeIndex ? 'flag_on' : 'flag_off'));
    this.audio.playSfx('checkpoint');
    this.scene.cameras.main.flash(180, 255, 255, 255, false);
    return true;
  }

  getActiveSpawn(defaultSpawn) {
    if (this.activeIndex < 0) return defaultSpawn;
    const flag = this.group.getChildren()[this.activeIndex];
    return { x: flag.worldX, y: flag.worldY };
  }
}
