import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

export default function ReceiptPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(640px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <Kicker>Transaction Record</Kicker>
                  <h1 className="mt-1 font-display text-2xl font-semibold md:text-3xl">
                    OFFICIAL RECEIPT
                  </h1>
                </div>
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-green bg-green/10 text-green font-mono text-[9px] font-bold tracking-tighter text-center">
                  SEAL<br />VERIFIED
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="glass-card mt-6 p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4 font-mono text-xs border-b border-line/60 pb-6">
                  <div>
                    <span className="text-muted block">RECEIPT NO:</span>
                    <strong className="text-paper">REC-2026-90421</strong>
                  </div>
                  <div>
                    <span className="text-muted block">DATE:</span>
                    <strong className="text-paper">30 OCT 2026, 10:14 IST</strong>
                  </div>
                  <div>
                    <span className="text-muted block">PAYER:</span>
                    <strong className="text-paper">Arjun V. Nair</strong>
                  </div>
                  <div>
                    <span className="text-muted block">VYUHAM ID:</span>
                    <strong className="text-green">VYU26-OPER-8042</strong>
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-muted mb-3">
                    ITEMS REGISTERED
                  </h3>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between border-b border-line/30 pb-2">
                      <span className="text-paper">National Hackathon (Squad: CyberVipers)</span>
                      <span className="text-green">₹500</span>
                    </div>
                    <div className="flex justify-between border-b border-line/30 pb-2">
                      <span className="text-paper">CTF Warzone (Squad: CyberVipers)</span>
                      <span className="text-green">₹300</span>
                    </div>
                    <div className="flex justify-between border-b border-line/30 pb-2">
                      <span className="text-paper">Battle of the Bands</span>
                      <span className="text-green">₹400</span>
                    </div>
                    <div className="flex justify-between text-muted pt-1">
                      <span>Gateway Service Fee</span>
                      <span>₹30</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-line pt-4 flex justify-between items-center font-mono">
                  <span className="text-sm font-bold text-paper">TOTAL PAID:</span>
                  <span className="text-xl font-bold text-green">₹1,230</span>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button href="/dashboard" variant="outline" className="flex-1 justify-center">
                    Go to Dashboard
                  </Button>
                  <Button href="/ticket" variant="primary" className="flex-1 justify-center">
                    View Digital Pass →
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
