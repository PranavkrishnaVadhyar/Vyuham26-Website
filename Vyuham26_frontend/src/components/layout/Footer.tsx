import { useApp } from "@/lib/store";
import { navLinks } from "@/data/content";
import { scrollToId, scrollToTop } from "@/lib/scroll";
import { FocusIn } from "@/components/cinematic/Reveal";
import { toast } from "@/components/ui/Toaster";

export default function Footer() {
  const { content, ui } = useApp();
  const hp = content.homepage;

  const navigateTo = (path: string) => {
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="relative w-full border-t border-[rgba(120,160,145,0.14)] px-5 py-20 md:px-[6vw] bg-[#030504]">
      {/* Transmissions / Announcements preview */}
      <div className="mb-16">
        <div className="flex items-center justify-between">
          <p className="eyebrow">TRANSMISSIONS // SIGNAL FEED</p>
          <button
            onClick={() => navigateTo("/announcements")}
            className="font-mono text-[9px] tracking-[0.24em] text-emerald-400 hover:text-emerald-300"
          >
            VIEW ALL NOTICES →
          </button>
        </div>
        <div className="mt-6 grid gap-px bg-[rgba(120,160,145,0.14)] md:grid-cols-3">
          {content.announcements.slice(0, 3).map((a) => (
            <FocusIn key={a.id} y={14} blur={6}>
              <article className="h-full bg-[#040706] p-6 transition-colors hover:bg-[#07110c]">
                <div className="flex items-center gap-2">
                  {a.pinned && <span className="h-[5px] w-[5px] rounded-full bg-[#18c47c] animate-pulse" />}
                  <p className="font-mono text-[9px] tracking-[0.28em] text-[#4f6f61]">{a.date}</p>
                </div>
                <h4 className="t-mid mt-3 text-[14px] leading-snug tracking-[0.03em] text-[#dff0e7]">{a.title}</h4>
                <p className="mt-2 text-[12px] leading-relaxed text-[#7d9a8d] line-clamp-2">{a.body}</p>
              </article>
            </FocusIn>
          ))}
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="grid gap-10 border-t border-[rgba(120,160,145,0.14)] pt-14 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand identity column */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <img
                src="/vyuham_logo.svg"
                alt="VYUHAM'26"
                className="relative z-10 h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(24,196,124,0.5)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/vyuham_logo.png";
                }}
              />
            </div>
            <button onClick={scrollToTop} className="t-cond text-[32px] leading-none text-[#f0f9f5] md:text-[40px]">
              {hp.brand}
              <span className="text-[#18c47c]">{hp.year}</span>
            </button>
          </div>
          <p className="mt-4 max-w-[38ch] text-[13px] leading-relaxed text-[#7d9a8d]">{hp.about}</p>
          <div className="mt-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{hp.institution}</span>
          </div>
          <p className="mt-2 font-mono text-[9px] tracking-[0.28em] text-[#4f6f61]">{hp.dates} · {hp.location}</p>
        </div>

        {/* Public platform links */}
        <div className="flex flex-col gap-2.5">
          <p className="eyebrow mb-1">PLATFORM</p>
          {navLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                if (l.id === "home") {
                  if (window.location.hash === "" || window.location.hash === "#/") scrollToTop();
                  else navigateTo("/");
                } else if (l.id === "streams") {
                  navigateTo("/#streams");
                } else {
                  navigateTo(`/${l.id}`);
                }
              }}
              className="link-trail w-fit text-left font-mono text-[10px] tracking-[0.22em] text-[#84a094] transition-colors duration-500 hover:text-[#dff6ec]"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => navigateTo("/photography")}
            className="link-trail w-fit text-left font-mono text-[10px] tracking-[0.22em] text-[#84a094] transition-colors duration-500 hover:text-[#dff6ec]"
          >
            PHOTOGRAPHY
          </button>
        </div>

        {/* Competitions & Services */}
        <div className="flex flex-col gap-2.5">
          <p className="eyebrow mb-1">COMPETITION & ACCESS</p>
          <button
            onClick={() => navigateTo("/hackathon")}
            className="link-trail w-fit text-left font-mono text-[10px] tracking-[0.22em] text-[#84a094] transition-colors duration-500 hover:text-[#dff6ec]"
          >
            HACKATHON
          </button>
          <button
            onClick={() => navigateTo("/ctf")}
            className="link-trail w-fit text-left font-mono text-[10px] tracking-[0.22em] text-[#84a094] transition-colors duration-500 hover:text-[#dff6ec]"
          >
            CTF WARFARE
          </button>
          <button
            onClick={() => navigateTo("/qualifiers")}
            className="link-trail w-fit text-left font-mono text-[10px] tracking-[0.22em] text-[#84a094] transition-colors duration-500 hover:text-[#dff6ec]"
          >
            QUALIFIERS
          </button>
          <button
            onClick={() => navigateTo("/leaderboard")}
            className="link-trail w-fit text-left font-mono text-[10px] tracking-[0.22em] text-[#84a094] transition-colors duration-500 hover:text-[#dff6ec]"
          >
            LEADERBOARD
          </button>
          <button
            onClick={() => navigateTo("/results")}
            className="link-trail w-fit text-left font-mono text-[10px] tracking-[0.22em] text-[#84a094] transition-colors duration-500 hover:text-[#dff6ec]"
          >
            RESULTS
          </button>
          <button
            onClick={() => navigateTo("/ticket")}
            className="link-trail w-fit text-left font-mono text-[10px] tracking-[0.22em] text-[#84a094] transition-colors duration-500 hover:text-[#dff6ec]"
          >
            DIGITAL TICKET
          </button>
          <button
            onClick={() => navigateTo("/certificates")}
            className="link-trail w-fit text-left font-mono text-[10px] tracking-[0.22em] text-[#84a094] transition-colors duration-500 hover:text-[#dff6ec]"
          >
            CERTIFICATES
          </button>
          <button
            onClick={() => navigateTo("/food")}
            className="link-trail w-fit text-left font-mono text-[10px] tracking-[0.22em] text-[#84a094] transition-colors duration-500 hover:text-[#dff6ec]"
          >
            FOOD & WALLET
          </button>
          <button
            onClick={() => navigateTo("/checkin")}
            className="link-trail w-fit text-left font-mono text-[10px] tracking-[0.22em] text-[#84a094] transition-colors duration-500 hover:text-[#dff6ec]"
          >
            VENUE CHECK-IN
          </button>
        </div>

        {/* Support, Admin & Contact */}
        <div className="flex flex-col gap-2.5">
          <p className="eyebrow mb-1">CONNECT & SUPPORT</p>
          <button
            onClick={() => navigateTo("/faq")}
            className="link-trail w-fit text-left font-mono text-[10px] tracking-[0.22em] text-[#84a094] transition-colors duration-500 hover:text-[#dff6ec]"
          >
            FAQ
          </button>
          <button
            onClick={() => navigateTo("/support")}
            className="link-trail w-fit text-left font-mono text-[10px] tracking-[0.22em] text-[#84a094] transition-colors duration-500 hover:text-[#dff6ec]"
          >
            SUPPORT DESK
          </button>
          <button
            onClick={() => navigateTo("/feedback")}
            className="link-trail w-fit text-left font-mono text-[10px] tracking-[0.22em] text-[#84a094] transition-colors duration-500 hover:text-[#dff6ec]"
          >
            FEEDBACK
          </button>
          <a
            href={`mailto:${hp.contact.email}`}
            className="link-trail block w-fit font-mono text-[10px] tracking-[0.18em] text-[#cfe8dc] pt-2"
          >
            {hp.contact.email}
          </a>
          <p className="font-mono text-[10px] tracking-[0.18em] text-[#84a094]">{hp.contact.phone}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ui.adminUnlocked && (
              <button
                onClick={() => navigateTo("/admin")}
                className="border border-emerald-500/60 bg-emerald-950/60 px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] text-emerald-300 hover:border-emerald-200 shadow-[0_0_14px_rgba(24,196,124,0.4)] animate-pulse transition-all duration-300"
                title="Root Core Active (Ctrl+Alt+Shift+A to conceal)"
              >
                ADMIN CORE ↗
              </button>
            )}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-cyber-terminal"))}
              className="border border-[rgba(120,160,145,0.3)] px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] text-[#84a094] hover:text-white"
            >
              CONSOLE (⌘K)
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-[rgba(120,160,145,0.12)] pt-7 sm:flex-row">
        <p className="font-mono text-[9px] tracking-[0.26em] text-[#3f6152]">
          © 2026 {hp.brand}{hp.year} · {hp.institution} · TECHNOCITY, THIRUVANANTHAPURAM
        </p>
        <p className="font-mono text-[9px] tracking-[0.26em] text-[#3f6152]">
          THE FUTURE AWAITS // 30 OCT — 01 NOV 2026
        </p>
      </div>
    </footer>
  );
}
