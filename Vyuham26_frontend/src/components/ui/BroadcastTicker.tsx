import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import { announcementsApi, type AnnouncementRecord } from "@/lib/api";

export default function BroadcastTicker({ visible = true }: { visible?: boolean }) {
  const { content } = useApp();
  const [minimized, setMinimized] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [remoteAnnouncements, setRemoteAnnouncements] = useState<AnnouncementRecord[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchBulletins = () => {
      announcementsApi.list()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setRemoteAnnouncements(data);
          }
        })
        .catch(() => {});
    };
    fetchBulletins();
    const poll = setInterval(fetchBulletins, 30000);
    return () => clearInterval(poll);
  }, []);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  const defaultBulletins = [
    {
      id: "b1",
      category: "TRANSMISSION",
      title: "DUK TECHNOCITY // VYUHAM'26 THREE-DAY CONVERGENCE OPENS 30 OCT 2026",
      time: "OFFICIAL FESTIVAL BROADCAST",
      urgent: false,
    },
    {
      id: "b2",
      category: "REGISTRATIONS",
      title: "HACKATHON — 24HR AT 85% CAPACITY — REGISTER SQUADS BEFORE LOCKOUT",
      time: "TECH STREAM // PRIZE POOL ₹30,000",
      urgent: true,
    },
    {
      id: "b3",
      category: "CYBER WARFARE",
      title: "CAPTURE THE FLAG REGISTRATIONS OPEN IN COMPUTER LAB",
      time: "COMPUTER LAB // PRIZE POOL ₹15,000",
      urgent: false,
    },
    {
      id: "b4",
      category: "CAMPUS INTEL",
      title: "FREE CAMPUS SHUTTLES RUNNING FROM KAZHAKKOOTTAM TO TECHNOCITY",
      time: "LOGISTICS // TRANSIT DECK",
      urgent: false,
    },
  ];

  const bulletins =
    remoteAnnouncements.length > 0
      ? remoteAnnouncements.map((a, i) => ({
          id: a.id || `b-${i}`,
          category: a.category || (a.pinned ? "PRIORITY" : "BROADCAST"),
          title: a.title,
          time: a.created_at || "LIVE TRANSMISSION",
          urgent: Boolean(a.urgent || a.pinned),
        }))
      : content.announcements && content.announcements.length > 0
      ? content.announcements.map((a, i) => ({
          id: a.id || `b-${i}`,
          category: a.pinned ? "PRIORITY" : "BROADCAST",
          title: a.title,
          time: a.date || "RECENT INTEL",
          urgent: Boolean(a.pinned),
        }))
      : defaultBulletins;

  useEffect(() => {
    if (bulletins.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bulletins.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [bulletins.length]);

  if (!visible) return null;

  if (minimized) {
    return mounted && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed bottom-4 right-4 z-[95]">
            <button
              onClick={() => setMinimized(false)}
              className="flex items-center gap-2 rounded-full border border-[#18c47c]/30 bg-[#07100c]/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#18c47c] shadow-[0_0_20px_rgba(24,196,124,0.25)] backdrop-blur-md transition-all hover:border-[#18c47c] hover:bg-[#07100c]"
              title="Show Live Festival Ticker"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18c47c] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#18c47c]" />
              </span>
              <span>LIVE INTEL</span>
            </button>
          </div>,
          document.body,
        )
      : null;
  }

  const active = bulletins[currentIndex] || bulletins[0];

  return (
    <>
      <div className="relative z-40 w-full border-b border-[rgba(24,196,124,0.14)] bg-[#030605]/95 backdrop-blur-md">
        <div className="mx-auto flex h-9 max-w-[1680px] items-center justify-between px-4 sm:px-6 md:px-8 xl:px-10">
          <div className="flex flex-1 items-center gap-3 overflow-hidden">
            <div className="flex shrink-0 items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18c47c] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#18c47c]" />
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-[#18c47c]">
                LIVE TRANSMISSION
              </span>
              <span className="hidden font-mono text-[8px] text-white/20 sm:inline">//</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="flex cursor-pointer items-center gap-2 truncate"
                onClick={() => setModalOpen(true)}
              >
                <span
                  className={`rounded-xs px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-wider ${
                    active.urgent
                      ? "border border-red-500/40 bg-red-950/40 text-red-300"
                      : "border border-[#18c47c]/30 bg-[#18c47c]/10 text-[#18c47c]"
                  }`}
                >
                  {active.category}
                </span>
                <span className="truncate font-mono text-[9px] tracking-wide text-[#cfd8d4] hover:text-white sm:text-[10px]">
                  {active.title}
                </span>
                <span className="hidden font-mono text-[8px] text-[#557767] md:inline">
                  [{active.time}]
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex shrink-0 items-center gap-2 pl-3">
            <button
              onClick={() => setModalOpen(true)}
              className="hidden font-mono text-[9px] tracking-[0.16em] text-[#18c47c] hover:underline sm:inline-flex items-center min-h-[28px] px-1.5"
            >
              ALL INTEL ({bulletins.length})
            </button>
            <span className="hidden text-white/20 sm:inline">|</span>
            <button
              onClick={() => setMinimized(true)}
              aria-label="Minimize broadcast ticker"
              className="flex h-7 w-7 min-h-[28px] min-w-[28px] items-center justify-center rounded font-mono text-xs text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              title="Minimize ticker"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Bulletins Modal via Portal to document.body */}
      {mounted && typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {modalOpen && (
                <div
                  className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-3 sm:p-5 backdrop-blur-md"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) setModalOpen(false);
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex flex-col max-h-[85vh] sm:max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-xl border border-[rgba(24,196,124,0.3)] bg-[#07100c]/98 p-5 sm:p-6 md:p-8 shadow-[0_0_50px_rgba(24,196,124,0.18)]"
                  >
                    {/* Modal Header with Close Button */}
                    <div className="flex shrink-0 items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#18c47c] shadow-[0_0_10px_rgba(24,196,124,0.8)] animate-pulse" />
                        <h3 className="font-display text-sm sm:text-xl font-bold tracking-tight text-[#f0f9f5]">
                          CAMPUS BROADCASTS & BULLETIN
                        </h3>
                      </div>
                      <button
                        onClick={() => setModalOpen(false)}
                        aria-label="Close broadcasts modal"
                        className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 font-mono text-[11px] sm:text-xs text-[#9caaa2] transition-colors hover:border-emerald-400 hover:bg-emerald-500/10 hover:text-white"
                      >
                        <span>CLOSE</span>
                        <span className="text-[13px] leading-none">✕</span>
                      </button>
                    </div>

                    {/* Scrollable List */}
                    <div className="mt-4 flex-1 min-h-0 space-y-3 overflow-y-auto pr-1 sm:pr-2">
                      {bulletins.map((b) => (
                        <div
                          key={b.id}
                          className="rounded-lg border border-[rgba(24,196,124,0.14)] bg-[rgba(11,20,16,0.65)] p-3.5 sm:p-4 transition-all hover:border-[rgba(24,196,124,0.35)]"
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`rounded-xs px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider ${
                                b.urgent
                                  ? "border border-red-500/40 bg-red-950/40 text-red-300"
                                  : "border border-[#18c47c]/30 bg-[#18c47c]/10 text-[#18c47c]"
                              }`}
                            >
                              {b.category}
                            </span>
                            <span className="font-mono text-[8px] text-[#557767]">
                              {b.time}
                            </span>
                          </div>
                          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#f0f9f5]">
                            {b.title}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Modal Footer with quick dismiss */}
                    <div className="mt-4 flex shrink-0 items-center justify-between border-t border-white/10 pt-3 font-mono text-[9px] text-[#557767]">
                      <div className="flex flex-col sm:flex-row sm:gap-2">
                        <span>DUK TECHNOCITY FESTIVAL NETWORK</span>
                        <span className="hidden sm:inline">·</span>
                        <span>30 OCT — 01 NOV 2026</span>
                      </div>
                      <button
                        onClick={() => setModalOpen(false)}
                        className="rounded border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 font-mono text-[10px] text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors"
                      >
                        DISMISS ✕
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
