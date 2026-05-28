# Brief 10 — A/B testing with Statsig (heroes)

> **Prerequisites:**
> 1. Read `.cursor/briefs/00-context-mawt-overview.md` first.
> 2. Read `.cursor/briefs/content/hero-variants.md` for the actual hero copy variants to test.
> 3. Statsig docs: https://docs.statsig.com — verify latest Next.js SDK API before implementing.

## Context

MAWT runs on Hostinger (NOT Vercel) → Vercel A/B testing native is unavailable. Statsig free tier (1M events/month) was selected as the A/B testing tool. Compatible with Hostinger via client/server SDKs.

The first experiment: **homepage hero variants**.
- 🇫🇷 3 variants (V1 humain direct, V3 gain temps/argent, V5 problem solver)
- 🇬🇧 2 variants (V1 senior humans, ChallengerA optimize time/cost)

Full hero copy is in `content/hero-variants.md`.

## Decisions

| Param | Value |
|---|---|
| Tool | Statsig (free tier) |
| FR variants | 3 (V1 baseline + V3 + V5) |
| EN variants | 2 (V1 baseline + ChallengerA) |
| Split | 33/33/33 (FR), 50/50 (EN) |
| Primary metric | CTR on primary CTA |
| Secondary metric | Scroll past hero · Contact form completion |
| Run duration | 4 weeks max OR 95% statistical confidence (whichever first) |
| Allocation | All homepage visitors |
| Sticky assignment | Yes (return visitors see same variant for entire test) |

## Technical spec

### Step 1 — Create Statsig account + project

1. Sign up at https://statsig.com
2. Create project "MAWT"
3. Get API keys :
   - **Server secret key** (server-side, never expose to browser)
   - **Client key** (publishable, browser-safe)
4. Store in env :
   ```
   STATSIG_SERVER_KEY=secret-xxx        # in .env.local, NEVER commit
   NEXT_PUBLIC_STATSIG_CLIENT_KEY=client-yyy   # safe to expose
   ```
5. Add both to Hostinger env vars for production.

### Step 2 — Install Statsig SDK

```bash
npm install @statsig/react-bindings @statsig/js-client
```

(Verify the latest package name — Statsig refactored SDKs in 2024.)

### Step 3 — Statsig provider

Create `src/lib/statsig/provider.tsx` :

```tsx
'use client';
import { StatsigProvider, useClientAsyncInit } from '@statsig/react-bindings';
import type { ReactNode } from 'react';

export function StatsigClientProvider({ children, userID }: { children: ReactNode; userID: string; }) {
  const { client, isLoading } = useClientAsyncInit(
    process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!,
    { userID },
  );
  
  if (isLoading) return <>{children}</>;  // render children with no Statsig wrapping during init (no flash)
  
  return <StatsigProvider client={client}>{children}</StatsigProvider>;
}
```

Wrap in root layout (`src/app/[lang]/layout.tsx`) :

```tsx
import { cookies } from 'next/headers';
import { v4 as uuid } from 'uuid';

export default async function RootLayout({ children }) {
  const cookieStore = cookies();
  let userID = cookieStore.get('mawt_uid')?.value;
  if (!userID) {
    userID = uuid();
    // Set the cookie via a server action or response header (out of scope for layout)
    // TODO: implement persistent uuid via middleware
  }
  
  return (
    <html>
      <body>
        <StatsigClientProvider userID={userID}>
          {children}
        </StatsigClientProvider>
      </body>
    </html>
  );
}
```

### Step 4 — Create the experiments in Statsig dashboard

In Statsig UI :

**Experiment 1 — `mawt_hero_fr`**
- Allocation : 100% of users on `/fr*` paths
- Variants : `v1_humain` (33.3%), `v3_gain` (33.3%), `v5_problem_solver` (33.3%)
- Primary metric : `cta_primary_click`
- Secondary metrics : `scroll_past_hero`, `contact_form_submit`

**Experiment 2 — `mawt_hero_en`**
- Allocation : 100% of users on `/en*` paths
- Variants : `v1_senior_humans` (50%), `challenger_a_optimize` (50%)
- Same metrics

**Experiment 4 — `mawt_bottom_cta_fr`** (homepage bottom CTA)
- Allocation : 100% users on `/fr` (homepage only)
- Variants : `v1_30min` (50%), `v3_specific_process` (50%)
- Primary metric : `bottom_cta_click` (click on Démarrer/CTA primary)
- Secondary : `contact_form_submit`
- Sticky bucketing

**Experiment 5 — `mawt_bottom_cta_en`** (homepage bottom CTA)
- Allocation : 100% users on `/en` (homepage only)
- Variants : `v1_30min` (50%), `v3_specific_process` (50%)
- Same metrics

**Experiment 6 — `mawt_meta_home_fr`** (FR homepage meta title — EDGE experiment)
- ⚠️ Edge experiment : variant assigned server-side from cookie hash
- Allocation : 100% users on `/fr` (homepage only)
- Variants : `v1_short` (50%), `v2_longer` (50%)
- Primary metric : organic CTR from Google SERP (measured externally via Search Console)
- Duration : 8-12 weeks (organic CTR signal is slow)
- ⚠️ Run LAST, after hero + method + bottom CTA experiments are settled, to avoid attribution confusion

