import { GameConfig } from '../config/GameConfig.js';

/**
 * Parallax.js
 * -----------------------------------------------------------------------
 * Builds the seven parallax layers (sky, clouds, mountains, distant
 * trees, near trees, main terrain*, foreground) and assigns each a
 * scrollFactor so they move at different speeds relative to the camera,
 * producing the depth effect described in the design doc.
 *
 * * The "main terrain" layer itself is the real, collidable level built
 *   by Map.js - this class only owns the six purely decorative layers
 *   plus the foreground overlay.
 * -----------------------------------------------------------------------
 */
export class Parallax {
  constructor(scene, levelWidth, levelHeight) {
    this.scene = scene;
    this.levelWidth = levelWidth;
    this.levelHeight = levelHeight;
    this.layers = {};
    this._build();
  }

  _build() {
    const { scene, levelWidth, levelHeight } = this;
    const P = GameConfig.PARALLAX;
    const D = GameConfig.DEPTH;

    // --- Layer 1: Sky (fixed) --------------------------------------
    const sky = scene.add.tileSprite(0, 0, levelWidth * 1.5, levelHeight, 'sky')
      .setOrigin(0, 0)
      .setScrollFactor(P.SKY)
      .setDepth(D.SKY);
    this.layers.sky = sky;

    // --- Layer 2: Clouds (10%) --------------------------------------
    const clouds = scene.add.group();
    for (let i = 0; i < 14; i++) {
      const c = scene.add.image(
        Phaser.Math.Between(0, levelWidth * 1.2),
        Phaser.Math.Between(30, 180),
        'cloud'
      ).setScrollFactor(P.CLOUDS).setDepth(D.CLOUDS).setAlpha(0.9);
      c.setScale(Phaser.Math.FloatBetween(0.7, 1.4));
      clouds.add(c);
    }
    this.layers.clouds = clouds;

    // --- Layer 3: Mountains (20%) ------------------------------------
    const mountains = scene.add.tileSprite(0, levelHeight - 320, levelWidth * 1.3, 320, 'mountain')
      .setOrigin(0, 0)
      .setScrollFactor(P.MOUNTAINS)
      .setDepth(D.MOUNTAINS);
    this.layers.mountains = mountains;

    // --- Layer 4: Distant trees (40%) --------------------------------
    const treesFar = scene.add.group();
    for (let x = 0; x < levelWidth * 1.1; x += 90) {
      const img = scene.add.image(x + Phaser.Math.Between(-20, 20), levelHeight - 40, Phaser.Math.RND.pick(['tree_far_1', 'tree_far_2']))
        .setOrigin(0.5, 1)
        .setScrollFactor(P.TREES_FAR)
        .setDepth(D.TREES_FAR)
        .setAlpha(0.85);
      treesFar.add(img);
    }
    this.layers.treesFar = treesFar;

    // --- Layer 5: Near trees (70%) ------------------------------------
    const treesNear = scene.add.group();
    for (let x = 0; x < levelWidth * 1.05; x += 220) {
      const img = scene.add.image(x + Phaser.Math.Between(-30, 30), levelHeight - 20, Phaser.Math.RND.pick(['tree_near_1', 'tree_near_2']))
        .setOrigin(0.5, 1)
        .setScrollFactor(P.TREES_NEAR)
        .setDepth(D.TREES_NEAR);
      treesNear.add(img);
    }
    this.layers.treesNear = treesNear;

    // --- Layer 7: Foreground (120%) -----------------------------------
    const foreground = scene.add.group();
    for (let x = -100; x < levelWidth + 100; x += 260) {
      const img = scene.add.image(x, levelHeight + 6, 'foreground_leaves')
        .setOrigin(0, 1)
        .setScrollFactor(P.FOREGROUND)
        .setDepth(D.FOREGROUND)
        .setAlpha(0.95);
      foreground.add(img);
    }
    this.layers.foreground = foreground;
  }

  /** Call from scene update() to drift clouds slowly regardless of camera. */
  update(delta) {
    if (this.layers.sky) this.layers.sky.tilePositionX += 0.01 * delta * 0.02;
  }
}
