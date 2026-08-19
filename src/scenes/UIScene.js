import { HUD } from '../modules/HUD.js';
import { UI } from '../modules/UI.js';
import { GameConfig } from '../config/GameConfig.js';
import { EventBus } from '../utils/EventBus.js';

/**
 * UIScene.js
 * -----------------------------------------------------------------------
 * Runs in parallel with GameScene (scene.launch, not scene.start) so the
 * HUD and touch controls sit on their own camera, unaffected by world
 * scrolling. Also owns the pause overlay. Communicates with GameScene
 * exclusively through EventBus to keep the two scenes decoupled.
 * -----------------------------------------------------------------------
 */
export class UIScene extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  init(data) {
    this.maxHealth = data.maxHealth || 3;
  }

  create() {
    this.hud = new HUD(this, { maxHealth: this.maxHealth, coins: 0, crystals: 0 });

    this._buildPauseButton();
    this._buildPauseOverlay();
    if (this.sys.game.device.input.touch) this._buildTouchControls();

    this._onGamePaused = (paused) => this._setPauseVisible(paused);
    EventBus.on('game-paused', this._onGamePaused);
    this.events.once('shutdown', () => {
      EventBus.off('game-paused', this._onGamePaused);
    });
  }

  _buildPauseButton() {
    const { width } = this.scale;
    // Keep clear of HUD hearts/coins on the left
    const btn = this.add.text(width - 16, 14, '⏸', {
      fontSize: '26px',
      color: '#ffffff',
      stroke: '#00000080',
      strokeThickness: 4,
    })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(GameConfig.DEPTH.HUD)
      .setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => EventBus.emit('pause-toggle'));
    btn.on('pointerover', () => btn.setAlpha(0.8));
    btn.on('pointerout', () => btn.setAlpha(1));
  }

  _buildPauseOverlay() {
    const { width, height } = this.scale;
    this.pausePanel = this.add.container(0, 0).setDepth(GameConfig.DEPTH.HUD + 10).setVisible(false);
    const bg = UI.panel(this, width / 2, height / 2, width, height, 0.7);
    const title = UI.title(this, width / 2, height / 2 - 90, 'Pausado', '38px');
    const resume = UI.button(this, width / 2, height / 2 - 10, 'Continuar', () => EventBus.emit('pause-toggle'));
    const menu = UI.button(this, width / 2, height / 2 + 60, 'Menu Principal', () => {
      EventBus.emit('pause-toggle');
      this.scene.stop('Game');
      this.scene.stop('UI');
      this.scene.start('Menu');
    }, { color: 0x8a5a2b, hoverColor: 0xa06e34 });
    this.pausePanel.add([bg, title, resume, menu]);
  }

  _setPauseVisible(visible) {
    this.pausePanel.setVisible(visible);
  }

  _buildTouchControls() {
    const { width, height } = this.scale;
    const alpha = 0.5;
    const D = GameConfig.DEPTH.HUD;
    const state = { left: false, right: false, run: false };

    const makeBtn = (x, y, r, label, fontSize = '22px') => {
      const circle = this.add.circle(x, y, r, 0xffffff, alpha)
        .setScrollFactor(0)
        .setDepth(D)
        .setInteractive();
      this.add.text(x, y, label, {
        fontSize,
        color: '#222222',
        fontStyle: 'bold',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(D);
      // Visual feedback
      circle.on('pointerdown', () => circle.setFillStyle(0xffffff, 0.8));
      circle.on('pointerup', () => circle.setFillStyle(0xffffff, alpha));
      circle.on('pointerout', () => circle.setFillStyle(0xffffff, alpha));
      return circle;
    };

    // Left side: movement
    const left = makeBtn(58, height - 68, 36, '◀');
    const right = makeBtn(140, height - 68, 36, '▶');

    // Right side: actions — spaced to avoid overlap
    const jump = makeBtn(width - 58, height - 68, 42, '⤒', '26px');
    const attack = makeBtn(width - 150, height - 110, 34, '✦');
    const run = makeBtn(width - 150, height - 42, 28, '»', '18px');

    const emitMove = () => EventBus.emit('touch-input', { ...state });

    left.on('pointerdown', () => { state.left = true; emitMove(); });
    left.on('pointerup', () => { state.left = false; emitMove(); });
    left.on('pointerout', () => { state.left = false; emitMove(); });

    right.on('pointerdown', () => { state.right = true; emitMove(); });
    right.on('pointerup', () => { state.right = false; emitMove(); });
    right.on('pointerout', () => { state.right = false; emitMove(); });

    run.on('pointerdown', () => { state.run = true; emitMove(); });
    run.on('pointerup', () => { state.run = false; emitMove(); });
    run.on('pointerout', () => { state.run = false; emitMove(); });

    jump.on('pointerdown', () => EventBus.emit('touch-jump-down'));
    jump.on('pointerup', () => EventBus.emit('touch-jump-up'));
    jump.on('pointerout', () => EventBus.emit('touch-jump-up'));

    attack.on('pointerdown', () => EventBus.emit('touch-attack'));
  }
}
