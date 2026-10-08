"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { authApi, registrationsApi } from "@/lib/api";
import { navigate } from "@/lib/router";
import { SITE_CONFIG } from "@/config/site";
import { events as localEvents } from "@/data/events";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  college?: string;
  phone?: string;
  degree?: string;
  year?: string;
  role: "user" | "volunteer" | "event_head" | "admin";
  registeredEvents: string[];
  vyuham_id?: string;
  vyuhamId?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (email: string, password?: string, name?: string) => Promise<AuthResult>;
  signup: (details: {
    name: string;
    email: string;
    password?: string;
    college?: string;
    phone?: string;
    degree?: string;
    year?: string;
    role?: "user" | "volunteer" | "event_head" | "admin";
  }) => Promise<AuthResult>;
  loginWithGoogle: (redirectPath?: string) => Promise<AuthResult>;
  updateUser:(patch: Partial<AuthUser>) => Promise<void>;
  logout: () => Promise<void>;
  registerForEvent: (eventSlug: string) => {
    success: boolean;
    alreadyRegistered: boolean;
  };
  unregisterEvent: (eventSlug: string) => void;
  isEventRegistered: (eventSlug: string) => boolean;
}

const STORAGE_KEY = "vyuham_auth_user";
/** Where to send the user once a Google sign-in redirect comes back. */
const OAUTH_REDIRECT_KEY = "vyuham26:oauth_redirect";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function saveUserToStorage(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      window.dispatchEvent(new CustomEvent("vyuham:auth-change", { detail: user }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("vyuham:auth-change", { detail: null }));
    }
  } catch (err) {
    console.error("Storage error:", err);
  }
}

/** Normalise the backend role string to frontend union type */
function normalizeRole(raw: string | undefined | null): AuthUser["role"] {
  if (!raw) return "user";
  const lower = raw.toLowerCase();
  if (lower === "participant") return "user";
  if (lower === "event_head") return "event_head";
  if (lower === "volunteer") return "volunteer";
  if (lower === "admin") return "admin";
  return "user";
}

async function fetchBackendProfile(): Promise<Partial<AuthUser> | null> {
  try {
    const profile = await authApi.getMe();

    // Fetch registrations separately – failure is non-fatal
    let registeredSlugs: string[] = [];
    try {
      const myRegs = await registrationsApi.listMine();
      if (Array.isArray(myRegs)) {
        registeredSlugs = myRegs.flatMap((r: any) => {
          const items: string[] = [];
          if (r.event_slug) items.push(r.event_slug);
          if (r.event_id) {
            items.push(r.event_id);
            const matched = localEvents.find((e) => (e.id && e.id === r.event_id) || e.slug === r.event_slug);
            if (matched && !items.includes(matched.slug)) {
              items.push(matched.slug);
            }
          }
          return items;
        });
      }
    } catch {
      // ignore – registrations endpoint may not exist yet
    }



    return {
      id: profile.id,
      name: profile.name || "",
      email: profile.email,
      college: profile.college || "",
      phone: profile.phone || "",
      degree: profile.degree || "",
      year: profile.year || "",
      role: normalizeRole(profile.role),
      vyuham_id: profile.vyuham_id || profile.vyuhamId,
      vyuhamId: profile.vyuhamId || profile.vyuham_id,
      registeredEvents: registeredSlugs,
    };
  } catch (err) {
    console.warn("Could not fetch backend profile:", err);
    return null;
  }
}

/** Display name from OAuth provider metadata (Google sends full_name / name). */
function providerName(session: Session): string {
  const meta = session.user.user_metadata || {};
  return meta.full_name || meta.name || "";
}

/** Merge the backend profile with the Supabase session and any previously cached user. */
function mergeSessionUser(
  session: Session,
  backendProfile: Partial<AuthUser>,
  prev: AuthUser | null
): AuthUser {
  return {
    id: backendProfile.id || session.user.id,
    name:
      backendProfile.name ||
      providerName(session) ||
      prev?.name ||
      session.user.email?.split("@")[0].toUpperCase() ||
      "OPERATIVE",
    email: session.user.email || prev?.email || "",
    college: backendProfile.college || prev?.college || "",
    phone: backendProfile.phone || prev?.phone || "",
    degree: backendProfile.degree || prev?.degree || "",
    year: backendProfile.year || prev?.year || "",
    role: backendProfile.role || prev?.role || "user",
    registeredEvents: backendProfile.registeredEvents?.length
      ? backendProfile.registeredEvents
      : prev?.registeredEvents || [],
    vyuham_id: backendProfile.vyuham_id || prev?.vyuham_id,
    vyuhamId: backendProfile.vyuhamId || prev?.vyuhamId,
  };
}

