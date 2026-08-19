import { GameConfig } from '../config/GameConfig.js';
import { LEVELS } from '../config/LevelData.js';
import { Map } from '../modules/Map.js';
import { Parallax } from '../modules/Parallax.js';
import { Player } from '../modules/Player.js';
import { EnemyManager } from '../modules/EnemyManager.js';
import { Collectibles } from '../modules/Collectibles.js';
import { CheckpointManager } from '../modules/Checkpoint.js';
import { Hazards } from '../modules/Hazards.js';
import { CameraManager } from '../modules/CameraManager.js';
import { ParticlesManager } from '../modules/Particles.js';
import { AudioManager } from '../modules/Audio.js';
import { Save } from '../modules/Save.js';
import { EventBus, EVENTS } from '../utils/EventBus.js';

/**
 * GameScene.js
 * -----------------------------------------------------------------------
 * Orchestrates a single playable level. Reads level data by id (so this
 * class never changes when new levels are added), builds every module,
 * wires colliders/overlaps between them, and drives the per-frame loop.
 * All actual gameplay behaviour is delegated to the relevant module.
 * -----------------------------------------------------------------------
 */
export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init(data) {
    this.levelId = data.levelId || 'w1_l1';
    this.levelData = LEVELS[this.levelId];
  }

  create() {
    const level = this.levelData;
    this.physics.world.setBounds(0, 0, level.levelWidth, level.levelHeight);

    this.audio = new AudioManager(this);
    this.particles = new ParticlesManager(this);

    this.parallax = new Parallax(this, level.levelWidth, level.levelHeight);
    this.map = new Map(this, level);

    this.runState = { coins: 0, crystals: 0, startTime: this.time.now, tookDamage: false };

    this.player = new Player(this, level.playerStart.x, level.playerStart.y, {
      particles: this.particles,
      audio: this.audio,
    });
    this.player.onDeath = () => this._onPlayerDeath();
    this.player.onDamage = (hp) => EventBus.emit(EVENTS.HEALTH_CHANGED, hp);
    this.player.onTookDamage = () => { this.runState.tookDamage = true; };

    this.enemyManager = new EnemyManager(this, level, { particles: this.particles, audio: this.audio });
    this.collectibles = new Collectibles(this, level, this.particles, this.audio);
    this.checkpoints = new CheckpointManager(this, level, this.audio);
    this.hazards = new Hazards(this, level, { audio: this.audio });

    this.cameraManager = new CameraManager(this, this.player.sprite, level.levelWidth, level.levelHeight);

    this._buildPortal();
    this._setupColliders();
    this._setupInput();

    this.scene.launch('UI', { maxHealth: this.player.maxHealth });
    this.audio.playMusic('music_level1');

    this.levelComplete = false;
    this.cameras.main.fadeIn(400);

    EventBus.emit(EVENTS.HEALTH_CHANGED, this.player.health);
    EventBus.emit(EVENTS.COINS_CHANGED, this.runState.coins);
    EventBus.emit(EVENTS.CRYSTALS_CHANGED, this.runState.crystals);
  }

  _buildPortal() {
    const p = this.levelData.portal;
    this.portal = this.physics.add.staticSprite(p.x, p.y, 'portal_0');
    this.portal.setDepth(GameConfig.DEPTH.MAIN_TERRAIN + 1);
    this.tweens.add({ targets: this.portal, alpha: 0.7, duration: 500, yoyo: true, repeat: -1 });
    this.time.addEvent({
      delay: 260,
      loop: true,
      callback: () => {
        if (!this.portal.active) return;
        this.portal.setTexture(this.portal.texture.key === 'portal_0' ? 'portal_1' : 'portal_0');
      },
    });
  }

  _setupColliders() {
    const { player, map, enemyManager, collectibles, checkpoints, hazards, portal } = this;

    this.physics.add.collider(player.sprite, map.groundGroup);
    this.physics.add.collider(player.sprite, map.platformGroup);
    this.physics.add.collider(enemyManager.getSprites(), map.groundGroup);
    this.physics.add.collider(enemyManager.getSprites(), map.platformGroup);
    this.physics.add.collider(hazards.group, map.groundGroup);
    this.physics.add.collider(hazards.group, map.platformGroup);
    this.physics.add.collider(hazards.rockGroup, map.groundGroup);
    this.physics.add.collider(hazards.rockGroup, map.platformGroup);

    // spikes -> damage
    this.physics.add.overlap(player.sprite, map.spikeGroup, () => {
      this.player.takeDamage(this.time.now, player.sprite.x);
    });

    // water -> instant respawn (fall hazard)
    if (map.waterZone) {
      this.physics.add.overlap(player.sprite, map.waterZone, () => {
        this.particles.splash(player.sprite.x, player.sprite.y);
        this.player.takeDamage(this.time.now, player.sprite.x);
        if (!player.isDead) this._respawnAtCheckpoint();
      });
    }

    // falling logs / rolling rocks -> damage
    this.physics.add.overlap(player.sprite, hazards.group, () => {
      this.player.takeDamage(this.time.now, player.sprite.x);
    });
    this.physics.add.overlap(player.sprite, hazards.rockGroup, () => {
      this.player.takeDamage(this.time.now, player.sprite.x);
    });

    // crates: spin attack breaks them; also breakable by landing on top
    this.physics.add.collider(player.sprite, collectibles.crates, (playerSprite, crate) => {
      if (this.player.isAttackActive(this.time.now)) {
        this._collectLoot(collectibles.breakCrate(crate));
      } else if (playerSprite.body.velocity.y > 0 && playerSprite.body.bottom <= crate.body.top + 10) {
        this._collectLoot(collectibles.breakCrate(crate));
        playerSprite.body.setVelocityY(-200);
      }
    });

    // coins / crystals
    this.physics.add.overlap(player.sprite, collectibles.coins, (_p, coin) => {
      collectibles.collectCoin(coin);
      this.runState.coins += 1;
      EventBus.emit(EVENTS.COINS_CHANGED, this.runState.coins);
    });
    this.physics.add.overlap(player.sprite, collectibles.crystals, (_p, crystal) => {
      collectibles.collectCrystal(crystal);
      this.runState.crystals += 1;
      EventBus.emit(EVENTS.CRYSTALS_CHANGED, this.runState.crystals);
    });
    if (collectibles.lifePickups) {
      this.physics.add.overlap(player.sprite, collectibles.lifePickups, (_p, heart) => {
        heart.destroy();
        this.player.heal(1);
        this.audio.playSfx('crystal');
      });
    }

    // checkpoints
    this.physics.add.overlap(player.sprite, checkpoints.group, (_p, flag) => {
      if (checkpoints.activate(flag)) {
        this.runState.checkpointCoins = this.runState.coins;
        this.runState.checkpointCrystals = this.runState.crystals;
      }
    });

    // portal -> level complete
    this.physics.add.overlap(player.sprite, portal, () => this._onLevelComplete());

    // enemies vs player: stomp or spin-attack defeats, otherwise damages player
    this.physics.add.overlap(player.sprite, enemyManager.getSprites(), (playerSprite, enemySprite) => {
      const enemy = enemyManager.findBySprite(enemySprite);
      if (!enemy || enemy.defeated) return;

      const now = this.time.now;
      const isStomp = playerSprite.body.velocity.y > 0 && playerSprite.body.bottom <= enemySprite.body.top + 14;

      if (this.player.isAttackActive(now)) {
        enemy.defeat(false);
        this.particles.attackSwirl(enemySprite.x, enemySprite.y);
      } else if (isStomp) {
        enemy.defeat(true);
        this.player.bounceFromStomp();
        this.particles.landPoof(enemySprite.x, enemySprite.y);
      } else {
        this.player.takeDamage(now, enemySprite.x);
      }
    });
  }

  _collectLoot(loot) {
    if (loot === 'coin') {
      this.runState.coins += 1;
      EventBus.emit(EVENTS.COINS_CHANGED, this.runState.coins);
    } else if (loot === 'crystal') {
      this.runState.crystals += 1;
      EventBus.emit(EVENTS.CRYSTALS_CHANGED, this.runState.crystals);
    }
  }

  _setupInput() {
    const kb = this.input.keyboard;
    this.keys = kb.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      attackX: Phaser.Input.Keyboard.KeyCodes.X,
      attackJ: Phaser.Input.Keyboard.KeyCodes.J,
      esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    kb.on('keydown-SPACE', () => this.player.handleJumpPressed(this.time.now));
    kb.on('keydown-UP', () => this.player.handleJumpPressed(this.time.now));
    kb.on('keydown-W', () => this.player.handleJumpPressed(this.time.now));
    kb.on('keyup-SPACE', () => this.player.handleJumpReleased());
    kb.on('keyup-UP', () => this.player.handleJumpReleased());
    kb.on('keyup-W', () => this.player.handleJumpReleased());
    kb.on('keydown-X', () => this.player.tryAttack(this.time.now));
    kb.on('keydown-J', () => this.player.tryAttack(this.time.now));
    kb.on('keydown-ESC', () => this._togglePause());

    // Virtual/touch input flags, set by UIScene's on-screen controls.
    this.touchInput = { left: false, right: false, run: false, jumpPressed: false, jumpReleased: false, attack: false };

    // EventBus is a global singleton that outlives this scene instance, so
    // every listener registered on it must be explicitly removed on
    // shutdown - otherwise restarting the level (retry / replay) stacks
    // duplicate listeners that call into destroyed player/scene objects.
    this._onTouchInput = (state) => Object.assign(this.touchInput, state);
    this._onTouchJumpDown = () => this.player.handleJumpPressed(this.time.now);
    this._onTouchJumpUp = () => this.player.handleJumpReleased();
    this._onTouchAttack = () => this.player.tryAttack(this.time.now);
    this._onPauseToggle = () => this._togglePause();

    EventBus.on('touch-input', this._onTouchInput);
    EventBus.on('touch-jump-down', this._onTouchJumpDown);
    EventBus.on('touch-jump-up', this._onTouchJumpUp);
    EventBus.on('touch-attack', this._onTouchAttack);
    EventBus.on('pause-toggle', this._onPauseToggle);

    this.events.once('shutdown', () => this._cleanupEventBus());
    this.events.once('destroy', () => this._cleanupEventBus());
  }

  _cleanupEventBus() {
    EventBus.off('touch-input', this._onTouchInput);
    EventBus.off('touch-jump-down', this._onTouchJumpDown);
    EventBus.off('touch-jump-up', this._onTouchJumpUp);
    EventBus.off('touch-attack', this._onTouchAttack);
    EventBus.off('pause-toggle', this._onPauseToggle);
  }

  _togglePause() {
    if (this.scene.isPaused('Game')) {
      this.scene.resume('Game');
      EventBus.emit('game-paused', false);
    } else {
      this.scene.pause('Game');
      EventBus.emit('game-paused', true);
    }
  }

  _readInput() {
    const k = this.keys;
    return {
      left: k.left.isDown || k.a.isDown || this.touchInput.left,
      right: k.right.isDown || k.d.isDown || this.touchInput.right,
      run: k.shift.isDown || this.touchInput.run,
    };
  }

  update(time, delta) {
    if (this.levelComplete) return;

    const input = this._readInput();
    this.player.update(time, delta, input, this.map);
    this.enemyManager.update(time, delta, this.player);
    this.hazards.update(time, delta, this.player.sprite.x);
    this.parallax.update(delta);

    // fell out of the world -> treat as damage + respawn (unless that
    // damage already killed them, in which case _onPlayerDeath already
    // handles the respawn via its own fade sequence - avoid double-respawn)
    if (this.player.sprite.y > this.levelData.groundY + 400 && !this.player.isDead) {
      this.player.takeDamage(time, this.player.sprite.x);
      if (!this.player.isDead) this._respawnAtCheckpoint();
    }
  }

  _respawnAtCheckpoint() {
    const spawn = this.checkpoints.getActiveSpawn(this.levelData.playerStart);
    this.player.respawn(spawn.x, spawn.y);
    EventBus.emit(EVENTS.PLAYER_RESPAWNED);
  }

  _onPlayerDeath() {
    // Per design: dying respawns the player at the last checkpoint (or the
    // level start if none was reached yet) with health refilled - there is
    // no permadeath / Game Over screen for a single level. A short shake +
    // fade gives the moment weight before control returns to the player.
    this.cameraManager.shake(220, 0.02);
    this.cameraManager.fadeOut(350, () => {
      this._respawnAtCheckpoint();
      this.cameraManager.fadeIn(350);
    });
  }

  _onLevelComplete() {
    if (this.levelComplete) return;
    this.levelComplete = true;
    this.player.locked = true;
    this.player.body.setVelocity(0, 0);
    this.player.body.setAllowGravity(false);
    // Disable the physics body entirely before tweening the sprite's
    // transform directly - otherwise Arcade Physics re-syncs the sprite
    // position from its (stationary) body every step and the tween
    // below would appear to freeze instead of animating into the portal.
    this.player.body.enable = false;
    this.audio.playSfx('portal');
    this.cameraManager.flash(400, 255, 255, 255);

    const timeMs = this.time.now - this.runState.startTime;
    Save.unlockLevel(this.levelId);
    // Persistence of coins / crystals / stars is done in LevelCompleteScene
    // so we have a single authoritative write with the computed star rating.

    const totals = this.collectibles.getTotals();

    this.tweens.add({
      targets: this.player.sprite,
      alpha: 0,
      scale: 0.4,
      x: this.portal.x,
      y: this.portal.y,
      duration: 700,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.time.delayedCall(200, () => {
          this.scene.stop('UI');
          this.scene.stop('Game');
          this.scene.start('LevelComplete', {
            levelId: this.levelId,
            coins: this.runState.coins,
            crystals: this.runState.crystals,
            timeMs,
            totalCoins: totals.totalCoins,
            totalCrystals: totals.totalCrystals,
            noDamage: !this.runState.tookDamage,
          });
        });
      },
    });
  }
}
