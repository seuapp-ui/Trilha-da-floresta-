/**
 * WasmBridge.js
 * -----------------------------------------------------------------------
 * Loads the AssemblyScript game_math.wasm module and exposes a stable API.
 * If WebAssembly is unavailable or the .wasm fails to load (e.g. wrong MIME
 * on some static hosts), a pure-JS fallback keeps the game fully playable.
 *
 * Usage:
 *   import { WasmMath } from './wasm/WasmBridge.js';
 *   await WasmMath.init();
 *   WasmMath.updateBats(...);
 * -----------------------------------------------------------------------
 */

const MAX = 64;

/** Pure JS fallback — same API surface as the WASM exports. */
function createJsFallback() {
  const batBaseY = new Float32Array(MAX);
  const batPhase = new Float32Array(MAX);
  const batAmp = new Float32Array(MAX);
  const batOutY = new Float32Array(MAX);
  const batX = new Float32Array(MAX);
  const batDir = new Float32Array(MAX);

  const enemyX = new Float32Array(MAX);
  const enemyY = new Float32Array(MAX);
  const enemyTop = new Float32Array(MAX);
  const distSq = new Float32Array(MAX);
  const contactFlags = new Int32Array(MAX);

  const cloudX = new Float32Array(MAX);
  const cloudScale = new Float32Array(MAX);
  const decorX = new Float32Array(256);

  let rngState = 1;

  const api = {
    usingWasm: false,

    rngSeed(seed) { rngState = seed === 0 ? 1 : (seed >>> 0); },
    rngNext() {
      let x = rngState;
      x ^= (x << 13) >>> 0;
      x ^= x >>> 17;
      x ^= (x << 5) >>> 0;
      rngState = x >>> 0;
      return (rngState >>> 0) / 0xffffffff;
    },
    rngRange(min, max) { return min + api.rngNext() * (max - min); },

    setBat(i, baseY, phase, amp, x, dir) {
      if (i < 0 || i >= MAX) return;
      batBaseY[i] = baseY; batPhase[i] = phase; batAmp[i] = amp;
      batX[i] = x; batDir[i] = dir;
    },
    getBatX(i) { return batX[i]; },
    getBatY(i) { return batOutY[i]; },
    setBatDir(i, dir) { if (i >= 0 && i < MAX) batDir[i] = dir; },
    updateBats(n, time, speed, freq, delta) {
      const count = Math.min(n, MAX);
      const dt = delta / 1000;
      for (let i = 0; i < count; i++) {
        batOutY[i] = batBaseY[i] + Math.sin(time * freq + batPhase[i]) * batAmp[i];
        batX[i] += batDir[i] * speed * dt;
      }
    },

    setEnemy(i, x, y, top) {
      if (i < 0 || i >= MAX) return;
      enemyX[i] = x; enemyY[i] = y; enemyTop[i] = top;
    },
    getContactFlag(i) { return contactFlags[i]; },
    getDistSq(i) { return distSq[i]; },
    classifyContacts(n, px, py, playerBottom, playerVy, radius, stompSlack) {
      const count = Math.min(n, MAX);
      const r2 = radius * radius;
      for (let i = 0; i < count; i++) {
        const dx = enemyX[i] - px;
        const dy = enemyY[i] - py;
        const d2 = dx * dx + dy * dy;
        distSq[i] = d2;
        let flag = 0;
        if (d2 <= r2) {
          flag = (playerVy > 0 && playerBottom <= enemyTop[i] + stompSlack) ? 1 : 2;
        }
        contactFlags[i] = flag;
      }
    },

    setCloud(i, x, scale) {
      if (i < 0 || i >= MAX) return;
      cloudX[i] = x; cloudScale[i] = scale;
    },
    getCloudX(i) { return cloudX[i]; },
    driftClouds(n, delta, speed, minX, maxX) {
      const count = Math.min(n, MAX);
      for (let i = 0; i < count; i++) {
        let x = cloudX[i] + speed * delta * cloudScale[i];
        if (x > maxX) x = minX;
        cloudX[i] = x;
      }
    },

    computeStars(crystals, totalCrystals, noDamage) {
      let stars = 1;
      if (totalCrystals <= 0 || crystals >= totalCrystals) stars += 1;
      if (noDamage) stars += 1;
      return stars;
    },

    fillDecorX(maxCount, minX, maxX, step, seed) {
      api.rngSeed(seed);
      const cap = Math.min(maxCount, 256);
      let count = 0;
      let x = minX;
      while (x < maxX && count < cap) {
        decorX[count++] = x;
        x += step + api.rngNext() * step * 0.55;
      }
      return count;
    },
    getDecorX(i) { return decorX[i]; },
    clampf(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; },
    maxEntities() { return MAX; },
  };
  return api;
}

