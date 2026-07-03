import type { Metadata } from "next";
import Link from "next/link";
import CaseStudyLayout from "@/components/case-study/CaseStudyLayout";
import DemoVideo from "@/components/case-study/DemoVideo";
import {
  CaseStudySection,
  Eyebrow,
  SectionHeading,
  InfoCard,
  NumberedPoint,
  DefinitionRow,
  NoteBanner,
  BackToWorkCTA,
} from "@/components/case-study/primitives";

export const metadata: Metadata = {
  title: "WriteRight — Colin Roberts",
  description: "An AI-powered writing intervention concept for adults with dysgraphia — built to grow real skill, not just confidence.",
};

const NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "brief", label: "Problem" },
  { id: "challenge", label: "Design challenge" },
  { id: "research", label: "Research" },
  { id: "ideation", label: "Rationale & solution" },
  { id: "final", label: "Evaluation & prototype" },
  { id: "learnings", label: "Reflections" },
];

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-block rounded-[3px] border border-[#cdb497] px-[9px] py-1 text-[10px] tracking-[2px] uppercase text-accent-2">
      {children}
    </div>
  );
}

function MicroField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[10px] tracking-[2px] uppercase text-muted">{label}</div>
      <div className="text-[14px] leading-[1.5] text-ink">{children}</div>
    </div>
  );
}

const CV_DISCLOSURE = (
  <>
    WriteRight began as an academic proposal co-authored with{" "}
    <strong className="font-semibold text-ink">WenXi Wu (PhD student, Special Education)</strong>{" "}
    for a Spring 2026 course project. The evaluation plan below was{" "}
    <strong className="font-semibold text-ink">proposed but not conducted</strong>. The interactive build linked
    here is a solo portfolio prototype with{" "}
    <strong className="font-semibold text-ink">simulated handwriting analysis — not real computer vision</strong>.
  </>
);

