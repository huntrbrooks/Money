# Agent Guide: Financial Trauma Therapist Website

This is a **production therapy practice website** for Dan Lobel. Make only safe, minimal changes and keep content client-editable via the existing admin system.

---

## Non-negotiables

- Preserve routes, URLs, and public APIs unless explicitly instructed.
- Do not redesign UI or rewrite copy unless asked.
- Any client-requested content must be editable in Admin and persist after refresh/redeploy.
- Do not add a third-party CMS; extend the existing SiteConfig + Admin.
- Canonical domain: `www.financialtraumatherapist.com.au` (configured in `lib/urls.ts`).
- Validate file uploads (type + size) and ensure persistence.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS 4, CSS Variables |
| UI Components | shadcn/ui (Radix UI primitives) |
| Forms | React Hook Form, Zod validation |
| Content | MDX (`next-mdx-remote/rsc`, `gray-matter`) |
| Database | Supabase (PostgreSQL + Storage) |
| Email | Resend API (or SMTP fallback) |
| Analytics | Vercel Analytics, GA, Meta Pixel, LinkedIn Insight |
| Package Manager | pnpm |

---

## Directory Structure

```
app/                    # Next.js App Router pages and API routes
├── (marketing)/        # Route group for blog/vlog (no URL prefix)
│   ├── blog/           # Blog index and [slug] pages
│   └── vlog/           # Video library index and [slug] pages
├── admin/              # Protected admin dashboard
├── api/                # API route handlers (28 endpoints)
├── [page-routes]/      # Public pages (about, bookings, enquiry, etc.)
└── layout.tsx          # Root layout with theme, analytics

components/             # Shared UI and feature components (75 files)
├── ui/                 # shadcn/ui primitives (56 components)
├── forms/              # Dynamic form builder
└── [feature].tsx       # Booking, navigation, newsletter, etc.

lib/                    # Utilities, persistence, auth, integrations
├── config.ts           # SiteConfig CMS (central data model)
├── auth.ts             # JWT-like token auth (HMAC-SHA256)
├── mdx.ts              # MDX content loader (Supabase + filesystem)
├── supabase-rest.ts    # Supabase REST client
├── seo.ts              # Schema.org structured data + metadata
├── assets.ts           # Asset upload/retrieval
├── crm.ts              # CRM webhook integration
├── email.ts            # Email utilities
├── kv.ts               # Upstash KV storage
└── urls.ts             # URL canonicalization

content/                # MDX source files
├── posts/              # Blog articles (*.mdx)
└── videos/             # Video entries (*.mdx)

data/
└── site.json           # Local/dev SiteConfig persistence (NOT production-safe)

docs/                   # Operational documentation
├── dev-agent-context.md
├── site-content-admin-map.md
├── testing-checklist.md
├── release-checklist.md
└── supabase-setup.md

public/                 # Static assets, logos, PDFs, legacy HTML
```

**Avoid**: `Money-6300af3212092b6d99163e3570a53af22faf5083/` — this is a non-authoritative archive folder.

---

## Page Routes

### Public Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Homepage with hero, value props, testimonials, booking, FAQs, contact, crisis |
| `/about` | `app/about/page.tsx` | About Dan Lobel with credentials and contact |
| `/bookings` | `app/bookings/page.tsx` | Booking options + Acuity scheduler |
| `/book` | `app/book/page.tsx` | Redirects to `/bookings` |
| `/enquiry` | `app/enquiry/page.tsx` | Contact enquiry form |
| `/intake` | `app/intake/page.tsx` | Client intake form |
| `/client-care` | `app/client-care/page.tsx` | Session prep, aftercare, downloads, crisis resources |
| `/newsletter` | `app/newsletter/page.tsx` | Newsletter subscription |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy (PDF embed or MDX) |
| `/terms` | `app/terms/page.tsx` | Terms of service (PDF embed or MDX) |

### Service/Specialization Pages

