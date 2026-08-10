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

    EventBus.on('game-paused', (paused) => this._setPauseVisible(paused));
    this.events.once('shutdown', () => EventBus.off('game-paused'));
  }

  _buildPauseButton() {
    const { width } = this.scale;
    const btn = this.add.text(width - 20, 20, '⏸', { fontSize: '28px', color: '#ffffff' })
      .setOrigin(1, 0).setScrollFactor(0).setDepth(GameConfig.DEPTH.HUD).setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => EventBus.emit('pause-toggle'));
  }

  _buildPauseOverlay() {
    const { width, height } = this.scale;
    this.pausePanel = this.add.container(0, 0).setDepth(GameConfig.DEPTH.HUD + 10).setVisible(false);
    const bg = UI.panel(this, width / 2, height / 2, width, height, 0.65);
    const title = UI.title(this, width / 2, height / 2 - 80, 'Pausado', '36px');
    const resume = UI.button(this, width / 2, height / 2, 'Continuar', () => EventBus.emit('pause-toggle'));
    const menu = UI.button(this, width / 2, height / 2 + 70, 'Menu Principal', () => {
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
    const alpha = 0.55;
    const D = GameConfig.DEPTH.HUD;
    const state = { left: false, right: false, run: false };

    const makeBtn = (x, y, r, label) => {
      const circle = this.add.circle(x, y, r, 0xffffff, alpha).setScrollFactor(0).setDepth(D).setInteractive();
      const text = this.add.text(x, y, label, { fontSize: '22px', color: '#333333' }).setOrigin(0.5).setScrollFactor(0).setDepth(D);
      return circle;
    };

    const left = makeBtn(60, height - 70, 34, '◀');
    const right = makeBtn(140, height - 70, 34, '▶');
    const jump = makeBtn(width - 70, height - 70, 40, '⤒');
    const attack = makeBtn(width - 160, height - 100, 34, '✦');
    const run = makeBtn(width - 160, height - 40, 26, '»');

    left.on('pointerdown', () => { state.left = true; EventBus.emit('touch-input', state); });
    left.on('pointerup', () => { state.left = false; EventBus.emit('touch-input', state); });
    left.on('pointerout', () => { state.left = false; EventBus.emit('touch-input', state); });

    right.on('pointerdown', () => { state.right = true; EventBus.emit('touch-input', state); });
    right.on('pointerup', () => { state.right = false; EventBus.emit('touch-input', state); });
    right.on('pointerout', () => { state.right = false; EventBus.emit('touch-input', state); });

    run.on('pointerdown', () => { state.run = true; EventBus.emit('touch-input', state); });
    run.on('pointerup', () => { state.run = false; EventBus.emit('touch-input', state); });

    jump.on('pointerdown', () => EventBus.emit('touch-jump-down'));
    jump.on('pointerup', () => EventBus.emit('touch-jump-up'));

    attack.on('pointerdown', () => EventBus.emit('touch-attack'));
  }
}
