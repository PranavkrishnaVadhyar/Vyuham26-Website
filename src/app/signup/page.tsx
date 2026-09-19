"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState<"idle" | "registering" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("registering");
    setTimeout(() => {
      setStatus("success");
    }, 1400);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(560px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="text-center">
                <Kicker>Identity Checkpoint</Kicker>
                <h1 className="mt-3 font-display text-[32px] font-semibold md:text-[42px]">
                  REGISTER CREDENTIALS
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Create your Vyuham operative account for event registration and pass generation.
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
                      PERSONNEL RECORD CREATED
                    </h2>
                    <p className="mt-2 text-xs text-muted">
                      Identity handshake verified. Your Vyuham ID has been provisioned.
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                      <Button href="/profile" variant="outline">
                        View Profile
                      </Button>
                      <Button href="/register" variant="primary">
                        Event Registration →
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="block font-mono text-[10px] tracking-wider uppercase text-muted"
                        >
                          FULL NAME
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Arjun V."
                          className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper placeholder:text-muted/40 focus:border-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block font-mono text-[10px] tracking-wider uppercase text-muted"
                        >
                          CONTACT NUMBER
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper placeholder:text-muted/40 focus:border-green focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block font-mono text-[10px] tracking-wider uppercase text-muted"
                      >
                        EMAIL ADDRESS (INSTITUTION / PERSONAL)
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="operator@university.edu"
                        className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper placeholder:text-muted/40 focus:border-green focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="college"
                        className="block font-mono text-[10px] tracking-wider uppercase text-muted"
                      >
                        COLLEGE / INSTITUTION
                      </label>
                      <input
                        id="college"
                        type="text"
                        required
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        placeholder="Digital University Kerala"
                        className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper placeholder:text-muted/40 focus:border-green focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="password"
                          className="block font-mono text-[10px] tracking-wider uppercase text-muted"
                        >
                          ACCESS CODE
                        </label>
                        <input
                          id="password"
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="••••••••••••"
                          className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper placeholder:text-muted/40 focus:border-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block font-mono text-[10px] tracking-wider uppercase text-muted"
                        >
                          CONFIRM CODE
                        </label>
                        <input
                          id="confirmPassword"
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="••••••••••••"
                          className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper placeholder:text-muted/40 focus:border-green focus:outline-none"
                        />
                      </div>
                    </div>

                    {status === "registering" && (
                      <div className="flex items-center justify-center gap-3 py-2 font-mono text-xs text-green">
                        <span className="inline-block h-2 w-2 animate-ping rounded-full bg-green" />
                        PROVISIONING OPERATIVE CREDENTIALS...
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      className="mt-2 w-full justify-center"
                      disabled={status === "registering"}
                    >
                      {status === "registering" ? "PROVISIONING..." : "CREATE ACCOUNT"}
                    </Button>
                  </form>
                )}

                <div className="mt-6 border-t border-line/60 pt-6 text-center font-mono text-xs text-muted">
                  Already registered?{" "}
                  <Link href="/login" className="text-paper underline hover:text-green">
                    Authenticate identity
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