export default function WriteRightCaseStudyPage() {
  return (
    <CaseStudyLayout
      shortName="WriteRight"
      navItems={NAV_ITEMS}
      title="WriteRight"
      tagline="An AI-powered writing intervention concept for adults with dysgraphia — built to grow real skill, not just confidence."
      titleBadge={
        <div className="mb-[18px] inline-flex w-fit items-center gap-2 rounded border border-accent-2 px-3.5 py-[7px] text-[10px] tracking-[1.8px] uppercase text-accent-2">
          Academic Proposal · Concept Prototype
        </div>
      }
      disclosure={<NoteBanner label="Note">{CV_DISCLOSURE}</NoteBanner>}
      metaContent={
        <div className="flex flex-col">
          <div className="border-b border-chip-border pb-[18px]">
            <div className="mb-[9px] text-[10px] tracking-[2px] uppercase text-muted">Project Type</div>
            <div className="text-[15px] text-ink">Academic Proposal · Concept Prototype</div>
          </div>

          <div className="border-b border-chip-border py-[22px]">
            <GroupLabel>Academic Proposal</GroupLabel>
            <div className="flex flex-col gap-3.5">
              <MicroField label="Role">Co-PI — Intervention Design &amp; Data Analysis</MicroField>
              <MicroField label="Collaborator">
                WenXi Wu (Lead PI) — PhD student, UMD College of Education, Special Education
              </MicroField>
              <MicroField label="Timeline">Spring 2026 · academic final project</MicroField>
            </div>
          </div>

          <div className="border-b border-chip-border py-[22px]">
            <GroupLabel>Portfolio Build</GroupLabel>
            <div className="flex flex-col gap-3.5">
              <MicroField label="Scope">Built solo as a conceptual interactive prototype</MicroField>
              <MicroField label="Status">Simulated analysis — not validated</MicroField>
            </div>
          </div>

          <div className="border-b border-chip-border py-[22px]">
            <div className="mb-[9px] text-[10px] tracking-[2px] uppercase text-muted">Skills</div>
            <div className="text-[14px] leading-[1.6] text-ink">
              Intervention Design, UX Research, Evaluation Planning, Theory-Grounded Design Rationale, Prototyping
            </div>
          </div>
        </div>
      }
      actions={
        <Link
          href="https://github.com/colinrobertss/WriteRight"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-3xl border border-ink bg-ink px-[26px] py-[13px] text-[11px] tracking-[1.5px] uppercase text-cream no-underline hover:opacity-85"
        >
          View Prototype <span className="text-[13px]">&rarr;</span>
        </Link>
      }
      hero={
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded border border-border bg-[#F4F2EC]">
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 block h-full w-full">
            <defs>
              <linearGradient id="wrStrokeGrad" x1="80" y1="0" x2="1520" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#374151" />
                <stop offset="55%" stopColor="#7A6FE0" />
                <stop offset="100%" stopColor="#6C63FF" />
              </linearGradient>
              <linearGradient id="wrBeamGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6C63FF" stopOpacity="0" />
                <stop offset="50%" stopColor="#6C63FF" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#6C63FF" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="wrGlow" cx="58%" cy="55%" r="45%">
                <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#6C63FF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="1600" height="900" fill="#F4F2EC" />
            <rect width="1600" height="900" fill="url(#wrGlow)" />
            <rect x="850" y="0" width="170" height="900" fill="url(#wrBeamGrad)" />
            <line x1="925" y1="0" x2="925" y2="900" stroke="#6C63FF" strokeWidth="1.5" opacity="0.35" />
            <path
              d="M80,560 C140,460 200,660 260,540 C320,420 380,640 440,520 C500,400 560,620 620,500 C680,420 730,560 780,480 C830,440 860,500 900,470 L1520,430"
              fill="none"
              stroke="url(#wrStrokeGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <g fill="#374151">
              <circle cx="260" cy="540" r="6" />
              <circle cx="440" cy="520" r="6" />
              <circle cx="620" cy="500" r="6" />
              <circle cx="780" cy="480" r="6" />
            </g>
            <g fill="none" stroke="#6C63FF" strokeWidth="1.5" opacity="0.55">
              <circle cx="260" cy="540" r="12" />
              <circle cx="440" cy="520" r="12" />
              <circle cx="620" cy="500" r="12" />
              <circle cx="780" cy="480" r="12" />
            </g>
            <rect x="80" y="118" width="64" height="4" fill="#6C63FF" />
            <text x="80" y="105" fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize="52" letterSpacing="6" fill="#111827">
              WRITERIGHT
            </text>
            <text x="80" y="150" fontFamily="'General Sans', sans-serif" fontSize="19" fill="#6B7280" letterSpacing="0.5">
              Handwriting Analysis &amp; Early Intervention
            </text>
            <rect x="1218" y="64" width="318" height="40" rx="20" fill="none" stroke="#6C63FF" strokeWidth="1.5" strokeDasharray="4 4" />
            <text
              x="1377"
              y="89"
              fontFamily="'General Sans', sans-serif"
              fontSize="12.5"
              fontWeight="600"
              letterSpacing="1.5"
              fill="#6C63FF"
              textAnchor="middle"
            >
              ACADEMIC PROPOSAL · CONCEPT PROTOTYPE
            </text>
          </svg>
          <div className="absolute bottom-4 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-2 text-[10px] tracking-[2.5px] uppercase text-[#6C63FF]">
            Scroll <span className="text-[13px]">&darr;</span>
          </div>
        </div>
      }
    >
      {/* OVERVIEW */}
      <CaseStudySection id="overview">
        <p className="m-0 mb-12 text-[21px] leading-[1.6] text-ink">
          WriteRight is a cross-disciplinary final project pairing HCI design with special education research — an
          AI-powered writing intervention concept for adults with dysgraphia. The core question driving it: how do
          you build a tool that grows real handwriting skill over time, without inflating confidence the skill
          hasn&rsquo;t earned?
        </p>
        <div className="mb-5 text-[13px] tracking-[1px] uppercase text-[#6f6657]">Team &amp; roles</div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <InfoCard label="WenXi Wu — Lead PI">
            PhD student in Special Education whose prior work studies video modeling and AI-generated video for
            autistic learners. Brought a qualitative and mixed-methods research design background and led overall
            direction and oversight.
          </InfoCard>
          <InfoCard label="Colin Roberts — Co-PI">
            Contributed intervention design and data analysis — informed by prior work managing PHNX, an mHealth
            intervention app for minority youth, built with UMD&rsquo;s CREATE Lab.
          </InfoCard>
        </div>
      </CaseStudySection>

      {/* PROBLEM */}
      <CaseStudySection id="brief">
        <Eyebrow>problem</Eyebrow>
        <SectionHeading>Dysgraphia tools treat handwriting as something to grade, not something to coach</SectionHeading>
        <p className="m-0 mb-6 text-[16px] leading-[1.8] text-body-strong">
          Adults with dysgraphia face a persistent skill-development gap: most handwriting support is either clinical
          — occupational therapy, often infrequent and appointment-bound — or absent entirely once school-age
          accommodations end. Existing digital tools tend to evaluate handwriting rather than build it, giving users
          a score with no clear path to improvement, and no way to track whether confidence and actual skill are
          moving together.
        </p>
        <div className="border-l-[3px] border-accent-2 bg-card px-7 py-6">
          <div className="mb-2 text-[10px] tracking-[2px] uppercase text-muted">The stakes</div>
          <p className="m-0 text-[16px] leading-[1.7] text-body-strong">
            Tools that boost a user&rsquo;s confidence without producing real skill gains can do active harm —
            making someone feel improved while their underlying handwriting ability stays flat.
          </p>
        </div>
      </CaseStudySection>

      {/* DESIGN CHALLENGE */}
      <CaseStudySection id="challenge">
        <Eyebrow className="mb-7">design challenge</Eyebrow>
        <p className="m-0 font-heading text-[44px] font-semibold uppercase leading-[1.08] tracking-[-0.5px] text-ink">
          How might we help adults with dysgraphia build <span className="text-accent-2">real handwriting skill</span>{" "}
          over time, without inflating confidence the skill hasn&rsquo;t earned?
        </p>
      </CaseStudySection>

      {/* RESEARCH */}
      <CaseStudySection id="research">
        <Eyebrow>research</Eyebrow>
        <SectionHeading>Grounding decisions in theory, not assumption</SectionHeading>
        <p className="m-0 mb-10 text-[16px] leading-[1.8] text-body-strong">
          Every design decision was required to connect to peer-reviewed research rather than intuition. Three
          readings shaped the core design logic — each surfacing a specific risk the design then had to answer for.
        </p>

        <div className="mb-5 text-[13px] tracking-[1px] uppercase text-[#6f6657]">The readings</div>
        <div className="flex flex-col">
          <DefinitionRow term="Reich & Teeny (2025)" termWidth="170px">
            Confidence gains from AI interaction can be domain-dependent and, critically, unwarranted — a user can
            feel more capable without being more capable. This became the central risk WriteRight was designed to
            avoid.
          </DefinitionRow>
          <DefinitionRow term="Doshi & Hauser (2024)" termWidth="170px">
            Informed how AI-assisted creative and skill tools should be framed to avoid undermining user agency.
          </DefinitionRow>
          <DefinitionRow term="Ding et al. (2025)" termWidth="170px">
            Structured AI representations function as guardrails that focus users without removing their autonomy —
            directly shaping the decision to present feedback within defined categories rather than as open-ended AI
            output.
          </DefinitionRow>
        </div>
      </CaseStudySection>

      {/* SOLUTION IDEATION */}
      <CaseStudySection id="ideation">
        <Eyebrow>rationale &amp; solution</Eyebrow>
        <SectionHeading>Three principles, each answering a specific risk</SectionHeading>
        <p className="m-0 mb-10 text-[16px] leading-[1.8] text-body-strong">
          Each interaction principle maps directly back to a finding from the research — the design is the argument
          for how to avoid the false-confidence trap.
        </p>

        <div className="mb-12 flex flex-col gap-[18px]">
          <div className="border border-border bg-card p-[26px_28px]">
            <div className="mb-2 font-heading text-[19px] font-semibold uppercase text-ink">Structured openness</div>
            <p className="m-0 text-[15px] leading-[1.7] text-body">
              Feedback and exercises are presented within defined categories and stages rather than freeform AI
              output, so users always know what they&rsquo;re working on and why — responding to Ding et
              al.&rsquo;s guardrails finding and the documented cognitive-overload barrier for adults with
              dysgraphia.
            </p>
          </div>
          <div className="border border-border bg-card p-[26px_28px]">
            <div className="mb-2 font-heading text-[19px] font-semibold uppercase text-ink">Coach framing</div>
            <p className="m-0 text-[15px] leading-[1.7] text-body">
              The AI persona is a writing coach, not a grader. Feedback is always framed as what to do next, never as
              what went wrong — a direct response to Reich &amp; Teeny&rsquo;s finding that AI can act as a
              high-credibility social referent in rule-governed skill domains.
            </p>
          </div>
          <div className="border border-border bg-card p-[26px_28px]">
            <div className="mb-2 font-heading text-[19px] font-semibold uppercase text-ink">Objective anchoring</div>
            <p className="m-0 text-[15px] leading-[1.7] text-body">
              Every piece of encouraging feedback is paired with the underlying objective metric that supports it —
              preventing the false-reassurance risk Reich &amp; Teeny identified while still preserving motivational
              framing.
            </p>
          </div>
        </div>

        <div className="mb-[18px] text-[13px] tracking-[1px] uppercase text-[#6f6657]">Proposed core features</div>
        <div className="flex flex-col">
          <DefinitionRow term="AI photo scan analysis" termWidth="230px">
            Users photograph a handwriting sample; the system analyzes letter formation, spacing, line alignment, and
            legibility, with color-coded (red/amber/green) feedback and plain-language explanations.
          </DefinitionRow>
          <DefinitionRow term="Personalized action plans" termWidth="230px">
            Six-week adaptive plans that shift emphasis based on a user&rsquo;s evolving strengths and weaknesses
            across scans.
          </DefinitionRow>
          <DefinitionRow term="Daily exercises" termWidth="230px">
            Short, targeted practice sessions (10–15 minutes) designed for sustainable daily engagement.
          </DefinitionRow>
          <DefinitionRow term="Progress & specialist sharing" termWidth="230px">
            A longitudinal dashboard, with the option to share data directly with an occupational therapist or
            writing specialist — positioning the app as a supplement to clinical care, not a replacement.
          </DefinitionRow>
        </div>
      </CaseStudySection>

      {/* EVALUATION & PROTOTYPE */}
      <CaseStudySection id="final">
        <Eyebrow>evaluation &amp; prototype</Eyebrow>
        <h3 className="mb-6 font-heading text-[40px] font-bold uppercase leading-[1.04] tracking-[-0.5px] text-ink">
          Four methods, each testing a distinct claim the app makes
        </h3>
        <div className="mb-10">
          <NoteBanner label="Proposed">
            This evaluation plan was proposed as part of the academic project and{" "}
            <strong className="font-semibold text-ink">was not conducted</strong>{" "}
            — no usability sessions, skill assessments, or specialist interviews were run.
          </NoteBanner>
        </div>
        <div className="mb-14 flex flex-col">
          <NumberedPoint n="01">
            <strong className="font-semibold text-ink">Think-aloud usability study</strong>{" "}
            (6–8 adults with dysgraphia) — would test whether the interaction design functions across core tasks:
            scan upload, reading feedback, navigating the action plan.
          </NumberedPoint>
          <NumberedPoint n="02">
            <strong className="font-semibold text-ink">Pre/post skill assessment</strong>{" "}
            — standardized writing samples at baseline and after six weeks, scored blind by trained raters using the
            DASH instrument, to measure objective skill change rather than self-report.
          </NumberedPoint>
          <NumberedPoint n="03">
            <strong className="font-semibold text-ink">Self-efficacy measurement</strong>{" "}
            at baseline, midpoint, and post — would track whether confidence and objective skill move together,
            directly testing the coach-framing and objective-anchoring decisions.
          </NumberedPoint>
          <NumberedPoint n="04">
            <strong className="font-semibold text-ink">Structured specialist interviews</strong>{" "}
            — would validate the clinical soundness of the skill categories, exercise progressions, and
            specialist-sharing feature with occupational therapists and writing specialists.
          </NumberedPoint>
        </div>

        <Eyebrow className="mb-4">portfolio prototype</Eyebrow>
        <h3 className="mb-6 font-heading text-[30px] font-bold uppercase leading-[1.1] tracking-[-0.5px] text-ink">
          From academic proposal to a conceptual interactive build
        </h3>
        <p className="m-0 mb-8 text-[16px] leading-[1.8] text-body-strong">
          To make the design rationale tangible beyond the written proposal, I independently rebuilt WriteRight as a
          standalone web prototype — a four-tab Next.js application (Scan, Progress, Tips, Profile) carrying the same
          three interaction principles into a working UI.
        </p>
        <div className="mb-9">
          <NoteBanner label="Note">
            A conceptual portfolio piece, built solo and separately from the class project. The handwriting analysis
            is <strong className="font-semibold text-ink">simulated for demonstration — it is not real computer vision</strong>,
            and the proposal&rsquo;s AI Photo Scan Analysis has not been built with real CV.
          </NoteBanner>
        </div>
        <div className="flex justify-center">
          <DemoVideo
            src="/videos/WriteRight_SR.mp4"
            poster="/videos/WriteRight_SR_poster.png"
            aspectRatio="396 / 814"
            caption="Click to expand · prototype walkthrough (simulated analysis)"
            lightboxCaption="WriteRight prototype — walkthrough (simulated analysis)"
          />
        </div>
      </CaseStudySection>

      {/* LEARNINGS */}
      <CaseStudySection id="learnings" fullHeight>
        <Eyebrow>reflections</Eyebrow>
        <SectionHeading className="mb-9">What I&rsquo;d carry forward</SectionHeading>
        <div className="flex flex-col">
          <NumberedPoint n="01" wide>
            <strong className="font-semibold text-ink">Theory-grounded design holds up under scrutiny.</strong>{" "}
            Tying every interaction decision to a specific research finding made the rationale defensible when
            questioned — a habit worth carrying into professional UX work.
          </NumberedPoint>
          <NumberedPoint n="02" wide>
            <strong className="font-semibold text-ink">Cross-disciplinary partnership sharpens scope.</strong>{" "}
            Working alongside a special education researcher meant balancing HCI interaction-design instincts against
            rigorous qualitative and mixed-methods research standards.
          </NumberedPoint>
          <NumberedPoint n="03" wide>
            <strong className="font-semibold text-ink">A working prototype is not the same as a validated one.</strong>{" "}
            Building the portfolio MVP made the concept tangible, but the case study has to be honest that
            &ldquo;AI-powered&rdquo; describes the proposed design, not a built or tested system.
          </NumberedPoint>
        </div>
        <BackToWorkCTA />
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
