/**
 * LevelData.js
 * -----------------------------------------------------------------------
 * Pure data describing a playable level. GameScene reads this and builds
 * the world from it - no level-specific logic lives outside this file.
 * To add a new level/world, create another object with the same shape
 * and register it in LEVELS below. Nothing else needs to change.
 *
 * Coordinates are in world pixels. Level is wide enough for ~3 minutes
 * of relaxed platforming (approx. 7200px).
 * -----------------------------------------------------------------------
 */

const GROUND_Y = 460;

// Ground segments: [x, width] - gaps between segments are pits/hazards/water.
const groundSegments = [
  [0, 1000],
  [1120, 480],
  [1750, 900],
  [2820, 1400], // long stretch, crosses the river via bridge
  [4400, 700],
  [5300, 1050],
  [6550, 700],
];

export const WORLD_1_LEVEL_1 = {
  id: 'w1_l1',
  name: 'Trilha da Clareira Verde',
  nextLevelId: 'w1_l2',
  groundY: GROUND_Y,
  levelWidth: 7400,
  levelHeight: GameConfigHeight(),
  playerStart: { x: 100, y: GROUND_Y - 100 },

  groundSegments,

  // Water hazard (river) the bridge crosses
  river: { x: 2820, width: 260, y: GROUND_Y + 10 },
  waterfall: { x: 4650, y: GROUND_Y - 260, width: 46, height: 260 },

  bridge: { x: 2860, y: GROUND_Y - 6, width: 200 },

  // Floating platforms: type 'wood' | 'stone'
  platforms: [
    { x: 1250, y: 360, width: 140, type: 'wood' },
    { x: 1470, y: 300, width: 100, type: 'wood' },
    { x: 1950, y: 380, width: 120, type: 'stone' },
    { x: 2150, y: 320, width: 120, type: 'stone' },
    { x: 2400, y: 260, width: 140, type: 'wood' },
    { x: 3200, y: 380, width: 150, type: 'stone' },
    { x: 3450, y: 300, width: 120, type: 'wood' },
    { x: 3700, y: 380, width: 150, type: 'stone' },
    { x: 4520, y: 340, width: 110, type: 'wood' },
    { x: 4950, y: 300, width: 130, type: 'stone' },
    { x: 5600, y: 360, width: 140, type: 'wood' },
    { x: 5850, y: 280, width: 110, type: 'stone' },
    { x: 6100, y: 340, width: 130, type: 'wood' },
  ],

  // Vines the player can visually pass near (decorative + minor platform)
  vines: [
    { x: 1900, y: 260, length: 160 },
    { x: 3900, y: 220, length: 200 },
    { x: 5450, y: 220, length: 180 },
  ],

  // Slopes for sliding mechanic: {x, y, width, height, direction:-1|1}
  slopes: [
    { x: 1000, y: GROUND_Y, width: 120, direction: 1 },
    { x: 6250, y: GROUND_Y, width: 120, direction: -1 },
  ],

  // Destructible crates: loot = 'coin'|'crystal'|'life'
  crates: [
    { x: 480, y: GROUND_Y - 30, loot: 'coin' },
    { x: 520, y: GROUND_Y - 30, loot: 'coin' },
    { x: 1300, y: 320, loot: 'crystal' },
    { x: 2050, y: 280, loot: 'coin' },
    { x: 3250, y: 340, loot: 'life' },
    { x: 4560, y: 300, loot: 'coin' },
    { x: 5650, y: 320, loot: 'coin' },
    { x: 6150, y: 300, loot: 'crystal' },
  ],

  // Coins placed individually or in arcs
  coins: [
    ...arc(700, 380, 6, 40),
    ...arc(1550, 250, 5, 36),
    ...arc(2250, 220, 6, 36),
    ...arc(3300, 250, 5, 36),
    ...arc(3750, 300, 4, 36),
    ...arc(4980, 250, 5, 36),
    ...arc(5900, 220, 6, 36),
    ...line(6600, GROUND_Y - 40, 8, 40),
  ],

  // Hidden crystals - rewarding exploration
  crystals: [
    { x: 250, y: 380 },
    { x: 1480, y: 240 },
    { x: 3480, y: 240 },
    { x: 4980, y: 220 },
    { x: 5860, y: 200 },
    { x: 6900, y: 380 },
  ],

  enemies: [
    { type: 'slug', x: 900, y: GROUND_Y - 20, patrolMin: 780, patrolMax: 1080 },
    { type: 'slug', x: 3050, y: GROUND_Y - 20, patrolMin: 2900, patrolMax: 3550 },
    { type: 'boar', x: 1850, y: GROUND_Y - 20 },
    { type: 'boar', x: 5400, y: GROUND_Y - 20 },
    { type: 'bat', x: 2500, y: 260, amplitudeY: 260 },
    { type: 'bat', x: 4100, y: 300, amplitudeY: 300 },
    { type: 'bat', x: 6300, y: 260, amplitudeY: 260 },
  ],

  // Hazards
  spikes: [
    { x: 1620, y: GROUND_Y - 16, count: 3 },
    { x: 3980, y: GROUND_Y - 16, count: 4 },
    { x: 6420, y: GROUND_Y - 16, count: 3 },
  ],

  fallingLogs: [
    { x: 2900, triggerX: 2830, y: 120 },
    { x: 5000, triggerX: 4930, y: 100 },
  ],

  rollingRocks: [
    { x: 3350, y: 150, minX: 3200, maxX: 3750 },
    { x: 6000, y: 150, minX: 5850, maxX: 6350 },
  ],

  checkpoints: [
    { x: 3300, y: GROUND_Y - 40 },
  ],

  portal: { x: 7250, y: GROUND_Y - 70 },

  // Decorative-only elements (no collision) for scenery richness
  decor: {
    treesNear: gen(0, 7400, 380, ['tree_near_1', 'tree_near_2']),
    treesFar: gen(0, 7400, 260, ['tree_far_1', 'tree_far_2']),
    bushes: gen(50, 7350, 300, ['bush']),
    flowers: gen(20, 7380, 140, ['flower_1', 'flower_2']),
    rocksDecor: gen(30, 7370, 500, ['rock_decor']),
  },
};

