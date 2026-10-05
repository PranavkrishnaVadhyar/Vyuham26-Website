"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { authApi, registrationsApi } from "@/lib/api";
import { SITE_CONFIG } from "@/config/site";

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
  updateUser: (patch: Partial<AuthUser>) => Promise<void>;
  logout: () => Promise<void>;
  registerForEvent: (eventSlug: string) => {
    success: boolean;
    alreadyRegistered: boolean;
  };
  unregisterEvent: (eventSlug: string) => void;
  isEventRegistered: (eventSlug: string) => boolean;
}

const STORAGE_KEY = "vyuham_auth_user";

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
        registeredSlugs = myRegs.map((r: any) => r.event_slug || r.event_id);
      }
    } catch {
      // ignore – registrations endpoint may not exist yet
    }

    return {
      id: profile.id,
      name: profile.name || "OPERATIVE",
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

    // Check existing Supabase session and synchronize with FastAPI backend
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const backendProfile = await fetchBackendProfile();
        if (backendProfile) {
          setUser((prev) => {
            const merged: AuthUser = {
              id: backendProfile.id || session.user.id,
              name: backendProfile.name || prev?.name || session.user.email?.split("@")[0].toUpperCase() || "OPERATIVE",
              email: session.user.email || prev?.email || "",
              college: backendProfile.college || prev?.college || "Digital University Kerala",
              phone: backendProfile.phone || prev?.phone || "",
              degree: backendProfile.degree || prev?.degree || "B.Tech Computer Science",
              year: backendProfile.year || prev?.year || "2024–2028",
              role: backendProfile.role || prev?.role || "user",
              registeredEvents: backendProfile.registeredEvents?.length
                ? backendProfile.registeredEvents
                : prev?.registeredEvents || [],
              vyuham_id: backendProfile.vyuham_id || prev?.vyuham_id,
              vyuhamId: backendProfile.vyuhamId || prev?.vyuhamId,
            };
            saveUserToStorage(merged);
            return merged;
          });
        }
      }
    });

    // Listen to real-time Supabase auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) {
        const backendProfile = await fetchBackendProfile();
        if (backendProfile) {
          setUser((prev) => {
            const merged: AuthUser = {
              id: backendProfile.id || session.user.id,
              name: backendProfile.name || prev?.name || session.user.email?.split("@")[0].toUpperCase() || "OPERATIVE",
              email: session.user.email || prev?.email || "",
              college: backendProfile.college || prev?.college || "Digital University Kerala",
              phone: backendProfile.phone || prev?.phone || "",
              degree: backendProfile.degree || prev?.degree || "B.Tech Computer Science",
              year: backendProfile.year || prev?.year || "2024–2028",
              role: backendProfile.role || prev?.role || "user",
              registeredEvents: backendProfile.registeredEvents?.length
                ? backendProfile.registeredEvents
                : prev?.registeredEvents || [],
              vyuham_id: backendProfile.vyuham_id || prev?.vyuham_id,
              vyuhamId: backendProfile.vyuhamId || prev?.vyuhamId,
            };
            saveUserToStorage(merged);
            return merged;
          });
        }
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
              college:
                backendProfile?.college ||
                data.user.user_metadata?.college ||
                "Digital University Kerala",
              phone: backendProfile?.phone || data.user.user_metadata?.phone || "",
              degree:
                backendProfile?.degree ||
                data.user.user_metadata?.degree ||
                "B.Tech Computer Science",
              year: backendProfile?.year || data.user.user_metadata?.year || "2024–2028",
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
                college: details.college || "Digital University Kerala",
                phone: details.phone || "",
                degree: details.degree || "B.Tech Computer Science",
                year: details.year || "2024–2028",
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
              college: details.college || "Digital University Kerala",
              phone: details.phone || "",
              degree: details.degree || "B.Tech Computer Science",
              year: details.year || "2024–2028",
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
    (eventSlug: string) => {
      if (!SITE_CONFIG.REG_OPEN) {
        return { success: false, alreadyRegistered: false };
      }
      if (!user) {
        return { success: false, alreadyRegistered: false };
      }

      if (user.registeredEvents.includes(eventSlug)) {
        return { success: true, alreadyRegistered: true };
      }

      const updatedEvents = [...user.registeredEvents, eventSlug];
      const updatedUser: AuthUser = {
        ...user,
        registeredEvents: updatedEvents,
      };

      setUser(updatedUser);
      saveUserToStorage(updatedUser);

      return { success: true, alreadyRegistered: false };
    },
    [user]
  );

  const unregisterEvent = useCallback(
    (eventSlug: string) => {
      if (!user) return;
      const updatedEvents = user.registeredEvents.filter((s) => s !== eventSlug);
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
    (eventSlug: string) => {
      if (!user) return false;
      return user.registeredEvents.includes(eventSlug);
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
