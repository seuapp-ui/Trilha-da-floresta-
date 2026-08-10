import { GameConfig } from '../config/GameConfig.js';
import { AnimationController } from './Animation.js';

const E = GameConfig.ENEMY;

/**
 * Enemy.js
 * -----------------------------------------------------------------------
 * Base Enemy class handles shared bookkeeping (sprite, health, defeat
 * FX). Each concrete enemy overrides `updateAI(time, delta, player)` for
 * its own movement pattern. Adding a new enemy type later means adding
 * one more small subclass here and one entry in EnemyFactory - nothing
 * else in the codebase needs to change.
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

export class Bat extends Enemy {
  constructor(scene, cfg, deps) {
    super(scene, cfg.x, cfg.y, ['bat_0', 'bat_1'], deps);
    this.baseY = cfg.y;
    this.amplitude = cfg.amplitudeY ? Math.min(cfg.amplitudeY, 60) : E.BAT_AMPLITUDE;
    this.phase = Math.random() * Math.PI * 2;
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setSize(30, 16).setOffset(6, 8);
    this.dir = 1;
  }

  updateAI(time, delta) {
    this.sprite.y = this.baseY + Math.sin(time * E.BAT_FREQUENCY + this.phase) * this.amplitude;
    // delta-based so speed is frame-rate independent (was locked to 1/60)
    this.sprite.x += this.dir * E.BAT_SPEED * (delta / 1000);
    // ~0.18% chance per frame at 60fps → scale by delta so flip rate stays similar
    if (Math.random() < 0.18 * (delta / 1000)) this.dir *= -1;
    this.sprite.setFlipX(this.dir < 0);
    this.animCtrl.setState('fast');
    this.animCtrl.update(delta);
  }
}

export const EnemyFactory = {
  slug: Slug,
  boar: Boar,
  bat: Bat,
};
