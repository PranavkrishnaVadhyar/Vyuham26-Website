import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker } from "@/components/ui/Elements";
import { toast } from "@/components/ui/Toaster";

interface CertificateItem {
  id: string;
  event: string;
  stream: string;
  participantName: string;
  role: string;
  status: "ISSUED & VERIFIED" | "IN RECTIFICATION";
  date: string;
}

export default function CertificatesPage() {
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const certificates: CertificateItem[] = [
    {
      id: "CERT-VYU-90421",
      event: "Hackathon — 24HR",
      stream: "TECH",
      participantName: "Aromal S S",
      role: "1ST PLACE WINNER",
      status: "ISSUED & VERIFIED",
      date: "01 NOV 2026",
    },
    {
      id: "CERT-VYU-90422",
      event: "Capture the Flag",
      stream: "TECH",
      participantName: "Aromal S S",
      role: "RUNNER-UP SQUAD",
      status: "ISSUED & VERIFIED",
      date: "31 OCT 2026",
    },
    {
      id: "CERT-VYU-90423",
      event: "Prompt War",
      stream: "TECH",
      participantName: "Aromal S S",
      role: "MERIT OF PARTICIPATION",
      status: "ISSUED & VERIFIED",
      date: "31 OCT 2026",
    },
    {
      id: "CERT-VYU-90424",
      event: "Best Manager",
      stream: "MANAGEMENT",
      participantName: "Aromal S S",
      role: "FINALIST",
      status: "ISSUED & VERIFIED",
      date: "30 OCT 2026",
    },
  ];

  const handleDownload = (cert: CertificateItem) => {
    toast(`Exporting verified certificate ${cert.id}...`);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px] bg-[#030504] min-h-screen text-paper">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1080px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-6 gap-4">
                <div>
                  <Kicker>Credential Verification Vault</Kicker>
                  <h1 className="mt-2 font-display text-[32px] font-semibold md:text-[44px]">
                    OFFICIAL CERTIFICATES
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Cryptographically authenticated festival credentials for Digital University Kerala&apos;s VYUHAM&apos;26.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-green">
                  <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
                  <span>ISSUING AUTHORITY: DUK TECHNOCITY</span>
                </div>
              </div>
            </AnimatedSection>

            {/* Certificate Roster Grid */}
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {certificates.map((cert) => (
                <AnimatedSection key={cert.id}>
                  <div className="glass-card relative overflow-hidden border border-white/10 bg-black/40 p-6 md:p-8 transition-all hover:border-green/40">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src="/vyuham_logo.svg"
                          alt="VYUHAM'26"
                          className="h-8 w-8 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/vyuham_logo.png"; }}
                        />
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-green">
                            {cert.stream} STREAM
                          </span>
                          <h3 className="font-display text-lg font-bold text-[#eef8f3]">
                            {cert.event}
                          </h3>
                        </div>
                      </div>
                      <span className="inline-block border border-green/30 bg-green/10 px-2 py-0.5 font-mono text-[8px] text-green">
                        {cert.status}
                      </span>
                    </div>

                    <div className="mt-5 space-y-1.5 border-t border-white/10 pt-4 font-mono text-xs text-muted">
                      <div className="flex justify-between">
                        <span>PARTICIPANT:</span>
                        <strong className="text-paper">{cert.participantName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>CITATION:</span>
                        <span className="text-green font-semibold">{cert.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CERTIFICATE ID:</span>
                        <span className="text-white/60">{cert.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CONFERRED DATE:</span>
                        <span>{cert.date}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="flex-1 border border-white/20 py-2.5 font-mono text-xs text-paper hover:bg-white/5 transition-colors"
                      >
                        VIEW CREDENTIAL
                      </button>
                      <button
                        onClick={() => handleDownload(cert)}
                        className="flex-1 border border-green bg-green/20 py-2.5 font-mono text-xs font-bold text-green hover:bg-green/30 transition-colors"
                      >
                        DOWNLOAD PDF ↓
                      </button>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Detailed Certificate Modal View */}
            {selectedCert && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
                <div className="relative max-w-2xl w-full border-2 border-green/50 bg-[#06100b] p-8 md:p-12 text-center rounded shadow-[0_0_50px_rgba(46,229,157,0.2)]">
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="absolute right-4 top-4 text-muted hover:text-white font-mono text-xs"
                  >
                    ✕ CLOSE
                  </button>

                  <div className="border border-green/30 p-6 md:p-8 rounded">
                    <img
                      src="/vyuham_logo.svg"
                      alt="VYUHAM'26"
                      className="mx-auto h-12 w-12 object-contain mb-3 drop-shadow-[0_0_12px_rgba(46,229,157,0.6)]"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/vyuham_logo.png"; }}
                    />
                    <span className="font-mono text-[10px] tracking-widest text-green block uppercase">
                      DIGITAL UNIVERSITY KERALA // VYUHAM&apos;26
                    </span>

                    <h2 className="mt-4 font-display text-2xl font-bold tracking-wide md:text-3xl text-paper">
                      CERTIFICATE OF EXCELLENCE
                    </h2>

                    <p className="mt-3 font-mono text-xs text-muted">THIS IS OFFICIALLY PRESENTED TO</p>

                    <h3 className="mt-2 font-display text-3xl font-bold text-green border-b border-green/30 pb-2 inline-block">
                      {selectedCert.participantName}
                    </h3>

                    <p className="mt-3 font-mono text-xs text-muted max-w-md mx-auto">
                      FOR VALIANT ACHIEVEMENT AS <strong className="text-paper">{selectedCert.role}</strong> IN{" "}
                      <span className="text-green">{selectedCert.event}</span> AT TECHNOCITY KERALA.
                    </p>

                    <div className="mt-8 flex justify-between items-end font-mono text-[9px] text-muted border-t border-line/60 pt-3">
                      <span>VERIFIED ID: {selectedCert.id}</span>
                      <span>DATES: 30 OCT — 01 NOV 2026</span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center gap-4">
                    <button
                      onClick={() => handleDownload(selectedCert)}
                      className="border border-green bg-green/20 px-6 py-2.5 font-mono text-xs font-bold text-green hover:bg-green/30"
                    >
                      EXPORT OFFICIAL VECTOR PDF ↓
                    </button>
                    <button
                      onClick={() => setSelectedCert(null)}
                      className="border border-white/20 px-6 py-2.5 font-mono text-xs text-paper hover:bg-white/5"
                    >
                      DISMISS
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
