/**
 * TextureGenerator.js
 * -----------------------------------------------------------------------
 * The whole game is drawn with vector shapes generated at boot time via
 * Phaser.GameObjects.Graphics -> generateTexture(). This keeps the repo
 * asset-free and instantly runnable, while still giving every element in
 * the design doc (player frames, enemies, scenery, HUD icons...) its own
 * distinct look. Swapping any of this for hand-made sprite sheets later
 * only requires replacing the relevant function body - callers just ask
 * for a texture key.
 * -----------------------------------------------------------------------
 */
export class TextureGenerator {
  constructor(scene) {
    this.scene = scene;
    this.g = scene.add.graphics();
    this.g.setVisible(false);
  }

  /** Runs every generator. Call once from PreloadScene. */
  generateAll() {
    this.generatePlayerFrames();
    this.generateSlug();
    this.generateBoar();
    this.generateBat();
    this.generateEnvironment();
    this.generateParallaxArt();
    this.generateCollectibles();
    this.generateParticles();
    this.generateHudIcons();
    this.generateMisc();
    this.g.destroy();
  }

  // ---------------------------------------------------------------- utils
  fresh() {
    this.g.clear();
    return this.g;
  }

  save(key, w, h) {
    this.g.generateTexture(key, w, h);
  }

  // ------------------------------------------------------------- player
  generatePlayerFrames() {
    const skin = 0xf2c39c;
    const tunic = 0x3f8f4f;
    const tunicDark = 0x2e6b3b;
    const hair = 0x5b3a21;

    const drawBody = (g, legOffset, armAngle, crouch = 0) => {
      const w = 30, h = 44 - crouch;
      const cx = w / 2;
      // legs
      g.fillStyle(tunicDark, 1);
      g.fillRect(cx - 9, h - 12, 7, 12 + legOffset);
      g.fillRect(cx + 2, h - 12, 7, 12 - legOffset);
      // tunic body
      g.fillStyle(tunic, 1);
      g.fillRoundedRect(cx - 11, 14 - crouch * 0.5, 22, h - 22, 6);
      // belt
      g.fillStyle(0x8a5a2b, 1);
      g.fillRect(cx - 11, h - 20, 22, 4);
      // arm
      g.fillStyle(skin, 1);
      g.fillRect(cx + 9, 18 - crouch * 0.5 + armAngle, 6, 16);
      // head
      g.fillStyle(skin, 1);
      g.fillCircle(cx, 10, 10);
      // hair
      g.fillStyle(hair, 1);
      g.fillEllipse(cx, 3, 20, 10);
      g.fillRect(cx - 10, 2, 20, 6);
      // eyes
      g.fillStyle(0x222222, 1);
      g.fillCircle(cx + 3, 10, 1.6);
    };

    // idle (2-frame breathing)
    ['idle_0', 'idle_1'].forEach((key, i) => {
      const g = this.fresh();
      drawBody(g, 0, i === 0 ? 0 : 1, i === 0 ? 0 : 1);
      this.save(key, 30, 44);
    });

    // run (4-frame)
    for (let i = 0; i < 4; i++) {
      const g = this.fresh();
      const swing = Math.sin((i / 4) * Math.PI * 2) * 8;
      drawBody(g, swing, -swing * 0.4);
      this.save(`run_${i}`, 30, 44);
    }

    // jump / fall / land
    ['jump', 'fall', 'land'].forEach((key) => {
      const g = this.fresh();
      const crouch = key === 'land' ? 10 : 0;
      drawBody(g, key === 'jump' ? -10 : 6, key === 'jump' ? -6 : 4, crouch);
      this.save(`player_${key}`, 30, 44);
    });

    // hurt
    {
      const g = this.fresh();
      drawBody(g, -4, 8);
      g.fillStyle(0xff4444, 0.35);
      g.fillRoundedRect(4, 12, 22, 26, 6);
      this.save('player_hurt', 30, 44);
    }

    // attack (spin) - 3 frame spin blur
    for (let i = 0; i < 3; i++) {
      const g = this.fresh();
      drawBody(g, 0, 0);
      g.lineStyle(3, 0xffe27a, 0.9 - i * 0.2);
      g.strokeCircle(15, 22, 20 - i * 2);
      this.save(`attack_${i}`, 40, 44);
    }
  }

