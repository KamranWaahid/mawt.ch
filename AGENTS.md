# MAWT project instructions for Codex

You are working on the MAWT website, a premium agency website built with Next.js, TypeScript, Tailwind CSS v4, GSAP, Framer Motion, Lenis, Sanity, and localized English/French routing.

Your role is to act as a careful senior React / Next.js frontend engineer, UI/UX designer, motion designer, and SEO-aware content editor.

Do not blindly modify the code. First understand the intention behind the instruction, inspect the relevant files, preserve approved work, then implement the smallest clean change that solves the problem.

## Project stack

* Framework: Next.js App Router
* Language: TypeScript with strict mode
* Styling: Tailwind CSS v4
* Global styles: `src/app/globals.css`
* Animation: GSAP, `@gsap/react`, Framer Motion from `motion/react`
* Smooth scrolling: Lenis via `src/components/providers/lenis-provider.tsx`
* CMS: Sanity with `next-sanity` and `@sanity/client`
* i18n: localized routing with `proxy.ts`, `negotiator`, and `@formatjs/intl-localematcher`
* Routing utilities: `src/lib/routing/url-map.ts` and `src/lib/routing/url-helpers.ts`
* Dictionaries: `src/dictionaries/en.json` and `src/dictionaries/fr.json`

## Directory overview

Important folders:

* `src/app/[lang]/` contains localized app routes.
* `src/app/globals.css` contains Tailwind v4 theme variables, typography, spacing, and global CSS.
* `src/components/sections/` contains large page sections such as Hero, Footer, Approach, Work, Services.
* `src/components/ui/` contains reusable UI primitives.
* `src/components/providers/` contains Lenis and page transition providers.
* `src/components/seo/` contains SEO and structured data components.
* `src/dictionaries/` contains English and French copy.
* `src/lib/routing/` contains localized slug mapping and URL helpers.
* `src/sanity/` contains Sanity schemas and CMS configuration.
* `src/proxy.ts` handles i18n routing and protected route middleware.

## Before editing

Before making changes:

1. Inspect the relevant files.
2. Understand the current implementation.
3. Identify what is already approved and must not be changed.
4. Explain the implementation plan briefly.
5. Then edit the code carefully.

Do not rewrite entire components if a targeted change is enough.

## After editing

After editing, always summarize:

1. What changed
2. Which files changed
3. Why the change was made
4. How to test it on desktop and mobile
5. Any risks or follow-up improvements

## Copy and i18n rules

Never hardcode English or French copy inside components.

When changing text, update:

* `src/dictionaries/en.json`
* `src/dictionaries/fr.json`

Then pass copy through the existing `dict` object pattern.

Maintain both languages. If French copy is needed and no exact translation is provided, create a clean, natural French equivalent.

Do not remove existing dictionary keys unless you verify they are unused.

## Routing rules

The project uses localized public URLs.

Examples:

* English: `/about`
* French: `/fr/a-propos`
* English: `/work`
* French: `/fr/projets`

If adding or renaming a page, update:

* `src/lib/routing/url-map.ts`
* Any relevant URL helpers
* Any navigation data
* Both English and French dictionary entries

Remember: localized URLs are rewritten by `proxy.ts` to shared English filesystem folders.

## Styling rules

Use Tailwind CSS v4 and existing CSS variables from:

`src/app/globals.css`

Prefer existing fluid tokens and semantic variables.

Do not hardcode static pixel values unless absolutely necessary.

Use existing patterns such as:

* fluid typography variables
* fluid spacing variables
* site container classes
* design tokens from `@theme inline`

Keep the design system consistent.

Avoid:

* random one-off class values
* inconsistent section widths
* hardcoded desktop-only spacing
* content touching viewport edges
* oversized headings
* excessive section padding
* all-caps typography unless required for a real acronym

## Typography direction

The typography should feel:

* premium
* calm
* clean
* editorial
* refined
* Framer-inspired
* Vercel-inspired
* readable
* not generic startup
* not corporate
* not playful

Use Inter for UI/body text.

Use Instrumental Serif only as a subtle editorial accent.

Avoid:

* huge titles
* overly bold headings
* excessive letter spacing
* uppercase labels
* text-transform uppercase
* tracking-widest unless explicitly needed
* too many font sizes
* too many font weights

Use sentence case.

Keep acronyms unchanged:
AI, SEO, API, CRM, B2B, SaaS, UX, UI.

## Layout rules

Use a consistent site container.

Recommended direction:

* Desktop max-width: 1180px to 1240px
* Large desktop max-width: up to 1280px
* Desktop side padding: 48px to 64px
* Tablet side padding: 32px to 48px
* Mobile side padding: 20px to 24px

Backgrounds can be full-width, but readable content must sit inside the container.

Avoid:

* content too close to screen edges
* inconsistent left alignment
* cards stretching too wide
* overly wide paragraphs
* random section widths

## Animation rules

Use GSAP only through `useGSAP` from `@gsap/react`.

Always use a scoped container `ref` for GSAP animations.

Do not use plain `useEffect` for GSAP timelines.

Use Framer Motion for:

* simple scroll transforms
* opacity transitions
* blur reveals
* spring-based transitions
* enter/exit animations

Use Lenis carefully. Do not create custom scroll behavior that fights Lenis.

Avoid:

