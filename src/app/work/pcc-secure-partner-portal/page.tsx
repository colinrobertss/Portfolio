import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CaseStudyLayout from "@/components/case-study/CaseStudyLayout";
import {
  CaseStudySection,
  Eyebrow,
  SectionHeading,
  MetaField,
  PlainField,
  InfoCard,
  StatCard,
  NumberedPoint,
  DefinitionRow,
  FigureBlock,
  BackToWorkCTA,
} from "@/components/case-study/primitives";

export const metadata: Metadata = {
  title: "PCC Secure Partner Portal — Colin Roberts",
  description: "Replacing an ad hoc, email-driven workflow with a centralized, permission-aware system for a healthcare nonprofit.",
};

const NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
  { id: "synthesis", label: "Synthesis" },
  { id: "ideation", label: "Ideation" },
  { id: "wireframes", label: "Wireframes" },
  { id: "final", label: "Final design" },
  { id: "workflow", label: "Solution workflow" },
  { id: "outcomes", label: "Outcomes" },
  { id: "learnings", label: "Learnings" },
];

const META = [
  { label: "Role", value: "Project Manager & UX Researcher" },
  { label: "Team", value: "5-person capstone (UMD iConsultancy)" },
  { label: "Client", value: "Montgomery County healthcare nonprofit" },
  { label: "Timeline", value: "Sept 2025 – May 2026 · 5 sprints" },
];

const PAIN_POINTS = [
  { term: "Security & compliance gaps", body: "PII/PHI shared through informal channels with no role-based access controls, exposing PCC to real HIPAA risk." },
  { term: "No centralized hub", body: "No single, persistent entry point partners could rely on to find what they needed." },
  { term: "Permission complexity", body: "Sharing meant manually managing email-based access with no structural enforcement." },
  { term: "Version control issues", body: "Updating a document meant re-sharing it entirely, risking overwritten or outdated source files." },
  { term: "Repetitive admin burden", body: "Staff re-sent the same flyers and reports repeatedly because there was no shareable, persistent link." },
];