  // ------------------------------------------------------------- enemies
  generateSlug() {
    for (let i = 0; i < 2; i++) {
      const g = this.fresh();
      const squish = i === 0 ? 0 : 3;
      g.fillStyle(0x8c4fae, 1);
      g.fillEllipse(20, 16 + squish / 2, 34, 18 - squish);
      g.fillStyle(0x6b3486, 1);
      g.fillEllipse(20, 10, 20, 10);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(28, 6, 3);
      g.fillCircle(14, 6, 3);
      g.fillStyle(0x222222, 1);
      g.fillCircle(28, 6, 1.4);
      g.fillCircle(14, 6, 1.4);
      this.save(`slug_${i}`, 40, 26);
    }
  }

  generateBoar() {
    for (let i = 0; i < 2; i++) {
      const g = this.fresh();
      const legOff = i === 0 ? 0 : 6;
      g.fillStyle(0x5a3d2b, 1);
      g.fillRect(8, 26, 5, 10 + legOff);
      g.fillRect(35, 26, 5, 10 - legOff);
      g.fillRect(14, 26, 5, 10 - legOff);
      g.fillRect(29, 26, 5, 10 + legOff);
      g.fillStyle(0x7a5236, 1);
      g.fillEllipse(26, 20, 46, 24);
      g.fillStyle(0x7a5236, 1);
      g.fillEllipse(48, 16, 18, 16);
      g.fillStyle(0xe8d3b0, 1);
      g.fillTriangle(54, 18, 62, 16, 54, 22);
      g.fillStyle(0x2a1a10, 1);
      g.fillCircle(52, 12, 2);
      g.fillStyle(0x3a2416, 1);
      g.fillTriangle(38, 4, 44, 2, 42, 10);
      this.save(`boar_${i}`, 66, 40);
    }
  }

  generateBat() {
    for (let i = 0; i < 2; i++) {
      const g = this.fresh();
      const wingUp = i === 0;
      g.fillStyle(0x3a2f4a, 1);
      g.fillEllipse(22, 16, 16, 14);
      g.fillStyle(0x2a2038, 1);
      const wy = wingUp ? 4 : 20;
      g.fillTriangle(22, 12, 2, wy, 14, 20);
      g.fillTriangle(22, 12, 42, wy, 30, 20);
      g.fillStyle(0xff5555, 1);
      g.fillCircle(18, 13, 1.6);
      g.fillCircle(26, 13, 1.6);
      this.save(`bat_${i}`, 44, 28);
    }
  }

