"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";

type LightboxItem = { type: "image" | "video"; src: string; alt?: string; caption: string };

const LightboxContext = createContext<((item: LightboxItem) => void) | null>(null);

export function useLightbox() {
  const open = useContext(LightboxContext);
  if (!open) throw new Error("useLightbox must be used within a LightboxProvider");
  return open;
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<LightboxItem | null>(null);
  const close = useCallback(() => setItem(null), []);
  const open = useMemo(() => (next: LightboxItem) => setItem(next), []);

  return (
    <LightboxContext.Provider value={open}>
      {children}
      {item && (
        <div
          onClick={close}
          className="fixed inset-0 z-[90] box-border flex cursor-zoom-out flex-col items-center justify-center gap-[18px] bg-[rgba(20,18,14,0.86)] p-12 backdrop-blur-sm"
        >
          {item.type === "video" ? (
            <video
              src={item.src}
              autoPlay
              muted
              loop
              playsInline
              className="max-h-[86vh] max-w-[95%] rounded-lg bg-black object-contain shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
            />
          ) : (
            <Image
              src={item.src}
              alt={item.alt || item.caption}
              width={1600}
              height={1000}
              unoptimized
              className="max-h-[86vh] max-w-[95%] rounded bg-[#fbf9f5] object-contain shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
            />
          )}
          <div className="text-[11px] tracking-[1.5px] uppercase text-cream/80">{item.caption}</div>
          <button
            onClick={close}
            aria-label="Close"
            className="fixed right-7 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-cream/40 text-[22px] leading-none text-cream hover:bg-cream/10"
          >
            &times;
          </button>
        </div>
      )}
    </LightboxContext.Provider>
  );
}

export function LightboxTrigger({
  item,
  label,
  children,
}: {
  item: LightboxItem;
  label: string;
  children: ReactNode;
}) {
  const open = useLightbox();
  return (
    <button
      onClick={() => open(item)}
      aria-label={label}
      className="flex aspect-[4/3] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-[3px] border border-border bg-[#fbf9f5] p-0 hover:border-accent-2"
    >
      {children}
    </button>
  );
}
