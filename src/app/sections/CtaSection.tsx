import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";
import { PageEntranceGate } from "@/components/motion/PageEntrance";

export default function CtaSection() {
  return (
    <PageEntranceGate phase="cta">
      <section
        className="relative overflow-hidden bg-gradient-to-r from-[#0c3321] to-[#07150e] py-32"
        id="register"
      >
      {/* Background watermark */}
      <span
        className="pointer-events-none absolute -right-[1%] -bottom-[16%] font-display text-[20vw] font-bold tracking-[-0.1em] text-green/[0.035]"
        aria-hidden="true"
      >
        VYUHAM
      </span>

      <div className="relative z-10 mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
        <AnimatedSection>
          <Kicker>Transmission ready</Kicker>
          <h2 className="mt-7 font-display text-[clamp(45px,6vw,82px)] font-semibold leading-[0.87]">
            ARE YOU READY
            <br />
            TO <em>ENTER?</em>
          </h2>
          <p className="mt-5 text-sm text-muted">
            Registrations open soon. Leave the ordinary at the door.
          </p>
          <div className="mt-7">
            <Button href="/contact">
              Get notified <span className="ml-2 text-base">→</span>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
    </PageEntranceGate>
  );
}
