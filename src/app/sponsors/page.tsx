import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import RouteTrace from "@/components/motion/RouteTrace";
import { Kicker, Button } from "@/components/ui/Elements";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Meet the sponsors and partners powering Vyuham 26. Interested in partnering? Get in touch with our sponsorship team.",
};

const columnCenters: number[][] = [
  [50],
  [25, 75],
  [16.5, 50, 83.5],
  [12.5, 37.5, 62.5, 87.5],
];

function allianceRoutes(count: number, cols: number) {
  const centers = columnCenters[cols - 1] ?? columnCenters[0];

  const paths: { d: string; delay?: number }[] = [];

  for (let i = 0; i < count - 1; i++) {
    const a = centers[i] ?? 50;
    const b = centers[i + 1] ?? 50;

    paths.push({
      d: `M ${a} 5 Q ${(a + b) / 2} 14 ${b} 5`,
      delay: i * 0.12,
    });
  }

  return paths;
}

const tierCols = [1, 2, 3, 4];

const tiers = [
  {
    name: "Title Sponsor",
    level: "ALPHA",
    code: "01",
    description: "Primary alliance node",
    sponsors: [{ name: "Coming Soon", placeholder: true }],
  },
  {
    name: "Gold Sponsors",
    level: "BETA",
    code: "02",
    description: "Strategic alliance nodes",
    sponsors: [
      { name: "Sponsor Slot Available", placeholder: true },
      { name: "Sponsor Slot Available", placeholder: true },
    ],
  },
  {
    name: "Silver Sponsors",
    level: "GAMMA",
    code: "03",
    description: "Supporting alliance nodes",
    sponsors: [
      { name: "Sponsor Slot Available", placeholder: true },
      { name: "Sponsor Slot Available", placeholder: true },
      { name: "Sponsor Slot Available", placeholder: true },
    ],
  },
  {
    name: "Community Partners",
    level: "DELTA",
    code: "04",
    description: "Community network nodes",
    sponsors: [
      { name: "Partner Slot Available", placeholder: true },
      { name: "Partner Slot Available", placeholder: true },
      { name: "Partner Slot Available", placeholder: true },
      { name: "Partner Slot Available", placeholder: true },
    ],
  },
];

