# Site Content → Admin Mapping (Source of Truth)

This document maps **every page**, **section/band**, **cards**, **headings/copy**, **images/logos**, **links/buttons**, **articles/videos**, and **forms** to:

- where it lives in code/content (`app/`, `components/`, `content/`, `public/`, `data/site.json`)
- whether it is editable via **Admin**
- the **Admin tab** and the exact config path (e.g. `SiteConfig.hero.title`)

It also flags **gaps** (hardcoded content not admin-editable), **route conflicts**, and **hardening improvements** for stability + UX.

---

## Content systems in this repo

- **Site configuration CMS**: `SiteConfig` (loaded via `readSiteConfig()` from `lib/config.ts`)
  - Local dev persistence: `data/site.json`
  - Production persistence: **Supabase** (required for admin saves to persist)
  - History/rollback: `app/api/site-config/versions` + `app/api/site-config/rollback`
- **Long-form content CMS**: MDX in `content/posts/*.mdx` + `content/videos/*.mdx`
  - Rendered via `app/(marketing)/blog/[slug]/page.tsx` and `app/(marketing)/vlog/[slug]/page.tsx`
  - Admin can create/edit via `/admin` → **Content**
- **Uploaded media/assets**: `/admin` → **Images** and `/admin` → **Documents**
  - Stored in Supabase bucket (or `data/uploads` in local)
  - Served via `/api/assets/[...path]` so the bucket can stay private

---

## Admin tabs → config mapping

Admin UI lives in `app/admin/page.tsx`. Tabs map to:

- **Hero Section** → `SiteConfig.hero.*`
- **About** → `SiteConfig.about.*`
- **Services** → `SiteConfig.services[]`
- **Homepage** → `SiteConfig.homepage.*`
- **Content** → Blog posts (`content/posts/*.mdx`) and videos (`content/videos/*.mdx`)
- **Experiments** → `SiteConfig.experiments.*`
- **Images** → Uploads that populate:
  - Hero image → `SiteConfig.hero.imageUrl`
  - Brand logo → `SiteConfig.brand.logoUrl`
  - Header banner → `SiteConfig.brand.headerBannerUrl`
  - OG image → `SiteConfig.seo.ogImage`
- **Theme** → `SiteConfig.theme.*`
- **Brand** → `SiteConfig.brand.*`
- **Navigation** → `SiteConfig.navigation[]`
- **Contact** → `SiteConfig.contact.*` and `SiteConfig.social.*`
- **SEO** → `SiteConfig.seo.*` (used by `buildPageMetadata()` in `lib/seo.ts`)
- **Documents**
  - Legal pages → `SiteConfig.legal.privacy.*` + `SiteConfig.legal.terms.*`
  - Forms routes → `SiteConfig.forms.*` (**routes only**, not form copy/fields)
  - Client Care downloads/checklists → `SiteConfig.clientCare.*`
- **Consultations** → `SiteConfig.consultations[]` + `SiteConfig.bookingCopy.*`
- **Resources** → `SiteConfig.resources[]` (crisis resources)
- **History** → Supabase config version history + rollback
- **Assistant** → `/api/site-config/assistant` (command parser that mutates `SiteConfig`)

---

## Global layout & shared components

### Header / Navigation (`components/navigation.tsx`)

- **Brand logo image**: `SiteConfig.brand.logoUrl`
- **Nav links**: `SiteConfig.navigation[]`
- **Contact**: footer pulls from `SiteConfig.contact.*`
- **Social**: footer pulls from `SiteConfig.social.*`

Admin mapping:
- `/admin` → **Brand** (logo), **Navigation** (links), **Contact** (phone/email/social)

Hardening notes:
- Debug logging that POSTed to localhost was removed (production stability).

### Footer (`components/navigation.tsx`)

- **Brand name**: `SiteConfig.brand.name`
- **Tagline**: `SiteConfig.brand.tagline`
- **Quick links**: `SiteConfig.navigation[]` + hardcoded `/privacy`, `/terms`, and `Book Appointment`
- **Contact icons/links**: `SiteConfig.contact.phone`, `SiteConfig.contact.email`, `SiteConfig.contact.emailAlt`
- **Social links**: `SiteConfig.social.*` (falls back to defaults if empty)
- **Legal text**: currently **hardcoded** in footer component (“© 2025…”, entity name, acknowledgment)

Gap:
- Footer legal lines are not editable in Admin today.

---

## Pages (routes) → sections → admin mapping

### `/` Home (`app/page.tsx`)

- **Header**: see global mapping
- **Hero band**
  - Eyebrow/title/subtitle/description/image/CTAs/stats → `SiteConfig.hero.*`
  - Secondary CTA “Call Dan” uses `SiteConfig.contact.phone` for `tel:`
  - Some presentation strings are hardcoded (e.g. hero image alt text)
- **Value Props band**
  - Toggle → `SiteConfig.homepage.sections.showValueProps`
  - Eyebrow/heading → `SiteConfig.homepage.copy.valuePropsEyebrow`, `valuePropsHeading`
  - Cards → `SiteConfig.homepage.valueProps[]` (`title`, `description`)