### Bottom CTA component (in addition to Hero + Method)

`src/components/homepage/BottomCta.tsx` :
- Reads variant from `mawt_bottom_cta_fr` or `mawt_bottom_cta_en` based on lang
- Renders the matching copy from `src/content/bottom-cta-copy.ts`
- Tracks `bottom_cta_click` on primary CTA click

`src/content/bottom-cta-copy.ts` :
```ts
export const BOTTOM_CTA_COPY = {
  fr: {
    v1_30min: {
      h2: 'Discutons de votre projet',
      body: '30 minutes pour comprendre votre besoin. Pas de devis bâclé, pas de pression. Juste un échange direct avec ceux qui vont construire.',
      ctaPrimary: { label: 'Démarrer', href: 'contact' },
      ctaSecondary: { label: 'Voir nos projets', href: 'projets' },
    },
    v3_specific_process: {
      h2: 'Décrivez-nous votre besoin',
      body: 'En 5 lignes. On vous répond en 24h avec une première analyse honnête — si c\'est pour nous, on vous le dit. Sinon aussi.',
      ctaPrimary: { label: 'Démarrer', href: 'contact' },
      ctaSecondary: { label: 'Voir nos projets', href: 'projets' },
    },
  },
  en: {
    v1_30min: {
      h2: 'Let\'s talk about your project',
      body: '30 minutes to understand your needs. No rushed quote, no pressure. Just a direct conversation with the people who will build it.',
      ctaPrimary: { label: 'Get started', href: 'contact' },
      ctaSecondary: { label: 'See our work', href: 'projets' },
    },
    v3_specific_process: {
      h2: 'Tell us about your need',
      body: 'In 5 lines. We respond in 24h with an honest first take — if it\'s for us, we say so. If not, also.',
      ctaPrimary: { label: 'Get started', href: 'contact' },
      ctaSecondary: { label: 'See our work', href: 'projets' },
    },
  },
};
```

### Edge meta experiment — `mawt_meta_home_fr`

Implementation requires edge middleware variant assignment. Pattern :

```ts
// In src/app/[lang]/page.tsx generateMetadata
export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  
  if (lang === 'fr') {
    // Deterministic variant assignment from cookie
    const cookieStore = cookies();
    const uid = cookieStore.get('mawt_uid')?.value ?? 'anon';
    const variant = hashToVariant(uid, ['v1_short', 'v2_longer']);
    
    // Log assignment (server-side)
    serverSideStatsig.logEvent({
      userID: uid,
      eventName: 'meta_variant_assigned',
      metadata: { experiment: 'mawt_meta_home_fr', variant },
    });
    
    const metaTitles = {
      v1_short: 'MAWT — Solutions IA & conseil à Genève',
      v2_longer: 'MAWT — Solutions IA, conseil & développement à Genève',
    };
    
    return {
      title: metaTitles[variant],
      description: '...',  // same description in both variants
    };
  }
  
  // EN : single version
  return {
    title: 'MAWT — AI solutions, consulting & development from Geneva',
    description: '...',
  };
}
```

Use `@statsig/js-server-bindings` or call Statsig HTTP API server-side. Verify latest API.

---

**Experiment 3 — `mawt_method_fr`** (method snippet on pillar pages)
- Allocation : 100% of users on `/fr/services/*` paths
- Variants : `v4_collaboration` (50%), `v5_no_disappear` (50%)
- Primary metric : `contact_form_submit` (downstream conversion)
- Secondary metrics : `scroll_past_method`, `click_method_link` (click on "Notre méthode complète →")
- Sticky bucketing (same variant for the user across all `/fr/services/*` pages)
- Note : EN method snippet is NOT A/B tested (single version v5 ships everywhere)

### Method snippet component (in addition to Hero)

`src/components/services/MethodSnippet.tsx` :

```tsx
'use client';
import { useExperiment } from '@statsig/react-bindings';
import { useStatsigClient } from '@statsig/react-bindings';
import { METHOD_COPY } from '@/content/method-snippet';
import { LocalizedLink } from '@/components/ui/LocalizedLink';
import { Locale } from '@/lib/routing/url-map';

interface Props { lang: Locale; }

export function MethodSnippet({ lang }: Props) {
  const { client } = useStatsigClient();
  
  let variant: string;
  if (lang === 'fr') {
    const exp = useExperiment('mawt_method_fr');
    variant = exp.get('variant', 'v4_collaboration');
  } else {
    variant = 'v5_single'; // EN has no A/B
  }
  
  const copy = METHOD_COPY[lang][variant];
  
  function onLinkClick() {
    client?.logEvent('click_method_link', undefined, { variant });
  }
  
  return (
    <section className="method-snippet">
      <p>{copy.body}</p>
      <LocalizedLink to="notre-methode" lang={lang} onClick={onLinkClick}>
        {copy.ctaLabel}
      </LocalizedLink>
    </section>
  );
}
```

`src/content/method-snippet.ts` (created by Cursor when this brief runs) :