  // ---------------------------------------------------------- environment
  generateEnvironment() {
    // Ground tile (grass top + dirt)
    {
      const g = this.fresh();
      const w = 64, h = 64;
      g.fillStyle(0x4a3222, 1);
      g.fillRect(0, 0, w, h);
      g.fillStyle(0x3a7d3f, 1);
      g.fillRect(0, 0, w, 16);
      g.fillStyle(0x4f9a52, 1);
      for (let i = 0; i < 8; i++) {
        g.fillTriangle(i * 8, 16, i * 8 + 4, 16 - 6 - (i % 3) * 2, i * 8 + 8, 16);
      }
      this.save('tile_ground', w, h);
    }

    // wood platform
    {
      const g = this.fresh();
      const w = 64, h = 20;
      g.fillStyle(0x8a5a2b, 1);
      g.fillRoundedRect(0, 0, w, h, 4);
      g.fillStyle(0x6e4420, 1);
      for (let i = 0; i < 4; i++) g.fillRect(i * 16 + 2, 0, 2, h);
      g.fillStyle(0xa06e34, 1);
      g.fillRect(0, 0, w, 3);
      this.save('tile_wood', w, h);
    }

    // stone platform
    {
      const g = this.fresh();
      const w = 64, h = 22;
      g.fillStyle(0x8a8a8a, 1);
      g.fillRoundedRect(0, 0, w, h, 3);
      g.fillStyle(0x6f6f6f, 1);
      g.fillRect(0, h - 6, w, 6);
      g.lineStyle(1, 0x5a5a5a, 0.8);
      for (let i = 0; i < 5; i++) g.lineBetween(i * 13, 0, i * 13, h);
      this.save('tile_stone', w, h);
    }

    // water
    {
      const g = this.fresh();
      const w = 64, h = 64;
      g.fillStyle(0x2f7fb0, 1);
      g.fillRect(0, 0, w, h);
      g.fillStyle(0x4fa3d6, 0.6);
      for (let i = 0; i < 3; i++) g.fillEllipse(w / 2, 8 + i * 20, 60, 6);
      this.save('tile_water', w, h);
    }

    // waterfall
    {
      const g = this.fresh();
      const w = 46, h = 64;
      g.fillStyle(0xbfe6f5, 0.9);
      g.fillRect(0, 0, w, h);
      g.fillStyle(0xffffff, 0.5);
      for (let i = 0; i < 6; i++) g.fillRect(i * 8, 0, 3, h);
      this.save('tile_waterfall', w, h);
    }

    // bridge plank
    {
      const g = this.fresh();
      const w = 40, h = 16;
      g.fillStyle(0x8a5a2b, 1);
      g.fillRect(0, 0, w, h);
      g.fillStyle(0x6e4420, 1);
      g.fillRect(0, 0, w, 3);
      g.fillRect(0, h - 3, w, 3);
      this.save('tile_bridge', w, h);
    }

    // spikes
    {
      const g = this.fresh();
      const w = 32, h = 24;
      g.fillStyle(0x9a9a9a, 1);
      for (let i = 0; i < 3; i++) g.fillTriangle(i * 11, h, i * 11 + 5, 0, i * 11 + 11, h);
      this.save('tile_spikes', w, h);
    }

    // crate
    {
      const g = this.fresh();
      const w = 32, h = 32;
      g.fillStyle(0x9a6a35, 1);
      g.fillRect(0, 0, w, h);
      g.lineStyle(2, 0x6e4420, 1);
      g.strokeRect(1, 1, w - 2, h - 2);
      g.lineBetween(0, 0, w, h);
      g.lineBetween(w, 0, 0, h);
      this.save('crate', w, h);
    }

    // crate debris piece
    {
      const g = this.fresh();
      g.fillStyle(0x9a6a35, 1);
      g.fillRect(0, 0, 8, 8);
      this.save('crate_debris', 8, 8);
    }

    // log (falling trap)
    {
      const g = this.fresh();
      const w = 90, h = 26;
      g.fillStyle(0x6e4420, 1);
      g.fillRoundedRect(0, 0, w, h, 10);
      g.fillStyle(0x8a5a2b, 1);
      g.fillEllipse(6, h / 2, 10, h - 4);
      g.fillEllipse(w - 6, h / 2, 10, h - 4);
      this.save('log', w, h);
    }

    // rolling rock
    {
      const g = this.fresh();
      const r = 22;
      g.fillStyle(0x8a8a8a, 1);
      g.fillCircle(r, r, r);
      g.fillStyle(0x6f6f6f, 1);
      g.fillCircle(r - 6, r - 6, 5);
      g.fillCircle(r + 7, r + 4, 4);
      this.save('rolling_rock', r * 2, r * 2);
    }

    // checkpoint flag (2 frames: idle / active)
    ['flag_off', 'flag_on'].forEach((key, i) => {
      const g = this.fresh();
      g.fillStyle(0x6e4420, 1);
      g.fillRect(6, 0, 4, 70);
      g.fillStyle(i === 0 ? 0x888888 : 0xffd23f, 1);
      g.fillTriangle(10, 6, 46, 16, 10, 26);
      this.save(key, 50, 70);
    });

    // portal (2 frames for subtle animation)
    ['portal_0', 'portal_1'].forEach((key, i) => {
      const g = this.fresh();
      const w = 90, h = 140;
      g.lineStyle(6, 0xffd23f, 1);
      g.strokeEllipse(w / 2, h / 2, w - 16, h - 10);
      g.fillStyle(0x7d3fae, i === 0 ? 0.55 : 0.75);
      g.fillEllipse(w / 2, h / 2, w - 26, h - 20);
      g.fillStyle(0xffffff, 0.5);
      g.fillEllipse(w / 2, h / 2, w - 46, h - 50);
      this.save(key, w, h);
    });
  }

