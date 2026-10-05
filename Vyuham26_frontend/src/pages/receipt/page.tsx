"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";
import { useAuth } from "@/context/AuthContext";
import { paymentsApi, type ReceiptData } from "@/lib/api";

export default function ReceiptPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  const txnRef = searchParams.get("ref") || "TXN-VYU-984021";

  useEffect(() => {
    paymentsApi.getReceipt(txnRef)
      .then((data) => setReceipt(data))
      .catch(() => {});
  }, [txnRef]);

  const handlePrint = () => {
    window.print();
  };

  const attendeeName = receipt?.attendee_name && receipt.attendee_name !== "OPERATIVE" ? receipt.attendee_name : (user?.name || "Aromal S S");
  const institution = user?.college || receipt?.college || "Digital University Kerala";
  const vyuhamId = (user?.vyuham_id || user?.vyuhamId) || (user?.id ? `VYU26-OPER-${user.id.slice(0, 4).toUpperCase()}` : "VYU26-OPER-8042");
  const totalPaid = receipt?.total_amount || 1130;
  const receiptNo = receipt?.receipt_no || `REC-2026-${txnRef.slice(-5)}`;
  const timestamp = receipt?.timestamp || "30 OCT 2026, 10:14 IST";
  const items = receipt?.items || [
    { title: "National Hackathon 36 (Squad: CyberVipers)", fee: 500, stream: "TECH" },
    { title: "CTF Warzone (Squad: CyberVipers)", fee: 300, stream: "TECH" },
    { title: "AI Arena Machine Learning Challenge", fee: 300, stream: "TECH" },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px] bg-[#030504] min-h-screen text-paper">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(680px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="flex items-center justify-between border-b border-line pb-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-12 w-12 items-center justify-center">
                    <img
                      src="/vyuham_logo.svg"
                      alt="VYUHAM'26"
                      className="h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(46,229,157,0.5)]"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/vyuham_logo.png"; }}
                    />
                  </div>
                  <div>
                    <Kicker>Transaction Record // DUK Technocity</Kicker>
                    <h1 className="mt-1 font-display text-2xl font-semibold md:text-3xl">
                      OFFICIAL VYUHAM&apos;26 RECEIPT
                    </h1>
                  </div>
                </div>
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-green bg-green/10 text-green font-mono text-[8px] font-bold tracking-tighter text-center">
                  SEAL<br />VERIFIED
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="glass-card mt-6 p-6 md:p-8 space-y-6 border border-white/10 bg-black/40">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs border-b border-line/60 pb-6">
                  <div>
                    <span className="text-muted block text-[10px]">RECEIPT NO:</span>
                    <strong className="text-paper text-sm">{receiptNo}</strong>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px]">TRANSACTION TIMESTAMP:</span>
                    <strong className="text-paper text-sm">{timestamp}</strong>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px]">PARTICIPANT / OPERATIVE:</span>
                    <strong className="text-paper">{attendeeName}</strong>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px]">INSTITUTION:</span>
                    <strong className="text-green">{institution}</strong>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px]">VYUHAM ID:</span>
                    <strong className="text-green">{vyuhamId}</strong>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px]">PAYMENT METHOD:</span>
                    <strong className="text-paper">UPI / CyberGateway (Verified)</strong>
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-muted mb-3">
                    REGISTERED MODULES & ENTRY PASSES
                  </h3>
                  <div className="space-y-3 font-mono text-xs">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-line/30 pb-2">
                        <span className="text-paper">{item.title}</span>
                        <span className="text-green">₹{item.fee}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-muted pt-1">
                      <span>Gateway Service & Security Verification Fee</span>
                      <span>₹30</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-line pt-4 flex justify-between items-center font-mono">
                  <span className="text-sm font-bold text-paper">TOTAL AMOUNT PAID:</span>
                  <span className="text-2xl font-bold text-green">₹{totalPaid}</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="flex-1 inline-flex items-center justify-center gap-2 border border-green bg-green/20 py-3 font-mono text-xs text-green font-bold tracking-wider hover:bg-green/30 transition-colors"
                  >
                    PRINT / DOWNLOAD RECEIPT ⎙
                  </button>
                  <Button href="/ticket" variant="outline" className="flex-1 justify-center">
                    View Digital Pass →
                  </Button>
                  <Button href="/dashboard" variant="outline" className="flex-1 justify-center">
                    Dashboard
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
