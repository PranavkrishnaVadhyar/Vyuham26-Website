"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const TITLE = "VYUHAM26";
const YEAR = "";
const PARTICLES = 180;
const FIREFLIES = 55;

export default function VyuhamNaturalCinematic() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);

  const run = () => {
    const root = rootRef.current;
    if (!root) return;

    const q = (s: string) => root.querySelectorAll<HTMLElement>(s);
    gsap.killTweensOf(root.querySelectorAll("*"));

    // ---------------------------------------------------------------
    // NATURAL INITIAL STATE
    // ---------------------------------------------------------------
    gsap.set(q(".nc-sky"), { opacity: 0 });
    gsap.set(q(".nc-mist"), { opacity: 0, scale: 0.8 });
    gsap.set(q(".nc-moon"), { opacity: 0, scale: 0.5, y: 30 });
    gsap.set(q(".nc-glow"), { opacity: 0, scale: 0.4 });
    gsap.set(q(".nc-particle"), { opacity: 0, scale: 0 });
    gsap.set(q(".nc-firefly"), { opacity: 0, scale: 0 });
    gsap.set(q(".nc-wave"), { opacity: 0, scale: 0.2 });
    gsap.set(q(".nc-symbol"), {
      opacity: 0,
      scale: 0.75,
      rotation: -12,
      filter: "blur(8px)",
    });
    gsap.set(q(".nc-logo"), {
      opacity: 0,
      scale: 0.72,
      y: 20,
      filter: "brightness(.2) blur(8px)",
    });
    gsap.set(q(".nc-logo-ring"), { opacity: 0, scale: 0.5 });
    gsap.set(q(".nc-light"), { opacity: 0, xPercent: -120 });
    gsap.set(q(".nc-title"), { opacity: 0, y: 12, scale: 0.97 });
    gsap.set(q(".nc-title-line"), { opacity: 0, scaleX: 0 });
    gsap.set(q(".nc-shuffle-char"), {
      opacity: 0,
      y: 24,
      rotationX: 55,
      filter: "blur(6px)",
    });
    gsap.set(q(".nc-shuffle-char"), { opacity: 0, y: -15, scale: 0.7 });
    gsap.set(q(".nc-subtitle"), { opacity: 0, y: 12 });
    gsap.set(q(".nc-tagline"), { opacity: 0, y: 10 });
    gsap.set(q(".nc-horizon"), { opacity: 0, scaleX: 0 });
    gsap.set(q(".nc-breathe"), { opacity: 0, scale: 0.7 });
    gsap.set(q(".nc-beam"), { opacity: 0, scaleY: 0.2 });
    gsap.set(q(".nc-shooting"), { opacity: 0, xPercent: -140, scaleX: 0.2 });
    gsap.set(q(".nc-orbit"), { opacity: 0, scale: 0.7, rotation: -25 });
    gsap.set(q(".nc-dust"), { opacity: 0, scale: 0.5 });
    gsap.set(q(".nc-logo-shadow"), { opacity: 0, scale: 0.65 });

    const tl = gsap.timeline({
      onComplete: () => setPlaying(false),
    });

    gsap.fromTo(
      q(".nc-camera"),
      { x: -8, y: 4, scale: 1.015 },
      {
        x: 8,
        y: -3,
        scale: 1.035,
        duration: 7.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1,
      }
    );

    // ---------------------------------------------------------------
    // 01 — DARKNESS / FIRST LIGHT
    // ---------------------------------------------------------------
    tl.to(q(".nc-sky"), {
      opacity: 1,
      duration: 1.15,
      ease: "power2.out",
    })
      .to(
        q(".nc-moon"),
        {
          opacity: 0.7,
          scale: 1,
          y: 0,
          duration: 0.95,
          ease: "power2.out",
        },
        "-=1.45"
      )
      .to(
        q(".nc-mist"),
        {
          opacity: 0.8,
          scale: 1,
          duration: 1.05,
          ease: "sine.out",
        },
        "-=1.55"
      )
      .to(
        q(".nc-horizon"),
        {
          opacity: 0.55,
          scaleX: 1,
          duration: 0.85,
          ease: "power2.inOut",
        },
        "-=1.25"
      );

    // ---------------------------------------------------------------
    // 02 — WIND / FLOATING LIGHT
    // ---------------------------------------------------------------
    tl.to(
      q(".nc-firefly"),
      {
        opacity: (i) => 0.18 + (i % 5) * 0.12,
        scale: (i) => 0.5 + (i % 4) * 0.18,
        duration: 0.45,
        stagger: 0.025,
        ease: "sine.out",
      },
      "-=.7"
    )
      .to(
        q(".nc-particle"),
        {
          opacity: (i) => 0.12 + (i % 7) * 0.045,
          scale: (i) => 0.3 + (i % 4) * 0.12,
          duration: 0.5,
          stagger: 0.004,
          ease: "sine.out",
        },
        "-=.45"
      )
      .to(q(".nc-firefly"), {
        x: (i) => Math.sin(i * 1.7) * (30 + (i % 5) * 15),
        y: (i) => -25 - (i % 6) * 15,
        duration: 1.55,
        stagger: 0.018,
        ease: "sine.inOut",
      })
      .to(
        q(".nc-particle"),
        {
          x: (i) => Math.sin(i * 1.31) * (55 + (i % 9) * 16),
          y: (i) => -20 - (i % 8) * 18,
          duration: 0.85,
          stagger: 0.006,
          ease: "sine.inOut",
        },
        "-=2.3"
      );

    // ---------------------------------------------------------------
    // 03 — LIVING ENERGY / BREATH
    // ---------------------------------------------------------------
    tl.to(
      q(".nc-glow"),
      {
        opacity: 0.48,
        scale: 1,
        duration: 0.8,
        ease: "sine.out",
      },
      "-=1.15"
    )
      .to(
        q(".nc-breathe"),
        {
          opacity: 0.32,
          scale: 1,
          duration: 0.5,
          ease: "sine.inOut",
        },
        "-=.8"
      )
      .to(q(".nc-breathe"), {
        scale: 1.18,
        opacity: 0.15,
        duration: 0.85,
        ease: "sine.inOut",
      })
      .to(q(".nc-breathe"), {
        scale: 0.92,
        opacity: 0.34,
        duration: 0.72,
        ease: "sine.inOut",
      });

    // ---------------------------------------------------------------
    // 04 — ORGANIC WAVES
    // ---------------------------------------------------------------
    tl.to(
      q(".nc-wave"),
      {
        opacity: 0.5,
        scale: 1,
        duration: 0.72,
        stagger: 0.16,
        ease: "sine.out",
      },
      "-=1.25"
    )
      .to(q(".nc-wave"), {
        scale: 1.65,
        opacity: 0,
        duration: 0.95,
        stagger: 0.13,
        ease: "sine.out",
      })
      .to(
        q(".nc-firefly"),
        {
          opacity: (i) => (i % 4 === 0 ? 0.65 : 0.25),
          duration: 0.6,
          stagger: 0.02,
          ease: "sine.inOut",
        },
        "-=1.25"
      );

    // ---------------------------------------------------------------
    // 05 — SYMBOL FORMS FROM LIGHT
    // ---------------------------------------------------------------
    tl.to(
      q(".nc-symbol"),
      {
        opacity: 0.35,
        scale: 1,
        rotation: 0,
        filter: "blur(0px)",
        duration: 0.85,
        ease: "power2.out",
      },
      "-=.55"
    )
      .to(
        q(".nc-symbol"),
        {
          scale: 1.08,
          opacity: 0.5,
          duration: 0.72,
          ease: "sine.inOut",
        }
      )
      .to(
        q(".nc-symbol"),
        {
          scale: 0.92,
          opacity: 0.22,
          duration: 0.6,
          ease: "sine.inOut",
        }
      );

    // ---------------------------------------------------------------
    // 05.5 — CAMERA / ATMOSPHERE DETAILS
    // ---------------------------------------------------------------
    tl.to(
      q(".nc-beam"),
      {
        opacity: 0.22,
        scaleY: 1,
        duration: 0.75,
        stagger: 0.08,
        ease: "sine.out",
      },
      "-=.45"
    )
      .to(
        q(".nc-shooting"),
        {
          opacity: 0.8,
          xPercent: 140,
          scaleX: 1,
          duration: 0.8,
          ease: "power2.in",
        },
        "-=.65"
      )
      .to(
        q(".nc-shooting"),
        { opacity: 0, duration: 0.18 },
        "-=.12"
      )
      .to(
        q(".nc-orbit"),
        {
          opacity: 0.38,
          scale: 1,
          rotation: 0,
          duration: 0.7,
          ease: "power2.out",
        },
        "-=.5"
      )
      .to(
        q(".nc-dust"),
        {
          opacity: 0.5,
          scale: 1,
          duration: 0.65,
          ease: "sine.out",
        },
        "-=.55"
      )
      .to(
        q(".nc-dust"),
        {
          scale: 1.5,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=.25"
      );

    // ---------------------------------------------------------------
    // 06 — LIGHT GATHERS INTO THE LOGO
    // ---------------------------------------------------------------
    tl.to(
      q(".nc-particle"),
      {
        x: (i) => {
          const a = (i / PARTICLES) * Math.PI * 2;
          return Math.cos(a) * (10 + (i % 6) * 4);
        },
        y: (i) => {
          const a = (i / PARTICLES) * Math.PI * 2;
          return Math.sin(a) * (10 + (i % 6) * 4);
        },
        opacity: (i) => (i % 3 === 0 ? 0.5 : 0.12),
        duration: 0.85,
        stagger: 0.003,
        ease: "power2.inOut",
      },
      "-=.5"
    )
      .to(
        q(".nc-glow"),
        {
          scale: 1.55,
          opacity: 0.7,
          duration: 0.5,
          ease: "sine.inOut",
        },
        "-=.85"
      )
      .to(
        q(".nc-wave"),
        {
          opacity: 0,
          scale: 2.2,
          duration: 0.8,
          stagger: 0.08,
        },
        "-=.7"
      )
      .to(
        q(".nc-logo-ring"),
        {
          opacity: 0.65,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=.45"
      );

    // ---------------------------------------------------------------
    // 07 — LOGO REVEAL
    // ---------------------------------------------------------------
    tl.to(
      q(".nc-logo-shadow"),
      {
        opacity: 0.55,
        scale: 1,
        duration: 0.55,
        ease: "power2.out",
      },
      "-=.25"
    )
      .to(
        q(".nc-logo"),
      {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "brightness(1) blur(0px)",
          duration: 0.9,
          ease: "expo.out",
        },
        "-=.35"
      )
      .to(
        q(".nc-logo-ring"),
        {
          scale: 1.35,
          opacity: 0,
          duration: 0.72,
          ease: "power2.out",
        },
        "-=.65"
      )
      .to(
        q(".nc-light"),
        {
          opacity: 0.75,
          xPercent: 120,
          duration: 0.9,
          ease: "power2.inOut",
        },
        "-=.55"
      )
      .to(q(".nc-light"), {
        opacity: 0,
        duration: 0.2,
      });

    // ---------------------------------------------------------------
    // 08 — LOGO BREATHES / CAMERA FEEL
    // ---------------------------------------------------------------
    tl.to(q(".nc-logo"), {
      scale: 1.035,
      duration: 0.5,
      ease: "sine.inOut",
    })
      .to(q(".nc-logo"), {
        scale: 0.99,
        duration: 0.72,
        ease: "sine.inOut",
      })
      .to(
        q(".nc-firefly"),
        {
          y: (i) => Math.sin(i * 0.9) * 35,
          x: (i) => Math.cos(i * 0.7) * 50,
          duration: 1.7,
          stagger: 0.012,
          ease: "sine.inOut",
        },
        "-=2"
      );

    // ---------------------------------------------------------------
    // 09 — SIMPLE VYUHAM26 TITLE REVEAL
    // Clean, cinematic, and intentionally restrained.
    // ---------------------------------------------------------------
    tl.to(
      q(".nc-title"),
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=.2"
    )
      .to(
        q(".nc-title-line"),
        {
          opacity: 0.25,
          scaleX: 1,
          duration: 0.45,
          ease: "power2.out",
        },
        "-=.35"
      )
      .to(
        q(".nc-subtitle"),
        {
          opacity: 0.72,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        "-=.18"
      )
      .to(
        q(".nc-tagline"),
        {
          opacity: 0.52,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        "-=.22"
      );

    // ---------------------------------------------------------------
    // 09.5 — FINAL LIGHT PASS
    // ---------------------------------------------------------------
    tl.to(
      q(".nc-final-flare"),
      {
        opacity: 0.7,
        xPercent: 125,
        duration: 0.9,
        ease: "power2.inOut",
      },
      "-=.15"
    )
      .to(
        q(".nc-final-flare"),
        { opacity: 0, duration: 0.2 },
        "-=.12"
      )
      .to(
        q(".nc-logo-shadow"),
        {
          opacity: 0.22,
          scale: 1.06,
          duration: 0.6,
          ease: "sine.out",
        },
        "-=.65"
      );

    // ---------------------------------------------------------------
    // 10 — NATURAL FINAL HOLD
    // ---------------------------------------------------------------
    tl.to(q(".nc-glow"), {
      opacity: 0.42,
      scale: 1.12,
      duration: 0.9,
      ease: "sine.inOut",
      repeat: 2,
      yoyo: true,
    })
      .to(
        q(".nc-logo"),
        {
          scale: 1.018,
          duration: 0.95,
          ease: "sine.inOut",
          repeat: 1,
          yoyo: true,
        },
        "-=3.1"
      )
      .to(
        q(".nc-firefly"),
        {
          opacity: (i) => 0.12 + (i % 4) * 0.07,
          duration: 0.8,
          repeat: 1,
          yoyo: true,
          stagger: 0.02,
          ease: "sine.inOut",
        },
        "-=2.7"
      );

    return tl;
  };

  useEffect(() => {
    if (!playing) return;

    const animation = run();

    return () => {
      animation?.kill();
      if (rootRef.current) {
        gsap.killTweensOf(rootRef.current.querySelectorAll("*"));
      }
    };
  }, [playing]);

  const replay = () => setPlaying(true);

  return (
    <main
      ref={rootRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#030507] text-white"
    >
      {/* --------------------------------------------------------------
          NATURAL CINEMATIC BACKGROUND
      -------------------------------------------------------------- */}
      <div className="nc-camera absolute inset-[-2%]">
      <div className="nc-sky absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(90,210,190,.12),transparent_24%),radial-gradient(circle_at_50%_80%,rgba(240,100,55,.08),transparent_35%),linear-gradient(180deg,#020508_0%,#071316_52%,#030608_100%)]" />

      {/* soft atmospheric mist */}
      <div className="nc-mist pointer-events-none absolute left-1/2 top-[46%] h-[34%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(125,220,202,.09),transparent_68%)] blur-[30px]" />

      {/* distant atmospheric light — intentionally soft/transparent, never a solid orb */}
      <div className="nc-moon pointer-events-none absolute left-[17%] top-[19%] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(190,245,232,.12),rgba(170,230,220,.045)_34%,transparent_70%)] blur-xs" />

      {/* horizon */}

      {/* subtle volumetric light shafts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="nc-beam absolute left-[34%] top-[12%] h-[62%] w-0.5 origin-top rotate-16 bg-linear-to-b from-transparent via-[#a7efe0]/20 to-transparent blur-[5px]" />
        <div className="nc-beam absolute left-[58%] top-[8%] h-[68%] w-0.75 origin-top -rotate-12 bg-linear-to-b from-transparent via-[#f6b38e]/14 to-transparent blur-[7px]" />
        <div className="nc-shooting absolute left-[18%] top-[28%] h-px w-[28%] bg-linear-to-r from-transparent via-white/80 to-transparent blur-[1px]" />
      </div>

      {/* organic dust bloom */}
      <div className="nc-dust pointer-events-none absolute left-1/2 top-[53%] h-[16vw] w-[16vw] max-h-55 max-w-55 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(220,255,247,.22),rgba(117,220,202,.08)_35%,transparent_72%)] blur-xl" />

      {/* subtle film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.28'/%3E%3C/svg%3E\")",
        }}
      />

      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,.78)_100%)]" />

      {/* --------------------------------------------------------------
          PARTICLE ATMOSPHERE
      -------------------------------------------------------------- */}
      <div className="absolute inset-0">
        {Array.from({ length: PARTICLES }).map((_, i) => {
          const a = (i / PARTICLES) * Math.PI * 2;
          const r = 90 + (i % 18) * 18;

          return (
            <span
              key={i}
              className="nc-particle absolute left-1/2 top-[57%] h-0.5 w-0.5 rounded-full bg-[#a6e8db]/70 shadow-[0_0_7px_rgba(166,232,219,.4)]"
              style={{
                transform: `translate(-50%,-50%) translate(${(Math.cos(a) * r).toFixed(2)}px,${(Math.sin(a) * r * 0.55).toFixed(2)}px)`,
              }}
            />
          );
        })}

        {Array.from({ length: FIREFLIES }).map((_, i) => {
          const x = ((i * 37) % 100) - 50;
          const y = ((i * 61) % 64) - 32;

          return (
            <span
              key={i}
              className="nc-firefly absolute left-1/2 top-[52%] h-1 w-1 rounded-full bg-[#c9fff3] shadow-[0_0_10px_rgba(201,255,243,.7)]"
              style={{
                transform: `translate(${x}vw,${y}vh)`,
              }}
            />
          );
        })}
      </div>

      {/* breathing light */}
      <div className="nc-breathe pointer-events-none absolute left-1/2 top-[48%] h-[38vw] w-[38vw] max-h-130 max-w-130 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#79d9c5]/6 blur-[90px]" />

      <div className="nc-glow pointer-events-none absolute left-1/2 top-[49%] h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(148,238,218,.24),rgba(90,210,190,.07)_38%,transparent_70%)] blur-md" />

      {/* --------------------------------------------------------------
          ORGANIC RIPPLE / ENERGY WAVES
      -------------------------------------------------------------- */}
      <div className="absolute left-1/2 top-[49%] h-[55vw] w-[55vw] max-h-175 max-w-175 -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="nc-wave absolute inset-0 rounded-full border border-[#9be8d7]/20"
          />
        ))}
      </div>

      {/* --------------------------------------------------------------
          CENTRAL SYMBOL — subtle, not a giant HUD
      -------------------------------------------------------------- */}
      <div className="nc-symbol pointer-events-none absolute left-1/2 top-[49%] h-[31%] w-[31%] -translate-x-1/2 -translate-y-1/2 rounded-[42%] border border-[#b5eee3]/15 rotate-45">
        <div className="absolute inset-[16%] rounded-[42%] border border-[#f5a06f]/15" />
        <div className="absolute inset-[30%] rounded-full border border-[#b5eee3]/20" />
        <div className="absolute left-1/2 top-1/2 h-[42%] w-px -translate-x-1/2 -translate-y-1/2 bg-linear-to-b from-transparent via-[#d7fff8]/30 to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-px w-[42%] -translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-transparent via-[#f5a06f]/30 to-transparent" />
      </div>

      {/* --------------------------------------------------------------
          LOGO
      -------------------------------------------------------------- */}
      <div className="absolute left-1/2 top-[49%] flex h-[43vw] w-[43vw] max-h-107.5 max-w-107.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        

        {/* glow-only logo shadow — deliberately transparent so no black ball can appear */}
        <div className="nc-logo-shadow pointer-events-none absolute h-[62%] w-[72%] rounded-[45%] bg-[radial-gradient(ellipse,rgba(160,240,224,.20),transparent_68%)] blur-[26px]" />

        <div className="nc-logo absolute flex h-[74%] w-[82%] items-center justify-center">
          <img
            src="/logo1.png"
            alt="VYUHAM26 26"
            className="block max-h-full max-w-full object-contain drop-shadow-[0_0_28px_rgba(180,245,232,.28)]"
          />
        </div>

        {/* natural light passing through the logo */}
        <div className="nc-light pointer-events-none absolute left-[8%] top-[7%] h-[86%] w-px bg-linear-to-b from-transparent via-white/80 to-transparent blur-[.5px] shadow-[0_0_24px_rgba(255,255,255,.55)]" />
        <div className="nc-final-flare pointer-events-none absolute left-[-25%] top-[46%] h-px w-[150%] bg-linear-to-r from-transparent via-white/55 to-transparent blur-[2px]" />
      </div>

      {/* --------------------------------------------------------------
          SIMPLE VYUHAM26 TITLE
      -------------------------------------------------------------- */}
      <div className="nc-title pointer-events-none absolute inset-x-0 bottom-[11%] z-30 flex justify-center">
        <div className="relative w-[min(94vw,1050px)] text-center">

          <div
            className="font-sans text-[clamp(3.2rem,7vw,6.5rem)] font-medium leading-[0.9] tracking-[0.16em] text-red-600"
            style={{
              textShadow: "0 0 10px rgba(255,90,100,.85), 0 0 38px rgba(224,60,75,.45)",
            }}
          >
            VYUHAM'26
          </div>

          <div className="pointer-events-none absolute left-[25%] right-[25%] top-[calc(100%+12px)] h-px overflow-hidden">
            <div className="nc-title-line h-full origin-center bg-linear-to-r from-transparent via-[#ff5147]/35 to-transparent" />
          </div>

          <div className="nc-subtitle mt-6 font-mono text-[8px] font-light tracking-[.34em] text-white/45 md:text-[10px]">
            TECHNOLOGY • CULTURE • GAMING • IMPACT
          </div>

          <div className="nc-tagline mt-3 font-mono text-[9px] font-light tracking-[.44em] text-white/28 md:text-[11px]">
            THE FUTURE AWAITS.
          </div>
        </div>
      </div>

      {/* final cinematic edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%] bg-linear-to-t from-black/45 via-black/10 to-transparent" />

      </div>

      {!playing && (
        <button
          type="button"
          onClick={replay}
          className="absolute bottom-7 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-black/35 px-6 py-2 font-sans text-[9px] tracking-[.28em] text-white/60 backdrop-blur-md transition hover:border-white/30 hover:text-white"
        >
          EXPERIENCE AGAIN
        </button>
      )}
    </main>
  );
}
