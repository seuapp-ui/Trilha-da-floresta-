import { GameConfig } from '../config/GameConfig.js';

/**
 * Map.js
 * -----------------------------------------------------------------------
 * Builds the "main map" parallax layer (scrollFactor 1.0): ground tiles,
 * floating platforms, the river/bridge/waterfall, slopes, spikes and all
 * static forest decoration (trees close to the path, bushes, flowers,
 * rocks, vines). Everything is generated from the data-only LevelData
 * file, so a new level only needs new data - this class never needs to
 * change to support it.
 * -----------------------------------------------------------------------
 */
export class Map {
  constructor(scene, levelData) {
    this.scene = scene;
    this.data = levelData;

    this.groundGroup = scene.physics.add.staticGroup();
    this.platformGroup = scene.physics.add.staticGroup();
    this.waterZone = null;
    this.spikeGroup = scene.physics.add.staticGroup();
    this.slopeZones = [];

    this._buildGround();
    this._buildRiverAndBridge();
    this._buildPlatforms();
    this._buildSpikes();
    this._buildDecor();
    this._buildVines();
  }

  _buildGround() {
    const { groundSegments, groundY } = this.data;
    const D = GameConfig.DEPTH.MAIN_TERRAIN;
    groundSegments.forEach(([x, width]) => {
      const tileW = 64;
      const count = Math.ceil(width / tileW);
      for (let i = 0; i < count; i++) {
        const tx = x + i * tileW + tileW / 2;
        const tile = this.groundGroup.create(tx, groundY, 'tile_ground');
        tile.setOrigin(0.5, 0);
        tile.setDepth(D);
        // static bodies must have size/offset set BEFORE refreshBody(),
        // otherwise the body's cached position/size becomes stale.
        tile.body.setSize(tileW, 64);
        tile.refreshBody();
      }
    });
  }

  _buildRiverAndBridge() {
    const { river, waterfall, bridge, groundY } = this.data;
    const D = GameConfig.DEPTH.MAIN_TERRAIN;

    if (river) {
      const water = this.scene.add.tileSprite(river.x, river.y, river.width, 80, 'tile_water')
        .setOrigin(0, 0)
        .setDepth(D - 1);
      // Keep the damage volume aligned with the visible water surface.
      this.waterZone = this.scene.add.zone(river.x, river.y, river.width, 80).setOrigin(0, 0);
      this.scene.physics.add.existing(this.waterZone, true);
      this._waterTile = water;
    }

    if (waterfall) {
      this.scene.add.tileSprite(waterfall.x, waterfall.y, waterfall.width, waterfall.height, 'tile_waterfall')
        .setOrigin(0, 0)
        .setDepth(D - 1)
        .setAlpha(0.85);
    }

    if (bridge) {
      const plankW = 40;
      const count = Math.ceil(bridge.width / plankW);
      for (let i = 0; i < count; i++) {
        const plank = this.groundGroup.create(bridge.x + i * plankW + plankW / 2, bridge.y, 'tile_bridge');
        plank.setOrigin(0.5, 0.5);
        plank.setDepth(D);
        plank.refreshBody();
      }
    }
  }

  _buildPlatforms() {
    const D = GameConfig.DEPTH.MAIN_TERRAIN;
    this.data.platforms.forEach((p) => {
      const texture = p.type === 'wood' ? 'tile_wood' : 'tile_stone';
      const tileW = 64;
      const count = Math.max(1, Math.round(p.width / tileW));
      const startX = p.x - (count * tileW) / 2 + tileW / 2;
      for (let i = 0; i < count; i++) {
        const tile = this.platformGroup.create(startX + i * tileW, p.y, texture);
        tile.setDepth(D);
        tile.refreshBody();
      }
    });
  }

  _buildSpikes() {
    const D = GameConfig.DEPTH.MAIN_TERRAIN + 1;
    this.data.spikes.forEach((s) => {
      for (let i = 0; i < s.count; i++) {
        const tile = this.spikeGroup.create(s.x + i * 32 + 16, s.y, 'tile_spikes');
        tile.setDepth(D);
        tile.setOrigin(0.5, 1);
        tile.body.setSize(28, 14).setOffset(2, 10);
        tile.refreshBody();
      }
    });

    this.data.slopes.forEach((s) => this.slopeZones.push(s));
  }

  _buildVines() {
    const D = GameConfig.DEPTH.BACKGROUND_DECOR;
    (this.data.vines || []).forEach((v) => {
      this.scene.add.image(v.x, v.y, 'vine').setOrigin(0.5, 0).setDepth(D)
        .setDisplaySize(12, v.length);
    });
  }

  _buildDecor() {
    const D = GameConfig.DEPTH.BACKGROUND_DECOR;
    const decor = this.data.decor;
    if (!decor) return;

    const place = (list, originY = 1, scaleRange = [0.8, 1.2], depth = D) => {
      (list || []).forEach((item) => {
        this.scene.add.image(item.x, this.data.groundY, item.variant)
          .setOrigin(0.5, originY)
          .setDepth(depth)
          .setScale(Phaser.Math.FloatBetween(scaleRange[0], scaleRange[1]));
      });
    };

    // Near trees sit behind platforms but in front of far scenery
    place(decor.treesNear, 1, [0.85, 1.15], GameConfig.DEPTH.TREES_NEAR);
    place(decor.bushes, 1, [0.85, 1.2]);
    place(decor.flowers, 1, [0.9, 1.35]);
    place(decor.rocksDecor, 1, [0.8, 1.15]);

    // Grass tufts along the ground for extra detail (deterministic spacing)
    for (let i = 0, x = 40; x < this.data.levelWidth; i++) {
      this.scene.add.image(x, this.data.groundY + 2, 'grass_tuft')
        .setOrigin(0.5, 1)
        .setDepth(D + 1)
        .setScale(0.75 + (i % 5) * 0.08);
      x += 75 + (i % 4) * 18;
    }
  }

  /** Returns true if the given world x,y falls inside a slope zone, and its direction. */
  getSlopeAt(x) {
    return this.slopeZones.find((s) => x >= s.x && x <= s.x + s.width) || null;
  }
}
