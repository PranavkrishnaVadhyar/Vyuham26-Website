import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

export default function ConfirmationPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(560px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="glass-card relative overflow-hidden p-8 text-center md:p-10">
                {/* Expanding signal ring animation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-64 w-64 rounded-full border border-green/20 animate-ping" />
                  <div className="absolute h-96 w-96 rounded-full border border-green/10 animate-pulse" />
                </div>

                <div className="relative z-10">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-green bg-green/10 text-3xl text-green shadow-[0_0_30px_rgba(46,229,157,0.3)]">
                    ✓
                  </div>

                  <Kicker className="mt-4">Transmission Confirmed</Kicker>
                  <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
                    MISSION ACCEPTED
                  </h1>
                  <p className="mt-3 text-sm text-muted">
                    Your operative status is activated for Vyuham 26. Access credentials and venue passes have been issued.
                  </p>

                  <div className="mt-6 rounded border border-line bg-ink-mid/60 p-4 font-mono text-xs space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-muted">OPERATIVE:</span>
                      <span className="text-paper">Arjun V. Nair</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">VYUHAM ID:</span>
                      <span className="text-green">VYU26-OPER-8042</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">DATES:</span>
                      <span className="text-paper">30 OCT — 01 NOV 2026</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">VENUE:</span>
                      <span className="text-paper">Technocity, DUK Campus</span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button href="/ticket" variant="primary" className="flex-1 justify-center">
                      View QR Access Pass →
                    </Button>
                    <Button href="/dashboard" variant="outline" className="flex-1 justify-center">
                      Command Deck
                    </Button>
                  </div>
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
