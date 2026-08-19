/**
 * WebGPUSky.js
 * -----------------------------------------------------------------------
 * Full-screen procedural sky rendered with WebGPU (WGSL).
 * Drawn on a canvas stacked *behind* the Phaser canvas so the game
 * keeps using Phaser WEBGL for sprites while the sky benefits from
 * GPU fragment work (gradient, sun, soft noise clouds).
 *
 * If WebGPU is missing, this class is a no-op and Phaser's own sky
 * texture remains visible.
 * -----------------------------------------------------------------------
 */

import { getWebGPU } from './WebGPUDevice.js';

const WGSL = /* wgsl */ `
struct Uniforms {
  time : f32,
  aspect : f32,
  sunX : f32,
  sunY : f32,
  topR : f32,
  topG : f32,
  topB : f32,
  botR : f32,
  botG : f32,
  botB : f32,
  cloudSpeed : f32,
  _pad : f32,
}

@group(0) @binding(0) var<uniform> u : Uniforms;

struct VSOut {
  @builtin(position) pos : vec4f,
  @location(0) uv : vec2f,
}

@vertex
fn vs_main(@builtin(vertex_index) vi : u32) -> VSOut {
  // Full-screen triangle
  var p = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f( 3.0, -1.0),
    vec2f(-1.0,  3.0)
  );
  var out : VSOut;
  out.pos = vec4f(p[vi], 0.0, 1.0);
  out.uv = vec2f(p[vi].x * 0.5 + 0.5, 1.0 - (p[vi].y * 0.5 + 0.5));
  return out;
}

fn hash(p : vec2f) -> f32 {
  var p3 = fract(vec3f(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

fn noise(p : vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2f(0.0, 0.0)), hash(i + vec2f(1.0, 0.0)), u.x),
    mix(hash(i + vec2f(0.0, 1.0)), hash(i + vec2f(1.0, 1.0)), u.x),
    u.y
  );
}

fn fbm(p : vec2f) -> f32 {
  var v = 0.0;
  var a = 0.5;
  var q = p;
  for (var i = 0; i < 5; i++) {
    v += a * noise(q);
    q *= 2.02;
    a *= 0.5;
  }
  return v;
}

@fragment
fn fs_main(in : VSOut) -> @location(0) vec4f {
  let uv = in.uv;
  // Vertical gradient (top → bottom)
  let t = clamp(uv.y, 0.0, 1.0);
  let top = vec3f(u.topR, u.topG, u.topB);
  let bot = vec3f(u.botR, u.botG, u.botB);
  var col = mix(top, bot, smoothstep(0.0, 1.0, t));

  // Soft horizon glow
  let horizon = exp(-pow((uv.y - 0.55) * 4.0, 2.0)) * 0.12;
  col += vec3f(1.0, 0.95, 0.7) * horizon;

  // Sun disk
  let sunPos = vec2f(u.sunX, u.sunY);
  let d = length((uv - sunPos) * vec2f(u.aspect, 1.0));
  let sun = smoothstep(0.08, 0.02, d);
  let glow = exp(-d * 8.0) * 0.35;
  col += vec3f(1.0, 0.95, 0.7) * (sun * 0.9 + glow);

  // Soft noise clouds
  let cloudUv = vec2f(uv.x * u.aspect + u.time * u.cloudSpeed, uv.y * 1.4);
  let n = fbm(cloudUv * 2.5);
  let cloudMask = smoothstep(0.45, 0.75, n) * smoothstep(0.85, 0.25, uv.y);
  col = mix(col, vec3f(1.0, 1.0, 1.0), cloudMask * 0.55);

  return vec4f(col, 1.0);
}
`;

export class WebGPUSky {
  /**
   * @param {HTMLElement} parentEl  container that already holds the Phaser canvas
   * @param {{ width: number, height: number }} size
   */
  constructor(parentEl, size) {
    this.parent = parentEl;
    this.width = size.width;
    this.height = size.height;
    this.active = false;
    this._time = 0;
    this._raf = 0;
    this._canvas = null;
    this._ctx = null;
    this._device = null;
    this._pipeline = null;
    this._uniformBuffer = null;
    this._bindGroup = null;
    this._uniformData = new Float32Array(12);
  }

  async init() {
    const gpu = await getWebGPU();
    if (!gpu) return false;

    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.style.cssText = [
      'position:absolute',
      'inset:0',
      'width:100%',
      'height:100%',
      'z-index:0',
      'pointer-events:none',
    ].join(';');
    // Ensure parent is positioned so absolute children stack correctly
    const parentStyle = getComputedStyle(this.parent);
    if (parentStyle.position === 'static') {
      this.parent.style.position = 'relative';
    }
    this.parent.insertBefore(canvas, this.parent.firstChild);

    // Phaser canvas should sit above
    const phaserCanvas = this.parent.querySelector('canvas:not(:first-child), canvas');
    if (phaserCanvas && phaserCanvas !== canvas) {
      phaserCanvas.style.position = 'relative';
      phaserCanvas.style.zIndex = '1';
    }

    const ctx = canvas.getContext('webgpu');
    if (!ctx) {
      canvas.remove();
      return false;
    }

    const { device, format } = gpu;
    ctx.configure({
      device,
      format,
      alphaMode: 'opaque',
    });

    const module = device.createShaderModule({ code: WGSL });
    const pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module, entryPoint: 'vs_main' },
      fragment: {
        module,
        entryPoint: 'fs_main',
        targets: [{ format }],
      },
      primitive: { topology: 'triangle-list' },
    });

    const uniformBuffer = device.createBuffer({
      size: 48, // 12 × f32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    this._canvas = canvas;
    this._ctx = ctx;
    this._device = device;
    this._pipeline = pipeline;
    this._uniformBuffer = uniformBuffer;
    this._bindGroup = bindGroup;
    this.active = true;

    // Hide Phaser's static sky sprites when WebGPU sky is driving the background
    this._startLoop();
    return true;
  }

  _startLoop() {
    let last = performance.now();
    const tick = (now) => {
      if (!this.active) return;
      const dt = (now - last) / 1000;
      last = now;
      this._time += dt;
      this._draw();
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }

  _draw() {
    const device = this._device;
    const u = this._uniformData;
    u[0] = this._time;
    u[1] = this.width / Math.max(1, this.height);
    u[2] = 0.78; // sun X
    u[3] = 0.22; // sun Y
    // top sky #7ec8e8
    u[4] = 0.494; u[5] = 0.784; u[6] = 0.910;
    // bottom #e8f8e0
    u[7] = 0.910; u[8] = 0.973; u[9] = 0.878;
    u[10] = 0.015; // cloud speed
    u[11] = 0;

    device.queue.writeBuffer(this._uniformBuffer, 0, u);

    const texture = this._ctx.getCurrentTexture();
    const view = texture.createView();
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [{
        view,
        clearValue: { r: 0.5, g: 0.78, b: 0.9, a: 1 },
        loadOp: 'clear',
        storeOp: 'store',
      }],
    });
    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._bindGroup);
    pass.draw(3);
    pass.end();
    device.queue.submit([encoder.finish()]);
  }

  /** Match Phaser scale / resize. */
  resize(width, height) {
    this.width = width;
    this.height = height;
    if (this._canvas) {
      this._canvas.width = width;
      this._canvas.height = height;
    }
  }

  destroy() {
    this.active = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._canvas) this._canvas.remove();
    this._canvas = null;
  }
}