export default function SponsorsPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[#020504] pt-[92px] text-paper">

        {/* =========================================================
            BACKGROUND SYSTEM
        ========================================================= */}

        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

          {/* primary energy core */}
          <div className="absolute left-1/2 top-[12%] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-green/5 blur-[140px]" />

          <div className="absolute -left-52 top-[45%] h-[500px] w-[500px] rounded-full bg-green/[0.025] blur-[130px]" />

          <div className="absolute -right-52 top-[70%] h-[500px] w-[500px] rounded-full bg-green/[0.02] blur-[130px]" />

          {/* technical grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(200,255,66,.45) 1px, transparent 1px),
                linear-gradient(90deg, rgba(200,255,66,.45) 1px, transparent 1px)
              `,
              backgroundSize: "55px 55px",
            }}
          />

          {/* scanlines */}
          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,.5) 4px)",
            }}
          />
        </div>

        {/* =========================================================
            HERO
        ========================================================= */}

        <section className="relative overflow-hidden border-b border-line py-20 md:py-28">

          {/* animated horizontal energy line */}
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-green/15 to-transparent" />

          <div className="mx-auto w-[min(1200px,calc(100%-32px))] md:w-[min(1200px,calc(100%-64px))]">

            <AnimatedSection>
              <div className="relative overflow-hidden border border-green/15 bg-[#050807]/90 p-6 md:p-10">

                {/* corner brackets */}
                <div className="absolute left-0 top-0 h-16 w-16 border-l border-t border-green/50" />
                <div className="absolute right-0 top-0 h-16 w-16 border-r border-t border-green/50" />
                <div className="absolute bottom-0 left-0 h-16 w-16 border-b border-l border-green/20" />
                <div className="absolute bottom-0 right-0 h-16 w-16 border-b border-r border-green/20" />

                {/* telemetry header */}
                <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-line/60 pb-4">

                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
                    </span>

                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-green">
                      ALLIANCE NETWORK ONLINE
                    </span>
                  </div>

                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                    NODE / ALLIANCE-01
                  </span>
                </div>

                <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-end">

                  <div>
                    <Kicker>
                      <span className="signal-dot" />
                      Alliance Network
                    </Kicker>

                    <h1 className="mt-5 font-display text-[clamp(48px,7vw,100px)] font-semibold leading-[0.82] tracking-tight">
                      OUR
                      <br />
                      <span className="text-green">SPONSORS.</span>
                    </h1>

                    <p className="mt-7 max-w-xl text-sm leading-6 text-muted md:text-base">
                      The organizations, institutions, and partners powering
                      VYUHAM&apos;26 and helping build the next generation of
                      technology, culture, gaming, and innovation.
                    </p>

                    <div className="mt-8">
                      <Button href="/contact">
                        PARTNER WITH US
                        <span className="ml-2 text-base">→</span>
                      </Button>
                    </div>
                  </div>

                  {/* alliance telemetry */}
                  <div className="border border-green/20 bg-black/30 p-5">

                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                      Alliance Telemetry
                    </div>

                    <div className="mt-5 space-y-4">

                      <div>
                        <div className="flex justify-between font-mono text-[9px] uppercase">
                          <span className="text-muted">
                            Network Status
                          </span>
                          <span className="text-green">ACTIVE</span>
                        </div>

                        <div className="mt-2 h-px bg-line">
                          <div className="h-full w-full bg-green shadow-[0_0_8px_rgba(200,255,66,.7)]" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">

                        <div className="border border-line bg-[#080c0a] p-3">
                          <div className="font-mono text-[8px] text-muted">
                            TIERS
                          </div>
                          <div className="mt-1 font-display text-2xl text-green">
                            04
                          </div>
                        </div>

                        <div className="border border-line bg-[#080c0a] p-3">
                          <div className="font-mono text-[8px] text-muted">
                            NODES
                          </div>
                          <div className="mt-1 font-display text-2xl text-paper">
                            10
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                {/* bottom metadata */}
                <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-line/60 pt-4 font-mono text-[8px] uppercase tracking-[0.15em] text-muted">
                  <span>VYUHAM&apos;26</span>
                  <span>TECHNOLOGY</span>
                  <span>CULTURE</span>
                  <span>GAMING</span>
                  <span>MANAGEMENT</span>
                  <span className="text-green">ALLIANCE READY</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* =========================================================
            SPONSOR TIERS
        ========================================================= */}

        {tiers.map((tier, ti) => (
          <section
            key={tier.level}
            className="relative border-b border-line py-16 md:py-24"
          >
            <div className="mx-auto w-[min(1200px,calc(100%-32px))] md:w-[min(1200px,calc(100%-64px))]">

              {/* tier header */}
              <AnimatedSection>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] tracking-[0.14em] text-green">
                      {tier.level}
                    </span>

                    <span className="font-mono text-[9px] text-muted">
                      / {tier.code}
                    </span>
                  </div>

                  <div className="hidden h-px flex-1 bg-line sm:block" />

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                      {tier.description}
                    </span>

                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper">
                      {tier.name}
                    </span>
                  </div>
                </div>
              </AnimatedSection>

              {/* sponsor network */}
              <div className="relative mt-8">

                <RouteTrace
                  paths={allianceRoutes(
                    tier.sponsors.length,
                    tierCols[ti]
                  )}
                  className="pointer-events-none absolute inset-x-[4%] -bottom-4 z-0 h-16 w-[92%] opacity-40"
                  viewBox="0 0 100 20"
                  showEndpoints
                  duration={1.4}
                />

                <div
                  className={`relative z-10 grid gap-4 ${ti === 0
                      ? "grid-cols-1 md:max-w-md"
                      : ti === 1
                        ? "grid-cols-2"
                        : ti === 2
                          ? "grid-cols-1 sm:grid-cols-3"
                          : "grid-cols-2 md:grid-cols-4"
                    }`}
                >
                  {tier.sponsors.map((sponsor, si) => (
                    <AnimatedSection
                      key={si}
                      delay={si * 0.07}
                    >
                      <div
                        className={`group relative overflow-hidden border border-line bg-[#050807]/90 transition-all duration-500 hover:border-green/30 hover:bg-green/[0.02] ${ti === 0
                            ? "min-h-[210px]"
                            : "min-h-[150px]"
                          }`}
                      >

                        {/* top energy line */}
                        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-green/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        {/* scan beam */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-green/30 opacity-0 transition-opacity group-hover:opacity-100" />

                        {/* corner accents */}
                        <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-green/20" />
                        <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-green/20" />

                        <div className="flex h-full flex-col items-center justify-center p-8 text-center">

                          {sponsor.placeholder ? (
                            <>
                              {/* alliance node */}
                              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-green/20 bg-green/[0.025]">

                                <div className="absolute inset-[-7px] rounded-full border border-dashed border-green/10" />

                                <div className="h-2 w-2 rounded-full bg-green/40 shadow-[0_0_12px_rgba(200,255,66,.4)]" />
                              </div>

                              <span className="mt-5 font-mono text-[9px] uppercase tracking-[0.15em] text-muted/60">
                                {sponsor.name}
                              </span>

                              <span className="mt-2 font-mono text-[7px] uppercase tracking-[0.18em] text-green/30">
                                AWAITING ALLIANCE
                              </span>
                            </>
                          ) : (
                            <span className="font-display text-lg font-semibold text-paper">
                              {sponsor.name}
                            </span>
                          )}
                        </div>

                        {/* node number */}
                        <span className="absolute right-3 top-3 font-mono text-[7px] text-white/10">
                          {tier.level}-{String(si + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* =========================================================
            PARTNERSHIP BENEFITS
        ========================================================= */}

        <section className="border-b border-line py-20 md:py-28">
          <div className="mx-auto w-[min(1000px,calc(100%-32px))] md:w-[min(1000px,calc(100%-64px))]">

            <AnimatedSection>
              <div className="text-center">
                <Kicker>Alliance Protocol</Kicker>

                <h2 className="mt-4 font-display text-[clamp(36px,5vw,64px)] font-semibold leading-[0.9]">
                  WHY JOIN THE
                  <br />
                  <span className="text-green">NETWORK?</span>
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-muted">
                  VYUHAM&apos;26 provides a platform for organizations to
                  connect with ambitious students, developers, creators,
                  gamers, and emerging technology communities.
                </p>
              </div>
            </AnimatedSection>

            <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">

              {[
                ["01", "VISIBILITY", "Reach a diverse student and technology audience."],
                ["02", "ENGAGEMENT", "Connect directly with participants and creators."],
                ["03", "BRAND", "Build meaningful presence across the festival."],
                ["04", "management", "Support innovation and emerging talent."],
              ].map(([code, title, description], index) => (
                <AnimatedSection
                  key={code}
                  delay={index * 0.06}
                >
                  <div className="group h-full bg-[#050807] p-6 transition-colors hover:bg-green/[0.025]">

                    <span className="font-mono text-[9px] text-green">
                      {code}
                    </span>

                    <h3 className="mt-6 font-display text-base font-semibold">
                      {title}
                    </h3>

                    <p className="mt-3 text-xs leading-5 text-muted">
                      {description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            FINAL CTA
        ========================================================= */}

        <section className="relative overflow-hidden py-24 md:py-36">

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green/5 blur-[130px]" />

          <div className="relative mx-auto w-[min(1000px,calc(100%-32px))] text-center md:w-[min(1000px,calc(100%-64px))]">

            <AnimatedSection>
              <div className="relative overflow-hidden border border-green/15 bg-[#050807]/90 px-6 py-16 md:px-12 md:py-20">

                {/* brackets */}
                <div className="absolute left-0 top-0 h-10 w-10 border-l border-t border-green/40" />
                <div className="absolute right-0 top-0 h-10 w-10 border-r border-t border-green/40" />
                <div className="absolute bottom-0 left-0 h-10 w-10 border-b border-l border-green/20" />
                <div className="absolute bottom-0 right-0 h-10 w-10 border-b border-r border-green/20" />

                <Kicker>Become an Ally</Kicker>

                <h2 className="mt-5 font-display text-[clamp(40px,6vw,72px)] font-semibold leading-[0.86]">
                  JOIN THE
                  <br />
                  <span className="text-green">ALLIANCE.</span>
                </h2>

                <p className="mx-auto mt-7 max-w-lg text-sm leading-6 text-muted">
                  Partner with VYUHAM&apos;26 to connect your organization
                  with thousands of ambitious students and emerging
                  technology communities from across India.
                </p>

                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button href="/contact">
                    GET IN TOUCH
                    <span className="ml-2 text-base">→</span>
                  </Button>

                  <Button
                    href="/faq"
                    variant="outline"
                  >
                    PARTNERSHIP FAQ
                    <span className="ml-2 text-base">↗</span>
                  </Button>
                </div>

                <div className="mt-8 font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
                  ALLIANCE NETWORK / VYUHAM&apos;26 / READY FOR CONNECTION
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* =========================================================
            FOOTER STATUS
        ========================================================= */}

        <div className="mx-auto w-[min(1200px,calc(100%-32px))] pb-7 md:w-[min(1200px,calc(100%-64px))]">
          <div className="flex flex-col gap-3 border-t border-line/50 pt-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green shadow-[0_0_8px_rgba(200,255,66,.8)]" />

              <span className="font-mono text-[9px] uppercase tracking-wider text-muted">
                VYUHAM&apos;26 / ALLIANCE NETWORK
              </span>
            </div>

            <div className="font-mono text-[9px] uppercase tracking-wider text-muted">
              NETWORK STATUS:{" "}
              <span className="text-green">OPERATIONAL</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
