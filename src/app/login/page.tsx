"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("verifying");
    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(480px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="text-center">
                <Kicker>Identity Checkpoint</Kicker>
                <h1 className="mt-3 font-display text-[32px] font-semibold md:text-[42px]">
                  AUTHENTICATE
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Enter your credentials to access the Vyuham command deck.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="glass-card mt-8 p-6 md:p-8">
                {status === "success" ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-green/40 bg-green/10 text-2xl text-green">
                      ✓
                    </div>
                    <h2 className="mt-4 font-display text-xl font-medium">
                      IDENTITY CONFIRMED
                    </h2>
                    <p className="mt-2 text-xs text-muted">
                      Handshake complete. Redirecting to mission deck...
                    </p>
                    <div className="mt-6">
                      <Button href="/dashboard" variant="primary">
                        Enter Dashboard →
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="email"
                        className="block font-mono text-[10px] tracking-wider uppercase text-muted"
                      >
                        COMM IDENTIFIER (EMAIL)
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="operator@duk.ac.in"
                        className="mt-2 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-3 font-mono text-sm text-paper placeholder:text-muted/40 focus:border-green focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="block font-mono text-[10px] tracking-wider uppercase text-muted"
                        >
                          ACCESS CODE (PASSWORD)
                        </label>
                        <a
                          href="#"
                          className="font-mono text-[10px] text-muted hover:text-green"
                        >
                          Reset code?
                        </a>
                      </div>
                      <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="mt-2 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-3 font-mono text-sm text-paper placeholder:text-muted/40 focus:border-green focus:outline-none"
                      />
                    </div>

                    {status === "verifying" && (
                      <div className="flex items-center justify-center gap-3 py-2 font-mono text-xs text-green">
                        <span className="inline-block h-2 w-2 animate-ping rounded-full bg-green" />
                        INITIATING IDENTITY HANDSHAKE...
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full justify-center"
                      disabled={status === "verifying"}
                    >
                      {status === "verifying" ? "VERIFYING..." : "AUTHENTICATE"}
                    </Button>
                  </form>
                )}

                <div className="mt-6 border-t border-line/60 pt-6 text-center font-mono text-xs text-muted">
                  New personnel?{" "}
                  <Link href="/signup" className="text-paper underline hover:text-green">
                    Register credentials
                  </Link>
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
