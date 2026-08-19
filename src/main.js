import { GameConfig } from './config/GameConfig.js';
import { getPhysicsConfig } from './modules/Physics.js';
import { getSceneList } from './modules/SceneManager.js';
import {
  pickPhaserRenderType,
  getPhaserRenderConfig,
  mountWebGPUSky,
} from './render/RendererBootstrap.js';
import { isWebGPUAvailable } from './render/WebGPUDevice.js';

/**
 * main.js
 * -----------------------------------------------------------------------
 * Entry point. Selects the best renderer available:
 *   • Phaser WEBGL for sprites / tilemaps / particles
 *   • WebGPU procedural sky underlay (when navigator.gpu exists)
 *   • Canvas only if WebGL is missing
 * -----------------------------------------------------------------------
 */

const renderType = pickPhaserRenderType();
const renderOpts = getPhaserRenderConfig();
const wantWebGPUSky = isWebGPUAvailable();

const config = {
  type: renderType,
  width: GameConfig.WIDTH,
  height: GameConfig.HEIGHT,
  parent: 'game-container',
  // Transparent so the WebGPU sky canvas behind is visible
  backgroundColor: wantWebGPUSky ? '#00000000' : '#8fd3f4',
  transparent: wantWebGPUSky,
  pixelArt: false,
  antialias: renderOpts.antialias,
  powerPreference: renderOpts.powerPreference,
  batchSize: renderOpts.batchSize,
  roundPixels: renderOpts.roundPixels,
  physics: getPhysicsConfig(),
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 400, height: 225 },
    max: { width: 1920, height: 1080 },
  },
  render: {
    antialias: renderOpts.antialias,
    antialiasGL: renderOpts.antialiasGL,
    powerPreference: renderOpts.powerPreference,
    batchSize: renderOpts.batchSize,
    maxTextures: renderOpts.maxTextures,
    roundPixels: renderOpts.roundPixels,
    transparent: wantWebGPUSky,
    clearBeforeRender: true,
  },
  scene: getSceneList(),
  callbacks: {
    postBoot: (game) => {
      mountWebGPUSky(game).catch((err) => {
        console.warn('[Renderer] WebGPU sky mount failed:', err);
      });
    },
  },
};

window.game = new Phaser.Game(config);

window.addEventListener('load', () => {
  const g = window.game;
  if (!g) return;
  console.info('[Renderer] Active stack:', {
    phaserType: g.renderer?.gl ? 'WEBGL' : 'CANVAS',
    webgpuSky: !!g.registry?.get('webgpuSky'),
  });
});
