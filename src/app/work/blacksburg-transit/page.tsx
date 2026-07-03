import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CaseStudyLayout from "@/components/case-study/CaseStudyLayout";
import { LightboxTrigger } from "@/components/case-study/Lightbox";
import DemoVideo from "@/components/case-study/DemoVideo";
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
  BackToWorkCTA,
} from "@/components/case-study/primitives";

export const metadata: Metadata = {
  title: "Blacksburg Transit — Colin Roberts",
  description: "Rebuilding trust in transit for 400,000 monthly riders, from planning a trip to trusting the bus actually arrives.",
};

const NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "brief", label: "Problem" },
  { id: "challenge", label: "Design challenge" },
  { id: "research", label: "Research" },
  { id: "ideation", label: "Ideation & scope" },
  { id: "final", label: "Final design" },
  { id: "learnings", label: "Learnings" },
];

const META = [
  { label: "Role", value: "UX Designer & Researcher (Research lead)" },
  { label: "Team", value: "4 UX Designers" },
  { label: "Timeline", value: "Fall 2023 · 8 weeks" },
  { label: "Methods", value: "Interviews, Field research, Wireframing, Usability testing" },
];

export default function BlacksburgTransitCaseStudyPage() {
  return (
    <CaseStudyLayout
      shortName="Blacksburg Transit"
      navItems={NAV_ITEMS}
      title="Blacksburg Transit"
      tagline="Rebuilding trust in transit for 400,000 monthly riders, from planning a trip to trusting the bus actually arrives."
      metaContent={
        <div className="flex flex-col">
          {META.map((m) => (
            <MetaField key={m.label} label={m.label} value={m.value} />
          ))}
        </div>
      }
      actions={
        <Link
          href="/uploads/BT-Prototype-Flow.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-3xl border border-ink bg-ink px-[26px] py-[13px] text-[11px] tracking-[1.5px] uppercase text-cream no-underline hover:opacity-85"
        >
          View Prototype <span className="text-[13px]">&rarr;</span>
        </Link>
      }
      hero={
        <div className="relative flex aspect-[16/8] w-full items-center justify-center overflow-hidden rounded bg-[#cfc4ad]">
          <Image
            src="/uploads/BT_Hero.jpg"
            alt="Blacksburg Transit buses on the Virginia Tech campus"
            fill
            className="scale-[1.06] object-cover blur-[3px]"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(20,18,14,0.34) 0%, rgba(20,18,14,0.66) 100%)" }}
          />
          <div className="relative z-[2] px-10 text-center">
            <div
              className="mb-[22px] text-[11px] tracking-[3px] uppercase text-cream/92"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.45)" }}
            >
              Case Study &middot; 2023
            </div>
            <h1
              className="m-0 max-w-[14ch] font-heading text-[64px] font-bold uppercase leading-[0.98] tracking-[-1px] text-[#fbf7ef]"
              style={{ textShadow: "0 2px 18px rgba(0,0,0,0.5)" }}
            >
              Blacksburg Transit
            </h1>
          </div>
          <div
            className="absolute bottom-4 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-2 text-[10px] tracking-[2.5px] uppercase text-cream/90"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
          >
            Scroll <span className="text-[13px]">&darr;</span>
          </div>
        </div>
      }
    >
      {/* OVERVIEW */}
      <CaseStudySection id="overview">
        <p className="m-0 mb-12 text-[21px] leading-[1.6] text-ink">
          Blacksburg Transit is the primary way Virginia Tech students get around — nearly 400,000 passengers a
          month. But the app meant to support that ridership was making things worse: inaccurate bus times, a
          confusing interface, and unreliable information left students late to class and distrustful of the system.
          As Lead UX Researcher, I drove the research that grounded a focused app redesign aimed squarely at
          rebuilding that trust.
        </p>
        <div className="grid grid-cols-1 gap-9 gap-x-12 md:grid-cols-2">
          <PlainField label="Role">UX Designer &amp; Researcher (Research lead)</PlainField>
          <PlainField label="Methods">Interviews, Field research, Wireframing, Usability testing</PlainField>
          <PlainField label="Timeline">Fall 2023 · 8 weeks</PlainField>
          <PlainField label="Team">4 UX Designers</PlainField>
        </div>
      </CaseStudySection>

      {/* PROBLEM */}
      <CaseStudySection id="brief">
        <Eyebrow>problem</Eyebrow>
        <SectionHeading>Students can&rsquo;t trust their transit app — and it&rsquo;s disrupting their entire day</SectionHeading>
        <p className="m-0 mb-6 text-[16px] leading-[1.8] text-body-strong">
          Blacksburg Transit (BT) is the primary transportation method for Virginia Tech students, serving nearly
          400,000 passengers monthly. But the app meant to support that ridership was making things worse —
          inaccurate bus times, a confusing interface, and unreliable information left students arriving late to
          class, missing connections, and losing trust in the system.
        </p>
        <p className="m-0 mb-10 text-[16px] leading-[1.8] text-body">
          With ridership growing 6% year-over-year, BT was scaling demand on top of a system that was already
          failing its core users.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard value="400K">Monthly passengers relying on BT to get across campus and town.</StatCard>
          <StatCard value="6%">Year-over-year ridership growth, adding pressure to a failing system.</StatCard>
          <StatCard value="#1">The transit app is students&rsquo; primary planning tool — and their biggest frustration.</StatCard>
        </div>
      </CaseStudySection>

      {/* DESIGN CHALLENGE */}
      <CaseStudySection id="challenge">
        <Eyebrow className="mb-7">design challenge</Eyebrow>
        <p className="m-0 mb-12 font-heading text-[44px] font-semibold uppercase leading-[1.08] tracking-[-0.5px] text-ink">
          How might we redesign the BT app to provide{" "}
          <span className="text-accent-2">reliable, real-time information</span> that students can actually trust?
        </p>
        <div className="mb-[22px] text-[13px] tracking-[1px] uppercase text-[#6f6657]">Goals</div>
        <div className="grid grid-cols-1 gap-x-7 gap-y-4 md:grid-cols-2">
          <div className="grid grid-cols-[30px_1fr] items-baseline gap-3.5">
            <div className="font-heading text-[15px] italic text-accent-2">01</div>
            <p className="m-0 text-[16px] leading-[1.6] text-body-strong">Improve accuracy of bus arrival predictions.</p>
          </div>
          <div className="grid grid-cols-[30px_1fr] items-baseline gap-3.5">
            <div className="font-heading text-[15px] italic text-accent-2">02</div>
            <p className="m-0 text-[16px] leading-[1.6] text-body-strong">Simplify the interface for quick, on-the-go use.</p>
          </div>
          <div className="grid grid-cols-[30px_1fr] items-baseline gap-3.5">
            <div className="font-heading text-[15px] italic text-accent-2">03</div>
            <p className="m-0 text-[16px] leading-[1.6] text-body-strong">Rebuild user trust in the transit system.</p>
          </div>
          <div className="grid grid-cols-[30px_1fr] items-baseline gap-3.5">
            <div className="font-heading text-[15px] italic text-accent-2">04</div>
            <p className="m-0 text-[16px] leading-[1.6] text-body-strong">Support growing ridership with better UX.</p>
          </div>
        </div>
      </CaseStudySection>

      {/* RESEARCH */}
      <CaseStudySection id="research">
        <Eyebrow>research</Eyebrow>
        <SectionHeading>We went to the source: bus stops, frustrated students, daily commuting</SectionHeading>
        <p className="m-0 mb-11 text-[16px] leading-[1.8] text-body-strong">
          As Lead Researcher, I owned the interview process end-to-end and later led the evaluation sessions during
          testing. We grounded every finding in real rider behavior — not assumptions — and confirmed
          Blacksburg&rsquo;s problems weren&rsquo;t unique: unreliable transit apps are a widespread industry
          challenge.
        </p>

        <div className="mb-11 grid grid-cols-1 gap-6 md:grid-cols-2">
          <InfoCard label="Methods">
            15 one-on-one rider interviews, plus 45 minutes of contextual field research observing behavior at Burrus
            Hall, a primary BT hub.
          </InfoCard>
          <InfoCard label="Participants">
            Primarily undergraduate riders — covering frequency of use, specific app frustrations, and desired
            features.
          </InfoCard>
        </div>

        <div className="mb-2 text-[13px] tracking-[1px] uppercase text-[#6f6657]">Key insights</div>
        <p className="m-0 mb-6 text-[16px] leading-[1.7] text-body">
          Students don&rsquo;t want a perfect app — they just want to know when the bus is actually coming.
        </p>
        <div className="mb-12 flex flex-col gap-[18px]">
          <div className="border-l-[3px] border-accent-2 bg-card px-7 py-6">
            <p className="m-0 mb-2 font-heading text-[22px] font-semibold leading-[1.2] text-ink">&ldquo;The app lies to me constantly&rdquo;</p>
            <p className="m-0 text-[14px] leading-[1.7] text-body">
              Frequent discrepancies between predicted and actual arrival times caused missed buses and late
              arrivals.
            </p>
          </div>
          <div className="border-l-[3px] border-accent-2 bg-card px-7 py-6">
            <p className="m-0 mb-2 font-heading text-[22px] font-semibold leading-[1.2] text-ink">&ldquo;I can&rsquo;t figure out which bus to take&rdquo;</p>
            <p className="m-0 text-[14px] leading-[1.7] text-body">A cluttered interface made route planning difficult under time pressure.</p>
          </div>
          <div className="border-l-[3px] border-accent-2 bg-card px-7 py-6">
            <p className="m-0 mb-2 font-heading text-[22px] font-semibold leading-[1.2] text-ink">&ldquo;I just stopped using it&rdquo;</p>
            <p className="m-0 text-[14px] leading-[1.7] text-body">
              Many riders had abandoned the app entirely, defaulting to arriving early and waiting indefinitely.
            </p>
          </div>
        </div>

        <div className="mb-5 text-[13px] tracking-[1px] uppercase text-[#6f6657]">Rider segments</div>
        <div className="flex flex-col">
          <DefinitionRow term="Frequent / daily riders">
            Rely on the app as their primary planning tool — most affected by inaccurate ETAs.
          </DefinitionRow>
          <DefinitionRow term="Occasional riders">
            Use the app inconsistently, often distrust it after one bad experience and revert to guessing schedules.
          </DefinitionRow>
          <DefinitionRow term="Time-pressed commuters">
            Riding between classes — need at-a-glance clarity, not detailed route exploration.
          </DefinitionRow>
        </div>
      </CaseStudySection>

      {/* SOLUTION IDEATION */}
      <CaseStudySection id="ideation">
        <Eyebrow>ideation &amp; scope</Eyebrow>
        <SectionHeading>From ambitious vision to focused execution</SectionHeading>
        <p className="m-0 mb-6 text-[16px] leading-[1.8] text-body-strong">
          Our initial concept paired an app redesign with physical monitors installed at bus stops. But as a class
          project with a single semester and no real budget or installation access, the monitors weren&rsquo;t
          cost-effective. The team made a scoping decision to focus entirely on the app — which could deliver
          immediate impact to all ~400,000 monthly riders without infrastructure investment.
        </p>
        <p className="m-0 mb-9 text-[16px] leading-[1.8] text-body">
          Process: Early sketches &rarr; Balsamiq wireframes &rarr; think-aloud usability sessions &rarr;
          high-fidelity prototype. We established information architecture and core functionality in Balsamiq, ran
          think-aloud sessions to surface friction before high-fidelity design, and storyboarded key journeys to keep
          the design tied to real commuting scenarios.
        </p>

        <div className="mb-11 grid grid-cols-1 gap-6 md:grid-cols-2">
          <figure className="m-0 flex flex-col gap-2.5">
            <LightboxTrigger
              item={{
                type: "image",
                src: "/uploads/bus-tracking-flow.png",
                alt: "Balsamiq wireframe flow for bus tracking",
                caption: "Balsamiq wireframes · bus tracking flow",
              }}
              label="Enlarge Balsamiq wireframes"
            >
              <Image
                src="/uploads/bus-tracking-flow.png"
                alt="Balsamiq wireframe flow for bus tracking"
                width={800}
                height={600}
                unoptimized
                className="h-full w-full object-contain"
              />
            </LightboxTrigger>
            <figcaption className="text-[11px] tracking-[1.5px] uppercase text-muted">Balsamiq wireframes · bus tracking flow</figcaption>
          </figure>
          <figure className="m-0 flex flex-col gap-2.5">
            <LightboxTrigger
              item={{ type: "image", src: "/uploads/SB_Full.jpg", alt: "Journey storyboard sketches", caption: "Journey storyboard" }}
              label="Enlarge journey storyboard"
            >
              <Image
                src="/uploads/SB_Full.jpg"
                alt="Journey storyboard sketches"
                width={800}
                height={600}
                unoptimized
                className="h-full w-full object-contain"
              />
            </LightboxTrigger>
            <figcaption className="text-[11px] tracking-[1.5px] uppercase text-muted">Journey storyboard</figcaption>
          </figure>
        </div>

        <div className="mb-[18px] text-[13px] tracking-[1px] uppercase text-[#6f6657]">Five core requirements</div>
        <div className="flex flex-col">
          <NumberedPoint n="01">Improve app reliability with accurate real-time updates.</NumberedPoint>
          <NumberedPoint n="02">Simplify the layout for at-a-glance information.</NumberedPoint>
          <NumberedPoint n="03">Add a user guide for first-time users.</NumberedPoint>
          <NumberedPoint n="04">Display accurate bus stop information with live tracking.</NumberedPoint>
          <NumberedPoint n="05">Show bus capacity so users can plan for crowded buses.</NumberedPoint>
        </div>
      </CaseStudySection>

      {/* FINAL DESIGN */}
      <CaseStudySection id="final">
        <Eyebrow>final design</Eyebrow>
        <SectionHeading>A cleaner, faster, more trustworthy transit experience</SectionHeading>
        <p className="m-0 mb-7 text-[16px] leading-[1.8] text-body-strong">
          The final high-fidelity Figma prototype carried the research through to a clear, trustworthy flow —
          trading scheduled guesses for live, GPS-grounded information.
        </p>
        <Link
          href="/uploads/BT-Prototype-Flow.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-10 inline-flex items-center gap-2.5 rounded-3xl border border-ink bg-ink px-6 py-[13px] text-[11px] tracking-[1.5px] uppercase text-cream no-underline hover:opacity-85"
        >
          Click here to see the flow of the final prototype <span className="text-[13px]">&rarr;</span>
        </Link>

        <div className="mb-14 flex justify-center">
          <DemoVideo
            src="/videos/BT_Screen_Recording.mp4"
            poster="/videos/BT_Screen_Recording_poster.png"
            aspectRatio="790 / 1444"
            caption="Click to expand · final prototype, live tracking"
            lightboxCaption="Final prototype — live tracking screen"
          />
        </div>

        <div className="mb-[18px] text-[13px] tracking-[1px] uppercase text-[#6f6657]">Key features</div>
        <div className="mb-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="border border-border bg-card p-[26px_28px]">
            <div className="mb-2 font-heading text-[17px] font-semibold uppercase text-ink">Real-time tracking</div>
            <p className="m-0 text-[14px] leading-[1.7] text-body">Live bus locations with ETAs based on GPS data, not scheduled times.</p>
          </div>
          <div className="border border-border bg-card p-[26px_28px]">
            <div className="mb-2 font-heading text-[17px] font-semibold uppercase text-ink">Simplified route selection</div>
            <p className="m-0 text-[14px] leading-[1.7] text-body">Clear visual hierarchy for finding your bus at a glance, even while rushing.</p>
          </div>
          <div className="border border-border bg-card p-[26px_28px]">
            <div className="mb-2 font-heading text-[17px] font-semibold uppercase text-ink">
              Capacity indicators <span className="font-body text-[12px] font-normal normal-case text-muted">(conceptual)</span>
            </div>
            <p className="m-0 text-[14px] leading-[1.7] text-body">
              Shows crowding levels to help riders decide whether to wait for the next bus. Backend implementation
              was flagged as a follow-on technical question beyond this project&rsquo;s scope.
            </p>
          </div>
          <div className="border border-border bg-card p-[26px_28px]">
            <div className="mb-2 font-heading text-[17px] font-semibold uppercase text-ink">Onboarding guide</div>
            <p className="m-0 text-[14px] leading-[1.7] text-body">First-time user tutorial to reduce confusion and improve adoption.</p>
          </div>
        </div>

        <Eyebrow className="mb-4">evaluation &amp; testing</Eyebrow>
        <h3 className="mb-5 font-heading text-[30px] font-bold uppercase leading-[1.1] tracking-[-0.5px] text-ink">
          Rider feedback validated our approach
        </h3>
        <p className="m-0 mb-8 text-[16px] leading-[1.8] text-body-strong">
          We ran qualitative evaluation sessions with ~20 BT riders, comparing expected vs. actual interactions with
          the prototype.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="border border-border bg-card p-[26px_28px]">
            <div className="mb-3.5 text-[10px] tracking-[2px] uppercase text-muted">What worked</div>
            <ul className="m-0 flex flex-col gap-2.5 pl-[18px]">
              <li className="text-[14px] leading-[1.6] text-body-strong">Interface was significantly clearer and easier to navigate.</li>
              <li className="text-[14px] leading-[1.6] text-body-strong">Real-time tracking addressed the primary pain point of unreliability.</li>
              <li className="text-[14px] leading-[1.6] text-body-strong">Simplified design reduced cognitive load during stressful commutes.</li>
            </ul>
          </div>
          <div className="border border-border bg-card p-[26px_28px]">
            <div className="mb-3.5 text-[10px] tracking-[2px] uppercase text-muted">Areas for improvement</div>
            <ul className="m-0 flex flex-col gap-2.5 pl-[18px]">
              <li className="text-[14px] leading-[1.6] text-body-strong">Handle edge cases (delays, route changes) more clearly in the UI.</li>
              <li className="text-[14px] leading-[1.6] text-body-strong">Backend performance to support real-time data at scale.</li>
              <li className="text-[14px] leading-[1.6] text-body-strong">Continued refinement of prediction accuracy.</li>
            </ul>
          </div>
        </div>
      </CaseStudySection>

      {/* LEARNINGS */}
      <CaseStudySection id="learnings" fullHeight>
        <Eyebrow>learnings</Eyebrow>
        <SectionHeading className="mb-6">What I&rsquo;d carry forward</SectionHeading>
        <p className="m-0 mb-9 text-[16px] leading-[1.8] text-body">
          We delivered a working high-fidelity prototype addressing core rider pain points, and a scalable design
          foundation that could evolve with growing ridership.
        </p>
        <div className="flex flex-col">
          <NumberedPoint n="01" wide>
            <strong className="font-semibold text-ink">Scope creep is real, and recognizing it is crucial.</strong>{" "}
            Pivoting away from physical monitors to focus on the app was a critical lesson in strategic, cost-aware
            design thinking.
          </NumberedPoint>
          <NumberedPoint n="02" wide>
            <strong className="font-semibold text-ink">Iteration isn&rsquo;t failure, it&rsquo;s progress.</strong>{" "}
            Moving from sketches to wireframes to high-fidelity, testing at each stage, required patience and a
            willingness to revisit decisions.
          </NumberedPoint>
          <NumberedPoint n="03" wide>
            <strong className="font-semibold text-ink">User research grounds every decision.</strong>{" "}
            Direct rider interviews and field observation surfaced friction no survey could have captured.
          </NumberedPoint>
          <NumberedPoint n="04" wide>
            <strong className="font-semibold text-ink">Collaboration amplifies creativity.</strong>{" "}
            A team of four brought diverse perspectives that produced a stronger outcome than any one person could
            alone.
          </NumberedPoint>
        </div>
        <BackToWorkCTA />
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
