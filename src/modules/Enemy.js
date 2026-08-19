import { GameConfig } from '../config/GameConfig.js';
import { AnimationController } from './Animation.js';
import { WasmMath } from '../wasm/WasmBridge.js';

const E = GameConfig.ENEMY;

/**
 * Enemy.js
 * -----------------------------------------------------------------------
 * Base Enemy class handles shared bookkeeping (sprite, health, defeat
 * FX). Each concrete enemy overrides `updateAI(time, delta, player)` for
 * its own movement pattern. Bat vertical/horizontal motion is driven by
 * the WebAssembly math module when available (batch-updated by EnemyManager).
 * -----------------------------------------------------------------------
 */
export class Enemy {
  constructor(scene, x, y, textureFrames, { particles, audio }) {
    this.scene = scene;
    this.particles = particles;
    this.audio = audio;
    this.frames = textureFrames;
    this.defeated = false;

    this.sprite = scene.physics.add.sprite(x, y, textureFrames[0]);
    this.sprite.owner = this;
    this.sprite.setDepth(GameConfig.DEPTH.ENEMIES);
    this.animTimer = 0;
    this.animCtrl = new AnimationController(this.sprite, {
      slow: { frames: textureFrames, rateMs: 500 },
      fast: { frames: textureFrames, rateMs: 90 },
    });
    this.animCtrl.setState('slow');
  }

  updateAI() { /* overridden */ }

  update(time, delta, player) {
    if (this.defeated) return;
    this.updateAI(time, delta, player);
    this.animTimer += delta;
  }

  defeat(stomped = true) {
    if (this.defeated) return;
    this.defeated = true;
    this.audio.playSfx('enemyDown');
    this.particles.hitSpark(this.sprite.x, this.sprite.y);
    this.sprite.disableBody(true, false);
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      scaleY: stomped ? 0.2 : 1,
      angle: stomped ? 0 : 180,
      y: this.sprite.y + (stomped ? 6 : 20),
      duration: 220,
      onComplete: () => this.sprite.destroy(),
    });
  }
}

export class Slug extends Enemy {
  constructor(scene, cfg, deps) {
    super(scene, cfg.x, cfg.y, ['slug_0', 'slug_1'], deps);
    this.patrolMin = cfg.patrolMin;
    this.patrolMax = cfg.patrolMax;
    this.dir = 1;
    this.sprite.body.setSize(30, 16).setOffset(4, 8);
    this.sprite.setVelocityX(E.SLUG_SPEED);
  }

  updateAI(time, delta) {
    if (this.sprite.x <= this.patrolMin) this.dir = 1;
    if (this.sprite.x >= this.patrolMax) this.dir = -1;
    this.sprite.setVelocityX(E.SLUG_SPEED * this.dir);
    this.sprite.setFlipX(this.dir < 0);
    this.animCtrl.setState('slow');
    this.animCtrl.update(delta);
  }
}

export class Boar extends Enemy {
  constructor(scene, cfg, deps) {
    super(scene, cfg.x, cfg.y, ['boar_0', 'boar_1'], deps);
    this.homeX = cfg.x;
    this.charging = false;
    this.dir = 1;
    this.sprite.body.setSize(46, 22).setOffset(10, 14);
  }

  updateAI(time, delta, player) {
    const dist = Math.abs(player.sprite.x - this.sprite.x);
    const sameLevel = Math.abs(player.sprite.y - this.sprite.y) < 80;

    if (!this.charging && dist < E.BOAR_TRIGGER_DISTANCE && sameLevel) {
      this.charging = true;
    }
    if (this.charging && dist > E.BOAR_TRIGGER_DISTANCE * 1.6) {
      this.charging = false;
    }

    if (this.charging) {
      this.dir = player.sprite.x < this.sprite.x ? -1 : 1;
      this.sprite.setVelocityX(E.BOAR_SPEED * this.dir);
    } else {
      this.sprite.setVelocityX(0);
    }
    this.sprite.setFlipX(this.dir < 0);
    this.animCtrl.setState(this.charging ? 'fast' : 'slow');
    this.animCtrl.update(delta);
  }
}

