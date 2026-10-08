import React, { lazy } from "react";
import { matchPath, normalizePath, navigate, isAdminUnlocked } from "@/lib/router";
import { events, getEventBySlug } from "@/data/events";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, StreamBadge } from "@/components/ui/Elements";
import Link from "next/link";
import EventRegistrationForm from "@/components/forms/EventRegistrationForm";
import { SITE_CONFIG, useRegistrationOpen } from "@/config/site";
import RegistrationComingSoon from "@/components/ui/RegistrationComingSoon";
import AdminGate from "@/components/admin/AdminGate";

/* ------------------------------------------------------------------ */
/*  Dynamic Module Loaders                                            */
/* ------------------------------------------------------------------ */
export const routeLoaders: Record<string, () => Promise<any>> = {
  events: () => import("@/pages/events/page"),
  "event-detail": () => import("@/pages/events/[slug]/EventDetailClient"),
  schedule: () => import("@/pages/schedule/page"),
  photography: () => import("@/pages/photography/page"),
  venue: () => import("@/pages/venue/page"),
  sponsors: () => import("@/pages/sponsors/page"),
  announcements: () => import("@/pages/announcements/page"),
  faq: () => import("@/pages/faq/page"),
  contact: () => import("@/pages/contact/page"),
  support: () => import("@/pages/support/page"),
  feedback: () => import("@/pages/feedback/page"),
  hackathon: () => import("@/pages/hackathon/page"),
  ctf: () => import("@/pages/ctf/page"),
  qualifiers: () => import("@/pages/qualifiers/page"),
  leaderboard: () => import("@/pages/leaderboard/page"),
  results: () => import("@/pages/results/page"),
  certificates: () => import("@/pages/certificates/page"),
  ticket: () => import("@/pages/ticket/page"),
  volunteer: () => import("@/pages/volunteer/page"),
  checkout: () => import("@/pages/checkout/page"),
  payment: () => import("@/pages/payment/page"),
  receipt: () => import("@/pages/receipt/page"),
  confirmation: () => import("@/pages/confirmation/page"),
  food: () => import("@/pages/food/page"),
  "food-topup": () => import("@/pages/food/topup/page"),
  "food-wallet": () => import("@/pages/food/wallet/page"),
  "food-vendor": () => import("@/pages/food/vendor/page"),
  teams: () => import("@/pages/teams/page"),
  login: () => import("@/pages/login/page"),
  signup: () => import("@/pages/signup/page"),
  dashboard: () => import("@/pages/dashboard/page"),
  profile: () => import("@/pages/profile/page"),
  register: () => import("@/pages/register/page"),
  "admin-analytics": () => import("@/pages/admin/analytics/page"),
  "admin-event-head": () => import("@/pages/admin/event-head/page"),
  "admin-root": () => import("@/components/admin/AdminApp"),
};

/* ------------------------------------------------------------------ */
/*  Lazy Loaded Sub-pages                                             */
/* ------------------------------------------------------------------ */
export const EventsPage = lazy(routeLoaders.events);
export const EventDetailClient = lazy(routeLoaders["event-detail"]);
export const SchedulePage = lazy(routeLoaders.schedule);
export const PhotographyPage = lazy(routeLoaders.photography);
export const VenuePage = lazy(routeLoaders.venue);
export const SponsorsPage = lazy(routeLoaders.sponsors);
export const AnnouncementsPage = lazy(routeLoaders.announcements);
export const FaqPage = lazy(routeLoaders.faq);
export const ContactPage = lazy(routeLoaders.contact);
export const SupportPage = lazy(routeLoaders.support);
export const FeedbackPage = lazy(routeLoaders.feedback);
export const HackathonPage = lazy(routeLoaders.hackathon);
export const CtfPage = lazy(routeLoaders.ctf);
export const QualifiersPage = lazy(routeLoaders.qualifiers);
export const LeaderboardPage = lazy(routeLoaders.leaderboard);
export const ResultsPage = lazy(routeLoaders.results);
export const CertificatesPage = lazy(routeLoaders.certificates);
export const TicketPage = lazy(routeLoaders.ticket);
export const VolunteerScannerPage = lazy(routeLoaders.volunteer);
export const CheckoutPage = lazy(routeLoaders.checkout);
export const PaymentPage = lazy(routeLoaders.payment);
export const ReceiptPage = lazy(routeLoaders.receipt);
export const ConfirmationPage = lazy(routeLoaders.confirmation);
export const FoodPage = lazy(routeLoaders.food);
export const FoodTopupPage = lazy(routeLoaders["food-topup"]);
export const FoodWalletPage = lazy(routeLoaders["food-wallet"]);
export const FoodVendorPage = lazy(routeLoaders["food-vendor"]);
export const TeamsPage = lazy(routeLoaders.teams);
export const LoginPage = lazy(routeLoaders.login);
export const SignupPage = lazy(routeLoaders.signup);
export const DashboardPage = lazy(routeLoaders.dashboard);
export const ProfilePage = lazy(routeLoaders.profile);
export const RegisterPage = lazy(routeLoaders.register);
export const AdminApp = lazy(routeLoaders["admin-root"]);
export const AdminAnalyticsPage = lazy(routeLoaders["admin-analytics"]);
export const AdminEventHeadPage = lazy(routeLoaders["admin-event-head"]);
export const NotFoundPage = lazy(() => import("@/pages/not-found"));

