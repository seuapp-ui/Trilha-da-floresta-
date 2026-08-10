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
    const D = GameConfig.DEPTH.HUD;
    const shortSide = Math.min(width, height);
    const isSmall = shortSide < 480;
    const isTiny = shortSide < 380;

    // Adaptive sizes — jump/attack intentionally larger than d-pad
    const dpadR = isTiny ? 36 : isSmall ? 42 : 46;
    const jumpR = isTiny ? 52 : isSmall ? 58 : 64;
    const attackR = isTiny ? 42 : isSmall ? 48 : 52;
    const runR = isTiny ? 28 : isSmall ? 32 : 34;
    // Hit area bigger than visual so fingers don't "lose" the button when sliding
    const hitPad = isSmall ? 18 : 22;

    const marginX = isTiny ? 12 : isSmall ? 18 : 28;
    const marginY = isTiny ? 14 : isSmall ? 18 : 24;
    const baseY = height - marginY - jumpR;
    const dpadY = height - marginY - dpadR;

    const state = { left: false, right: false, run: false };
    // Track which pointer ids are holding each continuous action (multitouch-safe)
    const holders = { left: new Set(), right: new Set(), run: new Set(), jump: new Set() };

    const vibrate = (ms = 12) => {
      try {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms);
      } catch (_) { /* ignore */ }
    };

    const emitMove = () => EventBus.emit('touch-input', { ...state });

    /**
     * Creates a circular touch button.
     * visualR = drawn radius, hitR = interactive radius (larger = more forgiving).
     * holdKey: if set, button is held (left/right/run/jump); otherwise press-once (attack).
     */
    const makeBtn = (x, y, visualR, hitR, label, fontSize, fillColor, holdKey) => {
      const g = this.add.graphics().setScrollFactor(0).setDepth(D);
      const draw = (pressed) => {
        g.clear();
        const a = pressed ? 0.78 : 0.5;
        g.fillStyle(fillColor, a);
        g.fillCircle(x, y, visualR);
        g.lineStyle(3, 0xffffff, pressed ? 0.9 : 0.45);
        g.strokeCircle(x, y, visualR);
      };
      draw(false);

      const labelText = this.add.text(x, y, label, {
        fontSize: `${fontSize}px`,
        color: '#1a1a1a',
        fontStyle: 'bold',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(D + 1);

      // Invisible interactive zone larger than the visible circle
      const hit = this.add.circle(x, y, hitR, 0xffffff, 0.001)
        .setScrollFactor(0)
        .setDepth(D + 2)
        .setInteractive(
          new Phaser.Geom.Circle(hitR, hitR, hitR),
          Phaser.Geom.Circle.Contains
        );

      if (holdKey) {
        const setHeld = (pointer, down) => {
          const set = holders[holdKey];
          if (down) set.add(pointer.id);
          else set.delete(pointer.id);
          const active = set.size > 0;
          if (holdKey === 'jump') {
            if (down && set.size === 1) {
              EventBus.emit('touch-jump-down');
              vibrate(10);
            } else if (!active) {
              EventBus.emit('touch-jump-up');
            }
          } else {
            state[holdKey] = active;
            emitMove();
            if (down && set.size === 1) vibrate(8);
          }
          draw(active);
        };

        hit.on('pointerdown', (pointer) => {
          pointer.event?.preventDefault?.();
          setHeld(pointer, true);
        });
        // Do NOT clear on pointerout — finger can slide a bit without losing the action
        hit.on('pointerup', (pointer) => setHeld(pointer, false));
        hit.on('pointerupoutside', (pointer) => setHeld(pointer, false));
      } else {
        // One-shot (attack)
        hit.on('pointerdown', (pointer) => {
          pointer.event?.preventDefault?.();
          draw(true);
          EventBus.emit('touch-attack');
          vibrate(14);
          this.time.delayedCall(100, () => draw(false));
        });
      }

      return { g, hit, labelText, draw };
    };

    // Left side: d-pad
    const leftX = marginX + dpadR;
    const rightX = leftX + dpadR * 2 + (isSmall ? 10 : 14);
    makeBtn(leftX, dpadY, dpadR, dpadR + hitPad, '◀', isSmall ? 26 : 30, 0xe8f5e9, 'left');
    makeBtn(rightX, dpadY, dpadR, dpadR + hitPad, '▶', isSmall ? 26 : 30, 0xe8f5e9, 'right');

    // Right side: jump (biggest), attack, run
    const jumpX = width - marginX - jumpR;
    const attackX = jumpX - jumpR - attackR - (isSmall ? 8 : 12);
    const runX = attackX;
    const runY = baseY - jumpR - runR - (isSmall ? 6 : 10);

    makeBtn(jumpX, baseY, jumpR, jumpR + hitPad, '⤒', isSmall ? 32 : 36, 0xfff3c4, 'jump');
    makeBtn(attackX, baseY - 4, attackR, attackR + hitPad, '✦', isSmall ? 26 : 28, 0xffcdd2, null);
    makeBtn(runX, runY, runR, runR + hitPad * 0.7, '»', isSmall ? 20 : 22, 0xc5cae9, 'run');

    // Global pointerup safety net: if a pointer ends anywhere, release actions it held
    this.input.on('pointerup', (pointer) => {
      let changed = false;
      for (const key of ['left', 'right', 'run']) {
        if (holders[key].delete(pointer.id)) {
          state[key] = holders[key].size > 0;
          changed = true;
        }
      }
      if (holders.jump.delete(pointer.id) && holders.jump.size === 0) {
        EventBus.emit('touch-jump-up');
      }
      if (changed) emitMove();
    });

    // Keep controls usable after resize / orientation change
    this.scale.on('resize', () => {
      // Full rebuild is heavier; positions are relative to current scale at create.
      // For orientation flips, UIScene is usually recreated with Game — acceptable.
    });
  }
}
