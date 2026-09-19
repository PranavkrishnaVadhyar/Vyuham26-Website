"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    tier: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In Phase 2, this would hit an API endpoint
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClasses =
    "w-full bg-ink-light border border-line rounded-sm px-4 py-3 text-sm text-paper placeholder:text-muted/50 focus:outline-none focus:border-green/50 focus:ring-1 focus:ring-green/20 transition-all font-body";

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-24 md:py-36">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <Kicker>
                <span className="signal-dot" />
                Secure transmission
              </Kicker>
              <h1 className="mt-4 font-display text-[clamp(48px,7vw,100px)] font-semibold leading-[0.85]">
                GET IN <em>TOUCH.</em>
              </h1>
            </AnimatedSection>

            <div className="mt-16 grid gap-16 md:grid-cols-[1.2fr_0.8fr]">
              {/* Form */}
              <AnimatedSection delay={0.1}>
                {submitted ? (
                  <div className="glass-card flex min-h-[400px] items-center justify-center rounded-sm p-12 text-center">
                    <div>
                      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-green/10">
                        <span className="text-3xl text-green">✓</span>
                      </div>
                      <h2 className="font-display text-2xl font-semibold text-paper">
                        Transmission sent.
                      </h2>
                      <p className="mt-3 text-sm text-muted">
                        We&apos;ll be in touch soon. Keep an eye on your inbox.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block font-mono text-[9px] uppercase tracking-[0.14em] text-muted"
                        >
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className={inputClasses}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="organization"
                          className="mb-2 block font-mono text-[9px] uppercase tracking-[0.14em] text-muted"
                        >
                          Organization
                        </label>
                        <input
                          type="text"
                          id="organization"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          className={inputClasses}
                          placeholder="Company or institution"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block font-mono text-[9px] uppercase tracking-[0.14em] text-muted"
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className={inputClasses}
                          placeholder="you@example.com"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-2 block font-mono text-[9px] uppercase tracking-[0.14em] text-muted"
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={inputClasses}
                          placeholder="+91 ..."
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="tier"
                        className="mb-2 block font-mono text-[9px] uppercase tracking-[0.14em] text-muted"
                      >
                        Sponsorship tier interest
                      </label>
                      <select
                        id="tier"
                        name="tier"
                        value={formData.tier}
                        onChange={handleChange}
                        className={inputClasses}
                      >
                        <option value="">Select a tier (optional)</option>
                        <option value="title">Title Sponsor</option>
                        <option value="gold">Gold Sponsor</option>
                        <option value="silver">Silver Sponsor</option>
                        <option value="community">Community Partner</option>
                        <option value="other">Other / General Enquiry</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block font-mono text-[9px] uppercase tracking-[0.14em] text-muted"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className={`${inputClasses} resize-none`}
                        placeholder="Tell us about your interest..."
                      />
                    </div>

                    <Button type="submit" variant="primary">
                      Send transmission{" "}
                      <span className="ml-2 text-base">→</span>
                    </Button>
                  </form>
                )}
              </AnimatedSection>

              {/* Contact info */}
              <AnimatedSection delay={0.2}>
                <div className="space-y-6">
                  <div className="glass-card rounded-sm p-6">
                    <Kicker>{"// General enquiries"}</Kicker>
                    <a
                      href="mailto:techfest@duk.ac.in"
                      className="mt-3 block text-sm text-paper no-underline transition-colors hover:text-green"
                    >
                      techfest@duk.ac.in
                    </a>
                  </div>

                  <div className="glass-card rounded-sm p-6">
                    <Kicker>{"// Sponsorship enquiries"}</Kicker>
                    <a
                      href="mailto:sponsors@vyuham.duk.ac.in"
                      className="mt-3 block text-sm text-paper no-underline transition-colors hover:text-green"
                    >
                      sponsors@vyuham.duk.ac.in
                    </a>
                  </div>

                  <div className="glass-card rounded-sm p-6">
                    <Kicker>{"// Location"}</Kicker>
                    <p className="mt-3 text-sm leading-[1.7] text-muted">
                      Digital University Kerala
                      <br />
                      Technocity Campus
                      <br />
                      Thiruvananthapuram, Kerala 695317
                    </p>
                  </div>

                  <div className="glass-card rounded-sm p-6">
                    <Kicker>{"// Social channels"}</Kicker>
                    <div className="mt-3 flex gap-4">
                      {["Instagram", "Twitter", "LinkedIn", "YouTube"].map(
                        (platform) => (
                          <a
                            key={platform}
                            href="#"
                            className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-green"
                          >
                            {platform}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
