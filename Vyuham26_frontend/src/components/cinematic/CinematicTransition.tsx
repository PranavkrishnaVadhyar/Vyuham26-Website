import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks";

interface TransitionProps {
  routeKey: string;
  children: ReactNode;
}

export default function CinematicTransition({ routeKey, children }: TransitionProps) {
  const reduced = useReducedMotion();
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setScanning(true);
    const timer = setTimeout(() => setScanning(false), 450);
    return () => clearTimeout(timer);
  }, [routeKey]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Top green signal scanning line */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0.95 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-[120] h-[2px] origin-left bg-gradient-to-r from-emerald-500 via-[#2ee59d] to-emerald-300 shadow-[0_0_16px_rgba(46,229,157,0.9)] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Cyber radar scan beam */}
      <AnimatePresence>
        {scanning && !reduced && (
          <motion.div
            initial={{ top: "-10%", opacity: 0.4 }}
            animate={{ top: "110%", opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "linear" }}
            className="fixed inset-x-0 h-28 pointer-events-none z-[115] bg-gradient-to-b from-transparent via-[rgba(46,229,157,0.08)] to-transparent"
          />
        )}
      </AnimatePresence>

      {/* Coordinated Page Transition with Exit Animations */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={routeKey}
          initial={{
            opacity: 0,
            y: reduced ? 0 : 8,
            filter: reduced ? "none" : "blur(4px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            y: reduced ? 0 : -8,
            filter: reduced ? "none" : "blur(4px)",
          }}
          transition={{
            duration: 0.26,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
