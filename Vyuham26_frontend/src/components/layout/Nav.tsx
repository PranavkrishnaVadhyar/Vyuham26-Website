import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";
import { homepage, navLinks } from "@/data/content";
import { useApp } from "@/lib/store";
import { scrollToId, scrollToTop } from "@/lib/scroll";
import { startAmbience, stopAmbience } from "@/lib/sound";
import BroadcastTicker from "@/components/ui/BroadcastTicker";
import Logo from "@/components/ui/Logo";
import { toast } from "@/components/ui/Toaster";
import { SITE_CONFIG } from "@/config/site";

export default function Nav({ visible = true }: { visible?: boolean }) {
  const { user, ui, logout } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [hidden, setHidden] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileMenuOpen]);

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

  const checkIsHome = () => {
    if (typeof window === "undefined") return true;
    const path = window.location.pathname;
    const hash = window.location.hash.replace(/^#\/?/, "").split("?")[0].split("/")[0];

    // If pathname is not "/" (e.g. /events, /dashboard), it is definitely NOT home
    if (path && path !== "/") {
      return false;
    }
    // If pathname is "/", but hash points to an inner page (e.g. #/events, #/dashboard)
    if (hash && hash !== "" && hash !== "home" && hash !== "streams" && hash !== "gallery" && hash !== "about") {
      return false;
    }
    return true;
  };

  useEffect(() => {
    // Only run home-page section intersection observer when on the home page
    if (!checkIsHome()) return;

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
      const isHome = checkIsHome();

      if (isHome) {
        if (window.location.hash && window.location.hash !== "#/" && window.location.hash !== "#" && window.location.hash !== "") {
          window.location.hash = "/";
          window.dispatchEvent(new CustomEvent("app:navigate", { detail: "/" }));
        }
        scrollToTop();
      } else {
        try {
          if (window.location.pathname !== "/") {
            window.history.pushState(null, "", "/");
          }
        } catch {}
        window.location.hash = "/";
        window.dispatchEvent(new CustomEvent("app:navigate", { detail: "/" }));
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          scrollToTop();
        }, 120);
      }
      return;
    }

    // Homepage sections: streams, gallery, about
    if (id === "streams" || id === "gallery" || id === "about") {
      const isHome = checkIsHome();

      if (isHome && document.getElementById(id)) {
        scrollToId(id, -30);
      } else {
        try {
          if (window.location.pathname !== "/") {
            window.history.pushState(null, "", "/");
          }
        } catch {}
        window.location.hash = `/#${id}`;
        window.dispatchEvent(new CustomEvent("app:navigate", { detail: `/#${id}` }));
        setTimeout(() => {
          scrollToId(id, -30);
        }, 150);
      }
      return;
    }

    // Direct pages with dedicated routes (events, venue, schedule, sponsors, contact, dashboard, profile, ticket)
    try {
      if (window.location.pathname !== "/") {
        window.history.pushState(null, "", `/${id}`);
      }
    } catch {}
    window.location.hash = `/${id}`;
    window.dispatchEvent(new CustomEvent("app:navigate", { detail: `/${id}` }));
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
          open || scrolled ? "bg-[rgba(2,5,4,0.96)] backdrop-blur-2xl" : "bg-transparent",
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
              <Logo
                size="sm"
                className="relative z-10 h-8 w-8 object-contain drop-shadow-[0_0_12px_rgba(24,196,124,0.5)] transition-transform duration-500 group-hover:scale-110 md:h-9 md:w-9"
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
                  "link-trail inline-flex items-center min-h-[36px] px-1.5 py-1 font-mono text-[10px] tracking-[0.24em] transition-colors duration-500",
                  active === l.id ? "text-[#c9f3e0]" : "text-[#7f978d] hover:text-[#dff6ec]",
                )}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
            {/* Global CMD Terminal trigger */}
            <button
              onClick={openTerminal}
              aria-label="Open Command Terminal"
              className="group flex min-h-[36px] items-center gap-1.5 border border-[rgba(24,196,124,0.35)] bg-[rgba(8,26,18,0.5)] px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-[#18c47c] transition-all duration-300 hover:border-[#18c47c] hover:bg-[rgba(24,196,124,0.14)] hover:shadow-[0_0_16px_rgba(24,196,124,0.35)]"
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
              className="group flex h-9 min-h-[36px] min-w-[36px] items-center justify-center gap-[3px] rounded px-2 hover:bg-white/5 transition-colors"
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

            {!SITE_CONFIG.REG_OPEN ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 border border-amber-500/40 bg-amber-500/10 px-3 py-1 font-mono text-[9px] font-bold tracking-[0.22em] text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                COMING SOON
              </span>
            ) : user ? (
              <div className="relative hidden sm:block" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className={cn(
                    "flex min-h-[36px] items-center gap-2 border px-3 py-1.5 font-mono text-[9px] tracking-[0.24em] transition-all duration-300",
                    profileMenuOpen
                      ? "border-[#18c47c] bg-[rgba(24,196,124,0.12)] text-[#e7f5ee] shadow-[0_0_12px_rgba(24,196,124,0.3)]"
                      : "border-[rgba(120,160,145,0.25)] bg-[rgba(6,16,12,0.4)] text-[#c6e5d8] hover:border-[rgba(24,196,124,0.6)] hover:bg-[rgba(24,196,124,0.06)]"
                  )}
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="h-[5px] w-[5px] rounded-full bg-[#18c47c] animate-pulse" />
                  <span>{user.name.split(" ")[0]}</span>
                  <span
                    className={cn(
                      "text-[7px] text-[#6f8b80] transition-transform duration-300",
                      profileMenuOpen ? "rotate-180 text-[#18c47c]" : ""
                    )}
                  >
                    ▼
                  </span>
                </button>

                {/* Cyber Dropdown Menu */}
                {profileMenuOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+8px)] z-[110] w-[275px] overflow-hidden border border-[rgba(24,196,124,0.3)] bg-[#040806] shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(24,196,124,0.12)] backdrop-blur-2xl"
                    style={{ animationDuration: "180ms" }}
                  >
                    <div className="grain pointer-events-none absolute inset-0 opacity-40" />

                    {/* Operative Header */}
                    <div className="relative border-b border-[rgba(120,160,145,0.15)] bg-gradient-to-b from-[rgba(24,196,124,0.08)] to-transparent p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-[#18c47c]">
                          ● {user.role?.toUpperCase() || "PARTICIPANT"}
                        </span>
                        <span className="font-mono text-[8px] tracking-wider text-[#4f6f61]">
                          ONLINE
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-[12px] font-semibold tracking-wide text-[#f0f9f5] truncate">
                        {user.name}
                      </p>
                      <p className="font-mono text-[9px] tracking-wider text-[#7d9a8d] truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Primary Action: MOVE TO DASHBOARD */}
                    <div className="p-2 border-b border-[rgba(120,160,145,0.12)]">
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          go("dashboard");
                        }}
                        className="group flex w-full items-center justify-between border border-[rgba(24,196,124,0.4)] bg-[rgba(10,36,24,0.6)] px-3 py-2.5 font-mono text-[9px] tracking-[0.22em] text-[#34d399] transition-all duration-300 hover:border-[#18c47c] hover:bg-[rgba(24,196,124,0.22)] hover:text-[#d7f6e8] hover:shadow-[0_0_14px_rgba(24,196,124,0.3)]"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-[11px] leading-none text-[#18c47c]">⊞</span>
                          <span className="font-bold">DASHBOARD</span>
                        </span>
                        <span className="text-[#18c47c] transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </button>
                    </div>

                    {/* Secondary Navigation Options */}
                    <div className="relative p-1.5 space-y-0.5 font-mono text-[9px] tracking-[0.2em]">
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          ui.setProfileOpen(true);
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-[#b5d3c6] transition-colors hover:bg-[rgba(24,196,124,0.08)] hover:text-[#e7f5ee]"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-[#18c47c]">◈</span>
                          <span>EVENT SLOTS & SAVED</span>
                        </span>
                        <span className="text-[8px] text-[#4f6f61]">DRAWER</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          go("profile");
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-[#b5d3c6] transition-colors hover:bg-[rgba(24,196,124,0.08)] hover:text-[#e7f5ee]"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-[#18c47c]">☵</span>
                          <span>OPERATIVE DOSSIER</span>
                        </span>
                        <span className="text-[8px] text-[#4f6f61]">↗</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          go("ticket");
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-[#b5d3c6] transition-colors hover:bg-[rgba(24,196,124,0.08)] hover:text-[#e7f5ee]"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-[#18c47c]">🎫</span>
                          <span>MY QR CREDENTIAL</span>
                        </span>
                        <span className="text-[8px] text-[#4f6f61]">↗</span>
                      </button>

                      {user.role === "admin" && (
                        <button
                          onClick={() => {
                            setProfileMenuOpen(false);
                            go("admin");
                          }}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-[#8be7ba] transition-colors hover:bg-[rgba(24,196,124,0.12)] hover:text-[#e7f5ee]"
                        >
                          <span className="flex items-center gap-2">
                            <span>⚡</span>
                            <span>ADMIN CONSOLE</span>
                          </span>
                          <span className="text-[8px] text-[#18c47c]">↗</span>
                        </button>
                      )}

                      {(user.role === "volunteer" || user.role === "admin") && (
                        <button
                          onClick={() => {
                            setProfileMenuOpen(false);
                            go("volunteer");
                          }}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-cyan-400 transition-colors hover:bg-cyan-950/40 hover:text-cyan-300"
                        >
                          <span className="flex items-center gap-2">
                            <span>📲</span>
                            <span>VOLUNTEER SCANNER</span>
                          </span>
                          <span className="text-[8px] text-cyan-400">↗</span>
                        </button>
                      )}
                    </div>

                    {/* Footer: Sign Out */}
                    <div className="relative border-t border-[rgba(120,160,145,0.12)] p-2">
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          logout();
                          toast("Signed out.", "warn");
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 min-h-[36px] font-mono text-[9px] tracking-[0.24em] text-[#7d9a8d] transition-colors hover:bg-[rgba(242,169,138,0.08)] hover:text-[#f2a98a]"
                      >
                        <span>SIGN OUT</span>
                        <span className="text-[10px]">⎋</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => ui.setAuthOpen("login")}
                  className="link-trail hidden font-mono text-[10px] tracking-[0.26em] text-[#93aba1] transition-colors duration-500 hover:text-[#dff6ec] sm:inline-flex items-center min-h-[36px] px-2.5"
                >
                  LOGIN
                </button>
                <button
                  onClick={() => ui.setAuthOpen("signup")}
                  className="hidden border border-[rgba(24,196,124,0.4)] bg-[rgba(10,40,28,0.35)] px-3.5 py-1.5 min-h-[36px] font-mono text-[9px] tracking-[0.26em] text-[#d7f6e8] transition-all duration-500 hover:border-[rgba(24,196,124,0.9)] hover:bg-[rgba(16,64,44,0.5)] sm:inline-flex items-center justify-center"
                >
                  REGISTER
                </button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-9 w-9 min-h-[36px] min-w-[36px] flex-col items-center justify-center gap-[5px] rounded hover:bg-white/5 transition-colors lg:hidden"
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

      {/* Mobile full-screen cinematic menu via Portal */}
      {mounted && typeof document !== "undefined"
        ? createPortal(
            <div
              className={cn(
                "fixed inset-0 z-[88] flex flex-col justify-between overflow-y-auto bg-[rgba(2,5,4,0.98)] backdrop-blur-2xl transition-all duration-500 lg:hidden px-6 pt-28 pb-8",
                open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
              )}
              style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
            >
              <div className="grain pointer-events-none absolute inset-0 overflow-hidden" />

              {/* Mobile Tactical Sub-header */}
              <div className="relative z-10 flex items-center justify-between border-b border-[rgba(120,160,145,0.14)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#18c47c] animate-pulse" />
                  <span className="font-mono text-[9px] tracking-[0.24em] text-emerald-400">
                    VYUHAM'26 // DUK
                  </span>
                </div>
                <span className="font-mono text-[8px] tracking-[0.2em] text-[#4f6f61]">
                  SYSTEM SECURE
                </span>
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
                    <span className="mr-3 font-mono text-[10px] align-super text-[#3f6355]">
                      0{i + 1}
                    </span>
                    {l.label}
                  </button>
                ))}
              </nav>

              {/* Mobile Bottom actions */}
              <div className="relative z-10 pt-4">
                <div className="flex gap-3">
                  {!SITE_CONFIG.REG_OPEN ? (
                    <div className="flex w-full items-center justify-center border border-amber-500/40 bg-amber-500/10 py-3 font-mono text-[10px] font-bold tracking-[0.24em] text-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.2)]">
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse mr-2.5" />
                      REGISTRATION COMING SOON
                    </div>
                  ) : user ? (
                    <div className="flex w-full flex-col gap-2">
                      <div className="flex items-center justify-between border border-[rgba(120,160,145,0.18)] bg-[rgba(6,16,12,0.6)] px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[#18c47c] animate-pulse" />
                          <span className="font-mono text-[10px] tracking-wider text-[#e7f5ee]">
                            {user.name}
                          </span>
                        </div>
                        <span className="font-mono text-[8px] tracking-widest text-[#18c47c] uppercase">
                          {user.role || "OPERATIVE"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setOpen(false);
                            go("dashboard");
                          }}
                          className="btn-cine btn-cine--solid flex-1 justify-center py-2.5 text-[10px]"
                        >
                          DASHBOARD →
                        </button>
                        <button
                          onClick={() => {
                            setOpen(false);
                            ui.setProfileOpen(true);
                          }}
                          className="btn-cine flex-1 justify-center py-2.5 text-[10px]"
                        >
                          PROFILE
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setOpen(false);
                          logout();
                          toast("Signed out.", "warn");
                        }}
                        className="font-mono text-[9px] tracking-[0.24em] text-[#6f8b80] hover:text-[#f2a98a] py-2 min-h-[36px] flex items-center justify-center text-center"
                      >
                        SIGN OUT
                      </button>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
                <p className="mt-4 text-center font-mono text-[8px] tracking-[0.2em] text-[#3f6152]">
                  30 OCT — 01 NOV 2026 · TECHNOCITY KERALA
                </p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
