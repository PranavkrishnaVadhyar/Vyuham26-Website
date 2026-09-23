# Vyuham 26 Website

Cinematic platform for Vyuham 26 — Digital University Kerala's national-level techno-cultural fest.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 with custom design tokens
- **Animation:** Framer Motion (UI feedback) + GSAP (narrative transitions)
- **Fonts:** Space Grotesk (display), Manrope (body), DM Mono (monospace)

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout (fonts, metadata, shell)
│   ├── page.tsx              # Home page
│   ├── not-found.tsx         # Custom 404
│   ├── sections/             # Home page sections
│   │   ├── HeroSection.tsx
│   │   ├── StatsBar.tsx
│   │   ├── AboutSection.tsx
│   │   ├── StreamsSection.tsx
│   │   ├── ScheduleSection.tsx
│   │   └── CtaSection.tsx
│   ├── about/page.tsx
│   ├── schedule/page.tsx
│   ├── events/
│   │   ├── page.tsx          # Events listing with filters
│   │   └── [slug]/page.tsx   # Event detail template
│   ├── venue/page.tsx
│   ├── sponsors/page.tsx
│   ├── contact/page.tsx
│   ├── faq/page.tsx
│   └── gallery/page.tsx
├── components/
│   ├── ui/                   # Atomic: Button, Chip, Badge, Countdown
│   ├── layout/               # Navbar, Footer
│   └── motion/               # AnimatedSection, ParticleField, Portal
├── data/                     # Static content (events, sponsors, FAQs)
└── styles/                   # Global CSS + Tailwind overrides
```

## Phases

- **Phase 0:** Design system, components, project scaffold ✅
- **Phase 1:** Public information site (all pages) ✅
- **Phase 2:** Registration, auth, payments, dashboards _(planned)_
- **Phase 3:** Food wallet, vendor portal, certificates _(planned)_

## Design Language

- **Theme:** "The Future Awaits" — fractured digital dimension / command center
- **Palette:** Dark charcoal (#06100b), emerald energy (#2ee59d), deep green, metallic white
- **Motion:** Cinematic but selective — scroll reveals, portal animation, particle field
- **Accessibility:** `prefers-reduced-motion` support, semantic HTML, ARIA labels
