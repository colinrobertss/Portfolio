"use client";

/* VisitorGlobe — fixed bottom-right "where visitors are from" widget.
 * Wireframe earth with a TRUE plane<->sphere vertex morph (see wire-globe.ts).
 *
 * Ported from design-bundle/VisitorGlobe.jsx: three.js, framer-motion and
 * topojson-client are now real npm dependencies (bundled) instead of CDN
 * <script> tags resolved onto window at runtime, and the wire-globe engine /
 * city lookup table are TS modules instead of window globals.
 *
 * NOTE: leaderboard counts persist via localStorage (per-browser, demo only).
 * Cross-visitor counts need a backend.
 */
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { WireGlobe, type WireGlobeMode, type WireGlobePin } from "./wire-globe";
import { WORLD_CITIES, type CityTuple } from "@/lib/world-cities";
import { searchCities, type GeoResult } from "./geocode";

const ACCENT = "#9a917f"; // dotted-land color — subdued warm gray
const PIN_ACCENT = "#c2703f"; // visitor pins — portfolio orange (single accent)
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

// density tiers: 1 / 2–5 / 6–15 / 16+
const tierOf = (c: number) => (c >= 16 ? 3 : c >= 6 ? 2 : c >= 2 ? 1 : 0);
const TIER_DOT = [7, 9, 12, 15]; // leaderboard swatch diameter
const TIER_ALPHA = [0.5, 0.7, 0.85, 1];

/* ---------- geo helpers ---------- */
function haversine(aLat: number, aLng: number, bLat: number, bLng: number) {
  const r = Math.PI / 180,
    R = 6371;
  const dLat = (bLat - aLat) * r,
    dLng = (bLng - aLng) * r;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * r) * Math.cos(bLat * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
function nearestCity(lat: number, lng: number) {
  let best: CityTuple | null = null,
    bestD = Infinity;
  for (const c of WORLD_CITIES) {
    const d = haversine(lat, lng, c[2], c[3]);
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best ? { city: best[0], country: best[1] } : { city: "Somewhere remote", country: "" };
}

/* ---------- animated count-up ---------- */
function AnimatedCount({ value }: { value: number }) {
  const [disp, setDisp] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const from = prev.current,
      to = value;
    prev.current = value;
    if (from === to) {
      setDisp(to);
      return;
    }
    const t0 = performance.now(),
      dur = 480;
    let raf: number;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      setDisp(Math.round(from + (to - from) * e));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return disp;
}

/* ---------- styles injected once ---------- */
function injectStyles() {
  if (document.getElementById("vg-styles")) return;
  const s = document.createElement("style");
  s.id = "vg-styles";
  s.textContent = `
    @keyframes vgMerid { 0%{transform:scaleX(1);} 50%{transform:scaleX(0.08);} 100%{transform:scaleX(1);} }
    .vg-scroll::-webkit-scrollbar{width:8px;} .vg-scroll::-webkit-scrollbar-thumb{background:#d6cbb6;border-radius:8px;}
    .vg-search-res:hover{background:#efe7d8 !important;}
  `;
  document.head.appendChild(s);
}

/* ---------- persistence ---------- */
interface Pin {
  id: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
}
const LS_KEY = "vg_pins_v3";
function loadPins(): Pin[] {
  try {
    const r = JSON.parse(localStorage.getItem(LS_KEY) || "null");
    if (Array.isArray(r)) return r;
  } catch {
    // ignore malformed storage
  }
  // Start blank — no seeded demo pins. Real pins persist per-browser via localStorage.
  return [];
}

/* ---------- dotted globe trigger icon (matches the 3D globe) ---------- */
const GLOBE_DOTS = (() => {
  const dots: { cx: number; cy: number; rad: number; o: number }[] = [];
  const D = Math.PI / 180,
    r = 37;
  for (let lat = -75; lat <= 75; lat += 15) {
    const circ = Math.cos(lat * D);
    const lngStep = 15 / Math.max(circ, 0.28); // even spacing, thin out near poles
    for (let lng = -180; lng < 180; lng += lngStep) {
      const x = Math.cos(lat * D) * Math.sin(lng * D);
      const y = Math.sin(lat * D);
      const z = Math.cos(lat * D) * Math.cos(lng * D);
      if (z < 0.02) continue; // front hemisphere only
      dots.push({ cx: 50 + x * r, cy: 50 - y * r, rad: 1.7 * (0.55 + 0.45 * z), o: 0.3 + 0.7 * z });
    }
  }
  return dots;
})();

export function GlobeIcon() {
  return (
    <div style={{ position: "absolute", inset: 6, borderRadius: "50%", overflow: "hidden" }}>
      <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
        {GLOBE_DOTS.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.rad} fill={PIN_ACCENT} opacity={d.o} />
        ))}
      </svg>
    </div>
  );
}

