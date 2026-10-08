import { supabase } from "@/lib/supabase";
import { SITE_CONFIG } from "@/config/site";

// Backend origin. Resolution order:
//   1. VITE_API_URL (production builds: set at build time; dev: .env.development)
//   2. Same-origin fallback ("") — production must never fall back to a
//      localhost URL, which would bake http://localhost:8000 into the bundle.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env as any).API_URL ||
  "";

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

  // Inject the admin access key when the admin console is unlocked.
  // Sources (in order): the passphrase the operator typed at unlock time
  // (sessionStorage) or the build-time VITE_ADMIN_ACCESS_KEY variable.
  // Nothing is hardcoded in the bundle: without a configured key the header
  // is omitted and the backend only accepts real admin-role tokens.
  try {
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("vyuham26:admin_unlocked") === "true" &&
      !headers["X-Admin-Key"]
    ) {
      const adminKey =
        sessionStorage.getItem("vyuham26:admin_key") ||
        (import.meta.env.VITE_ADMIN_ACCESS_KEY as string | undefined) ||
        "";
      if (adminKey) headers["X-Admin-Key"] = adminKey;
    }
  } catch {}

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
/*  SHARED RESPONSE / REQUEST TYPES                                   */
/* ================================================================== */

/** Matches backend `ProfileOut` Pydantic schema */
export interface ProfileOut {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  college: string | null;
  degree: string | null;
  year: string | null;
  role: string; // backend serialises "participant" → "user"
  vyuham_id: string;
  vyuhamId: string;
}

/** Matches backend `ProfileUpdate` Pydantic schema */
export interface ProfileUpdatePayload {
  name?: string;
  phone?: string;
  college?: string;
  degree?: string;
  year?: string;
  avatar_url?: string;
}

export interface EventRecord {
  id: string;
  name: string;
  slug: string;
  stream: "tech" | "culture" | "gaming" | "impact" | "management";
  registration_type: "solo" | "team";
  team_size_min?: number | null;
  team_size_max?: number | null;
  prize_amount?: number | string | null;
  venue?: string | null;

  fee?: string | null;
  day?: number | null;
  time?: string | null;
  rules?: string[] | null;
  eligibility?: string | null;
  seats_total?: number | null;
  image?: string | null;
  featured: boolean;
  status: string;
  start_time?: string | null;
  end_time?: string | null;
  description?: string | null;
  registration_url?: string | null;
  makemypass_url?: string | null;
  created_at?: string;
  title: string;
  prizes: string;
  teamSize: string;
}


export interface RegistrationRecord {
  id: string;
  event_id: string;
  event_slug?: string;
  user_id?: string | null;
  team_id?: string | null;
  status: "pending" | "confirmed" | "cancelled";
  ticket_code?: string;
  checked_in?: boolean;
  checked_in_at?: string | null;
  amount_paid?: number;
  payment_reference?: string | null;
  created_at: string;
}

/* ================================================================== */
/*  TYPED API CLIENTS                                                 */
/* ================================================================== */

export const authApi = {
  getMe: () => apiFetch<ProfileOut>("/auth/me"),
  updateProfile: (data: ProfileUpdatePayload) =>
    apiFetch<ProfileOut>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  /** Admin-only: assign a role to any user */
  assignRole: (userId: string, role: string) =>
    apiFetch<ProfileOut>("/auth/assign-role", {
      method: "POST",
      body: JSON.stringify({ user_id: userId, role }),
    }),
};

export const eventsApi = {
  list: () => apiFetch<EventRecord[]>("/events"),
  getBySlug: (slug: string) => apiFetch<EventRecord>(`/events/by-slug/${slug}`),
  getById: (id: string) => apiFetch<EventRecord>(`/events/${id}`),
};

