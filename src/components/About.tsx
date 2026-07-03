const METHODS = [
  "Usability Testing",
  "Stakeholder Interviews",
  "Focus Groups",
  "Heuristic Evaluation",
  "Competitive Analysis",
  "Affinity Diagramming",
  "Journey Mapping",
  "Thematic Analysis",
];

const TOOLS = ["Figma", "Miro", "FigJam", "PowerPoint", "SPSS", "Excel", "Python", "JavaScript", "HTML/CSS"];

const FOCUS = ["User Experience", "Interactivity", "Performance", "Accessibility"];

function TickerRow({ items, direction }: { items: string[]; direction: "left" | "right" }) {
  const anim = direction === "left" ? "animate-[ticker-left_40s_linear_infinite]" : "animate-[ticker-right_44s_linear_infinite]";
  const run = (keyPrefix: string) => (
    <>
      {items.map((item, i) => (
        <span key={`${keyPrefix}-${i}`} className="flex items-center">
          <span className="flex-shrink-0 whitespace-nowrap font-heading text-[clamp(40px,5vw,82px)] font-bold uppercase leading-none tracking-[-1px] text-ink">
            {item}
          </span>
          <span
            aria-hidden
            className="flex-shrink-0 whitespace-nowrap px-[0.34em] font-heading text-[clamp(26px,3.2vw,52px)] font-medium leading-none text-ticker-amp"
          >
            &amp;
          </span>
        </span>
      ))}
    </>
  );
  return (
    <div
      className="ticker-row relative flex flex-1 items-center overflow-hidden"
      style={{
        WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 3%, #000 80%, transparent 100%)",
        maskImage: "linear-gradient(90deg, transparent 0, #000 3%, #000 80%, transparent 100%)",
      }}
    >
      <div className={`ticker-track flex w-max items-center will-change-transform ${anim}`}>
        {run("a")}
        {run("b")}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative border-y border-border bg-cream-deep">
      <div className="mx-auto grid max-w-[1160px] grid-cols-1 items-start gap-24 px-14 py-[104px] md:grid-cols-2">
        {/* LEFT: heading + paragraphs */}
        <div className="flex flex-col">
          <div className="mb-6 text-[11px] tracking-[3px] uppercase text-muted">[ bio ]</div>

          <h2 className="mb-10 font-heading text-[54px] font-bold uppercase leading-none tracking-[-0.5px] text-ink">
            About
          </h2>

          <p className="mb-7 text-[15px] leading-[1.75] text-body-strong">
            I hold an M.S. in Human-Computer Interaction from the University of Maryland and a B.S. in Psychology
            from Virginia Tech.
          </p>

          <p className="mb-7 text-[15px] leading-[1.75] text-body">
            My work sits at the intersection of behavior and systems &mdash; uncovering why people struggle with
            the tools meant to help them, then translating that into research-backed design decisions.
          </p>

          <p className="text-[15px] leading-[1.75] text-body">
            Recent work spans nonprofit partner portals, transit systems, and accessibility-driven app design.
          </p>
        </div>

        {/* RIGHT: skills / methods tickers */}
        <div className="flex min-w-0 flex-col justify-center gap-[clamp(4px,2vh,22px)] self-stretch">
          <TickerRow items={METHODS} direction="left" />
          <TickerRow items={TOOLS} direction="right" />
        </div>
      </div>

      {/* FOCUS list, far right edge */}
      <div className="absolute right-14 top-1/2 z-[3] hidden -translate-y-1/2 flex-col items-end gap-[9px] text-right lg:flex">
        <div className="mb-[5px] border-b border-ticker-amp pb-[9px] text-[10px] tracking-[3px] uppercase text-muted-2">
          Focus
        </div>
        {FOCUS.map((item) => (
          <div key={item} className="font-heading text-[15px] font-semibold uppercase tracking-[1px] text-body-strong">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
