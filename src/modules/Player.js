import { GameConfig } from '../config/GameConfig.js';

const C = GameConfig.PLAYER;

/**
 * Player.js
 * -----------------------------------------------------------------------
 * Everything about controlling the hero: acceleration-based movement,
 * variable-height jumping with coyote time + jump buffering, slope
 * sliding, the spin attack, damage/invincibility and the small animation
 * state machine that picks the right generated frame every tick.
 *
 * The class exposes a plain Phaser.Physics.Arcade.Sprite (`this.sprite`)
 * that the scene adds colliders/overlaps against; all per-frame logic is
 * driven from `update(time, delta, input)` called by GameScene.
 * -----------------------------------------------------------------------
 */
export class Player {
  constructor(scene, x, y, { particles, audio }) {
    this.scene = scene;
    this.particles = particles;
    this.audio = audio;

    this.sprite = scene.physics.add.sprite(x, y, 'idle_0');
    this.sprite.setSize(C.BODY_WIDTH, C.BODY_HEIGHT).setOffset((30 - C.BODY_WIDTH) / 2, 44 - C.BODY_HEIGHT);
    this.sprite.setMaxVelocity(C.RUN_SPEED + 60, GameConfig.PHYSICS.MAX_FALL_SPEED);
    this.sprite.setDragX(0);
    this.sprite.setDepth(GameConfig.DEPTH.PLAYER);
    this.sprite.owner = this;

    // ---- state -----------------------------------------------------
    this.facing = 1;
    this.health = C.MAX_HEALTH;
    this.maxHealth = C.MAX_HEALTH;
    this.isDead = false;
    this.invincibleUntil = 0;
    this.onGround = false;
    this.wasOnGround = false;
    this.lastGroundedTime = -9999;
    this.jumpBufferedAt = -9999;
    this.jumpHeldSince = 0;
    this.isJumpHeld = false;
    this.isSliding = false;
    this.isAttacking = false;
    this.attackUntil = 0;
    this.attackReadyAt = 0;
    this.animState = 'idle';
    this.animTimer = 0;
    this.animFrame = 0;
    this.landTimer = 0;
    this.hurtUntil = 0;
    this.locked = false; // input lock (death / level complete)

    this.onDeath = null;   // callback set by scene
    this.onDamage = null;  // callback set by scene (health changed for any reason)
    this.onTookDamage = null; // fired only when takeDamage actually reduces health
  }

  get body() { return this.sprite.body; }

  // ---------------------------------------------------------------- input
  handleJumpPressed(time) {
    this.jumpBufferedAt = time;
    this.isJumpHeld = true;
    this.jumpHeldSince = time;
  }

  handleJumpReleased() {
    this.isJumpHeld = false;
    // cut the jump short if released early (variable height)
    if (this.body.velocity.y < 0) {
      this.body.velocity.y *= 0.5;
    }
  }

  tryAttack(time) {
    if (this.locked || this.isDead) return;
    if (time < this.attackReadyAt) return;
    this.isAttacking = true;
    this.attackUntil = time + C.ATTACK_DURATION_MS;
    this.attackReadyAt = time + C.ATTACK_COOLDOWN_MS;
    this.animState = 'attack';
    this.animTimer = 0;
    this.animFrame = 0;
    this.audio.playSfx('attack');
    this.particles.attackSwirl(this.sprite.x + this.facing * 20, this.sprite.y);
  }

  /** Returns true while the spin-attack hitbox should be considered active. */
  isAttackActive(time) {
    return this.isAttacking && time < this.attackUntil;
  }

  getAttackHitbox() {
    const r = C.ATTACK_RADIUS;
    return new Phaser.Geom.Circle(this.sprite.x + this.facing * 10, this.sprite.y - 6, r);
  }

  // --------------------------------------------------------------- damage
  takeDamage(time, sourceX) {
    if (this.locked || this.isDead) return false;
    if (time < this.invincibleUntil) return false;

    this.health -= 1;
    this.invincibleUntil = time + C.INVINCIBILITY_MS;
    this.hurtUntil = time + 260;
    this.audio.playSfx('hurt');
    this.particles.hitSpark(this.sprite.x, this.sprite.y);

    const dir = sourceX !== undefined ? Math.sign(this.sprite.x - sourceX) || -this.facing : -this.facing;
    this.body.setVelocity(dir * C.HURT_KNOCKBACK_X, C.HURT_KNOCKBACK_Y);

    if (this.onDamage) this.onDamage(this.health);
    if (this.onTookDamage) this.onTookDamage();

    if (this.health <= 0) {
      this.die();
      return true;
    }
    return true;
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.locked = true;
    this.body.setVelocity(0, -300);
    this.sprite.setTint(0xff6666);
    if (this.onDeath) this.onDeath();
  }

  respawn(x, y) {
    this.isDead = false;
    this.locked = false;
    this.health = this.maxHealth;
    this.invincibleUntil = this.scene.time.now + 800;
    this.sprite.clearTint();
    this.sprite.setPosition(x, y);
    this.body.setVelocity(0, 0);
    if (this.onDamage) this.onDamage(this.health); // reuse the health-changed callback to refresh the HUD
  }

