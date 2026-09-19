import { Button } from "@/components/ui/Elements";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-green">
        {"// Signal lost"}
      </p>
      <h1 className="mt-4 font-display text-[clamp(80px,15vw,200px)] font-bold leading-none tracking-[-0.08em] text-paper">
        404
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-[1.7] text-muted">
        This dimension doesn&apos;t exist yet. The page you&apos;re looking for may
        have been moved, deleted, or never materialized.
      </p>
      <div className="mt-8">
        <Button href="/">
          Return to base <span className="ml-2 text-base">→</span>
        </Button>
      </div>
    </div>
  );
}
