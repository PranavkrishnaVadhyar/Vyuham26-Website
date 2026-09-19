"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { PageEntranceGate } from "@/components/motion/PageEntrance";

const stats = [
  { value: 30, suffix: "+", label: "Events" },
  { value: 4, suffix: "", label: "Streams" },
  { value: 3, suffix: "", label: "Days" },
  { value: null, display: "∞", label: "Possibilities" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref}>
      <strong className="font-display text-[clamp(35px,4vw,55px)] font-medium tracking-[-0.07em]">
        {String(count).padStart(2, "0")}
        {suffix && <span className="text-green">{suffix}</span>}
      </strong>
    </div>
  );
}

export default function StatsBar() {
  return (
    <PageEntranceGate phase="stats">
      <section
        className="border-t border-b border-line bg-ink-light"
        aria-label="Festival statistics"
      >
      <div className="mx-auto grid w-[min(1200px,calc(100%-64px))] grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="border-r border-line py-7 text-center last:border-r-0 max-md:[&:nth-child(2)]:border-r-0 max-md:[&:nth-child(n+3)]:border-t max-md:[&:nth-child(n+3)]:border-line"
          >
            {stat.value !== null ? (
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            ) : (
              <strong className="font-display text-[clamp(35px,4vw,55px)] font-medium tracking-[-0.07em]">
                {stat.display}
              </strong>
            )}
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
    </PageEntranceGate>
  );
}
