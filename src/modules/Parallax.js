import { GameConfig } from '../config/GameConfig.js';
import { WasmMath } from '../wasm/WasmBridge.js';

/**
 * Parallax.js
 * -----------------------------------------------------------------------
 * Builds the seven parallax layers and assigns each a scrollFactor.
 * Cloud drift is driven by the WebAssembly math module when available.
 * -----------------------------------------------------------------------
 */
export class Parallax {
  constructor(scene, levelWidth, levelHeight) {
    this.scene = scene;
    this.levelWidth = levelWidth;
    this.levelHeight = levelHeight;
    this.layers = {};
    this._cloudSprites = [];
    this._build();
  }

  _build() {
    const { scene, levelWidth, levelHeight } = this;
    const P = GameConfig.PARALLAX;
    const D = GameConfig.DEPTH;

    // When WebGPU procedural sky is active, skip the static texture
    // so the underlay canvas shows through the transparent Phaser clear.
    const useWebGPUSky = scene.game.registry.get('webgpuSky') === true;
    if (!useWebGPUSky) {
      const sky = scene.add.tileSprite(0, 0, levelWidth * 1.5, levelHeight, 'sky')
        .setOrigin(0, 0)
        .setScrollFactor(P.SKY)
        .setDepth(D.SKY);
      this.layers.sky = sky;
    } else {
      this.layers.sky = null;
    }

    const clouds = scene.add.group();
    for (let i = 0; i < 14; i++) {
      const c = scene.add.image(
        Phaser.Math.Between(0, levelWidth * 1.2),
        Phaser.Math.Between(30, 180),
        'cloud'
      ).setScrollFactor(P.CLOUDS).setDepth(D.CLOUDS).setAlpha(0.9);
      c.setScale(Phaser.Math.FloatBetween(0.7, 1.4));
      clouds.add(c);
      this._cloudSprites.push(c);
      if (WasmMath.ready) {
        WasmMath.setCloud(i, c.x, c.scaleX || 1);
      }
    }
    this.layers.clouds = clouds;

    const mountains = scene.add.tileSprite(0, levelHeight - 280, levelWidth * 1.3, 280, 'mountain')
      .setOrigin(0, 0)
      .setScrollFactor(P.MOUNTAINS)
      .setDepth(D.MOUNTAINS)
      .setAlpha(0.95);
    this.layers.mountains = mountains;

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

    const treesNear = scene.add.group();
    for (let x = 0; x < levelWidth * 1.05; x += 220) {
      const img = scene.add.image(x + Phaser.Math.Between(-30, 30), levelHeight - 20, Phaser.Math.RND.pick(['tree_near_1', 'tree_near_2']))
        .setOrigin(0.5, 1)
        .setScrollFactor(P.TREES_NEAR)
        .setDepth(D.TREES_NEAR);
      treesNear.add(img);
    }
    this.layers.treesNear = treesNear;

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

  update(delta) {
    if (this.layers.sky) this.layers.sky.tilePositionX += delta * 0.004;

    const n = this._cloudSprites.length;
    if (n === 0) return;

    if (WasmMath.ready) {
      // Sync → WASM → apply
      for (let i = 0; i < n; i++) {
        WasmMath.setCloud(i, this._cloudSprites[i].x, this._cloudSprites[i].scaleX || 1);
      }
      WasmMath.driftClouds(n, delta, 0.008, -80, this.levelWidth * 1.3);
      for (let i = 0; i < n; i++) {
        this._cloudSprites[i].x = WasmMath.getCloudX(i);
      }
    } else {
      for (let i = 0; i < n; i++) {
        const c = this._cloudSprites[i];
        c.x += delta * 0.008 * (c.scaleX || 1);
        if (c.x > this.levelWidth * 1.3) c.x = -80;
      }
    }
  }
}
