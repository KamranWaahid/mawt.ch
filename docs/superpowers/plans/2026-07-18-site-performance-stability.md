# Site-wide navigation/scrolling/transition stability — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make navigation, scrolling, transitions and loading feel stable and responsive site-wide (per `Site-Performance.md` brief) via targeted fixes — no redesign, no visual identity changes.

**Architecture:** The site's animation stack is Lenis (single root instance) + Framer Motion (motion/react) + one GSAP file. The instability comes from: over-aggressive Lenis smoothing, per-scroll-frame React setState in large components, uncoordinated Lenis stop/start across three components, a mobile menu without scroll lock nested under a transformed header, eager media loading, and un-throttled scroll/resize handlers doing layout reads/writes. Fixes are per-file, minimal, behavior-preserving.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, Lenis 1.3, motion 12, GSAP 3.13 (one file).

## Global constraints (from the brief + CLAUDE.md)

- Do NOT change: visual identity, typography, copy, colors, layouts, page structure, intended animations, section order.
- Homepage hero is approved — fix technical instabilities only, no redesign.
- One scroll-lock mechanism per overlay; one animation system per property per element.
- No arbitrary timeouts to coordinate animations; use lifecycle events.
- No test infra exists — verification is `npm run typecheck` + `npm run build` + manual scenario list from the brief.

---

### Task 1: Lenis provider — responsiveness + hot-path cost
**Files:** Modify `src/components/providers/lenis-provider.tsx`
- Retune: `lerp 0.035 → ~0.09`, `wheelMultiplier 0.45 → ~0.8`, drop `duration` (lerp wins when both set; keep one source of truth). Keep smooth premium feel, remove "dragging behind input" feel (brief: scroll must not feel delayed/heavy).
- `prevent` callback: do the cheap `scrollWidth > clientWidth` check before `getComputedStyle` (avoids computed-style query on the scroll hot path for the common case).
- Add `anchors: { offset: -96 }` so in-page `#hash` links scroll through Lenis and land below the fixed header.

### Task 2: Page transition — history restoration + leaked-stop failsafe
**Files:** Modify `src/components/providers/page-transition.tsx`
- Track `popstate` (ref flag). On back/forward navigation, skip the forced `scrollTo(0)` so the browser/Next restoration wins. Push navigations keep the reset-to-top.
- On every pathname change, defensively `lenis.start()` — any leaked `stop()` from section components can never freeze the next page.

### Task 3: Header + mobile menu
**Files:** Modify `src/components/sections/site-header.tsx`
- Move the mobile-menu overlay out of the transformed `<motion.header>` (render as sibling in a fragment) — fixes the fixed-position containing-block bug.
- Lock background scroll while the menu is open: single mechanism = `lenis.stop()` / `start()` in one effect with cleanup (covers close, route change, unmount).
- Hysteresis for `isPastHero` (enter/exit thresholds a few px apart); cache `innerHeight` in a ref updated on resize.
- `isDark` must account for the open mobile menu even when a page theme override is active.

### Task 4: Cinematic hero (approved — technical fixes only)
**Files:** Modify `src/components/sections/cinematic-hero-section.tsx`
- Single scroll source: keep the Lenis callback; native `scroll` listener only as a no-Lenis fallback, attached once (refs, not state deps).
- Cache `window.innerHeight * 4` in a ref updated on resize.
- Scroll-lock during `videoPlaying`: keep `lenis.stop()`+`.lenis-stopped` CSS as the one mechanism; drop the manual `document.body.style.overflow` writes.
- Remove the dead `.hero-title-line` GSAP tween (targets a class that no longer exists — no-op).
- Add missing dimensions to the plain `<img>` logo.

### Task 5: Homepage hero — kill per-frame re-renders, fix logo links
**Files:** Modify `src/components/sections/homepage-hero-section.tsx`
- Replace `setScrollProgress(latest)` per scroll frame: derive continuous styles via `useTransform` motion values; keep only threshold booleans in React state (React bails on unchanged booleans). No visual change.
- Replace the three `<a href={/${lang}}>` logo links with `next/link` (full-page reload bug).

### Task 6: Subpage hero — same per-frame setState fix
**Files:** Modify `src/components/sections/subpage-hero.tsx`

### Task 7: Flower frame-sequence — redraw guard, preload, resize
**Files:** Modify `src/components/sections/approach-flower-sequence.tsx`
- Skip redraw when the clamped frame index equals the last drawn index.
- Reduce preload concurrency 18 → 6 (stop flooding the network on mount).
- Debounce the resize handler; ignore height-only changes below a threshold (mobile URL-bar) so the canvas isn't reallocated/cleared mid-scroll.

### Task 8: ASCII wave — park the idle rAF loop, resize hygiene
**Files:** Modify `src/components/ui/ascii-wave.tsx`
- Stop rescheduling rAF when inactive; restart on activation.
- Debounce/threshold the ResizeObserver → canvas reallocation path (mobile URL-bar).

### Task 9: Approach sticky steps — lock mechanism, units, idle loop
**Files:** Modify `src/components/sections/approach-sticky-steps.tsx`
- Single scroll-lock mechanism: keep `lenis.stop()` (+ its CSS class); remove the manual `body`/`html` overflow mutations.
- `100vh → 100dvh` on the four panel heights.
- Park the continuous rAF loop when there is no pending direction.
- Keep the step state machine behavior intact (brief: fix implementation, don't remove the animation).

### Task 10: Problem section — throttle scroll work
**Files:** Modify `src/components/sections/problem-section.tsx`
- Coalesce the scroll/resize handler through rAF (one measurement per frame max). Keep the collapse logic and scroll compensation untouched.

### Task 11: Small stability fixes
**Files:** Modify `src/components/ui/custom-cursor.tsx` (passive listeners), `src/components/ui/status-grid.tsx` (index-seeded deterministic values instead of `Math.random()` in render — hydration), `src/components/sections/site-footer.tsx` (stable keys for social links), `src/components/sections/testimonials-section.tsx` + `src/components/ui/selected-work-section` images (`sizes` on fill images; drop `priority` from below-fold bg), `src/app/[lang]/services/[family]/[service]/page.tsx` (`scroll-mt` on `#projects` target).

### Task 12: Global CSS + error recovery
**Files:** Modify `src/app/globals.css`; Create `src/app/[lang]/error.tsx`
- `@media (prefers-reduced-motion: reduce)`: pause `.gradient-drift` and `.animate-marquee`.
- `scroll-padding-top` on html for native anchor fallback.
- Branded `error.tsx` that restores interaction and offers a recovery route (brief: error recovery).

### Task 13: Verification
- `npm run typecheck` → clean.
- `npm run build` → clean production build.
- Manual scenario checklist from the brief (fast scroll, direction reversal, mobile menu, back/forward, refresh mid-page).
