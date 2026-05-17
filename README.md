# MAWT — Premium Technical Execution Platform

A high-end, Swiss-minimalist portfolio and technical execution platform built with Next.js 16, TypeScript, and Sanity CMS.

## Stack & Technologies

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Motion**: 
  - `motion/react` (Framer Motion) for micro-animations and scroll reveals.
  - `GSAP` for complex timeline-based hero sequences.
  - `Lenis` for premium smooth scrolling.
- **CMS**: Sanity v5 (Integrated Studio at `/studio`).
- **Internationalization**: Custom dictionary-based i18n (EN/FR support).
- **Search**: `Fuse.js` for real-time documentation fuzzy search.

## Key Features

- **Interactive Micro-Animations**: Unified spring-based hover transforms and staggered scroll reveals.
- **Responsive Orchestration**: Fluid typography (`clamp()`) and glassmorphic mobile navigation.
- **Documentation Center**: Multi-level sidebar navigation with real-time fuzzy search.
- **Multi-Step Contact System**: Animated 3-step lead generation form with real-time validation.
- **Premium UI Components**: Magnetic cursor states, custom loaders, and atmospheric background noise.
- **Accessibility**: ARIA-compliant components, keyboard navigation support, and reduced-motion preferences.

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env.local` and set your Sanity credentials:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

*Note: The platform includes a robust fallback system. If Sanity credentials are missing, it will automatically serve polished mock data.*

### Development

```bash
npm run dev
```

Visit:
- **Frontend**: `http://localhost:3000`
- **CMS Studio**: `http://localhost:3000/studio`

## Project Structure

- `src/app/[lang]` - Localized page routes and layouts.
- `src/components/sections` - Core page sections (Hero, Services, Vision).
- `src/components/ui` - Reusable interactive components (Buttons, Grids, Forms).
- `src/components/providers` - Context providers (Motion, Smooth Scroll, Transitions).
- `src/dictionaries` - i18n translation files.
- `src/lib` - Sanity queries, utility functions, and type definitions.

## Deployment

Optimized for Vercel deployment. Ensure environment variables are configured in the Vercel dashboard.

---
Built by Antigravity — MAWT Technical Execution Partner.
