import { GameConfig } from '../config/GameConfig.js';

/**
 * Hazards.js
 * -----------------------------------------------------------------------
 * Dynamic environmental traps: falling logs (triggered when the player
 * crosses an x threshold) and rolling rocks (drop from above with
 * gravity, land on the terrain, then patrol back and forth). Static
 * hazards like spikes live in Map.js since they're just static-body
 * tiles; these need per-frame behaviour so they get their own module.
 * -----------------------------------------------------------------------
 */
export class Hazards {
  constructor(scene, levelData, { audio }) {
    this.scene = scene;
    this.audio = audio;
    this.group = scene.physics.add.group({ allowGravity: true });
    // Rocks fall under gravity until they land on the ground/platforms,
    // then patrol horizontally between minX/maxX.
    this.rockGroup = scene.physics.add.group({ allowGravity: true, bounceY: 0.15 });

    this.logConfigs = (levelData.fallingLogs || []).map((cfg) => ({ ...cfg, triggered: false }));
    this.rocks = (levelData.rollingRocks || []).map((cfg) => {
      const rock = this.rockGroup.create(cfg.x, cfg.y, 'rolling_rock');
      rock.setCircle(22);
      rock.dir = 1;
      rock.minX = cfg.minX;
      rock.maxX = cfg.maxX;
      rock.landed = false;
      rock.setDepth(GameConfig.DEPTH.MAIN_TERRAIN + 1);
      return rock;
    });

    this.logSprites = [];
  }

  update(time, delta, playerX) {
    // Falling logs: trigger once the player crosses triggerX, then drop.
    this.logConfigs.forEach((cfg) => {
      if (!cfg.triggered && playerX >= cfg.triggerX) {
        cfg.triggered = true;
        const log = this.group.create(cfg.x, cfg.y, 'log');
        log.setDepth(GameConfig.DEPTH.MAIN_TERRAIN + 1);
        log.body.setAllowGravity(true);
        log.setVelocityY(40);
        this.logSprites.push(log);
      }
    });

    // Rolling rocks: fall until they touch ground, then ping-pong between minX/maxX.
    this.rocks.forEach((rock) => {
      if (!rock.body) return;
      if (!rock.landed) {
        if (rock.body.blocked.down || rock.body.touching.down) {
          rock.landed = true;
        }
        return; // still falling - let gravity do its work, no horizontal motion yet
      }
      if (rock.x <= rock.minX) rock.dir = 1;
      if (rock.x >= rock.maxX) rock.dir = -1;
      rock.setVelocityX(140 * rock.dir);
      rock.rotation += rock.dir * delta * 0.01;
    });
  }
}