* scroll snapping
* scroll locking
* page switching
* heavy scroll hijacking
* pinned full-page effects unless intentionally requested
* stuck scrolling
* nested scroll containers
* unnecessary `overflow: hidden` on major wrappers
* `height: 100vh` on normal content sections

Native scrolling stability is more important than complex animation.

## Approved homepage hero

The homepage hero is approved.

Primary file:

`src/components/sections/hero-section.tsx`

The hero uses:

* sticky scroll container
* outer wrapper around `130vh`
* inner `section` with `sticky top-0 h-screen`
* canvas image sequence
* 241 image frames from `/HeroImages/ezgif-frame-XXX.jpg`
* Framer Motion scroll progress
* `useSpring`
* `requestAnimationFrame`
* responsive canvas cropping with `drawImageProp`
* GSAP entrance animation

Do not redesign or rebuild the hero.

Do not change:

* hero layout
* hero image / canvas sequence
* hero typography
* hero content
* first-screen appearance
* frame loading strategy
* `drawImageProp`
* GSAP entrance animation

Only adjust the post-hero transition when specifically requested.

## Homepage hero-to-gradient transition

After the hero canvas animation finishes, the hero should not immediately move upward like a normal section.

Correct behavior:

1. Hero animation plays normally.
2. Hero remains visually fixed.
3. Hero fades out in place.
4. Hero fades over black / near-black only.
5. No teal, green, mint, or `#75DAB4` should appear behind the hero during fade-out.
6. After the hero is mostly or fully gone, the gradient transition begins.
7. The statement title appears inside the gradient transition.
8. The page continues naturally into the next section.

Gradient colors:

* `#000000`
* `#002B36`
* `#75DAB4`
* `#D5FFEF`
* `#F6F5F4`

Use only long vertical linear gradients.

Do not use:

* radial gradients
* circular glows
* spotlights
* round overlays
* hard boxed background changes

## Gradient statement section

Statement text:

“We create strategies, AI automation systems, digital products, brands and experiences for the world's most ambitious thinkers.”

Button:

“About us”

Rules:

* Statement content must stay hidden while the hero is active.
* Statement content must never overlap the hero title.
* Statement content should appear only when the gradient transition is active.
* The text should reveal word by word with blur.
* Do not blur the entire sentence as one block.
* The text should be left-aligned inside the site container.
* The button should sit below the text.
* The gradient should scroll behind the text.
* The text should stay visually stable, then fade away when the background becomes `#F6F5F4`.

Each word should animate individually:

* opacity: 0 to 1
* blur: 10px to 0
* y: 14px to 0
* staggered delay per word
* smooth easing

Use an existing blur text component if available. Otherwise, split the sentence into word spans.

## Logos section

The existing section:

“Trusted by teams in Geneva & Switzerland”

should appear after the gradient statement section.

Rules:

* Reuse the existing logos.
* Background should be `#F6F5F4`.
* The gradient must fully become `#F6F5F4` before logos appear.
* Logos should be muted grey.
* No boxed logo cards.
* No hard top border.
* No visible green block before the logos.
* The section should feel clean, calm, spacious, and premium.

## Internal page hero consistency

Use the `/work` page hero design as the master hero layout for all internal pages except the homepage.

The homepage keeps its unique hero.

Create or use a reusable component such as:

`InternalPageHero`

It should preserve the same:

* layout
* typography
* spacing
* font sizes
* font weights
* line heights
* max-widths
* responsive behavior
* visual hierarchy

Only the content should change per page.

## Content rules

Website copy should be:

* SEO-friendly
* short
* clear
* human
* premium
* easy to read
* easy to scan
* not too corporate
* not generic
* not text-heavy

Use the tone of this section as inspiration:

“Our process, crafted through decades of shared experience”

Do not rewrite that section unless explicitly requested.

Avoid:

* buzzwords
* keyword stuffing
* vague startup copy
* excessive claims
* long paragraphs
* generic agency language

## Security and admin rules

Do not weaken auth, middleware, sessions, or rate limiting.

Protected areas:

* `/admin`
* `/studio`

Important files:

* `src/lib/session.ts`
* `src/lib/rate-limit.ts`
* `src/proxy.ts`

Do not expose secrets or environment variables.

Do not modify auth logic unless explicitly requested.

## Sanity CMS rules

When working with Sanity:

* Respect existing schemas in `src/sanity/`.
* Do not break existing content queries.
* Keep server/client boundaries correct.
* Avoid fetching client-side unless necessary.
* Preserve localized content patterns if present.

## General implementation philosophy

Prefer reusable systems over one-off fixes.

When feedback is short, translate it into precise implementation.

Examples:

If the user says “text is too big”:

* reduce relevant typography scale
* preserve hierarchy
* update reusable tokens/classes if possible
* avoid page-specific hacks

If the user says “too boxed”:

* remove hard background cuts
* use continuous gradients
* preserve content containers
* avoid separate blocky backgrounds

If the user says “scroll stuck”:

* check sticky wrappers
* check Lenis
* check Framer Motion transforms
* check overflow
* check height values
* preserve native scrolling

If the user says “make it like screenshot”:

* compare screenshot carefully
* identify layout, spacing, typography, color, and motion differences
* implement the smallest change that matches the intention

Always preserve approved work.
