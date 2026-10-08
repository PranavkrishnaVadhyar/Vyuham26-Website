# VYUHAM '26 — Frontend Application ⚡

Web application and interactive digital experience for **VYUHAM '26**, the premier techno-cultural festival of **Digital University Kerala (DUK)**.

For full festival details, architecture diagrams, and institutional background, refer to the [Root README](../README.md).

---

## 🚀 Quick Start

Ensure Node.js 18+ is installed.

```bash
# Install dependencies
npm install

# Run Vite dev server with hot reload
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Tech Stack & Libraries

- **Framework**: React 19 + TypeScript 5.9
- **Bundler**: Vite 7 (`vite-plugin-singlefile`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animation**: GSAP (ScrollTrigger), Framer Motion, Lenis Smooth Scroll
- **3D Graphics**: Three.js WebGL particle scene
- **Icons & Typography**: Archivo, Inter, JetBrains Mono

---

## 📂 Source Overview

```text
src/
├── App.tsx             # Root router & application shell
├── main.tsx            # Entry point
├── index.css           # Global theme variables & tokens
├── components/         # Modular UI blocks (Cinematic, Admin, Sections, UI)
├── context/            # React context providers (AuthContext, etc.)
├── data/               # Static datasets (events, media, schedule, team)
├── lib/                # Store, sound synthesizer, scroll engine, anim helpers
├── pages/              # Page modules & dynamic routes
├── shims/              # Compatibility shims for next/link, next/image, next/navigation
└── utils/              # Helper utilities
```

---

## 🛡️ Admin Root Access

- **Hotkey**: <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd> or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F12</kbd>
- **Passphrase**: Type `root26` or `vyuhamadmin` anywhere on the screen (outside inputs) to toggle admin access.
- **Scope**: This only reveals/conceals the admin console UI. Admin API calls are authorized separately —
  either a Supabase session whose profile role is `admin`, or the `X-Admin-Key` header carrying the
  backend's `ADMIN_ACCESS_KEY` (set it server-side; never reuse a word that appears in this source tree,
  and never bake secrets into `VITE_*` variables — they are public in the built bundle).
