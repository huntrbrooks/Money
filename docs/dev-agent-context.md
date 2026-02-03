# Developer Agent Context Brief (DAN WEBSITE)

This document is a **high-signal onboarding brief** for a new developer agent to make fast, safe changes across the public site and admin panel, with a clear understanding of how data/config changes propagate.

## Website flow diagram and description

### Public site (user-facing)

```text
[Entry: / (Home)]
  |
  |-- Global navigation menu (live site labels observed):
  |     - Home -> /
  |     - About -> /about
  |     - Specialisation -> /#services (home section)
  |     - Book a Consultation -> /bookings or /#book
  |     - Client Care -> /client-care
  |     - Contact -> /#contact (home section) or /enquiry
  |
  |-- Primary CTAs on Home:
  |     - "Book a Consultation" -> /#book -> Booking section -> Acuity -> external checkout
  |     - "Learn about the approach" -> service/about page (e.g. /monetary-psychotherapy)
  |
  |-- Forms (task pages):
  |     - /enquiry  -> POST /api/enquiry
  |     - /intake   -> POST /api/intake
  |     - /consent  -> POST /api/consent
  |     - /newsletter -> POST /api/subscribe (via modal)
  |
  |-- Bookings:
  |     - /bookings -> Acuity launch link + optional embedded scheduler
  |
  |-- Content library:
  |     - /blog -> /blog/[slug] (MDX)
  |     - /vlog -> /vlog/[slug] (MDX + iframe embed)
  |
  '-- SEO & feeds:
        - /sitemap.xml (includes dynamic posts + videos)
        - /feed.xml (RSS of posts)
        - /robots.txt
        - /api/og/[slug] (OG image generator)
```

### Admin site (content + controls)

```text
/admin (protected)
  |
  '-- if not authenticated:
        redirect -> /admin/login?next=/admin
              |
              '-- login -> POST /api/auth/login -> sets HttpOnly cookie "auth_token"
                    |
                    '-- /admin dashboard (tabbed):
                          - Edit SiteConfig -> PUT /api/site-config
                          - History -> GET /api/site-config/versions + POST /api/site-config/rollback
                          - Assistant -> POST /api/site-config/assistant
                          - Content drafts -> GET/POST /api/posts, GET/POST /api/videos
                          - Code Agent -> POST /api/admin/code-agent + poll /api/admin/code-agent/status
```

## Codebase architecture overview

### Core stack
- **Framework**: Next.js App Router (see `package.json`), React 19.
- **UI/styling**: TailwindCSS + shadcn/ui (Radix primitives).
- **Content**: MDX (`content/posts`, `content/videos`) via `next-mdx-remote/rsc` + `gray-matter`.
- **Analytics**: Vercel Analytics + optional GA/Meta/LinkedIn scripts (`components/analytics-scripts.tsx`).

### Key directories
- **`app/`**: routes (public pages, admin pages, API route handlers).
- **`components/`**: shared UI + feature components (`navigation`, booking widgets, newsletter modal, lead magnet).
- **`lib/`**: persistence + auth + MDX loader + Supabase REST + CRM integration.
- **`content/`**: MDX source (used when Supabase isn’t configured, and as a fallback).
- **`data/site.json`**: local/dev persistence for editable site config (not safe in production).
- **`public/`**: assets and legacy `.html` pages included in sitemap.

### The central data model: `SiteConfig`
The site’s “CMS” is a single JSON document in `lib/config.ts`:
- Theme tokens, brand, navigation, contact, hero, about, services
- Booking/consultation options
- Crisis resources
- Homepage section toggles + copy blocks
- SEO defaults
- Experiments toggles (e.g., lead magnet enablement)

**Read path**
- Server components call `readSiteConfig()` (uses `noStore()` so it should not be statically cached).
- Some client components fetch `/api/site-config` (notably header/footer).

**Write path**
- Admin calls `PUT /api/site-config` → `writeSiteConfig()` in `lib/config.ts`.
- `writeSiteConfig()` stamps `meta.version = Date.now()` and `meta.updatedAt = now`.

