import { EnemyFactory, Bat } from './Enemy.js';
import { GameConfig } from '../config/GameConfig.js';
import { WasmMath } from '../wasm/WasmBridge.js';

/**
 * EnemyManager.js
 * -----------------------------------------------------------------------
 * Spawns every enemy listed in LevelData using EnemyFactory and drives
 * their per-frame update. Bat sine/horizontal motion is batched through
 * the WebAssembly math module for lower per-frame JS cost.
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

    this.bats = this.enemies.filter((e) => e instanceof Bat);
    this.bats.forEach((bat, i) => {
      bat.wasmIndex = i;
      if (WasmMath.ready) bat.syncToWasm();
    });
  }

  update(time, delta, player) {
    if (this.bats.length > 0 && WasmMath.ready) {
      let n = 0;
      for (let i = 0; i < this.bats.length; i++) {
        const bat = this.bats[i];
        if (bat.defeated) continue;
        bat.wasmIndex = n;
        bat.syncToWasm();
        n++;
      }
      if (n > 0) {
        WasmMath.updateBats(
          n,
          time,
          GameConfig.ENEMY.BAT_SPEED,
          GameConfig.ENEMY.BAT_FREQUENCY,
          delta,
        );
        // Apply poses back — walk alive bats in same order
        let j = 0;
        for (let i = 0; i < this.bats.length; i++) {
          const bat = this.bats[i];
          if (bat.defeated) continue;
          bat.wasmIndex = j++;
          bat.applyWasmPose();
        }
      }
    }

    for (let i = 0; i < this.enemies.length; i++) {
      if (!this.enemies[i].defeated && this.enemies[i].sprite.active) {
        this.enemies[i].update(time, delta, player);
      }
    }
  }

  getSprites() {
    return this.enemies.map((e) => e.sprite);
  }

  findBySprite(sprite) {
    return this.enemies.find((e) => e.sprite === sprite);
  }
}
