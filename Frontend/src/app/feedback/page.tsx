"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

export default function FeedbackSurveyPage() {
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(560px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="text-center">
                <Kicker>Debrief Console</Kicker>
                <h1 className="mt-2 font-display text-[32px] font-semibold md:text-[42px]">
                  FESTIVAL FEEDBACK
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Share your debrief rating and feedback to help shape future Vyuham editions.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="glass-card mt-8 p-6 md:p-8">
                {submitted ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-green/40 bg-green/10 text-2xl text-green">
                      ✓
                    </div>
                    <h2 className="mt-4 font-display text-xl font-medium">
                      DEBRIEF SUBMITTED
                    </h2>
                    <p className="mt-2 text-xs text-muted">
                      Thank you for contributing to Vyuham 26 operations.
                    </p>
                    <div className="mt-6">
                      <Button href="/" variant="primary">
                        Return Home →
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between font-mono text-xs text-muted border-b border-line pb-3">
                      <span>DEBRIEF STEP {step} / 2</span>
                      <span className="text-green">● CONSOLE ACTIVE</span>
                    </div>

                    {step === 1 ? (
                      <div className="space-y-4">
                        <label className="block font-mono text-xs text-paper">
                          OVERALL FESTIVAL EXPERIENCE RATING (1 to 5)
                        </label>
                        <div className="flex justify-between gap-2">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setRating(num)}
                              className={`flex-1 rounded border py-3 font-mono text-lg font-bold transition-all ${
                                rating === num
                                  ? "border-green bg-green/10 text-green"
                                  : "border-line bg-ink-mid/40 text-muted"
                              }`}
                            >
                              ★ {num}
                            </button>
                          ))}
                        </div>

                        <div className="pt-4 flex justify-end">
                          <Button type="button" onClick={() => setStep(2)} variant="primary">
                            Next Step →
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <label className="block font-mono text-xs text-paper">
                          FEEDBACK & SUGGESTIONS (OPTIONAL)
                        </label>
                        <textarea
                          rows={4}
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          placeholder="Tell us what you loved or how we can improve venue navigation, food courts, or workshops..."
                          className="w-full rounded border border-line bg-ink-mid/60 p-3 font-mono text-sm text-paper focus:border-green focus:outline-none"
                        />

                        <div className="flex justify-between pt-2">
                          <Button type="button" onClick={() => setStep(1)} variant="outline">
                            ← Back
                          </Button>
                          <Button type="submit" variant="primary">
                            Submit Feedback →
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
