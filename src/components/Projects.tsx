import Image from "next/image";
import Link from "next/link";

type Project = {
  num: string;
  title: string;
  desc: string;
  href: string;
  badge: string;
  treatment: "logo" | "light" | "photo";
  image: string;
};

const PROJECTS: Project[] = [
  {
    num: "01",
    title: "PCC Secure Partner Portal",
    desc: "Streamlining secure resource access for nonprofit partners.",
    href: "/work/pcc-secure-partner-portal",
    badge: "Capstone Project",
    treatment: "logo",
    image: "/uploads/PCC_SoloLogo.jpeg",
  },
  {
    num: "02",
    title: "WriteRight",
    desc: "Accessibility-first design for an everyday writing tool.",
    href: "/work/writeright",
    badge: "Academic Proposal · Concept Prototype",
    treatment: "light",
    image: "/uploads/WriteRight_HeroNoText.svg",
  },
  {
    num: "03",
    title: "Blacksburg Transit",
    desc: "Improving the rider experience across a regional transit system.",
    href: "/work/blacksburg-transit",
    badge: "Course Project",
    treatment: "photo",
    image: "/uploads/BT_Hero.jpg",
  },
];

function ProjectMedia({ project }: { project: Project }) {
  if (project.treatment === "logo") {
    return (
      <>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 42%, #eef5fb 0%, #d4e6f3 100%)" }}
        />
        <Image
          src={project.image}
          alt={project.title}
          width={240}
          height={240}
          className="relative z-[1] h-[64%] max-h-[200px] w-auto object-contain mix-blend-multiply"
        />
        <div
          className="absolute inset-0 z-[2] flex items-center justify-center px-5 text-center font-heading text-[26px] font-bold uppercase leading-tight tracking-[-0.5px] text-pcc-blue"
          style={{ textShadow: "0 1px 10px rgba(244,242,236,0.85)" }}
        >
          {project.title}
        </div>
      </>
    );
  }

  if (project.treatment === "light") {
    return (
      <>
        {/* SVG source — skip the raster optimizer, it's already vector/lightweight */}
        <Image src={project.image} alt={project.title} fill unoptimized className="object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(244,242,236,0) 35%, rgba(244,242,236,0.55) 100%)" }}
        />
        <div className="relative z-[2] px-5 text-center font-heading text-[26px] font-bold uppercase leading-tight tracking-[-0.5px] text-ink">
          {project.title}
        </div>
      </>
    );
  }

  return (
    <>
      <Image src={project.image} alt={project.title} fill className="scale-[1.06] object-cover blur-[3px]" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(20,18,14,0.30) 0%, rgba(20,18,14,0.62) 100%)" }}
      />
      <div
        className="relative z-[2] px-5 text-center font-heading text-[26px] font-bold uppercase leading-tight tracking-[-0.5px] text-[#fbf7ef]"
        style={{ textShadow: "0 2px 14px rgba(0,0,0,0.5)" }}
      >
        {project.title}
      </div>
    </>
  );
}

export default function Projects() {
  return (
    <section id="work" className="mx-auto max-w-[1160px] px-14 pb-[168px] pt-32">
      <div className="mb-14 flex items-baseline justify-between">
        <div className="text-[11px] tracking-[3px] uppercase text-muted">[ projects ]</div>
        <div className="text-[11px] tracking-[2px] uppercase text-muted">Selected Work</div>
      </div>

      <div className="flex flex-col gap-5">
        {PROJECTS.map((project) => (
          <Link
            key={project.num}
            href={project.href}
            className="grid grid-cols-1 items-center gap-8 border border-border bg-card p-9 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-ink hover:bg-card-hover hover:shadow-[0_18px_40px_rgba(26,26,26,0.10)] md:grid-cols-2 md:gap-12"
          >
            <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-[3px] bg-[repeating-linear-gradient(135deg,#e8dfce_0_14px,#ded3be_14px_28px)]">
              <ProjectMedia project={project} />
            </div>

            <div className="flex flex-col gap-[18px]">
              <div className="flex flex-wrap items-center gap-4">
                <div className="font-heading text-[15px] italic text-muted">{project.num}</div>
                <div className="inline-flex items-center rounded bg-ink px-3 py-[6px] text-[10px] tracking-[1.6px] uppercase text-cream">
                  {project.badge}
                </div>
              </div>
              <h3 className="font-heading text-[34px] font-bold uppercase leading-[1.05] text-ink">{project.title}</h3>
              <p className="mt-[6px] text-[14px] leading-[1.75] text-body">{project.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
