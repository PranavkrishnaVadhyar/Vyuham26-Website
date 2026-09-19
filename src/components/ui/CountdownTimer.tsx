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
  const [time, setTime] = useState<TimeLeft>(getTimeLeft(target));

  useEffect(() => {
    const timeout = setTimeout(() => setTime(getTimeLeft(target)), 0);
    const interval = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [target]);

  const units = [
    { label: "DAYS", value: time.days },
    { label: "HOURS", value: time.hours },
    { label: "MINS", value: time.mins },
    { label: "SECS", value: time.secs },
  ];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3">
          <div className="text-center">
            <span
              className="block font-mono text-sm font-medium tracking-wider text-green tabular-nums md:text-base"
              suppressHydrationWarning
            >
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="block font-mono text-[8px] tracking-[0.14em] text-muted">
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="font-mono text-xs text-muted/50">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
