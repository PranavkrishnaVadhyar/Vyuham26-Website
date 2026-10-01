import { useCallback, useEffect, useState } from "react";
import { getAppPath, navigate } from "@/lib/router";

export { getAppPath };

export function usePathname(): string {
  const [pathname, setPathname] = useState(getAppPath);

  useEffect(() => {
    const handleUpdate = () => setPathname(getAppPath());
    window.addEventListener("popstate", handleUpdate);
    window.addEventListener("hashchange", handleUpdate);
    window.addEventListener("app:navigate", handleUpdate);
    return () => {
      window.removeEventListener("popstate", handleUpdate);
      window.removeEventListener("hashchange", handleUpdate);
      window.removeEventListener("app:navigate", handleUpdate);
    };
  }, []);

  return pathname;
}

export function useRouter() {
  const push = useCallback((href: string) => {
    navigate(href);
  }, []);

  const replace = useCallback((href: string) => {
    navigate(href, { replace: true });
  }, []);

  const back = useCallback(() => window.history.back(), []);
  const forward = useCallback(() => window.history.forward(), []);
  const refresh = useCallback(() => window.location.reload(), []);
  const prefetch = useCallback(() => {}, []);

  return { push, replace, back, forward, refresh, prefetch };
}

export function useSearchParams(): URLSearchParams {
  const getParams = () => {
    if (typeof window === "undefined") return new URLSearchParams();
    const hash = window.location.hash;
    if (hash && hash.includes("?")) {
      return new URLSearchParams(hash.slice(hash.indexOf("?")));
    }
    return new URLSearchParams(window.location.search);
  };

  const [params, setParams] = useState(getParams);

  useEffect(() => {
    const update = () => setParams(getParams());
    window.addEventListener("popstate", update);
    window.addEventListener("hashchange", update);
    window.addEventListener("app:navigate", update);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener("hashchange", update);
      window.removeEventListener("app:navigate", update);
    };
  }, []);

  return params;
}

export function notFound() {
  navigate("/404");
}
