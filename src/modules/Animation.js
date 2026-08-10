/**
 * Animation.js
 * -----------------------------------------------------------------------
 * Every character in this project is drawn as one generated texture per
 * frame (see TextureGenerator) rather than a packed spritesheet, so
 * playback is just "pick texture key N based on elapsed time". This tiny
 * helper standardizes that pattern for any actor (player, enemies) that
 * needs it, instead of re-deriving `Math.floor(timer / rate) % frames`
 * in every module.
 * -----------------------------------------------------------------------
 */
export class AnimationController {
  constructor(sprite, keysByState) {
    this.sprite = sprite;
    this.keysByState = keysByState; // { state: { frames: [...keys], rateMs } }
    this.state = null;
    this.timer = 0;
  }

  setState(state) {
    if (this.state !== state) {
      this.state = state;
      this.timer = 0;
    }
  }

  update(delta) {
    const cfg = this.keysByState[this.state];
    if (!cfg) return;
    this.timer += delta;
    const frames = cfg.frames;
    const idx = frames.length > 1 ? Math.floor(this.timer / cfg.rateMs) % frames.length : 0;
    this.sprite.setTexture(frames[idx]);
  }
}
