"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Button } from "@/components/ui/Elements";
import { Event } from "@/data/events";

export default function EventRegistrationForm({ event }: { event: Event }) {
  const reduceMotion = usePrefersReducedMotion();
  const [isTeam, setIsTeam] = useState(true);
  const [teamName, setTeamName] = useState("");
  const [memberCount, setMemberCount] = useState(3);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="glass-card mt-8 p-6 md:p-8">
      {submitted ? (
        <div className="py-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-green/40 bg-green/10 text-2xl text-green">
            ✓
          </div>
          <h2 className="mt-4 font-display text-xl font-medium">
            DEPLOYMENT REGISTERED
          </h2>
          <p className="mt-2 text-xs text-muted">
            Your registration entry for {event.title} has been added to your loadout.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button href="/register" variant="outline">
              Add More Events
            </Button>
            <Button href="/checkout" variant="primary">
              Proceed to Checkout →
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mode Selector */}
          <div>
            <label className="block font-mono text-[10px] tracking-wider uppercase text-muted">
              PARTICIPATION MODE
            </label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsTeam(false)}
                className={`rounded border py-3 font-mono text-xs font-medium transition-all ${
                  !isTeam
                    ? "border-green bg-green/10 text-green"
                    : "border-line bg-ink-mid/40 text-muted"
                }`}
              >
                SOLO OPERATIVE
              </button>
              <button
                type="button"
                onClick={() => setIsTeam(true)}
                className={`rounded border py-3 font-mono text-xs font-medium transition-all ${
                  isTeam
                    ? "border-green bg-green/10 text-green"
                    : "border-line bg-ink-mid/40 text-muted"
                }`}
              >
                SQUAD FORMATION
              </button>
            </div>
          </div>

          {/* Sequential Unfolding Fields */}
          <AnimatePresence initial={false}>
            {isTeam && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, height: 0, scaleY: 0.96 }}
                animate={reduceMotion ? undefined : { opacity: 1, height: "auto", scaleY: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, scaleY: 0.96 }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                style={{ transformOrigin: "top" }}
                className="space-y-4 overflow-hidden rounded border border-green/40 bg-ink-mid/40 p-5"
              >
                <h4 className="font-display text-sm font-semibold text-paper">
                  SQUAD DETAILS
                </h4>
              <div>
                <label
                  htmlFor="teamName"
                  className="block font-mono text-[10px] tracking-wider uppercase text-muted"
                >
                  SQUAD / TEAM NAME
                </label>
                <input
                  id="teamName"
                  type="text"
                  required={isTeam}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. CyberViper Squad"
                  className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper focus:border-green focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="members"
                  className="block font-mono text-[10px] tracking-wider uppercase text-muted"
                >
                  OPERATIVE COUNT (MEMBERS)
                </label>
                <select
                  id="members"
                  value={memberCount}
                  onChange={(e) => setMemberCount(parseInt(e.target.value, 10))}
                  className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper focus:border-green focus:outline-none"
                >
                  <option value={2}>2 Operatives</option>
                  <option value={3}>3 Operatives</option>
                  <option value={4}>4 Operatives</option>
                </select>
              </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label
              htmlFor="leadName"
              className="block font-mono text-[10px] tracking-wider uppercase text-muted"
            >
              LEAD OPERATIVE NAME
            </label>
            <input
              id="leadName"
              type="text"
              required
              placeholder="Arjun V."
              className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper focus:border-green focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="email"
                className="block font-mono text-[10px] tracking-wider uppercase text-muted"
              >
                CONTACT EMAIL
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="arjun@duk.ac.in"
                className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper focus:border-green focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block font-mono text-[10px] tracking-wider uppercase text-muted"
              >
                PHONE NUMBER
              </label>
              <input
                id="phone"
                type="tel"
                required
                placeholder="+91 98765 43210"
                className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper focus:border-green focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-line/60 pt-6 flex items-center justify-between">
            <span className="font-mono text-xs text-muted">
              REGISTRATION FEE: <strong className="text-green">{event.fee}</strong>
            </span>
            <Button type="submit" variant="primary">
              Confirm & Add to Loadout →
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
