import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import RouteTrace from "@/components/motion/RouteTrace";
import { Kicker } from "@/components/ui/Elements";

export const metadata: Metadata = {
  title: "Venue",
  description:
    "Vyuham 26 takes place at Technocity campus, Thiruvananthapuram — Digital University Kerala's technology hub. View campus map and directions.",
};

const venues = [
  {
    name: "Main Stage",
    description: "Grand performances, opening and closing ceremonies",
    events: "Battle of Bands, Dance Battle, Ceremonies",
  },
  {
    name: "Innovation Lab",
    description: "Hackathons and AI/ML challenges",
    events: "Hackathon 36, AI Arena",
  },
  {
    name: "Cyber Arena",
    description: "Cybersecurity and CTF competitions",
    events: "Capture The Flag",
  },
  {
    name: "Esports Arena",
    description: "Competitive gaming tournaments",
    events: "Valorant Championship, BGMI Showdown",
  },
  {
    name: "Lab Complex",
    description: "Coding competitions and technical events",
    events: "Code Relay, Technical workshops",
  },
  {
    name: "Conference Hall",
    description: "Presentations and pitching events",
    events: "Pitch Perfect, Panel discussions",
  },
  {
    name: "Amphitheatre",
    description: "Open-air cultural performances",
    events: "Poetry Slam, Open mic sessions",
  },
  {
    name: "Green Lab",
    description: "Sustainability and impact events",
    events: "Sustainability Hack",
  },
  {
    name: "Campus Grounds",
    description: "Outdoor art and food courts",
    events: "Street Art, Food Court, Exhibitions",
  },
];

const hub = { x: 450, y: 240 };

const zonePoints = [
  { name: "Main Stage", x: 150, y: 80 },
  { name: "Innovation Lab", x: 450, y: 80 },
  { name: "Cyber Arena", x: 750, y: 80 },
  { name: "Esports Arena", x: 150, y: 240 },
  { name: "Lab Complex", x: 450, y: 240 },
  { name: "Conference Hall", x: 750, y: 240 },
  { name: "Amphitheatre", x: 150, y: 400 },
  { name: "Green Lab", x: 450, y: 400 },
  { name: "Campus Grounds", x: 750, y: 400 },
];

const venueRoutes = zonePoints
  .filter((point) => !(point.x === hub.x && point.y === hub.y))
  .map((point, i) => ({
    d: `M ${hub.x} ${hub.y} Q ${(hub.x + point.x) / 2} ${(hub.y + point.y) / 2 - 30} ${point.x} ${point.y}`,
    delay: i * 0.06,
  }));

export default function VenuePage() {
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
                Tactical navigation grid
              </Kicker>
              <h1 className="mt-4 font-display text-[clamp(48px,7vw,100px)] font-semibold leading-[0.85]">
                THE <em>VENUE.</em>
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-[1.7] text-muted">
                Technocity campus, Thiruvananthapuram — a sprawling tech park
                that becomes the arena for three days of Vyuham 26.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Map embed */}
        <section className="border-b border-line">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] py-12 md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <div className="overflow-hidden rounded-sm border border-line">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.123456789!2d76.8803!3d8.5559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05b9e7a7f1a1a1%3A0x1a1a1a1a1a1a1a1a!2sTechnocity%2C%20Thiruvananthapuram!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="400"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Technocity campus map"
                />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Venue grid */}
        <section className="py-24 md:py-36">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <Kicker>Campus zones</Kicker>
              <h2 className="mt-3 font-display text-[clamp(36px,4.5vw,60px)] font-semibold leading-[0.9]">
                NAVIGATE THE
                <br />
                <em>GRID.</em>
              </h2>
            </AnimatedSection>

            <div className="relative mt-14">
              <RouteTrace
                paths={venueRoutes}
                className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-40"
                viewBox="0 0 900 480"
                showEndpoints
                duration={1.3}
              />
              <div className="relative z-10 grid gap-4 md:grid-cols-3">
                {venues.map((venue, i) => (
                <AnimatedSection key={venue.name} delay={i * 0.05}>
                  <div className="glass-card glass-card-hover rounded-sm p-6">
                    <span className="font-mono text-[10px] text-green">
                      ZONE {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-semibold text-paper">
                      {venue.name}
                    </h3>
                    <p className="mt-2 text-xs leading-[1.6] text-muted">
                      {venue.description}
                    </p>
                    <div className="mt-4 border-t border-line pt-3">
                      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                        Events:{" "}
                      </span>
                      <span className="text-xs text-muted/80">
                        {venue.events}
                      </span>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
              </div>
            </div>

            {/* Directions */}
            <AnimatedSection delay={0.3} className="mt-16">
              <div className="glass-card rounded-sm p-8">
                <Kicker>{"// How to reach"}</Kicker>
                <div className="mt-6 grid gap-8 md:grid-cols-3">
                  <div>
                    <h3 className="font-display text-sm font-semibold text-paper">
                      By Air
                    </h3>
                    <p className="mt-2 text-xs leading-[1.7] text-muted">
                      Trivandrum International Airport (TRV) — 18 km from
                      Technocity. Taxis and ride-hailing available.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-paper">
                      By Train
                    </h3>
                    <p className="mt-2 text-xs leading-[1.7] text-muted">
                      Thiruvananthapuram Central — 12 km from Technocity. Local
                      buses and autos available.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-paper">
                      By Road
                    </h3>
                    <p className="mt-2 text-xs leading-[1.7] text-muted">
                      Technocity is on the National Highway bypass. Well
                      connected via KSRTC and private buses.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
