import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/anim";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/utils/cn";

/**
 * A full-bleed cinematic cut between acts: a single line of dialogue over a
 * slow camera drift. Keeps the scroll rhythm from becoming a list of sections.
 *
 * Features:
 * - Well-balanced cinematic height and breathing room
 * - Reliable word-by-word reveal with soft blur and gentle lift
 * - Glowing cyber neon accent on the punchline sentence
 * - Animated accent energy rule with illuminated lead
 * - Pulsing emerald cyber status beacon pill for the act caption
 * - Deep gradient edge dissolves seamlessly merging adjacent sections
 */
export default function Interstitial({
  image,
  line,
  caption,
  align = "center",
  height = "min-h-[46vh] sm:min-h-[52vh] md:min-h-[58vh]",
  className,
}: {
  image: string;
  line: string;
  caption?: string;
  align?: "center" | "left";
  height?: string;
  className?: string;
}) {
  const root = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(false);

  // Split line into individual words, marking the punchline sentence for cyber accenting
  const words = line.split(" ");
  let afterPeriod = false;
  const wordsData = words.map((w, idx) => {
    const isAccent = afterPeriod;
    if (w.includes(".")) {
      afterPeriod = true;
    }
    return { id: idx, word: w, isAccent };
  });

  // IntersectionObserver to trigger smooth animation reliably
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px 40px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Parallax background camera drift
  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".itl-bg",
        { yPercent: -10, scale: 1.14 },
        {
          yPercent: 10,
          scale: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  const on = inView || reduced;

  return (
    <section
      ref={root}
      className={cn(
        "relative w-full overflow-hidden my-6 sm:my-10 md:my-14 py-16 sm:py-20 md:py-24 flex flex-col justify-center",
        height,
        className,
      )}
    >
      {/* Background cinematic media with parallax */}
      <div className="itl-bg absolute inset-0 will-change-transform">
        <img
          src={image}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ filter: "saturate(0.35) contrast(1.25) brightness(0.36)" }}
        />
        {/* Soft gradient dissolve towards top and bottom to seamlessly merge sections */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030504] via-[rgba(2,10,7,0.6)] to-[#030504]" />

        {/* Deep edge shadows */}
        <div className="absolute inset-x-0 top-0 h-20 sm:h-28 bg-gradient-to-b from-[#030504] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-[#030504] to-transparent pointer-events-none" />

        {/* Subtle radial emerald cyber atmospheric glow behind words */}
        <div
          className="absolute inset-0 mix-blend-screen pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(24,196,124,0.18), transparent 70%)",
          }}
        />
        <div className="light-leak absolute inset-0 opacity-40 pointer-events-none" />
      </div>

      {/* Content wrapper with generous, balanced breathing room */}
      <div
        className={cn(
          "relative z-10 flex h-full flex-col justify-center px-6 md:px-[10vw]",
          align === "center" ? "items-center text-center" : "items-start text-left",
        )}
      >
        {/* Accent indicator line with glowing cyber lead */}
        <div
          className={cn(
            "mb-4 sm:mb-6 h-[2px] w-[min(340px,56vw)] bg-gradient-to-r from-[rgba(24,196,124,0.9)] via-[rgba(46,229,157,0.6)] to-transparent shadow-[0_0_12px_rgba(24,196,124,0.5)] will-change-transform",
            align === "center" ? "origin-center" : "origin-left",
          )}
          style={{
            transform: on ? "scaleX(1)" : "scaleX(0)",
            opacity: on ? 1 : 0,
            transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease",
          }}
        />

        {/* Word-by-word kinetic typography reveal */}
        <h3
          className={cn(
            "t-cond-l max-w-[22ch] text-[7.6vw] sm:text-[5.4vw] md:text-[3.2vw] lg:text-[2.8vw] leading-[1.12]",
            align === "center" ? "mx-auto" : "",
          )}
        >
          {wordsData.map(({ id, word, isAccent }) => (
            <span key={id} className="inline-block mr-[0.28em] last:mr-0 align-bottom">
              <span
                className={cn(
                  "inline-block will-change-transform",
                  isAccent
                    ? "text-[#7dffc4] font-medium drop-shadow-[0_0_20px_rgba(24,196,124,0.45)]"
                    : "text-[#e2f3ea]",
                )}
                style={{
                  transform: on ? "translate3d(0, 0, 0)" : "translate3d(0, 22px, 0)",
                  opacity: on ? 1 : 0,
                  filter: on ? "blur(0px)" : "blur(12px)",
                  transition: `transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${
                    0.1 + id * 0.04
                  }s, opacity 0.75s ease ${0.1 + id * 0.04}s, filter 0.75s ease ${0.1 + id * 0.04}s`,
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </h3>

        {/* Caption with cyber status pill */}
        {caption && (
          <div
            className={cn(
              "mt-5 sm:mt-7 inline-flex items-center gap-2.5 rounded-full border border-[#18c47c]/30 bg-[rgba(3,16,11,0.65)] px-3.5 py-1.5 backdrop-blur-md shadow-[0_0_14px_rgba(24,196,124,0.14)] will-change-transform",
              align === "center" ? "mx-auto" : "",
            )}
            style={{
              transform: on ? "translate3d(0, 0, 0)" : "translate3d(0, 16px, 0)",
              opacity: on ? 1 : 0,
              filter: on ? "blur(0px)" : "blur(8px)",
              transition:
                "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.45s, opacity 0.8s ease 0.45s, filter 0.8s ease 0.45s",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18c47c] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#18c47c] shadow-[0_0_8px_#18c47c]" />
            </span>
            <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#7dffc4] sm:text-[10px] md:text-[11px]">
              {caption}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
