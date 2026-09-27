# VYUHAM '26 — The Future Awaits ⚡

<p align="center">
  <img src="Vyuham26_frontend/public/vyuham_logo.png" alt="VYUHAM '26 Logo" width="160" />
</p>

<p align="center">
  <strong>EDITION VII &bull; DIGITAL UNIVERSITY KERALA</strong><br />
  <em>Technocity Campus, Thiruvananthapuram, Kerala &bull; 30 OCT — 01 NOV 2026</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7.3-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/GSAP-ScrollTrigger-88ce02?style=for-the-badge&logo=greensock&logoColor=black" alt="GSAP" />
</p>

---

## 🌌 Overview

**VYUHAM '26** is the flagship multi-stream techno-cultural festival of **Digital University Kerala (DUK)**. Spanning 72 continuous hours, the festival brings together pioneering technology, electrifying cultural performances, high-octane esports, and socially transformative impact initiatives.

Built with a futuristic, cyberpunk-inspired cinematic aesthetic, this repository contains the complete progressive web application (PWA) for the festival—featuring interactive 3D WebGL atmosphere, dynamic registration workflows, real-time schedule grids, digital ticketing, campus food wallet, volunteer check-in scanner, and a restricted administrative command center.

### 📊 Festival Metrics

| Metric | Stat |
| :--- | :--- |
| **Duration** | **72 Hours** Non-Stop |
| **Events** | **48+ Competitions & Showcases** |
| **Colleges** | **120+ Institutions Across India** |
| **Prize Pool** | **₹12,00,000+** |
| **Dates** | **30 October – 01 November 2026** |
| **Venue** | **Technocity Campus, Thiruvananthapuram, Kerala 695317** |

---

## ⚡ The Four Streams

VYUHAM '26 converges across four core disciplines:

```
                  ┌───────────────────────────────┐
                  │          VYUHAM '26           │
                  └──────────────┬────────────────┘
         ┌───────────────┬───────┴───────┬───────────────┐
         ▼               ▼               ▼               ▼
   [ TECHNOLOGY ]   [ CULTURE ]     [ GAMING ]      [ IMPACT ]
   • Hackathon 36   • Choreonite    • Valorant LAN  • GreenTech Ideation
   • Jeopardy CTF   • Battle of     • FIFA Arena    • Policy Crucible
   • AI / Robotics    the Bands     • Sim Racing    • Social Innovation
   • Web3 Citadel   • Street Play   • BGMI / FPV    • Youth Leadership
```

1. **Technology (`#18c47c`)**: 36-hour hackathons, hardware robotics, jeopardy-style CTFs, and AI challenges.
2. **Culture (`#e056fd`)**: Intercollegiate dance choreography, battle of the bands, pro-nites, and literary events.
3. **Gaming (`#00f0ff`)**: High-stakes LAN championships, esports arenas, fighting games, and simulator rigs.
4. **Impact (`#f0932b`)**: Sustainability case summits, entrepreneurship pitching, and social impact policy hackathons.

---

## ✨ Key Features & Architecture

### 🎬 Immersive Cinematic Experience
- **Interactive Prologue**: Chaptered narrative sequence with sound effects and skip state persistence (`sessionStorage`).
- **WebGL Atmospheric Background**: Built using Three.js with real-time particle dynamics and reactive audio synthesis.
- **Micro-Animations & Smooth Motion**: Powered by **GSAP (GreenSock)**, **ScrollTrigger**, **Lenis Smooth Scroll**, and **Framer Motion**.
- **Cinematic Cursor & Sound FX**: Web Audio API-synthesized cyber feedback chimes and interactive magnetic cursor.
- **Accessibility First**: Automatic detection of `prefers-reduced-motion` and data-saver connections.

### 🎫 Event Discovery & Registration
- Live event directory with instant stream filtering (Tech, Culture, Gaming, Impact), day segregation, and instant fuzzy search.
- Deep-linked event dossiers with dynamic routing (`/events/:slug` and `/register/:slug`).
- Multi-member team validation and solo registration pipelines with validation.

### 📅 Schedule Matrix & Venue Navigator
- Interactive 3-day timeline categorized by event intensity and time beats.
- Technocity campus locator map with interactive zones, auditorium pinpoints, and navigation links.

### 💳 Campus Services & Digital Wallet
- **Digital Fest Ticket**: Dynamic QR-encoded passes for entry verification.
- **Food & Beverage Ecosystem**: Digital campus wallet, on-the-go balance top-up simulator, and vendor POS checkout interface (`/food`, `/food/wallet`, `/food/topup`, `/food/vendor`).

### 📱 Volunteer & Field Tools
- **Camera QR Scanner (`/volunteer` / `/checkin`)**: Built-in camera feed scanner for fast gates check-in and pass verification.

### 🛡️ Admin Command Portal
- **Role-Based Access**: Multi-tab administration dashboard covering registration analytics, gate logs, and event managers.
- **Stealth Root Override**:
  - Hotkey: <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd> (or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F12</kbd>)
  - Terminal trigger: Type `root26` or `vyuhamadmin` anywhere outside input fields to toggle admin clearance.

### 🌐 Offline & Progressive Web App
- Service worker registration with asset caching (`public/sw.js`).
- Web app manifest (`manifest.json`) for standalone home screen installation.
- Real-time online/offline network detection banners.

---

## 🛠️ Tech Stack

