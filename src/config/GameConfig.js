/**
 * GameConfig.js
 * -----------------------------------------------------------------------
 * Central place for every tunable number in the game. Change values here
 * instead of hunting through gameplay code. Keeping this file isolated
 * also means future worlds/levels can override individual values without
 * touching engine code.
 * -----------------------------------------------------------------------
 */
export const GameConfig = {
  WIDTH: 960,
  HEIGHT: 540,

  PHYSICS: {
    GRAVITY_Y: 1400,
    MAX_FALL_SPEED: 900,
  },

  PLAYER: {
    WALK_SPEED: 160,
    RUN_SPEED: 280,
    ACCELERATION: 1400,
    DECELERATION: 1800,
    AIR_ACCELERATION: 900,
    JUMP_VELOCITY: -560,
    JUMP_HOLD_GRAVITY_MULT: 0.45, // extra "float" while jump is held
    JUMP_MAX_HOLD_MS: 260,        // how long holding the button keeps boosting the jump
    COYOTE_TIME_MS: 110,
    JUMP_BUFFER_MS: 130,
    SLIDE_SPEED: 220,
    MAX_HEALTH: 3,
    INVINCIBILITY_MS: 1500,
    ATTACK_DURATION_MS: 260,
    ATTACK_COOLDOWN_MS: 420,
    ATTACK_RADIUS: 46,
    HURT_KNOCKBACK_X: 220,
    HURT_KNOCKBACK_Y: -300,
    BODY_WIDTH: 22,
    BODY_HEIGHT: 40,
  },

  CAMERA: {
    LERP_X: 0.09,
    LERP_Y: 0.06,
    DEADZONE_W: 120,
    DEADZONE_H: 80,
  },

  PARALLAX: {
    // scrollFactor per layer, matches the design spec (percent / 100)
    SKY: 0,
    CLOUDS: 0.10,
    MOUNTAINS: 0.20,
    TREES_FAR: 0.40,
    TREES_NEAR: 0.70,
    MAIN: 1.0,
    FOREGROUND: 1.20,
  },

  ENEMY: {
    SLUG_SPEED: 35,
    BOAR_SPEED: 210,
    BOAR_TRIGGER_DISTANCE: 260,
    BAT_SPEED: 90,
    BAT_AMPLITUDE: 40,
    BAT_FREQUENCY: 0.004,
    FROG_SPEED: 55,
    FROG_JUMP_VELOCITY: -420,
    FROG_JUMP_COOLDOWN_MS: 900,
    STOMP_BOUNCE: -420,
  },

  DEPTH: {
    SKY: 0,
    CLOUDS: 1,
    MOUNTAINS: 2,
    TREES_FAR: 3,
    TREES_NEAR: 4,
    BACKGROUND_DECOR: 5,
    MAIN_TERRAIN: 10,
    ENEMIES: 11,
    COLLECTIBLES: 11,
    PLAYER: 12,
    PARTICLES: 13,
    FOREGROUND: 20,
    HUD: 100,
  },

  SAVE_KEY: 'floresta_platformer_save_v1',
};
