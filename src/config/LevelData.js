/**
 * LevelData.js
 * -----------------------------------------------------------------------
 * Pure data describing playable levels. GameScene reads this and builds
 * the world from it. Register new levels in LEVELS + LEVEL_ORDER.
 * -----------------------------------------------------------------------
 */

const GROUND_Y = 460;

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

function seededRand(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function gen(minX, maxX, step, variants) {
  const items = [];
  let x = minX;
  let i = 0;
  while (x < maxX) {
    items.push({ x, variant: variants[i % variants.length] });
    x += step + seededRand(i * 17 + minX) * step * 0.55;
    i++;
  }
  return items;
}

// =====================================================================
// FASE 1 — Trilha da Clareira Verde (tutorial / ritmo calmo)
// =====================================================================
export const WORLD_1_LEVEL_1 = {
  id: 'w1_l1',
  name: 'Trilha da Clareira Verde',
  world: 1,
  index: 1,
  nextLevelId: 'w1_l2',
  groundY: GROUND_Y,
  levelWidth: 7400,
  levelHeight: GameConfigHeight(),
  playerStart: { x: 100, y: GROUND_Y - 100 },

  groundSegments: [
    [0, 1000],
    [1120, 480],
    [1750, 900],
    [2820, 1400],
    [4400, 700],
    [5300, 1050],
    [6550, 700],
  ],

  river: { x: 2820, width: 260, y: GROUND_Y + 10 },
  waterfall: { x: 4650, y: GROUND_Y - 260, width: 46, height: 260 },
  bridge: { x: 2860, y: GROUND_Y - 6, width: 200 },

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

  vines: [
    { x: 1900, y: 260, length: 160 },
    { x: 3900, y: 220, length: 200 },
    { x: 5450, y: 220, length: 180 },
  ],

  slopes: [
    { x: 1000, y: GROUND_Y, width: 120, direction: 1 },
    { x: 6250, y: GROUND_Y, width: 120, direction: -1 },
  ],

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
    { type: 'frog', x: 4800, y: GROUND_Y - 20, patrolMin: 4600, patrolMax: 5200 },
  ],

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

  checkpoints: [{ x: 3300, y: GROUND_Y - 40 }],
  portal: { x: 7250, y: GROUND_Y - 70 },

  decor: {
    treesNear: gen(0, 7400, 380, ['tree_near_1', 'tree_near_2']),
    treesFar: gen(0, 7400, 260, ['tree_far_1', 'tree_far_2']),
    bushes: gen(50, 7350, 300, ['bush']),
    flowers: gen(20, 7380, 140, ['flower_1', 'flower_2']),
    rocksDecor: gen(30, 7370, 500, ['rock_decor']),
  },
};

