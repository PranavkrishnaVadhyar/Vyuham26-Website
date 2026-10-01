import { Suspense, useEffect, useRef, useState } from "react";
import { AppProvider, useApp } from "@/lib/store";
import { AuthProvider } from "@/context/AuthContext";
import { useReducedMotion } from "@/lib/hooks";
import { lockScroll, scrollToId } from "@/lib/scroll";
import { ScrollTrigger } from "@/lib/anim";
import { usePlatformRoute } from "@/lib/router";
import { RouteRenderer } from "@/routes";

import Atmosphere from "@/components/cinematic/Atmosphere";
import Intro from "@/components/cinematic/Intro";
import Interstitial from "@/components/cinematic/Interstitial";
import { CinematicCursor } from "@/components/cinematic/Interactive";
import CinematicTransition from "@/components/cinematic/CinematicTransition";
import { MEDIA } from "@/data/media";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Awakening from "@/components/sections/Awakening";
import Streams from "@/components/sections/Streams";
import Journey from "@/components/sections/Journey";
import Events from "@/components/sections/Events";
import Experience from "@/components/sections/Experience";
import About from "@/components/sections/About";
import Countdown from "@/components/sections/Countdown";
import FinalReveal from "@/components/sections/FinalReveal";
import { AuthModal, ProfilePanel } from "@/components/auth/Auth";
import Toaster from "@/components/ui/Toaster";
import CyberTerminal from "@/components/ui/CyberTerminal";
import Logo from "@/components/ui/Logo";
import AdminSecretListener from "@/components/admin/AdminSecretListener";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

/* ------------------------------------------------------------------ */
/*  Scroll progress rail                                               */
/* ------------------------------------------------------------------ */
function ProgressRail({ visible }: { visible: boolean }) {
  const bar = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const el = bar.current;
      if (el) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        el.style.transform = `scaleX(${p.toFixed(4)})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[95] h-[2px] transition-opacity duration-1000"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        ref={bar}
        className="h-full w-full origin-left bg-gradient-to-r from-[rgba(11,90,60,0.6)] to-[#18c47c]"
        style={{ transform: "scaleX(0)", boxShadow: "0 0 12px rgba(24,196,124,0.6)" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Public Cinematic Arena Site                                       */
/* ------------------------------------------------------------------ */
function Site() {
  const { ui } = useApp();
  const reduced = useReducedMotion();
  const [introActive, setIntroActive] = useState(() => {
    try {
      return !sessionStorage.getItem("vyuham26:seen");
    } catch {
      return true;
    }
  });

  useEffect(() => {
    lockScroll(introActive);
    if (!introActive) {
      ui.setIntroDone(true);
      const t = window.setTimeout(() => ScrollTrigger.refresh(), 320);
      return () => window.clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introActive]);

  useEffect(() => {
    lockScroll(!!ui.authOpen || ui.profileOpen || introActive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui.authOpen, ui.profileOpen, introActive]);

  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    if (document.fonts?.ready) void document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (introActive) return;
    const readAndScroll = () => {
      const raw = window.location.hash.replace(/^#\/?/, "").split("?")[0].replace(/^#/, "");
      if (raw === "gallery" || raw === "about" || raw === "streams") {
        setTimeout(() => {
          scrollToId(raw, -30);
        }, 220);
      }
    };
    readAndScroll();
    window.addEventListener("hashchange", readAndScroll);
    return () => window.removeEventListener("hashchange", readAndScroll);
  }, [introActive]);

  const done = () => {
    try {
      sessionStorage.setItem("vyuham26:seen", "1");
    } catch {
      /* private mode */
    }
    setIntroActive(false);
  };

  return (
    <div className="relative min-h-[100svh] w-full bg-[#030504]">
      <Atmosphere intensity={reduced ? 0.4 : 1} />
      <ProgressRail visible={!introActive} />
      <Nav visible={!introActive} />

      <main className="relative z-[3]">
        <Hero active={!introActive} />
        <Awakening />
        <Streams />
        <Journey />
        <Interstitial
          image={MEDIA.streetLight}
          line="Every schedule is a promise. This one is a countdown."
          caption="ACT IV — THE PROGRAMME"
          align="left"
        />
        <Events />
        <Experience />
        <Interstitial
          image={MEDIA.dancerSilhouette}
          line="You will not remember the timetable. You will remember the room."
          caption="ACT VI — WHAT REMAINS"
        />
        <About />
        <Countdown />
        <FinalReveal />
        <Footer />
      </main>

      {introActive && <Intro onDone={done} />}

      <AuthModal />
      <ProfilePanel />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Router Component                                                   */
/* ------------------------------------------------------------------ */
function Router() {
  const route = usePlatformRoute();
  const { ui } = useApp();

  useEffect(() => {
    lockScroll(false);
  }, [route]);

  const isHomepage =
    route === "/" ||
    route === "" ||
    route.startsWith("/#") ||
    route === "/about" ||
    route === "/gallery" ||
    route === "/streams";

  const reduced = useReducedMotion();
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[120] bg-amber-500/90 text-black text-center font-mono text-[9px] font-bold py-1 tracking-widest uppercase shadow-md">
          OFFLINE CACHED MODE // ACCESS TO FESTIVAL TIMELINE & CREDENTIALS REMAINS ACTIVE
        </div>
      )}
      <ErrorBoundary resetKey={route}>
        <Suspense
          fallback={
            <div className="flex min-h-[100svh] flex-col items-center justify-center bg-[#030504] text-center">
              <div className="relative mb-4 flex h-12 w-12 items-center justify-center">
                <Logo
                  size="sm"
                  className="h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(24,196,124,0.5)]"
                />
              </div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-[#18c47c]">
                INITIALIZING VYUHAM MODULE…
              </p>
            </div>
          }
        >
          {isHomepage ? (
            <RouteRenderer
              routePath={route}
              adminUnlocked={!!ui.adminUnlocked}
              siteComponent={Site}
            />
          ) : (
            <div className="relative min-h-[100svh] w-full bg-[#030504] text-[#cfd8d4]">
              <Atmosphere intensity={reduced ? 0.35 : 0.7} />
              <CinematicTransition routeKey={route}>
                <RouteRenderer
                  routePath={route}
                  adminUnlocked={!!ui.adminUnlocked}
                  siteComponent={Site}
                />
              </CinematicTransition>
            </div>
          )}
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Application Root                                              */
/* ------------------------------------------------------------------ */
export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AdminSecretListener />
        <CinematicCursor />
        <Router />
        <CyberTerminal />
        <Toaster />
      </AppProvider>
    </AuthProvider>
  );
}
