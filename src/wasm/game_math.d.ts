/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * wasm/game_math/rngSeed
 * @param seed `u32`
 */
export declare function rngSeed(seed: number): void;
/**
 * wasm/game_math/rngNext
 * @returns `f32`
 */
export declare function rngNext(): number;
/**
 * wasm/game_math/rngRange
 * @param min `f32`
 * @param max `f32`
 * @returns `f32`
 */
export declare function rngRange(min: number, max: number): number;
/**
 * wasm/game_math/setBat
 * @param i `i32`
 * @param baseY `f32`
 * @param phase `f32`
 * @param amp `f32`
 * @param x `f32`
 * @param dir `f32`
 */
export declare function setBat(i: number, baseY: number, phase: number, amp: number, x: number, dir: number): void;
/**
 * wasm/game_math/getBatX
 * @param i `i32`
 * @returns `f32`
 */
export declare function getBatX(i: number): number;
/**
 * wasm/game_math/getBatY
 * @param i `i32`
 * @returns `f32`
 */
export declare function getBatY(i: number): number;
/**
 * wasm/game_math/setBatDir
 * @param i `i32`
 * @param dir `f32`
 */
export declare function setBatDir(i: number, dir: number): void;
/**
 * wasm/game_math/updateBats
 * @param n `i32`
 * @param time `f32`
 * @param speed `f32`
 * @param freq `f32`
 * @param delta `f32`
 */
export declare function updateBats(n: number, time: number, speed: number, freq: number, delta: number): void;
/**
 * wasm/game_math/setEnemy
 * @param i `i32`
 * @param x `f32`
 * @param y `f32`
 * @param top `f32`
 */
export declare function setEnemy(i: number, x: number, y: number, top: number): void;
/**
 * wasm/game_math/getContactFlag
 * @param i `i32`
 * @returns `i32`
 */
export declare function getContactFlag(i: number): number;
/**
 * wasm/game_math/getDistSq
 * @param i `i32`
 * @returns `f32`
 */
export declare function getDistSq(i: number): number;
/**
 * wasm/game_math/classifyContacts
 * @param n `i32`
 * @param px `f32`
 * @param py `f32`
 * @param playerBottom `f32`
 * @param playerVy `f32`
 * @param radius `f32`
 * @param stompSlack `f32`
 */
export declare function classifyContacts(n: number, px: number, py: number, playerBottom: number, playerVy: number, radius: number, stompSlack: number): void;
/**
 * wasm/game_math/setCloud
 * @param i `i32`
 * @param x `f32`
 * @param scale `f32`
 */
export declare function setCloud(i: number, x: number, scale: number): void;
/**
 * wasm/game_math/getCloudX
 * @param i `i32`
 * @returns `f32`
 */
export declare function getCloudX(i: number): number;
/**
 * wasm/game_math/driftClouds
 * @param n `i32`
 * @param delta `f32`
 * @param speed `f32`
 * @param minX `f32`
 * @param maxX `f32`
 */
export declare function driftClouds(n: number, delta: number, speed: number, minX: number, maxX: number): void;
/**
 * wasm/game_math/computeStars
 * @param crystals `i32`
 * @param totalCrystals `i32`
 * @param noDamage `i32`
 * @returns `i32`
 */
export declare function computeStars(crystals: number, totalCrystals: number, noDamage: number): number;
/**
 * wasm/game_math/fillDecorX
 * @param maxCount `i32`
 * @param minX `f32`
 * @param maxX `f32`
 * @param step `f32`
 * @param seed `u32`
 * @returns `i32`
 */
export declare function fillDecorX(maxCount: number, minX: number, maxX: number, step: number, seed: number): number;
/**
 * wasm/game_math/getDecorX
 * @param i `i32`
 * @returns `f32`
 */
export declare function getDecorX(i: number): number;
/**
 * wasm/game_math/clampf
 * @param v `f32`
 * @param lo `f32`
 * @param hi `f32`
 * @returns `f32`
 */
export declare function clampf(v: number, lo: number, hi: number): number;
/**
 * wasm/game_math/maxEntities
 * @returns `i32`
 */
export declare function maxEntities(): number;
