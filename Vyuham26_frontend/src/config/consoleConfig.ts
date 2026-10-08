import { useState, useEffect, useCallback } from "react";

export interface ConsoleConfig {
  showAccount: boolean;
  showFestival: boolean;
  showRootGateway: boolean;
}

export const DEFAULT_CONSOLE_CONFIG: ConsoleConfig = {
  showAccount: false,
  showFestival: false,
  showRootGateway: false,
};

export const CONSOLE_STORAGE_KEY = "vyuham26:console_config";
export const CONSOLE_EVENT_KEY = "vyuham:console_config_change";

/**
 * Reads console options from localStorage. Defaults to production-safe (all false).
 */
export function getConsoleConfig(): ConsoleConfig {
  if (typeof window === "undefined") {
    return { ...DEFAULT_CONSOLE_CONFIG };
  }
  try {
    const raw = localStorage.getItem(CONSOLE_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONSOLE_CONFIG };
    const parsed = JSON.parse(raw);
    return {
      showAccount: Boolean(parsed.showAccount),
      showFestival: Boolean(parsed.showFestival),
      showRootGateway: Boolean(parsed.showRootGateway),
    };
  } catch {
    return { ...DEFAULT_CONSOLE_CONFIG };
  }
}

/**
 * Updates console options in localStorage and dispatches a reactive event across the app.
 */
export function setConsoleConfig(update: Partial<ConsoleConfig>): ConsoleConfig {
  const current = getConsoleConfig();
  const next: ConsoleConfig = {
    ...current,
    ...update,
  };

  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(CONSOLE_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(
        new CustomEvent(CONSOLE_EVENT_KEY, {
          detail: next,
        })
      );
    }
  } catch {
    // ignore quota/storage errors
  }

  return next;
}

/**
 * Resets console options to default (all hidden / production safe).
 */
export function resetConsoleConfig(): ConsoleConfig {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CONSOLE_STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent(CONSOLE_EVENT_KEY, {
          detail: { ...DEFAULT_CONSOLE_CONFIG },
        })
      );
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_CONSOLE_CONFIG };
}

/**
 * React hook that returns live console configuration and a function to update it.
 * Auto-syncs across windows and components in real time.
 */
export function useConsoleConfig(): [ConsoleConfig, (update: Partial<ConsoleConfig>) => void] {
  const [config, setConfigState] = useState<ConsoleConfig>(getConsoleConfig);

  useEffect(() => {
    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent<ConsoleConfig>;
      if (customEvent.detail && typeof customEvent.detail === "object") {
        setConfigState({
          showAccount: Boolean(customEvent.detail.showAccount),
          showFestival: Boolean(customEvent.detail.showFestival),
          showRootGateway: Boolean(customEvent.detail.showRootGateway),
        });
      } else {
        setConfigState(getConsoleConfig());
      }
    };

    window.addEventListener(CONSOLE_EVENT_KEY, handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
      window.removeEventListener(CONSOLE_EVENT_KEY, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  const update = useCallback((newValues: Partial<ConsoleConfig>) => {
    const updated = setConsoleConfig(newValues);
    setConfigState(updated);
  }, []);

  return [config, update];
}

export const CONSOLE_PRESETS = {
  PUBLIC_SAFE: {
    id: "PUBLIC_SAFE",
    name: "Pre-Launch (Public Safe)",
    badge: "RECOMMENDED",
    desc: "Hides Account, Festival ops, and Root Gateway commands from public terminal. Safe for website publication.",
    config: { showAccount: false, showFestival: false, showRootGateway: false },
  },
  REG_ACTIVE: {
    id: "REG_ACTIVE",
    name: "Registration Open",
    badge: "REG OPEN",
    desc: "Exposes attendee account & ticket commands. Keeps festival competition modules locked.",
    config: { showAccount: true, showFestival: false, showRootGateway: false },
  },
  FESTIVAL_LIVE: {
    id: "FESTIVAL_LIVE",
    name: "Festival Live Days",
    badge: "OCT 30 - NOV 01",
    desc: "Activates both Account and Festival live operations (leaderboard, certificates, food, check-in).",
    config: { showAccount: true, showFestival: true, showRootGateway: false },
  },
  ADMIN_FULL: {
    id: "ADMIN_FULL",
    name: "Full Manual",
    badge: "ALL MODULES",
    desc: "Exposes all attendee and festival exploration modules in terminal help.",
    config: { showAccount: true, showFestival: true, showRootGateway: false },
  },
} as const;