export default function PccCaseStudyPage() {
  return (
    <CaseStudyLayout
      shortName="PCC Portal"
      navItems={NAV_ITEMS}
      title="PCC Secure Partner Portal"
      tagline="Replacing an ad hoc, email-driven workflow with a centralized, permission-aware system for a healthcare nonprofit."
      metaContent={
        <div className="flex flex-col">
          {META.map((m) => (
            <MetaField key={m.label} label={m.label} value={m.value} />
          ))}
        </div>
      }
      actions={
        <Link
          href="/case-studies/PCC_Secure_Partner_Portal_OnePager.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-3xl border border-ink px-6 py-[13px] text-[11px] tracking-[1.5px] uppercase text-ink no-underline hover:bg-cream-deep"
        >
          Case Study PDF
        </Link>
      }
      hero={
        <div className="relative flex aspect-[16/8] w-full flex-col items-center justify-center gap-[26px] overflow-hidden rounded border border-[#c7dcee] bg-[radial-gradient(circle_at_50%_40%,#eef5fb_0%,#d4e6f3_100%)]">
          <Image
            src="/uploads/PCC_SoloLogo.jpeg"
            alt="PCC logo"
            width={300}
            height={230}
            className="h-[42%] max-h-[230px] w-auto object-contain mix-blend-multiply"
          />
          <div className="relative z-[2] px-10 text-center">
            <div className="mb-4 text-[11px] tracking-[3px] uppercase text-[#5b8bb5]">Case Study &middot; 2026</div>
            <h1 className="m-0 max-w-[16ch] font-heading text-[56px] font-bold uppercase leading-[0.98] tracking-[-1px] text-pcc-blue">
              PCC Secure Partner Portal
            </h1>
          </div>
          <div className="absolute bottom-4 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-2 text-[10px] tracking-[2.5px] uppercase text-[#5b8bb5]">
            Scroll <span className="text-[13px]">&darr;</span>
          </div>
        </div>
      }
    >
      {/* OVERVIEW */}
      <CaseStudySection id="overview">
        <p className="m-0 mb-12 text-[21px] leading-[1.6] text-ink">
          The Primary Care Coalition, a Montgomery County healthcare nonprofit, was sharing partner-facing files —
          many containing PII and PHI — almost entirely over email. We replaced that ad hoc workflow with a
          centralized, permission-aware system: a redesigned public site linked directly to their existing SharePoint
          structure, delivered live at handoff rather than as a spec.
        </p>
        <div className="grid grid-cols-1 gap-9 gap-x-12 md:grid-cols-2">
          <PlainField label="Role">Project Manager &amp; UX Researcher</PlainField>
          <PlainField label="Methods">Stakeholder interviews, Affinity mapping, IA, Usability testing</PlainField>
          <PlainField label="Timeline">Sept 2025 – May 2026 · 5 sprints · handoff May 9, 2026</PlainField>
          <PlainField label="Team">5-person capstone team, UMD iConsultancy</PlainField>
        </div>
      </CaseStudySection>

      {/* PROBLEM */}
      <CaseStudySection id="problem">
        <Eyebrow>problem</Eyebrow>
        <SectionHeading>Partner data was moving through email — a compliance risk, not just an inconvenience</SectionHeading>
        <p className="m-0 mb-6 text-[16px] leading-[1.8] text-body-strong">
          PCC coordinates closely with external partners across its program areas, sharing reports, flyers, and
          program documents that frequently contain Personally Identifiable Information (PII) and Protected Health
          Information (PHI). That sharing happened almost entirely through informal, ad hoc channels — primarily
          email — with no centralized location, no role-based access control, and no consistent governance over who
          could see what.
        </p>
        <p className="m-0 mb-10 text-[16px] leading-[1.8] text-body">
          For a healthcare organization, this isn&rsquo;t just inefficient — it&rsquo;s the highest-consequence
          failure mode. A single PHI exposure can trigger HIPAA penalties starting at $100 per record. PCC needed a
          system, not a workaround.
        </p>
        <div className="mb-[18px] text-[13px] tracking-[1px] uppercase text-[#6f6657]">Key pain points, by consequence</div>
        <div className="flex flex-col">
          {PAIN_POINTS.map((p) => (
            <DefinitionRow key={p.term} term={p.term}>
              {p.body}
            </DefinitionRow>
          ))}
        </div>
      </CaseStudySection>

      {/* RESEARCH */}
      <CaseStudySection id="research">
        <Eyebrow>research</Eyebrow>
        <SectionHeading>The problems weren&rsquo;t random — they were systemic</SectionHeading>
        <p className="m-0 mb-11 text-[16px] leading-[1.8] text-body-strong">
          I led in-depth interviews with PCC staff across all major program areas — Administrative &amp; Senior
          Leadership, Population Health, and Healthcare Access — asking each participant to walk through how they
          currently share information with external partners. To pressure-test the findings, I built two journey
          maps from two very different roles. They reach the <em>same</em>{" "}
          systemic gap — SharePoint can&rsquo;t share cleanly with external partners — from opposite ends of the
          workflow.
        </p>

        <div className="mb-6 grid grid-cols-1 items-start gap-8 md:grid-cols-[0.9fr_1.6fr]">
          <div className="pt-1.5">
            <div className="mb-3.5 font-heading text-[15px] italic text-accent-2">Persona 01</div>
            <h4 className="mb-3.5 font-heading text-[26px] font-bold uppercase leading-[1.05] tracking-[-0.3px] text-ink">
              The general staff member
            </h4>
            <p className="m-0 mb-4 text-[15px] leading-[1.7] text-body-strong">
              A PCC employee who creates and shares files day to day. Internal collaboration feels seamless — but the
              moment a document needs to reach an external partner, the workflow breaks down into manual email,
              re-shared links, and back-and-forth versioning.
            </p>
            <div className="text-[11px] tracking-[1px] uppercase text-[#6f6657]">Friction peaks at: sharing &amp; updating files</div>
          </div>
          <FigureBlock
            src="/uploads/UserJourneyMap1.jpg"
            alt="Journey map for a general PCC staff member sharing files with external partners"
            caption="Journey map 01 — login → file creation → sharing → updating. Pain points cluster around external sharing and version control."
          />
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-8 md:grid-cols-[0.9fr_1.6fr]">
          <div className="pt-1.5">
            <div className="mb-3.5 font-heading text-[15px] italic text-accent-2">Persona 02</div>
            <h4 className="mb-3.5 font-heading text-[26px] font-bold uppercase leading-[1.05] tracking-[-0.3px] text-ink">
              The Operations Manager
            </h4>
            <p className="m-0 mb-4 text-[15px] leading-[1.7] text-body-strong">
              A critical reviewer who must trust the accuracy of partner data and deliver it on a strict schedule.
              She arrives at the same gap from a data-integrity angle — duplicate copies, lost email threads, and
              access codes that make every exchange slow and risky.
            </p>
            <div className="text-[11px] tracking-[1px] uppercase text-[#6f6657]">Friction peaks at: confirming &amp; saving data</div>
          </div>
          <FigureBlock
            src="/uploads/UserJourneyMap2.jpg"
            alt="Journey map for the PCC Operations Manager reviewing and sharing partner data"
            caption="Journey map 02 — extract → confirm → copy → email → save. The same external-sharing gap, seen from a data-accuracy standpoint."
          />
        </div>
      </CaseStudySection>

      {/* SYNTHESIS */}
      <CaseStudySection id="synthesis">
        <Eyebrow>synthesis</Eyebrow>
        <SectionHeading>Turning raw research into a direction</SectionHeading>
        <p className="m-0 mb-10 text-[16px] leading-[1.8] text-body-strong">
          I led an affinity-mapping session to bridge what we heard and what we&rsquo;d build. Findings were
          organized along two axes: the <strong className="font-semibold text-ink">Current State</strong>{" "}
          of PCC&rsquo;s collaboration environment — SharePoint tech struggles, training gaps, and partner
          painpoints — and the <strong className="font-semibold text-ink">Future State</strong>{" "}
          staff and partners wanted: desired features, cleaner external-partner access, and granular access
          controls. Those Future-State clusters became the requirements that drove every design decision that
          followed.
        </p>

        <div className="mb-9">
          <FigureBlock
            src="/uploads/AffinityDiagram.jpg"
            alt="Affinity diagram organizing research findings into current and future state"
            caption="Affinity diagram — Current-State painpoints (right) mapped against the Future State and desired features (left). The bridge between raw research and design direction."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <InfoCard label="Current state">
            SharePoint tech struggles, training &amp; tech-support gaps, and partner painpoints around accessing and
            collaborating on files.
          </InfoCard>
          <InfoCard label="Future state">
            A centralized hub, cleaner external-partner collaboration, and granular access controls for external
            partners.
          </InfoCard>
        </div>
      </CaseStudySection>

      {/* IDEATION */}
      <CaseStudySection id="ideation">
        <Eyebrow>ideation</Eyebrow>
        <SectionHeading>A first design hypothesis</SectionHeading>
        <p className="m-0 mb-6 text-[16px] leading-[1.8] text-body-strong">
          Weighing options against PCC&rsquo;s real constraints — existing Microsoft licensing, HIPAA compliance,
          budget limits, and no dedicated internal IT team — we landed on a hybrid direction: keep SharePoint as the
          backbone and add a redesigned public-facing entry point on top of it. The first concept tested that idea by
          reframing the Client Portal as a clear, program-based landing page.
        </p>
        <p className="m-0 mb-10 text-[16px] leading-[1.8] text-body">
          The hypothesis: if partners enter through one public page organized by program area — Administrative,
          Population Health, Healthcare Access, Public Links — they can self-serve to the right documents without
          staff manually re-sharing over email, while sensitive content stays gated behind SharePoint&rsquo;s
          permissions.
        </p>
        <FigureBlock
          src="/uploads/InitialDesignConcept.jpg"
          alt="Initial design concept of the redesigned Client Portal landing page"
          caption="Initial design concept — the Client Portal reframed as a single public entry point, organized into four program-area gateways."
        />
      </CaseStudySection>

      {/* WIREFRAMES */}
      <CaseStudySection id="wireframes">
        <Eyebrow>wireframes</Eyebrow>
        <SectionHeading>Giving the structure real bones</SectionHeading>
        <p className="m-0 mb-6 text-[16px] leading-[1.8] text-body-strong">
          The mid-fidelity set translated the concept into a working information architecture. I laid out a
          persistent top navigation across the four program areas, a Public / Private split that mirrors
          SharePoint&rsquo;s permission tiers, and a recurring &ldquo;Announcement / Action items&rdquo; rail so
          partners always know what changed.
        </p>
        <p className="m-0 mb-10 text-[16px] leading-[1.8] text-body">
          This is the structural iteration step — resolving how content nests (program &rarr; subprogram &rarr;
          document library), where the Public/Private boundary sits, and what a partner sees before versus after
          authentication, ahead of any visual polish.
        </p>
        <FigureBlock
          src="/uploads/MidFidelity.jpg"
          alt="Mid-fidelity wireframe set, four screens showing navigation and Public/Private structure"
          caption="Mid-fidelity wireframes — four screens establishing navigation, the Public/Private permission split, and the announcement rail."
        />
      </CaseStudySection>

      {/* FINAL DESIGN */}
      <CaseStudySection id="final">
        <Eyebrow>final design</Eyebrow>
        <SectionHeading>The most resolved deliverable</SectionHeading>
        <p className="m-0 mb-6 text-[16px] leading-[1.8] text-body-strong">
          The high-fidelity design carries the wireframe structure into a working partner directory. Each program
          area opens into a clean, scannable table — partner, program, subprogram — where every partner name is a
          persistent link into the right SharePoint document library. No manual re-sharing, no chasing access codes.
        </p>
        <p className="m-0 mb-10 text-[16px] leading-[1.8] text-body">
          This is the most resolved artifact produced for the engagement: a tested, presentable representation of how
          the redesigned portal behaves once a partner is authenticated and routed to their materials.
        </p>
        <FigureBlock
          src="/uploads/HighFidelity.jpg"
          alt="High-fidelity partner directory connected to SharePoint document libraries"
          caption="High-fidelity design — the partner directory, where each partner row links straight into its SharePoint document library."
        />
      </CaseStudySection>

      {/* SOLUTION WORKFLOW */}
      <CaseStudySection id="workflow">
        <Eyebrow>solution workflow</Eyebrow>
        <SectionHeading>From email chaos to a gated, single entry point</SectionHeading>
        <p className="m-0 mb-10 text-[16px] leading-[1.8] text-body-strong">
          The design&rsquo;s real payoff is the workflow it replaces. The before state was a manual loop with no
          structure; the after routes every partner through one public landing page, hyperlinks into the right
          program, and an authentication gate that protects sensitive libraries.
        </p>

        <div className="mb-[18px] text-[13px] tracking-[1px] uppercase text-[#6f6657]">Before — the current workflow</div>
        <div className="mb-3.5 rounded border border-chip-border bg-card px-[30px] py-[26px]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
            <span className="rounded-[3px] border border-chip-border bg-cream-deep px-4 py-[9px] text-[13px] text-body">Staff create file</span>
            <span className="text-[16px] text-[#b09a73]">&rarr;</span>
            <span className="rounded-[3px] border border-chip-border bg-cream-deep px-4 py-[9px] text-[13px] text-body">Manually email partner</span>
            <span className="text-[16px] text-[#b09a73]">&rarr;</span>
            <span className="rounded-[3px] border border-chip-border bg-cream-deep px-4 py-[9px] text-[13px] text-body">Partner loses access</span>
            <span className="text-[16px] text-[#b09a73]">&rarr;</span>
            <span className="rounded-[3px] border border-chip-border bg-cream-deep px-4 py-[9px] text-[13px] text-body">Re-share link</span>
            <span className="text-[16px] text-[#b09a73]">&rarr;</span>
            <span className="rounded-[3px] border border-chip-border bg-cream-deep px-4 py-[9px] text-[13px] text-body">Edit &amp; re-upload</span>
            <span className="text-[16px] text-[#b76b4d]">&#8634;</span>
            <span className="rounded-[3px] border border-[#e0b9a6] bg-[#f0dcd2] px-4 py-[9px] text-[13px] font-medium text-[#8a4a30]">
              Repeat — no structure, no version control, PII over email
            </span>
          </div>
        </div>

        <div className="mb-[18px] mt-[34px] text-[13px] tracking-[1px] uppercase text-[#6f6657]">After — the redesigned linkage</div>
        <div className="mb-10">
          <FigureBlock
            src="/uploads/PCC_WorkflowLinkage.jpg"
            alt="Redesigned workflow: public landing page routing into authenticated SharePoint document libraries"
            caption="Redesigned workflow — one public entry point routes partners through program hyperlinks into authenticated SharePoint document libraries; unauthorized users are denied."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <InfoCard label="Centralized & persistent">
            All program resources live in one structured location reached through persistent links — share once, and
            partners always get the latest version.
          </InfoCard>
          <InfoCard label="Gated & low-burden">
            An authentication gate enforces internal-vs-external access per program, so a single entry point
            doesn&rsquo;t mean exposed PII — with no manual re-sharing.
          </InfoCard>
        </div>
      </CaseStudySection>

      {/* OUTCOMES */}
      <CaseStudySection id="outcomes">
        <Eyebrow>outcomes</Eyebrow>
        <SectionHeading className="mb-7">From ad hoc to accountable</SectionHeading>

        <div className="mb-10 rounded-[3px] border border-chip-border border-l-[3px] border-l-accent-2 bg-[#f0ece1] px-6 py-5">
          <p className="m-0 text-[14px] leading-[1.7] text-body">
            <strong className="font-semibold text-ink">A note on these numbers.</strong>{" "}
            The redesign has not yet gone live. The figures below are{" "}
            <strong className="font-semibold text-ink">projected and estimated</strong>{" "}
            from usability testing and stakeholder review — they are not measured post-launch metrics. PCC owns
            implementation going forward.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-7 md:grid-cols-2">
          <StatCard value="~1 hr">
            <em>Projected</em>{" "}weekly time saved per staffer locating and re-sharing partner resources.
          </StatCard>
          <StatCard value="+10%">
            <em>Estimated</em>{" "}lift in task-completion against the tested build versus the current email workflow.
          </StatCard>
        </div>

        <div className="mb-[18px] text-[13px] tracking-[1px] uppercase text-[#6f6657]">What testing &amp; review pointed to</div>
        <div className="flex flex-col">
          <NumberedPoint n="01">
            <strong className="font-semibold text-ink">A defensible compliance posture.</strong>{" "}
            Stakeholders affirmed that routing PII/PHI through gated SharePoint libraries — instead of email —
            closes the highest-consequence risk identified in research.
          </NumberedPoint>
          <NumberedPoint n="02">
            <strong className="font-semibold text-ink">Lower projected admin burden.</strong>{" "}
            Persistent links remove the manual re-sharing loop — the most-cited painpoint across both personas — in
            the tested workflow.
          </NumberedPoint>
          <NumberedPoint n="03">
            <strong className="font-semibold text-ink">A maintainable handoff.</strong>{" "}
            Because the solution sits on PCC&rsquo;s existing SharePoint and a designated internal owner, the
            organization can sustain it without new infrastructure, budget, or headcount.
          </NumberedPoint>
        </div>
      </CaseStudySection>

      {/* LEARNINGS */}
      <CaseStudySection id="learnings" fullHeight>
        <Eyebrow>learnings</Eyebrow>
        <SectionHeading className="mb-6">What I&rsquo;d carry forward</SectionHeading>
        <p className="m-0 mb-10 text-[16px] leading-[1.8] text-body">
          As Project Manager and UX Researcher, I owned sprint scheduling, client coordination, and the team&rsquo;s
          Trello board, while leading interview recruitment and facilitation, affinity mapping, and usability testing
          coordination.
        </p>
        <div className="flex flex-col">
          <NumberedPoint n="01" wide>
            <strong className="font-semibold text-ink">
              Constraints aren&rsquo;t obstacles, they&rsquo;re the design brief.
            </strong>{" "}
            The strongest solution wasn&rsquo;t the most ambitious platform — it was the one PCC could actually
            maintain without new infrastructure or headcount.
          </NumberedPoint>
          <NumberedPoint n="02" wide>
            <strong className="font-semibold text-ink">Research only matters if it survives translation.</strong>{" "}
            Moving from interview themes to a defensible IA required constantly checking design decisions back
            against Eileen&rsquo;s and Maria&rsquo;s actual workflows.
          </NumberedPoint>
          <NumberedPoint n="03" wide>
            <strong className="font-semibold text-ink">
              The riskiest part of an integration is the seam, not the parts.
            </strong>{" "}
            Testing the public site and SharePoint in isolation wouldn&rsquo;t have caught what testing the
            connection between them did.
          </NumberedPoint>
        </div>
        <BackToWorkCTA />
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
