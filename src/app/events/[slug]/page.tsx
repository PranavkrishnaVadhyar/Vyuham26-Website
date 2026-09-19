import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button, Chip, StreamBadge } from "@/components/ui/Elements";
import { events, getEventBySlug } from "@/data/events";

export async function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};
  return {
    title: event.title,
    description: event.description,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-24 md:py-36">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            {/* Breadcrumb */}
            <AnimatedSection>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                <Link
                  href="/events"
                  className="text-muted no-underline transition-colors hover:text-green"
                >
                  Events
                </Link>
                <span>/</span>
                <span className="text-paper">{event.title}</span>
              </div>
            </AnimatedSection>

            {/* Header */}
            <AnimatedSection delay={0.1}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <StreamBadge stream={event.stream} />
                <Chip variant={event.status}>{event.status}</Chip>
              </div>

              <h1 className="mt-6 font-display text-[clamp(40px,6vw,80px)] font-semibold leading-[0.87]">
                {event.title.toUpperCase()}
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-[1.8] text-muted">
                {event.description}
              </p>
            </AnimatedSection>

            {/* Mission dossier grid */}
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {/* Info cards */}
              <AnimatedSection delay={0.15}>
                <div className="glass-card rounded-sm p-6">
                  <Kicker>{"// Event details"}</Kicker>
                  <div className="mt-4 space-y-4">
                    <div>
                      <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                        Day
                      </span>
                      <strong className="mt-1 block font-display text-sm text-paper">
                        Day {event.day} —{" "}
                        {event.day === 1
                          ? "30 October"
                          : event.day === 2
                            ? "31 October"
                            : "01 November"}
                      </strong>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                        Time
                      </span>
                      <strong className="mt-1 block font-display text-sm text-paper">
                        {event.time}
                      </strong>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                        Venue
                      </span>
                      <strong className="mt-1 block font-display text-sm text-paper">
                        {event.venue}
                      </strong>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                        Team Size
                      </span>
                      <strong className="mt-1 block font-display text-sm text-paper">
                        {event.teamSize}
                      </strong>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Rules */}
              <AnimatedSection delay={0.2}>
                <div className="glass-card rounded-sm p-6">
                  <Kicker>{"// Rules & guidelines"}</Kicker>
                  <ul className="mt-4 space-y-3">
                    {event.rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1 font-mono text-[10px] text-green">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm leading-[1.6] text-muted">
                          {rule}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              {/* Prizes & Eligibility */}
              <AnimatedSection delay={0.25}>
                <div className="space-y-6">
                  <div className="glass-card rounded-sm p-6">
                    <Kicker>{"// Prizes"}</Kicker>
                    <p className="mt-4 font-display text-lg font-semibold text-green">
                      {event.prizes}
                    </p>
                  </div>
                  <div className="glass-card rounded-sm p-6">
                    <Kicker>{"// Eligibility"}</Kicker>
                    <p className="mt-4 text-sm leading-[1.6] text-muted">
                      {event.eligibility}
                    </p>
                  </div>
                  <Button href="/contact" className="w-full justify-center">
                    Register for this event{" "}
                    <span className="ml-2 text-base">→</span>
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
