import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { AppProvider, useApp } from "@/lib/store";
import { AuthProvider } from "@/context/AuthContext";
import { useReducedMotion } from "@/lib/hooks";
import { destroySmoothScroll, initSmoothScroll, lockScroll, scrollToId } from "@/lib/scroll";
import { ScrollTrigger } from "@/lib/anim";
import { events, getEventBySlug } from "@/data/events";

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
import Navbar from "@/components/layout/Navbar";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, StreamBadge } from "@/components/ui/Elements";
import Link from "next/link";
import EventRegistrationForm from "@/components/forms/EventRegistrationForm";
import AdminSecretListener from "@/components/admin/AdminSecretListener";

/* ------------------------------------------------------------------ */
/*  Lazy Loaded Sub-pages                                             */
/* ------------------------------------------------------------------ */
const EventsPage = lazy(() => import("@/pages/events/page"));
const EventDetailClient = lazy(() => import("@/pages/events/[slug]/EventDetailClient"));
const SchedulePage = lazy(() => import("@/pages/schedule/page"));
const PhotographyPage = lazy(() => import("@/pages/photography/page"));
const VenuePage = lazy(() => import("@/pages/venue/page"));
const SponsorsPage = lazy(() => import("@/pages/sponsors/page"));
const AnnouncementsPage = lazy(() => import("@/pages/announcements/page"));
const FaqPage = lazy(() => import("@/pages/faq/page"));
const ContactPage = lazy(() => import("@/pages/contact/page"));
const SupportPage = lazy(() => import("@/pages/support/page"));
const FeedbackPage = lazy(() => import("@/pages/feedback/page"));
const HackathonPage = lazy(() => import("@/pages/hackathon/page"));
const CtfPage = lazy(() => import("@/pages/ctf/page"));
const QualifiersPage = lazy(() => import("@/pages/qualifiers/page"));
const LeaderboardPage = lazy(() => import("@/pages/leaderboard/page"));
const ResultsPage = lazy(() => import("@/pages/results/page"));
const CertificatesPage = lazy(() => import("@/pages/certificates/page"));
const TicketPage = lazy(() => import("@/pages/ticket/page"));
const VolunteerScannerPage = lazy(() => import("@/pages/volunteer/page"));
const CheckoutPage = lazy(() => import("@/pages/checkout/page"));
const PaymentPage = lazy(() => import("@/pages/payment/page"));
const ReceiptPage = lazy(() => import("@/pages/receipt/page"));
const ConfirmationPage = lazy(() => import("@/pages/confirmation/page"));
const FoodPage = lazy(() => import("@/pages/food/page"));
const FoodTopupPage = lazy(() => import("@/pages/food/topup/page"));
const FoodWalletPage = lazy(() => import("@/pages/food/wallet/page"));
const FoodVendorPage = lazy(() => import("@/pages/food/vendor/page"));
const TeamsPage = lazy(() => import("@/pages/teams/page"));
const LoginPage = lazy(() => import("@/pages/login/page"));
const SignupPage = lazy(() => import("@/pages/signup/page"));
const DashboardPage = lazy(() => import("@/pages/dashboard/page"));
const ProfilePage = lazy(() => import("@/pages/profile/page"));
const RegisterPage = lazy(() => import("@/pages/register/page"));
const AdminApp = lazy(() => import("@/components/admin/AdminApp"));
const AdminAnalyticsPage = lazy(() => import("@/pages/admin/analytics/page"));
const AdminEventHeadPage = lazy(() => import("@/pages/admin/event-head/page"));
const NotFoundPage = lazy(() => import("@/pages/not-found"));

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
    initSmoothScroll();
    return () => destroySmoothScroll();
  }, []);

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
/*  Dynamic Route Wrappers                                            */
/* ------------------------------------------------------------------ */
function EventDetailRoute({ slug }: { slug: string }) {
  const event = getEventBySlug(slug) || events.find((e) => e.slug === slug) || events[0];
  return <EventDetailClient event={event} />;
}

