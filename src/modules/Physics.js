import { GameConfig } from '../config/GameConfig.js';

/**
 * Physics.js
 * -----------------------------------------------------------------------
 * Returns the Arcade Physics config block used by main.js. Isolated so
 * global physics tuning (gravity, world bounds behaviour, debug flag)
 * has one obvious home instead of being buried inside the Phaser.Game
 * constructor call.
 * -----------------------------------------------------------------------
 */
export function getPhysicsConfig() {
  return {
    default: 'arcade',
    arcade: {
      gravity: { y: GameConfig.PHYSICS.GRAVITY_Y },
      debug: false,
    },
  };
}