- **Newsletter band**
  - Toggle → `SiteConfig.homepage.sections.showNewsletter`
  - Copy → `SiteConfig.homepage.copy.newsletter*`
  - Modal tags → `SiteConfig.homepage.copy.newsletterTags`
- **Important Links band**
  - Toggle → `SiteConfig.homepage.sections.showImportantLinks`
  - Copy → `SiteConfig.homepage.copy.importantLinks*`
  - Button rows:
    - Blog links → `SiteConfig.homepage.importantLinks.blogLinks[]`
    - Specialist links → `SiteConfig.homepage.importantLinks.specialistLinks[]`
    - Section links → `SiteConfig.homepage.importantSectionLinks[]`
- **Testimonials band**
  - Toggle → `SiteConfig.homepage.sections.showTestimonials`
  - Copy → `SiteConfig.homepage.copy.testimonials*`
  - Cards → `SiteConfig.homepage.testimonials[]`
- **Other Areas band**
  - Toggle → `SiteConfig.homepage.sections.showOtherAreas`
  - Copy → `SiteConfig.homepage.copy.otherAreas*`
  - Accordion items → `SiteConfig.homepage.otherAreas[]`
- **Booking band**
  - Toggle → `SiteConfig.homepage.sections.showBooking`
  - Copy → `SiteConfig.homepage.copy.booking*`
  - Cards/options → `SiteConfig.consultations[]`
  - Scheduler help/copy → `SiteConfig.bookingCopy.*`
- **FAQ band**
  - Toggle → `SiteConfig.homepage.sections.showFaqs`
  - Copy → `SiteConfig.homepage.copy.faqs*`
  - Items → `SiteConfig.homepage.faqs[]`
- **Contact band**
  - Toggle → `SiteConfig.homepage.sections.showContact`
  - Copy → `SiteConfig.homepage.copy.contact*`
  - Phone/email → `SiteConfig.contact.*`
- **Crisis band**
  - Toggle → `SiteConfig.homepage.sections.showCrisis`
  - Copy → `SiteConfig.homepage.copy.crisis*`
  - Resources carousel → `SiteConfig.resources[]`
- **Lead magnet popup**
  - Toggle → `SiteConfig.experiments.showLeadMagnet` (primary) and `SiteConfig.homepage.sections.showLeadMagnet` (secondary)
  - Content → `SiteConfig.homepage.leadMagnet.*`

Admin mapping:
- `/admin` → Hero Section, Homepage, Consultations, Resources, Contact, Brand, Experiments

---

### `/about` (`app/about/page.tsx`)

Sections:
- About hero band: **mostly hardcoded** headings, credentials, focus list, quote, CTAs
- “Practice foundations”: uses `SiteConfig.about.paragraphs[]` (editable)
- Contact chips: uses `SiteConfig.contact.*`

Admin mapping:
- `/admin` → About (paragraphs only), Contact

Gaps:
- Most About page copy is hardcoded and not editable via Admin.

---

### `/bookings` (`app/bookings/page.tsx`)

Sections:
- Page heading + description: hardcoded
- Booking options + scheduler:
  - `SiteConfig.consultations[]`
  - `SiteConfig.bookingCopy.*`
  - contact is passed for help text: `SiteConfig.contact.*`

Admin mapping:
- `/admin` → Consultations, Documents (booking copy is under Consultations tab)

Gap:
- Page heading/intro is not admin-editable.

---

### `/client-care` (`app/client-care/page.tsx`)

Sections:
- Hero heading + description: hardcoded
- Checklists: `SiteConfig.clientCare.prepChecklist[]`, `SiteConfig.clientCare.aftercareChecklist[]`
- Downloads: `SiteConfig.clientCare.downloads[]`
- Crisis resources list: `SiteConfig.resources[]`

Admin mapping:
- `/admin` → Documents (Client Care), Resources

Gap:
- Most headings/CTA copy is hardcoded.

---

### `/privacy` and `/terms` (`app/privacy/page.tsx`, `app/terms/page.tsx`)

Content:
- `SiteConfig.legal.privacy.*` and `SiteConfig.legal.terms.*`
  - `title`
  - `downloadUrl` (docx/pdf)
  - `bodyMdx` (optional; overrides iframe viewer if present)

Admin mapping:
- `/admin` → Documents (Legal pages)

---

### Forms: `/enquiry`, `/intake`, `/consent` (`app/enquiry/page.tsx`, `app/intake/page.tsx`, `app/consent/page.tsx`)

What’s there:
- These are “app forms” (React client components) that POST to:
  - `/api/enquiry`
  - `/api/intake`
  - `/api/consent`
- Form field structure + labels + helper copy are **hardcoded** in page components.
- Some pages pull `SiteConfig.contact.*` (email/phone), but other repeated blocks are hardcoded:
  - Legal footer lines
  - Large crisis/helpline lists (duplicated, not using `SiteConfig.resources[]`)
  - Consent page includes a long legal document in JSX (not admin-editable)

