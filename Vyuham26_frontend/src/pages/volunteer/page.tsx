import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker } from "@/components/ui/Elements";
import { useApp } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { checkinApi, type CheckInHistoryItem } from "@/lib/api";
import { toast } from "@/components/ui/Toaster";
import { cyberAudio } from "@/lib/cyberAudio";
import type { CheckInRecord } from "@/data/types";

/* ------------------------------------------------------------------ */
/*  STATIONS                                                          */
/* ------------------------------------------------------------------ */
const STATIONS = [
  "Gate 1 - Main Entrance",
  "Gate 2 - Tech & Hackathon Arena",
  "Gate 3 - Cyber CTF Deck",
  "Gate 4 - Cultural Amphitheatre",
  "Station 5 - Food Court & Wallet Deck",
  "Station 6 - VIP & Speaker Deck",
];

/* ------------------------------------------------------------------ */
/*  Synthesized audio feedback for scanner                            */
/* ------------------------------------------------------------------ */
function playScanSound(type: "approved" | "duplicate" | "invalid") {
  try {
    const ctx = cyberAudio.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === "approved") {
      // High-tech futuristic double chime
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.0, now + 0.08); // A5
      osc.frequency.setValueAtTime(1174.66, now + 0.16); // D6
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "duplicate") {
      // Mid-pitch warning buzzer
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(330, now + 0.1);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.27);
    } else {
      // Low error alarm buzz
      osc.type = "square";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(140, now + 0.12);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    }
  } catch {
    // Audio context unavailable
  }
}