### Persistence strategy (critical)
`lib/config.ts` supports **two persistence modes**:
- **Supabase configured** (`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`): production-safe persistence.
  - Stores current config in `site_config` and history in `site_config_versions`.
  - Stores MDX in `content_items`.
- **No Supabase**: local filesystem persistence to `data/site.json` (dev/local only).
  - In production, writing without Supabase is expected to fail (by design).

### Repo gotcha: “Money-6300af…” folder
There is a large archive folder `Money-6300af3212092b6d99163e3570a53af22faf5083/` that looks like a second app copy.
- **Treat it as non-authoritative** unless you explicitly intend to work on it.
- Grep/search results may include matches from that folder and confuse routing/middleware analysis.

## API endpoints and data flow mapping

### Auth (admin)
- **`POST /api/auth/login`**
  - **Inputs**: `{ username, password }`
  - **Auth source**: env vars (supports comma/newline-separated rotation).
  - **Dev fallback**: `ADMIN_USERNAME="Dan Lobel"`, `ADMIN_PASSWORD="Popcorn"` if env not set.
  - **Output**: `{ ok: true }` + sets HttpOnly cookie `auth_token`.
- **`GET /api/auth/me`**
  - **Output**: `{ authenticated: boolean, user?: { username } }`
- **`POST /api/auth/logout`**
  - Clears `auth_token`.

Token implementation:
- `lib/auth.ts` uses an HMAC token via Web Crypto (`JWT_SECRET`, fallback `"dev-secret-change"`).

### Site configuration (“CMS”)
- **`GET /api/site-config`** (public)
  - Returns the full `SiteConfig` JSON.
- **`PUT /api/site-config`** (auth required)
  - Persists config; returns `{ ok, version, updatedAt }`.
- **`GET /api/site-config/versions`** (auth required; Supabase required)
  - Returns version history for rollback UI.
- **`POST /api/site-config/rollback`** (auth required; Supabase required)
  - Restores by version row id; creates a new version entry.
- **`POST /api/site-config/assistant`** (auth required)
  - Applies simple text commands (theme colors/mode, hero copy, add service, nav edits, contact, SEO).

### Content (blog/vlog)
- **`GET /api/posts`**: list post metadata
- **`POST /api/posts`** (auth required): create a draft MDX template
- **`GET /api/videos`**: list video metadata
- **`POST /api/videos`** (auth required): create a draft MDX template

MDX precedence rules (`lib/mdx.ts`):
- If Supabase is configured, **Supabase content overrides filesystem content by slug**.

### Forms + lead capture
- **`POST /api/enquiry`**
  - Validates/sanitizes; sends email via SMTP or Resend; best-effort CRM webhook.
  - Destination email defaults to `SiteConfig.contact.email`.
- **`POST /api/intake`**
  - Same delivery pattern; larger payload; validates dd/mm/yyyy.
- **`POST /api/consent`**
  - Requires exact statement match + dd/mm/yyyy.
- **`POST /api/subscribe`**
  - CRM webhook only (newsletter signup).
- **`POST /api/events`**
  - Simple server log sink for a small set of front-end tracked events.

### Admin automation (“Code Agent”)
- **`POST /api/admin/code-agent`** (auth required)
  - Creates a GitHub issue labeled `agent`.
- **`GET /api/admin/code-agent/status?issue=<n>`** (auth required)
  - Polls GitHub for a PR on branch `agent/issue-<n>`.

### SEO utilities
- **`GET /api/og/[slug]`**
  - Generates OG images by calling `/api/posts` + `/api/videos` and matching slug.
- **`GET /feed.xml`**
  - RSS feed for posts.
- **`GET /sitemap.xml`**
  - Includes static marketing routes + legacy HTML + dynamic posts/videos.

## Admin panel functions and their impact on the site

The admin dashboard is implemented in `app/admin/page.tsx` and maps directly to `SiteConfig`.

### Tabs → `SiteConfig` fields → frontend impact
- **Hero Section** → `config.hero.*`
  - Used by: `app/page.tsx` hero section.
- **About** → `config.about.*`
  - Used by: `app/about/page.tsx` and Home “practice foundations” section.
