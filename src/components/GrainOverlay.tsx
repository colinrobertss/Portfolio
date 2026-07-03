"use client";

import { useEffect, useRef } from "react";

const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='1.6' intercept='-0.25'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Sitewide film-grain texture + a soft warm blob that trails the cursor.
 * Ported from design-bundle/motion.js (custom-cursor path was disabled there
 * — FINE=false — so it's omitted here too).
 */
export default function GrainOverlay() {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, has: false };
    const blobPos = { x: pointer.x, y: pointer.y };
    const blobTarget = { x: pointer.x, y: pointer.y };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.has = true;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let raf: number;
    const frame = () => {
      const blob = blobRef.current;
      if (blob) {
        if (pointer.has) {
          blobTarget.x = pointer.x;
          blobTarget.y = pointer.y;
        }
        blobPos.x = lerp(blobPos.x, blobTarget.x, 0.1);
        blobPos.y = lerp(blobPos.y, blobTarget.y, 0.1);
        blob.style.transform = `translate(${blobPos.x - 310}px, ${blobPos.y - 310}px)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9998] opacity-25 mix-blend-multiply"
        style={{ backgroundImage: GRAIN_SVG, backgroundSize: "140px 140px" }}
      />
      <div
        ref={blobRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9997] h-[620px] w-[620px] rounded-full opacity-25 blur-[80px] will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(201,160,99,.95) 0%, rgba(184,138,78,.55) 38%, rgba(184,138,78,0) 70%)",
        }}
      />
    </>
  );
}