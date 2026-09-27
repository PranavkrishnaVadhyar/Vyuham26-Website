import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center bg-[#030504] overflow-hidden">
      {/* Background glow and grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(46,229,157,.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46,229,157,.4) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />

      {/* Subtle VYUHAM Logo */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="relative h-16 w-16 opacity-60">
          <img
            src="/vyuham_logo.svg"
            alt="VYUHAM'26"
            className="h-full w-full object-contain filter drop-shadow-[0_0_20px_rgba(24,196,124,0.4)]"
            onError={(e) => { (e.target as HTMLImageElement).src = "/vyuham_logo.png"; }}
          />
        </div>
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#18c47c] animate-pulse">
        {"// SIGNAL LOST — ROUTE NOT FOUND"}
      </p>

      <h1 className="mt-4 font-display text-[clamp(90px,18vw,220px)] font-bold leading-none tracking-[-0.08em] text-[#eef8f3] drop-shadow-[0_0_40px_rgba(24,196,124,0.15)]">
        404
      </h1>

      <div className="mt-2 font-mono text-[10px] tracking-[0.24em] text-[#5d7e71]">
        SYSTEM COORDINATES INVALID // NODE UNREACHABLE
      </div>

      <p className="mt-4 max-w-md text-sm leading-[1.8] text-[#8ea499]">
        The requested system coordinate has not materialized or was purged from the neural mesh. Re-align with the central VYUHAM core.
      </p>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#18c47c] text-[#030504] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#2ee59d] hover:shadow-[0_0_20px_rgba(24,196,124,0.4)] transition-all"
        >
          <span>RETURN TO HOME</span>
          <span>→</span>
        </Link>
      </div>

      {/* Navigation hint */}
      <div className="mt-12 font-mono text-[9px] tracking-[0.2em] text-[#4f6f61]">
        PRESS <kbd className="border border-[#4f6f61]/40 px-1 py-0.5 rounded text-emerald-400">Ctrl + K</kbd> FOR QUICK NAVIGATION
      </div>
    </div>
  );
}
