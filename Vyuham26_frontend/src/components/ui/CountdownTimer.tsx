"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

function getTimeLeft(target: number): TimeLeft {
  const distance = Math.max(0, target - Date.now());

  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance % 86_400_000) / 3_600_000),
    mins: Math.floor((distance % 3_600_000) / 60_000),
    secs: Math.floor((distance % 60_000) / 1_000),
  };
}

export default function CountdownTimer({
  targetDate,
  className = "",
}: CountdownTimerProps) {
  const target = new Date(targetDate).getTime();

  const [time, setTime] = useState<TimeLeft>(() =>
    getTimeLeft(target)
  );

  useEffect(() => {
    const update = () => {
      setTime(getTimeLeft(target));
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [target]);

  const units = [
    { label: "DAYS", value: time.days },
    { label: "HOURS", value: time.hours },
    { label: "MINS", value: time.mins },
    { label: "SECS", value: time.secs },
  ];

  return (
    <div className={`relative ${className}`}>

      {/* SYSTEM LABEL */}
      <div className="mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />

        <span className="font-mono text-[9px] tracking-[0.25em] text-muted">
          FUTURE ACTIVATION
        </span>

        <span className="font-mono text-[8px] tracking-widest text-green/50">
          // TEMPORAL LOCK
        </span>
      </div>

      {/* COUNTDOWN */}
      <div className="flex items-end gap-3 md:gap-5">

        {units.map((unit, i) => (
          <div
            key={unit.label}
            className="flex items-end gap-3 md:gap-5"
          >

            <div className="relative text-center">

              {/* subtle glow behind number */}
              <div className="absolute inset-0 -z-10 blur-xl bg-green/10" />

              <span
                className="
                  block
                  font-mono
                  text-2xl
                  font-medium
                  tracking-[0.08em]
                  text-green
                  tabular-nums
                  md:text-3xl
                "
                suppressHydrationWarning
              >
                {String(unit.value).padStart(2, "0")}
              </span>

              <span
                className="
                  mt-1
                  block
                  font-mono
                  text-[7px]
                  tracking-[0.22em]
                  text-muted
                  md:text-[8px]
                "
              >
                {unit.label}
              </span>

            </div>

            {/* separator */}
            {i < units.length - 1 && (
              <span
                className="
                  mb-4
                  font-mono
                  text-sm
                  text-green/30
                  animate-pulse
                "
              >
                :
              </span>
            )}

          </div>
        ))}

      </div>

      {/* STATUS */}
      <div className="mt-3 flex items-center gap-3">

        <div className="h-px w-8 bg-green/40" />

        <span className="font-mono text-[7px] tracking-[0.2em] text-muted">
          EVENT SIGNAL APPROACHING
        </span>

        <span className="font-mono text-[7px] tracking-widest text-green/60">
          ACTIVE
        </span>

      </div>

    </div>
  );
}