| Route | Description |
|-------|-------------|
| `/financial-abuse` | Financial abuse information |
| `/financial-abuse-therapy` | Financial abuse therapy service |
| `/financial-abuse-therapist` | Financial trauma therapist service |
| `/financial-trauma` | Financial trauma information |
| `/monetary-psychotherapy` | Monetary psychotherapy approach |
| `/contemporary-integrative-counselling` | Integrative counselling service |
| `/family-financial-assistance-inheritance` | Family financial assistance |
| `/why-money-triggers-anxiety` | Money anxiety article |

### Dynamic Content Routes

| Route | Description |
|-------|-------------|
| `/blog` | Blog index listing all posts |
| `/blog/[slug]` | Individual blog post (MDX) |
| `/vlog` | Video library index |
| `/vlog/[slug]` | Individual video page (MDX + iframe) |
| `/content-sections/[slug]` | Dynamic CMS-driven content pages |

### Admin Routes

| Route | Description |
|-------|-------------|
| `/admin` | Admin dashboard (protected) |
| `/admin/login` | Admin login page |

---

## API Endpoints (28 total)

### Authentication (Public → Protected)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/login` | No | Authenticate admin, set JWT cookie |
| POST | `/api/auth/logout` | No | Clear auth cookie |
| GET | `/api/auth/me` | No | Check auth status |

### Site Configuration

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/site-config` | No | Get full SiteConfig |
| PUT | `/api/site-config` | Yes | Update SiteConfig |
| GET | `/api/site-config/versions` | Yes | List version history (Supabase) |
| POST | `/api/site-config/rollback` | Yes | Rollback to previous version |
| POST | `/api/site-config/assistant` | Yes | Natural language config commands |

### Content Management

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/posts` | No | List blog post metadata |
| POST | `/api/posts` | Yes | Create new blog post |
| GET | `/api/posts/[slug]` | No | Get post content |
| PUT | `/api/posts/[slug]` | Yes | Update post content |
| GET | `/api/videos` | No | List video metadata |
| POST | `/api/videos` | Yes | Create new video |
| GET | `/api/videos/[slug]` | No | Get video content |
| PUT | `/api/videos/[slug]` | Yes | Update video content |
| GET | `/api/newsletters/[slug]` | No | Get newsletter HTML |
| PUT | `/api/newsletters/[slug]` | Yes | Update newsletter HTML |

### Form Submissions

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/enquiry` | No | Submit enquiry form → email + CRM |
| POST | `/api/intake` | No | Submit intake form → email + CRM |
| POST | `/api/subscribe` | No | Newsletter subscription → CRM |

### Admin Operations

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/admin/code-agent` | Yes | Create GitHub issue for agent |
| GET | `/api/admin/code-agent/status` | Yes | Check PR status for issue |
| GET | `/api/admin/storage-status` | Yes | Check storage backend |
| POST | `/api/admin/upload` | Yes | Upload assets (max 15MB) |

