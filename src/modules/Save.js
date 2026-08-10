import { GameConfig } from '../config/GameConfig.js';

/**
 * Save.js
 * -----------------------------------------------------------------------
 * Thin wrapper around localStorage. All persistence goes through here so
 * swapping storage backends (e.g. a remote save) later only touches this
 * file.
 *
 * Stars system (additive):
 *   1★ base — complete the level
 *   +1★    — collect every crystal (incl. crate loot)
 *   +1★    — finish without taking any damage
 * Best stars per level are kept independently of time / coin high-scores.
 * -----------------------------------------------------------------------
 */
const DEFAULT_DATA = {
  totalCoins: 0,
  totalCrystals: 0,
  lives: 3,
  unlockedLevels: ['w1_l1'],
  // { levelId: { coins, crystals, timeMs, stars } }
  levelBest: {},
};

export class Save {
  static load() {
    try {
      const raw = localStorage.getItem(GameConfig.SAVE_KEY);
      if (!raw) return { ...DEFAULT_DATA, levelBest: {} };
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_DATA,
        ...parsed,
        levelBest: parsed.levelBest || {},
        unlockedLevels: parsed.unlockedLevels || ['w1_l1'],
      };
    } catch (e) {
      console.warn('[Save] Failed to load save data, using defaults.', e);
      return { ...DEFAULT_DATA, levelBest: {} };
    }
  }

  static store(data) {
    try {
      localStorage.setItem(GameConfig.SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('[Save] Failed to persist save data.', e);
    }
  }

  static unlockLevel(levelId) {
    const data = Save.load();
    if (!data.unlockedLevels.includes(levelId)) {
      data.unlockedLevels.push(levelId);
      Save.store(data);
    }
  }

  /**
   * Records a run. Always adds the run's coins/crystals to totals.
   * Per-level best keeps the highest stars, the best (lowest) time,
   * and the highest coin/crystal counts independently.
   */
  static recordLevelResult(levelId, { coins, crystals, timeMs, stars }) {
    const data = Save.load();
    data.totalCoins += coins;
    data.totalCrystals += crystals;

    const prev = data.levelBest[levelId] || {
      coins: 0,
      crystals: 0,
      timeMs: Number.MAX_SAFE_INTEGER,
      stars: 0,
    };

    data.levelBest[levelId] = {
      coins: Math.max(prev.coins, coins),
      crystals: Math.max(prev.crystals, crystals),
      timeMs: Math.min(prev.timeMs, timeMs),
      stars: Math.max(prev.stars || 0, stars || 0),
    };

    Save.store(data);
    return data;
  }

  /** Returns 0–3 for a given level (0 if never completed). */
  static getStars(levelId) {
    const best = Save.load().levelBest[levelId];
    return best ? (best.stars || 0) : 0;
  }

  static getLevelBest(levelId) {
    return Save.load().levelBest[levelId] || null;
  }

  static reset() {
    Save.store({ ...DEFAULT_DATA, levelBest: {} });
  }
}

/**
 * Pure helper so LevelCompleteScene (and tests) can compute stars
 * without touching storage.
 *
 * Rules (additive, max 3):
 *   +1  always for finishing the level
 *   +1  if every crystal was collected
 *   +1  if the player took no damage during the run
 *
 * @param {{ coins: number, crystals: number, totalCoins: number, totalCrystals: number, noDamage: boolean }} stats
 * @returns {1|2|3}
 */
export function computeStars({ coins, crystals, totalCoins, totalCrystals, noDamage }) {
  let stars = 1; // finished

  const allCrystals = totalCrystals <= 0 || crystals >= totalCrystals;
  if (allCrystals) stars += 1;

  if (noDamage) stars += 1;

  return Math.min(3, stars);
}
