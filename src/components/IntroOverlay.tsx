"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
if (!CustomEase.get("intro-in")) CustomEase.create("intro-in", "0.65, 0, 0.35, 1");
if (!CustomEase.get("intro-out")) CustomEase.create("intro-out", "0.22, 1, 0.36, 1");

// useLayoutEffect on the client (checks sessionStorage before paint, so a repeat
// visit never flashes the overlay), useEffect on the server (avoids React's
// "useLayoutEffect does nothing on the server" warning during SSR).
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const NAMES = ["Kwab", "Kobby", "Coco", "Colin"];
const INTRO_PLAYED_KEY = "intro-played";

/**
 * Typewriter cover that plays over the homepage on first load, then wipes
 * away to reveal it. Ported from design-bundle/Intro.dc.html — the original
 * preloaded the homepage in a hidden <iframe> behind the cover and revealed
 * it on "Enter"; here the homepage is just the next sibling in the real DOM,
 * so revealing it is a matter of unmounting this overlay.
 *
 * Plays once per browser session: after the user enters, a sessionStorage
 * flag is set so that navigating back to "/" (via the Nav logo, "Back to All
 * Work", etc.) lands straight on the homepage instead of replaying the intro.
 */
export default function IntroOverlay() {
  const [visible, setVisible] = useState(true);

  // Runs before paint on the client — if the intro already played this
  // session, skip straight past it with no visible flash.
  useIsomorphicLayoutEffect(() => {
    if (sessionStorage.getItem(INTRO_PLAYED_KEY)) {
      setVisible(false);
    }
  }, []);
  const nameRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  const deadRef = useRef(false);
  const enteringRef = useRef(false);
  const blinkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Already past the intro this session (set by the sessionStorage check
    // above) — don't bother starting the typewriter at all.
    if (!visible) return;

    deadRef.current = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      if (nameRef.current) nameRef.current.textContent = "Colin";
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
      gsap.set(taglineRef.current, { opacity: 1, y: 0 });
      gsap.set(btnRef.current, { opacity: 1, y: 0 });
      return;
    }

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      });

    const startBlink = () => {
      let on = true;
      blinkIntervalRef.current = setInterval(() => {
        if (cursorRef.current) cursorRef.current.style.opacity = on ? "0" : "1";
        on = !on;
      }, 265);
    };
    const stopBlink = () => {
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
        blinkIntervalRef.current = null;
      }
    };

    const typeWord = async (word: string) => {
      const el = nameRef.current;
      for (let i = 1; i <= word.length; i++) {
        if (deadRef.current || !el) return;
        el.textContent = word.slice(0, i);
        await sleep(105);
      }
    };
    const deleteWord = async (word: string) => {
      const el = nameRef.current;
      for (let i = word.length - 1; i >= 0; i--) {
        if (deadRef.current || !el) return;
        el.textContent = word.slice(0, i);
        await sleep(60);
      }
    };

    const run = async () => {
      for (let i = 0; i < NAMES.length; i++) {
        const word = NAMES[i];
        await typeWord(word);
        if (deadRef.current) return;
        const last = word === "Colin";
        await sleep(last ? 900 : 1300);
        if (last) break;
        await deleteWord(word);
        if (deadRef.current) return;
        await sleep(180);
      }
      // settle: stop blink, hold cursor solid, then fade it out — purely
      // cosmetic once "Colin" lands, no longer gates anything else
      stopBlink();
      if (deadRef.current) return;
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
      await sleep(650);
      if (deadRef.current) return;
      if (cursorRef.current) await gsap.to(cursorRef.current, { opacity: 0, duration: 0.6, ease: "power2.out" });
    };

    // Reveal the tagline + Enter button on their own short timeline,
    // independent of the typewriter cycle above — a user can click through
    // immediately without waiting for it to reach "Colin". A small stagger
    // keeps the entrance from feeling like an instant dump of everything
    // at once, without tying it to the (multi-second) typewriter length.
    const taglineTween = gsap.fromTo(
      taglineRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.65, delay: 0.5, ease: "power2.out" },
    );
    const btnTween = gsap.fromTo(
      btnRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.65, delay: 0.7, ease: "power2.out" },
    );

    startBlink();
    run();

    return () => {
      deadRef.current = true;
      stopBlink();
      taglineTween.kill();
      btnTween.kill();
    };
  }, [visible]);

  const onEnter = (e: React.MouseEvent) => {
    e.preventDefault();
    if (enteringRef.current) return;
    enteringRef.current = true;
    sessionStorage.setItem(INTRO_PLAYED_KEY, "1");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(false);
      return;
    }

    const tl = gsap.timeline({ onComplete: () => setVisible(false) });
    tl.set(wipeRef.current, { yPercent: 101 });
    // Phase 1: sweep up from bottom to fully cover — ~600ms
    tl.to(wipeRef.current, { yPercent: 0, duration: 0.6, ease: "intro-in" });
    // homepage is already mounted behind; hide the intro cover under the terracotta
    tl.set(coverRef.current, { opacity: 0 });
    tl.to({}, { duration: 0.08 });
    // Phase 2: sweep up off the top, uncovering the homepage — ~500ms
    tl.to(wipeRef.current, { yPercent: -101, duration: 0.5, ease: "intro-out" });
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#F5F0E8] font-body text-ink">
      <div ref={coverRef} className="absolute inset-0 z-[2] flex items-center justify-center bg-[#F5F0E8]">
        <div className="flex flex-col items-center px-6 text-center">
          <div className="mb-7 text-[12px] tracking-[3px] uppercase text-muted">you can call me</div>

          <div className="flex min-h-[1.05em] items-baseline justify-center leading-[1.05]">
            <span
              ref={nameRef}
              className="whitespace-nowrap font-heading text-[clamp(46px,11vw,80px)] font-semibold tracking-[-1px] text-ink"
            />
            <span
              ref={cursorRef}
              aria-hidden
              className="ml-[10px] inline-block min-h-[clamp(46px,11vw,80px)] w-1 self-stretch rounded-[1px] bg-accent opacity-100"
            />
          </div>

          <div className="mt-11 flex flex-col items-center gap-9">
            <div ref={taglineRef} className="text-[17px] leading-[1.5] text-body opacity-0">
              UX Researcher &amp; HCI Graduate
            </div>
            <a
              ref={btnRef}
              href="#top"
              onClick={onEnter}
              className="inline-flex items-center gap-[10px] rounded-3xl border border-ink px-[34px] py-[14px] text-[11px] tracking-[2px] uppercase text-ink opacity-0 hover:bg-ink hover:text-[#F5F0E8]"
            >
              Enter <span className="text-[13px]">&rarr;</span>
            </a>
          </div>
        </div>
      </div>

      <div ref={wipeRef} aria-hidden className="pointer-events-none fixed inset-0 z-[100] translate-y-full bg-accent" />
    </div>
  );
}
