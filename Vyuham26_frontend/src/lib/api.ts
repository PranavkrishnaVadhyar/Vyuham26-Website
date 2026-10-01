import { supabase } from "@/lib/supabase";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env as any).API_URL ||
  "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Standard fetch wrapper that automatically injects the active Supabase JWT Bearer token
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // If body is plain object, default to JSON content-type
  if (
    options.body &&
    typeof options.body === "string" &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  // Inject Supabase Auth JWT if session exists
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("Could not retrieve Supabase session token:", err);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    let errorData = null;
    try {
      errorData = await response.json();
      if (errorData?.detail) {
        errorDetail =
          typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail);
      }
    } catch {
      // response was not JSON
    }
    throw new ApiError(errorDetail, response.status, errorData);
  }

  // 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

/* ================================================================== */
/*  TYPED API CLIENTS                                                 */
/* ================================================================== */

export const authApi = {
  getMe: () => apiFetch("/auth/me"),
  updateProfile: (data: {
    name?: string;
    phone?: string;
    college?: string;
    degree?: string;
    year?: string;
  }) =>
    apiFetch("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export const eventsApi = {
  list: () => apiFetch("/events"),
  getBySlug: (slug: string) => apiFetch(`/events/by-slug/${slug}`),
  getById: (id: string) => apiFetch(`/events/${id}`),
};

export const registrationsApi = {
  listMine: () => apiFetch("/registrations/me"),
  register: (payload: { event_id: string; team_id?: string }) =>
    apiFetch("/registrations", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const teamsApi = {
  listMine: () => apiFetch("/teams/me"),
  create: (data: { event_id: string; name: string }) =>
    apiFetch("/teams", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  join: (invite_code: string) =>
    apiFetch("/teams/join", {
      method: "POST",
      body: JSON.stringify({ invite_code }),
    }),
};
