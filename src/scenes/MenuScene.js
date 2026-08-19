import { UI } from '../modules/UI.js';
import { Save } from '../modules/Save.js';
import { WORLD_1_LEVEL_1, LEVEL_ORDER, LEVELS } from '../config/LevelData.js';

/**
 * MenuScene — title, totals, continue into level select.
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { width, height } = this.scale;

    if (!this.game.registry.get('webgpuSky')) {
      this.add.image(width / 2, height / 2, 'sky').setDisplaySize(width, height);
    }
    this.add.image(width / 2, height - 60, 'mountain').setDisplaySize(width + 40, 240).setAlpha(0.85);
    this.add.image(width * 0.15, height - 18, 'tree_near_1').setOrigin(0.5, 1).setScale(1.4);
    this.add.image(width * 0.88, height - 18, 'tree_near_2').setOrigin(0.5, 1).setScale(1.55).setFlipX(true);
    this.add.image(width * 0.42, height - 8, 'bush').setOrigin(0.5, 1).setScale(1.25);
    this.add.image(width * 0.62, height - 6, 'bush').setOrigin(0.5, 1).setScale(1.05).setFlipX(true);

    this.add.rectangle(0, 0, width, 50, 0x000000, 0.12).setOrigin(0);
    this.add.rectangle(0, height - 36, width, 36, 0x000000, 0.18).setOrigin(0);

    UI.title(this, width / 2, height * 0.20, 'Trilha da Floresta', '48px');
    this.add.text(width / 2, height * 0.20 + 44, 'Plataforma 2.5D  ·  Mundo 1 — 3 fases', {
      fontFamily: 'Arial, sans-serif', fontSize: '15px', color: '#d0f0d8',
    }).setOrigin(0.5);

    const save = Save.load();
    this.add.text(width / 2, height * 0.34,
      `Moedas: ${save.totalCoins}    Cristais: ${save.totalCrystals}`,
      { fontFamily: 'Arial, sans-serif', fontSize: '15px', color: '#ffffff' }
    ).setOrigin(0.5);

    // Mini progress: stars per level
    const unlocked = save.unlockedLevels || [];
    const rowY = height * 0.44;
    LEVEL_ORDER.forEach((id, i) => {
      const level = LEVELS[id];
      const stars = Save.getStars(id);
      const open = unlocked.includes(id);
      const x = width / 2 - 100 + i * 100;
      this.add.text(x, rowY - 22, `F${level.index}`, {
        fontFamily: 'Arial, sans-serif', fontSize: '12px',
        color: open ? '#c8e8d0' : '#666666',
      }).setOrigin(0.5);
      for (let s = 0; s < 3; s++) {
        const key = open && s < stars ? 'star_full' : 'star_empty';
        this.add.image(x - 20 + s * 20, rowY, key).setScale(0.45);
      }
    });

    UI.button(this, width / 2, height * 0.58, 'Jogar', () => this._continue(), { width: 240 });
    UI.button(this, width / 2, height * 0.70, 'Selecionar Fase', () => {
      this.scene.start('LevelSelect');
    }, { width: 240, color: 0x2e6b3b, hoverColor: 0x3f8f4f });
    UI.button(this, width / 2, height * 0.82, 'Como Jogar', () => this._toggleHelp(), {
      width: 240, color: 0x8a5a2b, hoverColor: 0xa06e34,
    });

    this.helpText = this.add.text(width / 2, height * 0.93,
      'Setas/WASD: mover   Shift: correr   Espaço: pular\nX/J: ataque giratório   Toque em dispositivos móveis',
      { fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#ffffff', align: 'center' }
    ).setOrigin(0.5).setAlpha(0);

    this.input.keyboard?.once('keydown-ENTER', () => this._continue());
  }

  _toggleHelp() {
    this.tweens.add({ targets: this.helpText, alpha: this.helpText.alpha > 0 ? 0 : 1, duration: 200 });
  }

  /** Continue from the furthest unlocked level (or first). */
  _continue() {
    const save = Save.load();
    let startId = WORLD_1_LEVEL_1.id;
    for (let i = LEVEL_ORDER.length - 1; i >= 0; i--) {
      if (save.unlockedLevels.includes(LEVEL_ORDER[i])) {
        startId = LEVEL_ORDER[i];
        break;
      }
    }
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Game', { levelId: startId });
    });
  }
}
