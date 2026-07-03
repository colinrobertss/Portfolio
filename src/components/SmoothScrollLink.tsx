"use client";

import type { MouseEvent, ReactNode } from "react";
import { smoothScrollTo } from "@/lib/scroll";

/**
 * Thin client-side wrapper around an in-page `<a href="#id">` link so Nav
 * and Hero (both Server Components) can trigger a JS-driven smooth scroll
 * — rather than a global `scroll-behavior: smooth`, which would also apply
 * to Next.js's own scroll-to-top-on-route-change behavior and make page
 * navigations feel sluggish.
 */
export default function SmoothScrollLink({
  targetId,
  className,
  children,
}: {
  targetId: string;
  className?: string;
  children: ReactNode;
}) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    smoothScrollTo(targetId);
  };

  return (
    <a href={`#${targetId}`} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
