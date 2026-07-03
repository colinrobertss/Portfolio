import Link from "next/link";
import SmoothScrollLink from "@/components/SmoothScrollLink";

export default function Nav() {
  return (
    <div className="sticky top-0 z-50 border-b border-border bg-cream/88 backdrop-blur-sm backdrop-saturate-125">
      <div className="mx-auto flex max-w-[1160px] items-center justify-between px-14 py-[22px]">
        <SmoothScrollLink targetId="top" className="font-heading text-[19px] font-bold tracking-[0.5px] text-ink">
          UXByColin
        </SmoothScrollLink>
        <div className="flex items-center gap-10">
          <div className="flex gap-8 text-[13px] tracking-[0.3px] text-body">
            <SmoothScrollLink targetId="work" className="hover:text-ink">
              Work
            </SmoothScrollLink>
            <SmoothScrollLink targetId="about" className="hover:text-ink">
              About
            </SmoothScrollLink>
            <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              Resume
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
