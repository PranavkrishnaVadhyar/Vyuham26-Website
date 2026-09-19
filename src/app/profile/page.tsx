"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button, StreamBadge } from "@/components/ui/Elements";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Arjun V. Nair",
    email: "arjun.n24@duk.ac.in",
    college: "Digital University Kerala",
    phone: "+91 98470 12345",
    degree: "M.Tech Cyber Security",
    year: "2024–2026",
    vyuhamId: "VYU26-OPER-8042",
  });

  const [saved, setSaved] = useState(false);

  // Calculate completion percentage based on filled fields
  const fields = [
    profile.name,
    profile.email,
    profile.college,
    profile.phone,
    profile.degree,
    profile.year,
  ];
  const filledCount = fields.filter((f) => f.trim().length > 0).length;
  const completionPercent = Math.round((filledCount / fields.length) * 100);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1000px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <Kicker>Personnel Record</Kicker>
                  <h1 className="mt-2 font-display text-[32px] font-semibold md:text-[44px]">
                    OPERATIVE PROFILE
                  </h1>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs text-muted">
                  <span>VYUHAM ID:</span>
                  <span className="rounded bg-ink-mid px-3 py-1 text-green border border-green/30">
                    {profile.vyuhamId}
                  </span>
                </div>
              </div>
            </AnimatedSection>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Profile Ring & Card */}
              <AnimatedSection delay={0.1}>
                <div className="glass-card flex flex-col items-center p-8 text-center">
                  {/* Completion Ring */}
                  <div className="relative flex h-32 w-32 items-center justify-center">
                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-line"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-green transition-all duration-1000 ease-out"
                        fill="transparent"
                        strokeDasharray="264"
                        strokeDashoffset={264 - (264 * completionPercent) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-mono text-2xl font-bold text-paper">
                        {completionPercent}%
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-muted">
                        RECORD
                      </span>
                    </div>
                  </div>

                  <h2 className="mt-4 font-display text-xl font-semibold">{profile.name}</h2>
                  <p className="mt-1 font-mono text-xs text-muted">{profile.college}</p>

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <StreamBadge stream="tech" />
                    <span className="rounded border border-line bg-ink-mid px-2.5 py-0.5 font-mono text-[10px] text-paper">
                      VERIFIED OPERATIVE
                    </span>
                  </div>

                  <div className="mt-6 w-full border-t border-line/60 pt-6 space-y-3 text-left">
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-muted">Registered Events:</span>
                      <span className="text-paper font-semibold">3 Events</span>
                    </div>
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-muted">Teams Joined:</span>
                      <span className="text-paper font-semibold">2 Squads</span>
                    </div>
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-muted">QR Pass Status:</span>
                      <span className="text-green font-semibold">ACTIVE</span>
                    </div>
                  </div>

                  <div className="mt-6 w-full">
                    <Button href="/ticket" variant="outline" className="w-full justify-center">
                      View QR Ticket ↗
                    </Button>
                  </div>
                </div>
              </AnimatedSection>

              {/* Form Fields */}
              <AnimatedSection delay={0.2} className="lg:col-span-2">
                <div className="glass-card p-6 md:p-8">
                  <h3 className="font-display text-lg font-medium border-b border-line pb-4">
                    PERSONNEL DOSSIER DETAILS
                  </h3>

                  <form onSubmit={handleSave} className="mt-6 space-y-5">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="block font-mono text-[10px] tracking-wider uppercase text-muted"
                        >
                          OPERATIVE NAME
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper focus:border-green focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block font-mono text-[10px] tracking-wider uppercase text-muted"
                        >
                          COMM ADDRESS (EMAIL)
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper focus:border-green focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="college"
                          className="block font-mono text-[10px] tracking-wider uppercase text-muted"
                        >
                          INSTITUTION / CAMPUS
                        </label>
                        <input
                          id="college"
                          type="text"
                          value={profile.college}
                          onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                          className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper focus:border-green focus:outline-none"
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
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper focus:border-green focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="degree"
                          className="block font-mono text-[10px] tracking-wider uppercase text-muted"
                        >
                          DEGREE / PROGRAM
                        </label>
                        <input
                          id="degree"
                          type="text"
                          value={profile.degree}
                          onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                          className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper focus:border-green focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="year"
                          className="block font-mono text-[10px] tracking-wider uppercase text-muted"
                        >
                          ACADEMIC BATCH
                        </label>
                        <input
                          id="year"
                          type="text"
                          value={profile.year}
                          onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                          className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper focus:border-green focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-line/60 pt-6">
                      {saved ? (
                        <span className="font-mono text-xs text-green">
                          ✓ Dossier record updated & saved.
                        </span>
                      ) : (
                        <span className="font-mono text-xs text-muted">
                          Last updated: 2 mins ago
                        </span>
                      )}
                      <Button type="submit" variant="primary">
                        Save Record
                      </Button>
                    </div>
                  </form>
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
