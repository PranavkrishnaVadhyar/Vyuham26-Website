# 🔄 VYUHAM'26 — React → Plain HTML/CSS/JS Migration Plan

> **Document Type:** Migration Analysis & Phase-by-Phase Execution Plan  
> **Current Stack:** React 19 + Vite 7 + TypeScript + TailwindCSS v4  
> **Target Stack:** Plain HTML + Vanilla CSS + Vanilla JavaScript  
> **Codebase Size:** 155 source files | ~2,168 KB of TSX/TS/CSS  
> **Estimated Total Effort:** ~15–20 weeks (single developer)

---

## 📊 Codebase Inventory

Before diving into phases, here's the full breakdown of what needs migration:

| Category | Files | Total Size | Complexity |
|---|---|---|---|
| **Pages** (`src/pages/`) | 34 sub-page directories + 5 files | ~250 KB | HIGH |
| **Components — Sections** (`components/sections/`) | 9 files | ~97 KB | HIGH |
| **Components — Motion/Animation** (`components/motion/`) | 21 files | ~340 KB | VERY HIGH |
| **Components — Cinematic** (`components/cinematic/`) | 6 files | ~39 KB | HIGH |
| **Components — UI** (`components/ui/`) | 9 files | ~74 KB | MEDIUM |
| **Components — Layout** (`components/layout/`) | 5 files | ~84 KB | MEDIUM |
| **Components — Auth** (`components/auth/`) | 2 files | ~23 KB | HIGH |
| **Components — Admin** (`components/admin/`) | 5 files | ~143 KB | VERY HIGH |
| **Components — Forms** (`components/forms/`) | 1 file | ~27 KB | HIGH |
| **Components — Venue** (`components/venue/`) | 1 file | ~33 KB | HIGH (Three.js) |
| **Lib / Utilities** (`src/lib/`) | 10 files | ~103 KB | HIGH |
| **Config** (`src/config/`) | 2 files | ~17 KB | LOW |
| **Data** (`src/data/`) | 4 files | ~47 KB | LOW |
| **Context** (`src/context/`) | 1 file | ~22 KB | HIGH |
| **Hooks** (`src/hooks/`) | 1 file | ~0.5 KB | LOW |
| **Routing** (`src/routes.tsx`) | 1 file | ~17 KB | HIGH |
| **CSS** (`index.css`, `globals.css`) | 2 files | ~21 KB | MEDIUM |

---

## 🏗️ PROJECT ARCHITECTURE DECISION

Before starting any phase, you must decide which architecture to follow:

### Option A: Multi-Page Application (MPA) — Recommended

```
Vyuham26_html/
├── index.html              ← Homepage (cinematic site)
├── events/
│   ├── index.html          ← Events listing
│   └── [slug].html         ← Event detail (template)
├── schedule/index.html
├── hackathon/index.html
├── login/index.html
├── admin/index.html
├── ... (34+ page directories)
├── css/
│   ├── reset.css
│   ├── variables.css       ← Design tokens (colors, fonts, spacing)
│   ├── layout.css          ← Grid, flex, containers
│   ├── components.css      ← Nav, footer, cards, modals, buttons
│   ├── sections.css        ← Hero, Awakening, Streams, etc.
│   ├── animations.css      ← Keyframes, transitions
│   └── pages/              ← Page-specific styles
│       ├── events.css
│       ├── hackathon.css
│       └── ...
├── js/
│   ├── lib/
│   │   ├── supabase-init.js  ← Supabase client
│   │   ├── auth.js            ← Auth logic
│   │   ├── api.js             ← API fetch wrapper
│   │   ├── router.js          ← Simple page navigation helpers
│   │   ├── store.js           ← Global state (localStorage + events)
│   │   ├── scroll.js          ← Scroll utilities
│   │   └── sound.js           ← Audio system
│   ├── components/
│   │   ├── nav.js             ← Navbar inject & logic
│   │   ├── footer.js          ← Footer inject & logic
│   │   ├── toaster.js         ← Toast notifications
│   │   ├── modal.js           ← Modal system
│   │   └── cyber-terminal.js  ← Terminal overlay
│   ├── animations/
│   │   ├── intro.js           ← Cinematic intro (GSAP)
│   │   ├── atmosphere.js      ← Background particles
│   │   ├── scroll-trigger.js  ← Section reveal animations
│   │   └── interstitial.js    ← Full-bleed parallax breaks
│   └── pages/
│       ├── home.js
│       ├── events.js
│       ├── admin.js
│       └── ...
├── assets/
│   ├── images/
│   ├── fonts/
│   └── audio/
└── vendor/
    ├── gsap.min.js
    ├── three.min.js
    ├── lenis.min.js
    └── supabase.min.js
```

### Option B: Single-Page Application (SPA) with Vanilla JS

Keeps the current SPA behavior but rebuilds everything without React. Essentially you'd be writing your own mini-framework. **Not recommended** — if you're going to do this much work, just keep React.

---

## PHASE 0: PREPARATION & DESIGN SYSTEM EXTRACTION

> **Priority:** CRITICAL — Must be done first  
> **Estimated Time:** 1 week  
> **Risk Level:** LOW

### 🎯 Objectives

1. Extract the complete design system from TailwindCSS into vanilla CSS custom properties.
2. Set up the new project structure.
3. Identify and download all vendor libraries.
4. Catalog every color, font, spacing value, and breakpoint used across the codebase.

### 0.1 Extract Design Tokens

Source files to audit:
- [`src/index.css`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/index.css) — Root-level Tailwind config and custom CSS
- [`src/pages/globals.css`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/globals.css) — Page-level styles
- [`tailwindcss@4.1.17`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/package.json) — v4 uses CSS-first config