/* ---------- small toggle icons ---------- */
function CompassSvg({ color }: { color: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" />
      <polygon points="12,4.5 14,12 12,12" fill={color} />
      <polygon points="12,19.5 10,12 12,12" fill={color} opacity="0.45" />
      <polygon points="12,4.5 10,12 12,12" fill={color} opacity="0.75" />
      <polygon points="12,19.5 14,12 12,12" fill={color} opacity="0.3" />
      <circle cx="12" cy="12" r="1.25" fill={color} />
    </svg>
  );
}
function GlobeSvg({ color }: { color: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  );
}

const MOBILE_QUERY = "(max-width: 768px)";

/* ---------- main widget ---------- */
export default function VisitorGlobe() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<WireGlobeMode>("globe");
  const [mounted3d, setMounted3d] = useState(false); // delay WebGL mount until morph settles
  const [pins, setPins] = useState<Pin[]>(loadPins);
  const [placing, setPlacing] = useState(false);
  const [query, setQuery] = useState("");
  // Below the breakpoint, the map and leaderboard can't fit side by side —
  // one shows at a time via a tab, picked from `mobileTab`. Panels are kept
  // mounted and toggled with CSS display rather than conditionally rendered,
  // so switching tabs never tears down/recreates the WireGlobe 3D engine.
  const [isMobile, setIsMobile] = useState(false);
  const [mobileTab, setMobileTab] = useState<"map" | "board">("map");
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  // Tagged with the (trimmed) query it was resolved for, so a slow response
  // for an old query can never render as if it belonged to what's typed now
  // — see `isCurrent` below.
  const [search, setSearch] = useState<{ query: string; status: "ok" | "empty" | "error"; results: GeoResult[] }>({
    query: "",
    status: "empty",
    results: [],
  });

  const stageRef = useRef<HTMLDivElement>(null);
  const wireRef = useRef<WireGlobe | null>(null);
  const placeRef = useRef<(lat: number, lng: number, known?: { city: string; country: string }) => void>(() => {});

  useEffect(() => {
    injectStyles();
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(pins));
    } catch {
      // storage unavailable (private browsing, quota) — pins just won't persist
    }
  }, [pins]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPlacing(false);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // open/close: mount WebGL after the genie morph settles, reset on close via cleanup
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setMounted3d(true), 520);
    return () => {
      clearTimeout(t);
      setMounted3d(false);
      setPlacing(false);
    };
  }, [open]);

  /* ----- pin placement ----- */
  const placePin = useCallback((lat: number, lng: number, known?: { city: string; country: string }) => {
    const c = known || nearestCity(lat, lng);
    const id = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    setPins((p) => [...p, { id, lat, lng, city: c.city, country: c.country }]);
    setPlacing(false);
  }, []);
  useEffect(() => {
    placeRef.current = placePin;
  }, [placePin]);

  /* ----- aggregate: ONE entry per location, count = visits (density) ----- */
  const aggregated = useMemo(() => {
    const m = new Map<string, WireGlobePin & { city: string; country: string }>();
    for (const p of pins) {
      const k = p.city + "|" + p.country;
      const cur = m.get(k) || { id: k, city: p.city, country: p.country, lat: 0, lng: 0, count: 0 };
      cur.count++;
      cur.lat += p.lat;
      cur.lng += p.lng;
      m.set(k, cur);
    }
    return [...m.values()].map((o) => ({ ...o, lat: o.lat / o.count, lng: o.lng / o.count }));
  }, [pins]);

  // instantiate / dispose the engine
  useEffect(() => {
    if (!mounted3d || !stageRef.current) return;
    const wg = new WireGlobe(stageRef.current, {
      dotColor: ACCENT,
      pinColor: PIN_ACCENT,
      onPick: (lat, lng) => placeRef.current(lat, lng),
    });
    wireRef.current = wg;
    wg.setPins(aggregated);
    if (view !== "globe") wg.setMode(view);
    let ro: ResizeObserver | undefined;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => {
        // The observer callback fires asynchronously, decoupled from React's
        // commit timing — the stage can have already unmounted (Strict Mode's
        // dev-only mount/cleanup/remount cycle, or the panel closing) by the
        // time this runs, so stageRef.current may be null here.
        if (!stageRef.current) return;
        const r = stageRef.current.getBoundingClientRect();
        wg.setSize(Math.round(r.width), Math.round(r.height));
      });
      ro.observe(stageRef.current);
    }
    return () => {
      if (ro) ro.disconnect();
      wg.dispose();
      wireRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted3d]);

  useEffect(() => {
    if (wireRef.current) wireRef.current.setMode(view);
  }, [view]);
  useEffect(() => {
    if (wireRef.current) wireRef.current.setPins(aggregated);
  }, [aggregated, mounted3d]);
  useEffect(() => {
    if (wireRef.current) wireRef.current.setPlacing(placing);
  }, [placing]);

  /* ----- search: debounced live geocoding against Nominatim (OpenStreetMap) -----
   * Query length < 2 is handled entirely by the render-time `showResults` gate
   * below rather than resetting state here, so this effect never calls
   * setState synchronously in its body — only from the promise callbacks,
   * once the debounce has actually elapsed and a real response comes back. */
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;

    const controller = new AbortController();
    const t = setTimeout(() => {
      searchCities(q, controller.signal)
        .then((found) => {
          setSearch({ query: q, status: found.length ? "ok" : "empty", results: found });
        })
        .catch((err) => {
          if (err instanceof DOMException && err.name === "AbortError") return;
          setSearch({ query: q, status: "error", results: [] });
        });
    }, 400);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  const trimmedQuery = query.trim();
  const showResults = trimmedQuery.length >= 2;
  // While the debounce is pending or a request is in flight for the current
  // query, `search` still reflects whatever query it was last resolved for —
  // treat anything not tagged for the current query as "still loading" so a
  // slow/stale response never flashes results for a different query.
  const isSearchCurrent = search.query === trimmedQuery;
  const results = isSearchCurrent ? search.results : [];
  const searchStatus: "loading" | "ok" | "empty" | "error" = isSearchCurrent ? search.status : "loading";

  const pickResult = useCallback(
    (r: GeoResult) => {
      setQuery("");
      setSearch({ query: "", status: "empty", results: [] });
      placePin(r.lat, r.lng, { city: r.city, country: r.country });
    },
    [placePin],
  );

  /* ----- leaderboard (ranked by share) ----- */
  const board = useMemo(() => {
    const total = pins.length || 1;
    const max = aggregated.reduce((m, r) => Math.max(m, r.count), 1);
    return [...aggregated]
      .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city))
      .map((r) => ({ ...r, pct: Math.round((r.count / total) * 100), share: r.count / max, tier: tierOf(r.count) }));
  }, [aggregated, pins.length]);

  const segIcon = (active: boolean): React.CSSProperties => ({
    appearance: "none",
    border: "none",
    cursor: "pointer",
    width: 36,
    height: 30,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: active ? "#1a1a1a" : "transparent",
    transition: "all .25s ease",
  });

  return (
    <LayoutGroup>
      <AnimatePresence>
        {open && (
          <motion.div
            key="vg-bd"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(26,24,20,0.28)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              zIndex: 9998,
            }}
          />
        )}
      </AnimatePresence>

      <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 9999 }}>
        {!open ? (
          <motion.button
            layoutId="vgShell"
            onClick={() => setOpen(true)}
            aria-label="See where visitors are from"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            transition={{ layout: { duration: 0.5, ease: EASE_EXPO } }}
            style={{
              position: "relative",
              width: 58,
              height: 58,
              borderRadius: "50%",
              padding: 0,
              cursor: "pointer",
              border: "1px solid #d6cbb6",
              background: "#f3ede2",
              boxShadow: "0 8px 24px rgba(26,24,20,0.24), 0 0 0 4px rgba(243,237,226,0.55)",
            }}
          >
            <motion.div layout="position" style={{ position: "absolute", inset: 0 }}>
              <GlobeIcon />
            </motion.div>
          </motion.button>
        ) : (
          <motion.div
            layoutId="vgShell"
            transition={{ layout: { duration: 0.5, ease: EASE_EXPO } }}
            style={{
              width: "min(780px, calc(100vw - 32px))",
              height: "min(540px, calc(100vh - 32px))",
              borderRadius: 18,
              overflow: "hidden",
              background: "#f3ede2",
              border: "1px solid #d6cbb6",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 30px 80px rgba(26,24,20,0.30), 0 0 0 1px rgba(214,203,182,0.5)",
              fontFamily: "'General Sans', system-ui, sans-serif",
              color: "#524d43",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.18 }}
              style={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              {/* header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "15px 18px",
                  borderBottom: "1px solid #e3d9c7",
                  flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <div
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: 17,
                      letterSpacing: "0.3px",
                      color: "#1a1a1a",
                      lineHeight: 1,
                    }}
                  >
                    Visitor Map
                  </div>
                  <div style={{ fontSize: 10.5, letterSpacing: "1.5px", textTransform: "uppercase", color: "#857a66" }}>
                    Drop a pin &mdash; say hello
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", gap: 2, padding: 3, background: "#e8dfce", borderRadius: 16 }}>
                    <button style={segIcon(view === "flat")} onClick={() => setView("flat")} aria-label="Flat map view" title="Map">
                      <CompassSvg color={view === "flat" ? "#f3ede2" : "#857a66"} />
                    </button>
                    <button style={segIcon(view === "globe")} onClick={() => setView("globe")} aria-label="Globe view" title="Globe">
                      <GlobeSvg color={view === "globe" ? "#f3ede2" : "#857a66"} />
                    </button>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "1px solid #d6cbb6",
                      background: "transparent",
                      color: "#1a1a1a",
                      cursor: "pointer",
                      fontSize: 17,
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    &times;
                  </button>
                </div>
              </div>

              {/* mobile tabs: map/globe and leaderboard can't fit side by side below the breakpoint */}
              {isMobile && (
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    padding: "10px 14px",
                    borderBottom: "1px solid #e3d9c7",
                    background: "#f5efe4",
                    flexShrink: 0,
                  }}
                >
                  {(
                    [
                      ["map", "Map"],
                      ["board", `Leaderboard (${pins.length})`],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setMobileTab(key)}
                      style={{
                        flex: 1,
                        padding: "8px 0",
                        borderRadius: 10,
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "'Oswald', sans-serif",
                        fontWeight: 600,
                        fontSize: 11,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        background: mobileTab === key ? "#1a1a1a" : "transparent",
                        color: mobileTab === key ? "#f3ede2" : "#857a66",
                        transition: "all .2s ease",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {/* body */}
              <div style={{ display: "flex", flex: 1, minHeight: 0, flexDirection: isMobile ? "column" : "row" }}>
                {/* stage (wireframe canvas mounts here) */}
                <div
                  ref={stageRef}
                  style={{
                    position: "relative",
                    display: isMobile && mobileTab !== "map" ? "none" : "block",
                    flex: isMobile ? "1 1 auto" : 1,
                    width: isMobile ? "100%" : undefined,
                    minWidth: 0,
                    background: "#e8dfce",
                    overflow: "hidden",
                    cursor: placing ? "crosshair" : "default",
                  }}
                >
                  {!mounted3d && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 180, height: 180, position: "relative", opacity: 0.5 }}>
                        <GlobeIcon />
                      </div>
                    </div>
                  )}

                  {/* search bar — fluid width so it never overflows a narrow/mobile stage */}
                  <div style={{ position: "absolute", top: 14, left: 14, width: "min(248px, calc(100% - 28px))", zIndex: 5 }}>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && results[0]) pickResult(results[0]);
                      }}
                      placeholder="Search a city or town…"
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "10px 13px",
                        borderRadius: 12,
                        border: "1px solid #d6cbb6",
                        background: "#fbf7ef",
                        fontFamily: "'General Sans', sans-serif",
                        fontSize: 13,
                        color: "#1a1a1a",
                        outline: "none",
                        boxShadow: "0 6px 16px rgba(26,24,20,0.10)",
                      }}
                    />
                    {showResults && (
                      <div
                        style={{
                          marginTop: 6,
                          background: "#fbf7ef",
                          border: "1px solid #d6cbb6",
                          borderRadius: 12,
                          overflow: "hidden",
                          boxShadow: "0 10px 24px rgba(26,24,20,0.16)",
                        }}
                      >
                        {searchStatus === "loading" && (
                          <div style={{ padding: "10px 13px", fontSize: 12, color: "#857a66" }}>Searching…</div>
                        )}
                        {searchStatus === "empty" && (
                          <div style={{ padding: "10px 13px", fontSize: 12, color: "#857a66" }}>No matches found</div>
                        )}
                        {searchStatus === "error" && (
                          <div style={{ padding: "10px 13px", fontSize: 12, color: "#857a66" }}>
                            Search unavailable — try again
                          </div>
                        )}
                        {searchStatus === "ok" &&
                          results.map((r, i) => (
                            <div
                              key={r.id}
                              className="vg-search-res"
                              onClick={() => pickResult(r)}
                              style={{
                                display: "flex",
                                alignItems: "baseline",
                                justifyContent: "space-between",
                                gap: 8,
                                padding: "9px 13px",
                                cursor: "pointer",
                                borderTop: i ? "1px solid #e3d9c7" : "none",
                              }}
                            >
                              <span style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 500 }}>{r.city}</span>
                              <span style={{ fontSize: 10.5, letterSpacing: "0.5px", textTransform: "uppercase", color: "#857a66" }}>
                                {r.country}
                              </span>
                            </div>
                          ))}
                        {searchStatus === "ok" && (
                          <div
                            style={{
                              padding: "6px 13px",
                              fontSize: 9,
                              letterSpacing: "0.3px",
                              color: "#a89f8d",
                              borderTop: "1px solid #e3d9c7",
                            }}
                          >
                            Search by OpenStreetMap
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* drop pin */}
                  <button
                    onClick={() => setPlacing((v) => !v)}
                    style={{
                      position: "absolute",
                      bottom: 14,
                      left: 14,
                      zIndex: 5,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 18px",
                      borderRadius: 22,
                      border: "1px solid " + (placing ? "transparent" : "#1a1a1a"),
                      background: placing ? "#c2703f" : "#fbf7ef",
                      color: placing ? "#fff" : "#1a1a1a",
                      cursor: "pointer",
                      fontFamily: "'Oswald', sans-serif",
                      fontWeight: 600,
                      fontSize: 11,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      boxShadow: "0 6px 16px rgba(26,24,20,0.14)",
                      transition: "all .2s ease",
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: placing ? "#fff" : "#c2703f" }} />
                    {placing ? "Cancel" : "Drop your pin"}
                  </button>

                  <AnimatePresence>
                    {placing && (
                      <motion.div
                        key="vg-banner"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        style={{
                          position: "absolute",
                          top: 14,
                          left: "50%",
                          transform: "translateX(-50%)",
                          zIndex: 6,
                          padding: "8px 16px",
                          borderRadius: 20,
                          background: "rgba(26,24,20,0.85)",
                          color: "#f3ede2",
                          fontSize: 11.5,
                          letterSpacing: "0.4px",
                          whiteSpace: "nowrap",
                          boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
                        }}
                      >
                        Click the {view === "globe" ? "globe" : "map"} to drop your pin
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* leaderboard */}
                <div
                  className="vg-scroll"
                  style={{
                    display: isMobile && mobileTab !== "board" ? "none" : "block",
                    width: isMobile ? "100%" : 224,
                    flexShrink: 0,
                    background: "#f5efe4",
                    borderLeft: isMobile ? "none" : "1px solid #e3d9c7",
                    borderTop: isMobile ? "1px solid #e3d9c7" : "none",
                    overflowY: "auto",
                    padding: "16px 0",
                  }}
                >
                  <div style={{ padding: "0 18px 12px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        fontSize: 13,
                        letterSpacing: "1px",
                        color: "#1a1a1a",
                      }}
                    >
                      Leaderboard
                    </span>
                    <span style={{ fontSize: 10, letterSpacing: "1px", textTransform: "uppercase", color: "#a89f8d" }}>
                      {pins.length} visits
                    </span>
                  </div>
                  {board.map((row, i) => (
                    <div
                      key={row.city + row.country}
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: 11,
                        padding: "9px 18px",
                        borderTop: "1px solid #ece3d2",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: row.share * 100 + "%",
                          background: "rgba(194,112,63,0.09)",
                          pointerEvents: "none",
                        }}
                      />
                      <span
                        style={{
                          position: "relative",
                          fontFamily: "'Oswald', sans-serif",
                          fontStyle: "italic",
                          fontSize: 12,
                          color: "#a89f8d",
                          width: 16,
                          textAlign: "right",
                        }}
                      >
                        {i + 1}
                      </span>
                      <span style={{ position: "relative", width: 15, display: "flex", justifyContent: "center", flexShrink: 0 }}>
                        <span
                          style={{
                            width: TIER_DOT[row.tier],
                            height: TIER_DOT[row.tier],
                            borderRadius: "50%",
                            background: PIN_ACCENT,
                            opacity: TIER_ALPHA[row.tier],
                            boxShadow: "0 0 0 3px rgba(194,112,63," + (0.1 * TIER_ALPHA[row.tier]).toFixed(3) + ")",
                          }}
                        />
                      </span>
                      <div style={{ position: "relative", display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                        <span
                          style={{
                            fontSize: 13,
                            color: "#1a1a1a",
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.city}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            letterSpacing: "0.4px",
                            textTransform: "uppercase",
                            color: "#857a66",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.country}
                        </span>
                      </div>
                      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
                        <span
                          style={{
                            fontFamily: "'Oswald', sans-serif",
                            fontWeight: 700,
                            fontSize: 16,
                            color: "#1a1a1a",
                            fontVariantNumeric: "tabular-nums",
                            lineHeight: 1,
                          }}
                        >
                          <AnimatedCount value={row.count} />
                        </span>
                        <span style={{ fontSize: 9.5, letterSpacing: "0.5px", color: "#a89f8d", fontVariantNumeric: "tabular-nums" }}>
                          {row.pct}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </LayoutGroup>
  );
}
