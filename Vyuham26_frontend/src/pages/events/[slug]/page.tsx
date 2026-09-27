import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { events, getEventBySlug } from "@/data/events";
import EventDetailClient from "./EventDetailClient";

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
    <Suspense fallback={null}>
      <EventDetailClient event={event} />
    </Suspense>
  );
}