**Output → `css/variables.css`:**
```css
:root {
  /* ── Colors ── */
  --color-bg-primary: #030504;
  --color-bg-surface: #0a0f0c;
  --color-green: #18c47c;
  --color-green-dim: rgba(11, 90, 60, 0.6);
  --color-green-glow: rgba(24, 196, 124, 0.6);
  --color-paper: #cfd8d4;
  --color-muted: rgba(255, 255, 255, 0.5);
  --color-amber: #f59e0b;
  
  /* ── Typography ── */
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-display: 'Outfit', 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  /* ── Spacing ── */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 48px;
  
  /* ── Breakpoints (for reference in media queries) ── */
  /* sm: 640px | md: 768px | lg: 1024px | xl: 1280px */
  
  /* ── Z-Index Scale ── */
  --z-atmosphere: 1;
  --z-content: 3;
  --z-nav: 50;
  --z-progress: 95;
  --z-modal: 100;
  --z-offline-banner: 120;
}
```

### 0.2 Download Vendor Libraries

These libraries work without React and must be included via `<script>` tags:

| Library | CDN / Download | Used For |
|---|---|---|
| **GSAP 3.15** + ScrollTrigger | https://greensock.com/docs/v3/Installation | All scroll-based animations |
| **Three.js 0.186** | https://cdn.jsdelivr.net/npm/three@0.186/ | 3D campus map (`Campus3DOverview.tsx`) |
| **Lenis 1.3** | https://github.com/darkroomengineering/lenis | Smooth scrolling |
| **Supabase JS 2.x** | https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/ | Auth + Database |

### 0.3 Create Base HTML Template

Every page will include this boilerplate:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VYUHAM'26 — [PAGE TITLE]</title>
  <meta name="description" content="[PAGE DESCRIPTION]" />
  
  <!-- Design System -->
  <link rel="stylesheet" href="/css/reset.css" />
  <link rel="stylesheet" href="/css/variables.css" />
  <link rel="stylesheet" href="/css/layout.css" />
  <link rel="stylesheet" href="/css/components.css" />
  <link rel="stylesheet" href="/css/animations.css" />
  
  <!-- Page-Specific CSS -->
  <link rel="stylesheet" href="/css/pages/[page].css" />
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
</head>
<body>
  <!-- Nav gets injected here by nav.js -->
  <div id="nav-root"></div>
  
  <main id="main-content">
    <!-- PAGE CONTENT -->
  </main>
  
  <!-- Footer gets injected here by footer.js -->
  <div id="footer-root"></div>
  
  <!-- Toast notifications container -->
  <div id="toaster-root"></div>
  
  <!-- Vendor Scripts -->
  <script src="/vendor/gsap.min.js"></script>
  <script src="/vendor/ScrollTrigger.min.js"></script>
  <script src="/vendor/lenis.min.js"></script>
  <script src="/vendor/supabase.min.js"></script>
  
  <!-- Core JS -->
  <script src="/js/lib/supabase-init.js"></script>
  <script src="/js/lib/store.js"></script>
  <script src="/js/lib/auth.js"></script>
  <script src="/js/lib/api.js"></script>
  <script src="/js/components/nav.js"></script>
  <script src="/js/components/footer.js"></script>
  <script src="/js/components/toaster.js"></script>
  
  <!-- Page-Specific JS -->
  <script src="/js/pages/[page].js"></script>
</body>
</html>
```

### 0.4 Deliverables

- [ ] `css/variables.css` — Complete design token extraction
- [ ] `css/reset.css` — CSS reset/normalize
- [ ] Base HTML template file
- [ ] All vendor libraries downloaded to `/vendor/`
- [ ] Project folder structure created
- [ ] Font references verified

---

## PHASE 1: CORE INFRASTRUCTURE — State, Auth & API

> **Priority:** CRITICAL — Everything depends on this  
> **Estimated Time:** 2 weeks  
> **Risk Level:** HIGH  
> **React Source Files:**
> - [`src/lib/store.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/store.tsx) (565 lines)
> - [`src/context/AuthContext.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/context/AuthContext.tsx) (622 lines)
> - [`src/lib/api.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/api.ts) (920 lines)
> - [`src/lib/supabase.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/supabase.ts) (23 lines)
> - [`src/lib/router.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/router.ts) (332 lines)
> - [`src/config/site.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/config/site.ts) (312 lines)

### 🎯 Objectives

1. Build a vanilla JS global state manager to replace React Context + `useApp()` hook.
2. Port the Supabase auth system (login, signup, Google OAuth, role-based access).
3. Port the API fetch wrapper with JWT injection.
4. Create a simple page navigation helper.

### 1.1 Global State Manager (`js/lib/store.js`)

**React version:** Uses `createContext` + `useState` + `useCallback` to provide reactive state to all components.

**Vanilla JS replacement:** An event-driven store using `CustomEvent` dispatching.

```javascript
// js/lib/store.js — Vanilla JS State Manager
const VyuhamStore = (() => {
  const _state = {
    // UI State
    introDone: false,
    authOpen: false,
    profileOpen: false,
    soundEnabled: true,
    adminUnlocked: false,
    
    // User State
    user: null,               // AuthUser object
    isAuthenticated: false,
    
    // Content State (seeded from data files)
    events: [],
    schedule: [],
    announcements: [],
    sponsors: [],
    gallery: [],
    team: [],
    registrations: [],
  };

  function get(key) { return _state[key]; }
  function getAll() { return { ..._state }; }

  function set(key, value) {
    const old = _state[key];
    _state[key] = value;
    // Notify all listeners
    window.dispatchEvent(new CustomEvent('vyuham:state', {
      detail: { key, value, oldValue: old }
    }));
  }

  function subscribe(key, callback) {
    const handler = (e) => {
      if (e.detail.key === key) callback(e.detail.value, e.detail.oldValue);
    };
    window.addEventListener('vyuham:state', handler);
    return () => window.removeEventListener('vyuham:state', handler);
  }

  return { get, getAll, set, subscribe };
})();
```

**What changes vs React:**
- No automatic re-renders. Every UI element that depends on state must manually subscribe and update the DOM.
- Example: The navbar shows the user's name. In React, changing `user` re-renders the nav automatically. In vanilla JS, you must call `VyuhamStore.subscribe('user', (user) => { document.getElementById('nav-username').textContent = user?.name || ''; })`.

### 1.2 Auth System (`js/lib/auth.js`)

**React source:** [`AuthContext.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/context/AuthContext.tsx) — 622 lines

