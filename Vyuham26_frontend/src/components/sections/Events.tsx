import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { useApp } from "@/lib/store";
import { FocusIn, MaskReveal } from "@/components/cinematic/Reveal";
import { DepthImage, MagneticButton } from "@/components/cinematic/Interactive";
import { toast } from "@/components/ui/Toaster";
import type { FestEvent, StreamId } from "@/data/types";
import { SITE_CONFIG, useRegistrationOpen, useStarredEvents } from "@/config/site";

const FILTERS: { id: StreamId | "all"; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "tech", label: "TECH" },
  { id: "management", label: "MANAGEMENT" },
  { id: "cultural", label: "CULTURAL" },
  { id: "esports", label: "ESPORTS" },
];

function statusStyle(s: FestEvent["status"]) {
  if (s === "full") return { color: "#f2c98a", label: "WAITLIST" };
  if (s === "closing") return { color: "#7dffc4", label: "CLOSING SOON" };
  return { color: "#18c47c", label: "OPEN" };
}

export default function Events() {
  const { content, register, isRegistered, toggleSave, saved, user, ui } = useApp();
  const regOpen = useRegistrationOpen();
  const { starredSlugs, isStarred } = useStarredEvents();
  const [filter, setFilter] = useState<StreamId | "all">("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const accentOf = (id: StreamId) => content.streams.find((s) => s.id === id)?.accent ?? "#18c47c";

  // Main page ONLY lists starred / important events selected by admin
  const starredBaseList = useMemo(() => {
    const starred = content.events.filter((e) => isStarred(e.id) || !!e.starred);
    if (starred.length > 0) return starred;
    // Graceful fallback if no events have been starred yet so section is never blank
    const fallback = content.events.filter((e) => e.featured);
    return fallback.length > 0 ? fallback : content.events.slice(0, 4);
  }, [content.events, starredSlugs, isStarred]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return starredBaseList.filter((e) => {
      const matchStream = filter === "all" || e.stream === filter;
      const matchQuery =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.blurb.toLowerCase().includes(q) ||
        e.stream.includes(q);
      return matchStream && matchQuery;
    });
  }, [starredBaseList, filter, query]);

  const featured = useMemo(() => list.find((e) => e.featured) ?? list[0], [list]);
  const rows = useMemo(() => list.filter((e) => e.id !== featured?.id), [list, featured]);

  const onRegister = (e: FestEvent) => {
    if (!regOpen) {
      toast("Event registration is coming soon!", "info");
      return;
    }
    if (!user) {
      ui.setAuthOpen("login");
      toast("Sign in to hold a slot.", "warn");
      return;
    }
    const res = register(e.id);
    toast(res.message, res.ok ? "ok" : "warn");
  };

  return (
    <section id="events" className="relative w-full px-5 py-10 sm:py-14 md:py-20 md:px-[6vw]">
      {/* header */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="eyebrow">04 — EVENTS</p>
            <span className="inline-flex items-center gap-1 rounded border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 font-mono text-[8px] font-bold tracking-[0.2em] uppercase text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.18)]">
              ★ MAIN STAGE HIGHLIGHTS ({starredBaseList.length})
            </span>
          </div>
          <h2 className="t-cond mt-4 text-[13vw] leading-[0.82] text-[#f0f9f5] md:text-[6.4vw]">
            <MaskReveal>THE PROGRAMME</MaskReveal>
          </h2>
          <p className="mt-5 max-w-[50ch] text-[13px] leading-relaxed text-[#7d9a8d] md:text-[15px]">
            Marquee attractions & flagship tournaments hand-picked for the main stage. Looking for the complete 30+ event roster?{" "}
            <Link href="/events" className="text-[#18c47c] underline underline-offset-4 hover:text-[#7dffc4] transition-colors">
              View All 30+ Events in Full Directory →
            </Link>
          </p>
        </div>

        <div className="flex w-full max-w-[420px] flex-col gap-4">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH EVENTS, VENUES, STREAMS…"
              className="field font-mono text-[10px] tracking-[0.2em] uppercase"
              aria-label="Search events"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#3f6152]">
              {list.length.toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* filter rail */}
      <div className="no-scrollbar mt-6 sm:mt-7 flex gap-2 overflow-x-auto border-y border-[rgba(120,160,145,0.12)] py-3">
        {FILTERS.map((f) => {
          const on = filter === f.id;
          const accent = f.id === "all" ? "#18c47c" : accentOf(f.id as StreamId);
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "shrink-0 border px-4 py-2 font-mono text-[9px] tracking-[0.26em] transition-all duration-500",
                on ? "text-[#04120c]" : "text-[#84a094] hover:text-[#dff6ec]",
              )}
              style={{
                borderColor: on ? accent : "rgba(120,160,145,0.18)",
                background: on ? accent : "transparent",
                boxShadow: on ? `0 0 28px -8px ${accent}` : "none",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* featured editorial block */}
      {featured && (
        <FocusIn className="mt-8 sm:mt-10">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end">
            <div className="relative">
              <DepthImage
                src={featured.image}
                alt={featured.name}
                className="aspect-[16/10] w-full"
                grade="grade-cine"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020403] via-transparent to-transparent" />
              <div className="absolute left-4 top-4 flex items-center gap-2 md:left-6 md:top-6">
                <span
                  className="h-[6px] w-[6px] rounded-full"
                  style={{ background: accentOf(featured.stream), boxShadow: `0 0 14px ${accentOf(featured.stream)}` }}
                />
                <span className="font-mono text-[9px] tracking-[0.3em] text-[#c6e5d8]">
                  FEATURED · {featured.stream.toUpperCase()}
                </span>
                <span className="inline-flex items-center gap-1 rounded border border-amber-400/50 bg-amber-400/15 px-2 py-0.5 font-mono text-[8px] font-bold tracking-[0.16em] uppercase text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.25)]">
                  ★ STARRED
                </span>
              </div>
            </div>

            <div>
              <h3 className="t-cond text-[10vw] leading-[0.86] text-[#f2fbf6] md:text-[4.2vw]">{featured.name}</h3>
              <p className="mt-4 max-w-[48ch] text-[13px] leading-relaxed text-[#8faea1] md:text-[15px]">
                {featured.blurb}
              </p>
              <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[rgba(120,160,145,0.14)] pt-6">
                {[
                  ["DATE", featured.date],
                  ["TIME", featured.time],
                  ["VENUE", featured.venue],
                  ["PRIZE", featured.prize ?? "—"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[8px] tracking-[0.3em] text-[#4f6f61]">{k}</dt>
                    <dd className="mt-1 font-mono text-[11px] tracking-[0.12em] text-[#cfe8dc]">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <MagneticButton variant="solid" onClick={() => onRegister(featured)}>
                  {!regOpen
                    ? "COMING SOON"
                    : isRegistered(featured.id)
                    ? "REGISTERED ✓"
                    : "REGISTER"}
                </MagneticButton>
                <Link
                  href={`/events/${featured.id.replace(/^ev-/, "")}`}
                  className="font-mono text-[10px] tracking-[0.2em] text-[#7dffc4] transition hover:underline"
                >
                  VIEW DOSSIER & RULEBOOK →
                </Link>
                <button
                  onClick={() => toggleSave(featured.id)}
                  className="font-mono text-[10px] tracking-[0.26em] text-[#7d9a8d] transition-colors duration-500 hover:text-[#9fe9c6]"
                >
                  {saved.includes(featured.id) ? "SAVED ★" : "SAVE ☆"}
                </button>
              </div>
            </div>
          </div>
        </FocusIn>
      )}

      {/* editorial rows */}
      <div className="mt-10 sm:mt-12 border-t border-[rgba(120,160,145,0.14)]">
        {rows.map((e, i) => {
          const accent = accentOf(e.stream);
          const st = statusStyle(e.status);
          const open = openId === e.id;
          return (
            <FocusIn key={e.id} delay={Math.min(i * 0.04, 0.3)} y={18} blur={8}>
              <div className="group relative border-b border-[rgba(120,160,145,0.14)]">
                <div
                  className="pointer-events-none absolute inset-0 origin-left scale-x-0 opacity-0 transition-all duration-[900ms] group-hover:scale-x-100 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, ${accent}14, transparent 60%)`,
                    transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
                <button
                  onClick={() => setOpenId(open ? null : e.id)}
                  className="relative flex w-full items-center gap-4 py-6 text-left md:gap-8 md:py-8"
                >
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[#3f6152] md:text-[10px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <img
                    src={e.image}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="h-12 w-16 shrink-0 object-cover md:hidden"
                    style={{ filter: "saturate(0.35) contrast(1.2) brightness(0.45)" }}
                  />

                  <span className="min-w-0 flex-1">
                    <span className="t-cond block truncate text-[6.6vw] leading-[0.95] text-[#e7f5ee] transition-colors duration-500 group-hover:text-white md:text-[2.9vw]">
                      {e.name}
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[9px] tracking-[0.2em] text-[#688a7c] md:text-[10px]">
                      <span style={{ color: accent }}>{e.stream.toUpperCase()}</span>
                      <span>{e.date}</span>
                      <span className="hidden sm:inline">{e.time}</span>
                      <span className="hidden md:inline">{e.venue}</span>
                    </span>
                  </span>

                  <span className="hidden shrink-0 items-center gap-3 sm:flex">
                    <span className="inline-flex items-center gap-1 rounded border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 font-mono text-[8px] font-bold tracking-[0.16em] uppercase text-amber-300">
                      ★ STARRED
                    </span>
                    <span className="hidden items-center gap-2 lg:flex">
                      <span className="h-[5px] w-[5px] rounded-full" style={{ background: st.color }} />
                      <span className="font-mono text-[9px] tracking-[0.24em]" style={{ color: st.color }}>
                        {st.label}
                      </span>
                    </span>
                  </span>

                  <span
                    className={cn(
                      "shrink-0 font-mono text-[14px] text-[#5b7b6e] transition-transform duration-500",
                      open && "rotate-45",
                    )}
                  >
                    +
                  </span>
                </button>

                <div
                  className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-[800ms]"
                  style={{
                    gridTemplateRows: open ? "1fr" : "0fr",
                    opacity: open ? 1 : 0,
                    transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <div className="min-h-0">
                    <div className="grid gap-6 pb-10 md:grid-cols-[260px_1fr] md:gap-10">
                      <DepthImage src={e.image} alt={e.name} className="aspect-[4/3] w-full" />
                      <div>
                        <p className="max-w-[58ch] text-[13px] leading-relaxed text-[#8faea1] md:text-[14px]">
                          {e.blurb}
                        </p>
                        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                          {[
                            ["DATE", e.date],
                            ["TIME", e.time],
                            ["VENUE", e.venue],
                            ["SEATS", `${e.registered}/${e.seats}`],
                          ].map(([k, v]) => (
                            <div key={k}>
                              <dt className="font-mono text-[8px] tracking-[0.3em] text-[#4f6f61]">{k}</dt>
                              <dd className="mt-1 font-mono text-[11px] tracking-[0.1em] text-[#cfe8dc]">{v}</dd>
                            </div>
                          ))}
                        </dl>
                        <div className="mt-4 h-[3px] w-full max-w-[380px] bg-[rgba(120,160,145,0.14)]">
                          <div
                            className="h-full transition-[width] duration-1000"
                            style={{
                              width: `${Math.min(100, (e.registered / e.seats) * 100)}%`,
                              background: accent,
                              boxShadow: `0 0 12px ${accent}`,
                            }}
                          />
                        </div>
                        <div className="mt-7 flex flex-wrap items-center gap-3">
                          <MagneticButton
                            variant={isRegistered(e.id) ? "ghost" : "solid"}
                            onClick={() => onRegister(e)}
                          >
                            {!regOpen
                              ? "COMING SOON"
                              : isRegistered(e.id)
                              ? "REGISTERED ✓"
                              : "REGISTER"}
                          </MagneticButton>
                          <button
                            onClick={() => toggleSave(e.id)}
                            className="font-mono text-[10px] tracking-[0.26em] text-[#7d9a8d] transition-colors duration-500 hover:text-[#9fe9c6]"
                          >
                            {saved.includes(e.id) ? "SAVED ★" : "SAVE ☆"}
                          </button>
                          <Link
                            href={`/events/${e.id.replace(/^ev-/, "")}`}
                            className="font-mono text-[10px] tracking-[0.2em] text-[#7dffc4] transition hover:underline"
                          >
                            RULEBOOK & DETAILS →
                          </Link>
                          {e.prize && (
                            <span className="font-mono text-[10px] tracking-[0.2em] text-[#f2c98a]">
                              PRIZE {e.prize}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FocusIn>
          );
        })}

        {rows.length === 0 && !featured && (
          <p className="py-20 text-center font-mono text-[11px] tracking-[0.24em] text-[#5b7b6e]">
            NO SIGNAL FOUND — ADJUST THE FILTER.
          </p>
        )}

        {/* Global Archive & Subpage Links */}
        <div className="mt-8 sm:mt-10 flex flex-col gap-6 rounded-xl border border-[rgba(24,196,124,0.18)] bg-[rgba(5,15,10,0.6)] p-6 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] text-[#18c47c]">
              ARCHIVE // 30+ OPERATIONS
            </p>
            <p className="mt-1 font-sans text-sm text-[#cfe8dc]">
              Browse the complete event rulebooks, team loadouts, or view the 3-day timeline.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center border border-[rgba(120,160,145,0.25)] px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-[#cfe8dc] transition-all hover:border-[#18c47c] hover:text-[#18c47c]"
            >
              Full Schedule →
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center border border-[rgba(24,196,124,0.4)] bg-[rgba(24,196,124,0.1)] px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-[#18c47c] transition-all hover:bg-[#18c47c] hover:text-[#030504]"
            >
              All Events Directory →
            </Link>
            {regOpen ? (
              <Link
                href="/register"
                className="inline-flex items-center justify-center bg-[#18c47c] px-5 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#030504] shadow-[0_0_20px_rgba(24,196,124,0.35)] transition-all hover:bg-[#2ee59d]"
              >
                Registration Hub →
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse mr-2" />
                REGISTRATION COMING SOON
              </span>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}
