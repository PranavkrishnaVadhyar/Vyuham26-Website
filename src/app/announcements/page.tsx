"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker } from "@/components/ui/Elements";

export default function AnnouncementsFeedPage() {
  const reduceMotion = usePrefersReducedMotion();
  const notices = [
    {
      id: "1",
      priority: "HIGH BROADCAST",
      title: "CTF Warzone Round 2 Opening Shifted to 11:30 AM",
      time: "10 mins ago",
      stream: "TECH",
      content: "All registered CTF teams please report to Cyber Range by 11:15 AM for network credential allocation.",
    },
    {
      id: "2",
      priority: "STANDARD",
      title: "Food Court Shuttle Bus Operating Schedule",
      time: "1 hour ago",
      stream: "GENERAL",
      content: "Shuttles run every 15 minutes between the DUK Main Academic Block and the Technocity Food Court.",
    },
    {
      id: "3",
      priority: "ALERT",
      title: "Battle of the Bands Sound Check Open",
      time: "2 hours ago",
      stream: "CULTURE",
      content: "Stage A sound checks start at 03:00 PM. Team leads bring stage technical riders.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1000px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-line pb-6">
                <div>
                  <Kicker>Priority Broadcast</Kicker>
                  <h1 className="mt-2 font-display text-[36px] font-semibold md:text-[52px]">
                    ANNOUNCEMENTS <em>FEED</em>
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Official live broadcasts, schedule updates, and emergency festival notices.
                  </p>
                </div>
                <div className="font-mono text-xs text-green">
                  ● SIGNAL STREAM: LIVE
                </div>
              </div>
            </AnimatedSection>

            {/* Broadcast Ribbons */}
            <div className="mt-8 space-y-4">
              {notices.map((notice, idx) => (
                <AnimatedSection key={notice.id} delay={0.05 * idx}>
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, x: -32 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 26, delay: reduceMotion ? 0 : 0.1 + idx * 0.08 }}
                    className={`glass-card p-6 border-l-4 border-r border-t border-b transition-all hover:border-green/40 ${
                      notice.priority === "ALERT" ? "border-l-amber-400" : "border-l-green"
                    } border-line`}
                  >
                    <div className="flex justify-between items-center font-mono text-xs">
                      <span className="flex items-center gap-2">
                        <span className="flex h-2 w-2 items-center justify-center">
                          <span className={`h-2 w-2 rounded-full ${notice.priority === "ALERT" ? "bg-amber-400" : "bg-green"} animate-pulse`} />
                        </span>
                        <span className={notice.priority === "ALERT" ? "text-amber-400 font-bold" : "text-green font-bold"}>
                          {notice.priority}
                        </span>
                      </span>
                      <span className="text-muted">{notice.time}</span>
                    </div>

                    <h3 className="mt-3 font-display text-xl font-bold text-paper">
                      {notice.title}
                    </h3>
                    <p className="mt-2 font-mono text-xs text-muted leading-relaxed">
                      {notice.content}
                    </p>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
