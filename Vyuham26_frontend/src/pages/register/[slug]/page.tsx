import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, StreamBadge } from "@/components/ui/Elements";
import { getEventBySlug, events } from "@/data/events";
import EventRegistrationForm from "@/components/forms/EventRegistrationForm";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: "Event Not Found | Vyuham '26" };

  return {
    title: `Register: ${event.title} | Vyuham '26`,
    description: `Register for ${event.title} at Vyuham 26. Fee: ${event.fee}, Venue: ${event.venue}.`,
  };
}

export default async function EventRegistrationFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(720px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="flex items-center justify-between">
                <Link href="/register" className="font-mono text-xs text-muted hover:text-green">
                  ← Back to Selection Board
                </Link>
                <StreamBadge stream={event.stream} />
              </div>

              <div className="mt-4">
                <Kicker>Deployment Protocol</Kicker>
                <h1 className="mt-2 font-display text-[32px] font-semibold md:text-[44px]">
                  {event.title}
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Register your participation for {event.title}. Fee: {event.fee} | Venue: {event.venue}
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <EventRegistrationForm event={event} />
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
