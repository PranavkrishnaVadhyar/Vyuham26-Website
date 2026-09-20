"use client";

import { motion } from "framer-motion";

interface PortalProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: {
    wrap: 280,
    portal: 180,
    inner: 144,
    core: "inset-[38%]",
  },
  md: {
    wrap: 420,
    portal: 270,
    inner: 215,
    core: "inset-[39%]",
  },
  lg: {
    wrap: 575,
    portal: 360,
    inner: 286,
    core: "inset-[39%]",
  },
};

export default function Portal({
  className = "",
  size = "lg",
}: PortalProps) {
  const s = sizes[size];

  return (
    <div
      className={`relative grid place-items-center ${className}`}
      style={{
        width: s.wrap,
        height: s.wrap,
      }}
      aria-hidden="true"
    >
      {/* =========================================================
          DIMENSIONAL ORBITS
          ========================================================= */}

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute rounded-full border border-emerald-400/15"
        style={{
          width: s.wrap * 0.92,
          height: s.wrap * 0.33,
          transform:
            "rotateX(66deg) rotateZ(25deg)",
          transformStyle: "preserve-3d",
        }}
      />

      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute rounded-full border border-green/15"
        style={{
          width: s.wrap * 0.75,
          height: s.wrap * 0.8,
          transform:
            "rotateX(66deg) rotateZ(-35deg)",
          transformStyle: "preserve-3d",
        }}
      />

      {/* Outer orbital tracking ring */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 48,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute rounded-full border border-dashed border-emerald-400/10"
        style={{
          width: s.wrap * 0.89,
          height: s.wrap * 0.89,
        }}
      />

      {/* =========================================================
          OUTER ENERGY CONTAINMENT RING
          ========================================================= */}

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative rounded-full"
        style={{
          width: s.portal,
          height: s.portal,
          padding:
            s.portal * 0.072,

          background:
            `
            conic-gradient(
              from 90deg,
              transparent 0 10%,
              rgba(52, 211, 153, 0.08) 14%,
              rgba(52, 211, 153, 0.8) 19%,
              transparent 27% 41%,
              rgba(16, 185, 129, 0.65) 48%,
              rgba(52, 211, 153, 0.12) 53%,
              transparent 61% 74%,
              rgba(52, 211, 153, 0.55) 82%,
              transparent 91%
            )
            `,

          filter:
            "drop-shadow(0 0 22px rgba(16,185,129,0.22))",
        }}
      >
        <div className="h-full w-full rounded-full bg-ink" />
      </motion.div>

      {/* =========================================================
          SECONDARY ENERGY RING
          ========================================================= */}

      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute rounded-full"
        style={{
          width: s.portal * 0.91,
          height: s.portal * 0.91,

          background:
            `
            conic-gradient(
              from 210deg,
              transparent 0 20%,
              rgba(52,211,153,0.28) 24%,
              transparent 29% 47%,
              rgba(16,185,129,0.4) 52%,
              transparent 58% 78%,
              rgba(52,211,153,0.18) 82%,
              transparent 88%
            )
            `,

          maskImage:
            "radial-gradient(transparent 66%, black 67%, black 69%, transparent 70%)",

          WebkitMaskImage:
            "radial-gradient(transparent 66%, black 67%, black 69%, transparent 70%)",
        }}
      />

      {/* =========================================================
          INNER PORTAL
          ========================================================= */}

      <div
        className="absolute overflow-hidden rounded-full"
        style={{
          width: s.inner,
          height: s.inner,

          background:
            `
            radial-gradient(
              circle at 48% 46%,
              #d1fae5 0%,
              #6ee7b7 1.8%,
              #34d399 4%,
              #087f52 12%,
              #06452f 25%,
              #071c13 55%,
              #030b07 78%
            )
            `,

          boxShadow:
            `
            inset 0 0 38px rgba(1,12,7,0.95),
            inset 0 0 80px rgba(16,185,129,0.16),
            0 0 45px rgba(16,185,129,0.18),
            0 0 100px rgba(52,211,153,0.08)
            `,
        }}
      >
        {/* =====================================================
            ROTATING DIMENSIONAL GRID
            ===================================================== */}

        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-[-20%]"
          style={{
            background:
              `
              repeating-conic-gradient(
                from 20deg,
                transparent 0 13deg,
                rgba(52,211,153,0.12) 14deg 15deg,
                transparent 16deg 30deg
              )
              `,
          }}
        />

        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-[-20%] opacity-50"
          style={{
            background:
              `
              repeating-conic-gradient(
                from 20deg,
                transparent 0 24deg,
                rgba(16,185,129,0.11) 25deg 26deg,
                transparent 27deg 45deg
              )
              `,
          }}
        />

        {/* =====================================================
            CORE PULSE
            ===================================================== */}

        <motion.div
          className={`absolute ${s.core} z-10 rounded-full`}
          animate={{
            scale: [0.88, 1.04, 0.88],
            opacity: [0.72, 1, 0.72],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background:
              "radial-gradient(circle, #ecfdf5 0%, #6ee7b7 22%, #10b981 55%, #047857 100%)",

            boxShadow:
              `
              0 0 18px 6px rgba(52,211,153,0.55),
              0 0 42px 14px rgba(16,185,129,0.25)
              `,
          }}
        />

        {/* Core highlight */}
        <div
          className="absolute left-1/2 top-1/2 z-20 h-[7%] w-[7%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-50"
          style={{
            boxShadow:
              "0 0 18px 6px rgba(236,253,245,0.65)",
          }}
        />
      </div>

      {/* =========================================================
          SCAN ARC
          ========================================================= */}

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute rounded-full"
        style={{
          width: s.inner * 1.08,
          height: s.inner * 1.08,

          background:
            `
            conic-gradient(
              from 0deg,
              transparent 0deg,
              transparent 300deg,
              rgba(52,211,153,0.7) 330deg,
              transparent 350deg
            )
            `,

          maskImage:
            "radial-gradient(transparent 48%, black 49%, black 51%, transparent 52%)",

          WebkitMaskImage:
            "radial-gradient(transparent 48%, black 49%, black 51%, transparent 52%)",
        }}
      />

      {/* =========================================================
          TELEMETRY LABELS
          ========================================================= */}

      <span className="absolute left-[10%] top-[12%] font-mono text-[9px] tracking-[0.16em] text-emerald-400/80">
        SIGNAL // FOUND
      </span>

      <span className="absolute bottom-[14%] right-[10%] font-mono text-[9px] tracking-[0.16em] text-emerald-400/70">
        V.26 // 2026
      </span>

      <span className="absolute bottom-[25%] left-[18%] font-mono text-[7px] tracking-[0.18em] text-emerald-400/35">
        CORE // ACTIVE
      </span>
    </div>
  );
}