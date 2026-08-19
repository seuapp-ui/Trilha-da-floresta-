/**
 * RendererBootstrap.js
 * -----------------------------------------------------------------------
 * Chooses the best Phaser render type and optionally mounts the WebGPU
 * sky layer behind the game canvas.
 *
 * Priority:
 *   1. Phaser WEBGL (or AUTO → WEBGL) for sprites / physics visuals
 *   2. WebGPU procedural sky underlay when navigator.gpu is present
 *   3. Phaser CANVAS only as last resort
 * -----------------------------------------------------------------------
 */

import { GameConfig } from '../config/GameConfig.js';
import { isWebGPUAvailable } from './WebGPUDevice.js';
import { WebGPUSky } from './WebGPUSky.js';

/**
 * Pick Phaser renderer constant. Prefer WEBGL; fall back to CANVAS.
 * Phaser.AUTO already does WebGL→Canvas, but we log the choice explicitly.
 */
export function pickPhaserRenderType() {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { powerPreference: 'high-performance' }) ||
      canvas.getContext('webgl', { powerPreference: 'high-performance' });
    if (gl) {
      console.info('[Renderer] Phaser backend: WEBGL');
      return Phaser.WEBGL;
    }
  } catch (_) { /* ignore */ }
  console.info('[Renderer] Phaser backend: CANVAS (WebGL unavailable)');
  return Phaser.CANVAS;
}

/**
 * Extra Phaser render flags for quality / performance.
 */
export function getPhaserRenderConfig() {
  return {
    antialias: true,
    antialiasGL: true,
    powerPreference: 'high-performance',
    batchSize: 4096,
    maxTextures: 16,
    // Round pixels off for smoother parallax / scaled art
    roundPixels: false,
    transparent: false,
  };
}

/**
 * After Phaser.Game is constructed, try to mount WebGPU sky underlay.
 * Hides the static 'sky' tileSprite in active scenes when successful.
 *
 * @param {Phaser.Game} game
 * @returns {Promise<WebGPUSky|null>}
 */
export async function mountWebGPUSky(game) {
  if (!isWebGPUAvailable()) {
    console.info('[Renderer] WebGPU sky skipped (API missing)');
    return null;
  }

  const parent = document.getElementById(game.config.parent) || game.canvas?.parentElement;
  if (!parent) return null;

  const sky = new WebGPUSky(parent, {
    width: GameConfig.WIDTH,
    height: GameConfig.HEIGHT,
  });

  const ok = await sky.init();
  if (!ok) {
    sky.destroy();
    return null;
  }

  // Keep the WebGPU canvas sized with Phaser's scale manager
  const onResize = () => {
    const s = game.scale;
    sky.resize(s.gameSize.width, s.gameSize.height);
  };
  game.scale.on('resize', onResize);
  onResize();

  // Mark on the game so scenes can hide their CPU sky texture
  game.registry.set('webgpuSky', true);
  game.registry.set('webgpuSkyInstance', sky);

  console.info('[Renderer] WebGPU procedural sky active');
  return sky;
}