  heal(amount = 1) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    if (this.onDamage) this.onDamage(this.health);
  }

  bounceFromStomp() {
    this.body.setVelocityY(GameConfig.ENEMY.STOMP_BOUNCE);
  }

  // -------------------------------------------------------------- update
  update(time, delta, input, map) {
    if (this.locked) {
      this._updateAnimation(time, delta);
      return;
    }

    this.wasOnGround = this.onGround;
    this.onGround = this.body.blocked.down || this.body.touching.down;
    if (this.onGround) this.lastGroundedTime = time;

    // landing feedback
    if (this.onGround && !this.wasOnGround) {
      this.particles.landPoof(this.sprite.x, this.sprite.y + 18);
      this.audio.playSfx('land');
      this.animState = 'land';
      this.animTimer = 0;
      this.landTimer = time + 120;
    }

    const attacking = this.isAttacking && time < this.attackUntil;
    if (this.isAttacking && time >= this.attackUntil) this.isAttacking = false;

    // ---- horizontal movement -----------------------------------
    const slope = map ? map.getSlopeAt(this.sprite.x) : null;
    this.isSliding = !!slope && this.onGround && !input.left && !input.right;

    if (this.isSliding) {
      this.body.setVelocityX(slope.direction * C.SLIDE_SPEED);
      this.facing = slope.direction;
    } else if (!attacking) {
      const running = input.run;
      const targetSpeed = running ? C.RUN_SPEED : C.WALK_SPEED;
      const accel = this.onGround ? C.ACCELERATION : C.AIR_ACCELERATION;

      if (input.left) {
        this.body.setAccelerationX(-accel);
        this.facing = -1;
        if (this.body.velocity.x < -targetSpeed) this.body.setVelocityX(-targetSpeed);
      } else if (input.right) {
        this.body.setAccelerationX(accel);
        this.facing = 1;
        if (this.body.velocity.x > targetSpeed) this.body.setVelocityX(targetSpeed);
      } else {
        this.body.setAccelerationX(0);
        const decel = this.onGround ? C.DECELERATION : C.AIR_ACCELERATION * 0.6;
        if (Math.abs(this.body.velocity.x) < decel * (delta / 1000)) {
          this.body.setVelocityX(0);
        } else {
          this.body.setVelocityX(this.body.velocity.x - Math.sign(this.body.velocity.x) * decel * (delta / 1000));
        }
      }
    } else {
      this.body.setAccelerationX(0);
      this.body.setVelocityX(this.body.velocity.x * 0.9);
    }

    this.sprite.setFlipX(this.facing < 0);

    // ---- jump: coyote time + buffered input -----------------------
    const withinCoyote = time - this.lastGroundedTime <= C.COYOTE_TIME_MS;
    const hasBufferedJump = time - this.jumpBufferedAt <= C.JUMP_BUFFER_MS;

    if (hasBufferedJump && withinCoyote && !attacking) {
      this.body.setVelocityY(C.JUMP_VELOCITY);
      this.onGround = false;
      this.lastGroundedTime = -9999;
      this.jumpBufferedAt = -9999;
      this.audio.playSfx('jump');
      this.particles.runDust(this.sprite.x, this.sprite.y + 18, this.facing);
    }

    // hold-to-jump-higher: reduce gravity briefly while held & still ascending
    if (this.isJumpHeld && this.body.velocity.y < 0 && (time - this.jumpHeldSince) < C.JUMP_MAX_HOLD_MS) {
      this.body.setGravityY(-GameConfig.PHYSICS.GRAVITY_Y * C.JUMP_HOLD_GRAVITY_MULT);
    } else {
      this.body.setGravityY(0);
    }

    // running dust particles (throttled)
    if (this.onGround && Math.abs(this.body.velocity.x) > 40 && !this.isSliding) {
      this._dustTimer = (this._dustTimer || 0) - delta;
      if (this._dustTimer <= 0) {
        this.particles.runDust(this.sprite.x - this.facing * 8, this.sprite.y + 18, this.facing);
        this._dustTimer = 110;
      }
    }

    this._pickAnimState(time, attacking);
    this._updateAnimation(time, delta);
  }

  _pickAnimState(time, attacking) {
    if (attacking) { this.animState = 'attack'; return; }
    if (time < this.hurtUntil) { this.animState = 'hurt'; return; }
    if (time < this.landTimer) { this.animState = 'land'; return; }
    if (!this.onGround) {
      this.animState = this.body.velocity.y < 0 ? 'jump' : 'fall';
      return;
    }
    if (Math.abs(this.body.velocity.x) > 20) {
      this.animState = 'run';
    } else {
      this.animState = 'idle';
    }
  }

  _updateAnimation(time, delta) {
    this.animTimer += delta;
    const flash = this.isDead || (this.invincibleUntil > time && Math.floor(time / 80) % 2 === 0);
    this.sprite.setAlpha(flash && !this.isDead ? 0.4 : 1);

    switch (this.animState) {
      case 'idle': {
        const frame = Math.floor(this.animTimer / 400) % 2;
        this.sprite.setTexture(`idle_${frame}`);
        break;
      }
      case 'run': {
        const frame = Math.floor(this.animTimer / 80) % 4;
        this.sprite.setTexture(`run_${frame}`);
        break;
      }
      case 'jump':
        this.sprite.setTexture('player_jump');
        break;
      case 'fall':
        this.sprite.setTexture('player_fall');
        break;
      case 'land':
        this.sprite.setTexture('player_land');
        break;
      case 'hurt':
        this.sprite.setTexture('player_hurt');
        break;
      case 'attack': {
        const frame = Math.floor(this.animTimer / 90) % 3;
        this.sprite.setTexture(`attack_${frame}`);
        break;
      }
    }
  }
}
