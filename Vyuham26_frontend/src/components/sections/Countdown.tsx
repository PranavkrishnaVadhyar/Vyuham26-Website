import { useMemo } from "react";
import { useApp } from "@/lib/store";
import { useCountdown, useReducedMotion } from "@/lib/hooks";
import { FocusIn } from "@/components/cinematic/Reveal";
import { MagneticButton } from "@/components/cinematic/Interactive";
import { scrollToId } from "@/lib/scroll";

function Digit({ value }: { value: number }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.58em] overflow-hidden align-top">
      <span
        className="absolute inset-x-0 top-0 block will-change-transform"
        style={{
          transform: `translate3d(0, ${-value * 10}%, 0)`,
          transition: "transform 1s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {Array.from({ length: 10 }).map((_, n) => (
          <span key={n} className="flex h-[1em] items-center justify-center leading-none">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

function Unit({ value, label, pad = 2 }: { value: number; label: string; pad?: number }) {
  const digits = String(Math.max(0, value)).padStart(pad, "0").split("").map(Number);
  return (
    <div className="flex flex-col items-center min-w-0 shrink-0">
      <div
        className="t-cond flex text-[10vw] sm:text-[12.5vw] md:text-[7vw] lg:text-[7.8vw] leading-[0.82] text-[#f2fbf6] tracking-tight"
        style={{ textShadow: "0 0 60px rgba(24,196,124,0.25)" }}
      >
        {digits.map((d, i) => (
          <Digit key={i} value={d} />
        ))}
      </div>
      <span className="mt-2.5 sm:mt-3 font-mono text-[7.5px] sm:text-[9px] md:text-[10px] tracking-[0.2em] sm:tracking-[0.28em] md:tracking-[0.36em] text-[#5b7b6e]">
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const { content } = useApp();
  const hp = content.homepage;
  const left = useCountdown(hp.countdownTarget);
  const reduced = useReducedMotion();

  const progress = useMemo(() => {
    const span = 365 * 86400000;
    return Math.min(1, Math.max(0, 1 - left.total / span));
  }, [left.total]);

  return (
    <section id="countdown" className="relative w-full overflow-hidden px-4 sm:px-5 py-24 sm:py-28 md:py-44">
      {/* energy field */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[92vw] max-h-[780px] w-[92vw] max-w-[780px] rounded-full opacity-45"
          style={{
            background: "radial-gradient(circle, rgba(16,140,92,0.35), transparent 62%)",
            filter: "blur(54px)",
          }}
        />
      </div>

      {!reduced && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/* one ring per second — remounted by key to retrigger the pulse */}
          <span
            key={left.seconds}
            className="absolute h-[54vw] max-h-[460px] w-[54vw] max-w-[460px] rounded-full border border-[rgba(24,196,124,0.4)]"
            style={{ animation: "pulseRing 2.4s cubic-bezier(0.16,1,0.3,1) forwards" }}
          />
          <span className="absolute h-[54vw] max-h-[460px] w-[54vw] max-w-[460px] rounded-full border border-[rgba(24,196,124,0.1)]" />
          <span className="absolute h-[74vw] max-h-[640px] w-[74vw] max-w-[640px] rounded-full border border-[rgba(24,196,124,0.06)]" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-[1240px]">
        <p className="eyebrow text-center">07 — COUNTDOWN</p>

        <FocusIn delay={0.05}>
          <h2 className="t-cond-l mt-6 text-center text-[6.4vw] tracking-[0.16em] text-[#c6e5d8] md:text-[2.2vw]">
            THE SIGNAL OPENS
          </h2>
        </FocusIn>

        {/* 4-digit countdown counter — strictly non-wrapping on all mobile screens */}
        <div className="mt-10 sm:mt-14 flex flex-nowrap items-start justify-center gap-2 sm:gap-4 md:gap-7 lg:gap-9">
          <Unit value={left.days} label="DAYS" pad={left.days >= 100 ? 3 : 2} />
          <span className="t-cond flex text-[6.5vw] sm:text-[8vw] md:text-[5.5vw] lg:text-[6.5vw] leading-[0.82] text-[#1e4638] select-none pt-1 sm:pt-1.5 md:pt-2" aria-hidden="true">:</span>
          <Unit value={left.hours} label="HOURS" />
          <span className="t-cond flex text-[6.5vw] sm:text-[8vw] md:text-[5.5vw] lg:text-[6.5vw] leading-[0.82] text-[#1e4638] select-none pt-1 sm:pt-1.5 md:pt-2" aria-hidden="true">:</span>
          <Unit value={left.minutes} label="MINUTES" />
          <span className="t-cond flex text-[6.5vw] sm:text-[8vw] md:text-[5.5vw] lg:text-[6.5vw] leading-[0.82] text-[#1e4638] select-none pt-1 sm:pt-1.5 md:pt-2" aria-hidden="true">:</span>
          <Unit value={left.seconds} label="SECONDS" />
        </div>

        {/* signal strength */}
        <div className="mx-auto mt-16 max-w-[720px]">
          <div className="flex items-center justify-between font-mono text-[8px] tracking-[0.3em] text-[#4f6f61] md:text-[9px]">
            <span>SIGNAL ACQUISITION</span>
            <span>{(progress * 100).toFixed(2)}%</span>
          </div>
          <div className="mt-3 h-[2px] w-full bg-[rgba(120,160,145,0.14)]">
            <div
              className="h-full transition-[width] duration-1000"
              style={{
                width: `${progress * 100}%`,
                background: "linear-gradient(90deg, rgba(11,90,60,0.6), #18c47c)",
                boxShadow: "0 0 16px rgba(24,196,124,0.7)",
              }}
            />
          </div>
          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#8faea1]">
              TARGET · 30 OCT 2026 · 09:00 IST
            </p>
            <MagneticButton onClick={() => scrollToId("events")}>EXPLORE EVENTS</MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
