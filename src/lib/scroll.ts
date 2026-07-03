export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scroll to top or a section id, respecting prefers-reduced-motion. */
export function smoothScrollTo(target: "top" | string) {
  const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";

  if (target === "top") {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const el = document.getElementById(target);
  if (!el) return;
  el.scrollIntoView({ behavior, block: "start" });
}
