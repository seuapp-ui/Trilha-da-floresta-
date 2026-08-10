import { UI } from '../modules/UI.js';
import { Save } from '../modules/Save.js';
import { LEVELS, LEVEL_ORDER } from '../config/LevelData.js';

/**
 * MenuScene.js
 * -----------------------------------------------------------------------
 * Title + Mundo 1 level select. Locked stages show a padlock until the
 * previous level is cleared. Stars reflect the best run saved locally.
 * -----------------------------------------------------------------------
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, 'sky').setDisplaySize(width, height);
    this.add.image(width / 2, height - 70, 'mountain').setDisplaySize(width, 200).setAlpha(0.85);
    this.add.image(width * 0.12, height - 30, 'tree_near_1').setOrigin(0.5, 1).setScale(1.15);
    this.add.image(width * 0.9, height - 30, 'tree_near_2').setOrigin(0.5, 1).setScale(1.35).setFlipX(true);

    UI.title(this, width / 2, 36, 'Trilha da Floresta', '40px');
    this.add.text(width / 2, 72, 'Mundo 1 — A Floresta', {
      fontFamily: 'Arial, sans-serif', fontSize: '15px', color: '#eafff0',
    }).setOrigin(0.5);

    const save = Save.load();
    this.add.text(width / 2, 98,
      `Moedas: ${save.totalCoins}   ·   Cristais: ${save.totalCrystals}`,
      { fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#d0f0d8' }
    ).setOrigin(0.5);

    this.add.text(width / 2, 128, 'Escolha a fase', {
      fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);

    this._buildLevelSelect(width, height, save);

    UI.button(this, width / 2, height - 36, 'Como Jogar', () => this._toggleHelp(), {
      width: 180, height: 40, fontSize: '16px', color: 0x8a5a2b, hoverColor: 0xa06e34,
    });

    this.helpText = this.add.text(width / 2, height - 78,
      'Setas/WASD mover · Shift correr · Espaço pular · X/J ataque\nNo celular use os botões na tela (multitoque)',
      { fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#ffffff', align: 'center' }
    ).setOrigin(0.5).setAlpha(0).setDepth(50);
  }

  _buildLevelSelect(width, height, save) {
    const panelW = Math.min(460, width - 32);
    const rowH = 70;
    const startY = 170;
    const icons = { w1_l1: '🌳', w1_l2: '🌊', w1_l3: '🪨', w1_l4: '🌙', w1_l5: '👑' };

    LEVEL_ORDER.forEach((id, index) => {
      const level = LEVELS[id];
      const unlocked = save.unlockedLevels.includes(id);
      const stars = Save.getStars(id);
      const y = startY + index * rowH;

      // Card background
      const bg = this.add.rectangle(width / 2, y, panelW, 58,
        unlocked ? 0x1e4d2b : 0x2a2a2a, unlocked ? 0.92 : 0.6)
        .setStrokeStyle(2, unlocked ? 0x5ecf7a : 0x555555);

      // Phase number badge
      const badge = this.add.circle(width / 2 - panelW / 2 + 28, y, 16,
        unlocked ? 0x3f8f4f : 0x444444, 1);
      this.add.text(width / 2 - panelW / 2 + 28, y, `${index + 1}`, {
        fontFamily: 'Arial, sans-serif', fontSize: '16px', color: '#ffffff', fontStyle: 'bold',
      }).setOrigin(0.5);

      const icon = icons[id] || '🗺️';
      const title = unlocked ? `${icon}  ${level.name}` : `🔒  ${level.name}`;
      this.add.text(width / 2 - panelW / 2 + 52, y - 8, title, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '17px',
        color: unlocked ? '#ffffff' : '#888888',
        fontStyle: 'bold',
      }).setOrigin(0, 0.5);

      // Subtitle
      const sub = unlocked
        ? (stars > 0 ? `Melhor: ${stars}/3 estrelas` : 'Toque para jogar')
        : 'Complete a fase anterior';
      this.add.text(width / 2 - panelW / 2 + 52, y + 14, sub, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        color: unlocked ? '#b8e0c0' : '#777777',
      }).setOrigin(0, 0.5);

      // Stars on the right
      const starX0 = width / 2 + panelW / 2 - 90;
      for (let s = 0; s < 3; s++) {
        const key = unlocked && s < stars ? 'star_full' : 'star_empty';
        this.add.image(starX0 + s * 28, y, key)
          .setScale(0.58)
          .setAlpha(unlocked ? 1 : 0.3);
      }

      if (unlocked) {
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerover', () => {
          bg.setFillStyle(0x2e6b3b, 1);
          bg.setStrokeStyle(2, 0x8dff9a);
        });
        bg.on('pointerout', () => {
          bg.setFillStyle(0x1e4d2b, 0.92);
          bg.setStrokeStyle(2, 0x5ecf7a);
        });
        bg.on('pointerdown', () => this._startLevel(id));
      }
    });
  }

  _toggleHelp() {
    this.tweens.add({
      targets: this.helpText,
      alpha: this.helpText.alpha > 0 ? 0 : 1,
      duration: 200,
    });
  }

  _startLevel(levelId) {
    this.cameras.main.fadeOut(280, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Game', { levelId });
    });
  }
}
