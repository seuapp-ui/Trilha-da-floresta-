import { GameConfig } from './config/GameConfig.js';
import { getPhysicsConfig } from './modules/Physics.js';
import { getSceneList } from './modules/SceneManager.js';

/**
 * main.js
 * -----------------------------------------------------------------------
 * Entry point. Assembles the Phaser.Game config from the modular pieces
 * (physics config, scene registry) and boots the game. Scaling is
 * FIT + CENTER_BOTH so the same build works on desktop and mobile
 * viewports, which also keeps this project one step away from a PWA
 * shell (add a manifest + service worker and it's installable).
 * -----------------------------------------------------------------------
 */
const config = {
  type: Phaser.AUTO,
  width: GameConfig.WIDTH,
  height: GameConfig.HEIGHT,
  parent: 'game-container',
  backgroundColor: '#8fd3f4',
  pixelArt: false,
  physics: getPhysicsConfig(),
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 400, height: 225 },
    max: { width: 1920, height: 1080 },
  },
  scene: getSceneList(),
};

window.game = new Phaser.Game(config);