/** Read and clear the pending Google sign-in destination (null if none pending). */
function takeOAuthRedirect(): string | null {
  try {
    const dest = sessionStorage.getItem(OAUTH_REDIRECT_KEY);
    sessionStorage.removeItem(OAUTH_REDIRECT_KEY);
    return dest;
  } catch {
    return null;
  }
}

/** First Google sign-in: copy name/avatar from Google into the empty backend profile. */
async function seedProfileFromProvider(session: Session, backendProfile: Partial<AuthUser>) {
  if (backendProfile.name) return;
  const meta = session.user.user_metadata || {};
  const name = providerName(session);
  const avatarUrl = meta.avatar_url || meta.picture;
  if (!name && !avatarUrl) return;
  try {
    await authApi.updateProfile({ name: name || undefined, avatar_url: avatarUrl || undefined });
    backendProfile.name = name;
  } catch (err) {
    console.warn("Could not seed profile from Google:", err);
  }
}

/**
 * College and phone are mandatory before registering for events.
 * Google sign-in does not provide them, so those users fill them in on /profile.
 */
export function isProfileComplete(profile: Pick<AuthUser, "college" | "phone"> | null | undefined): boolean {
  return !!profile?.college?.trim() && !!profile?.phone?.trim();
}

/** /profile route that returns to `next` once the profile is completed and saved. */
export function profileCompletionPath(next: string): string {
  return `/profile?next=${encodeURIComponent(next)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize from localStorage safely on client mount & sync with Supabase session
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && parsed.email) {
          setUser(parsed);
        }
      }
    } catch (err) {
      console.warn("Failed to load auth user from storage:", err);
    } finally {
      setIsReady(true);
    }

    // Pull the backend profile for a Supabase session and cache it locally.
    // If this session came back from a Google redirect, finish that sign-in too.
    const syncSession = async (session: Session) => {
      const oauthDestination = takeOAuthRedirect();
      const backendProfile = await fetchBackendProfile();
      if (oauthDestination && backendProfile) {
        await seedProfileFromProvider(session, backendProfile);
      }
      if (backendProfile) {
        setUser((prev) => {
          const merged = mergeSessionUser(session, backendProfile, prev);
          saveUserToStorage(merged);
          return merged;
        });
      }
      if (oauthDestination) {
        const needsProfile = !!backendProfile && !isProfileComplete(backendProfile);
        const target =
          needsProfile && !oauthDestination.startsWith("/profile")
            ? profileCompletionPath(oauthDestination)
            : oauthDestination;
        navigate(target, { replace: true });
      }
    };

    // Check existing Supabase session and synchronize with FastAPI backend
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        await syncSession(session);
      } else {
        // Google sign-in was cancelled or failed; drop the pending redirect.
        takeOAuthRedirect();
      }
    });

    // Listen to real-time Supabase auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) {
        await syncSession(session);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        saveUserToStorage(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(
    async (email: string, password?: string, name?: string): Promise<AuthResult> => {
      if (!SITE_CONFIG.REG_OPEN) {
        return { success: false, error: "Registration and login are coming soon." };
      }
      const cleanEmail = email.trim().toLowerCase();

      // 1. Try Supabase Auth if password is provided
      if (password) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

          if (!error && data.session) {
            const backendProfile = await fetchBackendProfile();
            const newUser: AuthUser = {
              id: backendProfile?.id || data.user.id,
              name:
                backendProfile?.name ||
                data.user.user_metadata?.name ||
                name ||
                cleanEmail.split("@")[0].toUpperCase(),
              email: cleanEmail,
              college: backendProfile?.college || data.user.user_metadata?.college || "",
              phone: backendProfile?.phone || data.user.user_metadata?.phone || "",
              degree: backendProfile?.degree || data.user.user_metadata?.degree || "",
              year: backendProfile?.year || data.user.user_metadata?.year || "",
              role: (backendProfile?.role as any) || "user",
              registeredEvents: backendProfile?.registeredEvents || [],
              vyuham_id: backendProfile?.vyuham_id,
              vyuhamId: backendProfile?.vyuhamId,
            };

            setUser(newUser);
            saveUserToStorage(newUser);
            return { success: true };
          }

          // If Supabase returned an error and it's not a seed demo account, return error
          if (
            error &&
            cleanEmail !== "admin@vyuham26.in" &&
            cleanEmail !== "volunteer@vyuham26.in"
          ) {
            return { success: false, error: error.message };
          }
        } catch (err: any) {
          console.warn("Supabase signIn exception:", err);
        }
      }

      // 2. Demo & Local Mock accounts fallback
      const existingRaw = localStorage.getItem(STORAGE_KEY);
      let existingEvents: string[] = [];
      let existingId: string | null = null;
      let existingCollege = "Digital University Kerala";
      let existingPhone: string | undefined = undefined;
      let existingDegree: string | undefined = "B.Tech Computer Science";
      let existingYear: string | undefined = "2024–2028";
      let existingRole: AuthUser["role"] = "user";

      if (existingRaw) {
        try {
          const parsed = JSON.parse(existingRaw);
          if (parsed?.email?.toLowerCase() === cleanEmail) {
            if (parsed.registeredEvents) existingEvents = parsed.registeredEvents;
            if (parsed.id) existingId = parsed.id;
            if (parsed.college) existingCollege = parsed.college;
            if (parsed.phone) existingPhone = parsed.phone;
            if (parsed.degree) existingDegree = parsed.degree;
            if (parsed.year) existingYear = parsed.year;
            if (parsed.role) existingRole = parsed.role;
          }
        } catch {}
      }

      // Check store users in localStorage for seed accounts
      try {
        const storeUsersRaw = localStorage.getItem("vyuham26:users:v1");
        if (storeUsersRaw) {
          const storeUsers = JSON.parse(storeUsersRaw);
          if (Array.isArray(storeUsers)) {
            const matched = storeUsers.find(
              (u: any) => u.email?.toLowerCase() === cleanEmail
            );
            if (matched) {
              if (matched.id) existingId = matched.id;
              if (matched.name && !name) name = matched.name;
              if (matched.college) existingCollege = matched.college;
              if (matched.role) existingRole = matched.role;
            }
          }
        }
      } catch {}

      if (cleanEmail === "admin@vyuham26.in") {
        existingRole = "admin";
        if (!name) name = "VYUHAM CORE";
      } else if (cleanEmail === "volunteer@vyuham26.in") {
        existingRole = "volunteer";
        if (!name) name = "DIVYA MENON";
      }

      const cleanSub = existingId || `VYU26-USR-${Math.floor(1000 + Math.random() * 9000)}`;
      const newUser: AuthUser = {
        id: cleanSub,
        name: name || cleanEmail.split("@")[0].toUpperCase(),
        email: cleanEmail,
        college: existingCollege,
        phone: existingPhone || "+91 98470 12345",
        degree: existingDegree,
        year: existingYear,
        role: existingRole,
        registeredEvents: existingEvents,
        vyuham_id: `VYU26-OPER-${cleanSub.slice(-4).toUpperCase()}`,
        vyuhamId: `VYU26-OPER-${cleanSub.slice(-4).toUpperCase()}`,
      };

      setUser(newUser);
      saveUserToStorage(newUser);
      return { success: true };
    },
    []
  );

  const signup = useCallback(
    async (details: {
      name: string;
      email: string;
      password?: string;
      college?: string;
      phone?: string;
      degree?: string;
      year?: string;
      role?: "user" | "volunteer" | "event_head" | "admin";
    }): Promise<AuthResult> => {
      if (!SITE_CONFIG.REG_OPEN) {
        return { success: false, error: "Registration is coming soon." };
      }
      const cleanEmail = details.email.trim().toLowerCase();

      // 1. Try Supabase signUp if password is provided
      if (details.password) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: cleanEmail,
            password: details.password,
            options: {
              data: {
                name: details.name,
                college: details.college || "",
                phone: details.phone || "",
                degree: details.degree || "",
                year: details.year || "",
              },
            },
          });

          if (error) {
            return { success: false, error: error.message };
          }

          if (data.session) {
            try {
              await authApi.updateProfile({
                name: details.name,
                phone: details.phone,
                college: details.college,
                degree: details.degree,
                year: details.year,
              });
            } catch {}

            const backendProfile = await fetchBackendProfile();
            const newUser: AuthUser = {
              id: backendProfile?.id || data.user?.id || `VYU26-USR-${Math.floor(1000 + Math.random() * 9000)}`,
              name: details.name,
              email: cleanEmail,
              college: details.college || "",
              phone: details.phone || "",
              degree: details.degree || "",
              year: details.year || "",
              role: details.role || (backendProfile?.role as any) || "user",
              registeredEvents: [],
              vyuham_id: backendProfile?.vyuham_id,
              vyuhamId: backendProfile?.vyuhamId,
            };

            setUser(newUser);
            saveUserToStorage(newUser);
            return { success: true };
          }
        } catch (err: any) {
          console.warn("Supabase signUp exception:", err);
        }
      }

      // 2. Local fallback registration
      const randomSub = Math.floor(1000 + Math.random() * 9000);
      const newUser: AuthUser = {
        id: `VYU26-USR-${randomSub}`,
        name: details.name,
        email: cleanEmail,
        college: details.college || "Digital University Kerala",
        phone: details.phone || "",
        degree: details.degree || "B.Tech Computer Science",
        year: details.year || "2024–2028",
        role: details.role || "user",
        registeredEvents: [],
        vyuham_id: `VYU26-OPER-${randomSub}`,
        vyuhamId: `VYU26-OPER-${randomSub}`,
      };

      setUser(newUser);
      saveUserToStorage(newUser);
      return { success: true };
    },
    []
  );

  const loginWithGoogle = useCallback(
    async (redirectPath: string = "/dashboard"): Promise<AuthResult> => {
      if (!SITE_CONFIG.REG_OPEN) {
        return { success: false, error: "Registration and login are coming soon." };
      }
      try {
        sessionStorage.setItem(OAUTH_REDIRECT_KEY, redirectPath);
      } catch {}

      // Return to the site root; syncSession routes to redirectPath (or /profile) afterwards.
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: { prompt: "select_account" },
        },
      });

      if (error) {
        takeOAuthRedirect();
        return { success: false, error: error.message };
      }
      return { success: true };
    },
    []
  );

  const updateUser = useCallback(async (patch: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...patch };
      saveUserToStorage(updated);
      return updated;
    });

    // Sync updates to FastAPI backend if authenticated with Supabase
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        await authApi.updateProfile({
          name: patch.name,
          phone: patch.phone,
          college: patch.college,
          degree: patch.degree,
          year: patch.year,
        });
      }
    } catch (err) {
      console.warn("Could not sync profile to backend:", err);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase signOut error:", err);
    }
    setUser(null);
    saveUserToStorage(null);
  }, []);

  const registerForEvent = useCallback(
    (eventSlugOrId: string) => {
      if (!SITE_CONFIG.REG_OPEN) {
        return { success: false, alreadyRegistered: false };
      }
      if (!user) {
        return { success: false, alreadyRegistered: false };
      }

      const cleanTarget = eventSlugOrId.trim().toLowerCase();
      const matchedEvent = localEvents.find(
        (e) => e.slug.toLowerCase() === cleanTarget || (e.id && e.id.toLowerCase() === cleanTarget)
      );

      const toAdd = [cleanTarget];
      if (matchedEvent) {
        toAdd.push(matchedEvent.slug.toLowerCase());
        if (matchedEvent.id) {
          toAdd.push(matchedEvent.id.toLowerCase());
        }
      }

      if (user.registeredEvents.some((e) => toAdd.includes(e.toLowerCase()))) {
        return { success: true, alreadyRegistered: true };
      }

      const updatedEvents = [...user.registeredEvents, ...toAdd];
      const updatedUser: AuthUser = {
        ...user,
        registeredEvents: Array.from(new Set(updatedEvents)),
      };

      setUser(updatedUser);
      saveUserToStorage(updatedUser);

      return { success: true, alreadyRegistered: false };
    },
    [user]
  );

  const unregisterEvent = useCallback(
    (eventSlugOrId: string) => {
      if (!user) return;
      const cleanTarget = eventSlugOrId.trim().toLowerCase();
      const matchedEvent = localEvents.find(
        (e) => e.slug.toLowerCase() === cleanTarget || (e.id && e.id.toLowerCase() === cleanTarget)
      );
      const toRemove = [cleanTarget];
      if (matchedEvent) {
        toRemove.push(matchedEvent.slug.toLowerCase());
        if (matchedEvent.id) {
          toRemove.push(matchedEvent.id.toLowerCase());
        }
      }

      const updatedEvents = user.registeredEvents.filter(
        (s) => !toRemove.includes(s.toLowerCase())
      );
      const updatedUser: AuthUser = {
        ...user,
        registeredEvents: updatedEvents,
      };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
    },
    [user]
  );

  const isEventRegistered = useCallback(
    (eventSlugOrId: string) => {
      if (!user) return false;
      const cleanTarget = eventSlugOrId.trim().toLowerCase();
      if (user.registeredEvents.some((e) => e.toLowerCase() === cleanTarget)) {
        return true;
      }
      const matchedEvent = localEvents.find(
        (e) => e.slug.toLowerCase() === cleanTarget || (e.id && e.id.toLowerCase() === cleanTarget)
      );
      if (matchedEvent) {
        return user.registeredEvents.some(
          (e) =>
            e.toLowerCase() === matchedEvent.slug.toLowerCase() ||
            (matchedEvent.id && e.toLowerCase() === matchedEvent.id.toLowerCase())
        );
      }
      return false;
    },
    [user]
  );



  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isReady,
        login,
        signup,
        loginWithGoogle,
        updateUser,
        logout,
        registerForEvent,
        unregisterEvent,
        isEventRegistered,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
