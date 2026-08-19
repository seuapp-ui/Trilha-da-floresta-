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
    this.generateFrog();
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
    const skin = 0xf4c9a0;
    const skinShadow = 0xd9a87a;
    const tunic = 0x3f8f4f;
    const tunicDark = 0x2a6a36;
    const tunicLight = 0x55a865;
    const hair = 0x4a2e18;
    const hairLight = 0x6b4428;
    const boot = 0x3d2a1a;
    const belt = 0x8a5a2b;

    const drawBody = (g, legOffset, armAngle, crouch = 0, spinBlur = false) => {
      const w = 32;
      const h = 46 - crouch;
      const cx = w / 2;

      // soft ground shadow
      g.fillStyle(0x000000, 0.18);
      g.fillEllipse(cx, h + 1, 18, 5);

      // boots
      g.fillStyle(boot, 1);
      g.fillRoundedRect(cx - 10, h - 6, 8, 7, 2);
      g.fillRoundedRect(cx + 2, h - 6, 8, 7, 2);

      // legs
      g.fillStyle(tunicDark, 1);
      g.fillRect(cx - 9, h - 14, 7, 10 + legOffset);
      g.fillRect(cx + 2, h - 14, 7, 10 - legOffset);

      // tunic body with slight gradient feel
      g.fillStyle(tunic, 1);
      g.fillRoundedRect(cx - 11, 15 - crouch * 0.5, 22, h - 24, 7);
      g.fillStyle(tunicLight, 0.35);
      g.fillRoundedRect(cx - 8, 16 - crouch * 0.5, 10, h - 30, 4);

      // belt + buckle
      g.fillStyle(belt, 1);
      g.fillRect(cx - 11, h - 18, 22, 4);
      g.fillStyle(0xd4a84a, 1);
      g.fillRect(cx - 3, h - 18, 6, 4);

      // arm
      g.fillStyle(skin, 1);
      g.fillRoundedRect(cx + 9, 19 - crouch * 0.5 + armAngle, 6, 15, 2);
      g.fillStyle(skinShadow, 0.5);
      g.fillRect(cx + 9, 28 - crouch * 0.5 + armAngle, 6, 4);

      // head
      g.fillStyle(skin, 1);
      g.fillCircle(cx, 11, 10);
      g.fillStyle(skinShadow, 0.35);
      g.fillEllipse(cx, 15, 14, 6);

      // hair - fuller style
      g.fillStyle(hair, 1);
      g.fillEllipse(cx, 4, 22, 12);
      g.fillRect(cx - 11, 3, 22, 7);
      g.fillStyle(hairLight, 0.45);
      g.fillEllipse(cx - 4, 3, 10, 7);

      // eyes
      g.fillStyle(0x1a1a1a, 1);
      g.fillCircle(cx + 3.5, 11, 1.8);
      g.fillCircle(cx - 1.5, 11, 1.5);
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(cx + 4, 10.2, 0.7);

      // blush
      g.fillStyle(0xff9a8a, 0.35);
      g.fillEllipse(cx + 7, 14, 5, 3);

      if (spinBlur) {
        g.lineStyle(3, 0xffe27a, 0.85);
        g.strokeCircle(cx, 22, 22);
        g.lineStyle(2, 0xfff0b0, 0.5);
        g.strokeCircle(cx, 22, 18);
      }
    };

    // idle (2-frame breathing)
    ['idle_0', 'idle_1'].forEach((key, i) => {
      const g = this.fresh();
      drawBody(g, 0, i === 0 ? 0 : 1.5, i === 0 ? 0 : 1);
      this.save(key, 32, 48);
    });

    // run (4-frame)
    for (let i = 0; i < 4; i++) {
      const g = this.fresh();
      const swing = Math.sin((i / 4) * Math.PI * 2) * 9;
      drawBody(g, swing, -swing * 0.45);
      this.save(`run_${i}`, 32, 48);
    }

    // jump / fall / land
    ['jump', 'fall', 'land'].forEach((key) => {
      const g = this.fresh();
      const crouch = key === 'land' ? 10 : 0;
      drawBody(g, key === 'jump' ? -11 : 7, key === 'jump' ? -7 : 5, crouch);
      this.save(`player_${key}`, 32, 48);
    });

    // hurt
    {
      const g = this.fresh();
      drawBody(g, -4, 8);
      g.fillStyle(0xff4444, 0.4);
      g.fillRoundedRect(5, 12, 22, 28, 6);
      this.save('player_hurt', 32, 48);
    }

    // attack (spin) - 3 frame spin blur, same canvas size as idle for consistent body offset
    for (let i = 0; i < 3; i++) {
      const g = this.fresh();
      drawBody(g, 0, 0, 0, true);
      g.lineStyle(4 - i, 0xffe27a, 0.9 - i * 0.22);
      g.strokeCircle(16, 24, 22 - i * 2.5);
      this.save(`attack_${i}`, 32, 48);
    }
  }

  // ------------------------------------------------------------- enemies
  generateSlug() {
    for (let i = 0; i < 2; i++) {
      const g = this.fresh();
      const squish = i === 0 ? 0 : 4;
      // shadow
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(22, 24, 34, 6);
      // body
      g.fillStyle(0x9b5fc0, 1);
      g.fillEllipse(22, 16 + squish / 2, 36, 18 - squish);
      // shell ridge
      g.fillStyle(0x7a3fa0, 1);
      g.fillEllipse(22, 10 + squish / 3, 22, 11 - squish / 2);
      g.fillStyle(0xb87ad6, 0.5);
      g.fillEllipse(18, 8, 12, 7);
      // eyes on stalks
      g.fillStyle(0xffffff, 1);
      g.fillCircle(30, 5 + squish * 0.3, 3.5);
      g.fillCircle(14, 5 + squish * 0.3, 3.5);
      g.fillStyle(0x222222, 1);
      g.fillCircle(30.5, 5 + squish * 0.3, 1.6);
      g.fillCircle(14.5, 5 + squish * 0.3, 1.6);
      // shine
      g.fillStyle(0xffffff, 0.35);
      g.fillEllipse(14, 14, 8, 4);
      this.save(`slug_${i}`, 44, 28);
    }
  }

  generateBoar() {
    for (let i = 0; i < 2; i++) {
      const g = this.fresh();
      const legOff = i === 0 ? 0 : 7;
      // shadow
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(30, 38, 48, 8);
      // legs
      g.fillStyle(0x4a3020, 1);
      g.fillRect(10, 26, 6, 12 + legOff);
      g.fillRect(38, 26, 6, 12 - legOff);
      g.fillRect(18, 26, 6, 12 - legOff);
      g.fillRect(32, 26, 6, 12 + legOff);
      // body
      g.fillStyle(0x7a5236, 1);
      g.fillEllipse(28, 20, 48, 26);
      g.fillStyle(0x9a6a48, 0.4);
      g.fillEllipse(24, 16, 28, 14);
      // head
      g.fillStyle(0x7a5236, 1);
      g.fillEllipse(52, 16, 20, 18);
      // snout
      g.fillStyle(0xe8d3b0, 1);
      g.fillTriangle(58, 18, 68, 15, 58, 24);
      g.fillStyle(0xd4b890, 1);
      g.fillCircle(66, 17, 3);
      // eye
      g.fillStyle(0x1a1008, 1);
      g.fillCircle(54, 12, 2.2);
      g.fillStyle(0xffffff, 0.5);
      g.fillCircle(54.5, 11.3, 0.8);
      // tusks
      g.fillStyle(0xf5f0e0, 1);
      g.fillTriangle(58, 22, 64, 26, 56, 24);
      g.fillTriangle(58, 14, 64, 10, 56, 16);
      // ear / mane
      g.fillStyle(0x3a2416, 1);
      g.fillTriangle(40, 4, 48, 0, 46, 12);
      this.save(`boar_${i}`, 72, 42);
    }
  }

  generateBat() {
    for (let i = 0; i < 2; i++) {
      const g = this.fresh();
      const wingUp = i === 0;
      // body
      g.fillStyle(0x3a2f4a, 1);
      g.fillEllipse(24, 18, 18, 16);
      g.fillStyle(0x4a3f5a, 0.5);
      g.fillEllipse(24, 16, 12, 10);
      // wings
      g.fillStyle(0x2a2038, 1);
      const wy = wingUp ? 2 : 24;
      g.fillTriangle(24, 14, 0, wy, 14, 22);
      g.fillTriangle(24, 14, 48, wy, 34, 22);
      // membrane highlight
      g.fillStyle(0x5a4a70, 0.4);
      g.fillTriangle(24, 14, 6, wy + 4, 16, 20);
      g.fillTriangle(24, 14, 42, wy + 4, 32, 20);
      // eyes
      g.fillStyle(0xff5555, 1);
      g.fillCircle(20, 15, 2.2);
      g.fillCircle(28, 15, 2.2);
      g.fillStyle(0xffffff, 0.6);
      g.fillCircle(20.5, 14.3, 0.7);
      g.fillCircle(28.5, 14.3, 0.7);
      // ears
      g.fillStyle(0x3a2f4a, 1);
      g.fillTriangle(18, 8, 16, 2, 22, 8);
      g.fillTriangle(30, 8, 32, 2, 26, 8);
      this.save(`bat_${i}`, 48, 30);
    }
  }


  generateFrog() {
    for (let i = 0; i < 2; i++) {
      const g = this.fresh();
      const crouch = i === 0 ? 0 : 4;
      // shadow
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(22, 28, 36, 6);
      // body
      g.fillStyle(0x4a9a3a, 1);
      g.fillEllipse(22, 16 + crouch / 2, 34, 20 - crouch);
      // belly
      g.fillStyle(0xa8d878, 1);
      g.fillEllipse(22, 20 + crouch / 3, 20, 10 - crouch / 2);
      // eyes
      g.fillStyle(0xffffff, 1);
      g.fillCircle(14, 8 + crouch * 0.2, 5);
      g.fillCircle(30, 8 + crouch * 0.2, 5);
      g.fillStyle(0x1a1a1a, 1);
      g.fillCircle(14.5, 8 + crouch * 0.2, 2.2);
      g.fillCircle(30.5, 8 + crouch * 0.2, 2.2);
      g.fillStyle(0xffffff, 0.6);
      g.fillCircle(15, 7, 0.8);
      g.fillCircle(31, 7, 0.8);
      // legs
      g.fillStyle(0x3a7a2e, 1);
      g.fillEllipse(8, 24 + crouch / 2, 12, 8);
      g.fillEllipse(36, 24 + crouch / 2, 12, 8);
      this.save(`frog_${i}`, 44, 32);
    }
  }

  // ---------------------------------------------------------- environment
  generateEnvironment() {
    // Ground tile (grass top + dirt with depth)
    {
      const g = this.fresh();
      const w = 64, h = 64;
      g.fillStyle(0x5a3a22, 1);
      g.fillRect(0, 0, w, h);
      g.fillStyle(0x4a2e18, 1);
      for (let i = 0; i < 6; i++) {
        g.fillRect(i * 12 + 4, 28 + (i % 3) * 8, 8, 4);
      }
      // grass top band
      g.fillStyle(0x3a7d3f, 1);
      g.fillRect(0, 0, w, 18);
      g.fillStyle(0x4f9a52, 1);
      g.fillRect(0, 0, w, 10);
      // grass blades
      g.fillStyle(0x5cb060, 1);
      for (let i = 0; i < 10; i++) {
        const bx = i * 6.5 + 1;
        const bh = 7 + (i % 4) * 2;
        g.fillTriangle(bx, 18, bx + 3, 18 - bh, bx + 6, 18);
      }
      // darker grass edge
      g.fillStyle(0x2e6b3b, 0.5);
      g.fillRect(0, 16, w, 3);
      this.save('tile_ground', w, h);
    }

    // wood platform
    {
      const g = this.fresh();
      const w = 64, h = 22;
      g.fillStyle(0x000000, 0.2);
      g.fillRoundedRect(2, 3, w - 2, h - 2, 4);
      g.fillStyle(0x8a5a2b, 1);
      g.fillRoundedRect(0, 0, w, h, 4);
      g.fillStyle(0x6e4420, 1);
      for (let i = 0; i < 4; i++) g.fillRect(i * 16 + 2, 0, 2, h);
      g.fillStyle(0xb07840, 1);
      g.fillRect(0, 0, w, 4);
      g.fillStyle(0x5a3818, 1);
      g.fillRect(0, h - 3, w, 3);
      this.save('tile_wood', w, h);
    }

    // stone platform
    {
      const g = this.fresh();
      const w = 64, h = 24;
      g.fillStyle(0x000000, 0.15);
      g.fillRoundedRect(2, 2, w - 2, h - 1, 3);
      g.fillStyle(0x8e8e8e, 1);
      g.fillRoundedRect(0, 0, w, h, 3);
      g.fillStyle(0xa8a8a8, 0.5);
      g.fillRect(2, 2, w - 8, 8);
      g.fillStyle(0x6f6f6f, 1);
      g.fillRect(0, h - 7, w, 7);
      g.lineStyle(1, 0x5a5a5a, 0.7);
      for (let i = 0; i < 5; i++) g.lineBetween(i * 13, 0, i * 13, h);
      this.save('tile_stone', w, h);
    }

    // water
    {
      const g = this.fresh();
      const w = 64, h = 64;
      g.fillStyle(0x2a6fa0, 1);
      g.fillRect(0, 0, w, h);
      g.fillStyle(0x3f8fc0, 0.7);
      g.fillRect(0, 0, w, 20);
      g.fillStyle(0x5fb0d8, 0.55);
      for (let i = 0; i < 4; i++) {
        g.fillEllipse(w / 2, 6 + i * 16, 58, 8);
      }
      g.fillStyle(0xffffff, 0.25);
      g.fillEllipse(20, 10, 24, 4);
      this.save('tile_water', w, h);
    }

    // waterfall
    {
      const g = this.fresh();
      const w = 48, h = 64;
      g.fillStyle(0xa8d8f0, 0.85);
      g.fillRect(0, 0, w, h);
      g.fillStyle(0xffffff, 0.55);
      for (let i = 0; i < 6; i++) g.fillRect(i * 8 + 2, 0, 3, h);
      g.fillStyle(0xd0f0ff, 0.4);
      for (let i = 0; i < 4; i++) g.fillRect(i * 12 + 4, (i % 2) * 8, 2, h);
      this.save('tile_waterfall', w, h);
    }

    // bridge plank
    {
      const g = this.fresh();
      const w = 40, h = 16;
      g.fillStyle(0x8a5a2b, 1);
      g.fillRect(0, 0, w, h);
      g.fillStyle(0xa06e34, 1);
      g.fillRect(0, 0, w, 3);
      g.fillStyle(0x6e4420, 1);
      g.fillRect(0, h - 3, w, 3);
      g.fillStyle(0x5a3818, 1);
      g.fillRect(18, 0, 2, h);
      this.save('tile_bridge', w, h);
    }

    // spikes
    {
      const g = this.fresh();
      const w = 32, h = 24;
      g.fillStyle(0x000000, 0.2);
      for (let i = 0; i < 3; i++) g.fillTriangle(i * 11 + 1, h + 1, i * 11 + 6, 2, i * 11 + 12, h + 1);
      g.fillStyle(0xa0a0a0, 1);
      for (let i = 0; i < 3; i++) g.fillTriangle(i * 11, h, i * 11 + 5.5, 0, i * 11 + 11, h);
      g.fillStyle(0xc8c8c8, 0.5);
      for (let i = 0; i < 3; i++) g.fillTriangle(i * 11 + 2, h - 2, i * 11 + 5.5, 4, i * 11 + 7, h - 2);
      this.save('tile_spikes', w, h);
    }

    // crate
    {
      const g = this.fresh();
      const w = 32, h = 32;
      g.fillStyle(0x000000, 0.2);
      g.fillRect(2, 2, w, h);
      g.fillStyle(0xa07038, 1);
      g.fillRect(0, 0, w, h);
      g.fillStyle(0xb88848, 0.5);
      g.fillRect(2, 2, 12, 12);
      g.lineStyle(2, 0x6e4420, 1);
      g.strokeRect(1, 1, w - 2, h - 2);
      g.lineBetween(0, 0, w, h);
      g.lineBetween(w, 0, 0, h);
      g.lineStyle(1, 0xc09050, 0.6);
      g.strokeRect(4, 4, w - 8, h - 8);
      this.save('crate', w, h);
    }

    // crate debris piece
    {
      const g = this.fresh();
      g.fillStyle(0x9a6a35, 1);
      g.fillRect(0, 0, 8, 8);
      g.fillStyle(0xb88848, 0.5);
      g.fillRect(1, 1, 3, 3);
      this.save('crate_debris', 8, 8);
    }

    // log (falling trap)
    {
      const g = this.fresh();
      const w = 90, h = 28;
      g.fillStyle(0x000000, 0.2);
      g.fillRoundedRect(2, 3, w - 2, h - 2, 10);
      g.fillStyle(0x6e4420, 1);
      g.fillRoundedRect(0, 0, w, h, 10);
      g.fillStyle(0x8a5a2b, 1);
      g.fillEllipse(7, h / 2, 12, h - 4);
      g.fillEllipse(w - 7, h / 2, 12, h - 4);
      g.fillStyle(0x5a3818, 0.5);
      for (let i = 0; i < 5; i++) g.fillRect(i * 18 + 10, 4, 2, h - 8);
      g.fillStyle(0xa07040, 0.4);
      g.fillEllipse(7, h / 2 - 2, 6, 8);
      this.save('log', w, h);
    }

    // rolling rock
    {
      const g = this.fresh();
      const r = 22;
      g.fillStyle(0x000000, 0.2);
      g.fillCircle(r + 1, r + 2, r);
      g.fillStyle(0x8a8a8a, 1);
      g.fillCircle(r, r, r);
      g.fillStyle(0xa0a0a0, 0.5);
      g.fillCircle(r - 5, r - 6, 8);
      g.fillStyle(0x6f6f6f, 1);
      g.fillCircle(r - 6, r - 5, 5);
      g.fillCircle(r + 7, r + 4, 4);
      g.fillCircle(r + 4, r - 8, 3);
      this.save('rolling_rock', r * 2 + 2, r * 2 + 2);
    }

    // checkpoint flag (2 frames: idle / active)
    ['flag_off', 'flag_on'].forEach((key, i) => {
      const g = this.fresh();
      g.fillStyle(0x6e4420, 1);
      g.fillRect(8, 0, 5, 70);
      g.fillStyle(0x5a3818, 1);
      g.fillRect(8, 0, 2, 70);
      const flagColor = i === 0 ? 0x888888 : 0xffd23f;
      g.fillStyle(flagColor, 1);
      g.fillTriangle(13, 6, 50, 18, 13, 30);
      if (i === 1) {
        g.fillStyle(0xffe27a, 0.5);
        g.fillTriangle(13, 10, 40, 18, 13, 26);
      }
      this.save(key, 52, 70);
    });

    // portal (2 frames for subtle animation)
    ['portal_0', 'portal_1'].forEach((key, i) => {
      const g = this.fresh();
      const w = 90, h = 140;
      // outer glow
      g.fillStyle(0xffd23f, i === 0 ? 0.15 : 0.25);
      g.fillEllipse(w / 2, h / 2, w - 4, h - 4);
      g.lineStyle(7, 0xffd23f, 1);
      g.strokeEllipse(w / 2, h / 2, w - 18, h - 12);
      g.lineStyle(3, 0xffe27a, 0.7);
      g.strokeEllipse(w / 2, h / 2, w - 28, h - 24);
      g.fillStyle(0x7d3fae, i === 0 ? 0.6 : 0.8);
      g.fillEllipse(w / 2, h / 2, w - 30, h - 26);
      g.fillStyle(0xa060d0, 0.5);
      g.fillEllipse(w / 2, h / 2, w - 48, h - 50);
      g.fillStyle(0xffffff, 0.45);
      g.fillEllipse(w / 2, h / 2 - 8, w - 60, h - 70);
      this.save(key, w, h);
    });
  }

  // ------------------------------------------------------------- parallax
  generateParallaxArt() {
    // sky gradient - softer, more atmospheric
    {
      const g = this.fresh();
      const w = 960, h = 540;
      const top = Phaser.Display.Color.ValueToColor(0x7ec8e8);
      const mid = Phaser.Display.Color.ValueToColor(0xb8e0f0);
      const bot = Phaser.Display.Color.ValueToColor(0xe8f8e0);
      for (let i = 0; i < h; i += 3) {
        const t = i / h;
        let col;
        if (t < 0.55) {
          col = Phaser.Display.Color.Interpolate.ColorWithColor(top, mid, 100, Math.floor(t / 0.55 * 100));
        } else {
          col = Phaser.Display.Color.Interpolate.ColorWithColor(mid, bot, 100, Math.floor((t - 0.55) / 0.45 * 100));
        }
        g.fillStyle(Phaser.Display.Color.GetColor(col.r, col.g, col.b), 1);
        g.fillRect(0, i, w, 3);
      }
      this.save('sky', w, h);
    }

    // cloud - softer multi-blob
    {
      const g = this.fresh();
      g.fillStyle(0xffffff, 0.92);
      g.fillEllipse(32, 22, 64, 32);
      g.fillEllipse(62, 14, 50, 26);
      g.fillEllipse(95, 24, 58, 28);
      g.fillEllipse(50, 28, 40, 20);
      g.fillStyle(0xe8f4ff, 0.35);
      g.fillEllipse(40, 16, 36, 16);
      this.save('cloud', 140, 48);
    }

    // mountain silhouette - more layered
    {
      const g = this.fresh();
      const w = 400, h = 220;
      g.fillStyle(0x7a96b8, 1);
      g.fillTriangle(0, h, 110, 30, 230, h);
      g.fillTriangle(130, h, 270, 50, 400, h);
      g.fillStyle(0x8aa3c9, 1);
      g.fillTriangle(40, h, 150, 70, 270, h);
      g.fillStyle(0xffffff, 0.7);
      g.fillTriangle(90, 55, 110, 30, 135, 55);
      g.fillTriangle(250, 75, 270, 50, 295, 75);
      this.save('mountain', w, h);
    }

    // tree far silhouettes
    ['tree_far_1', 'tree_far_2'].forEach((key, i) => {
      const g = this.fresh();
      const w = 70, h = 160;
      g.fillStyle(0x3a5c44, 1);
      g.fillTriangle(w / 2, 0, 2, h - 36, w - 2, h - 36);
      g.fillTriangle(w / 2, 28 + i * 8, 8, h - 8, w - 8, h - 8);
      g.fillStyle(0x2e4a34, 1);
      g.fillRect(w / 2 - 5, h - 40, 10, 40);
      this.save(key, w, h);
    });

    // tree near (richer foliage)
    ['tree_near_1', 'tree_near_2'].forEach((key, i) => {
      const g = this.fresh();
      const w = 140, h = 260;
      // trunk with bark detail
      g.fillStyle(0x6e4420, 1);
      g.fillRect(w / 2 - 14, 115, 28, h - 115);
      g.fillStyle(0x5a3818, 1);
      g.fillRect(w / 2 - 14, 115, 6, h - 115);
      // foliage layers
      g.fillStyle(0x2e5c30, 1);
      g.fillCircle(w / 2, 75, 70);
      g.fillCircle(w / 2 - 42, 105, 50);
      g.fillCircle(w / 2 + 42, 105, 50);
      g.fillStyle(0x3f7a40, 1);
      g.fillCircle(w / 2, 60, 56);
      g.fillCircle(w / 2 - 30, 90, 40);
      g.fillCircle(w / 2 + 30, 90, 40);
      g.fillStyle(0x55a050, 0.5);
      g.fillCircle(w / 2 - 10, 50, 30);
      g.fillCircle(w / 2 + 20 + i * 4, 70, 24);
      this.save(key, w, h);
    });

    // foreground leaves / grass tufts
    {
      const g = this.fresh();
      const w = 200, h = 90;
      g.fillStyle(0x1a3a20, 1);
      for (let i = 0; i < 6; i++) {
        g.fillTriangle(i * 36, h, i * 36 + 18, h - 75 - (i % 3) * 8, i * 36 + 36, h);
      }
      g.fillStyle(0x2a5a32, 0.7);
      for (let i = 0; i < 5; i++) {
        g.fillTriangle(i * 40 + 10, h, i * 40 + 28, h - 50, i * 40 + 46, h);
      }
      this.save('foreground_leaves', w, h);
    }

    {
      const g = this.fresh();
      const w = 60, h = 30;
      g.fillStyle(0x2e6b3b, 1);
      for (let i = 0; i < 5; i++) {
        g.fillTriangle(i * 12, h, i * 12 + 6, 2 + (i % 2) * 4, i * 12 + 12, h);
      }
      g.fillStyle(0x3f8f4f, 0.6);
      for (let i = 0; i < 4; i++) {
        g.fillTriangle(i * 14 + 4, h, i * 14 + 10, 8, i * 14 + 16, h);
      }
      this.save('grass_tuft', w, h);
    }
  }

  // ---------------------------------------------------------- collectibles
  generateCollectibles() {
    // coin (2-frame spin)
    ['coin_0', 'coin_1'].forEach((key, i) => {
      const g = this.fresh();
      const w = i === 0 ? 20 : 8;
      // glow
      g.fillStyle(0xffd23f, 0.25);
      g.fillEllipse(12, 12, w + 8, 26);
      g.fillStyle(0xffd23f, 1);
      g.fillEllipse(12, 12, w, 22);
      g.lineStyle(2, 0xd19a1a, 1);
      g.strokeEllipse(12, 12, w, 22);
      if (i === 0) {
        g.fillStyle(0xffe27a, 0.6);
        g.fillEllipse(10, 9, 8, 10);
      }
      this.save(key, 24, 24);
    });

    // crystal
    {
      const g = this.fresh();
      // glow
      g.fillStyle(0x5fdff0, 0.2);
      g.fillEllipse(14, 16, 28, 34);
      g.fillStyle(0x5fdff0, 0.95);
      g.fillTriangle(14, 0, 0, 18, 28, 18);
      g.fillTriangle(0, 18, 28, 18, 14, 34);
      g.fillStyle(0xa8f0ff, 0.7);
      g.fillTriangle(14, 4, 6, 17, 14, 14);
      g.fillStyle(0xffffff, 0.55);
      g.fillTriangle(14, 2, 10, 14, 14, 10);
      this.save('crystal', 28, 34);
    }

    // heart (life pickup / HUD)
    {
      const g = this.fresh();
      g.fillStyle(0xff5566, 1);
      g.fillCircle(7, 7, 7);
      g.fillCircle(17, 7, 7);
      g.fillTriangle(0, 10, 24, 10, 12, 24);
      g.fillStyle(0xff8899, 0.5);
      g.fillCircle(6, 6, 3);
      this.save('heart', 24, 24);
    }
    {
      const g = this.fresh();
      g.fillStyle(0x555555, 0.45);
      g.fillCircle(7, 7, 7);
      g.fillCircle(17, 7, 7);
      g.fillTriangle(0, 10, 24, 10, 12, 24);
      this.save('heart_empty', 24, 24);
    }
  }

  // ------------------------------------------------------------ particles
  generateParticles() {
    { const g = this.fresh(); g.fillStyle(0xffffff, 1); g.fillCircle(4, 4, 4); this.save('particle_dot', 8, 8); }
    { const g = this.fresh(); g.fillStyle(0xd8c39a, 1); g.fillCircle(3, 3, 3); this.save('particle_dust', 6, 6); }
    {
      const g = this.fresh();
      g.fillStyle(0xffe27a, 1);
      g.fillStar(6, 6, 4, 3, 6);
      this.save('particle_spark', 12, 12);
    }
  }

  // ------------------------------------------------------------- hud
  generateHudIcons() {
    {
      const g = this.fresh();
      g.fillStyle(0xffd23f, 1);
      g.fillCircle(11, 11, 10);
      g.lineStyle(2, 0xd19a1a);
      g.strokeCircle(11, 11, 10);
      g.fillStyle(0xffe27a, 0.5);
      g.fillCircle(9, 8, 4);
      this.save('icon_coin', 22, 22);
    }
    {
      const g = this.fresh();
      g.fillStyle(0x5fdff0, 1);
      g.fillTriangle(11, 0, 0, 14, 22, 14);
      g.fillTriangle(0, 14, 22, 14, 11, 26);
      g.fillStyle(0xffffff, 0.45);
      g.fillTriangle(11, 3, 5, 13, 11, 10);
      this.save('icon_crystal', 22, 26);
    }

    // Filled star (5-point)
    {
      const g = this.fresh();
      const cx = 16, cy = 16, outer = 14, inner = 6;
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        pts.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      g.fillStyle(0xffd23f, 1);
      g.fillPoints(pts, true);
      g.lineStyle(2, 0xd19a1a, 1);
      g.strokePoints(pts, true);
      this.save('star_full', 32, 32);
    }
    // Empty / outline star
    {
      const g = this.fresh();
      const cx = 16, cy = 16, outer = 14, inner = 6;
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        pts.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      g.fillStyle(0x2a3a2a, 0.55);
      g.fillPoints(pts, true);
      g.lineStyle(2, 0x6a7a5a, 1);
      g.strokePoints(pts, true);
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
      g.fillRect(7, 10, 2, 12);
      g.fillStyle(petal, 1);
      for (let a = 0; a < 6; a++) {
        const ang = (a / 6) * Math.PI * 2;
        g.fillCircle(8 + Math.cos(ang) * 5, 7 + Math.sin(ang) * 5, 3.5);
      }
      g.fillStyle(0xd1901a, 1);
      g.fillCircle(8, 7, 2.5);
      this.save(key, 16, 22);
    });

    // rock decor
    {
      const g = this.fresh();
      g.fillStyle(0x000000, 0.15);
      g.fillEllipse(22, 18, 42, 16);
      g.fillStyle(0x8a8a8a, 1);
      g.fillEllipse(20, 14, 40, 24);
      g.fillStyle(0xa0a0a0, 0.45);
      g.fillEllipse(16, 10, 20, 12);
      g.fillStyle(0x6f6f6f, 1);
      g.fillEllipse(20, 20, 40, 12);
      this.save('rock_decor', 42, 30);
    }

    // bush
    {
      const g = this.fresh();
      g.fillStyle(0x000000, 0.15);
      g.fillEllipse(24, 36, 40, 10);
      g.fillStyle(0x2e6b3b, 1);
      g.fillCircle(22, 22, 22);
      g.fillCircle(8, 26, 15);
      g.fillCircle(38, 26, 15);
      g.fillStyle(0x3f8f4f, 1);
      g.fillCircle(22, 16, 18);
      g.fillCircle(12, 22, 10);
      g.fillCircle(32, 22, 10);
      this.save('bush', 48, 42);
    }

    // vine
    {
      const g = this.fresh();
      const w = 14, h = 160;
      g.fillStyle(0x2e6b3b, 1);
      g.fillRect(w / 2 - 2, 0, 4, h);
      for (let i = 0; i < 7; i++) {
        g.fillCircle(w / 2, i * 22 + 10, 6);
        g.fillStyle(0x3f8f4f, 0.6);
        g.fillCircle(w / 2 + (i % 2 === 0 ? 3 : -3), i * 22 + 8, 4);
        g.fillStyle(0x2e6b3b, 1);
      }
      this.save('vine', w, h);
    }
  }
}