/**
 * Bat — motion core runs in WebAssembly (sine + horizontal drift).
 * EnemyManager calls applyWasmPose() after the batch updateBats().
 */
export class Bat extends Enemy {
  constructor(scene, cfg, deps) {
    super(scene, cfg.x, cfg.y, ['bat_0', 'bat_1'], deps);
    this.baseY = cfg.y;
    this.amplitude = cfg.amplitudeY ? Math.min(cfg.amplitudeY, 60) : E.BAT_AMPLITUDE;
    this.phase = Math.random() * Math.PI * 2;
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setSize(30, 16).setOffset(6, 8);
    this.dir = 1;
    /** Index into the WASM bat buffer; assigned by EnemyManager. */
    this.wasmIndex = -1;
  }

  updateAI(time, delta) {
    if (this.wasmIndex >= 0 && WasmMath.ready) {
      this.sprite.setFlipX(this.dir < 0);
      this.animCtrl.setState('fast');
      this.animCtrl.update(delta);
      return;
    }
    this.sprite.y = this.baseY + Math.sin(time * E.BAT_FREQUENCY + this.phase) * this.amplitude;
    this.sprite.x += this.dir * E.BAT_SPEED * (delta / 1000);
    if (Math.random() < 0.003) this.dir *= -1;
    this.sprite.setFlipX(this.dir < 0);
    this.animCtrl.setState('fast');
    this.animCtrl.update(delta);
  }

  syncToWasm() {
    if (this.wasmIndex < 0 || !WasmMath.ready) return;
    WasmMath.setBat(this.wasmIndex, this.baseY, this.phase, this.amplitude, this.sprite.x, this.dir);
  }

  applyWasmPose() {
    if (this.wasmIndex < 0 || !WasmMath.ready) return;
    this.sprite.x = WasmMath.getBatX(this.wasmIndex);
    this.sprite.y = WasmMath.getBatY(this.wasmIndex);
    if (Math.random() < 0.003) {
      this.dir *= -1;
      WasmMath.setBatDir(this.wasmIndex, this.dir);
    }
  }
}


/**
 * Frog — hops along a patrol range. Jumps periodically with cooldown.
 */
export class Frog extends Enemy {
  constructor(scene, cfg, deps) {
    super(scene, cfg.x, cfg.y, ['frog_0', 'frog_1'], deps);
    this.patrolMin = cfg.patrolMin ?? cfg.x - 80;
    this.patrolMax = cfg.patrolMax ?? cfg.x + 80;
    this.dir = 1;
    this.nextJumpAt = 0;
    this.sprite.body.setSize(28, 18).setOffset(8, 12);
  }

  updateAI(time, delta) {
    const onGround = this.sprite.body.blocked.down || this.sprite.body.touching.down;
    if (this.sprite.x <= this.patrolMin) this.dir = 1;
    if (this.sprite.x >= this.patrolMax) this.dir = -1;

    if (onGround) {
      this.sprite.setVelocityX(0);
      if (time >= this.nextJumpAt) {
        this.sprite.setVelocity(this.dir * E.FROG_SPEED * 2.2, E.FROG_JUMP_VELOCITY);
        this.nextJumpAt = time + E.FROG_JUMP_COOLDOWN_MS;
        this.animCtrl.setState('fast');
      } else {
        this.animCtrl.setState('slow');
      }
    } else {
      this.sprite.setVelocityX(this.dir * E.FROG_SPEED * 1.6);
      this.animCtrl.setState('fast');
    }
    this.sprite.setFlipX(this.dir < 0);
    this.animCtrl.update(delta);
  }
}

export const EnemyFactory = {
  slug: Slug,
  boar: Boar,
  bat: Bat,
  frog: Frog,
};