// =====================================================================
// FASE 2 — Bosque das Lianas (mais vertical, mais inimigos)
// =====================================================================
export const WORLD_1_LEVEL_2 = {
  id: 'w1_l2',
  name: 'Bosque das Lianas',
  world: 1,
  index: 2,
  nextLevelId: 'w1_l3',
  groundY: GROUND_Y,
  levelWidth: 8200,
  levelHeight: GameConfigHeight(),
  playerStart: { x: 80, y: GROUND_Y - 100 },

  groundSegments: [
    [0, 800],
    [950, 420],
    [1500, 600],
    [2300, 500],
    [3000, 1100],
    [4300, 550],
    [5100, 900],
    [6200, 700],
    [7100, 900],
  ],

  river: { x: 3000, width: 220, y: GROUND_Y + 10 },
  waterfall: { x: 5450, y: GROUND_Y - 280, width: 50, height: 280 },
  bridge: { x: 3030, y: GROUND_Y - 6, width: 180 },

  platforms: [
    { x: 1100, y: 380, width: 120, type: 'wood' },
    { x: 1280, y: 300, width: 100, type: 'wood' },
    { x: 1450, y: 240, width: 100, type: 'stone' },
    { x: 1750, y: 340, width: 140, type: 'wood' },
    { x: 2000, y: 280, width: 110, type: 'stone' },
    { x: 2550, y: 360, width: 130, type: 'wood' },
    { x: 2750, y: 280, width: 100, type: 'stone' },
    { x: 3400, y: 360, width: 140, type: 'stone' },
    { x: 3650, y: 280, width: 120, type: 'wood' },
    { x: 3900, y: 200, width: 100, type: 'stone' },
    { x: 4150, y: 300, width: 130, type: 'wood' },
    { x: 4600, y: 340, width: 120, type: 'stone' },
    { x: 4850, y: 260, width: 110, type: 'wood' },
    { x: 5550, y: 320, width: 140, type: 'wood' },
    { x: 5800, y: 240, width: 100, type: 'stone' },
    { x: 6500, y: 360, width: 130, type: 'wood' },
    { x: 6750, y: 280, width: 120, type: 'stone' },
    { x: 7000, y: 340, width: 140, type: 'wood' },
  ],

  vines: [
    { x: 1200, y: 180, length: 200 },
    { x: 2700, y: 160, length: 220 },
    { x: 3800, y: 140, length: 180 },
    { x: 5700, y: 150, length: 200 },
    { x: 6800, y: 160, length: 190 },
  ],

  slopes: [
    { x: 800, y: GROUND_Y, width: 140, direction: 1 },
    { x: 7000, y: GROUND_Y, width: 100, direction: -1 },
  ],

  crates: [
    { x: 350, y: GROUND_Y - 30, loot: 'coin' },
    { x: 1120, y: 340, loot: 'crystal' },
    { x: 1780, y: 300, loot: 'coin' },
    { x: 2580, y: 320, loot: 'life' },
    { x: 3680, y: 240, loot: 'crystal' },
    { x: 4880, y: 220, loot: 'coin' },
    { x: 5580, y: 280, loot: 'coin' },
    { x: 6780, y: 240, loot: 'crystal' },
    { x: 7200, y: GROUND_Y - 30, loot: 'coin' },
  ],

  coins: [
    ...arc(500, 380, 5, 36),
    ...arc(1300, 220, 6, 32),
    ...arc(2100, 240, 5, 36),
    ...arc(3500, 220, 6, 34),
    ...arc(4000, 160, 5, 32),
    ...arc(5000, 220, 5, 36),
    ...arc(5900, 200, 6, 34),
    ...arc(6900, 240, 5, 36),
    ...line(7400, GROUND_Y - 40, 7, 38),
  ],

  crystals: [
    { x: 200, y: 380 },
    { x: 1460, y: 180 },
    { x: 2780, y: 220 },
    { x: 3920, y: 140 },
    { x: 4870, y: 200 },
    { x: 5820, y: 180 },
    { x: 7020, y: 280 },
    { x: 7800, y: 380 },
  ],

  enemies: [
    { type: 'slug', x: 700, y: GROUND_Y - 20, patrolMin: 600, patrolMax: 900 },
    { type: 'slug', x: 1700, y: GROUND_Y - 20, patrolMin: 1550, patrolMax: 2000 },
    { type: 'slug', x: 5300, y: GROUND_Y - 20, patrolMin: 5150, patrolMax: 5600 },
    { type: 'frog', x: 1200, y: GROUND_Y - 20, patrolMin: 1000, patrolMax: 1450 },
    { type: 'frog', x: 3600, y: GROUND_Y - 20, patrolMin: 3400, patrolMax: 4000 },
    { type: 'frog', x: 6600, y: GROUND_Y - 20, patrolMin: 6400, patrolMax: 7000 },
    { type: 'boar', x: 2500, y: GROUND_Y - 20 },
    { type: 'boar', x: 4500, y: GROUND_Y - 20 },
    { type: 'boar', x: 6400, y: GROUND_Y - 20 },
    { type: 'bat', x: 1900, y: 240, amplitudeY: 200 },
    { type: 'bat', x: 3800, y: 220, amplitudeY: 180 },
    { type: 'bat', x: 5600, y: 260, amplitudeY: 220 },
    { type: 'bat', x: 7200, y: 240, amplitudeY: 200 },
  ],

  spikes: [
    { x: 1400, y: GROUND_Y - 16, count: 3 },
    { x: 2800, y: GROUND_Y - 16, count: 4 },
    { x: 4200, y: GROUND_Y - 16, count: 3 },
    { x: 6000, y: GROUND_Y - 16, count: 5 },
    { x: 7500, y: GROUND_Y - 16, count: 3 },
  ],

  fallingLogs: [
    { x: 3100, triggerX: 3020, y: 100 },
    { x: 4700, triggerX: 4550, y: 90 },
    { x: 6300, triggerX: 6150, y: 110 },
  ],

  rollingRocks: [
    { x: 3500, y: 140, minX: 3300, maxX: 4000 },
    { x: 5200, y: 130, minX: 5050, maxX: 5650 },
    { x: 6800, y: 140, minX: 6550, maxX: 7150 },
  ],

  checkpoints: [
    { x: 3100, y: GROUND_Y - 40 },
    { x: 5600, y: GROUND_Y - 40 },
  ],

  portal: { x: 8000, y: GROUND_Y - 70 },

  decor: {
    treesNear: gen(0, 8200, 340, ['tree_near_1', 'tree_near_2']),
    treesFar: gen(0, 8200, 240, ['tree_far_1', 'tree_far_2']),
    bushes: gen(40, 8150, 260, ['bush']),
    flowers: gen(15, 8180, 120, ['flower_1', 'flower_2']),
    rocksDecor: gen(25, 8160, 420, ['rock_decor']),
  },
};

