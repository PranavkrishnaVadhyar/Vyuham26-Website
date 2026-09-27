import { useEffect, useRef } from "react";
import { gsap } from "@/lib/anim";
import { useApp } from "@/lib/store";
import { useIsMobile, useReducedMotion } from "@/lib/hooks";
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
          <p className="font-mono text-[10px] tracking-[0.4em] text-[#6f9b89]">
            {d.day} <span className="mx-3 text-[#2e4c40]">/</span> {d.date}
          </p>
          <h3
            className="t-cond mt-4 text-[17vw] leading-[0.8] text-[#f3fbf7] md:text-[9.5vw]"
            style={{ textShadow: `0 0 ${40 + d.intensity * 90}px rgba(24,196,124,${0.12 + d.intensity * 0.3})` }}
          >
            {d.title}
          </h3>
          <p className="t-cond-l mt-5 text-[5.4vw] leading-tight text-[#c3e3d4] md:text-[2.1vw]">{d.statement}</p>
          <p className="mt-5 max-w-[52ch] text-[13px] leading-relaxed text-[#87a498] md:text-[15px]">
            {d.description}
          </p>

          <ul className="mt-9 max-w-[560px] space-y-[10px]">
            {d.beats.map((b) => (
              <li key={b.time} className="group flex items-center gap-4 border-b border-[rgba(120,160,145,0.1)] pb-[10px]">
                <span className="font-mono text-[11px] tracking-[0.18em] text-[#18c47c]">{b.time}</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#8ba79b] md:text-[11px]">
                  {b.label}
                </span>
              </li>
            ))}
          </ul>
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
  const mobile = useIsMobile();

  useEffect(() => {
    const el = wrap.current;
    if (!el || reduced || mobile) return;
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
          { autoAlpha: 0.15, x: 90, filter: "blur(10px)" },
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
  }, [reduced, mobile, days]);

  return (
    <section id="schedule" className="relative w-full">
      <div className="relative z-10 px-6 pt-24 md:px-[10vw]">
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

      {mobile || reduced ? (
        <div className="mt-16">
          {days.map((d, i) => (
            <Panel key={d.id} d={d} i={i} total={days.length} />
          ))}
        </div>
      ) : (
        <div ref={wrap} className="relative mt-16 overflow-hidden">
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
