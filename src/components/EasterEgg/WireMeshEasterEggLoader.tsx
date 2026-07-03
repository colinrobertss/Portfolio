"use client";

import dynamic from "next/dynamic";

// Three.js + Web Audio need the browser, so this widget is client-only.
// Kept as a small dynamic()-with-ssr:false wrapper (must live in a Client
// Component). Mounted once in the root layout (as a sibling of {children},
// like VisitorGlobe) rather than inside Footer, so it survives client-side
// navigation between pages — the trigger that opens it (WireMeshTrigger,
// rendered per-page in Footer) talks to it over visualizer-bus instead of
// props, since the two don't share a React tree that persists across routes.
const WireMeshEasterEgg = dynamic(() => import("./WireMeshEasterEgg"), {
  ssr: false,
  loading: () => null,
});

export default function WireMeshEasterEggLoader() {
  return <WireMeshEasterEgg />;
}