### Utilities

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/assets/[...path]` | No | Serve uploaded assets |
| GET | `/api/og/[slug]` | No | Generate OG images |
| GET | `/api/interactive-newsletter` | No | Get interactive newsletter HTML |
| POST | `/api/events` | No | Log analytics events |
| GET | `/feed.xml` | No | RSS feed |

---

## Content Systems

### SiteConfig (Primary CMS)

The site's CMS is a single JSON document managed via `lib/config.ts`:

- **Definition**: `SiteConfig` type in `lib/config.ts`
- **Read**: `readSiteConfig()` (uses `noStore()` for fresh data)
- **Write**: `writeSiteConfig()` (stamps version + timestamp)
- **Local fallback**: `data/site.json` (dev only)
- **Production**: Supabase tables `site_config` + `site_config_versions`
- **Admin UI**: `app/admin/AdminPageClient.tsx`

**SiteConfig sections**:
- `theme` — Colors, fonts, border radius
- `brand` — Name, tagline, logo URLs
- `seo` — Title, description, OG image
- `navigation` — Menu links
- `contact` — Phone, email
- `social` — Facebook, Instagram, LinkedIn
- `hero` — Homepage hero content
- `about` — About page content
- `services` — Service list
- `consultations` — Booking options
- `resources` — Crisis resources (carousel)
- `homepage` — Section toggles, copy, testimonials, FAQs
- `formPages` — Form schemas (enquiry, intake, newsletter)
- `legal` — Privacy/terms pages
- `clientCare` — Client care hub content
- `bookingCopy` — Scheduler copy
- `contentSectionPages` — Dynamic content pages
- `experiments` — Feature flags

### MDX Content (Blog/Vlog)

- **Loader**: `lib/mdx.ts`
- **Precedence**: Supabase content overrides filesystem by slug
- **Source**: `content/posts/*.mdx`, `content/videos/*.mdx`
- **Frontmatter**: `gray-matter` parsing
- **Rendering**: `next-mdx-remote/rsc`

### Uploaded Assets

- **Production**: Supabase Storage bucket `site-assets`
- **Local dev**: `data/uploads/` directory
- **Serving**: `/api/assets/[...path]`
- **Upload**: `/api/admin/upload` (validates type + 15MB limit)
- **Allowed types**: `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg`, `.pdf`, `.doc`, `.docx`

---

## Authentication

- **Mechanism**: HMAC-SHA256 tokens (JWT-like) via Web Crypto API
- **Storage**: HTTP-only cookie `auth_token`
- **Expiry**: 7 days
- **Secret**: `JWT_SECRET` env var (fallback: `"dev-secret-change"`)
- **Login route**: `POST /api/auth/login`
- **Admin protection**: Client-side checks in `AdminPageClient.tsx`
- **API protection**: Call `requireAuth()` in protected routes

---

## Components Library (75 files)

### Feature Components

| Component | Purpose |
|-----------|---------|
| `navigation.tsx` | Header nav + footer |
| `booking-form.tsx` | Multi-step booking form |
| `booking-options.tsx` | Consultation cards |
| `booking-scheduler.tsx` | Acuity integration |
| `forms/DynamicForm.tsx` | Schema-driven form builder |
| `newsletter-modal.tsx` | Newsletter subscription dialog |
| `lead-magnet.tsx` | Lead capture banner/panel |
| `resources-carousel.tsx` | Crisis resources marquee |
| `crisis-banner.tsx` | Rotating crisis banner |
| `social-share.tsx` | Social sharing buttons |
| `analytics-scripts.tsx` | Analytics script loader |
| `ResponsivePdfEmbed.tsx` | PDF viewer |

### UI Library (shadcn/ui)

56 components in `components/ui/` built on Radix UI:
- Form controls: button, input, textarea, checkbox, select, slider
- Overlays: dialog, sheet, drawer, popover, tooltip
- Navigation: tabs, accordion, breadcrumb, sidebar
- Data display: card, table, badge, avatar
- Feedback: toast, alert, progress, skeleton

---

## Library Utilities

| File | Purpose |
|------|---------|
| `config.ts` | SiteConfig read/write, type definitions |
| `auth.ts` | Token creation/verification |
| `mdx.ts` | MDX content processing |
| `supabase-rest.ts` | Supabase REST client |
| `seo.ts` | Metadata + Schema.org structured data |
| `assets.ts` | Asset upload/retrieval |
| `crm.ts` | CRM webhook integration |
| `email.ts` | Email normalization |
| `kv.ts` | Upstash KV operations |
| `urls.ts` | URL canonicalization |
| `utils.ts` | Tailwind class merging (`cn()`) |
| `content-section-defaults.ts` | Default content for sections |

---

## External Integrations

| Service | Purpose | Env Vars |
|---------|---------|----------|
| Supabase | Database + storage | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| Resend | Transactional email | `RESEND_API_KEY` |
| SMTP | Email fallback | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` |
| CRM Webhook | Lead capture | `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_TOKEN` |
| GitHub | Code agent automation | `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO` |
| Acuity | Appointment scheduling | Embedded iframe |
| Upstash | KV storage | `KV_REST_API_URL`, `KV_REST_API_TOKEN` |

---

## Environment Variables

### Required for Production

```bash
# Admin/Auth
ADMIN_USERNAME=
ADMIN_PASSWORD=
JWT_SECRET=

# Supabase (required for persistence)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Email
RESEND_API_KEY=
EMAIL_FROM=

# Site
NEXT_PUBLIC_SITE_URL=https://www.financialtraumatherapist.com.au
```

### Optional

```bash
# CRM
CRM_WEBHOOK_URL=
CRM_WEBHOOK_TOKEN=

# GitHub Code Agent
GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=

# Analytics
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_LINKEDIN_TAG_ID=

# Admin notification
ADMIN_NOTIFICATION_EMAIL=

# KV Storage
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

---

## Admin Panel Mapping

| Admin Tab | SiteConfig Path | Frontend Impact |
|-----------|-----------------|-----------------|
| Hero Section | `hero.*` | Homepage hero |
| About | `about.*` | About page, homepage foundations |
| Services | `services[]` | Homepage services |
| Homepage | `homepage.*` | All homepage sections |
| Content | Posts/videos MDX | Blog, vlog pages |
| Experiments | `experiments.*` | Feature flags |
| Images | Upload → `hero.imageUrl`, `brand.logoUrl` | Site imagery |
| Theme | `theme.*` | CSS variables |
| Brand | `brand.*` | Header, footer branding |
| Navigation | `navigation[]` | Menu links |
| Contact | `contact.*`, `social.*` | Footer, contact sections |
| SEO | `seo.*` | Meta tags, OG images |
| Documents | `legal.*`, `clientCare.*` | Legal pages, downloads |
| Consultations | `consultations[]`, `bookingCopy.*` | Booking options |
| Resources | `resources[]` | Crisis carousel |
| History | Version history | Admin rollback |
| Assistant | Command parser | Quick config edits |

---

## Development Commands

```bash
pnpm dev        # Start development server
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

---

## Safe Workflow for Changes

1. **Identify editability**: If content should be admin-editable (default: yes), update `SiteConfig` schema.
2. **Update Admin UI**: Add UI controls in `AdminPageClient.tsx` for new editable fields.
3. **Keep edits minimal**: Avoid refactors; change the smallest surface necessary.
4. **Verify routes**: Ensure SEO metadata and routes still resolve correctly.
5. **Run linting**: `pnpm lint` after substantive edits.
6. **Test persistence**: Follow `docs/testing-checklist.md` for admin saves.

---

## Known Editability Gaps

These areas are historically hardcoded. If asked to edit them, migrate into SiteConfig + Admin:

- **About page**: Most hero copy is hardcoded
- **Bookings page**: Heading/intro copy hardcoded
- **Client Care page**: Headings/CTA copy hardcoded
- **Newsletter page**: Page copy hardcoded
- **Specialist landing pages**: Most copy hardcoded
- **Footer**: Legal lines hardcoded in component
- **Form field labels**: Fully schema-driven now, but some helper copy may be hardcoded

---

## Routing Considerations

### High-Risk Overlaps

- `/blog/[slug]` (MDX) vs legacy HTML in `public/*.html`
- Specialist pages in `app/` vs `/content-sections/[slug]`
- Legacy HTML pages are in sitemap but don't conflict with dynamic routes

### SEO Files

- `app/sitemap.ts` — Dynamic sitemap (pages, posts, videos, content sections)
- `app/robots.ts` — Disallows `/admin`, `/api/`
- `lib/seo.ts` — Schema.org generators
- `lib/urls.ts` — Canonical URL helpers

---

## Key Documentation

- `docs/dev-agent-context.md` — Architecture and data flows
- `docs/site-content-admin-map.md` — What is editable vs hardcoded
- `docs/testing-checklist.md` — Admin persistence and QA
- `docs/release-checklist.md` — Production release steps
- `docs/supabase-setup.md` — Database setup guide

---

## Hard Rules for Agent Changes

1. **Client editability**: If a client asks to change copy, links, documents, or forms — wire it into SiteConfig + Admin UI.
2. **No hardcoded content**: Avoid adding new hardcoded strings on public pages for editable sections.
3. **Preserve behavior**: Avoid refactors; change the smallest surface necessary.
4. **Validate uploads**: Enforce file type + size, ensure assets persist after refresh.
5. **No route changes**: Keep all existing paths stable unless explicitly asked.
6. **Test on mobile**: Verify all changes work on mobile and desktop.
7. **No console errors**: Validate pages load without errors before completing.