function GameConfigHeight() {
  return 540;
}

function arc(startX, baseY, count, spacing) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1 || 1);
    const y = baseY - Math.sin(t * Math.PI) * 60;
    pts.push({ x: startX + i * spacing, y });
  }
  return pts;
}

function line(startX, y, count, spacing) {
  const pts = [];
  for (let i = 0; i < count; i++) pts.push({ x: startX + i * spacing, y });
  return pts;
}

function gen(minX, maxX, step, variants) {
  const items = [];
  let x = minX;
  let i = 0;
  while (x < maxX) {
    items.push({ x, variant: variants[i % variants.length] });
    x += step + Math.random() * step * 0.6;
    i++;
  }
  return items;
}


// =====================================================================
// Mundo 1 — Fase 2: Rio Encantado
// Mais água, pontes e plataformas sobre o rio. Um pouco mais exigente.
// =====================================================================
const GY2 = 460;

export const WORLD_1_LEVEL_2 = {
  id: 'w1_l2',
  name: 'Rio Encantado',
  nextLevelId: null,
  groundY: GY2,
  levelWidth: 7800,
  levelHeight: GameConfigHeight(),
  playerStart: { x: 120, y: GY2 - 100 },

  // More gaps = more water crossings
  groundSegments: [
    [0, 720],
    [900, 380],
    [1480, 520],
    [2200, 400],
    [2800, 900],
    [3900, 480],
    [4580, 700],
    [5500, 420],
    [6120, 500],
    [6820, 980],
  ],

  // Multiple river segments (Map uses a single river — primary wide one)
  river: { x: 2800, width: 320, y: GY2 + 10 },
  waterfall: { x: 4600, y: GY2 - 280, width: 50, height: 280 },
  bridge: { x: 2860, y: GY2 - 6, width: 240 },

  platforms: [
    // early stepping stones over first gap
    { x: 820, y: 380, width: 90, type: 'wood' },
    { x: 1000, y: 320, width: 90, type: 'wood' },
    { x: 1180, y: 360, width: 100, type: 'stone' },
    // mid river route
    { x: 2350, y: 340, width: 110, type: 'wood' },
    { x: 2550, y: 280, width: 100, type: 'wood' },
    { x: 3100, y: 360, width: 140, type: 'stone' },
    { x: 3350, y: 300, width: 120, type: 'wood' },
    { x: 3600, y: 250, width: 110, type: 'stone' },
    { x: 4100, y: 320, width: 130, type: 'wood' },
    { x: 4800, y: 300, width: 120, type: 'stone' },
    { x: 5050, y: 250, width: 100, type: 'wood' },
    { x: 5300, y: 340, width: 120, type: 'wood' },
    { x: 5750, y: 280, width: 110, type: 'stone' },
    { x: 6400, y: 320, width: 140, type: 'wood' },
    { x: 6650, y: 260, width: 100, type: 'stone' },
  ],

  vines: [
    { x: 2100, y: 240, length: 180 },
    { x: 3500, y: 200, length: 200 },
    { x: 5200, y: 220, length: 170 },
  ],

  slopes: [
    { x: 700, y: GY2, width: 100, direction: 1 },
    { x: 6700, y: GY2, width: 120, direction: -1 },
  ],

  crates: [
    { x: 400, y: GY2 - 30, loot: 'coin' },
    { x: 1050, y: 300, loot: 'coin' },
    { x: 2400, y: 320, loot: 'crystal' },
    { x: 3400, y: 280, loot: 'coin' },
    { x: 4900, y: 280, loot: 'life' },
    { x: 5800, y: 260, loot: 'coin' },
    { x: 6500, y: 300, loot: 'crystal' },
    { x: 7200, y: GY2 - 30, loot: 'coin' },
  ],

  coins: [
    ...arc(500, 380, 5, 36),
    ...arc(1100, 280, 5, 34),
    ...line(1600, GY2 - 40, 6, 40),
    ...arc(2500, 250, 6, 32),
    ...arc(3300, 270, 5, 36),
    ...arc(4200, 280, 5, 34),
    ...arc(5100, 220, 6, 32),
    ...arc(5900, 250, 5, 36),
    ...line(7000, GY2 - 40, 8, 38),
  ],

  crystals: [
    { x: 300, y: 360 },
    { x: 1280, y: 300 },
    { x: 2700, y: 240 },
    { x: 3650, y: 220 },
    { x: 5100, y: 210 },
    { x: 6600, y: 230 },
    { x: 7400, y: 360 },
  ],

  enemies: [
    { type: 'slug', x: 600, y: GY2 - 20, patrolMin: 480, patrolMax: 700 },
    { type: 'slug', x: 1700, y: GY2 - 20, patrolMin: 1550, patrolMax: 1950 },
    { type: 'slug', x: 4700, y: GY2 - 20, patrolMin: 4600, patrolMax: 5200 },
    { type: 'boar', x: 2000, y: GY2 - 20 },
    { type: 'boar', x: 4000, y: GY2 - 20 },
    { type: 'boar', x: 6200, y: GY2 - 20 },
    { type: 'bat', x: 1050, y: 240, amplitudeY: 240 },
    { type: 'bat', x: 2600, y: 220, amplitudeY: 220 },
    { type: 'bat', x: 3500, y: 200, amplitudeY: 200 },
    { type: 'bat', x: 5000, y: 220, amplitudeY: 220 },
    { type: 'bat', x: 6400, y: 240, amplitudeY: 240 },
  ],

  spikes: [
    { x: 1350, y: GY2 - 16, count: 3 },
    { x: 2650, y: GY2 - 16, count: 2 },
    { x: 4300, y: GY2 - 16, count: 4 },
    { x: 6000, y: GY2 - 16, count: 3 },
    { x: 7100, y: GY2 - 16, count: 2 },
  ],

  fallingLogs: [
    { x: 3200, triggerX: 3120, y: 100 },
    { x: 5400, triggerX: 5320, y: 110 },
  ],

  rollingRocks: [
    { x: 3600, y: 140, minX: 3450, maxX: 3850 },
    { x: 5600, y: 140, minX: 5450, maxX: 5950 },
  ],

  checkpoints: [
    { x: 3000, y: GY2 - 40 },
    { x: 5600, y: GY2 - 40 },
  ],

  portal: { x: 7600, y: GY2 - 70 },

  decor: {
    treesNear: gen(0, 7800, 420, ['tree_near_1', 'tree_near_2']),
    treesFar: gen(0, 7800, 300, ['tree_far_1', 'tree_far_2']),
    bushes: gen(40, 7750, 280, ['bush']),
    flowers: gen(20, 7780, 160, ['flower_1', 'flower_2']),
    rocksDecor: gen(30, 7770, 480, ['rock_decor']),
  },
};

export const LEVELS = {
  w1_l1: WORLD_1_LEVEL_1,
  w1_l2: WORLD_1_LEVEL_2,
};

/** Ordered list for menus / unlock chain */
export const LEVEL_ORDER = ['w1_l1', 'w1_l2'];

export function getNextLevelId(levelId) {
  const level = LEVELS[levelId];
  return level?.nextLevelId || null;
}