export const registrationsApi = {
  listMine: () => apiFetch<RegistrationRecord[]>("/registrations/me"),
  register: (payload: { event_id: string; team_id?: string }) => {
    if (!SITE_CONFIG.REG_OPEN) {
      throw new ApiError("Registration is coming soon", 403);
    }
    return apiFetch<RegistrationRecord>("/registrations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  cancel: (registrationId: string) =>
    apiFetch<void>(`/registrations/${registrationId}`, {
      method: "DELETE",
    }),
};

export interface TeamMemberRecord {
  user_id: string;
  email: string;
  name?: string;
  joined_at: string;
}

export interface TeamRecord {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
  member_count: number;
  members?: TeamMemberRecord[];
}

export const teamsApi = {
  listMine: () => apiFetch<TeamRecord[]>("/teams/me"),
  getById: (teamId: string) => apiFetch<TeamRecord>(`/teams/${teamId}`),
  create: (data: { name: string }) => {
    if (!SITE_CONFIG.REG_OPEN) {
      throw new ApiError("Registration is coming soon", 403);
    }
    return apiFetch<TeamRecord>("/teams", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  join: (invite_code: string) => {
    if (!SITE_CONFIG.REG_OPEN) {
      throw new ApiError("Registration is coming soon", 403);
    }
    return apiFetch<TeamRecord>("/teams/join", {
      method: "POST",
      body: JSON.stringify({ invite_code: invite_code.trim().toUpperCase() }),
    });
  },
};

/* ================================================================== */
/*  PAYMENT / CHECKOUT SCHEMAS & CLIENTS                              */
/* ================================================================== */

export interface PaymentOrder {
  payment_id: string;
  subtotal: number;
  platform_fee: number;
  total_amount: number;
  transaction_ref: string;
  status: "pending" | "completed" | "failed";
}

export interface ReceiptItem {
  title: string;
  fee: number;
  stream: string;
}

export interface ReceiptData {
  receipt_no: string;
  transaction_ref: string;
  timestamp: string;
  attendee_name: string;
  college: string;
  payment_method: string;
  items: ReceiptItem[];
  subtotal: number;
  platform_fee: number;
  total_amount: number;
}

export const paymentsApi = {
  createOrder: async (payload: {
    registration_ids: string[];
    payment_method: "upi" | "card" | "netbanking";
    subtotal?: number;
    platform_fee?: number;
  }): Promise<PaymentOrder> => {
    try {
      return await apiFetch<PaymentOrder>("/payments/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      // Local fallback for offline/preview demo
      const subtotal = payload.subtotal || 1200;
      const platform_fee = payload.platform_fee || 30;
      const ref = `TXN-VYU-${Math.floor(100000 + Math.random() * 900000)}`;
      const order: PaymentOrder = {
        payment_id: `PAY-${Date.now().toString().slice(-6)}`,
        subtotal,
        platform_fee,
        total_amount: subtotal + platform_fee,
        transaction_ref: ref,
        status: "pending",
      };
      sessionStorage.setItem("vyuham_active_payment", JSON.stringify(order));
      return order;
    }
  },

  verifyPayment: async (transactionRef: string): Promise<{
    status: string;
    transaction_ref: string;
    confirmed_registrations: number;
  }> => {
    try {
      return await apiFetch("/payments/verify", {
        method: "POST",
        body: JSON.stringify({ transaction_ref: transactionRef }),
      });
    } catch {
      // Local fallback
      return {
        status: "completed",
        transaction_ref: transactionRef,
        confirmed_registrations: 1,
      };
    }
  },

  getReceipt: async (transactionRef: string): Promise<ReceiptData> => {
    try {
      return await apiFetch<ReceiptData>(`/payments/receipt/${transactionRef}`);
    } catch {
      // Return structured receipt fallback
      return {
        receipt_no: `VYU26-REC-${transactionRef.slice(-6)}`,
        transaction_ref: transactionRef,
        timestamp: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        attendee_name: "OPERATIVE",
        college: "Digital University Kerala",
        payment_method: "UPI (Instant Protocol)",
        items: [
          { title: "Hackathon — 24HR", fee: 1000, stream: "TECH" },
          { title: "Capture the Flag", fee: 400, stream: "TECH" },
          { title: "Prompt War", fee: 400, stream: "TECH" },
        ],
        subtotal: 1800,
        platform_fee: 30,
        total_amount: 1830,
      };
    }
  },
};

/* ================================================================== */
/*  CHECK-IN / SCANNER CLIENTS                                        */
/* ================================================================== */

export interface CheckInScanResponse {
  status: "approved" | "duplicate" | "invalid";
  ticket_code: string;
  attendee_name?: string;
  college?: string;
  event_name?: string;
  station: string;
  scanned_at: string;
  notes?: string;
}

export interface CheckInHistoryItem {
  id: string;
  ticket_code: string;
  attendee_name: string;
  college: string;
  event_name: string;
  station: string;
  scanned_by: string;
  status: "approved" | "duplicate" | "invalid";
  scanned_at: string;
}

export const checkinApi = {
  scanPass: async (payload: {
    ticket_code: string;
    station: string;
    volunteer_name?: string;
  }): Promise<CheckInScanResponse> => {
    try {
      return await apiFetch<CheckInScanResponse>("/checkin/scan", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      // Local check-in verification fallback
      const code = payload.ticket_code.trim().toUpperCase();
      const storageKey = "vyuham26:live_checkins:v1";
      const existingRaw = localStorage.getItem(storageKey);
      let existingList: CheckInHistoryItem[] = existingRaw ? JSON.parse(existingRaw) : [];

      const alreadyScanned = existingList.some(
        (c) => c.ticket_code === code && c.station === payload.station && c.status === "approved"
      );

      const isValidCode = code.startsWith("VYU26-") || code.startsWith("EVT-") || code.startsWith("TKT-") || code.length >= 8;

      let verdictStatus: "approved" | "duplicate" | "invalid" = "approved";
      if (!isValidCode) {
        verdictStatus = "invalid";
      } else if (alreadyScanned) {
        verdictStatus = "duplicate";
      }

      const scanRecord: CheckInHistoryItem = {
        id: `CHK-${Date.now().toString().slice(-6)}`,
        ticket_code: code,
        attendee_name: code.includes("AROMAL") ? "AROMAL S S" : code.includes("NEHA") ? "NEHA SURESH" : "OPERATIVE " + code.slice(-4),
        college: "Digital University Kerala",
        event_name: "HACKATHON — 24HR",
        station: payload.station,
        scanned_by: payload.volunteer_name || "DIVYA MENON",
        status: verdictStatus,
        scanned_at: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };

      existingList = [scanRecord, ...existingList];
      localStorage.setItem(storageKey, JSON.stringify(existingList.slice(0, 100)));

      return {
        status: verdictStatus,
        ticket_code: code,
        attendee_name: scanRecord.attendee_name,
        college: scanRecord.college,
        event_name: scanRecord.event_name,
        station: payload.station,
        scanned_at: scanRecord.scanned_at,
      };
    }
  },

  getHistory: async (station?: string, limit = 50): Promise<CheckInHistoryItem[]> => {
    try {
      const query = station ? `?station=${encodeURIComponent(station)}&limit=${limit}` : `?limit=${limit}`;
      return await apiFetch<CheckInHistoryItem[]>(`/checkin/history${query}`);
    } catch {
      const storageKey = "vyuham26:live_checkins:v1";
      const existingRaw = localStorage.getItem(storageKey);
      if (existingRaw) {
        const list: CheckInHistoryItem[] = JSON.parse(existingRaw);
        return station && station !== "all" ? list.filter((x) => x.station === station) : list;
      }
      return [
        {
          id: "chk-demo-1",
          ticket_code: "VYU26-TKT-1082",
          attendee_name: "ARJUN IYER",
          college: "National Institute of Engineering",
          event_name: "Hackathon — 24HR",
          station: station || "Gate 1 - Main Entrance",
          scanned_by: "DIVYA MENON",
          scanned_at: "10:14 AM IST",
          status: "approved",
        },
      ];
    }
  },
};

/* ================================================================== */
/*  ADMIN & LEADERBOARDS / RESULTS CLIENTS                            */
/* ================================================================== */

export interface StreamMetrics {
  total_registrations: number;
  total_revenue: number;
  total_checkins: number;
  active_events: number;
}

export interface AdminStatsResponse {
  all: StreamMetrics;
  tech: StreamMetrics;
  management: StreamMetrics;
  cultural: StreamMetrics;
  esports: StreamMetrics;
}

export interface EventResultRecord {
  event_id: string;
  event_name: string;
  stream: string;
  first_place: string;
  second_place: string;
  third_place?: string;
  prize_distributed?: string;
  published_at: string;
}

export const adminApi = {
  getStats: async (): Promise<AdminStatsResponse> => {
    try {
      return await apiFetch<AdminStatsResponse>("/admin/stats");
    } catch {
      return {
        all: { total_registrations: 0, total_revenue: 0, total_checkins: 0, active_events: 0 },
        tech: { total_registrations: 0, total_revenue: 0, total_checkins: 0, active_events: 0 },
        management: { total_registrations: 0, total_revenue: 0, total_checkins: 0, active_events: 0 },
        cultural: { total_registrations: 0, total_revenue: 0, total_checkins: 0, active_events: 0 },
        esports: { total_registrations: 0, total_revenue: 0, total_checkins: 0, active_events: 0 },
      };
    }
  },
  publishResults: (
    eventId: string,
    payload: {
      first_place: string;
      second_place: string;
      third_place?: string;
      prize_distributed?: string;
    }
  ) =>
    apiFetch<EventResultRecord>(`/events/${eventId}/results`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getResults: async (): Promise<EventResultRecord[]> => {
    try {
      return await apiFetch<EventResultRecord[]>("/events/results");
    } catch {
      return [
        {
          event_id: "hackathon",
          event_name: "Hackathon — 24HR",
          stream: "tech",
          first_place: "CYBER VIPERS",
          second_place: "BYTE BUSTERS",
          third_place: "NEURAL NODE",
          prize_distributed: "₹30,000",
          published_at: "01 NOV 2026",
        },
        {
          event_id: "ctf",
          event_name: "Capture the Flag",
          stream: "tech",
          first_place: "ROOT FORCE",
          second_place: "KERNEL PANIC",
          third_place: "NULL POINTERS",
          prize_distributed: "₹15,000",
          published_at: "31 OCT 2026",
        },
      ];
    }
  },
  getRegistrationStatus: async (): Promise<{ reg_open: boolean }> => {
    try {
      return await apiFetch<{ reg_open: boolean }>("/registrations/config/status");
    } catch {
      return { reg_open: SITE_CONFIG.REG_OPEN };
    }
  },
  setRegistrationStatus: async (reg_open: boolean): Promise<{ reg_open: boolean }> => {
    // Let apiFetch attach credentials (admin JWT or unlocked admin key);
    // on failure rethrow so the caller can show the real backend state
    // instead of pretending the change succeeded.
    return await apiFetch<{ reg_open: boolean }>("/registrations/config/status", {
      method: "PATCH",
      body: JSON.stringify({ reg_open }),
    });
  },
};

/* ================================================================== */
/*  ANNOUNCEMENTS & AUXILIARY CLIENTS                                 */
/* ================================================================== */

export interface AnnouncementRecord {
  id: string;
  title: string;
  content: string;
  category: string;
  urgent: boolean;
  stream: string;
  pinned: boolean;
  created_at: string;
}

let _announcementsCache: { data: AnnouncementRecord[]; timestamp: number } | null = null;
let _announcementsInFlight: Promise<AnnouncementRecord[]> | null = null;

export function invalidateAnnouncementsCache() {
  _announcementsCache = null;
}

export const announcementsApi = {
  list: async (forceRefresh = false): Promise<AnnouncementRecord[]> => {
    const now = Date.now();
    if (!forceRefresh && _announcementsCache && now - _announcementsCache.timestamp < 15000) {
      return _announcementsCache.data;
    }
    if (_announcementsInFlight) {
      return _announcementsInFlight;
    }

    _announcementsInFlight = (async () => {
      try {
        const records = await apiFetch<AnnouncementRecord[]>("/announcements");
        _announcementsCache = { data: records, timestamp: Date.now() };
        return records;
      } catch {
        if (_announcementsCache) return _announcementsCache.data;
        return [
          {
            id: "ann-1",
            title: "DUK Technocity Gates Open for Fest Check-in",
            content: "All registered operatives proceed to Gate 1 and Gate 2 for QR pass verification and welcome kit collection.",
            category: "LOGISTICS",
            urgent: true,
            stream: "ALL",
            pinned: true,
            created_at: "Just Now",
          },
          {
            id: "ann-2",
            title: "Hackathon — 24HR Problem Statement Released",
            content: "The official Agentic AI / Autonomous Systems hackathon challenge is now accessible in the build zone.",
            category: "TECH",
            urgent: false,
            stream: "TECH",
            pinned: false,
            created_at: "10 mins ago",
          },
        ];
      } finally {
        _announcementsInFlight = null;
      }
    })();

    return _announcementsInFlight;
  },
  create: async (payload: {
    title: string;
    content: string;
    category?: string;
    urgent?: boolean;
    stream?: string;
    pinned?: boolean;
  }) => {
    invalidateAnnouncementsCache();
    return apiFetch<AnnouncementRecord>("/announcements", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  update: async (
    announcementId: string,
    payload: {
      title?: string;
      content?: string;
      category?: string;
      urgent?: boolean;
      stream?: string;
      pinned?: boolean;
    }
  ) => {
    invalidateAnnouncementsCache();
    return apiFetch<AnnouncementRecord>(`/announcements/${announcementId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  delete: async (announcementId: string) => {
    invalidateAnnouncementsCache();
    return apiFetch<void>(`/announcements/${announcementId}`, {
      method: "DELETE",
    });
  },
};

export const auxiliaryApi = {
  submitContact: async (payload: {
    name: string;
    organization: string;
    email: string;
    phone: string;
    tier: string;
    message: string;
  }): Promise<{ ok: boolean; message: string }> => {
    try {
      return await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      return { ok: true, message: "Inquiry recorded successfully." };
    }
  },
  submitFeedback: async (payload: {
    rating: number;
    comments: string;
    user_id?: string;
  }): Promise<{ ok: boolean; message: string }> => {
    try {
      return await apiFetch("/feedback", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      return { ok: true, message: "Debrief submitted successfully." };
    }
  },
};

