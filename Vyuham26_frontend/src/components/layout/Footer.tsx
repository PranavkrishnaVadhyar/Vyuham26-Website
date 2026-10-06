import { useApp } from "@/lib/store";
import { navLinks } from "@/data/content";
import { scrollToId, scrollToTop } from "@/lib/scroll";
import { FocusIn } from "@/components/cinematic/Reveal";
import Logo from "@/components/ui/Logo";
import { navigate, markInternalNav } from "@/lib/router";

function SocialIcon({ name, className = "h-3.5 w-3.5" }: { name: string; className?: string }) {
  const norm = name.toUpperCase();
  if (norm === "INSTAGRAM") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }
  if (norm === "YOUTUBE") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (norm === "LINKEDIN") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  // X (Twitter)
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}

export default function Footer() {
  const { content } = useApp();
  const hp = content.homepage;

  const navigateTo = (path: string) => {
    markInternalNav();
    navigate(path);
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
              <Logo
                size="sm"
                className="relative z-10 h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(24,196,124,0.5)]"
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

          {/* Quick social icon buttons under brand column */}
          <div className="mt-5 flex items-center gap-2">
            {hp.contact.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                aria-label={s.label}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(120,160,145,0.2)] bg-[rgba(6,15,11,0.6)] text-[#84a094] transition-all duration-300 hover:border-emerald-500/50 hover:bg-emerald-950/50 hover:text-emerald-300 hover:shadow-[0_0_12px_rgba(24,196,124,0.25)]"
              >
                <SocialIcon name={s.label} />
              </a>
            ))}
          </div>
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

        {/* Support, Social & Contact */}
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

          {/* Social Channels List */}
          <div className="mt-3 pt-3 border-t border-[rgba(120,160,145,0.14)]">
            <p className="font-mono text-[8px] tracking-[0.26em] text-[#527768] uppercase mb-2">
              SOCIAL CHANNELS
            </p>
            <div className="flex flex-col gap-1.5">
              {hp.contact.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded border border-[rgba(120,160,145,0.16)] bg-[rgba(6,15,11,0.5)] px-2.5 py-1.5 font-mono text-[9px] tracking-[0.18em] text-[#84a094] transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-950/30 hover:text-emerald-300"
                >
                  <div className="flex items-center gap-2">
                    <SocialIcon name={s.label} className="h-3 w-3 text-emerald-400/80 group-hover:text-emerald-300 transition-colors" />
                    <span>{s.label}</span>
                  </div>
                  <span className="text-[8px] text-[#4f6f61] group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all">↗</span>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-2">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-cyber-terminal"))}
              className="w-full flex items-center justify-center gap-1.5 border border-[rgba(120,160,145,0.22)] bg-[rgba(6,15,11,0.4)] px-2.5 py-1.5 font-mono text-[9px] tracking-[0.2em] text-[#709786] hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
            >
              <span>CONSOLE (⌘K)</span>
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
