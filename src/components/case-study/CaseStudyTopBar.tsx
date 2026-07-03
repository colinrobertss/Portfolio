import Link from "next/link";

export default function CaseStudyTopBar({ shortName }: { shortName: string }) {
  return (
    <div className="sticky top-0 z-[60] h-14 border-b border-border bg-cream/90 backdrop-blur-sm backdrop-saturate-125">
      <div className="mx-auto flex h-full max-w-[1160px] items-center justify-between px-14">
        <div className="flex items-center gap-3.5 text-[11px] tracking-[1.5px] uppercase text-muted">
          <Link href="/" className="text-[#6f6657] no-underline hover:text-ink">
            &larr; Home
          </Link>
          <span className="text-ticker-amp">/</span>
          <span>{shortName}</span>
        </div>
      </div>
    </div>
  );
}
