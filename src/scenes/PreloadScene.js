import { TextureGenerator } from '../utils/TextureGenerator.js';

/**
 * PreloadScene.js
 * -----------------------------------------------------------------------
 * Generates every texture used by the game (see TextureGenerator) and
 * registers shared Phaser animations. This is also where real asset
 * loading (this.load.image / this.load.audio) would go if/when the
 * procedural art is swapped for hand-made sprites - nothing downstream
 * needs to change since consumers only ever refer to texture *keys*.
 * -----------------------------------------------------------------------
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    const { width, height } = this.scale;
    const barBg = this.add.rectangle(width / 2, height / 2, 320, 22, 0x333333);
    const bar = this.add.rectangle(width / 2 - 156, height / 2, 4, 16, 0x4fa35a).setOrigin(0, 0.5);
    this.add.text(width / 2, height / 2 - 30, 'Carregando a Floresta...', {
      fontFamily: 'Arial, sans-serif', fontSize: '18px', color: '#ffffff',
    }).setOrigin(0.5);

    // Fake incremental progress while textures generate (generation itself
    // is synchronous and fast, but this gives visual feedback + a hook for
    // future real asset loading).
    this.tweens.add({
      targets: bar,
      width: 312,
      duration: 400,
      onUpdate: () => { barBg; },
    });
  }

  create() {
    new TextureGenerator(this).generateAll();
    this._registerAnimations();
    this.scene.start('Menu');
  }

  _registerAnimations() {
    if (this.anims.exists('coin_spin')) return;

    this.anims.create({
      key: 'coin_spin',
      frames: [{ key: 'coin_0' }, { key: 'coin_1' }, { key: 'coin_0' }, { key: 'coin_1' }],
      frameRate: 4,
      repeat: -1,
    });
  }
}