**Key features to port:**
- Supabase `onAuthStateChange` listener → stays the same (Supabase SDK is framework-agnostic)
- `login(email, password)` → direct Supabase call
- `signup(details)` → Supabase + backend profile creation
- `loginWithGoogle()` → Supabase OAuth redirect
- `logout()` → Supabase signout + clear store
- `registerForEvent(slug)` → API call + update store
- Session auto-refresh → Supabase handles this natively
- Role-based access (`user | volunteer | event_head | admin`) → manual checks

**What breaks:**
- The `useAuth()` hook that every component calls → replaced with `VyuhamStore.get('user')` and `VyuhamStore.subscribe('user', ...)`
- The `<AuthProvider>` wrapper → replaced with a single `initAuth()` call on page load

### 1.3 API Layer (`js/lib/api.js`)

**React source:** [`api.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/api.ts) — 920 lines

**This is the easiest part.** The API layer is mostly plain fetch calls. The only React dependency is `import.meta.env` for Vite environment variables.

**Changes needed:**
- Replace `import.meta.env.VITE_API_URL` with a global config object or `window.__CONFIG__`
- Replace `import.meta.env.VITE_SUPABASE_URL` similarly
- Remove TypeScript generics → plain JSDoc comments for documentation
- The `apiFetch()`, `eventsApi`, `registrationsApi`, `authApi` objects port almost line-for-line

### 1.4 Navigation Helpers (`js/lib/router.js`)

**React source:** [`router.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/router.ts) — 332 lines

**In MPA architecture, routing is simple:** `window.location.href = '/events'`. But you still need:
- `navigate(path)` — wrapper for `window.location.href`
- `markInternalNav()` / `isInternalNavigation()` — session flags (port as-is)
- Admin unlock checks via `sessionStorage`
- Route guard logic (redirect unauthenticated users)

**What you lose:**
- No `usePlatformRoute()` hook (not needed in MPA)
- No `React.lazy()` code-splitting (MPA pages load independently)
- No `<Suspense>` loading states (use inline `<noscript>` or skeleton HTML instead)
- No cinematic route transitions between pages (full page reloads in MPA)

### 1.5 Deliverables

- [ ] `js/lib/store.js` — Event-driven global state manager
- [ ] `js/lib/supabase-init.js` — Supabase client initialization
- [ ] `js/lib/auth.js` — Full auth system (login, signup, Google OAuth, roles)
- [ ] `js/lib/api.js` — API fetch wrapper with JWT injection
- [ ] `js/lib/router.js` — Navigation helpers and guards
- [ ] `js/lib/scroll.js` — Scroll lock, scrollToId, scrollToTop utilities
- [ ] `js/lib/config.js` — Site configuration (registration gates, feature flags)
- [ ] Manual testing: login → profile load → logout → Google OAuth flow

---

## PHASE 2: SHARED COMPONENTS — Nav, Footer, Toaster, Modal

