import { GameConfig } from '../config/GameConfig.js';
import { EventBus, EVENTS } from '../utils/EventBus.js';

/**
 * HUD.js
 * -----------------------------------------------------------------------
 * Renders lives (hearts), coin count and crystal count in the top-left
 * of the screen. Lives in UIScene (a separate overlay scene with
 * scrollFactor-independent camera) and updates reactively via EventBus
 * so GameScene never needs a direct reference to it.
 * -----------------------------------------------------------------------
 */
export class HUD {
  constructor(scene, { maxHealth, coins = 0, crystals = 0 }) {
    this.scene = scene;
    this.maxHealth = maxHealth;
    this.hearts = [];
    this._buildHearts(maxHealth);
    this._buildCounters(coins, crystals);

    EventBus.on(EVENTS.HEALTH_CHANGED, this.setHealth, this);
    EventBus.on(EVENTS.COINS_CHANGED, this.setCoins, this);
    EventBus.on(EVENTS.CRYSTALS_CHANGED, this.setCrystals, this);

    scene.events.once('shutdown', () => this._unbind());
    scene.events.once('destroy', () => this._unbind());
  }

  _unbind() {
    EventBus.off(EVENTS.HEALTH_CHANGED, this.setHealth, this);
    EventBus.off(EVENTS.COINS_CHANGED, this.setCoins, this);
    EventBus.off(EVENTS.CRYSTALS_CHANGED, this.setCrystals, this);
  }

  _buildHearts(count) {
    for (let i = 0; i < count; i++) {
      const heart = this.scene.add.image(22 + i * 28, 22, 'heart')
        .setScrollFactor(0)
        .setDepth(GameConfig.DEPTH.HUD)
        .setScale(1.15);
      this.hearts.push(heart);
    }
  }

  _buildCounters(coins, crystals) {
    const style = {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#00000090',
      strokeThickness: 4,
    };

    this.coinIcon = this.scene.add.image(22, 56, 'icon_coin')
      .setScrollFactor(0)
      .setDepth(GameConfig.DEPTH.HUD)
      .setScale(1.1);
    this.coinText = this.scene.add.text(40, 46, `${coins}`, style)
      .setScrollFactor(0)
      .setDepth(GameConfig.DEPTH.HUD);

    this.crystalIcon = this.scene.add.image(22, 86, 'icon_crystal')
      .setScrollFactor(0)
      .setDepth(GameConfig.DEPTH.HUD)
      .setScale(1.05);
    this.crystalText = this.scene.add.text(40, 76, `${crystals}`, style)
      .setScrollFactor(0)
      .setDepth(GameConfig.DEPTH.HUD);
  }

  setHealth(health) {
    this.hearts.forEach((h, i) => h.setTexture(i < health ? 'heart' : 'heart_empty'));
  }

  setCoins(count) {
    if (this.coinText) this.coinText.setText(`${count}`);
  }

  setCrystals(count) {
    if (this.crystalText) this.crystalText.setText(`${count}`);
  }
}
