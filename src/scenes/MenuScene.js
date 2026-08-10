import { UI } from '../modules/UI.js';
import { Save } from '../modules/Save.js';
import { WORLD_1_LEVEL_1 } from '../config/LevelData.js';

/**
 * MenuScene.js
 * -----------------------------------------------------------------------
 * Landing screen. Shows the game title, a forest backdrop (reusing
 * generated textures), best-run summary from Save, and the Start button.
 * -----------------------------------------------------------------------
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, 'sky').setDisplaySize(width, height);
    this.add.image(width / 2, height - 80, 'mountain').setDisplaySize(width, 220).setAlpha(0.8);
    this.add.image(width * 0.2, height - 40, 'tree_near_1').setOrigin(0.5, 1).setScale(1.3);
    this.add.image(width * 0.85, height - 40, 'tree_near_2').setOrigin(0.5, 1).setScale(1.5).setFlipX(true);

    UI.title(this, width / 2, height * 0.28, 'Trilha da Floresta', '48px');
    this.add.text(width / 2, height * 0.28 + 46, 'um plataforma 2.5D', {
      fontFamily: 'Arial, sans-serif', fontSize: '18px', color: '#eafff0',
    }).setOrigin(0.5);

    const save = Save.load();
    this.add.text(width / 2, height * 0.40,
      `Moedas totais: ${save.totalCoins}   Cristais totais: ${save.totalCrystals}`,
      { fontFamily: 'Arial, sans-serif', fontSize: '16px', color: '#ffffff' }
    ).setOrigin(0.5);

    // Best stars for the current (only) level
    const levelId = WORLD_1_LEVEL_1.id;
    const bestStars = Save.getStars(levelId);
    const starY = height * 0.48;
    const gap = 36;
    const startX = width / 2 - gap;
    for (let i = 0; i < 3; i++) {
      const key = i < bestStars ? 'star_full' : 'star_empty';
      this.add.image(startX + i * gap, starY, key).setScale(0.85);
    }
    if (bestStars > 0) {
      this.add.text(width / 2, starY + 28, `Melhor: ${bestStars}/3 estrelas`, {
        fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#c8e8d0',
      }).setOrigin(0.5);
    }

    UI.button(this, width / 2, height * 0.62, 'Jogar', () => this._startGame(), { width: 240 });
    UI.button(this, width / 2, height * 0.74, 'Como Jogar', () => this._toggleHelp(), { width: 240, color: 0x8a5a2b, hoverColor: 0xa06e34 });

    this.helpText = this.add.text(width / 2, height * 0.86,
      'Setas/WASD: mover   Shift: correr   Espaço: pular (segure p/ pular mais alto)\nX/J: ataque giratório   Toque na tela em dispositivos móveis',
      { fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#ffffff', align: 'center' }
    ).setOrigin(0.5).setAlpha(0);

    this.input.keyboard?.once('keydown-ENTER', () => this._startGame());
  }

  _toggleHelp() {
    this.tweens.add({ targets: this.helpText, alpha: this.helpText.alpha > 0 ? 0 : 1, duration: 200 });
  }

  _startGame() {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Game', { levelId: WORLD_1_LEVEL_1.id });
    });
  }
}
