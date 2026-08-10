/**
 * EventBus.js
 * -----------------------------------------------------------------------
 * A single shared Phaser EventEmitter used for cross-scene communication
 * (e.g. GameScene -> UIScene HUD updates) without scenes needing direct
 * references to each other. Keep event names centralized in EVENTS so
 * typos fail loudly during development instead of silently.
 * -----------------------------------------------------------------------
 */
export const EventBus = new Phaser.Events.EventEmitter();

export const EVENTS = {
  HEALTH_CHANGED: 'health-changed',
  COINS_CHANGED: 'coins-changed',
  CRYSTALS_CHANGED: 'crystals-changed',
  CHECKPOINT_REACHED: 'checkpoint-reached',
  LEVEL_COMPLETE: 'level-complete',
  PLAYER_DIED: 'player-died',
  PLAYER_RESPAWNED: 'player-respawned',
};
