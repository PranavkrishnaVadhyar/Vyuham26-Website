import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

export default function ConfirmationPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px] bg-[#030504] min-h-screen text-paper">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(620px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="glass-card relative overflow-hidden border border-emerald-500/20 bg-black/40 p-8 text-center md:p-10">
                {/* Expanding signal ring animation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-64 w-64 rounded-full border border-green/20 animate-ping" />
                  <div className="absolute h-96 w-96 rounded-full border border-green/10 animate-pulse" />
                </div>

                <div className="relative z-10">
                  {/* VYUHAM Logo */}
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center">
                    <img
                      src="/vyuham_logo.svg"
                      alt="VYUHAM'26"
                      className="h-14 w-14 object-contain drop-shadow-[0_0_16px_rgba(46,229,157,0.6)]"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/vyuham_logo.png"; }}
                    />
                  </div>

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-green bg-green/10 text-2xl text-green shadow-[0_0_24px_rgba(46,229,157,0.3)]">
                    ✓
                  </div>

                  <Kicker className="mt-4">Transmission Confirmed</Kicker>
                  <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl text-[#eef8f3]">
                    REGISTRATION CONFIRMED
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Your participant access has been confirmed in the VYUHAM&apos;26 central festival registry. Your digital credentials are valid for event entry.
                  </p>

                  {/* QR Placeholder & Credentials Card */}
                  <div className="mt-6 rounded border border-white/10 bg-black/50 p-6 font-mono text-xs">
                    {/* QR Code visual simulation */}
                    <div className="mx-auto mb-5 flex h-32 w-32 items-center justify-center rounded border border-green/30 bg-black/70 p-2">
                      <div className="grid grid-cols-5 gap-1 w-full h-full p-1 bg-white/5">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-xs ${
                              (i % 2 === 0 || i % 7 === 0) ? "bg-[#2ee59d]" : "bg-transparent"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 text-left border-t border-white/10 pt-4">
                      <div className="flex justify-between">
                        <span className="text-muted">EVENT:</span>
                        <span className="text-[#eef8f3] font-semibold">FLAG HUNT // CTF & 24H HACKATHON</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">PARTICIPANT:</span>
                        <span className="text-[#eef8f3]">AROMAL S. S.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">REGISTRATION ID:</span>
                        <span className="text-green font-bold">VYU26-REG-98042</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">DATES:</span>
                        <span className="text-paper">30 OCT — 01 NOV 2026</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">VENUE:</span>
                        <span className="text-paper">Technocity, Digital University Kerala</span>
                      </div>
                    </div>
                  </div>

                  {/* Required Action CTAs */}
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button href="/ticket" variant="primary" className="flex-1 justify-center">
                      VIEW TICKET →
                    </Button>
                    <Button href="/receipt" variant="outline" className="flex-1 justify-center">
                      DOWNLOAD RECEIPT
                    </Button>
                    <Button href="/dashboard" variant="outline" className="flex-1 justify-center">
                      VIEW DASHBOARD
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
