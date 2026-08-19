/**
 * WebGPUDevice.js
 * -----------------------------------------------------------------------
 * Acquires a GPUDevice once and shares it across effect modules.
 * Returns null when WebGPU is unavailable so callers can fall back.
 * -----------------------------------------------------------------------
 */

let _devicePromise = null;
let _device = null;
let _adapter = null;
let _preferredFormat = 'bgra8unorm';

/**
 * @returns {Promise<{ device: GPUDevice, adapter: GPUAdapter, format: GPUTextureFormat } | null>}
 */
export function getWebGPU() {
  if (_device) {
    return Promise.resolve({
      device: _device,
      adapter: _adapter,
      format: _preferredFormat,
    });
  }
  if (_devicePromise) return _devicePromise;

  _devicePromise = (async () => {
    if (typeof navigator === 'undefined' || !navigator.gpu) {
      console.info('[WebGPU] navigator.gpu not available — falling back');
      return null;
    }
    try {
      _adapter = await navigator.gpu.requestAdapter({
        powerPreference: 'high-performance',
      });
      if (!_adapter) {
        console.info('[WebGPU] No adapter — falling back');
        return null;
      }
      _device = await _adapter.requestDevice();
      _device.lost.then((info) => {
        console.warn('[WebGPU] Device lost:', info.message);
        _device = null;
        _adapter = null;
        _devicePromise = null;
      });
      _preferredFormat = navigator.gpu.getPreferredCanvasFormat();
      console.info('[WebGPU] Device ready · format', _preferredFormat);
      return { device: _device, adapter: _adapter, format: _preferredFormat };
    } catch (err) {
      console.warn('[WebGPU] Init failed:', err?.message || err);
      return null;
    }
  })();

  return _devicePromise;
}

export function isWebGPUAvailable() {
  return typeof navigator !== 'undefined' && !!navigator.gpu;
}
