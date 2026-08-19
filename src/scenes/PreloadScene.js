import { TextureGenerator } from '../utils/TextureGenerator.js';
import { WasmMath } from '../wasm/WasmBridge.js';

/**
 * PreloadScene.js
 * -----------------------------------------------------------------------
 * Generates every texture used by the game (see TextureGenerator) and
 * registers shared Phaser animations. Also boots the WebAssembly math
 * module (with automatic JS fallback) before handing off to Menu.
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

    this._progressBar = bar;
    this.tweens.add({
      targets: bar,
      width: 312,
      duration: 500,
    });
  }

  async create() {
    new TextureGenerator(this).generateAll();
    this._registerAnimations();

    try {
      await WasmMath.init();
      if (this._progressBar) this._progressBar.width = 312;
    } catch (e) {
      console.warn('[Preload] WasmMath init failed:', e);
    }

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
