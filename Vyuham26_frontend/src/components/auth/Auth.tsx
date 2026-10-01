import { useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { useApp } from "@/lib/store";
import { toast } from "@/components/ui/Toaster";
import { MEDIA } from "@/data/media";

/* ================================================================== */
/*  AUTH MODAL                                                         */
/* ================================================================== */
export function AuthModal() {
  const { ui, login, signup } = useApp();
  const mode = ui.authOpen;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!mode) setErr("");
  }, [mode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && ui.setAuthOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ui]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res =
      mode === "login"
        ? await login(email, password)
        : await signup(name || "PARTICIPANT", email, password, college);
    if (res.ok) {
      ui.setAuthOpen(false);
      toast(res.message);
      setPassword("");
    } else {
      setErr(res.message);
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[160] flex items-center justify-center p-4 transition-opacity duration-500",
        mode ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="absolute inset-0 bg-[rgba(2,4,3,0.88)] backdrop-blur-xl" onClick={() => ui.setAuthOpen(false)} />

      <div
        className="relative grid w-full max-w-[880px] overflow-hidden border border-[rgba(120,160,145,0.18)] bg-[#050908] md:grid-cols-[1fr_1fr]"
        style={{
          transform: mode ? "translateY(0) scale(1)" : "translateY(18px) scale(0.98)",
          transition: "transform .7s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* visual side */}
        <div className="relative hidden md:block">
          <img
            src={MEDIA.tunnel}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "saturate(0.3) contrast(1.3) brightness(0.34)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050908] via-transparent to-[rgba(5,9,8,0.6)]" />
          <div className="light-leak absolute inset-0 opacity-60" />
          <div className="relative flex h-full flex-col justify-between p-8">
            <p className="font-mono text-[9px] tracking-[0.32em] text-[#7fae9b]">VYUHAM'26 · ACCESS</p>
            <div>
              <h3 className="t-cond text-[3.4vw] leading-[0.9] text-[#eef8f3]">
                THE FUTURE
                <br />
                AWAITS.
              </h3>
              <p className="mt-3 max-w-[26ch] text-[12px] leading-relaxed text-[#8faea1]">
                One pass. Every stream. Register once and carry your slots across all three days.
              </p>
            </div>
          </div>
        </div>

        {/* form side */}
        <div className="relative p-7 md:p-9">
          <button
            onClick={() => ui.setAuthOpen(false)}
            className="absolute right-5 top-5 font-mono text-[10px] tracking-[0.26em] text-[#5b7b6e] hover:text-white"
          >
            ✕
          </button>

          <div className="flex gap-6">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => ui.setAuthOpen(m)}
                className={cn(
                  "link-trail font-mono text-[10px] tracking-[0.28em] transition-colors duration-500",
                  mode === m ? "text-[#d7f6e8]" : "text-[#5b7b6e] hover:text-[#bfe6d6]",
                )}
                data-active={mode === m}
              >
                {m === "login" ? "LOGIN" : "CREATE ACCOUNT"}
              </button>
            ))}
          </div>

          <h4 className="t-cond mt-7 text-[34px] leading-none text-[#f0f9f5]">
            {mode === "login" ? "WELCOME BACK" : "JOIN THE SIGNAL"}
          </h4>

          <form onSubmit={submit} className="mt-7 space-y-3">
            {mode === "signup" && (
              <>
                <input
                  className="field"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  className="field"
                  placeholder="College / Institution"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                />
              </>
            )}
            <input
              className="field"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
            />

            {err && <p className="font-mono text-[10px] tracking-[0.16em] text-[#f2a98a]">{err}</p>}

            <button type="submit" className="btn-cine btn-cine--solid mt-2 w-full justify-center">
              {mode === "login" ? "ENTER" : "CREATE ACCESS"}
            </button>
          </form>

          <div className="mt-6 border-t border-[rgba(120,160,145,0.14)] pt-4">
            <p className="font-mono text-[9px] leading-relaxed tracking-[0.18em] text-[#4f6f61]">
              DEMO · admin@vyuham26.in / vyuham26 (admin)
              <br />
              DEMO · volunteer@vyuham26.in / volunteer26 (gate volunteer)
              <br />
              DEMO · arjun@student.in / vyuham26 (participant)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  PROFILE SLIDE-OVER                                                 */
