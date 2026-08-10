import { EnemyFactory } from './Enemy.js';

/**
 * EnemyManager.js
 * -----------------------------------------------------------------------
 * Spawns every enemy listed in LevelData using EnemyFactory and drives
 * their per-frame update. Keeping spawn + update loop here (instead of
 * in GameScene) means GameScene doesn't need to know enemy internals.
 * -----------------------------------------------------------------------
 */
export class EnemyManager {
  constructor(scene, levelData, deps) {
    this.scene = scene;
    this.deps = deps;
    this.enemies = levelData.enemies.map((cfg) => {
      const Ctor = EnemyFactory[cfg.type];
      if (!Ctor) {
        console.warn(`[EnemyManager] Unknown enemy type "${cfg.type}"`);
        return null;
      }
      return new Ctor(scene, cfg, deps);
    }).filter(Boolean);
  }

  update(time, delta, player) {
    this.enemies.forEach((e) => e.update(time, delta, player));
  }

  /** All sprites, for collider registration in GameScene. */
  getSprites() {
    return this.enemies.map((e) => e.sprite);
  }

  findBySprite(sprite) {
    return this.enemies.find((e) => e.sprite === sprite);
  }
}
