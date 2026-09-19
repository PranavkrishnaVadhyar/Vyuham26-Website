import AnimatedSection from "@/components/motion/AnimatedSection";
import StreamSignalMap from "@/components/motion/StreamSignalMap";
import { Kicker, TextLink } from "@/components/ui/Elements";
import { PageEntranceGate } from "@/components/motion/PageEntrance";

export default function AboutSection() {
  return (
    <PageEntranceGate phase="about">
      <section
        className="border-b border-line py-24 md:py-36"
        id="about"
      >
      <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
        <AnimatedSection>
          <Kicker>01 / Mission brief</Kicker>
        </AnimatedSection>

        <div className="mt-9 grid gap-16 md:grid-cols-2 md:items-end">
          <AnimatedSection>
            <h2 className="font-display text-[clamp(45px,6vw,82px)] font-semibold leading-[0.87]">
              WHERE
              <br />
              IDEAS <em>SHIFT</em>
              <br />
              REALITY.
            </h2>
            <p className="mt-8 max-w-md text-sm leading-[1.8] text-muted">
              Vyuham is a meeting point for technology, culture and unfiltered
              imagination. Three days of competition, collaboration and things
              that refuse to stay inside a box.
            </p>
            <div className="mt-7">
              <TextLink href="/about">Discover Vyuham</TextLink>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <StreamSignalMap />
          </AnimatedSection>
        </div>
      </div>
    </section>
    </PageEntranceGate>
  );
}
