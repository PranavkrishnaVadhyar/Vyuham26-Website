import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker } from "@/components/ui/Elements";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Vyuham 26 — Digital University Kerala's national-level techno-cultural fest. Discover our theme, streams, and vision.",
};

const streams = [
  {
    glyph: "⌁",
    title: "Technology",
    description:
      "From hackathons to CTFs, push the boundaries of code, systems and digital innovation. Build, break and rebuild.",
    color: "text-green border-green/30",
  },
  {
    glyph: "◈",
    title: "Culture",
    description:
      "Stage performances, visual arts, writing and rhythm. Express, create and inspire through the universal language of art.",
    color: "text-purple-400 border-purple-500/30",
  },
  {
    glyph: "✦",
    title: "Gaming",
    description:
      "Esports, strategy games and competitive arenas. Prove your reflexes, teamwork and tactical thinking under pressure.",
    color: "text-cyan-400 border-cyan-500/30",
  },
  {
    glyph: "⊹",
    title: "Impact",
    description:
      "Ideas designed to move the world forward. Social innovation, sustainability and entrepreneurship that matters.",
    color: "text-amber-400 border-amber-500/30",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        {/* Hero */}
        <section className="border-b border-line py-24 md:py-36">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <Kicker>
                <span className="signal-dot" />
                Mission briefing
              </Kicker>
              <h1 className="mt-4 font-display text-[clamp(48px,7vw,100px)] font-semibold leading-[0.85]">
                THE <em>DIMENSION</em>
                <br />
                EXPLAINED.
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="mt-12 max-w-2xl">
              <div className="glass-card scanline-card rounded-sm p-8">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-green">
                  {"// Holographic mission briefing"}
                </p>
                <p className="mt-4 text-sm leading-[1.8] text-muted">
                  Vyuham 26 is Digital University Kerala&apos;s flagship
                  national-level techno-cultural fest. Set across three
                  electrifying days at Technocity, Thiruvananthapuram, it brings
                  together the sharpest minds, the most creative souls and the
                  boldest dreamers from across India.
                </p>
                <p className="mt-4 text-sm leading-[1.8] text-muted">
                  The theme — <strong className="text-paper">The Future Awaits</strong> —
                  is more than a tagline. It&apos;s an invitation to step into a
                  fractured digital dimension where technology meets culture,
                  strategy meets art, and ideas are given the stage they deserve.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* DUK section */}
        <section className="border-b border-line py-24 md:py-36">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <div className="grid gap-16 md:grid-cols-2 md:items-center">
                <div>
                  <Kicker>The institution</Kicker>
                  <h2 className="mt-3 font-display text-[clamp(36px,4.5vw,60px)] font-semibold leading-[0.9]">
                    DIGITAL
                    <br />
                    UNIVERSITY <em>KERALA</em>
                  </h2>
                </div>
                <div>
                  <p className="text-sm leading-[1.8] text-muted">
                    Digital University Kerala is India&apos;s first digital
                    university, established by the Government of Kerala.
                    Dedicated to digital technologies and innovation, DUK is
                    reshaping how education, research and industry converge in
                    the digital age.
                  </p>
                  <p className="mt-4 text-sm leading-[1.8] text-muted">
                    Located at Technocity in Thiruvananthapuram, the university
                    is a hub for cutting-edge research in AI, cybersecurity,
                    digital humanities and more.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Streams */}
        <section className="py-24 md:py-36">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <Kicker>Four streams</Kicker>
              <h2 className="mt-3 font-display text-[clamp(36px,4.5vw,60px)] font-semibold leading-[0.9]">
                CHOOSE YOUR
                <br />
                <em>PROTOCOL.</em>
              </h2>
            </AnimatedSection>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {streams.map((stream, i) => (
                <AnimatedSection key={stream.title} delay={i * 0.1}>
                  <div
                    className={`glass-card glass-card-hover rounded-sm border p-8 ${stream.color}`}
                  >
                    <div className="font-display text-5xl">{stream.glyph}</div>
                    <h3 className="mt-6 font-display text-xl font-semibold text-paper">
                      {stream.title}
                    </h3>
                    <p className="mt-3 text-sm leading-[1.7] text-muted">
                      {stream.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
