import { useApp } from "@/lib/store";
import { team } from "@/data/content";
import { CharReveal, FocusIn, MaskReveal } from "@/components/cinematic/Reveal";

export default function About() {
  const { content } = useApp();
  const hp = content.homepage;

  return (
    <section id="about" className="relative w-full px-5 py-28 md:px-[6vw] md:py-44">
      <div className="mx-auto max-w-[1100px]">
        <p className="eyebrow text-center">06 — ABOUT</p>

        <h2 className="t-cond mt-8 text-center text-[22vw] leading-[0.78] text-[#f4fcf8] md:text-[13vw]">
          <CharReveal text={hp.brand} stagger={0.045} />
          <span className="align-super text-[0.32em] text-[#18c47c]">{hp.year}</span>
        </h2>

        <div className="mx-auto mt-10 h-px w-[min(520px,70vw)] bg-gradient-to-r from-transparent via-[rgba(24,196,124,0.55)] to-transparent" />

        <FocusIn delay={0.1}>
          <p className="t-cond-l mx-auto mt-12 max-w-[26ch] text-center text-[6vw] leading-[1.18] text-[#d5ece1] md:max-w-[22ch] md:text-[2.9vw]">
            {hp.about}
          </p>
        </FocusIn>

        <MaskReveal delay={0.2}>
          <p className="mx-auto mt-10 max-w-[58ch] text-center text-[13px] leading-relaxed text-[#7d9a8d] md:text-[15px]">
            {hp.aboutSupport}
          </p>
        </MaskReveal>

        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-[rgba(120,160,145,0.14)] pt-12 md:grid-cols-4">
          {hp.stats.map((s, i) => (
            <FocusIn key={s.label} delay={i * 0.06} className="text-center">
              <div className="t-cond text-[11vw] leading-none text-[#eaf7f0] md:text-[3.4vw]">{s.value}</div>
              <div className="mt-2 font-mono text-[8px] tracking-[0.32em] text-[#557767] md:text-[9px]">
                {s.label}
              </div>
            </FocusIn>
          ))}
        </div>

        <div className="mt-24">
          <p className="eyebrow text-center">THE CORE</p>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3">
            {team.map((m, i) => (
              <FocusIn key={m.id} delay={i * 0.04} y={16} blur={6}>
                <div className="border-t border-[rgba(120,160,145,0.14)] pt-4">
                  <p className="t-mid text-[14px] tracking-[0.06em] text-[#dff0e7] md:text-[16px]">{m.name}</p>
                  <p className="mt-1 font-mono text-[9px] tracking-[0.26em] text-[#18c47c]">{m.role}</p>
                  <p className="mt-[3px] font-mono text-[8px] tracking-[0.26em] text-[#4f6f61]">{m.dept}</p>
                </div>
              </FocusIn>
            ))}
          </div>
        </div>

        {/* sponsors */}
        <div className="mt-24">
          <p className="eyebrow text-center">BACKED BY</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {content.sponsors.map((s, i) => (
              <FocusIn key={s.id} delay={i * 0.03} y={12} blur={5}>
                <div className="group text-center" title={s.note}>
                  <p className="t-wide text-[15px] tracking-[0.14em] text-[#9db9ad] transition-colors duration-700 group-hover:text-[#e9f8f1] md:text-[19px]">
                    {s.name}
                  </p>
                  <p className="mt-1 font-mono text-[8px] tracking-[0.28em] text-[#3f6152]">
                    {s.tier.toUpperCase()}
                  </p>
                </div>
              </FocusIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
