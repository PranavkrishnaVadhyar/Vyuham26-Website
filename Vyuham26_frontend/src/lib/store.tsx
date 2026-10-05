import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  announcements as seedAnnouncements,
  events as seedEvents,
  gallery as seedGallery,
  homepage as seedHomepage,
  schedule as seedSchedule,
  sponsors as seedSponsors,
  streams as seedStreams,
  team as seedTeam,
  seedRegistrations,
  seedUsers,
} from "@/data/content";
import type {
  Announcement,
  FestEvent,
  GalleryItem,
  Registration,
  ScheduleDay,
  Sponsor,
  Stream,
  TeamMember,
  UserAccount,
  CheckInRecord,
} from "@/data/types";
import { useLocalState } from "./hooks";
import { useAuth } from "@/context/AuthContext";

/**
 * Single source of truth for every editable piece of content.
 * The public cinematic site and the admin dashboard both read/write here,
 * so content can be swapped later (or wired to a real API) without
 * touching a single presentational component.
 */

interface Content {
  homepage: typeof seedHomepage;
  events: FestEvent[];
  streams: Stream[];
  schedule: ScheduleDay[];
  gallery: GalleryItem[];
  sponsors: Sponsor[];
  team: TeamMember[];
  announcements: Announcement[];
}

interface Ctx {
  content: Content;
  setHomepage: (patch: Partial<typeof seedHomepage>) => void;
  upsertEvent: (e: FestEvent) => void;
  removeEvent: (id: string) => void;
  upsertAnnouncement: (a: Announcement) => void;
  removeAnnouncement: (id: string) => void;
  upsertSponsor: (s: Sponsor) => void;
  removeSponsor: (id: string) => void;
  removeGalleryItem: (id: string) => void;
  addGalleryItem: (g: GalleryItem) => void;
  updateStream: (s: Stream) => void;
  updateScheduleDay: (d: ScheduleDay) => void;
  resetContent: () => void;

  users: UserAccount[];
  registrations: Registration[];
  user: UserAccount | null;
  saved: string[];
  login: (email: string, password: string) => { ok: boolean; message: string };
  signup: (name: string, email: string, password: string, college: string) => { ok: boolean; message: string };
  logout: () => void;
  removeUser: (id: string) => void;
  register: (eventId: string) => { ok: boolean; message: string };
  unregister: (eventId: string) => void;
  toggleSave: (eventId: string) => void;
  isRegistered: (eventId: string) => boolean;

  checkins: CheckInRecord[];
  addCheckin: (record: CheckInRecord) => void;
  clearCheckins: () => void;
  updateUserRole: (id: string, role: "user" | "admin" | "volunteer" | "event_head", station?: string) => void;
  addVolunteer: (v: {
    name: string;
    email: string;
    password: string;
    college?: string;
    station?: string;
  }) => { ok: boolean; message: string };

  ui: {
    authOpen: false | "login" | "signup";
    setAuthOpen: (v: false | "login" | "signup") => void;
    profileOpen: boolean;
    setProfileOpen: (v: boolean) => void;
    sound: boolean;
    setSound: (v: boolean) => void;
    introDone: boolean;
    setIntroDone: (v: boolean) => void;
    adminUnlocked: boolean;
    setAdminUnlocked: (v: boolean) => void;
  };
}

const AppCtx = createContext<Ctx | null>(null);

const seedContent: Content = {
  homepage: seedHomepage,
  events: seedEvents,
  streams: seedStreams,
  schedule: seedSchedule,
  gallery: seedGallery,
  sponsors: seedSponsors,
  team: seedTeam,
  announcements: seedAnnouncements,
};

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