/* ================================================================== */
export function ProfilePanel() {
  const { ui, user, registrations, content, saved, unregister, toggleSave, logout } = useApp();
  const [tab, setTab] = useState<"registered" | "history" | "saved">("registered");

  const mine = useMemo(
    () => registrations.filter((r) => r.userId === user?.id),
    [registrations, user],
  );
  const savedEvents = useMemo(
    () => content.events.filter((e) => saved.includes(e.id)),
    [content.events, saved],
  );

  const open = ui.profileOpen && !!user;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[155] bg-[rgba(2,4,3,0.7)] backdrop-blur-sm transition-opacity duration-500",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => ui.setProfileOpen(false)}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-[156] flex h-full w-[min(460px,100vw)] flex-col border-l border-[rgba(120,160,145,0.18)] bg-[#040706] transition-transform duration-[700ms]",
          open ? "translate-x-0" : "translate-x-full",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="grain pointer-events-none absolute inset-0 overflow-hidden opacity-60" />

        <header className="relative flex items-start justify-between border-b border-[rgba(120,160,145,0.14)] p-6">
          <div>
            <p className="font-mono text-[9px] tracking-[0.3em] text-[#18c47c]">PARTICIPANT</p>
            <h3 className="t-cond mt-2 text-[28px] leading-none text-[#f0f9f5]">{user?.name}</h3>
            <p className="mt-2 font-mono text-[10px] tracking-[0.14em] text-[#7d9a8d]">{user?.email}</p>
            {user?.college && (
              <p className="mt-1 font-mono text-[9px] tracking-[0.16em] text-[#4f6f61]">{user.college}</p>
            )}
          </div>
          <button
            onClick={() => ui.setProfileOpen(false)}
            className="font-mono text-[11px] text-[#5b7b6e] hover:text-white"
          >
            ✕
          </button>
        </header>

        {/* Dashboard Quick Action */}
        <div className="relative border-b border-[rgba(120,160,145,0.14)] bg-[rgba(24,196,124,0.04)] px-6 py-3">
          <a
            href="#/dashboard"
            onClick={() => {
              ui.setProfileOpen(false);
              window.dispatchEvent(new CustomEvent("app:navigate", { detail: "/dashboard" }));
            }}
            className="group flex w-full items-center justify-between border border-[rgba(24,196,124,0.35)] bg-[rgba(8,26,18,0.7)] px-4 py-2.5 font-mono text-[10px] tracking-[0.2em] text-[#34d399] transition-all duration-300 hover:border-[#18c47c] hover:bg-[rgba(24,196,124,0.18)] hover:text-[#d7f6e8] hover:shadow-[0_0_16px_rgba(24,196,124,0.25)]"
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18c47c] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#18c47c]" />
              </span>
              <span className="font-semibold tracking-[0.22em]">GO TO DASHBOARD</span>
            </div>
            <span className="text-[#18c47c] transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>

        <div className="relative flex gap-5 border-b border-[rgba(120,160,145,0.14)] px-6 py-4">
          {(
            [
              ["registered", `REGISTERED ${mine.length}`],
              ["history", "HISTORY"],
              ["saved", `SAVED ${savedEvents.length}`],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              data-active={tab === k}
              className={cn(
                "link-trail font-mono text-[9px] tracking-[0.24em] transition-colors duration-500",
                tab === k ? "text-[#d7f6e8]" : "text-[#5b7b6e] hover:text-[#bfe6d6]",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 overflow-y-auto p-6">
          {tab === "registered" && (
            <ul className="space-y-3">
              {mine.map((r) => {
                const ev = content.events.find((e) => e.id === r.eventId);
                return (
                  <li key={r.id} className="border border-[rgba(120,160,145,0.16)] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="t-mid text-[14px] tracking-[0.03em] text-[#e7f5ee]">{r.eventName}</p>
                        <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-[#6f8b80]">
                          {ev?.date} · {ev?.time}
                        </p>
                        <p className="mt-[3px] font-mono text-[9px] tracking-[0.2em] text-[#4f6f61]">
                          {ev?.venue}
                        </p>
                      </div>
                      <span
                        className="shrink-0 font-mono text-[8px] tracking-[0.22em]"
                        style={{ color: r.status === "confirmed" ? "#18c47c" : "#f2c98a" }}
                      >
                        {r.status.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        unregister(r.eventId);
                        toast("Slot released.", "warn");
                      }}
                      className="mt-3 font-mono text-[9px] tracking-[0.24em] text-[#6f8b80] hover:text-[#f2a98a]"
                    >
                      RELEASE SLOT
                    </button>
                  </li>
                );
              })}
              {mine.length === 0 && (
                <p className="font-mono text-[10px] tracking-[0.2em] text-[#4f6f61]">
                  NO SLOTS HELD YET — EXPLORE THE PROGRAMME.
                </p>
              )}
            </ul>
          )}

          {tab === "history" && (
            <ul className="space-y-2">
              {mine.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between border-b border-[rgba(120,160,145,0.12)] pb-2"
                >
                  <span className="font-mono text-[10px] tracking-[0.14em] text-[#a9c8bb]">{r.eventName}</span>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[#4f6f61]">{r.createdAt}</span>
                </li>
              ))}
              {mine.length === 0 && (
                <p className="font-mono text-[10px] tracking-[0.2em] text-[#4f6f61]">NO HISTORY.</p>
              )}
            </ul>
          )}

          {tab === "saved" && (
            <ul className="space-y-3">
              {savedEvents.map((e) => (
                <li key={e.id} className="flex gap-3 border border-[rgba(120,160,145,0.16)] p-3">
                  <img
                    src={e.image}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="h-14 w-20 shrink-0 object-cover"
                    style={{ filter: "saturate(0.35) contrast(1.2) brightness(0.45)" }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate t-mid text-[13px] text-[#e7f5ee]">{e.name}</p>
                    <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-[#6f8b80]">{e.date}</p>
                    <button
                      onClick={() => toggleSave(e.id)}
                      className="mt-1 font-mono text-[9px] tracking-[0.22em] text-[#4f6f61] hover:text-[#f2a98a]"
                    >
                      REMOVE
                    </button>
                  </div>
                </li>
              ))}
              {savedEvents.length === 0 && (
                <p className="font-mono text-[10px] tracking-[0.2em] text-[#4f6f61]">NOTHING SAVED.</p>
              )}
            </ul>
          )}
        </div>

        <footer className="relative flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(120,160,145,0.14)] p-6">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#/dashboard"
              onClick={() => {
                ui.setProfileOpen(false);
                window.dispatchEvent(new CustomEvent("app:navigate", { detail: "/dashboard" }));
              }}
              className="link-trail font-mono text-[9px] tracking-[0.26em] text-[#18c47c] hover:text-[#7fe6b8]"
            >
              DASHBOARD ↗
            </a>
            <a
              href="#/profile"
              onClick={() => {
                ui.setProfileOpen(false);
                window.dispatchEvent(new CustomEvent("app:navigate", { detail: "/profile" }));
              }}
              className="link-trail font-mono text-[9px] tracking-[0.26em] text-[#8ea79b] hover:text-[#e7f5ee]"
            >
              FULL DOSSIER ↗
            </a>
            {user?.role === "admin" && (
              <a
                href="#/admin"
                onClick={() => ui.setProfileOpen(false)}
                className="link-trail font-mono text-[9px] tracking-[0.26em] text-[#9fe9c6]"
              >
                ADMIN CONSOLE ↗
              </a>
            )}
            {(user?.role === "volunteer" || user?.role === "admin") && (
              <a
                href="#/volunteer"
                onClick={() => ui.setProfileOpen(false)}
                className="link-trail font-mono text-[9px] tracking-[0.26em] text-cyan-400 hover:text-cyan-300"
              >
                VOLUNTEER SCANNER ↗
              </a>
            )}
          </div>
          <button
            onClick={() => {
              logout();
              ui.setProfileOpen(false);
              toast("Signed out.", "warn");
            }}
            className="ml-auto font-mono text-[9px] tracking-[0.26em] text-[#6f8b80] hover:text-[#f2a98a]"
          >
            SIGN OUT
          </button>
        </footer>
      </aside>
    </>
  );
}
