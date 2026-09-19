"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import TerminalReveal from "@/components/motion/TerminalReveal";
import { Kicker } from "@/components/ui/Elements";

const faqs = [
  {
    question: "What is Vyuham 26?",
    answer:
      "Vyuham 26 is Digital University Kerala's national-level techno-cultural fest. It spans three days of competitions, performances, hackathons, and experiences across four streams: Technology, Culture, Gaming, and Impact.",
  },
  {
    question: "When and where does Vyuham 26 take place?",
    answer:
      "Vyuham 26 runs from October 30 to November 1, 2026, at the Technocity campus in Thiruvananthapuram, Kerala.",
  },
  {
    question: "Who can participate?",
    answer:
      "Vyuham 26 is open to college students across India. Some events may have specific eligibility criteria — check each event's detail page for requirements.",
  },
  {
    question: "How do I register?",
    answer:
      "Registrations will open soon. Follow our social channels and sign up for notifications to be the first to know. Once registration opens, you'll be able to create an account, browse events, and register individually or as a team.",
  },
  {
    question: "Is there a registration fee?",
    answer:
      "Yes, there will be a nominal registration fee. Exact pricing will be announced when registrations open. Some events may have separate entry fees.",
  },
  {
    question: "Can I participate in multiple events?",
    answer:
      "Absolutely! You can register for multiple events as long as there are no scheduling conflicts. The schedule page will help you plan your three days.",
  },
  {
    question: "Is accommodation available?",
    answer:
      "We will provide information about nearby accommodation options for outstation participants. Details will be shared closer to the event date.",
  },
  {
    question: "How do teams work?",
    answer:
      "For team events, one member creates the team and generates an invite code. Other members join using this code. Team sizes vary by event — check each event's detail page.",
  },
  {
    question: "How can I sponsor Vyuham 26?",
    answer:
      "We offer multiple sponsorship tiers with varying benefits. Visit our Contact page or email sponsors@vyuham.duk.ac.in for our sponsorship deck and partnership details.",
  },
  {
    question: "Will there be food available on campus?",
    answer:
      "Yes! A dedicated food court with multiple vendors will be set up on campus. During Phase 3, we'll introduce a digital food coupon system for cashless purchases.",
  },
];

function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-start gap-4 py-6 text-left transition-colors hover:text-green"
        aria-expanded={open}
      >
        <span className="mt-0.5 font-mono text-[10px] text-green/60">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 font-display text-sm font-semibold tracking-tight text-paper md:text-base">
          {question}
        </span>
        <span
          className={`font-mono text-lg text-green transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 pb-6" : "max-h-0"
        }`}
      >
        {open && (
          <p className="pl-10 text-sm leading-[1.8] text-muted">
            <TerminalReveal text={answer} speed={10} />
          </p>
        )}
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-24 md:py-36">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <Kicker>
                <span className="signal-dot" />
                Command terminal
              </Kicker>
              <h1 className="mt-4 font-display text-[clamp(48px,7vw,100px)] font-semibold leading-[0.85]">
                FREQUENTLY <em>ASKED.</em>
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-[1.7] text-muted">
                Quick answers to the most common questions about Vyuham 26.
                Can&apos;t find what you need? Reach out through our{" "}
                <a
                  href="/contact"
                  className="text-green no-underline hover:underline"
                >
                  contact page
                </a>
                .
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.15} className="mt-14 max-w-3xl">
              <div className="border-t border-line">
                {faqs.map((faq, i) => (
                  <FaqItem
                    key={i}
                    question={faq.question}
                    answer={faq.answer}
                    index={i}
                  />
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
