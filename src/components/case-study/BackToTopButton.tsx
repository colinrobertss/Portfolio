"use client";

import { smoothScrollTo } from "@/lib/scroll";

export default function BackToTopButton() {
  return (
    <button
      onClick={() => smoothScrollTo("top")}
      aria-label="Back to top"
      className="fixed bottom-8 right-8 z-[70] flex h-[52px] w-[52px] items-center justify-center rounded-full border border-ink text-[20px] leading-none text-ink hover:bg-cream-deep"
    >
      &uarr;
    </button>
  );
}
