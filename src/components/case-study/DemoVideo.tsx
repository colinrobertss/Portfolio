"use client";

import { useEffect, useRef } from "react";
import { useLightbox } from "./Lightbox";

/**
 * Phone-framed autoplay demo video, ported from the `bt-demo-video` /
 * `wr-demo-video` elements in the design bundle: muted/looping in place,
 * click to open the same clip full-size in the lightbox, and respects
 * prefers-reduced-motion by holding on the poster frame instead of playing.
 */
export default function DemoVideo({
  src,
  poster,
  aspectRatio,
  caption,
  lightboxCaption,
}: {
  src: string;
  poster: string;
  aspectRatio: string;
  caption: string;
  lightboxCaption: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const open = useLightbox();

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      vid.pause();
      vid.currentTime = 0;
    } else {
      vid.play().catch(() => {});
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <video
        ref={videoRef}
        onClick={() => open({ type: "video", src, caption: lightboxCaption })}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        style={{ aspectRatio }}
        className="block w-[290px] max-w-full cursor-zoom-in rounded-[38px] border-4 border-chip-border object-cover shadow-[0_22px_44px_rgba(26,26,26,0.22)]"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="font-mono text-[11px] tracking-[0.5px] text-[#8f8268]">{caption}</div>
    </div>
  );
}