  // ------------------------------------------------------------- parallax
  generateParallaxArt() {
    // sky gradient
    {
      const g = this.fresh();
      const w = 960, h = 540;
      const top = Phaser.Display.Color.ValueToColor(0x8fd3f4);
      const bot = Phaser.Display.Color.ValueToColor(0xe7fbe0);
      for (let i = 0; i < h; i += 4) {
        const t = i / h;
        const col = Phaser.Display.Color.Interpolate.ColorWithColor(top, bot, h, i);
        g.fillStyle(Phaser.Display.Color.GetColor(col.r, col.g, col.b), 1);
        g.fillRect(0, i, w, 4);
      }
      this.save('sky', w, h);
    }

    // cloud
    {
      const g = this.fresh();
      g.fillStyle(0xffffff, 0.9);
      g.fillEllipse(30, 20, 60, 30);
      g.fillEllipse(60, 14, 46, 24);
      g.fillEllipse(90, 22, 56, 26);
      this.save('cloud', 130, 44);
    }

    // mountain silhouette
    {
      const g = this.fresh();
      const w = 400, h = 220;
      g.fillStyle(0x8aa3c9, 1);
      g.fillTriangle(0, h, 120, 20, 240, h);
      g.fillTriangle(140, h, 280, 60, 400, h);
      g.fillStyle(0xffffff, 0.6);
      g.fillTriangle(100, 60, 120, 20, 140, 60);
      this.save('mountain', w, h);
    }

    // tree far silhouettes
    ['tree_far_1', 'tree_far_2'].forEach((key, i) => {
      const g = this.fresh();
      const w = 70, h = 160;
      g.fillStyle(0x4f7d5c, 1);
      g.fillTriangle(w / 2, 0, 4, h - 40, w - 4, h - 40);
      g.fillTriangle(w / 2, 30 + i * 6, 10, h - 10, w - 10, h - 10);
      g.fillStyle(0x3a5c44, 1);
      g.fillRect(w / 2 - 5, h - 40, 10, 40);
      this.save(key, w, h);
    });

    // tree near (richer, foreground-ish but still background layer)
    ['tree_near_1', 'tree_near_2'].forEach((key, i) => {
      const g = this.fresh();
      const w = 140, h = 260;
      g.fillStyle(0x3f5c33, 1);
      g.fillCircle(w / 2, 70, 66);
      g.fillCircle(w / 2 - 40, 100, 46);
      g.fillCircle(w / 2 + 40, 100, 46);
      g.fillStyle(0x2e6b3b, 1);
      g.fillCircle(w / 2, 60, 54);
      g.fillStyle(0x6e4420, 1);
      g.fillRect(w / 2 - 12, 110, 24, h - 110);
      this.save(key, w, h);
    });

    // foreground leaves / grass tufts
    {
      const g = this.fresh();
      const w = 200, h = 90;
      g.fillStyle(0x1f4a28, 1);
      for (let i = 0; i < 5; i++) {
        g.fillTriangle(i * 40, h, i * 40 + 20, h - 70, i * 40 + 40, h);
      }
      this.save('foreground_leaves', w, h);
    }

    {
      const g = this.fresh();
      const w = 60, h = 30;
      g.fillStyle(0x2e6b3b, 1);
      for (let i = 0; i < 4; i++) g.fillTriangle(i * 16, h, i * 16 + 8, 0, i * 16 + 16, h);
      this.save('grass_tuft', w, h);
    }
  }

  // ---------------------------------------------------------- collectibles
  generateCollectibles() {
    // coin (2-frame spin)
    ['coin_0', 'coin_1'].forEach((key, i) => {
      const g = this.fresh();
      const w = i === 0 ? 20 : 10;
      g.fillStyle(0xffd23f, 1);
      g.fillEllipse(10, 10, w, 20);
      g.lineStyle(2, 0xd19a1a, 1);
      g.strokeEllipse(10, 10, w, 20);
      this.save(key, 20, 20);
    });

    // crystal
    {
      const g = this.fresh();
      g.fillStyle(0x5fdff0, 0.95);
      g.fillTriangle(12, 0, 0, 16, 24, 16);
      g.fillTriangle(0, 16, 24, 16, 12, 30);
      g.fillStyle(0xffffff, 0.6);
      g.fillTriangle(12, 3, 6, 15, 12, 12);
      this.save('crystal', 24, 30);
    }

    // heart (life pickup / HUD)
    {
      const g = this.fresh();
      g.fillStyle(0xff5566, 1);
      g.fillCircle(6, 6, 6);
      g.fillCircle(14, 6, 6);
      g.fillTriangle(0, 8, 20, 8, 10, 20);
      this.save('heart', 20, 20);
    }
    {
      const g = this.fresh();
      g.fillStyle(0x555555, 0.5);
      g.fillCircle(6, 6, 6);
      g.fillCircle(14, 6, 6);
      g.fillTriangle(0, 8, 20, 8, 10, 20);
      this.save('heart_empty', 20, 20);
    }
  }