Admin mapping today:
- `/admin` → Documents → Forms only controls `SiteConfig.forms.*` (routes to forms) **NOT** the copy/fields of the forms.

Major gap:
- Per your rule “all documents/forms must be editable via Admin”, these pages need a CMS layer (recommended approach below).

---

### `/newsletter` (`app/newsletter/page.tsx`)

Content:
- Page copy + topic list are hardcoded
- Uses `NewsletterModal` component

Admin mapping:
- Not editable today.

---

### Blog & Articles

#### `/blog` index (`app/(marketing)/blog/page.tsx`)
- Lists posts from `content/posts/*.mdx` (or Supabase override)
- Not admin-copy-editable (intro copy hardcoded), but the list is driven by content meta.

#### `/blog/[slug]` (`app/(marketing)/blog/[slug]/page.tsx`)
- Renders MDX post content from `content/posts/<slug>.mdx` (or Supabase override)

Admin mapping:
- `/admin` → Content → Posts (create/edit MDX)

**Critical routing conflict (resolved)**

Previously, three hardcoded pages under `app/blog/*` overrode the MDX route renderer. Those files have now been removed so `/blog/[slug]` (MDX, Admin-editable) is the single source of truth.

---

### Video library

- `/vlog` index → `app/(marketing)/vlog/page.tsx` (lists `content/videos/*.mdx`)
- `/vlog/[slug]` → `app/(marketing)/vlog/[slug]/page.tsx` (renders MDX + embeds videoUrl)

Admin mapping:
- `/admin` → Content → Videos (create/edit MDX)

---

### Specialist landing pages

Routes:
- `/financial-abuse`
- `/financial-abuse-therapy`
- `/financial-abuse-therapist`
- `/monetary-psychotherapy`
- `/contemporary-integrative-counselling`

Content:
- Mostly hardcoded headings, lists, and CTAs.
- Some structured data uses `readSiteConfig()` for schema (telephone/brand/image), but the page copy itself is not admin-editable.

Admin mapping:
- Not editable today (except where they reference shared config fields like contact, images, schema).

---

### Legacy static HTML pages (`public/*.html`)

Files:
- `public/why-money-triggers-anxiety-dan-lobel.html`
- `public/the-psychology-behind-spending-habits-dan-lobel.html`
- `public/financial-abuse-emotional-healing-dan-lobel.html`

Notes:
- These are listed in `app/sitemap.ts` as legacy URLs.
- They are not admin-editable today.

---

## Hardening improvements (implemented in this pass)

- Canonical base URL now matches requirement: `www.financialabusetherapist.com.au`
  - Updated in `lib/urls.ts` (affects metadata + sitemap + document viewer links).
- Removed hidden localhost debug logging from `components/navigation.tsx`
  - Prevents noisy network errors and avoids sending interaction telemetry unintentionally.
- Hardened asset uploads:
  - Uploads now preserve the selected file extension (fixes local-dev content-type mismatch).
  - Upload API now validates allowed file types and enforces a max upload size (15MB).

---

## Admin UX / CMS improvements (recommended)

### 1) Make “Forms” fully editable (copy + fields + consent document)

Today, Admin only controls the *links* (`SiteConfig.forms.*`), while the actual form pages are hardcoded.

Recommended approach (minimal-risk, matches existing pattern):
- Add a `SiteConfig.formPages` object with per-form:
  - headings/subheadings
  - helper text
  - field labels/options (including selects)
  - consent statement copy
  - footer/legal blocks
  - crisis helplines section (or reuse `SiteConfig.resources[]`)
- Expose it under Admin → Documents (or a new “Forms” tab).

### 2) Remove / consolidate the blog route conflicts

Unify to one source:
- either MDX-only (preferred) or “hardcoded pages render MDX if present”

### 3) Centralise repeated crisis/helpline content

The Intake/Consent pages contain large hardcoded helpline lists that diverge from:
- Homepage crisis section (uses `SiteConfig.resources[]`)
- Client Care crisis cards (uses `SiteConfig.resources[]`)

Recommended:
- Use `SiteConfig.resources[]` as the only source everywhere.

### 4) Footer legal lines editable

Move footer legal strings into `SiteConfig.brand` or a new `SiteConfig.footer` and expose in Admin.

---

## Open questions (so I can optimise this cleanly)

1) **Blog source of truth**: Should `/blog/*` use **MDX-only** (admin-editable) and we remove the 3 hardcoded blog route files that currently override admin content?
2) **Consent document**: Do you want the long consent/policies content to live as **MDX in Admin** (recommended), and the `/consent` page to render that MDX?
3) **Forms editability scope**: Do you want Admin to be able to edit:
   - just headings/subtext + select options, or
   - the full form schema (fields can be added/removed/reordered)?
4) **Email .com**: Confirmed — remove all `.com` references and use `.com.au` only.


