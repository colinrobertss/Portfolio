/* wire-globe.ts — Three.js DOTTED earth (Vercel-style) that performs a TRUE
 * geometric morph between a flat equirectangular plane and a sphere by
 * interpolating vertex positions in a shader (one point cloud, two configs).
 * Continents are rendered as an evenly-spaced grid of small dots sampled from
 * land polygons; visitor locations are single density-scaled glow pins.
 *
 * Ported from design-bundle/wire-globe.js — swapped the CDN-global
 * THREE/topojson lookups for real npm imports, everything else preserved.
 *
 * API:
 *   const wg = new WireGlobe(container, { dotColor:'#9a917f', pinColor:'#c2703f', onPick });
 *   wg.setSize(w,h); wg.setMode('globe'|'flat');
 *   wg.setPins([{ id, lat, lng, count }]);   // ONE entry per location
 *   wg.setPlacing(bool); wg.dispose();
 */
import * as T from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as topojson from "topojson-client";
import type { Topology, GeometryObject } from "topojson-specification";

const R = 100; // sphere radius
const PLANE_W = 2 * Math.PI * R; // equator length preserved on the flat plane
const PLANE_H = Math.PI * R;
const D_GLOBE = 290; // camera distance in sphere mode
const DEG = Math.PI / 180;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// density tiers: 1 visit / 2–5 / 6–15 / 16+
const tierOf = (c: number) => (c >= 16 ? 3 : c >= 6 ? 2 : c >= 2 ? 1 : 0);
const TIER_SIZE = [8, 12, 16.5, 22]; // sprite scale (world units)
const TIER_OPACITY = [0.62, 0.78, 0.9, 1];
const TIER_PULSE = [0, 0.05, 0.08, 0.11]; // subtle heartbeat amplitude

const flatPos = (lat: number, lng: number): [number, number, number] => [lng * DEG * R, lat * DEG * R, 0];
const spherePos = (lat: number, lng: number): [number, number, number] => {
  const la = lat * DEG,
    lo = lng * DEG;
  return [R * Math.cos(la) * Math.sin(lo), R * Math.sin(la), R * Math.cos(la) * Math.cos(lo)];
};