/**
 * Wrap raw WASM exports into the same API as the JS fallback.
 * Generated bindings already surface the functions by name.
 */
function wrapWasm(exports) {
  return {
    usingWasm: true,
    rngSeed: exports.rngSeed,
    rngNext: exports.rngNext,
    rngRange: exports.rngRange,
    setBat: exports.setBat,
    getBatX: exports.getBatX,
    getBatY: exports.getBatY,
    setBatDir: exports.setBatDir,
    updateBats: exports.updateBats,
    setEnemy: exports.setEnemy,
    getContactFlag: exports.getContactFlag,
    getDistSq: exports.getDistSq,
    classifyContacts: exports.classifyContacts,
    setCloud: exports.setCloud,
    getCloudX: exports.getCloudX,
    driftClouds: exports.driftClouds,
    computeStars: exports.computeStars,
    fillDecorX: exports.fillDecorX,
    getDecorX: exports.getDecorX,
    clampf: exports.clampf,
    maxEntities: exports.maxEntities,
  };
}

class WasmMathFacade {
  constructor() {
    this._api = null;
    this._ready = null;
  }

  /**
   * Initialise once. Safe to call multiple times — returns the same promise.
   * @returns {Promise<this>}
   */
  init() {
    if (this._ready) return this._ready;

    this._ready = (async () => {
      // Prefer the generated ES bindings when available (handles compileStreaming).
      try {
        if (typeof WebAssembly === 'undefined') throw new Error('no WebAssembly');
        const mod = await import('./game_math.js');
        this._api = wrapWasm(mod);
        console.info('[WasmMath] WebAssembly module loaded');
      } catch (err) {
        console.warn('[WasmMath] WASM unavailable, using JS fallback:', err?.message || err);
        this._api = createJsFallback();
      }
      return this;
    })();

    return this._ready;
  }

  get ready() { return !!this._api; }
  get usingWasm() { return this._api?.usingWasm === true; }

  // Proxy methods so callers can write WasmMath.updateBats(...) after init.
  rngSeed(...a) { return this._api.rngSeed(...a); }
  rngNext() { return this._api.rngNext(); }
  rngRange(...a) { return this._api.rngRange(...a); }
  setBat(...a) { return this._api.setBat(...a); }
  getBatX(i) { return this._api.getBatX(i); }
  getBatY(i) { return this._api.getBatY(i); }
  setBatDir(...a) { return this._api.setBatDir(...a); }
  updateBats(...a) { return this._api.updateBats(...a); }
  setEnemy(...a) { return this._api.setEnemy(...a); }
  getContactFlag(i) { return this._api.getContactFlag(i); }
  getDistSq(i) { return this._api.getDistSq(i); }
  classifyContacts(...a) { return this._api.classifyContacts(...a); }
  setCloud(...a) { return this._api.setCloud(...a); }
  getCloudX(i) { return this._api.getCloudX(i); }
  driftClouds(...a) { return this._api.driftClouds(...a); }
  computeStars(...a) { return this._api.computeStars(...a); }
  fillDecorX(...a) { return this._api.fillDecorX(...a); }
  getDecorX(i) { return this._api.getDecorX(i); }
  clampf(...a) { return this._api.clampf(...a); }
  maxEntities() { return this._api.maxEntities(); }
}

/** Singleton used across scenes / modules. */
export const WasmMath = new WasmMathFacade();
