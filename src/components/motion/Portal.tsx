"use client";

import { motion } from "framer-motion";

interface PortalProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { wrap: 280, portal: 180, inner: 144, core: "inset-[38%]" },
  md: { wrap: 420, portal: 270, inner: 215, core: "inset-[39%]" },
  lg: { wrap: 575, portal: 360, inner: 286, core: "inset-[39%]" },
};

export default function Portal({ className = "", size = "lg" }: PortalProps) {
  const s = sizes[size];

  return (
    <div
      className={`relative grid place-items-center ${className}`}
      style={{ width: s.wrap, height: s.wrap }}
      aria-hidden="true"
    >
      {/* Orbits */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="absolute border border-green/20 rounded-full"
        style={{
          width: s.wrap * 0.92,
          height: s.wrap * 0.33,
          transform: "rotateX(66deg) rotateZ(25deg)",
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute border border-green/20 rounded-full"
        style={{
          width: s.wrap * 0.75,
          height: s.wrap * 0.8,
          transform: "rotateX(66deg) rotateZ(-35deg)",
        }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute border border-dashed border-green/15 rounded-full"
        style={{
          width: s.wrap * 0.89,
          height: s.wrap * 0.89,
        }}
      />

      {/* Outer spinning ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="rounded-full"
        style={{
          width: s.portal,
          height: s.portal,
          padding: s.portal * 0.072,
          background:
            "conic-gradient(from 90deg, transparent 0 12%, rgba(200,255,66,0.75) 18%, transparent 26% 43%, #1f6a42 51%, transparent 62% 75%, rgba(200,255,66,0.4) 84%, transparent 92%)",
          filter: "drop-shadow(0 0 26px rgba(104,255,132,0.25))",
        }}
      >
        <div className="h-full w-full rounded-full bg-ink" />
      </motion.div>

      {/* Inner portal */}
      <div
        className="absolute overflow-hidden rounded-full"
        style={{
          width: s.inner,
          height: s.inner,
          background:
            "radial-gradient(circle at 48% 46%, #74ff91 0 2%, #1d9d56 3%, #0d3826 21%, #07140d 60%)",
          boxShadow:
            "inset 0 0 38px #06100b, 0 0 70px rgba(52,255,116,0.25)",
        }}
      >
        {/* Rotating conic patterns */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-[20%]"
          style={{
            background:
              "repeating-conic-gradient(from 20deg, transparent 0 14deg, rgba(200,255,66,0.16) 15deg 16deg, transparent 17deg 30deg)",
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 17, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-[20%] opacity-50"
          style={{
            background:
              "repeating-conic-gradient(from 20deg, transparent 0 14deg, rgba(200,255,66,0.16) 15deg 16deg, transparent 17deg 30deg)",
          }}
        />

        {/* Glowing core */}
        <div
          className={`absolute ${s.core} z-10 rounded-full bg-green`}
          style={{
            boxShadow: "0 0 30px 14px rgba(200,255,66,0.56)",
          }}
        />
      </div>

      {/* Labels */}
      <span className="absolute top-[12%] left-[10%] font-mono text-[10px] tracking-[0.15em] text-green">
        SIGNAL FOUND
      </span>
      <span className="absolute right-[10%] bottom-[14%] font-mono text-[10px] tracking-[0.15em] text-green">
        V.26 // 2026
      </span>
    </div>
  );
}
