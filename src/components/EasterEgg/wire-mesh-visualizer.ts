/* wire-mesh-visualizer.ts — audio-reactive wireframe icosahedron.
 *
 * Ported from reference/audio visualizer/script.js + simplex-noise.js:
 * three.js and simplex-noise are now real npm imports instead of CDN
 * <script> tags resolved onto window, and the render loop lives in a
 * disposable class instead of top-level script state.
 *
 * The original mutated each BufferGeometry-less `vertex` in place every
 * frame (`vertex.normalize()` then rescale) — that only worked because
 * three.js exposed a live `geometry.vertices` array pre-BufferGeometry.
 * Modern three.js only exposes a flat position BufferAttribute, so instead
 * we precompute each vertex's unit direction ONCE from the base geometry
 * and rebuild position = direction * (radius + noise) every frame. Since
 * normalize() always collapses back to the same direction regardless of
 * prior scale, this is numerically equivalent to the original.
 *
 * API:
 *   const viz = new WireMeshVisualizer(container, audioEl);
 *   viz.setSize(w, h); viz.dispose();
 */
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

const COLORS = [
  0xff0000, // red
  0xff8000, // orange
  0xffff00, // yellow
  0x00ff00, // green
  0x00ffff, // cyan
  0x0000ff, // blue
  0x8000ff, // purple
];

function interpolateColor(colors: number[], factor: number): number {
  const colorIndex = Math.floor(factor * (colors.length - 1));
  const color1 = colors[colorIndex];
  const color2 = colors[Math.min(colorIndex + 1, colors.length - 1)];
  const localFactor = factor * (colors.length - 1) - colorIndex;

  const r1 = (color1 >> 16) & 0xff;
  const g1 = (color1 >> 8) & 0xff;
  const b1 = color1 & 0xff;
  const r2 = (color2 >> 16) & 0xff;
  const g2 = (color2 >> 8) & 0xff;
  const b2 = color2 & 0xff;

  const r = Math.round(r1 + localFactor * (r2 - r1));
  const g = Math.round(g1 + localFactor * (g2 - g1));
  const b = Math.round(b1 + localFactor * (b2 - b1));
  return (r << 16) | (g << 8) | b;
}

function modulate(val: number, minVal: number, maxVal: number, outMin: number, outMax: number): number {
  const fr = (val - minVal) / (maxVal - minVal);
  return outMin + fr * (outMax - outMin);
}

function avg(arr: Uint8Array): number {
  let total = 0;
  for (let i = 0; i < arr.length; i++) total += arr[i];
  return total / arr.length;
}

export interface WireMeshVisualizerOptions {
  radius?: number;
  detail?: number;
}

export class WireMeshVisualizer {
  private container: HTMLElement;
  private audio: HTMLAudioElement;
  private radius: number;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private sphere: THREE.Mesh;
  private material: THREE.MeshLambertMaterial;
  private directions: Float32Array; // precomputed unit vertex directions

  private noise3D = createNoise3D();

  private audioCtx: AudioContext;
  private analyser: AnalyserNode;
  private sourceNode: MediaElementAudioSourceNode;
  private dataArray: Uint8Array<ArrayBuffer>;

  private raf: number | null = null;
  private disposed = false;

  private handlePlay = () => {
    if (this.audioCtx.state === "suspended") this.audioCtx.resume().catch(() => {});
  };

  constructor(container: HTMLElement, audio: HTMLAudioElement, opts: WireMeshVisualizerOptions = {}) {
    this.container = container;
    this.audio = audio;
    this.radius = opts.radius ?? 20;

    // Web Audio graph — resumed lazily on first "play" (autoplay policy).
    this.audioCtx = new AudioContext();
    this.sourceNode = this.audioCtx.createMediaElementSource(audio);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 512;
    this.sourceNode.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    audio.addEventListener("play", this.handlePlay);

    // Scene
    const { clientWidth: w, clientHeight: h } = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, (w || 1) / (h || 1), 0.1, 1000);
    this.camera.position.z = 100;
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w || 1, h || 1);
    container.appendChild(this.renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(this.radius, opts.detail ?? 3);
    this.material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      emissive: 0x000000,
      emissiveIntensity: 0.5,
      wireframe: true,
    });
    this.sphere = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.sphere);

    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(0, 50, 100);
    this.scene.add(light);

    const pos = geometry.attributes.position;
    const dirs = new Float32Array(pos.count * 3);
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).normalize();
      dirs[i * 3] = v.x;
      dirs[i * 3 + 1] = v.y;
      dirs[i * 3 + 2] = v.z;
    }
    this.directions = dirs;

    this._loop();
  }

  // Driven externally by a ResizeObserver on the container (see
  // WireMeshEasterEgg.tsx) rather than a window resize listener, since the
  // container's size can change from CSS alone (minimize/expand) without a
  // window resize ever firing.
  setSize(w: number, h: number) {
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private _warp(freqFactor: number) {
    const pos = this.sphere.geometry.attributes.position as THREE.BufferAttribute;
    const dirs = this.directions;
    const amp = 5;
    const time = performance.now();
    const rf = 0.00001;
    for (let i = 0; i < pos.count; i++) {
      const dx = dirs[i * 3];
      const dy = dirs[i * 3 + 1];
      const dz = dirs[i * 3 + 2];
      const distance =
        this.radius + this.noise3D(dx + time * rf * 4, dy + time * rf * 6, dz + time * rf * 7) * amp * freqFactor;
      pos.setXYZ(i, dx * distance, dy * distance, dz * distance);
    }
    pos.needsUpdate = true;
    this.sphere.geometry.computeVertexNormals();
  }

  private _loop() {
    const render = () => {
      if (this.disposed) return;

      if (!this.audio.paused) {
        this.analyser.getByteFrequencyData(this.dataArray);
        const frequencyFactor = avg(this.dataArray) / 256;
        this.material.emissive.setHex(interpolateColor(COLORS, frequencyFactor));
        this._warp(modulate(frequencyFactor, 0, 1, 0, 8));
      } else {
        this.material.emissive.setHex(0x000000);
      }

      this.sphere.rotation.x += 0.001;
      this.sphere.rotation.y += 0.003;
      this.sphere.rotation.z += 0.005;

      this.renderer.render(this.scene, this.camera);
      this.raf = requestAnimationFrame(render);
    };
    render();
  }

  dispose() {
    this.disposed = true;
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.audio.removeEventListener("play", this.handlePlay);

    this.sphere.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }

    this.sourceNode.disconnect();
    this.analyser.disconnect();
    if (this.audioCtx.state !== "closed") this.audioCtx.close().catch(() => {});
  }
}
