import { UI } from '../modules/UI.js';
import { Save, computeStars } from '../modules/Save.js';
import { getNextLevelId, LEVELS } from '../config/LevelData.js';

/**
 * LevelCompleteScene.js
 * -----------------------------------------------------------------------
 * Results screen shown after the player enters the end-of-level portal.
 * Computes and displays 1–3 stars, saves the best rating, and offers
 * replay or return to menu.
 *
 * Star rules (additive — see computeStars in Save.js):
 *   ★     — finish the level
 *   +★    — collect every crystal
 *   +★    — finish without taking any damage
 * -----------------------------------------------------------------------
 */
export class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super('LevelComplete');
  }

  init(data) {
    this.levelId = data.levelId;
    this.coins = data.coins || 0;
    this.crystals = data.crystals || 0;
    this.timeMs = data.timeMs || 0;
    this.totalCoins = data.totalCoins || 0;
    this.totalCrystals = data.totalCrystals || 0;
    this.noDamage = !!data.noDamage;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#0f2a17');
    this.cameras.main.fadeIn(300);

    UI.title(this, width / 2, height * 0.14, 'Fase Completa!', '42px');

    // ---- stars -------------------------------------------------------
    this.starsEarned = computeStars({
      coins: this.coins,
      crystals: this.crystals,
      totalCoins: this.totalCoins,
      totalCrystals: this.totalCrystals,
      noDamage: this.noDamage,
    });

    Save.recordLevelResult(this.levelId, {
      coins: this.coins,
      crystals: this.crystals,
      timeMs: this.timeMs,
      stars: this.starsEarned,
    });

    // Unlock the next phase in the world
    this.nextId = getNextLevelId(this.levelId);
    if (this.nextId) Save.unlockLevel(this.nextId);

    const levelName = LEVELS[this.levelId]?.name || this.levelId;
    this.add.text(width / 2, height * 0.20, levelName, {
      fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#b8e0c0',
    }).setOrigin(0.5);

    this._drawStars(width / 2, height * 0.28, this.starsEarned);

    const hint = this._starHint();
    this.add.text(width / 2, height * 0.36, hint, {
      fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#b8e0c0',
      align: 'center',
    }).setOrigin(0.5);

    // ---- stats -------------------------------------------------------
    const seconds = (this.timeMs / 1000).toFixed(1);
    const coinPct = this.totalCoins > 0
      ? Math.round((this.coins / this.totalCoins) * 100)
      : 100;
    const crystalPct = this.totalCrystals > 0
      ? Math.round((this.crystals / this.totalCrystals) * 100)
      : 100;

    const damageLabel = this.noDamage ? '✓ Sem dano' : '✗ Tomou dano';
    const damageColor = this.noDamage ? '#7dff9a' : '#ff9a7d';

    const stats = [
      `⏱  Tempo: ${seconds}s`,
      `🪙  Moedas: ${this.coins} / ${this.totalCoins}  (${coinPct}%)`,
      `💎  Cristais: ${this.crystals} / ${this.totalCrystals}  (${crystalPct}%)`,
    ];
    stats.forEach((line, i) => {
      this.add.text(width / 2, height * 0.42 + i * 26, line, {
        fontFamily: 'Arial, sans-serif', fontSize: '18px', color: '#ffffff',
      }).setOrigin(0.5);
    });

    this.add.text(width / 2, height * 0.42 + 3 * 26, damageLabel, {
      fontFamily: 'Arial, sans-serif', fontSize: '18px', color: damageColor,
    }).setOrigin(0.5);

    let by = height * 0.70;
    if (this.nextId) {
      UI.button(this, width / 2, by, 'Próxima Fase →', () => {
        this.scene.start('Game', { levelId: this.nextId });
      }, { width: 260 });
      by += 58;
    }
    UI.button(this, width / 2, by, 'Jogar Novamente', () => {
      this.scene.start('Game', { levelId: this.levelId });
    }, { width: 260, color: 0x2e6b3b, hoverColor: 0x3f8f4f });
    by += 58;
    UI.button(this, width / 2, by, 'Menu Principal', () => {
      this.scene.start('Menu');
    }, { width: 260, color: 0x8a5a2b, hoverColor: 0xa06e34 });
  }

  _drawStars(cx, cy, earned) {
    const gap = 48;
    const startX = cx - gap;
    for (let i = 0; i < 3; i++) {
      const key = i < earned ? 'star_full' : 'star_empty';
      const star = this.add.image(startX + i * gap, cy, key).setScale(0);
      this.tweens.add({
        targets: star,
        scale: 1.15,
        duration: 280,
        delay: 180 + i * 160,
        ease: 'Back.easeOut',
        onComplete: () => {
          this.tweens.add({ targets: star, scale: 1, duration: 120 });
        },
      });
    }
  }

  _starHint() {
    const allCrystals = this.totalCrystals <= 0 || this.crystals >= this.totalCrystals;

    if (this.starsEarned >= 3) {
      return 'Perfeito! Cristais + sem dano — você mandou bem!';
    }
    if (!allCrystals && !this.noDamage) {
      return `Faltam cristais (${this.crystals}/${this.totalCrystals}) e você tomou dano.`;
    }
    if (!allCrystals) {
      return `Ache todos os ${this.totalCrystals} cristais para +1 estrela.`;
    }
    if (!this.noDamage) {
      return 'Complete sem tomar dano para a 3ª estrela.';
    }
    return 'Fase concluída!';
  }
}
