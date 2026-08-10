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

export const LEVELS = {
  w1_l1: WORLD_1_LEVEL_1,
};
