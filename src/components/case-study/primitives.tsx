import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mb-5 text-[11px] tracking-[3px] uppercase text-muted ${className}`}>[ {children} ]</div>;
}

export function SectionHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h3
      className={`mb-8 font-heading text-[40px] font-bold uppercase leading-[1.04] tracking-[-0.5px] text-ink ${className}`}
    >
      {children}
    </h3>
  );
}

export function CaseStudySection({
  id,
  fullHeight = false,
  children,
}: {
  id: string;
  fullHeight?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`cs-sec relative box-border border-t border-[#ddd2bc] bg-[#f4eee3] px-14 py-20 shadow-[0_-16px_36px_rgba(26,26,26,0.10)] md:px-[max(56px,calc((100%-1040px)/2))] ${
        fullHeight ? "flex min-h-[calc(100vh-116px)] flex-col justify-center" : ""
      }`}
    >
      {children}
    </section>
  );
}

export function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-chip-border py-[18px]">
      <div className="mb-[9px] text-[10px] tracking-[2px] uppercase text-muted">{label}</div>
      <div className="text-[15px] text-ink">{value}</div>
    </div>
  );
}

export function PlainField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2.5 text-[10px] tracking-[2px] uppercase text-muted">{label}</div>
      <div className="text-[15px] leading-[1.6] text-ink">{children}</div>
    </div>
  );
}

export function InfoCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border border-border bg-card p-[26px_28px]">
      <div className="mb-3 text-[10px] tracking-[2px] uppercase text-muted">{label}</div>
      <p className="m-0 text-[14px] leading-[1.7] text-body">{children}</p>
    </div>
  );
}

export function StatCard({ value, children }: { value: string; children: ReactNode }) {
  return (
    <div className="rounded-[3px] border border-border bg-card px-[30px] py-8">
      <div className="mb-3 font-heading text-[40px] font-bold leading-none text-accent-2">{value}</div>
      <p className="m-0 text-[14px] leading-[1.7] text-body">{children}</p>
    </div>
  );
}

export function NumberedPoint({ n, children, wide = false }: { n: string; children: ReactNode; wide?: boolean }) {
  return (
    <div
      className={`grid gap-5 border-t border-chip-border py-[22px] last:border-b ${
        wide ? "grid-cols-[30px_1fr] items-baseline" : "grid-cols-[40px_1fr]"
      }`}
    >
      <div className="font-heading text-[16px] italic text-accent-2">{n}</div>
      <p className="m-0 text-[15px] leading-[1.7] text-body-strong">{children}</p>
    </div>
  );
}

export function DefinitionRow({ term, termWidth = "200px", children }: { term: string; termWidth?: string; children: ReactNode }) {
  return (
    <div
      className="grid gap-6 border-t border-chip-border py-[22px] last:border-b"
      style={{ gridTemplateColumns: `${termWidth} 1fr` }}
    >
      <div className="font-heading text-[15px] font-semibold uppercase tracking-[0.3px] text-ink">{term}</div>
      <p className="m-0 text-[15px] leading-[1.7] text-body-strong">{children}</p>
    </div>
  );
}

export function FigureBlock({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="m-0">
      <div className="w-full rounded border border-border bg-[#fbf8f1] p-6">
        {/* case study source scans/mockups — render at native size, not cropped */}
        <Image src={src} alt={alt} width={1600} height={1000} className="block h-auto w-full" unoptimized />
      </div>
      <figcaption className="mt-3.5 font-mono text-[11px] tracking-[0.3px] text-[#8f8268]">{caption}</figcaption>
    </figure>
  );
}

export function NoteBanner({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-[18px] rounded-[5px] border border-[#c9a87f] bg-[rgba(156,111,79,0.06)] px-[22px] py-[18px]">
      <div className="flex-shrink-0 font-heading text-[12px] font-bold tracking-[1.5px] uppercase text-accent-2">
        {label}
      </div>
      <p className="m-0 text-[15px] leading-[1.7] text-body">{children}</p>
    </div>
  );
}

export function BackToWorkCTA() {
  return (
    <Link href="/#work" className="mt-14 flex items-center justify-between rounded bg-ink px-9 py-8 no-underline">
      <div>
        <div className="mb-2 text-[10px] tracking-[2px] uppercase text-muted">Back to</div>
        <div className="font-heading text-[24px] font-bold uppercase text-[#f6f1e7]">All Work</div>
      </div>
      <span className="text-[22px] text-[#f6f1e7]">&rarr;</span>
    </Link>
  );
}