function RegisterSlugRoute({ slug }: { slug: string }) {
  const event = getEventBySlug(slug) || events.find((e) => e.slug === slug) || events[0];
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px] bg-[#030504] min-h-screen text-paper">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(720px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="flex items-center justify-between">
                <Link href="/register" className="font-mono text-xs text-muted hover:text-green">
                  ← Back to Selection Board
                </Link>
                <StreamBadge stream={event.stream} />
              </div>

              <div className="mt-4">
                <Kicker>Deployment Protocol</Kicker>
                <h1 className="mt-2 font-display text-[32px] font-semibold md:text-[44px]">
                  {event.title}
                </h1>
                <p className="mt-2 text-sm text-muted">
                  {event.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 font-mono text-xs text-muted">
                  <span>Day {event.day}</span>
                  <span>•</span>
                  <span>{event.time}</span>
                  <span>•</span>
                  <span>{event.venue}</span>
                  <span>•</span>
                  <span className="text-green font-bold">{event.fee}</span>
                </div>
              </div>
            </AnimatedSection>

            <div className="mt-10">
              <EventRegistrationForm event={event} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Unified Platform Router Hook                                      */
/* ------------------------------------------------------------------ */
function usePlatformRoute() {
  const read = () => {
    if (typeof window === "undefined") return "/";
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && hash.startsWith("/")) {
      return hash.split("?")[0];
    }
    const path = window.location.pathname;
    if (path && path !== "/") {
      return path.split("?")[0];
    }
    return "/";
  };

  const [route, setRoute] = useState(read);

  useEffect(() => {
    const handleUpdate = () => setRoute(read());
    window.addEventListener("hashchange", handleUpdate);
    window.addEventListener("popstate", handleUpdate);
    window.addEventListener("app:navigate", handleUpdate);
    return () => {
      window.removeEventListener("hashchange", handleUpdate);
      window.removeEventListener("popstate", handleUpdate);
      window.removeEventListener("app:navigate", handleUpdate);
    };
  }, []);

  return route;
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

  const renderModule = () => {
    if (route === "/" || route === "" || route.startsWith("/#")) {
      return <Site />;
    }

    if (route === "/about" || route === "/gallery" || route === "/streams") {
      return <Site />;
    }
    if (route === "/events") return <EventsPage />;
    if (route.startsWith("/events/")) {
      const slug = route.replace(/^\/events\//, "");
      return <EventDetailRoute slug={slug} />;
    }
    if (route === "/schedule") return <SchedulePage />;
    if (route === "/photography") return <PhotographyPage />;
    if (route === "/venue") return <VenuePage />;
    if (route === "/sponsors") return <SponsorsPage />;
    if (route === "/announcements") return <AnnouncementsPage />;
    if (route === "/faq") return <FaqPage />;
    if (route === "/contact") return <ContactPage />;
    if (route === "/support") return <SupportPage />;
    if (route === "/feedback") return <FeedbackPage />;
    if (route === "/hackathon") return <HackathonPage />;
    if (route === "/ctf") return <CtfPage />;
    if (route === "/qualifiers") return <QualifiersPage />;
    if (route === "/leaderboard") return <LeaderboardPage />;
    if (route === "/results") return <ResultsPage />;
    if (route === "/certificates") return <CertificatesPage />;
    if (route === "/ticket") return <TicketPage />;
    if (route === "/volunteer" || route === "/checkin") return <VolunteerScannerPage />;
    if (route === "/checkout") return <CheckoutPage />;
    if (route === "/payment") return <PaymentPage />;
    if (route === "/receipt") return <ReceiptPage />;
    if (route === "/confirmation") return <ConfirmationPage />;
    if (route === "/food") return <FoodPage />;
    if (route === "/food/topup") return <FoodTopupPage />;
    if (route === "/food/wallet") return <FoodWalletPage />;
    if (route === "/food/vendor") return <FoodVendorPage />;
    if (route === "/teams") return <TeamsPage />;
    if (route === "/login") return <LoginPage />;
    if (route === "/signup") return <SignupPage />;
    if (route === "/dashboard") return <DashboardPage />;
    if (route === "/profile") return <ProfilePage />;
    if (route === "/register") return <RegisterPage />;
    if (route.startsWith("/register/")) {
      const slug = route.replace(/^\/register\//, "");
      return <RegisterSlugRoute slug={slug} />;
    }
    if (route === "/admin" || route.startsWith("/admin")) {
      if (!ui.adminUnlocked) {
        return <NotFoundPage />;
      }
      if (route === "/admin/analytics") return <AdminAnalyticsPage />;
      if (route === "/admin/event-head") return <AdminEventHeadPage />;
      return <AdminApp />;
    }

    return <NotFoundPage />;
  };

  const isHomepage = route === "/" || route === "" || route.startsWith("/#");
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
      <Suspense
      fallback={
        <div className="flex min-h-[100svh] flex-col items-center justify-center bg-[#030504] text-center">
          <div className="relative mb-4 flex h-12 w-12 items-center justify-center">
            <img
              src="/vyuham_logo.svg"
              alt="VYUHAM'26"
              className="h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(24,196,124,0.5)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/vyuham_logo.png";
              }}
            />
          </div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#18c47c]">
            INITIALIZING VYUHAM MODULE…
          </p>
        </div>
      }
    >
      {isHomepage ? (
        renderModule()
      ) : (
        <div className="relative min-h-[100svh] w-full bg-[#030504] text-[#cfd8d4]">
          <Atmosphere intensity={reduced ? 0.35 : 0.7} />
          <CinematicTransition routeKey={route}>
            {renderModule()}
          </CinematicTransition>
        </div>
      )}
    </Suspense>
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