  // ------------------------------------------------------------ particles
  generateParticles() {
    { const g = this.fresh(); g.fillStyle(0xffffff, 1); g.fillCircle(4, 4, 4); this.save('particle_dot', 8, 8); }
    { const g = this.fresh(); g.fillStyle(0xd8c39a, 1); g.fillCircle(3, 3, 3); this.save('particle_dust', 6, 6); }
    // 4-point spark — Phaser.Graphics has no fillStar(); draw polygon manually
    {
      const g = this.fresh();
      const cx = 6, cy = 6, points = 4, inner = 3, outer = 6;
      const pts = [];
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const a = -Math.PI / 2 + (i * Math.PI) / points;
        pts.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      g.fillStyle(0xffe27a, 1);
      g.beginPath();
      for (let i = 0; i < pts.length; i += 2) {
        if (i === 0) g.moveTo(pts[i], pts[i + 1]);
        else g.lineTo(pts[i], pts[i + 1]);
      }
      g.closePath();
      g.fillPath();
      this.save('particle_spark', 12, 12);
    }
  }

  // ------------------------------------------------------------- hud
  generateHudIcons() {
    { const g = this.fresh(); g.fillStyle(0xffd23f, 1); g.fillCircle(10, 10, 9); g.lineStyle(2, 0xd19a1a); g.strokeCircle(10, 10, 9); this.save('icon_coin', 20, 20); }
    { const g = this.fresh(); g.fillStyle(0x5fdff0, 1); g.fillTriangle(10, 0, 0, 12, 20, 12); g.fillTriangle(0, 12, 20, 12, 10, 22); this.save('icon_crystal', 20, 22); }

    // Filled star (5-point) for the level-complete / menu star rating.
    // Drawn with path API — Graphics has no fillStar() in Phaser 3.
    {
      const g = this.fresh();
      const cx = 16, cy = 16, outer = 14, inner = 6;
      g.fillStyle(0xffd23f, 1);
      g.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.closePath();
      g.fillPath();
      g.lineStyle(2, 0xd19a1a, 1);
      g.strokePath();
      this.save('star_full', 32, 32);
    }
    // Empty / outline star
    {
      const g = this.fresh();
      const cx = 16, cy = 16, outer = 14, inner = 6;
      g.fillStyle(0x2a3a2a, 0.55);
      g.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.closePath();
      g.fillPath();
      g.lineStyle(2, 0x6a7a5a, 1);
      g.strokePath();
      this.save('star_empty', 32, 32);
    }
  }

  // ------------------------------------------------------------- misc
  generateMisc() {
    // 1x1 white pixel for tinted rectangles / flashes
    { const g = this.fresh(); g.fillStyle(0xffffff, 1); g.fillRect(0, 0, 4, 4); this.save('pixel', 4, 4); }
    // flower variants
    ['flower_1', 'flower_2'].forEach((key, i) => {
      const g = this.fresh();
      const petal = i === 0 ? 0xff8fb4 : 0xffe27a;
      g.fillStyle(0x2e6b3b, 1);
      g.fillRect(6, 8, 2, 10);
      g.fillStyle(petal, 1);
      for (let a = 0; a < 5; a++) {
        const ang = (a / 5) * Math.PI * 2;
        g.fillCircle(7 + Math.cos(ang) * 4, 6 + Math.sin(ang) * 4, 3);
      }
      g.fillStyle(0xd1901a, 1);
      g.fillCircle(7, 6, 2);
      this.save(key, 14, 20);
    });
    // rock decor
    {
      const g = this.fresh();
      g.fillStyle(0x8a8a8a, 1);
      g.fillEllipse(20, 14, 40, 22);
      g.fillStyle(0x6f6f6f, 1);
      g.fillEllipse(20, 18, 40, 12);
      this.save('rock_decor', 40, 28);
    }
    // bush
    {
      const g = this.fresh();
      g.fillStyle(0x2e6b3b, 1);
      g.fillCircle(20, 20, 20);
      g.fillCircle(8, 24, 14);
      g.fillCircle(34, 24, 14);
      g.fillStyle(0x3f8f4f, 1);
      g.fillCircle(20, 14, 16);
      this.save('bush', 44, 40);
    }
    // vine
    {
      const g = this.fresh();
      const w = 12, h = 160;
      g.fillStyle(0x2e6b3b, 1);
      g.fillRect(w / 2 - 2, 0, 4, h);
      for (let i = 0; i < 6; i++) {
        g.fillCircle(w / 2, i * 26 + 10, 6);
      }
      this.save('vine', w, h);
    }
  }
}
