import type { Event as PageEvent } from "@/data/events";
import type { EventRecord } from "@/lib/api";
import type { FestEvent, StreamId } from "@/data/types";

const PAGE_STREAM: Record<EventRecord["stream"], PageEvent["stream"]> = {
  tech: "tech",
  culture: "cultural",
  gaming: "esports",
  impact: "management",
  management: "management",
};

function validDay(day: number | null | undefined, fallback?: 1 | 2 | 3): 1 | 2 | 3 {
  return day === 1 || day === 2 || day === 3 ? day : fallback ?? 1;
}

function festivalDate(day: 1 | 2 | 3): string {
  return day === 1 ? "30 OCT 2026" : day === 2 ? "31 OCT 2026" : "01 NOV 2026";
}

function matchingStaticEvent<T extends { id?: string; slug?: string }>(
  slug: string,
  staticEvents: T[],
): T | undefined {
  return staticEvents.find(
    (event) => event.slug?.toLowerCase() === slug.toLowerCase() ||
      event.id?.replace(/^ev-/, "").toLowerCase() === slug.toLowerCase(),
  );
}

export function mapEventRecordToPageEvent(
  record: EventRecord,
  staticEvents: PageEvent[],
): PageEvent {
  const fallback = matchingStaticEvent(record.slug, staticEvents);
  const day = validDay(record.day, fallback?.day);
  const rawStatus = record.status?.toLowerCase();
  const status: PageEvent["status"] =
    rawStatus === "completed" || rawStatus === "ended"
      ? "completed"
      : rawStatus === "live" || rawStatus === "ongoing"
        ? "live"
        : "upcoming";

  return {
    id: record.id,
    slug: record.slug,
    title: record.title || record.name,
    stream: PAGE_STREAM[record.stream] || "tech",
    day,
    time: record.time || fallback?.time || "Time to be announced",
    venue: record.venue || fallback?.venue || "Not listed in official schedule",
    description: record.description || fallback?.description || "Event details will be announced soon.",
    rules: record.rules || fallback?.rules || [],
    prizes: record.prizes || fallback?.prizes || "To be announced",
    fee: record.fee || fallback?.fee || "To be announced",
    eligibility: record.eligibility || fallback?.eligibility || "See event details",
    teamSize: record.teamSize || fallback?.teamSize || "See event details",
    status,
    poster: record.image || fallback?.poster,
    featured: record.featured,
    starred: fallback?.starred,
    registration_url: record.registration_url || fallback?.registration_url,
    makemypass_url: record.makemypass_url || fallback?.makemypass_url,
  };
}

export function mapEventRecordToFestEvent(
  record: EventRecord,
  staticEvents: FestEvent[],
): FestEvent {
  const fallback = matchingStaticEvent(record.slug, staticEvents);
  const day = validDay(record.day, fallback?.day);
  const backendPrize = record.prizes && record.prizes !== "N/A" ? record.prizes : undefined;
  const prizeAmount = record.prize_amount == null ? undefined : Number(record.prize_amount);
  const status = record.status?.toLowerCase();
  const stream = record.stream as StreamId;
  const imageFallback = fallback || staticEvents.find((event) => event.stream === stream) || staticEvents[0];

  return {
    id: fallback?.id || `ev-${record.slug}`,
    name: record.name || record.title,
    stream,
    day,
    date: festivalDate(day),
    time: record.time || fallback?.time || "Time to be announced",
    venue: record.venue || fallback?.venue || "Not listed in official schedule",
    blurb: record.description || fallback?.blurb || "Event details will be announced soon.",
    prize: backendPrize || (Number.isFinite(prizeAmount) ? `₹${prizeAmount!.toLocaleString("en-IN")}` : fallback?.prize),
    fee: record.fee || fallback?.fee,
    seats: record.seats_total ?? fallback?.seats ?? 0,
    registered: fallback?.registered ?? 0,
    image: record.image || imageFallback?.image || "",
    poster: record.image || fallback?.poster || imageFallback?.image,
    category: stream.charAt(0).toUpperCase() + stream.slice(1),
    featured: record.featured,
    // The backend feature flag is authoritative so homepage curation survives across browsers.
    starred: record.featured,
    status: status === "full" ? "full" : status === "closing" ? "closing" : "open",
    registration_url: record.registration_url || fallback?.registration_url,
    makemypass_url: record.makemypass_url || fallback?.makemypass_url,
  };
}
