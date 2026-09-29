"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  college?: string;
  phone?: string;
  degree?: string;
  year?: string;
  role?: "user" | "admin" | "volunteer";
  registeredEvents: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (email: string, name?: string) => void;
  signup: (details: {
    name: string;
    email: string;
    college?: string;
    phone?: string;
    degree?: string;
    year?: string;
    role?: "user" | "admin" | "volunteer";
  }) => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  logout: () => void;
  registerForEvent: (eventSlug: string) => {
    success: boolean;
    alreadyRegistered: boolean;
  };
  unregisterEvent: (eventSlug: string) => void;
  isEventRegistered: (eventSlug: string) => boolean;
}

const STORAGE_KEY = "vyuham_auth_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize from localStorage safely on client mount
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
  }, []);

  const login = useCallback((email: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    let existingEvents: string[] = [];
    let existingId: string | null = null;
    let existingCollege = "Digital University Kerala";
    let existingPhone: string | undefined = undefined;
    let existingDegree: string | undefined = "B.Tech Computer Science";
    let existingYear: string | undefined = "2024–2028";
    let existingRole: "user" | "admin" | "volunteer" = "user";

    // 1. Check existing AuthUser in localStorage
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

    // 2. Check store users in localStorage for seed accounts or prior registrations
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

    // Special seed admin check
    if (cleanEmail === "admin@vyuham26.in") {
      existingRole = "admin";
      if (!name) name = "VYUHAM CORE";
    } else if (cleanEmail === "volunteer@vyuham26.in") {
      existingRole = "volunteer";
      if (!name) name = "DIVYA MENON";
    }

    const newUser: AuthUser = {
      id: existingId || `VYU26-USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name || email.split("@")[0].toUpperCase(),
      email: email.trim(),
      college: existingCollege,
      phone: existingPhone || "+91 98470 12345",
      degree: existingDegree,
      year: existingYear,
      role: existingRole,
      registeredEvents: existingEvents,
    };

    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      window.dispatchEvent(new CustomEvent("vyuham:auth-change", { detail: newUser }));
    } catch (err) {
      console.error("Storage error:", err);
    }
  }, []);

  const signup = useCallback(
    (details: {
      name: string;
      email: string;
      college?: string;
      phone?: string;
      degree?: string;
      year?: string;
      role?: "user" | "admin" | "volunteer";
    }) => {
      const newUser: AuthUser = {
        id: `VYU26-USR-${Math.floor(1000 + Math.random() * 9000)}`,
        name: details.name,
        email: details.email.trim(),
        college: details.college || "Digital University Kerala",
        phone: details.phone || "",
        degree: details.degree || "B.Tech Computer Science",
        year: details.year || "2024–2028",
        role: details.role || "user",
        registeredEvents: [],
      };

      setUser(newUser);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        window.dispatchEvent(new CustomEvent("vyuham:auth-change", { detail: newUser }));
      } catch (err) {
        console.error("Storage error:", err);
      }
    },
    []
  );

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("vyuham:auth-change", { detail: updated }));
      } catch (err) {
        console.error("Storage error:", err);
      }
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("vyuham:auth-change", { detail: null }));
    } catch (err) {
      console.error("Storage error:", err);
    }
  }, []);

  const registerForEvent = useCallback(
    (eventSlug: string) => {
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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
        window.dispatchEvent(new CustomEvent("vyuham:auth-change", { detail: updatedUser }));
      } catch (err) {
        console.error("Storage error:", err);
      }

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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
        window.dispatchEvent(new CustomEvent("vyuham:auth-change", { detail: updatedUser }));
      } catch (err) {
        console.error("Storage error:", err);
      }
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
