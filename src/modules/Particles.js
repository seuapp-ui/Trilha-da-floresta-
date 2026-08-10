import { GameConfig } from '../config/GameConfig.js';

/**
 * ParticlesManager.js
 * -----------------------------------------------------------------------
 * Small helper around Phaser's particle emitters so gameplay code can
 * say `particles.runDust(x, y)` instead of re-configuring emitters
 * everywhere.
 *
 * IMPORTANT: since Phaser 3.60 `scene.add.particles(...)` returns a live
 * ParticleEmitter that starts emitting immediately (default frequency
 * emits every step). For one-shot effects we must build each emitter
 * once with `emitting: false` and reuse it via `.explode(count, x, y)` -
 * creating a brand new emitter GameObject per effect call would both
 * spam continuous particles (never stopped) and leak GameObjects for
 * the whole level. All emitters below are created once and reused.
 * -----------------------------------------------------------------------
 */
export class ParticlesManager {
  constructor(scene) {
    this.scene = scene;
    const D = GameConfig.DEPTH.PARTICLES;

    this.dust = scene.add.particles(0, 0, 'particle_dust', {
      speed: { min: 20, max: 60 },
      scale: { start: 1, end: 0 },
      lifespan: 260,
      alpha: { start: 0.7, end: 0 },
      emitting: false,
    }).setDepth(D);

    this.poof = scene.add.particles(0, 0, 'particle_dust', {
      speed: { min: 40, max: 90 },
      angle: { min: 200, max: 340 },
      scale: { start: 1.2, end: 0 },
      lifespan: 320,
      alpha: { start: 0.8, end: 0 },
      emitting: false,
    }).setDepth(D);

    this.debris = scene.add.particles(0, 0, 'crate_debris', {
      speed: { min: 80, max: 220 },
      angle: { min: 0, max: 360 },
      gravityY: 900,
      scale: { start: 1, end: 0.6 },
      lifespan: 500,
      rotate: { min: 0, max: 360 },
      emitting: false,
    }).setDepth(D);

    this.spark = scene.add.particles(0, 0, 'particle_spark', {
      speed: { min: 60, max: 160 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      lifespan: 260,
      emitting: false,
    }).setDepth(D);

    this.sparkle = scene.add.particles(0, 0, 'particle_spark', {
      speed: { min: 40, max: 100 },
      angle: { min: 250, max: 290 },
      scale: { start: 0.8, end: 0 },
      lifespan: 400,
      emitting: false,
    }).setDepth(D);

    this.swirl = scene.add.particles(0, 0, 'particle_spark', {
      speed: { min: 100, max: 180 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.7, end: 0 },
      lifespan: 220,
      tint: 0xffe27a,
      emitting: false,
    }).setDepth(D);

    this.water = scene.add.particles(0, 0, 'particle_dot', {
      speed: { min: 60, max: 160 },
      angle: { min: 200, max: 340 },
      scale: { start: 0.8, end: 0 },
      tint: 0x4fa3d6,
      lifespan: 320,
      emitting: false,
    }).setDepth(D);
  }

  runDust(x, y) {
    this.dust.explode(2, x, y);
  }

  landPoof(x, y) {
    this.poof.explode(6, x, y);
  }

  crateBreak(x, y) {
    this.debris.explode(10, x, y);
  }

  hitSpark(x, y) {
    this.spark.explode(8, x, y);
  }

  collectSparkle(x, y, tint = 0xffe27a) {
    this.sparkle.setParticleTint(tint);
    this.sparkle.explode(6, x, y);
  }

  attackSwirl(x, y) {
    this.swirl.explode(10, x, y);
  }

  splash(x, y) {
    this.water.explode(8, x, y);
  }
}