function hexToRGB(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/* ---- point-in-polygon (ray casting) over a ring of [lng,lat] ---- */
function pointInRing(lng: number, lat: number, ring: number[][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0],
      yi = ring[i][1],
      xj = ring[j][0],
      yj = ring[j][1];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
// land = array of polygons; polygon = [outerRing, ...holes]; test outer only (fast)
function isLand(lng: number, lat: number, polys: number[][][][]) {
  for (let p = 0; p < polys.length; p++) {
    if (pointInRing(lng, lat, polys[p][0])) return true;
  }
  return false;
}

/* ---- sample an even-ish dot grid, keep only points over land ---- */
function landDots(polys: number[][][][]) {
  const pts: [number, number][] = [];
  const step = 1.05; // base angular spacing (deg)
  let row = 0;
  for (let lat = -78; lat <= 84; lat += step) {
    const circ = Math.cos(lat * DEG);
    const lngStep = step / Math.max(circ, 0.06); // widen spacing near poles → even density
    const offset = (row % 2) * (lngStep / 2); // stagger alternate rows → no horizontal banding
    for (let lng = -180 + offset; lng < 180; lng += lngStep) {
      if (isLand(lng, lat, polys)) pts.push([lat, lng]);
    }
    row++;
  }
  return pts;
}

function dotMaterial(color: string, opacity: number) {
  const [r, g, b] = hexToRGB(color);
  return new T.ShaderMaterial({
    uniforms: {
      uMorph: { value: 1 },
      uColor: { value: new T.Vector3(r, g, b) },
      uOpacity: { value: opacity },
      uSize: { value: 3.0 },
    },
    vertexShader: `
        attribute vec3 aSphere; uniform float uMorph; uniform float uSize;
        void main(){
          vec3 p = mix(position, aSphere, uMorph);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = uSize * (300.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
    fragmentShader: `
        precision mediump float; uniform vec3 uColor; uniform float uOpacity;
        void main(){
          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);
          float a = smoothstep(0.5, 0.32, d);
          if (a <= 0.01) discard;
          gl_FragColor = vec4(uColor, uOpacity * a);
        }`,
    transparent: true,
    depthWrite: false,
  });
}

function buildDotCloud(dots: [number, number][], material: T.ShaderMaterial) {
  const n = dots.length;
  const flat = new Float32Array(n * 3);
  const sph = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const fa = flatPos(dots[i][0], dots[i][1]);
    const sa = spherePos(dots[i][0], dots[i][1]);
    flat.set(fa, i * 3);
    sph.set(sa, i * 3);
  }
  const geo = new T.BufferGeometry();
  geo.setAttribute("position", new T.BufferAttribute(flat, 3));
  geo.setAttribute("aSphere", new T.BufferAttribute(sph, 3));
  return new T.Points(geo, material);
}

/* ---- pin sprite: soft orange halo + solid saturated core (one texture, scaled/faded per tier) ---- */
function pinTexture(color: string) {
  const S = 128,
    c = document.createElement("canvas");
  c.width = c.height = S;
  const x = c.getContext("2d")!,
    cx = S / 2;
  // outer glow halo
  const g = x.createRadialGradient(cx, cx, 0, cx, cx, cx);
  g.addColorStop(0.0, color);
  g.addColorStop(0.18, color);
  g.addColorStop(0.45, hexA(color, 0.32));
  g.addColorStop(1.0, hexA(color, 0));
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);
  // solid core
  x.beginPath();
  x.arc(cx, cx, S * 0.16, 0, Math.PI * 2);
  x.fillStyle = color;
  x.fill();
  // faint light ring for crispness
  x.beginPath();
  x.arc(cx, cx, S * 0.16, 0, Math.PI * 2);
  x.lineWidth = 2.5;
  x.strokeStyle = "rgba(255,255,255,0.85)";
  x.stroke();
  const tex = new T.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}
function hexA(hex: string, a: number) {
  const [r, g, b] = hexToRGB(hex);
  return `rgba(${(r * 255) | 0},${(g * 255) | 0},${(b * 255) | 0},${a})`;
}

export type WireGlobeMode = "globe" | "flat";
export interface WireGlobePin {
  id: string;
  lat: number;
  lng: number;
  count: number;
}
export interface WireGlobeOptions {
  dotColor?: string;
  pinColor?: string;
  onPick?: (lat: number, lng: number) => void;
}

interface PinRecord {
  flat: T.Vector3;
  sphere: T.Vector3;
  sprite: T.Sprite;
  born: number;
  tier: number;
  prevTier: number;
}

export class WireGlobe {
  private container: HTMLElement;
  private onPick: (lat: number, lng: number) => void;
  private dotColor: string;
  private pinColor: string;
  private mode: WireGlobeMode = "globe";
  private placing = false;
  private morph = 1; // 1 = sphere, 0 = flat
  private morphAnim: number | null = null;
  private pins = new Map<string, PinRecord>();
  private resumeTimer: ReturnType<typeof setTimeout> | null = null;
  private _raf: number | null = null;
  private _disposed = false;

  private scene!: T.Scene;
  private camera!: T.PerspectiveCamera;
  private renderer!: T.WebGLRenderer;
  private dotMat!: T.ShaderMaterial;
  private pinTex!: T.CanvasTexture;
  private sphereHit!: T.Mesh;
  private planeHit!: T.Mesh;
  private pinGroup!: T.Group;
  private controls!: OrbitControls;
  private raycaster!: T.Raycaster;
  private dots?: T.Points;
  private flatDist = 400;
  private _onClick!: (e: MouseEvent) => void;
  private _onWheel!: (e: WheelEvent) => void;

  constructor(container: HTMLElement, opts: WireGlobeOptions = {}) {
    this.container = container;
    this.onPick = opts.onPick || function () {};
    this.dotColor = opts.dotColor || "#9a917f";
    this.pinColor = opts.pinColor || "#c2703f";
    this._init();
  }

  private _init() {
    const w = this.container.clientWidth || 480,
      h = this.container.clientHeight || 460;
    this.scene = new T.Scene();
    this.camera = new T.PerspectiveCamera(45, w / h, 1, 6000);
    this.camera.position.set(0, 0, D_GLOBE);
    this.renderer = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h);
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.display = "block";
    this.renderer.domElement.style.cursor = "grab";

    // dotted land cloud (filled once land polygons load)
    this.dotMat = dotMaterial(this.dotColor, 1.0);

    // shared pin texture
    this.pinTex = pinTexture(this.pinColor);

    // invisible raycast targets
    const hitMat = new T.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
    this.sphereHit = new T.Mesh(new T.SphereGeometry(R, 48, 36), hitMat);
    this.planeHit = new T.Mesh(new T.PlaneGeometry(PLANE_W, PLANE_H), hitMat);
    this.scene.add(this.sphereHit);
    this.scene.add(this.planeHit);

    this.pinGroup = new T.Group();
    this.scene.add(this.pinGroup);

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.rotateSpeed = 0.6;
    this.controls.minDistance = 170;
    this.controls.maxDistance = 520;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;
    this.controls.addEventListener("start", () => {
      this.controls.autoRotate = false;
      if (this.resumeTimer) clearTimeout(this.resumeTimer);
      this.renderer.domElement.style.cursor = "grabbing";
    });
    this.controls.addEventListener("end", () => {
      this.renderer.domElement.style.cursor = "grab";
      if (this.resumeTimer) clearTimeout(this.resumeTimer);
      this.resumeTimer = setTimeout(() => {
        if (this.mode === "globe" && !this.placing) this.controls.autoRotate = true;
      }, 3500);
    });

    this.raycaster = new T.Raycaster();
    this._onClick = (e) => this._handleClick(e);
    this.renderer.domElement.addEventListener("click", this._onClick);
    this._onWheel = (e) => this._handleWheel(e);
    this.renderer.domElement.addEventListener("wheel", this._onWheel, { passive: false });

    this._computeFlatDist();
    this._loadLand();
    this._loop();
  }

  private _computeFlatDist() {
    const fov = this.camera.fov * DEG,
      aspect = this.camera.aspect;
    const dH = PLANE_H / 2 / Math.tan(fov / 2);
    const dW = PLANE_W / 2 / (Math.tan(fov / 2) * aspect);
    this.flatDist = Math.max(dH, dW) * 1.08;
  }

  private async _loadLand() {
    try {
      const res = await fetch("https://unpkg.com/world-atlas@2.0.2/land-110m.json");
      const topo = (await res.json()) as Topology;
      const geo = topojson.feature(topo, topo.objects.land as GeometryObject) as GeoJSON.FeatureCollection<
        GeoJSON.Polygon | GeoJSON.MultiPolygon
      >;
      if (this._disposed) return;
      // flatten to array of polygons ([outerRing, ...holes] of [lng,lat])
      const polys: number[][][][] = [];
      for (const f of geo.features) {
        const g = f.geometry;
        if (!g) continue;
        if (g.type === "Polygon") polys.push(g.coordinates as number[][][]);
        else if (g.type === "MultiPolygon") (g.coordinates as number[][][][]).forEach((p) => polys.push(p));
      }
      const dots = landDots(polys);
      this.dots = buildDotCloud(dots, this.dotMat);
      this.dotMat.uniforms.uMorph.value = this.morph;
      this.scene.add(this.dots);
    } catch (e) {
      console.warn("[WireGlobe] land dots unavailable:", e instanceof Error ? e.message : e);
    }
  }

  setSize(w: number, h: number) {
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this._computeFlatDist();
    if (this.mode !== "globe") {
      this.controls.maxDistance = this.flatDist * 1.15;
      // only snap back if the current zoom now exceeds the fit distance
      if (!this.morphAnim && this.camera.position.length() > this.controls.maxDistance) {
        this.camera.position.set(0, 0, this.flatDist);
      }
    }
  }

  setPlacing(on: boolean) {
    this.placing = on;
    if (on) this.controls.autoRotate = false;
    this.renderer.domElement.style.cursor = on ? "crosshair" : this.mode === "globe" ? "grab" : "default";
  }

  setMode(mode: WireGlobeMode) {
    if (mode === this.mode) return;
    this.mode = mode;
    const toSphere = mode === "globe";
    const startMorph = this.morph,
      endMorph = toSphere ? 1 : 0;
    const startCam = this.camera.position.clone();
    const endCam = new T.Vector3(0, 0, toSphere ? D_GLOBE : this.flatDist);
    this.controls.enabled = false;
    this.controls.autoRotate = false;
    this.renderer.domElement.style.cursor = this.placing ? "crosshair" : toSphere ? "grab" : "default";
    const t0 = performance.now(),
      dur = 760;
    if (this.morphAnim) cancelAnimationFrame(this.morphAnim);
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur),
        e = easeInOutCubic(k);
      this.morph = startMorph + (endMorph - startMorph) * e;
      this.dotMat.uniforms.uMorph.value = this.morph;
      this.camera.position.lerpVectors(startCam, endCam, e);
      this.camera.lookAt(0, 0, 0);
      if (k < 1) {
        this.morphAnim = requestAnimationFrame(step);
      } else {
        this.morphAnim = null;
        if (toSphere) {
          this.controls.enableRotate = true;
          this.controls.enablePan = false;
          this.controls.enableZoom = true;
          this.controls.minDistance = 170;
          this.controls.maxDistance = 520;
          this.controls.mouseButtons = { LEFT: T.MOUSE.ROTATE, MIDDLE: T.MOUSE.DOLLY, RIGHT: T.MOUSE.PAN };
          this.controls.touches = { ONE: T.TOUCH.ROTATE, TWO: T.TOUCH.DOLLY_PAN };
          this.controls.enableZoom = true;
          this.controls.enabled = true;
          this.controls.target.set(0, 0, 0);
          this.controls.update();
          if (!this.placing) this.controls.autoRotate = true;
        } else {
          // flat map: no rotate — left-drag PANS, wheel zooms toward the cursor
          this.camera.position.set(0, 0, this.flatDist);
          this.camera.lookAt(0, 0, 0);
          this.controls.target.set(0, 0, 0);
          this.controls.enableRotate = false;
          this.controls.enablePan = true;
          this.controls.enableZoom = false;
          this.controls.autoRotate = false;
          this.controls.screenSpacePanning = true;
          this.controls.mouseButtons = { LEFT: T.MOUSE.PAN, MIDDLE: T.MOUSE.DOLLY, RIGHT: T.MOUSE.PAN };
          this.controls.touches = { ONE: T.TOUCH.PAN, TWO: T.TOUCH.DOLLY_PAN };
          this.controls.minDistance = 90;
          this.controls.maxDistance = this.flatDist * 1.15;
          this.controls.enabled = true;
          this.controls.update();
        }
      }
    };
    this.morphAnim = requestAnimationFrame(step);
  }

  // list: [{ id, lat, lng, count }] — ONE entry per location
  setPins(list: WireGlobePin[]) {
    const seen = new Set<string>();
    for (const p of list) {
      seen.add(p.id);
      const tier = tierOf(p.count || 1);
      let rec = this.pins.get(p.id);
      const flatV = flatPos(p.lat, p.lng),
        sphV = spherePos(p.lat, p.lng);
      if (!rec) {
        const mat = new T.SpriteMaterial({ map: this.pinTex, transparent: true, depthTest: false, depthWrite: false });
        const sprite = new T.Sprite(mat);
        sprite.renderOrder = 10;
        const flat = new T.Vector3(...flatV);
        const sphere = new T.Vector3(...sphV);
        sprite.position.copy(new T.Vector3().lerpVectors(flat, sphere, this.morph));
        this.pinGroup.add(sprite);
        rec = { flat, sphere, sprite, born: performance.now(), tier, prevTier: tier };
        this.pins.set(p.id, rec);
      } else {
        rec.flat.set(...flatV);
        rec.sphere.set(...sphV);
        if (tier !== rec.tier) {
          rec.prevTier = rec.tier;
          rec.tier = tier;
          rec.born = performance.now();
        }
      }
    }
    for (const [id, rec] of this.pins) {
      if (!seen.has(id)) {
        this.pinGroup.remove(rec.sprite);
        (rec.sprite.material as T.SpriteMaterial).dispose();
        this.pins.delete(id);
      }
    }
  }

  // wheel zoom anchored to the cursor (flat map only; globe uses OrbitControls' own zoom)
  private _handleWheel(e: WheelEvent) {
    if (this.mode === "globe" || this.morphAnim) return;
    e.preventDefault();
    const r = this.renderer.domElement.getBoundingClientRect();
    const ndc = new T.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const hits = this.raycaster.intersectObject(this.planeHit, false);
    const cam = this.camera.position,
      tgt = this.controls.target;
    const cz = cam.z;
    const factor = Math.exp(e.deltaY * 0.0015);
    const newCz = Math.max(this.controls.minDistance, Math.min(this.controls.maxDistance, cz * factor));
    const af = newCz / cz;
    const P = hits.length ? hits[0].point : new T.Vector3(tgt.x, tgt.y, 0);
    cam.x = P.x + (cam.x - P.x) * af;
    cam.y = P.y + (cam.y - P.y) * af;
    cam.z = newCz;
    tgt.x = P.x + (tgt.x - P.x) * af;
    tgt.y = P.y + (tgt.y - P.y) * af;
    tgt.z = 0;
    this.controls.update();
  }

  private _handleClick(e: MouseEvent) {
    if (!this.placing || this.morphAnim) return;
    const r = this.renderer.domElement.getBoundingClientRect();
    const m = new T.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(m, this.camera);
    const target = this.mode === "globe" ? this.sphereHit : this.planeHit;
    const hits = this.raycaster.intersectObject(target, false);
    if (!hits.length) return;
    const p = hits[0].point;
    let lat: number, lng: number;
    if (this.mode === "globe") {
      lat = Math.asin(Math.max(-1, Math.min(1, p.y / R))) / DEG;
      lng = Math.atan2(p.x, p.z) / DEG;
    } else {
      lat = p.y / R / DEG;
      lng = p.x / R / DEG;
    }
    lat = Math.max(-85, Math.min(85, lat));
    lng = ((lng + 180 + 360) % 360) - 180;
    this.onPick(lat, lng);
  }

  private _loop() {
    const camDir = new T.Vector3();
    const tmp = new T.Vector3();
    const render = () => {
      const now = performance.now();
      // flat map camera sits farther back → grow dots so map reads as clearly as the globe
      this.dotMat.uniforms.uSize.value = 3.0 * (1 + (1 - this.morph) * 1.25);
      camDir.copy(this.camera.position).normalize();
      for (const rec of this.pins.values()) {
        tmp.lerpVectors(rec.flat, rec.sphere, this.morph);
        rec.sprite.position.copy(tmp);
        const target = TIER_SIZE[rec.tier];
        // grow-in / retier pop
        const age = now - rec.born;
        let scale = target;
        if (age < 560) {
          const k = age / 560,
            e = 1 - Math.pow(1 - k, 3);
          const from = TIER_SIZE[rec.prevTier != null ? rec.prevTier : rec.tier] * 0.4;
          scale = from + (target - from) * e;
          if (k < 0.55) scale *= 1 + 0.18 * (k / 0.55);
          else scale *= 1.18 - 0.18 * ((k - 0.55) / 0.45);
        } else {
          // gentle heartbeat for denser tiers (heatmap pulse)
          const amp = TIER_PULSE[rec.tier];
          if (amp) scale = target * (1 + amp * Math.sin(now / 720 + rec.sphere.x));
        }
        // dim far hemisphere when spherical
        let dim = TIER_OPACITY[rec.tier];
        if (this.morph > 0.55) {
          const d = rec.sphere.clone().normalize().dot(camDir);
          const far = d < -0.05 ? 0.14 : 1;
          dim *= 1 + (far - 1) * ((this.morph - 0.55) / 0.45);
        }
        rec.sprite.scale.setScalar(scale);
        (rec.sprite.material as T.SpriteMaterial).opacity = dim;
      }
      if (this.controls.enabled) this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this._raf = requestAnimationFrame(render);
    };
    render();
  }

  dispose() {
    this._disposed = true;
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this.morphAnim) cancelAnimationFrame(this.morphAnim);
    if (this.resumeTimer) clearTimeout(this.resumeTimer);
    this.renderer.domElement.removeEventListener("click", this._onClick);
    this.renderer.domElement.removeEventListener("wheel", this._onWheel);
    this.controls.dispose();
    if (this.pinTex) this.pinTex.dispose();
    this.scene.traverse((o) => {
      const mesh = o as T.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((m) => m.dispose());
      }
    });
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
  }
}