- **Runtime & Framework**: [React 19](https://react.dev/) + [TypeScript 5.9](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 7](https://vite.dev/) + [Vite SingleFile Plugin](https://github.com/richardtallent/vite-plugin-singlefile)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/vite`
- **Typography**: Archivo, Inter, and JetBrains Mono via Google Fonts
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Animation**: [GSAP](https://gsap.com/) (ScrollTrigger), [Framer Motion](https://www.framer.com/motion/), [Lenis](https://lenis.darkroom.engineering/)
- **Routing Engine**: Custom unified Hash + Path client router with Next.js component shims (`next/link`, `next/image`, `next/navigation`)

---

## 📁 Repository Structure

```text
Vyuham26-Website/
├── .gitignore                      # Git ignore configuration
├── README.md                       # Repository documentation (this file)
└── Vyuham26_frontend/              # Core frontend web application
    ├── index.html                  # HTML entry point with fonts & metadata
    ├── package.json                # Project dependencies & scripts
    ├── tsconfig.json               # TypeScript configuration
    ├── vite.config.ts              # Vite configuration with Tailwind v4 & aliases
    ├── public/                     # Static assets, logos, manifest & service worker
    │   ├── vyuham_logo.png         # Official VYUHAM emblem
    │   ├── VYUHAM26_logo.svg       # Vector logomark
    │   ├── manifest.json           # PWA web manifest
    │   └── sw.js                   # Service Worker script
    └── src/
        ├── App.tsx                 # Root application & platform router
        ├── main.tsx                # React DOM entry point
        ├── index.css               # Global theme tokens, typography, and scrollbar styles
        ├── components/             # Reusable UI & section components
        │   ├── admin/              # Admin dashboard, analytics & secret listener
        │   ├── auth/               # Authentication modals & profile drawers
        │   ├── cinematic/          # 3D Atmosphere, Intro cinematic, transitions & audio
        │   ├── forms/              # Registration and ticket purchase forms
        │   ├── layout/             # Navigation bars, progress rails, and footers
        │   ├── motion/             # Animated section wrappers
        │   ├── sections/           # Hero, Awakening, Streams, Events, About, Countdown
        │   └── ui/                 # Cyber buttons, badges, kicker, toaster, terminal
        ├── context/                # React contexts (AuthContext, etc.)
        ├── data/                   # Fest datasets (events, media URLs, schedule, team)
        ├── lib/                    # Global state store, sound engine, scroll & anim helpers
        ├── pages/                  # Route modules (events, schedule, tickets, food, admin, etc.)
        ├── shims/                  # Next.js compatibility shims for Vite execution
        └── utils/                  # Utility helper functions
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher (recommended: `v20+`)
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PranavkrishnaVadhyar/Vyuham26-Website.git
   cd Vyuham26-Website
   ```

2. **Navigate into the frontend project directory:**
   ```bash
   cd Vyuham26_frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Launch the local development server:**
   ```bash
   npm run dev
   ```

5. **Open in your browser:**
   ```
   http://localhost:5173
   ```

---

## 📜 Available Scripts

Within the `Vyuham26_frontend` directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles TypeScript and creates an optimized production bundle in `dist/`. |
| `npm run preview` | Runs a local web server to preview the production build output. |

---

## 🧭 Navigation & Route Map

The application supports unified URL path routing and hash-based navigation:

| Path | Purpose / Page |
| :--- | :--- |
| `/` | Main cinematic homepage (Hero, Streams, Experience, About, Countdown) |
| `/events` | Complete events directory with filter by stream and day |
| `/events/:slug` | In-depth event detail dossier with rules, prizes, and schedule |
| `/register` | Registration launchpad |
| `/register/:slug` | Event-specific registration form |
| `/schedule` | Comprehensive 3-day timeline beat matrix |
| `/venue` | Technocity campus map & venue directions |
| `/ticket` | Digital festival pass with QR code |
| `/food` | Food & beverage marketplace overview |
| `/food/wallet` | Digital campus meal & coupon wallet |
| `/food/topup` | Balance top-up terminal |
| `/food/vendor` | Vendor point-of-sale terminal |
| `/volunteer` | Attendee ticket QR verification scanner |
| `/leaderboard` | Live contest & hackathon standings |
| `/hackathon` | Dedicated Hackathon 36 information portal |
| `/ctf` | Dedicated Capture The Flag arena portal |
| `/admin` | Administrative control panel *(Requires root unlock)* |

---

## 🚀 Deployment

The project builds into a standalone client-side single bundle, ready to deploy to any modern static hosting service:

### Vercel
```bash
npx vercel Vyuham26_frontend
```

### Netlify
Point the build settings to:
- **Base directory:** `Vyuham26_frontend`
- **Build command:** `npm run build`
- **Publish directory:** `Vyuham26_frontend/dist`

### Cloudflare Pages or GitHub Pages
Upload or link the repository and specify `dist` as the build output directory from `Vyuham26_frontend`.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit your changes: `git commit -m "feat: add amazing feature"`.
4. Push to the branch: `git push origin feature/amazing-feature`.
5. Open a Pull Request.

---

## 📞 Contact & Institutional Info

- **Institution**: [Digital University Kerala](https://duk.ac.in)
- **Address**: Technocity Campus, Mangalapuram, Thiruvananthapuram, Kerala 695317, India
- **Email**: `vyuham@duk.ac.in`
- **Phone**: `+91 471 278 8000`

---

<p align="center">
  <sub>Developed with passion for <strong>VYUHAM '26</strong> &bull; Built by the students of Digital University Kerala.</sub>
</p>
