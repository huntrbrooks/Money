# Agent Guide: Dan Website

This is a production therapy practice website. Make only safe, minimal changes and keep content client-editable via the existing admin system.

## Non‑negotiables
- Preserve routes, URLs, and public APIs unless explicitly instructed.
- Do not redesign UI or rewrite copy unless asked.
- Any client‑requested content must be editable in Admin and persist after refresh/redeploy.
- Do not add a third‑party CMS; extend the existing SiteConfig + Admin.
- Canonical domain should be `www.financialabusetherapist.com.au` (project requirement). Note: current code normalizes to `financialtraumatherapist.com.au` in `lib/urls.ts` and should be updated if this rule changes.
- Validate file uploads (type + size) and ensure persistence.

## Repo map (authoritative areas)
- `app/`: Next.js App Router pages and API routes.
- `components/`: shared UI/feature components.
- `lib/`: persistence, auth, MDX loader, SEO, Supabase REST.
- `data/site.json`: local/dev SiteConfig persistence (not production safe).
- `content/posts`, `content/videos`: MDX sources (Supabase overrides in prod).
- `docs/`: operational guidance and QA checklists.

Avoid the archive folder `Money-6300af3212092b6d99163e3570a53af22faf5083/` unless explicitly told to use it. It is non‑authoritative and can confuse searches.

## Content systems (how edits persist)
### SiteConfig (primary CMS)
- Definition and read/write: `lib/config.ts`
- Local fallback: `data/site.json`
- Production persistence: Supabase tables `site_config` and `site_config_versions` via `lib/supabase-rest.ts`
- Admin UI: `app/admin/page.tsx` and `app/admin/AdminPageClient.tsx`

### MDX content (posts/videos)
- Loader: `lib/mdx.ts` (Supabase content overrides filesystem by slug)
- Source: `content/posts/*.mdx`, `content/videos/*.mdx`
- Routes: `app/(marketing)/blog/[slug]/page.tsx`, `app/(marketing)/vlog/[slug]/page.tsx`

### Uploaded assets
- Stored in Supabase bucket (prod) or local `data/uploads` (dev).
- Served through `/api/assets/[...path]`.

## Admin + auth
- Login: `POST /api/auth/login` (`app/api/auth/login/route.ts`)
- Cookie: `auth_token` (HttpOnly, set by login route)
- Protection: Admin routes (`/admin/*`) are currently protected via client-side checks in `app/admin/page.tsx` and `app/admin/AdminPageClient.tsx`
- Note: `proxy.ts` exists but is not wired as Next.js middleware. Consider adding `middleware.ts` for server-side protection if needed.
- Use `requireAuth()` in protected API routes (see `app/api/admin/*`).

## Routing + SEO risk areas
- High‑risk overlaps: `/blog/[slug]` vs legacy HTML in `public/*.html` and specialist pages in `app/`.
- Legacy HTML pages are included in the sitemap but do not conflict with dynamic routes.
- Do not introduce new conflicting routes.
- Sitemap uses `app/sitemap.ts`; canonical helpers in `lib/urls.ts` and `lib/seo.ts`.

## Hard rules for agent changes
1. **Client editability**: If a client asks to change copy, links, documents, or forms, wire it into SiteConfig + Admin UI.
2. **No hardcoded content**: Avoid adding new hardcoded strings on public pages for editable sections.
3. **Preserve behavior**: Avoid refactors; change the smallest surface necessary.
4. **Validate uploads**: Enforce file type + size, and ensure assets persist after refresh.
5. **No route changes**: Keep all existing paths stable unless explicitly asked.

## Key docs to follow
- `docs/dev-agent-context.md` (architecture + flows)
- `docs/site-content-admin-map.md` (what is editable vs hardcoded)
- `docs/testing-checklist.md` (admin persistence + QA)
- `docs/release-checklist.md` (production release steps)

## Environment variables (critical)
- Admin/Auth: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`
- Supabase: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Email: `RESEND_API_KEY` or `SMTP_*`, `EMAIL_FROM`
- CRM: `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_TOKEN`
- Analytics: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_LINKEDIN_TAG_ID`
- Site: `NEXT_PUBLIC_SITE_URL`

## Safe workflow for changes
1. Identify if content should be admin‑editable (default: yes).
2. Update `SiteConfig` schema and Admin UI when adding new editable fields.
3. Keep edits minimal and local; avoid refactors.
4. Verify routes and SEO metadata still resolve correctly.
5. Run `pnpm lint` after substantive edits.
6. Follow `docs/testing-checklist.md` for admin persistence and page sanity.

## Known editability gaps (avoid re‑introducing)
These areas are historically hardcoded. If asked to edit them, migrate into SiteConfig + Admin:
- Forms: `/enquiry`, `/intake`, `/consent` (labels, helper copy, consent text)
- Footer legal lines
- Specialist landing page copy
- About page hero copy
- Client Care and Bookings headings/intro copy

## Commands
- `pnpm dev`
- `pnpm lint`
- `pnpm build`

