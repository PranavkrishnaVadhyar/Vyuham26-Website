"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  college?: string;
  phone?: string;
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
  }) => void;
  logout: () => void;
  registerForEvent: (eventSlug: string) => {
    success: boolean;
    alreadyRegistered: boolean;
  };
  isEventRegistered: (eventSlug: string) => boolean;
}

const STORAGE_KEY = "vyuham_auth_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    let existingEvents: string[] = [];

    if (existingRaw) {
      try {
        const parsed = JSON.parse(existingRaw);
        if (parsed?.registeredEvents) {
          existingEvents = parsed.registeredEvents;
        }
      } catch {
        // ignore parse error
      }
    }

    const newUser: AuthUser = {
      id: `VYU26-USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name || email.split("@")[0].toUpperCase(),
      email,
      registeredEvents: existingEvents,
    };

    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
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
    }) => {
      const newUser: AuthUser = {
        id: `VYU26-USR-${Math.floor(1000 + Math.random() * 9000)}`,
        name: details.name,
        email: details.email,
        college: details.college,
        phone: details.phone,
        registeredEvents: [],
      };

      setUser(newUser);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      } catch (err) {
        console.error("Storage error:", err);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
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
      } catch (err) {
        console.error("Storage error:", err);
      }

      return { success: true, alreadyRegistered: false };
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
        logout,
        registerForEvent,
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