export default function VolunteerScannerPage() {
  const { user, users, checkins, addCheckin, clearCheckins, registrations, content, login } = useApp();
  const auth = useAuth();

  // Authentication & Session
  const [station, setStation] = useState<string>(() => user?.station || STATIONS[0]);
  const [authEmail, setAuthEmail] = useState("volunteer@vyuham26.in");
  const [authPw, setAuthPw] = useState("volunteer26");

  // Camera & Scanner State
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanLoopRef = useRef<number | null>(null);

  // Scan Results
  const [manualCode, setManualCode] = useState("");
  const [rapidMode, setRapidMode] = useState(false);
  const [activeResult, setActiveResult] = useState<{
    status: "approved" | "duplicate" | "invalid";
    ticketCode: string;
    attendeeName: string;
    college: string;
    eventName: string;
    scannedAt: string;
    originalCheckin?: CheckInRecord;
  } | null>(null);

  // Search & Filter in log
  const [filterQuery, setFilterQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "duplicate" | "invalid">("all");

  const effectiveRole = auth.user?.role || user?.role;
  const isVolunteerOrAdmin =
    effectiveRole === "volunteer" ||
    effectiveRole === "event_head" ||
    effectiveRole === "admin";

  const [liveHistory, setLiveHistory] = useState<CheckInHistoryItem[]>([]);

  const loadHistory = useCallback(async () => {
    try {
      const hist = await checkinApi.getHistory(station);
      if (Array.isArray(hist)) setLiveHistory(hist);
    } catch {}
  }, [station]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  /* ------------------------------------------------------------------ */
  /*  CAMERA CONTROLS                                                   */
  /* ------------------------------------------------------------------ */
  const stopCamera = useCallback(() => {
    if (scanLoopRef.current) {
      cancelAnimationFrame(scanLoopRef.current);
      scanLoopRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const processScannedValue = useCallback(
    async (rawPayload: string) => {
      const clean = rawPayload.trim();
      if (!clean) return;

      const timeStr = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      try {
        const res = await checkinApi.scanPass({
          ticket_code: clean,
          station,
          volunteer_name: auth.user?.name || user?.name || "DIVYA MENON",
        });

        playScanSound(res.status);

        const newRecord: CheckInRecord = {
          id: `chk-${Date.now()}`,
          ticketCode: res.ticket_code,
          attendeeName: res.attendee_name || "UNKNOWN OPERATIVE",
          college: res.college || "Digital University Kerala",
          eventName: res.event_name || "VYUHAM'26 PASS",
          station,
          scannedBy: auth.user?.name || user?.name || "VOLUNTEER",
          scannedAt: timeStr,
          status: res.status,
          notes: res.notes,
        };
        addCheckin(newRecord);

        setActiveResult({
          status: res.status,
          ticketCode: res.ticket_code,
          attendeeName: res.attendee_name || "UNKNOWN OPERATIVE",
          college: res.college || "Digital University Kerala",
          eventName: res.event_name || "VYUHAM'26 PASS",
          scannedAt: timeStr,
        });

        if (res.status === "approved") {
          toast(`✓ [APPROVED] ${res.attendee_name} admitted at ${station}`, "info");
        } else if (res.status === "duplicate") {
          toast(`⚠️ [DUPLICATE PASS] Attendee already checked in at ${station}.`, "warn");
        } else {
          toast("⛔ [INVALID CODE] Pass not recognized in registry.", "warn");
        }

        loadHistory();

        if (rapidMode) {
          setTimeout(() => {
            setActiveResult((prev) => (prev?.ticketCode === clean ? null : prev));
          }, 2400);
        }
      } catch (err: any) {
        playScanSound("invalid");
        toast(`Scanner error: ${err?.message || "Network error"}`, "error");
      }
    },
    [station, user, auth.user, addCheckin, loadHistory, rapidMode]
  );

  const startCamera = useCallback(async () => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser environment.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setCameraActive(true);

        // Check if BarcodeDetector is available natively
        const anyWin = window as unknown as {
          BarcodeDetector?: new (options?: { formats: string[] }) => {
            detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue: string }>>;
          };
        };
        if (typeof anyWin.BarcodeDetector === "function") {
          const detector = new anyWin.BarcodeDetector({ formats: ["qr_code", "code_128", "code_39"] });

          let lastDetected = "";
          let lastTime = 0;

          const scanLoop = async () => {
            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
              try {
                const barcodes = await detector.detect(videoRef.current);
                if (barcodes && barcodes.length > 0) {
                  const val = barcodes[0].rawValue;
                  const now = Date.now();
                  if (val && (val !== lastDetected || now - lastTime > 3000)) {
                    lastDetected = val;
                    lastTime = now;
                    processScannedValue(val);
                  }
                }
              } catch {
                // frame detection error
              }
            }
            scanLoopRef.current = requestAnimationFrame(scanLoop);
          };
          scanLoopRef.current = requestAnimationFrame(scanLoop);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to access device camera.";
      setCameraError(msg);
      setCameraActive(false);
    }
  }, [facingMode, stopCamera, processScannedValue]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  /* ------------------------------------------------------------------ */
  /*  FILTERED CHECK-IN RECORDS                                         */
  /* ------------------------------------------------------------------ */
  const filteredRecords = checkins.filter((c) => {
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    const q = filterQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      c.attendeeName.toLowerCase().includes(q) ||
      c.ticketCode.toLowerCase().includes(q) ||
      c.eventName.toLowerCase().includes(q) ||
      c.station.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const totalScanned = checkins.length;
  const approvedCount = checkins.filter((c) => c.status === "approved").length;
  const duplicateCount = checkins.filter((c) => c.status === "duplicate").length;
  const invalidCount = checkins.filter((c) => c.status === "invalid").length;

  const handleExportCSV = () => {
    if (checkins.length === 0) {
      toast("No scan records to export.", "warn");
      return;
    }
    const headers = ["ID", "TICKET_CODE", "ATTENDEE", "COLLEGE", "EVENT", "STATION", "SCANNED_BY", "TIMESTAMP", "STATUS"];
    const rows = checkins.map((c) => [
      c.id,
      `"${c.ticketCode}"`,
      `"${c.attendeeName}"`,
      `"${c.college}"`,
      `"${c.eventName}"`,
      `"${c.station}"`,
      `"${c.scannedBy}"`,
      `"${c.scannedAt}"`,
      c.status.toUpperCase(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vyuham26_checkins_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Check-in registry exported to CSV.", "info");
  };

  /* ================================================================== */
  /*  VOLUNTEER LOGIN GATE (When not authenticated as volunteer/admin)  */
  /* ================================================================== */
  if (!isVolunteerOrAdmin) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#030605] pt-24 pb-20 text-[#dff6ec]">
          <div className="mx-auto w-[min(540px,calc(100%-32px))]">
            <AnimatedSection>
              <div className="border border-[rgba(24,196,124,0.3)] bg-[rgba(6,15,11,0.94)] p-6 md:p-8 shadow-[0_0_40px_rgba(24,196,124,0.15)] backdrop-blur-xl">
                <div className="flex items-center gap-2 border-b border-[rgba(24,196,124,0.2)] pb-4">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-mono text-[10px] tracking-[0.24em] text-cyan-400">
                    GATE CONTROL CONSOLE // RESTRICTED ACCESS
                  </span>
                </div>

                <div className="mt-5 text-center">
                  <Kicker>Volunteer Clearance Required</Kicker>
                  <h1 className="mt-2 font-display text-[28px] font-bold text-[#eef8f3]">
                    VOLUNTEER SCANNER ACCESS
                  </h1>
                  <p className="mt-2 text-xs text-[#87a599]">
                    Authenticate with your assigned volunteer or coordinator credentials to activate the live ticket verification camera.
                  </p>
                </div>

                {/* Quick 1-Click Volunteer Login for Instant Testing */}
                <div className="mt-6 border border-cyan-500/30 bg-cyan-950/20 p-4">
                  <p className="font-mono text-[9px] font-bold tracking-[0.2em] text-cyan-400">
                    QUICK ONE-CLICK DEMO AUTHENTICATION:
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => {
                        const r = login("volunteer@vyuham26.in", "volunteer26");
                        toast(r.message, r.ok ? "info" : "warn");
                      }}
                      className="flex-1 border border-cyan-500/60 bg-cyan-900/40 px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] text-cyan-300 transition-colors hover:bg-cyan-800/60"
                    >
                      <span className="block font-bold">▶ DIVYA MENON</span>
                      <span className="text-[8px] text-cyan-400/80">Role: Gate Volunteer</span>
                    </button>
                    <button
                      onClick={() => {
                        const r = login("admin@vyuham26.in", "vyuham26");
                        toast(r.message, r.ok ? "info" : "warn");
                      }}
                      className="flex-1 border border-emerald-500/60 bg-emerald-900/40 px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] text-emerald-300 transition-colors hover:bg-emerald-800/60"
                    >
                      <span className="block font-bold">▶ VYUHAM CORE</span>
                      <span className="text-[8px] text-emerald-400/80">Role: Administrator</span>
                    </button>
                  </div>
                </div>

                {/* Manual Volunteer Credentials Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const r = login(authEmail, authPw);
                    toast(r.message, r.ok ? "info" : "warn");
                  }}
                  className="mt-6 space-y-3"
                >
                  <div>
                    <label className="block font-mono text-[9px] tracking-[0.2em] text-[#739789]">
                      VOLUNTEER EMAIL:
                    </label>
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      required
                      className="mt-1 w-full border border-white/10 bg-[#07100c]/80 px-3 py-2.5 font-mono text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] tracking-[0.2em] text-[#739789]">
                      ACCESS PASSWORD:
                    </label>
                    <input
                      type="password"
                      value={authPw}
                      onChange={(e) => setAuthPw(e.target.value)}
                      required
                      className="mt-1 w-full border border-white/10 bg-[#07100c]/80 px-3 py-2.5 font-mono text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full border border-cyan-500/60 bg-cyan-950/80 py-2.5 font-mono text-xs font-bold tracking-[0.24em] text-cyan-300 transition-all hover:bg-cyan-900"
                  >
                    ACTIVATE VOLUNTEER SCANNER
                  </button>
                </form>

                <div className="mt-6 border-t border-[rgba(120,160,145,0.14)] pt-3 text-center">
                  <p className="font-mono text-[8px] tracking-[0.16em] text-[#527768]">
                    NOTE: Administrators can assign and enrol any student as a volunteer via the Central Admin Panel.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  /* ================================================================== */
  /*  AUTHENTICATED VOLUNTEER SCANNER DASHBOARD                         */
  /* ================================================================== */
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#020504] pt-24 pb-20 text-[#dff6ec]">
        <div className="mx-auto w-[min(1280px,calc(100%-32px))]">
          {/* Volunteer Header Info Banner */}
          <AnimatedSection>
            <div className="flex flex-col justify-between gap-4 border border-[rgba(24,196,124,0.25)] bg-[rgba(6,15,11,0.85)] p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-cyan-500/40 bg-cyan-950/40 font-mono text-xs font-bold text-cyan-400">
                  VOL
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#eef8f3]">{user.name}</span>
                    <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 font-mono text-[8px] font-semibold text-cyan-300 border border-cyan-500/30">
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                  <p className="font-mono text-[9px] text-[#6b9181]">{user.email}</p>
                </div>
              </div>

              {/* Station Duty Selector */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[9px] tracking-[0.2em] text-[#719888]">STATION:</span>
                <select
                  value={station}
                  onChange={(e) => setStation(e.target.value)}
                  className="border border-cyan-500/40 bg-[#050c09] px-2.5 py-1.5 font-mono text-[10px] text-cyan-300 outline-none"
                >
                  {STATIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {/* Continuous Rapid-Scan Switch */}
                <button
                  type="button"
                  onClick={() => setRapidMode((r) => !r)}
                  className={`border px-2.5 py-1.5 font-mono text-[10px] tracking-[0.16em] transition-colors ${
                    rapidMode
                      ? "border-emerald-400 bg-emerald-950 text-emerald-300"
                      : "border-white/10 bg-black/40 text-[#719888] hover:text-white"
                  }`}
                  title="Rapid Mode automatically resets scanner after 2.4s"
                >
                  RAPID SCAN: {rapidMode ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* Top Shift Telemetry Metrics */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="border border-[rgba(120,160,145,0.18)] bg-[#050a08] p-3 text-center">
              <span className="font-mono text-[8px] tracking-[0.24em] text-[#557e6d]">TOTAL SCANNED</span>
              <p className="t-cond text-[28px] font-bold text-white">{totalScanned}</p>
            </div>
            <div className="border border-emerald-500/30 bg-[#05140d] p-3 text-center">
              <span className="font-mono text-[8px] tracking-[0.24em] text-emerald-400">APPROVED</span>
              <p className="t-cond text-[28px] font-bold text-emerald-300">{approvedCount}</p>
            </div>
            <div className="border border-amber-500/30 bg-[#140e05] p-3 text-center">
              <span className="font-mono text-[8px] tracking-[0.24em] text-amber-400">DUPLICATES</span>
              <p className="t-cond text-[28px] font-bold text-amber-300">{duplicateCount}</p>
            </div>
            <div className="border border-red-500/30 bg-[#140505] p-3 text-center">
              <span className="font-mono text-[8px] tracking-[0.24em] text-red-400">INVALID</span>
              <p className="t-cond text-[28px] font-bold text-red-300">{invalidCount}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* LEFT COLUMN: Camera QR Scanner & Manual Input */}
            <div className="space-y-6">
              <div className="border border-[rgba(24,196,124,0.3)] bg-[rgba(6,15,11,0.9)] p-5 md:p-6 shadow-[0_0_30px_rgba(24,196,124,0.1)]">
                <div className="flex items-center justify-between border-b border-[rgba(24,196,124,0.18)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${cameraActive ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                    <span className="font-mono text-[10px] tracking-[0.22em] text-[#86af9d]">
                      {cameraActive ? "OPTICAL SENSOR ACTIVE" : "CAMERA STANDBY"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {cameraActive && (
                      <button
                        onClick={() => {
                          setFacingMode((m) => (m === "environment" ? "user" : "environment"));
                          setTimeout(startCamera, 100);
                        }}
                        className="border border-[rgba(24,196,124,0.3)] bg-[#071a11] px-2 py-1 font-mono text-[9px] text-[#18c47c] hover:border-[#18c47c]"
                      >
                        FLIP CAM
                      </button>
                    )}
                    <button
                      onClick={cameraActive ? stopCamera : startCamera}
                      className={`border px-3 py-1 font-mono text-[10px] font-bold tracking-[0.18em] transition-colors ${
                        cameraActive
                          ? "border-red-500/60 bg-red-950/60 text-red-300 hover:bg-red-900"
                          : "border-emerald-500/60 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900"
                      }`}
                    >
                      {cameraActive ? "STOP CAMERA" : "START CAMERA SCANNER"}
                    </button>
                  </div>
                </div>

                {/* Viewfinder Display Box */}
                <div className="relative mt-4 flex min-h-[320px] w-full flex-col items-center justify-center overflow-hidden rounded-md border border-[rgba(24,196,124,0.25)] bg-[#030705]">
                  {/* Camera Video Stream */}
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className={`h-full w-full object-cover ${cameraActive ? "block" : "hidden"}`}
                  />

                  {/* Standby Viewfinder Placeholder */}
                  {!cameraActive && (
                    <div className="flex flex-col items-center p-8 text-center">
                      <div className="relative mb-4 flex h-20 w-20 items-center justify-center border-2 border-dashed border-emerald-500/40 rounded-lg">
                        <span className="font-mono text-2xl text-emerald-400">◈</span>
                      </div>
                      <p className="font-mono text-xs font-semibold text-[#c7e5d8]">
                        CAMERA SENSOR IS IN STANDBY
                      </p>
                      <p className="mt-1 max-w-[280px] font-mono text-[9px] text-[#557e6d]">
                        Click "Start Camera Scanner" to enable direct device optical QR verification, or test using the simulation triggers below.
                      </p>
                      {cameraError && (
                        <p className="mt-3 rounded border border-red-500/40 bg-red-950/40 p-2 font-mono text-[9px] text-red-400">
                          {cameraError}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Targeting Crosshairs and Laser Reticle (When Camera Active) */}
                  {cameraActive && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      {/* Corner Target Markers */}
                      <div className="relative h-60 w-60">
                        <div className="absolute top-0 left-0 h-6 w-6 border-t-2 border-l-2 border-emerald-400" />
                        <div className="absolute top-0 right-0 h-6 w-6 border-t-2 border-r-2 border-emerald-400" />
                        <div className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-emerald-400" />
                        <div className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-emerald-400" />

                        {/* Moving Scan Beam Line */}
                        <div className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#18c47c] animate-scanner-beam" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Manual Code Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!manualCode.trim()) return;
                    processScannedValue(manualCode);
                    setManualCode("");
                  }}
                  className="mt-4"
                >
                  <label className="block font-mono text-[9px] tracking-[0.2em] text-[#719888]">
                    MANUAL ENTRY (TICKET / REGISTRATION ID / EMAIL):
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      placeholder="e.g. VYU26-TKT-1082 or arjun@student.in"
                      className="flex-1 border border-white/10 bg-[#040907] px-3.5 py-2 font-mono text-xs text-emerald-300 placeholder-white/20 outline-none focus:border-emerald-400"
                    />
                    <button
                      type="submit"
                      className="border border-emerald-500/60 bg-emerald-950/70 px-4 py-2 font-mono text-[10px] font-bold tracking-[0.2em] text-emerald-300 hover:bg-emerald-900"
                    >
                      VERIFY
                    </button>
                  </div>
                </form>

                {/* Test Simulation Controls */}
                <div className="mt-5 border-t border-[rgba(24,196,124,0.14)] pt-3">
                  <p className="font-mono text-[8px] tracking-[0.2em] text-[#557e6d]">
                    SIMULATION TEST BENCH (CLICK TO VERIFY CODES INSTANTLY):
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => processScannedValue("VYU26-TKT-1082")}
                      className="border border-emerald-500/30 bg-emerald-950/30 px-2 py-1 font-mono text-[9px] text-emerald-300 hover:border-emerald-400"
                    >
                      + Test Pass: Arjun Iyer
                    </button>
                    <button
                      type="button"
                      onClick={() => processScannedValue("VYU26-REG-4821")}
                      className="border border-emerald-500/30 bg-emerald-950/30 px-2 py-1 font-mono text-[9px] text-emerald-300 hover:border-emerald-400"
                    >
                      + Test Pass: Meera Nair
                    </button>
                    <button
                      type="button"
                      onClick={() => processScannedValue("VYU26-TKT-1082")}
                      className="border border-amber-500/30 bg-amber-950/30 px-2 py-1 font-mono text-[9px] text-amber-300 hover:border-amber-400"
                    >
                      + Test Duplicate Scan
                    </button>
                    <button
                      type="button"
                      onClick={() => processScannedValue("FAKE-QR-XYZ-999")}
                      className="border border-red-500/30 bg-red-950/30 px-2 py-1 font-mono text-[9px] text-red-300 hover:border-red-400"
                    >
                      + Test Invalid Pass
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Verification Card Pop-Up */}
              {activeResult && (
                <div
                  className={`border-2 p-5 shadow-2xl transition-all duration-300 ${
                    activeResult.status === "approved"
                      ? "border-emerald-400 bg-emerald-950/80 shadow-[0_0_40px_rgba(24,196,124,0.3)]"
                      : activeResult.status === "duplicate"
                      ? "border-amber-500 bg-amber-950/80 shadow-[0_0_40px_rgba(245,158,11,0.25)]"
                      : "border-red-500 bg-red-950/80 shadow-[0_0_40px_rgba(239,68,68,0.25)]"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-mono text-xs font-bold tracking-[0.2em]">
                      {activeResult.status === "approved" && "✓ ENTRY AUTHORIZED — VALID PASS"}
                      {activeResult.status === "duplicate" && "⚠️ DUPLICATE TICKET WARNING"}
                      {activeResult.status === "invalid" && "⛔ REJECTED — INVALID CREDENTIALS"}
                    </span>
                    <button
                      onClick={() => setActiveResult(null)}
                      className="font-mono text-xs text-white/60 hover:text-white"
                    >
                      ✕ CLOSE
                    </button>
                  </div>

                  <div className="mt-3 space-y-1.5 font-mono text-xs">
                    <p className="text-base font-bold text-white">{activeResult.attendeeName}</p>
                    <p className="text-white/80">{activeResult.college}</p>
                    <p className="text-[#a3cfbd]">{activeResult.eventName}</p>
                    <div className="mt-2 flex flex-wrap gap-4 text-[10px] text-white/60 pt-2 border-t border-white/10">
                      <span>CODE: {activeResult.ticketCode}</span>
                      <span>STATION: {station}</span>
                      <span>TIME: {activeResult.scannedAt}</span>
                    </div>

                    {activeResult.status === "duplicate" && activeResult.originalCheckin && (
                      <div className="mt-3 rounded border border-amber-500/40 bg-black/40 p-2 text-[10px] text-amber-200">
                        ORIGINAL SCAN RECORD:
                        <br />
                        Scanned at: {activeResult.originalCheckin.scannedAt} ({activeResult.originalCheckin.station})
                        <br />
                        By Officer: {activeResult.originalCheckin.scannedBy}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Real-Time Gate Check-In Feed */}
            <div className="border border-[rgba(120,160,145,0.18)] bg-[#050a08] p-5 md:p-6">
              <div className="flex flex-col justify-between gap-3 border-b border-[rgba(120,160,145,0.14)] pb-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-mono text-xs font-bold tracking-[0.2em] text-[#9fc4b4]">
                    LIVE GATE LOGS ({filteredRecords.length})
                  </h3>
                  <p className="font-mono text-[9px] text-[#557e6d]">
                    Shift audit trail for {station}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="border border-[rgba(24,196,124,0.3)] bg-[rgba(8,26,18,0.5)] px-2.5 py-1 font-mono text-[9px] text-emerald-400 hover:border-emerald-400"
                  >
                    EXPORT CSV
                  </button>
                  {checkins.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm("Clear live shift scan log?")) {
                          clearCheckins();
                          toast("Shift logs cleared.", "warn");
                        }
                      }}
                      className="border border-white/10 px-2 py-1 font-mono text-[9px] text-[#6e9383] hover:text-red-400"
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="mt-3 flex flex-wrap gap-1">
                {(["all", "approved", "duplicate", "invalid"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors ${
                      filterStatus === st
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "text-[#628577] hover:text-[#c4ded3]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Search Filter Bar */}
              <div className="mt-2">
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filter attendee name or pass code..."
                  className="w-full border border-white/10 bg-[#030605] px-3 py-1.5 font-mono text-[10px] text-white placeholder-white/20 outline-none"
                />
              </div>

              {/* Records List */}
              <div className="mt-4 max-h-[500px] space-y-2 overflow-y-auto pr-1">
                {filteredRecords.map((c) => (
                  <div
                    key={c.id}
                    className={`border p-3 font-mono transition-colors ${
                      c.status === "approved"
                        ? "border-emerald-500/20 bg-emerald-950/15"
                        : c.status === "duplicate"
                        ? "border-amber-500/20 bg-amber-950/15"
                        : "border-red-500/20 bg-red-950/15"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-[#eef8f3]">{c.attendeeName}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${
                          c.status === "approved"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : c.status === "duplicate"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {c.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[9px] text-[#719888]">
                      <span>{c.eventName}</span>
                      <span>{c.scannedAt}</span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[8px] text-[#4f7363]">
                      <span>CODE: {c.ticketCode}</span>
                      <span>BY: {c.scannedBy}</span>
                    </div>
                  </div>
                ))}

                {filteredRecords.length === 0 && (
                  <div className="py-12 text-center font-mono text-xs text-[#527768]">
                    NO SCAN RECORDS MATCHING CRITERIA
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
