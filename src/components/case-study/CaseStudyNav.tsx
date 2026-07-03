"use client";

import { useEffect, useState } from "react";
import { smoothScrollTo } from "@/lib/scroll";

export default function CaseStudyNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight * 0.35;
      let current = items[0]?.id;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  return (
    <nav className="sticky top-14 z-40 border-b border-border bg-cream-deep/92 backdrop-blur-sm backdrop-saturate-125">
      <div className="mx-auto flex h-[54px] max-w-[1160px] items-center gap-[30px] overflow-x-auto px-14">
        {items.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo(id);
            }}
            className={`whitespace-nowrap text-[13px] uppercase tracking-[1.5px] no-underline transition-colors duration-200 ${
              active === id ? "font-semibold text-accent-2" : "text-[#9b9384]"
            }`}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
