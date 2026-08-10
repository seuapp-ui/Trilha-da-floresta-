import { UI } from '../modules/UI.js';

/**
 * GameOverScene.js
 * -----------------------------------------------------------------------
 * Simple end state shown when the player's health reaches zero. Offers
 * retrying the same level (from its last checkpoint is handled by
 * GameScene re-initializing fresh, per design keeping death simple/fair)
 * or returning to the main menu.
 * -----------------------------------------------------------------------
 */
export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init(data) {
    this.levelId = data.levelId;
    this.coins = data.coins || 0;
    this.crystals = data.crystals || 0;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#1a1210');

    UI.title(this, width / 2, height * 0.32, 'Você Caiu...', '44px');
    this.add.text(width / 2, height * 0.44, `Moedas coletadas: ${this.coins}   Cristais: ${this.crystals}`, {
      fontFamily: 'Arial, sans-serif', fontSize: '18px', color: '#ffffff',
    }).setOrigin(0.5);

    UI.button(this, width / 2, height * 0.6, 'Tentar Novamente', () => {
      this.scene.start('Game', { levelId: this.levelId });
    });
    UI.button(this, width / 2, height * 0.72, 'Menu Principal', () => {
      this.scene.start('Menu');
    }, { color: 0x8a5a2b, hoverColor: 0xa06e34 });
  }
}
