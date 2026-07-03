import Image from "next/image";
import SmoothScrollLink from "@/components/SmoothScrollLink";

export default function Hero() {
  return (
    <section
      id="top"
      className="mx-auto grid max-w-[1160px] grid-cols-1 gap-[72px] px-14 pb-[140px] pt-[104px] md:grid-cols-2"
    >
      {/* LEFT COLUMN */}
      <div className="flex flex-col">
        <div className="mb-9 text-[11px] tracking-[3px] uppercase text-muted">[ Introduction ]</div>

        <h1 className="mb-7 font-heading text-[78px] font-bold uppercase leading-[0.98] tracking-[-1px] text-ink">
          Colin
          <br />
          Roberts
        </h1>

        <div className="mb-10 flex gap-3 text-[11px] tracking-[1.5px] uppercase text-muted">
          <div className="rounded-[18px] border border-chip-border px-4 py-2">UX Research</div>
          <div className="rounded-[18px] border border-chip-border px-4 py-2">HCI</div>
          <div className="rounded-[18px] border border-chip-border px-4 py-2">Psychology</div>
        </div>

        <div className="relative block aspect-[4/5] w-full overflow-hidden rounded-[3px]">
          <Image
            src="/uploads/DSC02618.JPG"
            alt="Colin Roberts"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            style={{ objectPosition: "center 22%" }}
          />
        </div>

        <div className="mt-[30px] text-[11px] leading-[1.9] tracking-[1.5px] uppercase text-muted">
          M.S. HCI &mdash; University of Maryland
          <br />
          B.S. Psychology &mdash; Virginia Tech
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col items-end text-right">
        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-chip-border px-[15px] py-[7px] text-[10px] tracking-[1.5px] uppercase text-[#6f6657]">
          <div className="h-[7px] w-[7px] animate-[status-blink-green_1.2s_ease-in-out_infinite] rounded-full bg-green" />
          Open to work
        </div>
        <div className="mb-[14px] text-[11px] tracking-[1.5px] text-muted">01 /</div>
        <div className="mb-32 text-[11px] leading-[1.9] tracking-[1.5px] uppercase text-muted">
          Behavior
          <br />
          &amp; Systems
        </div>

        <h2 className="mb-5 text-right font-heading text-[66px] font-bold uppercase leading-[0.98] tracking-[-1px] text-ink">
          UX
          <br />
          Researcher
        </h2>

        <div className="mb-11 max-w-[320px] text-[17px] leading-[1.5] text-body">
          Studying behavior. Designing for it.
        </div>

        <div className="mb-[22px] text-[11px] tracking-[2px] uppercase text-muted">2026 Portfolio</div>
        <SmoothScrollLink
          targetId="work"
          className="inline-flex items-center gap-[10px] rounded-[22px] border border-ink px-[26px] py-3 text-[11px] tracking-[2px] uppercase text-ink hover:bg-ink hover:text-cream"
        >
          Selected Work <span className="text-[13px]">&darr;</span>
        </SmoothScrollLink>
      </div>
    </section>
  );
}
