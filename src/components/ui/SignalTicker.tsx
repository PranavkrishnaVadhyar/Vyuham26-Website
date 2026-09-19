const signals = [
  "/// SCROLL TO CONTINUE",
  "/// VYUHAM '26 REGISTRATIONS LIVE",
  "/// OCTOBER 30 — NOVEMBER 01, 2026",
  "/// INNOVATE - BUILD - CONQUER",
];

export default function SignalTicker() {
  const content = signals.join("   ");
  return (
    <section className="overflow-hidden border-y border-line bg-paper py-2.5" aria-label="Festival highlights">
      <div className="signal-ticker-track flex w-max items-center gap-12 font-mono text-[11px] font-bold tracking-[0.2em] text-ink uppercase">
        <span>{content}</span>
        <span aria-hidden="true">{content}</span>
      </div>
    </section>
  );
}
