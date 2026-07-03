"use client";

import dynamic from "next/dynamic";
import { GlobeIcon } from "./VisitorGlobe";

// Three.js/localStorage need the browser, so this whole widget is client-only.
// Kept as a small dynamic()-with-ssr:false wrapper (must live in a Client
// Component) so the root layout itself can stay a Server Component.
const VisitorGlobe = dynamic(() => import("./VisitorGlobe"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 9999,
        width: 58,
        height: 58,
        borderRadius: "50%",
        border: "1px solid #d6cbb6",
        background: "#f3ede2",
        boxShadow: "0 8px 24px rgba(26,24,20,0.24), 0 0 0 4px rgba(243,237,226,0.55)",
      }}
    >
      <GlobeIcon />
    </div>
  ),
});

export default function VisitorGlobeLoader() {
  return <VisitorGlobe />;
}
