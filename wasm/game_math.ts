/**
 * game_math.ts — AssemblyScript → WebAssembly
 * -----------------------------------------------------------------------
 * Hot-path math for Trilha da Floresta. Static scratch buffers avoid
 * heap allocation from JS and keep the FFI surface tiny.
 *
 * Capacity: up to MAX_ENTITIES enemies / clouds per batch call.
 * -----------------------------------------------------------------------
 */

const MAX_ENTITIES: i32 = 64;

// ---- Static scratch buffers (f32 unless noted) -----------------------
const batBaseY  = new StaticArray<f32>(MAX_ENTITIES);
const batPhase  = new StaticArray<f32>(MAX_ENTITIES);
const batAmp    = new StaticArray<f32>(MAX_ENTITIES);
const batOutY   = new StaticArray<f32>(MAX_ENTITIES);
const batX      = new StaticArray<f32>(MAX_ENTITIES);
const batDir    = new StaticArray<f32>(MAX_ENTITIES);

const enemyX    = new StaticArray<f32>(MAX_ENTITIES);
const enemyY    = new StaticArray<f32>(MAX_ENTITIES);
const enemyTop  = new StaticArray<f32>(MAX_ENTITIES);
const distSq    = new StaticArray<f32>(MAX_ENTITIES);
const contactFlags = new StaticArray<i32>(MAX_ENTITIES); // 0 none, 1 stomp, 2 hurt

const cloudX    = new StaticArray<f32>(MAX_ENTITIES);
const cloudScale = new StaticArray<f32>(MAX_ENTITIES);

const decorX    = new StaticArray<f32>(256);

// ---- Seeded PRNG (xorshift32) ----------------------------------------
let rngState: u32 = 1;

export function rngSeed(seed: u32): void {
  rngState = seed === 0 ? 1 : seed;
}

export function rngNext(): f32 {
  let x = rngState;
  x ^= x << 13;
  x ^= x >> 17;
  x ^= x << 5;
  rngState = x;
  return f32(x) / f32(0xffffffff);
}

export function rngRange(min: f32, max: f32): f32 {
  return min + rngNext() * (max - min);
}

// ---- Bat setters / getters (per-index) --------------------------------
export function setBat(i: i32, baseY: f32, phase: f32, amp: f32, x: f32, dir: f32): void {
  if (i < 0 || i >= MAX_ENTITIES) return;
  unchecked(batBaseY[i] = baseY);
  unchecked(batPhase[i] = phase);
  unchecked(batAmp[i] = amp);
  unchecked(batX[i] = x);
  unchecked(batDir[i] = dir);
}

export function getBatX(i: i32): f32 {
  return unchecked(batX[i]);
}

export function getBatY(i: i32): f32 {
  return unchecked(batOutY[i]);
}

export function setBatDir(i: i32, dir: f32): void {
  if (i < 0 || i >= MAX_ENTITIES) return;
  unchecked(batDir[i] = dir);
}

/**
 * Update n bats. Writes new X/Y into internal buffers; read via getBatX/Y.
 */
export function updateBats(n: i32, time: f32, speed: f32, freq: f32, delta: f32): void {
  const count = n < MAX_ENTITIES ? n : MAX_ENTITIES;
  const dt = delta / 1000.0;
  for (let i: i32 = 0; i < count; i++) {
    const baseY = unchecked(batBaseY[i]);
    const phase = unchecked(batPhase[i]);
    const amp = unchecked(batAmp[i]);
    const dir = unchecked(batDir[i]);
    unchecked(batOutY[i] = baseY + Mathf.sin(time * freq + phase) * amp);
    unchecked(batX[i] = unchecked(batX[i]) + dir * speed * dt);
  }
}

// ---- Enemy contact classification -------------------------------------
export function setEnemy(i: i32, x: f32, y: f32, top: f32): void {
  if (i < 0 || i >= MAX_ENTITIES) return;
  unchecked(enemyX[i] = x);
  unchecked(enemyY[i] = y);
  unchecked(enemyTop[i] = top);
}

export function getContactFlag(i: i32): i32 {
  return unchecked(contactFlags[i]);
}

export function getDistSq(i: i32): f32 {
  return unchecked(distSq[i]);
}

/**
 * Classify contacts for n enemies vs player.
 * flags: 0 = none, 1 = stomp, 2 = body contact (damage).
 */
export function classifyContacts(
  n: i32,
  px: f32,
  py: f32,
  playerBottom: f32,
  playerVy: f32,
  radius: f32,
  stompSlack: f32,
): void {
  const count = n < MAX_ENTITIES ? n : MAX_ENTITIES;
  const r2 = radius * radius;
  for (let i: i32 = 0; i < count; i++) {
    const ex = unchecked(enemyX[i]);
    const ey = unchecked(enemyY[i]);
    const dx = ex - px;
    const dy = ey - py;
    const d2 = dx * dx + dy * dy;
    unchecked(distSq[i] = d2);
    let flag: i32 = 0;
    if (d2 <= r2) {
      const top = unchecked(enemyTop[i]);
      if (playerVy > 0.0 && playerBottom <= top + stompSlack) {
        flag = 1;
      } else {
        flag = 2;
      }
    }
    unchecked(contactFlags[i] = flag);
  }
}

// ---- Cloud drift ------------------------------------------------------
export function setCloud(i: i32, x: f32, scale: f32): void {
  if (i < 0 || i >= MAX_ENTITIES) return;
  unchecked(cloudX[i] = x);
  unchecked(cloudScale[i] = scale);
}

export function getCloudX(i: i32): f32 {
  return unchecked(cloudX[i]);
}

export function driftClouds(n: i32, delta: f32, speed: f32, minX: f32, maxX: f32): void {
  const count = n < MAX_ENTITIES ? n : MAX_ENTITIES;
  for (let i: i32 = 0; i < count; i++) {
    let x = unchecked(cloudX[i]) + speed * delta * unchecked(cloudScale[i]);
    if (x > maxX) x = minX;
    unchecked(cloudX[i] = x);
  }
}

// ---- Stars ------------------------------------------------------------
export function computeStars(crystals: i32, totalCrystals: i32, noDamage: i32): i32 {
  let stars: i32 = 1;
  if (totalCrystals <= 0 || crystals >= totalCrystals) stars += 1;
  if (noDamage != 0) stars += 1;
  return stars;
}

// ---- Deterministic decor X --------------------------------------------
export function fillDecorX(maxCount: i32, minX: f32, maxX: f32, step: f32, seed: u32): i32 {
  rngSeed(seed);
  const cap = maxCount < 256 ? maxCount : 256;
  let count: i32 = 0;
  let x = minX;
  while (x < maxX && count < cap) {
    unchecked(decorX[count] = x);
    x += step + rngNext() * step * 0.55;
    count++;
  }
  return count;
}

export function getDecorX(i: i32): f32 {
  return unchecked(decorX[i]);
}

export function clampf(v: f32, lo: f32, hi: f32): f32 {
  if (v < lo) return lo;
  if (v > hi) return hi;
  return v;
}

export function maxEntities(): i32 {
  return MAX_ENTITIES;
}