// =====================================================================
// FASE 3 — Cânion do Eco (desafio final do Mundo 1)
// =====================================================================
export const WORLD_1_LEVEL_3 = {
  id: 'w1_l3',
  name: 'Cânion do Eco',
  world: 1,
  index: 3,
  nextLevelId: null,
  groundY: GROUND_Y,
  levelWidth: 9000,
  levelHeight: GameConfigHeight(),
  playerStart: { x: 90, y: GROUND_Y - 100 },

  groundSegments: [
    [0, 700],
    [850, 380],
    [1400, 500],
    [2100, 450],
    [2750, 800],
    [3750, 400],
    [4350, 700],
    [5300, 500],
    [6000, 900],
    [7200, 600],
    [8000, 850],
  ],

  river: { x: 2750, width: 280, y: GROUND_Y + 10 },
  waterfall: { x: 6400, y: GROUND_Y - 300, width: 54, height: 300 },
  bridge: { x: 2785, y: GROUND_Y - 6, width: 220 },

  platforms: [
    { x: 1000, y: 380, width: 110, type: 'stone' },
    { x: 1180, y: 300, width: 100, type: 'wood' },
    { x: 1350, y: 220, width: 90, type: 'stone' },
    { x: 1600, y: 320, width: 120, type: 'wood' },
    { x: 1850, y: 250, width: 100, type: 'stone' },
    { x: 2300, y: 360, width: 130, type: 'wood' },
    { x: 2550, y: 280, width: 100, type: 'stone' },
    { x: 3100, y: 340, width: 140, type: 'stone' },
    { x: 3350, y: 260, width: 110, type: 'wood' },
    { x: 3600, y: 180, width: 100, type: 'stone' },
    { x: 4000, y: 300, width: 120, type: 'wood' },
    { x: 4200, y: 220, width: 100, type: 'stone' },
    { x: 4600, y: 340, width: 130, type: 'wood' },
    { x: 4900, y: 260, width: 110, type: 'stone' },
    { x: 5600, y: 320, width: 140, type: 'wood' },
    { x: 5850, y: 240, width: 100, type: 'stone' },
    { x: 6100, y: 180, width: 90, type: 'wood' },
    { x: 6800, y: 340, width: 130, type: 'stone' },
    { x: 7050, y: 260, width: 110, type: 'wood' },
    { x: 7500, y: 300, width: 140, type: 'stone' },
    { x: 7800, y: 220, width: 100, type: 'wood' },
  ],

  vines: [
    { x: 1100, y: 160, length: 220 },
    { x: 2400, y: 150, length: 200 },
    { x: 3500, y: 120, length: 200 },
    { x: 4800, y: 140, length: 210 },
    { x: 6000, y: 110, length: 220 },
    { x: 7600, y: 130, length: 200 },
  ],

  slopes: [
    { x: 700, y: GROUND_Y, width: 140, direction: 1 },
    { x: 8200, y: GROUND_Y, width: 140, direction: -1 },
  ],

  crates: [
    { x: 280, y: GROUND_Y - 30, loot: 'coin' },
    { x: 1020, y: 340, loot: 'crystal' },
    { x: 1620, y: 280, loot: 'coin' },
    { x: 2330, y: 320, loot: 'life' },
    { x: 3370, y: 220, loot: 'crystal' },
    { x: 4020, y: 260, loot: 'coin' },
    { x: 4920, y: 220, loot: 'crystal' },
    { x: 5620, y: 280, loot: 'coin' },
    { x: 6120, y: 140, loot: 'life' },
    { x: 7080, y: 220, loot: 'crystal' },
    { x: 7850, y: 180, loot: 'coin' },
  ],

  coins: [
    ...arc(400, 380, 5, 36),
    ...arc(1200, 200, 6, 30),
    ...arc(1900, 220, 5, 34),
    ...arc(3200, 200, 6, 32),
    ...arc(3650, 140, 5, 30),
    ...arc(4300, 180, 5, 34),
    ...arc(5100, 220, 6, 32),
    ...arc(6000, 160, 5, 30),
    ...arc(7200, 220, 6, 34),
    ...line(8300, GROUND_Y - 40, 8, 40),
  ],

  crystals: [
    { x: 180, y: 380 },
    { x: 1360, y: 160 },
    { x: 2580, y: 220 },
    { x: 3620, y: 120 },
    { x: 4220, y: 160 },
    { x: 5880, y: 180 },
    { x: 6120, y: 120 },
    { x: 7820, y: 160 },
    { x: 8600, y: 380 },
  ],

  enemies: [
    { type: 'slug', x: 550, y: GROUND_Y - 20, patrolMin: 450, patrolMax: 750 },
    { type: 'slug', x: 1600, y: GROUND_Y - 20, patrolMin: 1450, patrolMax: 1950 },
    { type: 'slug', x: 4500, y: GROUND_Y - 20, patrolMin: 4350, patrolMax: 4900 },
    { type: 'slug', x: 7500, y: GROUND_Y - 20, patrolMin: 7300, patrolMax: 7900 },
    { type: 'frog', x: 1050, y: GROUND_Y - 20, patrolMin: 900, patrolMax: 1300 },
    { type: 'frog', x: 3200, y: GROUND_Y - 20, patrolMin: 3000, patrolMax: 3600 },
    { type: 'frog', x: 5000, y: GROUND_Y - 20, patrolMin: 4800, patrolMax: 5400 },
    { type: 'frog', x: 7000, y: GROUND_Y - 20, patrolMin: 6800, patrolMax: 7400 },
    { type: 'boar', x: 2000, y: GROUND_Y - 20 },
    { type: 'boar', x: 4000, y: GROUND_Y - 20 },
    { type: 'boar', x: 5600, y: GROUND_Y - 20 },
    { type: 'boar', x: 8000, y: GROUND_Y - 20 },
    { type: 'bat', x: 1500, y: 220, amplitudeY: 180 },
    { type: 'bat', x: 3400, y: 200, amplitudeY: 160 },
    { type: 'bat', x: 4800, y: 240, amplitudeY: 200 },
    { type: 'bat', x: 6200, y: 200, amplitudeY: 180 },
    { type: 'bat', x: 7700, y: 220, amplitudeY: 200 },
  ],

  spikes: [
    { x: 1250, y: GROUND_Y - 16, count: 4 },
    { x: 2500, y: GROUND_Y - 16, count: 3 },
    { x: 3700, y: GROUND_Y - 16, count: 5 },
    { x: 5200, y: GROUND_Y - 16, count: 4 },
    { x: 6600, y: GROUND_Y - 16, count: 4 },
    { x: 8100, y: GROUND_Y - 16, count: 3 },
  ],

  fallingLogs: [
    { x: 2850, triggerX: 2760, y: 90 },
    { x: 4450, triggerX: 4300, y: 100 },
    { x: 6150, triggerX: 6000, y: 85 },
    { x: 7400, triggerX: 7250, y: 95 },
  ],

  rollingRocks: [
    { x: 3200, y: 130, minX: 3000, maxX: 3650 },
    { x: 4700, y: 120, minX: 4450, maxX: 5100 },
    { x: 6400, y: 130, minX: 6150, maxX: 6900 },
    { x: 7800, y: 120, minX: 7550, maxX: 8300 },
  ],

  checkpoints: [
    { x: 2900, y: GROUND_Y - 40 },
    { x: 5400, y: GROUND_Y - 40 },
    { x: 7500, y: GROUND_Y - 40 },
  ],

  portal: { x: 8800, y: GROUND_Y - 70 },

  decor: {
    treesNear: gen(0, 9000, 360, ['tree_near_1', 'tree_near_2']),
    treesFar: gen(0, 9000, 250, ['tree_far_1', 'tree_far_2']),
    bushes: gen(30, 8950, 280, ['bush']),
    flowers: gen(10, 8980, 110, ['flower_1', 'flower_2']),
    rocksDecor: gen(20, 8960, 380, ['rock_decor']),
  },
};

// ---- Registry --------------------------------------------------------
export const LEVELS = {
  w1_l1: WORLD_1_LEVEL_1,
  w1_l2: WORLD_1_LEVEL_2,
  w1_l3: WORLD_1_LEVEL_3,
};

/** Ordered list for the level-select UI and unlock chain. */
export const LEVEL_ORDER = ['w1_l1', 'w1_l2', 'w1_l3'];

export function getNextLevelId(levelId) {
  const level = LEVELS[levelId];
  return level?.nextLevelId || null;
}

export function getLevelList() {
  return LEVEL_ORDER.map((id) => LEVELS[id]).filter(Boolean);
}