/* ------------------------------------------------------------------ */
/*  Dynamic Route Components                                          */
/* ------------------------------------------------------------------ */
export function EventDetailRoute({ params }: { params?: { slug?: string } }) {
  const slug = params?.slug || "";
  const event = getEventBySlug(slug) || events.find((e) => e.slug === slug) || events[0];
  return <EventDetailClient event={event} />;
}

export function RegisterSlugRoute({ params }: { params?: { slug?: string } }) {
  const regOpen = useRegistrationOpen();
  if (!regOpen) {
    return <RegistrationComingSoon />;
  }
  const slug = params?.slug || "";
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
/*  Declarative Route Definition Interface                            */
/* ------------------------------------------------------------------ */
export interface RouteConfig {
  id: string;
  pattern: string | string[];
  component: React.ComponentType<any>;
  isHomeSite?: boolean;
  requiresAdmin?: boolean;
  requiresAuth?: boolean;
  requiresRegistrationOpen?: boolean;
  exact?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Application Routes Table                                           */
/* ------------------------------------------------------------------ */
export const routes: RouteConfig[] = [
  // Primary Showcase and Section Anchors
  {
    id: "site-root",
    pattern: ["/", "", "/about", "/gallery", "/streams"],
    component: () => null,
    isHomeSite: true,
  },
  
  // Festival Experience & Events
  { id: "events", pattern: "/events", component: EventsPage },
  { id: "event-detail", pattern: "/events/:slug", component: EventDetailRoute },
  { id: "schedule", pattern: "/schedule", component: SchedulePage },
  { id: "photography", pattern: "/photography", component: PhotographyPage },
  { id: "venue", pattern: "/venue", component: VenuePage },
  { id: "sponsors", pattern: "/sponsors", component: SponsorsPage },
  { id: "announcements", pattern: "/announcements", component: AnnouncementsPage },
  { id: "faq", pattern: "/faq", component: FaqPage },
  { id: "contact", pattern: "/contact", component: ContactPage },
  { id: "support", pattern: "/support", component: SupportPage },
  { id: "feedback", pattern: "/feedback", component: FeedbackPage },

  // Competitions & Arena
  { id: "hackathon", pattern: "/hackathon", component: HackathonPage },
  { id: "ctf", pattern: "/ctf", component: CtfPage },
  { id: "qualifiers", pattern: "/qualifiers", component: QualifiersPage },
  { id: "leaderboard", pattern: "/leaderboard", component: LeaderboardPage },
  { id: "results", pattern: "/results", component: ResultsPage },
  { id: "certificates", pattern: "/certificates", component: CertificatesPage },
  { id: "ticket", pattern: "/ticket", component: TicketPage, requiresRegistrationOpen: true },
  { id: "volunteer", pattern: ["/volunteer", "/checkin"], component: VolunteerScannerPage },

  // Commerce, Food & Operations
  { id: "checkout", pattern: "/checkout", component: CheckoutPage, requiresRegistrationOpen: true },
  { id: "payment", pattern: "/payment", component: PaymentPage, requiresRegistrationOpen: true },
  { id: "receipt", pattern: "/receipt", component: ReceiptPage, requiresRegistrationOpen: true },
  { id: "confirmation", pattern: "/confirmation", component: ConfirmationPage },
  { id: "food", pattern: "/food", component: FoodPage },
  { id: "food-topup", pattern: "/food/topup", component: FoodTopupPage },
  { id: "food-wallet", pattern: "/food/wallet", component: FoodWalletPage },
  { id: "food-vendor", pattern: "/food/vendor", component: FoodVendorPage },

  // Auth, Profile & Teams
  { id: "teams", pattern: "/teams", component: TeamsPage, requiresRegistrationOpen: true },
  { id: "login", pattern: "/login", component: LoginPage, requiresRegistrationOpen: true },
  { id: "signup", pattern: "/signup", component: SignupPage, requiresRegistrationOpen: true },
  { id: "dashboard", pattern: "/dashboard", component: DashboardPage, requiresRegistrationOpen: true },
  { id: "profile", pattern: "/profile", component: ProfilePage, requiresRegistrationOpen: true },
  { id: "register", pattern: "/register", component: RegisterPage, requiresRegistrationOpen: true },
  { id: "register-slug", pattern: "/register/:slug", component: RegisterSlugRoute, requiresRegistrationOpen: true },

  // Restricted Administrative Control Center
  { id: "admin-analytics", pattern: "/admin/analytics", component: AdminAnalyticsPage, requiresAdmin: true },
  { id: "admin-event-head", pattern: "/admin/event-head", component: AdminEventHeadPage, requiresAdmin: true },
  { id: "admin-root", pattern: ["/admin", "/admin/*"], component: AdminApp, requiresAdmin: true },
];

/* ------------------------------------------------------------------ */
/*  Route Matching Engine                                             */
/* ------------------------------------------------------------------ */
export function matchRouteConfig(
  path: string,
  routeList: RouteConfig[] = routes
): { route: RouteConfig; params: Record<string, string> } | null {
  const normalized = normalizePath(path);

  for (const item of routeList) {
    const patterns = Array.isArray(item.pattern) ? item.pattern : [item.pattern];
    for (const pattern of patterns) {
      const result = matchPath(pattern, normalized, item.exact);
      if (result.matched) {
        return { route: item, params: result.params };
      }
    }
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  Route Prefetching Cache & Executor                                */
/* ------------------------------------------------------------------ */
const prefetchedCache = new Set<string>();

export function prefetchRoute(path: string): void {
  const match = matchRouteConfig(path);
  if (!match) return;

  const id = match.route.id;
  if (prefetchedCache.has(id)) return;
  prefetchedCache.add(id);

  const loader = routeLoaders[id];
  if (loader) {
    loader().catch(() => {
      prefetchedCache.delete(id);
    });
  }
}

/* ------------------------------------------------------------------ */
/*  Declarative Route Renderer Component                              */
/* ------------------------------------------------------------------ */
interface RouteRendererProps {
  routePath: string;
  adminUnlocked: boolean;
  onAdminUnlock?: () => void;
  siteComponent: React.ComponentType;
}

export function RouteRenderer({
  routePath,
  adminUnlocked,
  onAdminUnlock,
  siteComponent: Site,
}: RouteRendererProps) {
  const regOpen = useRegistrationOpen();
  const match = matchRouteConfig(routePath);

  if (!match) {
    return <NotFoundPage />;
  }

  const { route, params } = match;

  if (route.isHomeSite) {
    return <Site />;
  }

  if (route.requiresAdmin && !adminUnlocked && !isAdminUnlocked()) {
    if (typeof window !== "undefined") {
      try {
        window.history.replaceState(null, "", "/");
      } catch {}
      window.location.hash = "";
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      } else {
        navigate("/", { replace: true });
      }
    }
    return <Site />;
  }

  if (route.requiresRegistrationOpen && !regOpen) {
    return <RegistrationComingSoon />;
  }

  const Component = route.component;
  return <Component params={params} />;
}
