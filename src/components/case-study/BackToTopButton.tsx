"use client";

import { useEffect, useState } from "react";
import { smoothScrollTo } from "@/lib/scroll";

// Fraction of a viewport height — the button appears once the user is within
// this much of the true bottom of the page, rather than being visible for
// the entire scroll (there's not much point offering "back to top" until
// there's meaningfully far to go back).
const NEAR_BOTTOM_FRACTION = 0.3;

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const remaining = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
      setVisible(remaining < window.innerHeight * NEAR_BOTTOM_FRACTION);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => smoothScrollTo("top")}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-8 left-1/2 z-[70] flex h-[52px] w-[52px] -translate-x-1/2 items-center justify-center rounded-full border border-ink text-[20px] leading-none text-ink transition-opacity duration-300 ease-out hover:bg-cream-deep ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      &uarr;
    </button>
  );
}