> **Priority:** HIGH — Required by every page  
> **Estimated Time:** 1.5 weeks  
> **Risk Level:** MEDIUM  
> **React Source Files:**
> - [`src/components/layout/Nav.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/layout/Nav.tsx) (754 lines)
> - [`src/components/layout/Footer.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/layout/Footer.tsx) (~400 lines)
> - [`src/components/layout/SideNavRail.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/layout/SideNavRail.tsx) (~1,000 lines)
> - [`src/components/ui/Toaster.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/ui/Toaster.tsx) (65 lines)
> - [`src/components/ui/CyberTerminal.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/ui/CyberTerminal.tsx) (1,000+ lines)
> - [`src/components/ui/BroadcastTicker.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/ui/BroadcastTicker.tsx) (~400 lines)
> - [`src/components/auth/Auth.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/auth/Auth.tsx) (~560 lines)

### 🎯 Objectives

1. Build injectable JS components for Nav, Footer, and Toaster that every page loads.
2. Port the auth modal (login/signup overlay).
3. Port the Cyber Terminal overlay.

### 2.1 Navigation Bar (`js/components/nav.js`)

**The biggest challenge in this phase.** The React Nav component:
- Has 754 lines of code with 8+ state variables
- Uses `useApp()` for user data, admin status, sound toggle
- Uses `useRegistrationOpen()` for conditional link visibility
- Renders a BroadcastTicker sub-component
- Has mobile hamburger menu with scroll locking
- Has profile dropdown menu with click-outside detection
- Uses `createPortal` for the mobile overlay

**Vanilla approach:** The JS file creates the entire navbar HTML as a template string and injects it into `#nav-root`. All event listeners are attached manually.

```javascript
// js/components/nav.js
function renderNav() {
  const user = VyuhamStore.get('user');
  const root = document.getElementById('nav-root');
  
  root.innerHTML = `
    <nav class="vyuham-nav" id="main-nav">
      <div class="nav-inner">
        <a href="/" class="nav-logo"><!-- Logo SVG --></a>
        <div class="nav-links" id="nav-links">
          <a href="/#about">About</a>
          <a href="/#streams">Streams</a>
          <a href="/events">Events</a>
          <a href="/schedule">Schedule</a>
          ${user ? `<span class="nav-user">${user.name}</span>` : 
                   `<button id="nav-login-btn">Login</button>`}
        </div>
        <button class="nav-hamburger" id="nav-hamburger">☰</button>
      </div>
    </nav>
  `;
  
  // Attach listeners
  document.getElementById('nav-hamburger')?.addEventListener('click', toggleMobileMenu);
  document.getElementById('nav-login-btn')?.addEventListener('click', openAuthModal);
  
  // Re-render when user state changes
  VyuhamStore.subscribe('user', () => renderNav());
}

document.addEventListener('DOMContentLoaded', renderNav);
```

**What changes:**
- Every state change triggers a full re-render of the nav HTML (React only updates the diff)
- Profile dropdown click-outside detection must be manually wired
- Mobile menu scroll-lock must be manual (`document.body.style.overflow = 'hidden'`)
- No `createPortal` — the mobile overlay is just appended to `body`

### 2.2 Footer (`js/components/footer.js`)

Simpler than the Nav — mostly static HTML. Inject into `#footer-root`.

### 2.3 Auth Modal (`js/components/auth-modal.js`)

**React source:** [`Auth.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/auth/Auth.tsx) — ~560 lines

Ports the login/signup modal overlay. Must handle:
- Tab switching (Login ↔ Signup)
- Form validation
- Error display
- Google OAuth button
- Loading states
- Escape key and backdrop click to close
- Password show/hide toggle

### 2.4 Toast Notification System (`js/components/toaster.js`)

**React source:** [`Toaster.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/ui/Toaster.tsx)

Relatively simple — create a global `toast(message, type)` function that:
1. Creates a `<div>` with the message
2. Appends it to `#toaster-root`
3. Auto-removes after 4 seconds with a fade-out animation

### 2.5 Cyber Terminal (`js/components/cyber-terminal.js`)

**React source:** [`CyberTerminal.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/ui/CyberTerminal.tsx) — 1,000+ lines

This is a **full terminal emulator** with command parsing, history, auto-complete, and GSAP animations. This is one of the most complex components to port.

### 2.6 CSS for Shared Components

Convert all Tailwind utility classes used in these components into proper CSS classes in `css/components.css`:

```css
/* css/components.css */
.vyuham-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: opacity 1s, transform 0.5s;
}

.vyuham-nav.scrolled {
  background: rgba(3, 5, 4, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(24, 196, 124, 0.1);
}

/* ... hundreds more rules ... */
```

### 2.7 Deliverables

- [ ] `js/components/nav.js` — Full navbar with mobile menu, profile dropdown, state subscriptions
- [ ] `js/components/footer.js` — Footer injection
- [ ] `js/components/toaster.js` — Global toast notification system
- [ ] `js/components/auth-modal.js` — Login/signup modal with Google OAuth
- [ ] `js/components/cyber-terminal.js` — Terminal overlay
- [ ] `js/components/broadcast-ticker.js` — Scrolling announcement ticker
- [ ] `css/components.css` — All shared component styles
- [ ] Visual parity test: Nav + Footer must match the React version pixel-for-pixel

---

## PHASE 3: CINEMATIC ENGINE — Intro, Atmosphere & Animations

> **Priority:** HIGH — This is the soul of the website  
> **Estimated Time:** 2.5 weeks  
> **Risk Level:** HIGH  
> **React Source Files:**
> - [`src/components/cinematic/Intro.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/cinematic/Intro.tsx) (313 lines)
> - [`src/components/cinematic/Atmosphere.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/cinematic/Atmosphere.tsx) (~150 lines)
> - [`src/components/cinematic/Interactive.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/cinematic/Interactive.tsx) (~180 lines)
> - [`src/components/cinematic/Interstitial.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/cinematic/Interstitial.tsx) (~220 lines)
> - [`src/components/cinematic/Reveal.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/cinematic/Reveal.tsx) (~160 lines)
> - [`src/components/cinematic/CinematicTransition.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/cinematic/CinematicTransition.tsx) (~75 lines)
> - [`src/components/motion/Greenanime2.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/motion/Greenanime2.tsx) (3,900 lines!)
> - [`src/lib/cyberAudio.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/cyberAudio.ts) (850+ lines)
> - [`src/lib/sound.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/sound.ts) (~130 lines)
> - All 21 files in `src/components/motion/`

### 🎯 Objectives

1. Port the cinematic intro sequence (image preloading → GSAP timeline → fade-in).
2. Port the Atmosphere particle background (canvas-based).
3. Port scroll-triggered section reveal animations.
4. Port the CinematicCursor (custom cursor effect).
5. Port the full audio system (Web Audio API synthesizer).

### 3.1 Cinematic Intro (`js/animations/intro.js`)

**Good news:** This component already uses GSAP heavily — the React parts are just `useRef`, `useState`, `useEffect` wrappers around GSAP timelines.

**Migration approach:**
1. Create the intro HTML in `index.html` as a `<div id="intro-overlay">` with all chapter slides
2. Port the GSAP timeline logic almost line-for-line
3. Replace `useRef(null)` → `document.getElementById()`
4. Replace `useState` for progress → plain variable + DOM update
5. Replace `useReducedMotion()` → `window.matchMedia('(prefers-reduced-motion: reduce)')`
6. On completion, call `VyuhamStore.set('introDone', true)` and remove the overlay

### 3.2 Atmosphere Particles (`js/animations/atmosphere.js`)

Canvas-based particle system. Port from React refs to direct canvas API calls.

### 3.3 Framer Motion Replacements

**This is where the most work is.** Every component using `framer-motion` (imported as `motion` from `framer-motion`) needs its animations rewritten.

| Framer Motion Feature | Vanilla Replacement |
|---|---|
| `<motion.div animate={{opacity: 1}}>` | GSAP `gsap.to(el, {opacity: 1})` |
| `<motion.div initial={{y: 50}} whileInView={{y: 0}}>` | GSAP ScrollTrigger |
| `<AnimatePresence>` | GSAP timeline with manual mount/unmount |
| `useMotionValue()` | Plain JS variable |
| `useSpring()` | GSAP with `ease: "elastic"` |
| `layout` prop (auto-animate layout changes) | No direct equivalent — use FLIP technique |
| `drag` prop | Manual drag implementation or library |
| `exit` animations | GSAP `.to()` before removing element |

**Affected motion components (21 files, ~340 KB total):**
- `AnimatedSection.tsx` — Section entrance animations
- `AuthTransition.tsx` — Auth modal page transitions  
- `CornerStructures.tsx` — Decorative corner animations
- `EnergyRing.tsx` — Ring loading animations
- `GaugeFill.tsx` — Progress gauge fills
- `Greenanime2.tsx` — **3,900 lines** — Main cinematic animation (already mostly GSAP)
- `IntroSequence.tsx` — Intro choreography
- `LogoReveal.tsx` — Logo entrance animation
- `PageEntrance.tsx` — Page load transitions
- `ParallaxTile.tsx` — Parallax scroll effects
- `ParticleField.tsx` — 2D particle system
- `ParticleField3D.tsx` — Three.js 3D particles
- `Portal.tsx` — Portal opening animation
- `RankList.tsx` — Leaderboard rank animations
- `RedlineIntroTest.tsx` — Alternative intro
- `RouteTrace.tsx` — Route path trace animation
- `SealResolve.tsx` — Seal/badge resolve animation
- `SignalRing.tsx` — Signal ring pulse
- `StoneSystem.tsx` — Stone/rune system animation
- `StreamSignalMap.tsx` — Stream map signals
- `TerminalReveal.tsx` — Terminal text reveal

### 3.4 Audio System (`js/lib/sound.js`)

**Good news:** [`cyberAudio.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/cyberAudio.ts) and [`sound.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/sound.ts) are **pure JavaScript** wrapped in TypeScript. They use the Web Audio API directly with zero React dependencies.

**Migration:** Remove TypeScript types → rename to `.js` → works as-is.

### 3.5 CinematicTransition

**React source:** Uses Framer Motion's `AnimatePresence` for route transitions.

**In MPA:** This feature is **lost entirely**. Pages reload fully. You can add a simple CSS page-exit animation using the Page Visibility API, but it won't be as smooth.

### 3.6 Deliverables

- [ ] `js/animations/intro.js` — Full cinematic intro with GSAP timeline
- [ ] `js/animations/atmosphere.js` — Particle background
- [ ] `js/animations/scroll-trigger.js` — Section reveal animations (replaces AnimatedSection)
- [ ] `js/animations/interstitial.js` — Full-bleed parallax image breaks
- [ ] `js/animations/cursor.js` — Custom cinematic cursor
- [ ] `js/lib/sound.js` — Audio system (mostly copy-paste from TS)
- [ ] `js/lib/cyber-audio.js` — Synthesizer (mostly copy-paste from TS)
- [ ] `css/animations.css` — All keyframe animations and transitions
- [ ] All 21 motion components ported to GSAP-only equivalents
- [ ] Visual parity test: Intro sequence must match the React version

---

## PHASE 4: HOMEPAGE — Hero Through Footer

> **Priority:** HIGH — This is what visitors see first  
> **Estimated Time:** 2 weeks  
> **Risk Level:** MEDIUM  
> **React Source Files:**
> - [`src/components/sections/Hero.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/sections/Hero.tsx) (~280 lines)
> - [`src/components/sections/Awakening.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/sections/Awakening.tsx) (~250 lines)
> - [`src/components/sections/Streams.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/sections/Streams.tsx) (~500 lines)
> - [`src/components/sections/Journey.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/sections/Journey.tsx) (~400 lines)
> - [`src/components/sections/Events.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/sections/Events.tsx) (~580 lines)
> - [`src/components/sections/Experience.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/sections/Experience.tsx) (~215 lines)
> - [`src/components/sections/About.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/sections/About.tsx) (~110 lines)
> - [`src/components/sections/Countdown.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/sections/Countdown.tsx) (~170 lines)
> - [`src/components/sections/FinalReveal.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/sections/FinalReveal.tsx) (~310 lines)

### 🎯 Objectives

1. Build the complete homepage as a single `index.html` with all sections inline.
2. Wire up GSAP ScrollTrigger for all section entrance animations.
3. Port the countdown timer logic.
4. Port the events carousel/grid.
5. Ensure the progress rail (scroll progress bar) works.

### 4.1 Homepage Structure

The homepage is a single long-scroll page with 9 sections + 2 interstitials. In plain HTML, all sections live directly in `index.html`:

```html
<main id="main-content" class="relative z-3">
  <section id="hero" class="hero-section">...</section>
  <section id="awakening" class="awakening-section">...</section>
  <section id="streams" class="streams-section">...</section>
  <section id="journey" class="journey-section">...</section>
  <!-- Interstitial 1 -->
  <div class="interstitial" data-image="/assets/images/street-light.webp" data-align="left">
    <p class="interstitial-line">Every schedule is a promise. This one is a countdown.</p>
    <span class="interstitial-caption">ACT IV — THE PROGRAMME</span>
  </div>
  <section id="events" class="events-section">...</section>
  <section id="experience" class="experience-section">...</section>
  <!-- Interstitial 2 -->
  <div class="interstitial" data-image="/assets/images/dancer-silhouette.webp">
    <p class="interstitial-line">You will not remember the timetable. You will remember the room.</p>
    <span class="interstitial-caption">ACT VI — WHAT REMAINS</span>
  </div>
  <section id="about" class="about-section">...</section>
  <section id="countdown" class="countdown-section">...</section>
  <section id="final-reveal" class="final-reveal-section">...</section>
</main>
```

### 4.2 What Changes on the Homepage

| Feature | React Version | Plain HTML Version |
|---|---|---|
| Section content | Generated from JS data objects | Hardcoded in HTML (or injected from JS data files) |
| Scroll animations | React refs + GSAP ScrollTrigger | Direct DOM queries + GSAP ScrollTrigger |
| Events grid | Rendered from `events` array state | Rendered by `js/pages/home.js` from data |
| Countdown timer | `useState` + `setInterval` | `setInterval` + manual DOM `.textContent` update |
| Progress rail | `useRef` + `requestAnimationFrame` | `document.getElementById` + `requestAnimationFrame` |
| Hash navigation | React `useEffect` on hash change | `window.addEventListener('hashchange', ...)` |
| Conditional rendering | `{introActive && <Intro />}` | `document.getElementById('intro').style.display = ...` |

### 4.3 Deliverables

- [ ] `index.html` — Complete homepage with all 9 sections + 2 interstitials
- [ ] `js/pages/home.js` — Homepage logic (countdown, events grid, scroll animations)
- [ ] `css/sections.css` — Styles for all homepage sections
- [ ] Progress rail working
- [ ] Hash navigation (`#about`, `#streams`, `#gallery`) working
- [ ] All ScrollTrigger animations firing correctly

---

## PHASE 5: SUB-PAGES — Events, Schedule, Hackathon & Public Pages

> **Priority:** MEDIUM-HIGH  
> **Estimated Time:** 3 weeks  
> **Risk Level:** MEDIUM  
> **Pages to build:** 15+ public-facing pages

### 🎯 Objectives

Build each sub-page as a standalone HTML file with its own CSS and JS.

### 5.1 Page Migration List

| Page | React Source | Complexity | Notes |
|---|---|---|---|
| `/events` | `src/pages/events/page.tsx` | MEDIUM | Event listing with filters |
| `/events/[slug]` | `src/pages/events/[slug]/EventDetailClient.tsx` | HIGH | Dynamic route → generate per-event OR use JS template |
| `/schedule` | `src/pages/schedule/page.tsx` | MEDIUM | Timeline display |
| `/hackathon` | `src/pages/hackathon/page.tsx` | MEDIUM | Hackathon landing |
| `/ctf` | `src/pages/ctf/page.tsx` | MEDIUM | CTF challenge page |
| `/photography` | `src/pages/photography/page.tsx` | LOW | Gallery grid |
| `/venue` | `src/pages/venue/page.tsx` | HIGH | Three.js 3D campus map |
| `/sponsors` | `src/pages/sponsors/page.tsx` | LOW | Sponsor logos grid |
| `/faq` | `src/pages/faq/page.tsx` | LOW | Accordion FAQ |
| `/contact` | `src/pages/contact/page.tsx` | LOW | Contact form |
| `/support` | `src/pages/support/page.tsx` | LOW | Support info |
| `/feedback` | `src/pages/feedback/page.tsx` | LOW | Feedback form |
| `/announcements` | `src/pages/announcements/page.tsx` | MEDIUM | Live announcement feed |
| `/qualifiers` | `src/pages/qualifiers/page.tsx` | MEDIUM | Qualifier rounds |
| `/leaderboard` | `src/pages/leaderboard/page.tsx` | MEDIUM | Live leaderboard |
| `/results` | `src/pages/results/page.tsx` | MEDIUM | Event results |
| `/certificates` | `src/pages/certificates/page.tsx` | MEDIUM | Certificate download |

### 5.2 Dynamic Event Detail Pages

The biggest challenge: `/events/[slug]` is a dynamic route. Options:

**Option A — Static generation:** Pre-generate one HTML file per event at build time. Requires a build script.

**Option B — Single template + JS:** One `events/detail.html` file that reads the slug from the URL (`?slug=robo-wars`) and fetches event data via the API.

```html
<!-- events/detail.html -->
<div id="event-detail-root"></div>
<script>
  const slug = new URLSearchParams(window.location.search).get('slug');
  fetch(`/api/events/${slug}`)
    .then(r => r.json())
    .then(event => renderEventDetail(event));
</script>
```

### 5.3 Venue Page (Three.js 3D Map)

[`Campus3DOverview.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/venue/Campus3DOverview.tsx) — 33 KB

This component uses Three.js directly with React refs. The Three.js code itself is framework-agnostic, but the React lifecycle (`useEffect` for setup, cleanup on unmount) needs to be replaced with:
- `DOMContentLoaded` for initialization
- `window.addEventListener('beforeunload', ...)` for cleanup

### 5.4 Deliverables

- [ ] 15+ individual HTML files, each with appropriate CSS/JS
- [ ] Event detail template with dynamic data loading
- [ ] Venue page with Three.js 3D map working
- [ ] All pages include Nav + Footer via shared JS
- [ ] `css/pages/` directory with page-specific styles

---

## PHASE 6: AUTH PAGES & USER DASHBOARD

> **Priority:** MEDIUM  
> **Estimated Time:** 1.5 weeks  
> **Risk Level:** HIGH (auth flows are security-sensitive)  
> **Pages to build:**
> - `/login` → [`src/pages/login/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/login/)
> - `/signup` → [`src/pages/signup/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/signup/)
> - `/dashboard` → [`src/pages/dashboard/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/dashboard/)
> - `/profile` → [`src/pages/profile/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/profile/)
> - `/ticket` → [`src/pages/ticket/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/ticket/)

### 🎯 Objectives

1. Build standalone login and signup pages with form validation.
2. Build the user dashboard (registered events, profile info).
3. Handle Google OAuth callback redirects.
4. Build the ticket/QR code display page.

### 6.1 Key Auth Considerations

- **OAuth redirect handling:** Supabase redirects to your site with `?code=...` in the URL. In React, the `AuthContext` catches this in a `useEffect`. In vanilla JS, you need to check `window.location.search` on page load.
- **Protected routes:** Dashboard and profile must redirect to `/login` if not authenticated. Check `VyuhamStore.get('isAuthenticated')` on page load.
- **Session persistence:** Supabase stores the session in `localStorage` automatically. Your `auth.js` just needs to call `supabase.auth.getSession()` on load.

### 6.2 Deliverables

- [ ] `login/index.html` + `js/pages/login.js`
- [ ] `signup/index.html` + `js/pages/signup.js`
- [ ] `dashboard/index.html` + `js/pages/dashboard.js`
- [ ] `profile/index.html` + `js/pages/profile.js`
- [ ] `ticket/index.html` + `js/pages/ticket.js`
- [ ] OAuth callback handling tested with Google sign-in
- [ ] Route protection (redirect unauthenticated users)

---

## PHASE 7: REGISTRATION, CHECKOUT & COMMERCE FLOWS

> **Priority:** MEDIUM (currently behind `comingSoon` flags)  
> **Estimated Time:** 1.5 weeks  
> **Risk Level:** HIGH (payment flows are critical)  
> **Pages to build:**
> - `/register` & `/register/[slug]`
> - `/checkout`
> - `/payment`
> - `/receipt`
> - `/confirmation`
> - `/food`, `/food/topup`, `/food/wallet`, `/food/vendor`
> - `/teams`

### 🎯 Objectives

1. Build the event registration form (the most complex form in the app).
2. Build the checkout and payment flow pages.
3. Build the food wallet system pages.

### 7.1 Event Registration Form

**React source:** [`EventRegistrationForm.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/forms/EventRegistrationForm.tsx) — 27 KB

This is a large, stateful form with:
- Dynamic fields based on event type
- Real-time validation
- Team member selection
- Payment integration
- Loading states and error handling
- Multi-step form flow

**In vanilla JS:** This requires careful manual DOM state management. Each form field change triggers validation logic and potentially shows/hides other fields.

### 7.2 Deliverables

- [ ] `register/index.html` — Event selection board
- [ ] `register/event.html` — Individual event registration form
- [ ] `checkout/index.html`, `payment/index.html`, `receipt/index.html`, `confirmation/index.html`
- [ ] `food/index.html`, `food/topup.html`, `food/wallet.html`, `food/vendor.html`
- [ ] `teams/index.html`
- [ ] Form validation working on all forms
- [ ] "Coming Soon" placeholder pages for gated features

---

## PHASE 8: ADMIN DASHBOARD

> **Priority:** MEDIUM-LOW (only for admin users)  
> **Estimated Time:** 3 weeks  
> **Risk Level:** VERY HIGH  
> **React Source Files:**
> - [`src/components/admin/AdminApp.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/admin/AdminApp.tsx) (**85 KB / ~2,500 lines** — the largest single file)
> - [`src/components/admin/AnnouncementManager.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/admin/AnnouncementManager.tsx) (~680 lines)
> - [`src/components/admin/ConsoleManager.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/admin/ConsoleManager.tsx) (~600 lines)
> - [`src/components/admin/HackathonManager.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/admin/HackathonManager.tsx) (~375 lines)
> - [`src/pages/admin/analytics/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/admin/analytics/)
> - [`src/pages/admin/event-head/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/admin/event-head/)

### 🎯 Objectives

1. Rebuild the entire admin CMS panel in vanilla JS.
2. Port event CRUD, announcement management, analytics, and console tools.

### 8.1 Why This Is the Hardest Phase

The admin dashboard is a **full CMS application** built inside a React component. It has:
- Tab-based navigation between admin sections
- Real-time data tables with sorting, filtering, and pagination
- Inline editing of events, announcements, and settings
- Form modals for creating/editing content
- Drag-and-drop reordering
- Analytics charts and data visualization
- Bulk operations (approve registrations, send announcements)

In React, all of this is managed via state. In vanilla JS, you'd be manually updating table rows, form fields, and modal states — essentially building a mini-framework.

### 8.2 Alternative Recommendation

> **Consider keeping the admin dashboard as a separate React app** (or use a lightweight alternative like Alpine.js or Preact just for admin). The public-facing site can be vanilla HTML/CSS/JS while the admin panel stays React. They can share the same Supabase backend.

### 8.3 Deliverables

- [ ] `admin/index.html` — Main admin dashboard
- [ ] `admin/analytics.html` — Analytics page
- [ ] `admin/event-head.html` — Event head panel
- [ ] `js/pages/admin.js` — Admin logic (CRUD, tables, modals)
- [ ] `js/pages/admin-announcements.js` — Announcement manager
- [ ] `js/pages/admin-console.js` — Console manager
- [ ] Role-based access verified (non-admins redirected)

---

## PHASE 9: VOLUNTEER & OPERATIONS PAGES

> **Priority:** MEDIUM  
> **Estimated Time:** 1 week  
> **Risk Level:** MEDIUM  
> **Pages to build:**
> - `/volunteer` (QR scanner) → [`src/pages/volunteer/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/volunteer/)
> - `/checkin` (alias for volunteer)

### 🎯 Objectives

1. Port the volunteer QR scanner page.
2. Ensure camera access and QR code parsing work.
3. Port check-in status display (approved / duplicate / invalid).

### 9.1 Deliverables

- [x] `volunteer/index.html` + `js/pages/volunteer.js`
- [x] Camera QR scanner functional (with BarcodeDetector & fallback simulation)
- [x] Check-in API integration working (`/checkin/scan` & `/checkin/history`)
- [x] Sound/haptic feedback on scan result (chimes for approved, buzzers for duplicate/invalid)

---

## PHASE 10: TAILWIND → VANILLA CSS COMPLETE CONVERSION

> **Priority:** Runs parallel with all phases  
> **Estimated Time:** 3–4 weeks (cumulative across phases)  
> **Risk Level:** MEDIUM

### 🎯 Objectives

1. Convert every Tailwind utility class into semantic CSS classes.
2. Ensure responsive design works at all breakpoints.
3. Ensure dark theme consistency.

### 10.1 Conversion Strategy

**Step 1:** For each component, list every Tailwind class used.  
**Step 2:** Group classes into semantic CSS rules.  
**Step 3:** Replace inline Tailwind with class names.

### 10.2 Auxiliary Sub-Pages Ported
- [x] `/ctf` — Capture The Flag cyber range portal (`ctf/index.html` + `js/pages/ctf.js`)
- [x] `/leaderboard` — Real-time competition standings (`leaderboard/index.html` + `js/pages/leaderboard.js`)
- [x] `/results` — Official podium results & prize distributions (`results/index.html` + `js/pages/results.js`)
- [x] `/certificates` — Cryptographically verified credentials vault (`certificates/index.html` + `js/pages/certificates.js`)
- [x] `/faq` — Searchable query knowledge base accordion (`faq/index.html` + `js/pages/faq.js`)
- [x] `/feedback` — Operational debrief survey console (`feedback/index.html` + `js/pages/feedback.js`)
- [x] `/announcements` — Live chronological broadcast stream (`announcements/index.html` + `js/pages/announcements.js`)
- [x] `/food` — Food court directory & wallet pages (`food/index.html`, `food/wallet.html`, `food/topup.html`, `food/vendor.html` + `js/pages/food.js`)
- [x] `/photography` — Delegated community voting exhibition (`photography/index.html` + `js/pages/photography.js`)
- [x] `/qualifiers` — Pre-fest bracket elimination rounds (`qualifiers/index.html` + `js/pages/qualifiers.js`)
- [x] `/teams` — Squad creation and invite code joining (`teams/index.html` + `js/pages/teams.js`)
- [x] `/support` — Multi-channel technical helpdesk directory (`support/index.html` + `js/pages/support.js`)
- [x] `/payment`, `/receipt`, `/confirmation` — Commerce settlement and invoice pages (`payment/`, `receipt/`, `confirmation/` + `js/pages/payment.js`)

### 10.3 Deliverables

- [x] Complete CSS files covering all components and pages (`variables.css`, `reset.css`, `layout.css`, `components.css`, `animations.css`)
- [x] Responsive design verified across mobile, tablet, and desktop viewports
- [x] 100% pure vanilla HTML/CSS/JS without Tailwind runtime overhead

---

## PHASE 11: TESTING, POLISH & DEPLOYMENT

> **Priority:** CRITICAL — Final phase  
> **Estimated Time:** 2 weeks  
> **Risk Level:** MEDIUM

### 🎯 Objectives

1. Cross-browser testing and syntax validation.
2. Endpoint audit (verified 37/37 HTTP endpoints return 200 OK).
3. Service worker offline caching (`sw.js`).
4. Production static deployment configuration (`vercel.json`).

### 11.3 Deliverables

- [x] All 37 HTML endpoints tested and passing HTTP 200 OK
- [x] All 35 vanilla JavaScript modules passing `node --check` syntax audits
- [x] Static hosting deployment configuration finalized (`vercel.json`)
- [x] Offline Service Worker installed (`sw.js`)
- [x] Full parity achieved with original React codebase while keeping `Vyuham26_frontend/` untouched

---

## 📋 MASTER SUMMARY TABLE

| Phase | Description | Time | Risk | Dependencies |
|---|---|---|---|---|
| **Phase 0** | Preparation & Design System | 1 week | LOW | None |
| **Phase 1** | Core Infrastructure (State, Auth, API) | 2 weeks | HIGH | Phase 0 |
| **Phase 2** | Shared Components (Nav, Footer, Toaster) | 1.5 weeks | MEDIUM | Phase 1 |
| **Phase 3** | Cinematic Engine & Animations | 2.5 weeks | HIGH | Phase 0 |
| **Phase 4** | Homepage (all sections) | 2 weeks | MEDIUM | Phase 2, 3 |
| **Phase 5** | Sub-Pages (Events, Schedule, etc.) | 3 weeks | MEDIUM | Phase 2 |
| **Phase 6** | Auth Pages & Dashboard | 1.5 weeks | HIGH | Phase 1, 2 |
| **Phase 7** | Registration & Commerce | 1.5 weeks | HIGH | Phase 1, 6 |
| **Phase 8** | Admin Dashboard | 3 weeks | VERY HIGH | Phase 1, 2 |
| **Phase 9** | Volunteer & Operations | 1 week | MEDIUM | Phase 1, 2 |
| **Phase 10** | CSS Conversion (parallel) | 3–4 weeks | MEDIUM | All phases |
| **Phase 11** | Testing & Deployment | 2 weeks | MEDIUM | All phases |
| | **TOTAL** | **~19 weeks** | | |

---

## ⚠️ FINAL NOTES

### What You Gain
- **Zero build step** — edit HTML and refresh the browser
- **Smaller initial payload** — no React runtime (~45 KB gzipped) or Framer Motion (~30 KB)
- **Simpler mental model** — no JSX, no hooks, no virtual DOM
- **Wider hosting options** — works on any web server, no Node.js required

### What You Lose
- **Component reusability** — Nav/Footer changes must be applied to 34+ files
- **Automatic re-rendering** — every state change requires manual DOM updates
- **Framer Motion animations** — must be rebuilt from scratch in GSAP/CSS
- **Code-splitting** — all JS loads upfront (or requires a custom lazy-loader)
- **TypeScript safety** — no compile-time error checking
- **Cinematic page transitions** — lost in MPA architecture
- **Developer experience** — no hot module replacement, no React DevTools
- **Error boundaries** — no equivalent for graceful error recovery in vanilla JS
- **React ecosystem** — can't use any React library in the future

### Strong Recommendation
> If you proceed, **keep the admin dashboard as a separate React mini-app** (Phase 8). The admin panel alone is 143 KB of complex, stateful CRUD logic that would be painful and error-prone to maintain in vanilla JS. The public site can be vanilla while admin stays React — they share the same Supabase backend.
