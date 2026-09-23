"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

export default function CertificateGeneratorPage() {
  const recipient = "Aromal S S";
  const award = "1ST PLACE WINNER — NATIONAL HACKATHON";

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(840px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="text-center">
                <Kicker>Achievement Forge</Kicker>
                <h1 className="mt-2 font-display text-[32px] font-semibold md:text-[42px]">
                  CERTIFICATE GENERATOR
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Official digital achievement certificate generated for Vyuham 26 winners and participants.
                </p>
              </div>
            </AnimatedSection>

            {/* Certificate Canvas Mockup */}
            <AnimatedSection delay={0.15}>
              <div className="glass-card mt-8 relative overflow-hidden border-2 border-green/50 p-8 text-center md:p-12 shadow-[0_0_40px_rgba(46,229,157,0.1)]">
                <div className="border border-line p-8 md:p-10 rounded">
                  <span className="font-mono text-xs text-green tracking-widest block uppercase">
                    DIGITAL UNIVERSITY KERALA — VYUHAM &apos;26
                  </span>

                  <h2 className="mt-6 font-display text-2xl font-bold tracking-wide md:text-3xl text-paper">
                    CERTIFICATE OF ACHIEVEMENT
                  </h2>

                  <p className="mt-4 font-mono text-xs text-muted">THIS IS PROUDLY PRESENTED TO</p>

                  <h3 className="mt-3 font-display text-3xl font-bold text-green border-b border-green/30 pb-2 inline-block">
                    {recipient}
                  </h3>

                  <p className="mt-4 font-mono text-xs text-muted max-w-md mx-auto">
                    FOR OUTSTANDING PERFORMANCE AND SECURING <strong className="text-paper">{award}</strong> AT VYUHAM 26.
                  </p>

                  <div className="mt-10 flex justify-between items-end font-mono text-[10px] text-muted border-t border-line/60 pt-4">
                    <span>VERIFIED CERTIFICATE ID: CERT-VYU-90421</span>
                    <span>30 OCT — 01 NOV 2026</span>
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                  <Button
                    onClick={() => alert("Downloading official vector PDF certificate...")}
                    variant="primary"
                  >
                    Export Vector PDF ↓
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
