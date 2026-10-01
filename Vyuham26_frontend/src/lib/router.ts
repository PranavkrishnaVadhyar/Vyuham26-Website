import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Normalizes a raw pathname or hash to a standard application route path.
 * e.g. "#/events?filter=all" -> "/events"
 *      "#/about" -> "/about"
 *      "" -> "/"
 */
export function normalizePath(raw?: string): string {
  if (!raw) return "/";
  let clean = raw.trim();

  // Strip leading hash character(s)
  if (clean.startsWith("#")) {
    clean = clean.replace(/^#\/?/, "/");
  }

  // Strip query parameters and trailing hash fragments
  clean = clean.split("?")[0].split("#")[0];

  // Ensure leading slash
  if (!clean.startsWith("/")) {
    clean = `/${clean}`;
  }

  // Remove trailing slash if longer than 1 char (e.g. "/events/" -> "/events")
  if (clean.length > 1 && clean.endsWith("/")) {
    clean = clean.slice(0, -1);
  }

  return clean || "/";
}

/**
 * Gets the current application path from the browser environment.
 */
export function getAppPath(): string {
  if (typeof window === "undefined") return "/";

  // First check hash (which is primarily used for static hosting)
  const hash = window.location.hash;
  if (hash && (hash.startsWith("#/") || hash.startsWith("#"))) {
    const fromHash = normalizePath(hash);
    if (fromHash !== "/") return fromHash;
  }

  // Then check pathname
  const path = window.location.pathname;
  if (path && path !== "/") {
    return normalizePath(path);
  }

  return "/";
}

/**
 * Parse query string into a key-value dictionary.
 */
export function parseQueryParams(search?: string): Record<string, string> {
  if (typeof window === "undefined" && !search) return {};
  
  let queryString = search;
  if (queryString === undefined && typeof window !== "undefined") {
    // Check hash for query first e.g. #/events?search=code
    if (window.location.hash.includes("?")) {
      queryString = window.location.hash.slice(window.location.hash.indexOf("?"));
    } else {
      queryString = window.location.search;
    }
  }

  if (!queryString) return {};
  const params = new URLSearchParams(queryString.startsWith("?") ? queryString : `?${queryString}`);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/**
 * Programmatic client-side navigation.
 * Updates hash, pushes/replaces browser history, and broadcasts 'app:navigate'.
 */
export interface NavigateOptions {
  replace?: boolean;
  state?: unknown;
}

export function navigate(to: string, options: NavigateOptions = {}): void {
  if (typeof window === "undefined") return;

  const target = to.trim();
  const isHashAnchor = target.startsWith("/#") || target.startsWith("#");

  let targetHash: string;
  if (isHashAnchor) {
    targetHash = target.startsWith("#") ? target : target.slice(1);
  } else {
    const clean = target.startsWith("/") ? target : `/${target}`;
    targetHash = `#${clean}`;
  }

  if (options.replace) {
    window.location.replace(targetHash);
  } else {
    window.location.hash = targetHash;
  }

  // Broadcast app:navigate event for all listeners
  window.dispatchEvent(new CustomEvent("app:navigate", { detail: target }));
  window.dispatchEvent(new Event("popstate"));
}

/**
 * Matches a route path against a pattern like:
 * - "/events"
 * - "/events/:slug"
 * - "/admin/*"
 */
export interface MatchResult {
  matched: boolean;
  params: Record<string, string>;
}

export function matchPath(pattern: string, path: string, exact = false): MatchResult {
  const normalizedPath = normalizePath(path);
  const normalizedPattern = normalizePath(pattern);

  // Exact match
  if (normalizedPattern === normalizedPath) {
    return { matched: true, params: {} };
  }

  // Wildcard match e.g. "/admin/*"
  if (normalizedPattern.endsWith("/*")) {
    const prefix = normalizedPattern.slice(0, -2);
    if (normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)) {
      const rest = normalizedPath.slice(prefix.length).replace(/^\//, "");
      return { matched: true, params: { wildcard: rest } };
    }
    return { matched: false, params: {} };
  }

  // Dynamic segment matching e.g. "/events/:slug" or "/register/:slug"
  const patternSegments = normalizedPattern.split("/").filter(Boolean);
  const pathSegments = normalizedPath.split("/").filter(Boolean);

  if (!exact && patternSegments.length !== pathSegments.length) {
    return { matched: false, params: {} };
  }
  if (exact && patternSegments.length !== pathSegments.length) {
    return { matched: false, params: {} };
  }

  const params: Record<string, string> = {};
  for (let i = 0; i < patternSegments.length; i++) {
    const pSeg = patternSegments[i];
    const pathSeg = pathSegments[i];

    if (pSeg.startsWith(":")) {
      const paramName = pSeg.slice(1);
      params[paramName] = decodeURIComponent(pathSeg);
    } else if (pSeg !== pathSeg) {
      return { matched: false, params: {} };
    }
  }

  return { matched: true, params };
}

/**
 * Unified Platform Route Hook.
 * Automatically synchronizes with hashchange, popstate, and app:navigate.
 */
export function usePlatformRoute(): string {
  const [route, setRoute] = useState(getAppPath);

  useEffect(() => {
    const handleUpdate = () => setRoute(getAppPath());
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

/**
 * Enhanced hook returning route path, query params, and helper navigation.
 */
export function useRoute() {
  const route = usePlatformRoute();
  const searchParams = useMemo(() => parseQueryParams(), [route]);

  const goTo = useCallback((to: string, options?: NavigateOptions) => {
    navigate(to, options);
  }, []);

  return {
    route,
    pathname: route,
    searchParams,
    navigate: goTo,
  };
}
