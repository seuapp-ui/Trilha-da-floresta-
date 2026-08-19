import { UI } from '../modules/UI.js';
import { Save } from '../modules/Save.js';
import { getLevelList } from '../config/LevelData.js';
import { GameConfig } from '../config/GameConfig.js';

/**
 * LevelSelectScene — pick an unlocked phase of Mundo 1.
 */
export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelect');
  }

  create() {
    const { width, height } = this.scale;
    const save = Save.load();
    const levels = getLevelList();

    if (!this.game.registry.get('webgpuSky')) {
      this.add.image(width / 2, height / 2, 'sky').setDisplaySize(width, height);
    }
    this.add.image(width / 2, height - 50, 'mountain').setDisplaySize(width + 40, 200).setAlpha(0.75);
    this.add.rectangle(0, 0, width, height, 0x0a1a10, 0.35).setOrigin(0);

    UI.title(this, width / 2, 48, 'Selecionar Fase', '36px');
    this.add.text(width / 2, 88, 'Mundo 1 — Floresta', {
      fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#c8e8d0',
    }).setOrigin(0.5);

    const cardW = 240;
    const gap = 28;
    const totalW = levels.length * cardW + (levels.length - 1) * gap;
    let startX = width / 2 - totalW / 2 + cardW / 2;
    const cardY = height * 0.48;

    levels.forEach((level, idx) => {
      const unlocked = save.unlockedLevels.includes(level.id);
      const stars = Save.getStars(level.id);
      const x = startX + idx * (cardW + gap);

      const bg = this.add.rectangle(x, cardY, cardW, 220, unlocked ? 0x1e3a28 : 0x1a1a1a, 0.92)
        .setStrokeStyle(2, unlocked ? 0x4fa35a : 0x444444);

      this.add.text(x, cardY - 78, `Fase ${level.index}`, {
        fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#a0c8a8',
      }).setOrigin(0.5);

      this.add.text(x, cardY - 52, level.name, {
        fontFamily: 'Arial, sans-serif', fontSize: '15px', color: '#ffffff',
        fontStyle: 'bold', wordWrap: { width: cardW - 24 }, align: 'center',
      }).setOrigin(0.5);

      // stars
      const starGap = 28;
      const starStart = x - starGap;
      for (let s = 0; s < 3; s++) {
        const key = unlocked && s < stars ? 'star_full' : 'star_empty';
        this.add.image(starStart + s * starGap, cardY - 8, key).setScale(0.65);
      }

      if (unlocked) {
        const btn = UI.button(this, x, cardY + 70, 'Jogar', () => this._play(level.id), {
          width: 160, height: 44, fontSize: '18px',
        });
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerdown', () => this._play(level.id));
      } else {
        this.add.text(x, cardY + 70, '🔒 Bloqueada', {
          fontFamily: 'Arial, sans-serif', fontSize: '16px', color: '#888888',
        }).setOrigin(0.5);
        this.add.text(x, cardY + 95, 'Complete a anterior', {
          fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#666666',
        }).setOrigin(0.5);
      }
    });

    UI.button(this, width / 2, height - 48, 'Voltar', () => {
      this.scene.start('Menu');
    }, { width: 180, color: 0x8a5a2b, hoverColor: 0xa06e34 });
  }

  _play(levelId) {
    this.cameras.main.fadeOut(250, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Game', { levelId });
    });
  }
}
