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
    sponsors: [
      { name: "Coming Soon", placeholder: true },
    ],
  },
  {
    name: "Gold Sponsors",
    level: "BETA",
    sponsors: [
      { name: "Sponsor Slot Available", placeholder: true },
      { name: "Sponsor Slot Available", placeholder: true },
    ],
  },
  {
    name: "Silver Sponsors",
    level: "GAMMA",
    sponsors: [
      { name: "Sponsor Slot Available", placeholder: true },
      { name: "Sponsor Slot Available", placeholder: true },
      { name: "Sponsor Slot Available", placeholder: true },
    ],
  },
  {
    name: "Community Partners",
    level: "DELTA",
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
      <main className="flex-1 pt-[92px]">
        <section className="border-b border-line py-24 md:py-36">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <Kicker>
                <span className="signal-dot" />
                Alliance network
              </Kicker>
              <h1 className="mt-4 font-display text-[clamp(48px,7vw,100px)] font-semibold leading-[0.85]">
                OUR <em>SPONSORS.</em>
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-[1.7] text-muted">
                The organizations and partners that make Vyuham 26 possible.
                Interested in joining the alliance?
              </p>
              <div className="mt-7">
                <Button href="/contact">
                  Partner with us{" "}
                  <span className="ml-2 text-base">→</span>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Sponsor tiers */}
        {tiers.map((tier, ti) => (
          <section
            key={tier.level}
            className="border-b border-line py-16 md:py-24"
          >
            <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
              <AnimatedSection>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-green">
                    {tier.level}
                  </span>
                  <div className="h-px flex-1 bg-line" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                    {tier.name}
                  </span>
                </div>
              </AnimatedSection>

              <div className="relative mt-8">
                <RouteTrace
                  paths={allianceRoutes(tier.sponsors.length, tierCols[ti])}
                  className="pointer-events-none absolute inset-x-[4%] -bottom-4 z-0 h-16 w-[92%] opacity-50"
                  viewBox="0 0 100 20"
                  showEndpoints
                  duration={1.1}
                />
                <div
                  className={`relative z-10 grid gap-4 ${
                    ti === 0
                      ? "grid-cols-1 md:max-w-md"
                      : ti === 1
                        ? "grid-cols-2"
                        : ti === 2
                          ? "grid-cols-3"
                          : "grid-cols-2 md:grid-cols-4"
                  }`}
                >
                  {tier.sponsors.map((sponsor, si) => (
                    <AnimatedSection key={si} delay={si * 0.05}>
                      <div
                        className={`glass-card flex items-center justify-center rounded-sm border-dashed p-8 ${
                          ti === 0 ? "min-h-[180px]" : "min-h-[120px]"
                        }`}
                      >
                        {sponsor.placeholder ? (
                          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted/50">
                            {sponsor.name}
                          </span>
                        ) : (
                          <span className="font-display text-lg font-semibold text-paper">
                            {sponsor.name}
                          </span>
                        )}
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="py-24 md:py-36">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] text-center md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <Kicker>Become an ally</Kicker>
              <h2 className="mt-4 font-display text-[clamp(36px,4.5vw,60px)] font-semibold leading-[0.9]">
                JOIN THE
                <br />
                <em>ALLIANCE.</em>
              </h2>
              <p className="mx-auto mt-6 max-w-md text-sm leading-[1.7] text-muted">
                Partner with Vyuham 26 to reach thousands of tech-savvy students
                from across India. Multiple sponsorship tiers available.
              </p>
              <div className="mt-8">
                <Button href="/contact">
                  Get in touch{" "}
                  <span className="ml-2 text-base">→</span>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