- **Services** → `config.services[]`
  - Used by: Home services listings (and any services section that references it).
- **Homepage** → `config.homepage.sections`, `config.homepage.copy`, and related arrays
  - Used by: `app/page.tsx` to show/hide entire homepage blocks + set copy.
- **Content** → posts/videos metadata + draft creation
  - Used by: `/blog`, `/blog/[slug]`, `/vlog`, `/vlog/[slug]`.
- **Experiments** → `config.experiments.*` (lead magnet enablement, etc.)
  - Used by: `app/page.tsx` lead magnet rendering.
- **Theme** → `config.theme.*`
  - Used by: `app/layout.tsx` which injects CSS variables into `:root`.
- **Brand** → `config.brand.*`
  - Used by: `components/navigation.tsx` and footer branding.
- **Navigation** → `config.navigation[]`
  - Used by: `components/navigation.tsx` (menu) + footer links.
- **Contact** → `config.contact.*`
  - Used by: footer/contact UI and also API routes (destination for enquiry/intake/consent emails).
- **SEO** → `config.seo.*`
  - Used by: `lib/seo` helpers + metadata generation.
- **Consultations** → `config.consultations[]`
  - Used by: `components/booking-options.tsx` and booking pages.
- **Resources** → `config.resources[]`
  - Used by: Home crisis banner/carousel and `app/client-care/page.tsx`.
- **History** → Supabase-backed versions + rollback
  - Used by: admin only.
- **Assistant** → command parser applies fast edits
  - Used by: admin only; writes the same config as standard save.
- **Code Agent** → GitHub automation
  - Used by: admin only.

### How admin changes propagate to the frontend
- **Save action**: Admin `PUT /api/site-config` → `writeSiteConfig()` persists and bumps `meta.version`.
- **Server-rendered pages**: anything calling `readSiteConfig()` should read fresh values (noStore).
- **Client-rendered nav/footer**: fetches `/api/site-config` on mount; reflects changes after reload/navigation.

## Guidelines for a developer agent (fast bug fixes and changes)

### Cursor rulesets (critical)
This repo uses **two Cursor rules files** to keep changes safe and scoped:

- **`.cursorrules` (default / general work)**: UI, routing, bug fixes, SEO, and other non-admin tasks.
- **`.cursorrules.admin` (ADMIN ONLY)**: anything involving admin access, CMS/content editing, documents, articles, links, or media.

When running a Cursor agent, explicitly state which ruleset applies. Example prompts:

- General: “Follow the rules in `.cursorrules`.”
- Admin/content: “Follow ADMIN ONLY rules in `.cursorrules.admin`.”

### Where to start (triage)
- **Editable copy/theme issues**: `lib/config.ts` + `data/site.json` (dev) + `app/admin/page.tsx`.
- **Public page issues**: `app/<route>/page.tsx` + referenced `components/*`.
- **Form submission issues**: `app/api/enquiry|intake|consent/route.ts` + email provider env vars.
- **Blog/vlog issues**: `lib/mdx.ts` + `content/*` + `app/(marketing)/*`.
- **Admin access/auth issues**: `app/api/auth/*` and confirm that admin routes are protected by middleware (Next expects a root `middleware.ts`).

### High-risk routing/SEO areas
There are multiple overlapping “article” surfaces:
- Dynamic MDX: `/blog/[slug]`
- Static pages under `app/blog/<slug>/page.tsx`
- A separate root route `/why-money-triggers-anxiety`
- Legacy HTML pages in `/public/*.html` included in sitemap

Treat these as **high-risk for duplicates/canonical/route-precedence issues** during edits.

### Environment variables (copy/paste reference)
- **Admin/Auth**: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`
- **Supabase**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- **Email**: `RESEND_API_KEY` or `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`, plus `EMAIL_FROM`
- **CRM**: `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_TOKEN`
- **GitHub Code Agent**: `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`
- **Analytics**: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_LINKEDIN_TAG_ID`
- **Site URL**: `NEXT_PUBLIC_SITE_URL`

## Related docs
- `docs/release-checklist.md` (QA steps + env var checklist)


