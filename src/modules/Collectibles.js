import { GameConfig } from '../config/GameConfig.js';

/**
 * Collectibles.js
 * -----------------------------------------------------------------------
 * Owns coins, hidden crystals and destructible crates. Overlap/collision
 * wiring against the player happens in GameScene, but all group creation
 * and per-item behaviour (spin animation, crate breaking, loot spawn)
 * lives here to keep GameScene thin.
 * -----------------------------------------------------------------------
 */
export class Collectibles {
  constructor(scene, levelData, particles, audio) {
    this.scene = scene;
    this.data = levelData;
    this.particles = particles;
    this.audio = audio;

    this.coins = scene.physics.add.staticGroup();
    this.crystals = scene.physics.add.staticGroup();
    this.crates = scene.physics.add.staticGroup();
    this.lifePickups = scene.physics.add.staticGroup(); // created upfront so GameScene can register its overlap before any crate breaks

    this._buildCoins();
    this._buildCrystals();
    this._buildCrates();

    // Totals available in this level (used by the star system).
    // Crate loot is included so a perfect run can reach 3★.
    this.totalCoins = (this.data.coins?.length || 0)
      + (this.data.crates || []).filter((c) => c.loot === 'coin').length;
    this.totalCrystals = (this.data.crystals?.length || 0)
      + (this.data.crates || []).filter((c) => c.loot === 'crystal').length;
  }

  /** Snapshot of how many collectibles exist in the level. */
  getTotals() {
    return { totalCoins: this.totalCoins, totalCrystals: this.totalCrystals };
  }

  _buildCoins() {
    const D = GameConfig.DEPTH.COLLECTIBLES;
    this.data.coins.forEach((c) => {
      const coin = this.coins.create(c.x, c.y, 'coin_0');
      coin.setDepth(D);
      coin.play('coin_spin');
    });
  }

  _buildCrystals() {
    const D = GameConfig.DEPTH.COLLECTIBLES;
    this.data.crystals.forEach((c) => {
      const crystal = this.crystals.create(c.x, c.y, 'crystal');
      crystal.setDepth(D);
      this.scene.tweens.add({
        targets: crystal,
        y: c.y - 8,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
  }

  _buildCrates() {
    const D = GameConfig.DEPTH.MAIN_TERRAIN;
    this.data.crates.forEach((c) => {
      const crate = this.crates.create(c.x, c.y, 'crate');
      crate.setDepth(D);
      crate.loot = c.loot;
      crate.refreshBody();
    });
  }

  collectCoin(coinSprite) {
    this.particles.collectSparkle(coinSprite.x, coinSprite.y, 0xffd23f);
    this.audio.playSfx('coin');
    coinSprite.destroy();
  }

  collectCrystal(crystalSprite) {
    this.particles.collectSparkle(crystalSprite.x, crystalSprite.y, 0x5fdff0);
    this.audio.playSfx('crystal');
    crystalSprite.destroy();
  }

  /** Breaks a crate, spawning debris + its loot item. Returns the loot type. */
  breakCrate(crateSprite) {
    const { x, y, loot } = crateSprite;
    this.particles.crateBreak(x, y);
    this.audio.playSfx('break');
    crateSprite.destroy();

    if (loot === 'coin') {
      const coin = this.coins.create(x, y - 10, 'coin_0');
      coin.setDepth(GameConfig.DEPTH.COLLECTIBLES);
      coin.play('coin_spin');
    } else if (loot === 'crystal') {
      const crystal = this.crystals.create(x, y - 10, 'crystal');
      crystal.setDepth(GameConfig.DEPTH.COLLECTIBLES);
    } else if (loot === 'life') {
      const heart = this.lifePickups.create(x, y - 10, 'heart');
      heart.setDepth(GameConfig.DEPTH.COLLECTIBLES);
      heart.refreshBody();
    }
    return loot;
  }
}
