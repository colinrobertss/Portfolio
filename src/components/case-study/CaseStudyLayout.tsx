import type { ReactNode } from "react";
import CaseStudyTopBar from "./CaseStudyTopBar";
import CaseStudyNav from "./CaseStudyNav";
import BackToTopButton from "./BackToTopButton";
import Footer from "@/components/Footer";
import { Eyebrow } from "./primitives";
import { LightboxProvider } from "./Lightbox";

export default function CaseStudyLayout({
  shortName,
  hero,
  disclosure,
  titleBadge,
  title,
  metaContent,
  actions,
  tagline,
  navItems,
  children,
}: {
  shortName: string;
  hero: ReactNode;
  disclosure?: ReactNode;
  titleBadge?: ReactNode;
  title: string;
  metaContent: ReactNode;
  actions?: ReactNode;
  tagline: string;
  navItems: { id: string; label: string }[];
  children: ReactNode;
}) {
  return (
    <LightboxProvider>
      <div className="min-h-screen bg-cream font-body text-body">
        <CaseStudyTopBar shortName={shortName} />

        {/* HERO */}
        <section className="mx-auto max-w-[1320px] px-14 pt-10">{hero}</section>

        {/* DISCLOSURE */}
        {disclosure && <section className="mx-auto max-w-[1320px] px-14 pt-7">{disclosure}</section>}

        {/* TITLE + METADATA + TAGLINE */}
        <section className="mx-auto grid max-w-[1320px] grid-cols-1 items-start gap-20 px-14 pb-24 pt-[72px] md:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col">
            {titleBadge}
            <h2 className="mb-4 font-heading text-[38px] font-bold uppercase leading-none tracking-[-0.5px] text-ink">
              {title}
            </h2>
            {metaContent}
            {actions && <div className="mt-10 flex gap-3.5">{actions}</div>}
          </div>

          <div className="pt-1.5">
            <Eyebrow className="mb-7">the project</Eyebrow>
            <p className="m-0 font-heading text-[46px] font-bold uppercase leading-[1.06] tracking-[-0.5px] text-ink">
              {tagline}
            </p>
          </div>
        </section>

        {/* BODY */}
        <div className="border-t border-border bg-cream-deep">
          <CaseStudyNav items={navItems} />
          {children}
        </div>

        <BackToTopButton />
        <Footer maxWidth="1320px" paddingY="48px" />
      </div>
    </LightboxProvider>
  );
}
