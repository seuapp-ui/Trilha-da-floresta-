/**
 * BootScene.js
 * -----------------------------------------------------------------------
 * First scene to run. Sets up global renderer settings and immediately
 * hands off to PreloadScene. Kept separate from Preload so future asset
 * manifests / remote config fetches have an obvious home.
 * -----------------------------------------------------------------------
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1a1a1a');
    this.scene.start('Preload');
  }
}