```ts
export const METHOD_COPY = {
  fr: {
    v4_collaboration: {
      body: 'Une vraie collaboration, pas une prestation. On commence par comprendre votre boîte, on identifie le vrai problème, on construit ensemble, on reste à vos côtés après le go-live. Vous parlez à ceux qui font.',
      ctaLabel: 'Notre méthode complète →',
    },
    v5_no_disappear: {
      body: 'On n\'est pas là pour livrer et disparaître. On comprend votre boîte avant d\'écrire une ligne. On construit avec vous, pas à côté. Et on reste à vos côtés après le déploiement.',
      ctaLabel: 'Notre méthode complète →',
    },
  },
  en: {
    v5_single: {
      body: 'We\'re not here to ship and disappear. We understand your business before writing a line. We build with you, not beside you. And we stay around after launch.',
      ctaLabel: 'Our full method →',
    },
  },
};
```

### Step 5 — Hero component with variant logic

`src/components/homepage/Hero.tsx` :

```tsx
'use client';
import { useExperiment } from '@statsig/react-bindings';
import { useEffect } from 'react';
import { useStatsigClient } from '@statsig/react-bindings';

interface Props { lang: 'fr' | 'en'; }

export function Hero({ lang }: Props) {
  const experimentName = lang === 'fr' ? 'mawt_hero_fr' : 'mawt_hero_en';
  const exp = useExperiment(experimentName);
  const { client } = useStatsigClient();
  
  // Default to V1 baseline if Statsig not loaded yet
  const variant = exp.get('variant', lang === 'fr' ? 'v1_humain' : 'v1_senior_humans');
  
  function trackCtaClick(ctaId: string) {
    client?.logEvent('cta_primary_click', undefined, { variant, ctaId });
  }
  
  function trackScrollPast() {
    client?.logEvent('scroll_past_hero', undefined, { variant });
  }
  
  // useEffect for scroll detection
  useEffect(() => {
    function onScroll() {
      if (window.scrollY > 600) {
        trackScrollPast();
        window.removeEventListener('scroll', onScroll);
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [variant]);
  
  return (
    <section>
      {lang === 'fr' && <HeroFR variant={variant} onCtaClick={trackCtaClick} />}
      {lang === 'en' && <HeroEN variant={variant} onCtaClick={trackCtaClick} />}
    </section>
  );
}
```

Then `<HeroFR>` and `<HeroEN>` render the actual variant content based on `variant` prop. Content is in `content/hero-variants.md`.

### Step 6 — Track contact form completion

In the contact form submit handler (wherever it is in the app), log :
```ts
client?.logEvent('contact_form_submit', undefined, {});
```

Statsig will attribute this event to the variant the user was exposed to during their session (sticky bucketing).

### Step 7 — User ID persistence

For sticky bucketing to work, each user needs a stable ID across visits. Implementation :

**Option A — Cookie-based UUID** (simple, recommended)
- On first visit, middleware sets a cookie `mawt_uid` with a UUID
- All subsequent requests carry this UUID
- Use it as Statsig `userID`

**Option B — Sanity/auth user ID** (if user logs in)
- Use the auth user ID for logged-in users
- Fall back to cookie UUID for anonymous

For MAWT (no auth), Option A is sufficient.

Middleware addition :
```ts
// src/middleware.ts
import { v4 as uuid } from 'uuid';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  if (!request.cookies.get('mawt_uid')) {
    response.cookies.set('mawt_uid', uuid(), {
      maxAge: 60 * 60 * 24 * 365,  // 1 year
      sameSite: 'lax',
      path: '/',
    });
  }
  
  // ... rest of middleware
  return response;
}
```

## Validation

1. `npm run build` passes
2. Open `/fr` in 3 different browsers (or incognito with clear cookies) — see 3 different variants distributed
3. Open `/en` similarly — see 2 variants
4. Click the CTA — verify event in Statsig dashboard (may take 1-2 min)
5. Scroll past hero — verify `scroll_past_hero` event fires once per visit
6. Submit contact form — verify `contact_form_submit` event
7. Reload same browser — see SAME variant (sticky bucketing works)
8. Check Statsig "Experiments" page — both experiments show as running, data flowing

## Hors scope

- Don't write the hero copy here (it's in `content/hero-variants.md`)
- Don't add A/B testing to anything except the hero (single experiment to start)
- Don't analyze results in this brief — that's an ops task once data flows
- Don't switch to GrowthBook or other tools — Statsig is the decision

## Commit instructions

```
feat(ab-testing): Statsig integration + homepage hero experiment

- Install @statsig/react-bindings + @statsig/js-client
- Add StatsigClientProvider in root layout with cookie-based userID
- Implement Hero component with variant logic (FR 3-way, EN 2-way)
- Track cta_primary_click, scroll_past_hero, contact_form_submit
- Add UUID cookie middleware for sticky bucketing
- Document required env vars (STATSIG_SERVER_KEY, NEXT_PUBLIC_STATSIG_CLIENT_KEY)
```

Don't commit env values — only documentation. User must configure Statsig dashboard manually (create experiments, set allocation).
