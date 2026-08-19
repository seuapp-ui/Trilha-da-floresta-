import { BootScene } from '../scenes/BootScene.js';
import { PreloadScene } from '../scenes/PreloadScene.js';
import { MenuScene } from '../scenes/MenuScene.js';
import { GameScene } from '../scenes/GameScene.js';
import { UIScene } from '../scenes/UIScene.js';
import { GameOverScene } from '../scenes/GameOverScene.js';
import { LevelCompleteScene } from '../scenes/LevelCompleteScene.js';
import { LevelSelectScene } from '../scenes/LevelSelectScene.js';

/**
 * SceneManager.js
 * -----------------------------------------------------------------------
 * Single source of truth for which scenes exist and in what order Phaser
 * should register them. main.js just imports `getSceneList()` instead of
 * wiring every scene class by hand - adding a new scene (a new world's
 * boss intro, a shop screen, etc.) means adding one line here.
 * -----------------------------------------------------------------------
 */
export function getSceneList() {
  return [
    BootScene,
    PreloadScene,
    MenuScene,
    GameScene,
    UIScene,
    GameOverScene,
    LevelCompleteScene,
    LevelSelectScene,
  ];
}