export function AppProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [content, setContent] = useLocalState<Content>("vyuham26:content:v4", seedContent);
  const [users, setUsers] = useLocalState<UserAccount[]>("vyuham26:users:v1", seedUsers);
  const [registrations, setRegistrations] = useLocalState<Registration[]>(
    "vyuham26:regs:v1",
    seedRegistrations,
  );
  const [checkins, setCheckins] = useLocalState<CheckInRecord[]>("vyuham26:checkins:v1", [
    {
      id: "chk-demo-1",
      ticketCode: "VYU26-TKT-1082",
      attendeeName: "ARJUN IYER",
      college: "National Institute of Engineering",
      eventName: "HACK VYUHAM 36",
      station: "Gate 1 - Main Entrance",
      scannedBy: "DIVYA MENON",
      scannedAt: "10:14 AM IST",
      status: "approved",
    },
  ]);
  const [saved, setSaved] = useLocalState<string[]>("vyuham26:saved:v1", []);
  const [userId, setUserId] = useLocalState<string | null>("vyuham26:session:v1", null);

  // Bidirectional sync with AuthContext
  useEffect(() => {
    if (!auth.isReady) return;

    if (auth.user) {
      const authEmail = auth.user.email.toLowerCase().trim();
      const existing = users.find(
        (u) => u.id === auth.user?.id || u.email.toLowerCase().trim() === authEmail
      );

      if (existing) {
        if (userId !== existing.id) {
          setUserId(existing.id);
        }
        if (
          existing.name !== auth.user.name ||
          (auth.user.college && existing.college !== auth.user.college) ||
          (auth.user.role && existing.role !== auth.user.role)
        ) {
          setUsers((prev) =>
            prev.map((u) =>
              u.id === existing.id
                ? {
                    ...u,
                    name: auth.user!.name,
                    college: auth.user!.college || u.college,
                    role: (auth.user!.role as any) || u.role,
                  }
                : u
            )
          );
        }
      } else {
        const newAcc: UserAccount = {
          id: auth.user.id,
          name: auth.user.name,
          email: auth.user.email,
          password: "password",
          college: auth.user.college || "Digital University Kerala",
          role: (auth.user.role as any) || "user",
          joined: new Date().toISOString().slice(0, 10),
        };
        setUsers((prev) => [...prev, newAcc]);
        setUserId(newAcc.id);
      }
    } else if (userId !== null) {
      setUserId(null);
    }
  }, [auth.user, auth.isReady]);

  // Invalidate any legacy cached content (e.g. from v1 containing old South Campus / Hyderabad strings)
  useEffect(() => {
    try {
      localStorage.removeItem("vyuham26:content:v1");
      localStorage.removeItem("vyuham26:content:v2");
      localStorage.removeItem("vyuham26:content:v3");
    } catch {}
    if (
      content.homepage.location !== seedHomepage.location ||
      content.homepage.dates !== seedHomepage.dates
    ) {
      setContent((c) => ({
        ...c,
        homepage: {
          ...c.homepage,
          dates: seedHomepage.dates,
          location: seedHomepage.location,
          institution: seedHomepage.institution,
        },
      }));
    }
  }, [content.homepage.location, content.homepage.dates, setContent]);

  const [authOpen, setAuthOpen] = useState<false | "login" | "signup">(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [adminUnlocked, setAdminUnlockedState] = useState<boolean>(() => {
    try {
      return typeof window !== "undefined" && sessionStorage.getItem("vyuham26:admin_unlocked") === "true";
    } catch {
      return false;
    }
  });

  const setAdminUnlocked = useCallback((val: boolean) => {
    setAdminUnlockedState(val);
    try {
      if (typeof window !== "undefined") {
        if (val) {
          sessionStorage.setItem("vyuham26:admin_unlocked", "true");
        } else {
          sessionStorage.removeItem("vyuham26:admin_unlocked");
        }
      }
    } catch {}
  }, []);

  const user = useMemo(() => users.find((u) => u.id === userId) ?? null, [users, userId]);

  const patchContent = useCallback(
    (fn: (c: Content) => Content) => setContent((c) => fn(c)),
    [setContent],
  );

  const value: Ctx = {
    content,
    setHomepage: (patch) => patchContent((c) => ({ ...c, homepage: { ...c.homepage, ...patch } })),
    upsertEvent: (e) =>
      patchContent((c) => {
        const exists = c.events.some((x) => x.id === e.id);
        return {
          ...c,
          events: exists ? c.events.map((x) => (x.id === e.id ? e : x)) : [...c.events, e],
        };
      }),
    removeEvent: (id) => patchContent((c) => ({ ...c, events: c.events.filter((e) => e.id !== id) })),
    upsertAnnouncement: (a) =>
      patchContent((c) => ({
        ...c,
        announcements: c.announcements.some((x) => x.id === a.id)
          ? c.announcements.map((x) => (x.id === a.id ? a : x))
          : [a, ...c.announcements],
      })),
    removeAnnouncement: (id) =>
      patchContent((c) => ({ ...c, announcements: c.announcements.filter((a) => a.id !== id) })),
    upsertSponsor: (s) =>
      patchContent((c) => ({
        ...c,
        sponsors: c.sponsors.some((x) => x.id === s.id)
          ? c.sponsors.map((x) => (x.id === s.id ? s : x))
          : [...c.sponsors, s],
      })),
    removeSponsor: (id) => patchContent((c) => ({ ...c, sponsors: c.sponsors.filter((s) => s.id !== id) })),
    removeGalleryItem: (id) => patchContent((c) => ({ ...c, gallery: c.gallery.filter((g) => g.id !== id) })),
    addGalleryItem: (g) => patchContent((c) => ({ ...c, gallery: [...c.gallery, g] })),
    updateStream: (s) =>
      patchContent((c) => ({ ...c, streams: c.streams.map((x) => (x.id === s.id ? s : x)) })),
    updateScheduleDay: (d) =>
      patchContent((c) => ({ ...c, schedule: c.schedule.map((x) => (x.id === d.id ? d : x)) })),
    resetContent: () => setContent(seedContent),

    users,
    registrations,
    user,
    saved,

    login: (email, password) => {
      const cleanEmail = email.trim().toLowerCase();

      const found = users.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.password === password,
      );
      if (!found) {
        // Delegate entirely to AuthContext (Supabase + backend)
        auth.login(cleanEmail, password).catch(() => {});
        return { ok: true, message: "Authentication initiated." };
      }
      setUserId(found.id);
      auth.login(found.email, password, found.name).catch(() => {});
      if (found.college || found.role) {
        auth.updateUser({ college: found.college, role: found.role }).catch(() => {});
      }
      return { ok: true, message: `Welcome back, ${found.name.split(" ")[0]}.` };
    },
    signup: (name, email, password, college) => {
      const cleanEmail = email.trim().toLowerCase();
      auth
        .signup({
          name,
          email: cleanEmail,
          password,
          college,
        })
        .catch(() => {});

      if (users.some((u) => u.email.toLowerCase() === cleanEmail))
        return { ok: false, message: "That email is already in the system." };
      const account: UserAccount = {
        id: uid("u"),
        name: name.toUpperCase(),
        email: cleanEmail,
        password,
        college,
        role: "user",
        joined: new Date().toISOString().slice(0, 10),
      };
      setUsers((u) => [...u, account]);
      setUserId(account.id);
      return { ok: true, message: "Access granted." };
    },
    logout: () => {
      setUserId(null);
      auth.logout();
    },
    removeUser: (id) => {
      setUsers((u) => u.filter((x) => x.id !== id));
      setRegistrations((r) => r.filter((x) => x.userId !== id));
    },

    register: (eventId) => {
      if (!user) return { ok: false, message: "Sign in to hold a slot." };
      if (registrations.some((r) => r.userId === user.id && r.eventId === eventId))
        return { ok: false, message: "Already locked in." };
      const ev = content.events.find((e) => e.id === eventId);
      if (!ev) return { ok: false, message: "Event not found." };
      const full = ev.registered >= ev.seats;
      setRegistrations((r) => [
        ...r,
        {
          id: uid("r"),
          userId: user.id,
          userName: user.name,
          eventId,
          eventName: ev.name,
          createdAt: new Date().toISOString().slice(0, 10),
          status: full ? "waitlist" : "confirmed",
        },
      ]);
      patchContent((c) => ({
        ...c,
        events: c.events.map((e) => (e.id === eventId ? { ...e, registered: e.registered + 1 } : e)),
      }));
      auth.registerForEvent(eventId);
      return { ok: true, message: full ? `Waitlisted — ${ev.name}` : `Confirmed — ${ev.name}` };
    },
    unregister: (eventId) => {
      if (!user) return;
      setRegistrations((r) => r.filter((x) => !(x.userId === user.id && x.eventId === eventId)));
      patchContent((c) => ({
        ...c,
        events: c.events.map((e) =>
          e.id === eventId ? { ...e, registered: Math.max(0, e.registered - 1) } : e,
        ),
      }));
      auth.unregisterEvent(eventId);
    },
    toggleSave: (eventId) =>
      setSaved((s) => (s.includes(eventId) ? s.filter((x) => x !== eventId) : [...s, eventId])),
    isRegistered: (eventId) => !!user && registrations.some((r) => r.userId === user.id && r.eventId === eventId),

    checkins,
    addCheckin: (record) => setCheckins((prev) => [record, ...prev]),
    clearCheckins: () => setCheckins([]),
    updateUserRole: (id, role, station) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role, station: station ?? u.station } : u))
      );
    },
    addVolunteer: ({ name, email, password, college, station }) => {
      const cleanEmail = email.trim().toLowerCase();
      if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
        return { ok: false, message: "A user with this email already exists." };
      }
      const newVol: UserAccount = {
        id: uid("u-vol"),
        name: name.trim().toUpperCase(),
        email: cleanEmail,
        password,
        role: "volunteer",
        college: college?.trim() || "Digital University Kerala",
        station: station || "Gate 1 - Main Entrance",
        joined: new Date().toISOString().slice(0, 10),
      };
      setUsers((prev) => [...prev, newVol]);
      return { ok: true, message: `Volunteer ${newVol.name} enrolled successfully.` };
    },

    ui: {
      authOpen,
      setAuthOpen,
      profileOpen,
      setProfileOpen,
      sound,
      setSound,
      introDone,
      setIntroDone,
      adminUnlocked,
      setAdminUnlocked,
    },
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
