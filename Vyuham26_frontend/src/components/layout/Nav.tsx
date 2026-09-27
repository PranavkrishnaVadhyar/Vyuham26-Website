import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { homepage, navLinks } from "@/data/content";
import { useApp } from "@/lib/store";
import { scrollToId, scrollToTop } from "@/lib/scroll";
import { startAmbience, stopAmbience } from "@/lib/sound";
import BroadcastTicker from "@/components/ui/BroadcastTicker";

export default function Nav({ visible = true }: { visible?: boolean }) {
  const { user, ui } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let ticking = false;

    const updateScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      const diff = currentScrollY - lastScrollY;

      // Always show navbar near the top of page
      if (currentScrollY <= 40) {
        setHidden(false);
        setScrolled(false);
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      setScrolled(true);

      // Require a threshold of 8px to prevent jitter from micro-scrolls
      const threshold = 8;
      if (Math.abs(diff) >= threshold) {
        if (diff > 0) {
          // Scrolling down -> hide navbar
          setHidden(true);
        } else {
          // Scrolling up -> show navbar
          setHidden(false);
        }
        lastScrollY = currentScrollY;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const readActive = () => {
      const h = window.location.hash.replace(/^#\/?/, "").split("?")[0].split("/")[0];
      const p = window.location.pathname.replace(/^\//, "").split("?")[0].split("/")[0];
      const match = h || p || "home";
      if (navLinks.some((l) => l.id === match)) {
        setActive(match);
      }
      setHidden(false);
    };
    readActive();
    window.addEventListener("hashchange", readActive);
    window.addEventListener("popstate", readActive);
    window.addEventListener("app:navigate", readActive);
    return () => {
      window.removeEventListener("hashchange", readActive);
      window.removeEventListener("popstate", readActive);
      window.removeEventListener("app:navigate", readActive);
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    const isHome =
      !hash ||
      hash === "#" ||
      hash === "#/" ||
      hash.startsWith("#streams") ||
      hash.startsWith("#gallery") ||
      hash.startsWith("#about") ||
      hash.startsWith("#/#") ||
      (window.location.pathname === "/" && (!hash || hash.startsWith("#")));

    // Only run home-page section intersection observer when on the home page
    if (!isHome) return;

    const ids = navLinks.map((l) => l.id);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [visible]);

  const go = (id: string) => {
    setOpen(false);
    setHidden(false);

    if (id === "home") {
      const hash = window.location.hash;
      const isHome =
        !hash ||
        hash === "#" ||
        hash === "#/" ||
        hash.startsWith("#streams") ||
        hash.startsWith("#gallery") ||
        hash.startsWith("#about") ||
        (window.location.pathname === "/" && (!hash || hash.startsWith("#")));

      if (isHome) {
        scrollToTop();
      } else {
        window.location.hash = "/";
        window.dispatchEvent(new Event("app:navigate"));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // Homepage sections: streams, gallery, about
    if (id === "streams" || id === "gallery" || id === "about") {
      const hash = window.location.hash;
      const isHome =
        !hash ||
        hash === "#" ||
        hash === "#/" ||
        hash.startsWith("#streams") ||
        hash.startsWith("#gallery") ||
        hash.startsWith("#about") ||
        (window.location.pathname === "/" && (!hash || hash.startsWith("#")));

      if (isHome && document.getElementById(id)) {
        scrollToId(id, -30);
      } else {
        window.location.hash = `/#${id}`;
        window.dispatchEvent(new Event("app:navigate"));
        setTimeout(() => {
          scrollToId(id, -30);
        }, 150);
      }
      return;
    }

    // Direct pages with dedicated routes (events, venue, schedule, sponsors, contact)
    // directly to their respective pages in /pages
    window.location.hash = `/${id}`;
    window.dispatchEvent(new Event("app:navigate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSound = () => {
    const next = !ui.sound;
    ui.setSound(next);
    if (next) startAmbience();
    else stopAmbience();
  };

  const openTerminal = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("open-cyber-terminal"));
  };

  const isHidden = !visible || (hidden && !open);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[90] flex flex-col transition-[transform,opacity,background-color,backdrop-filter] duration-300",
          isHidden
            ? "-translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100 pointer-events-auto",
          scrolled ? "bg-[rgba(3,6,5,0.85)] backdrop-blur-xl" : "bg-transparent",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      >
        {/* Live Broadcast / Transmission Ticker stacked cleanly above the navbar */}
        <BroadcastTicker visible={visible} />

        <div
          className={cn(
            "relative mx-auto flex w-full max-w-[1680px] items-center justify-between px-4 transition-all duration-700 md:px-8 xl:px-10",
            scrolled ? "h-[54px]" : "h-[68px]",
          )}
        >
          {/* Logo & Brand mark */}
          <button onClick={() => go("home")} className="group flex items-center gap-2.5" aria-label="VYUHAM 26 home">
            <div className="relative flex h-8 w-8 items-center justify-center md:h-9 md:w-9">
              <img
                src="/vyuham_logo.svg"
                alt="VYUHAM'26 Logo"
                className="relative z-10 h-8 w-8 object-contain drop-shadow-[0_0_12px_rgba(24,196,124,0.5)] transition-transform duration-500 group-hover:scale-110 md:h-9 md:w-9"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/vyuham_logo.png";
                }}
              />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="t-cond text-[19px] tracking-[0.06em] text-[#eef8f3] md:text-[22px]">
                {homepage.brand}
                <span className="text-[#18c47c]">{homepage.year}</span>
              </span>
              <span className="hidden font-mono text-[8px] tracking-[0.3em] text-[#5d7e71] sm:inline">
                DUK
              </span>
            </div>
          </button>

          {/* Desktop primary navigation links */}
          <nav className="pointer-events-auto absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-5 xl:gap-7 lg:flex">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                data-active={active === l.id}
                className={cn(
                  "link-trail font-mono text-[10px] tracking-[0.24em] transition-colors duration-500",
                  active === l.id ? "text-[#c9f3e0]" : "text-[#7f978d] hover:text-[#dff6ec]",
                )}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Global CMD Terminal trigger */}
            <button
              onClick={openTerminal}
              aria-label="Open Command Terminal"
              className="group flex items-center gap-1.5 border border-[rgba(24,196,124,0.35)] bg-[rgba(8,26,18,0.5)] px-2.5 py-[5px] font-mono text-[10px] tracking-[0.16em] text-[#18c47c] transition-all duration-300 hover:border-[#18c47c] hover:bg-[rgba(24,196,124,0.14)] hover:shadow-[0_0_16px_rgba(24,196,124,0.35)]"
              title="Open Command Terminal (Ctrl + K)"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#18c47c] animate-pulse" />
              <span className="font-semibold tracking-wider">CONSOLE</span>
              <kbd className="hidden rounded bg-[rgba(24,196,124,0.15)] px-1 py-0.5 text-[8px] text-[#8ce4b9] lg:inline">
                ⌘K
              </kbd>
            </button>

            {/* Audio ambience toggle */}
            <button
              onClick={toggleSound}
              aria-label={ui.sound ? "Mute ambience" : "Play ambience"}
              className="group flex h-8 items-center gap-[3px] px-1"
              title={ui.sound ? "Sound on" : "Sound off"}
            >
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "w-[2px] rounded-full bg-[#4e7365] transition-all duration-500 group-hover:bg-[#7fe6b8]",
                    ui.sound ? "bg-[#18c47c]" : "",
                  )}
                  style={{
                    height: ui.sound ? `${6 + ((i * 5) % 13)}px` : "4px",
                    animation: ui.sound ? `driftY ${1.1 + i * 0.22}s ease-in-out infinite` : "none",
                  }}
                />
              ))}
            </button>

            {user ? (
              <button
                onClick={() => ui.setProfileOpen(true)}
                className="hidden items-center gap-2 border border-[rgba(120,160,145,0.25)] px-3 py-[7px] font-mono text-[9px] tracking-[0.24em] text-[#c6e5d8] transition-colors duration-500 hover:border-[rgba(24,196,124,0.6)] sm:flex"
              >
                <span className="h-[5px] w-[5px] rounded-full bg-[#18c47c]" />
                {user.name.split(" ")[0]}
              </button>
            ) : (
              <>
                <button
                  onClick={() => ui.setAuthOpen("login")}
                  className="link-trail hidden font-mono text-[10px] tracking-[0.26em] text-[#93aba1] transition-colors duration-500 hover:text-[#dff6ec] sm:block"
                >
                  LOGIN
                </button>
                <button
                  onClick={() => ui.setAuthOpen("signup")}
                  className="hidden border border-[rgba(24,196,124,0.4)] bg-[rgba(10,40,28,0.35)] px-3.5 py-[6px] font-mono text-[9px] tracking-[0.26em] text-[#d7f6e8] transition-all duration-500 hover:border-[rgba(24,196,124,0.9)] hover:bg-[rgba(16,64,44,0.5)] sm:block"
                >
                  REGISTER
                </button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] lg:hidden"
              aria-label="Menu"
            >
              <span
                className={cn(
                  "block h-px w-5 bg-[#cfe6db] transition-transform duration-500",
                  open && "translate-y-[3px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-px w-5 bg-[#cfe6db] transition-transform duration-500",
                  open && "-translate-y-[3px] -rotate-45",
                )}
              />
            </button>
          </div>
        </div>
        <div
          className={cn(
            "h-px w-full bg-gradient-to-r from-transparent via-[rgba(120,160,145,0.18)] to-transparent transition-opacity duration-700",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />
      </header>

      {/* Mobile full-screen cinematic menu */}
      <div
        className={cn(
          "fixed inset-0 z-[88] flex flex-col justify-between overflow-y-auto bg-[rgba(2,5,4,0.96)] backdrop-blur-2xl transition-all duration-700 lg:hidden px-6 pt-24 pb-8",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="grain pointer-events-none absolute inset-0 overflow-hidden" />

        {/* Mobile Header info */}
        <div className="relative z-10 flex items-center justify-between border-b border-[rgba(120,160,145,0.12)] pb-4">
          <div className="flex items-center gap-2">
            <img src="/vyuham_logo.svg" alt="VYUHAM'26" className="h-6 w-6 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = "/vyuham_logo.png"; }} />
            <span className="font-mono text-[9px] tracking-[0.24em] text-emerald-400">DIGITAL UNIVERSITY KERALA</span>
          </div>
          <button
            onClick={openTerminal}
            className="flex items-center gap-1.5 border border-emerald-500/40 bg-emerald-950/40 px-2 py-1 font-mono text-[9px] text-emerald-400"
          >
            <span>CONSOLE</span>
          </button>
        </div>

        {/* Mobile Nav Links */}
        <nav className="relative z-10 flex flex-col gap-1 py-4">
          {navLinks.map((l, i) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="t-cond border-b border-[rgba(120,160,145,0.1)] py-3 text-left text-[7vw] leading-none text-[#e5f4ed] transition-all duration-500 hover:text-emerald-400"
              style={{
                transform: open ? "translateY(0)" : "translateY(24px)",
                opacity: open ? 1 : 0,
                transitionDelay: `${0.04 * i + 0.08}s`,
              }}
            >
              <span className="mr-3 font-mono text-[10px] align-super text-[#3f6355]">0{i + 1}</span>
              {l.label}
            </button>
          ))}
        </nav>

        {/* Mobile Bottom actions */}
        <div className="relative z-10 pt-4">
          <div className="flex gap-3">
            <button
              onClick={() => {
                setOpen(false);
                ui.setAuthOpen("login");
              }}
              className="btn-cine flex-1 justify-center py-2.5 text-[10px]"
            >
              LOGIN
            </button>
            <button
              onClick={() => {
                setOpen(false);
                ui.setAuthOpen("signup");
              }}
              className="btn-cine btn-cine--solid flex-1 justify-center py-2.5 text-[10px]"
            >
              REGISTER
            </button>
          </div>
          <p className="mt-4 text-center font-mono text-[8px] tracking-[0.2em] text-[#3f6152]">
            30 OCT — 01 NOV 2026 · TECHNOCITY KERALA
          </p>
        </div>
      </div>
    </>
  );
}
