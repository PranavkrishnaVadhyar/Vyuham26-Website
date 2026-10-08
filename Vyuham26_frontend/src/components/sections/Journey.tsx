import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/anim";
import { useApp } from "@/lib/store";
import { useReducedMotion } from "@/lib/hooks";
import { FocusIn } from "@/components/cinematic/Reveal";
import type { ScheduleDay } from "@/data/types";

function Panel({ d, i, total }: { d: ScheduleDay; i: number; total: number }) {
  return (
    <article className="panel relative h-[100svh] w-screen shrink-0 overflow-hidden">
      <div className="panel-bg absolute inset-0 will-change-transform">
        <img
          src={d.image}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="h-full w-full scale-110 object-cover"
          style={{
            filter: `saturate(${0.22 + d.intensity * 0.5}) contrast(${1.15 + d.intensity * 0.22}) brightness(${
              0.26 + d.intensity * 0.24
            })`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(2,4,3,0.86) 0%, rgba(3,16,11,${
              0.35 - d.intensity * 0.15
            }) 45%, rgba(2,4,3,0.93) 100%)`,
          }}
        />
        <div
          className="absolute inset-0 mix-blend-screen"
          style={{
            background: `radial-gradient(75% 60% at 50% 70%, rgba(24,196,124,${0.05 + d.intensity * 0.16}), transparent 70%)`,
          }}
        />
      </div>

      {/* intensity ladder */}
      <div className="absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-1 md:flex">
        {Array.from({ length: 18 }).map((_, k) => (
          <span
            key={k}
            className="block h-[3px] w-6"
            style={{
              background: k / 18 < d.intensity ? "rgba(24,196,124,0.85)" : "rgba(120,160,145,0.14)",
              boxShadow: k / 18 < d.intensity ? "0 0 10px rgba(24,196,124,0.55)" : "none",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-[10vw]">
        <div className="panel-copy max-w-[820px]">
          <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.35em] sm:tracking-[0.4em] text-[#6f9b89]">
            {d.day} <span className="mx-2 sm:mx-3 text-[#2e4c40]">/</span> {d.date}
          </p>
          <h3
            className="t-cond mt-2 sm:mt-4 text-[14vw] sm:text-[17vw] md:text-[9.5vw] leading-[0.8] text-[#f3fbf7]"
            style={{ textShadow: `0 0 ${40 + d.intensity * 90}px rgba(24,196,124,${0.12 + d.intensity * 0.3})` }}
          >
            {d.title}
          </h3>
          <p className="t-cond-l mt-2.5 sm:mt-5 text-[4.8vw] sm:text-[5.4vw] md:text-[2.1vw] leading-tight text-[#c3e3d4]">{d.statement}</p>
          <p className="mt-2.5 sm:mt-5 max-w-[52ch] text-[12px] sm:text-[13px] md:text-[15px] leading-relaxed text-[#87a498]">
            {d.description}
          </p>

          <ul className="mt-4 sm:mt-9 max-w-[560px] space-y-2 sm:space-y-[10px]">
            {d.beats.map((b) => (
              <li key={b.time} className="group flex items-center gap-3 sm:gap-4 border-b border-[rgba(120,160,145,0.1)] pb-1.5 sm:pb-[10px]">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.18em] text-[#18c47c]">{b.time}</span>
                <span className="font-mono text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.18em] sm:tracking-[0.2em] text-[#8ba79b]">
                  {b.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 sm:mt-8">
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 border border-[#18c47c]/30 bg-[#18c47c]/10 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[#7dffc4] transition hover:bg-[#18c47c] hover:text-[#030504]"
            >
              EXPLORE {d.day} SCHEDULE & EVENTS →
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 font-mono text-[9px] tracking-[0.3em] text-[#3f6152] md:bottom-10 md:right-10">
        {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </article>
  );
}

export default function Journey() {
  const { content } = useApp();
  const days = content.schedule;
  const wrap = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = wrap.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      const track = el.querySelector<HTMLElement>(".track");
      if (!track) return;
      const panels = gsap.utils.toArray<HTMLElement>(".panel", track);

      const sweep = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((p) => {
        gsap.fromTo(
          p.querySelector(".panel-bg"),
          { xPercent: 12, scale: 1.05 },
          {
            xPercent: -12,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: p,
              containerAnimation: sweep,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
        gsap.fromTo(
          p.querySelector(".panel-copy"),
          { autoAlpha: 0.15, x: 50, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            x: 0,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: p,
              containerAnimation: sweep,
              start: "left 85%",
              end: "left 25%",
              scrub: true,
            },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, days]);

  return (
    <section id="schedule" className="relative w-full">
      <div className="relative z-10 flex flex-col justify-between gap-6 px-6 pt-10 sm:pt-14 md:pt-18 md:flex-row md:items-end md:px-[10vw]">
        <div>
          <p className="eyebrow">03 — THE JOURNEY</p>
          <FocusIn delay={0.05}>
            <h2 className="t-cond mt-4 text-[12vw] leading-[0.84] text-[#f0f9f5] md:text-[6vw]">
              IGNITION <span className="text-[#2c4a3e]">→</span> CONVERGENCE{" "}
              <span className="text-[#2c4a3e]">→</span> <span className="text-[#18c47c]">AFTERSHOCK</span>
            </h2>
          </FocusIn>
          <p className="mt-5 max-w-[56ch] text-[13px] leading-relaxed text-[#7d9a8d] md:text-[15px]">
            Three days engineered as one continuous escalation. Each stage burns hotter than the last.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/schedule"
            className="inline-flex items-center justify-center border border-[#18c47c]/40 bg-[#18c47c]/10 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-[#18c47c] transition-all hover:bg-[#18c47c] hover:text-[#030504]"
          >
            Full Timeline / Schedule →
          </Link>
        </div>
      </div>

      {reduced ? (
        <div className="mt-8 sm:mt-10 md:mt-12">
          {days.map((d, i) => (
            <Panel key={d.id} d={d} i={i} total={days.length} />
          ))}
        </div>
      ) : (
        <div ref={wrap} className="relative mt-8 sm:mt-10 md:mt-12 overflow-hidden">
          <div className="track flex w-max will-change-transform">
            {days.map((d, i) => (
              <Panel key={d.id} d={d} i={i} total={days.length} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
