# Client website revisions and production audit

Date: 25 September 2026 (Australia/Sydney)

Website: https://financialtraumatherapist.com.au

## Requested revisions

The three supplied email PDFs and seven screenshots were reviewed as client requirements. The later screenshot takes precedence over the earlier heading request.

| Requirement | Released result |
| --- | --- |
| Rename the nine-topic heading | **Financial Trauma Crises:** |
| Remove extra material from all nine topic pages | Therapy approach, Session formats, Explore more, FAQs and FAQ structured data removed. The main content ends with Book a consultation. Site footer retained. |
| Correct downloads title | **Downloads & Forms:** |
| Reduce Contact heading | Matches other main section headings; checked on desktop and mobile. |
| Repair menu downloads link | Opens the actual downloads section and closes the menu. |
| Simplify footer social links | Follow Dan, Facebook and Instagram removed; LinkedIn retained. |

The live CMS content was backed up before targeted changes. Topic copy, consultation prices, contact information, branding and legal documents were preserved. The two homepage headings remain editable in Admin.

## Additional audit fixes

- Corrected broken legacy contact/service destinations, whitespace in saved links, narrow-screen text wrapping, and menu keyboard focus/scrolling.
- Removed an unpublished demonstration video from the public video listing.
- Prevented newsletter signup from reporting success while no mailing provider is connected. The page clearly explains that subscriptions are unavailable and directs visitors to enquire.
- Corrected stale search titles/descriptions on the nine topic pages and duplicate sitemap entries.
- Improved image loading, image descriptions and text contrast; restored production TypeScript checks and repaired the resulting type/build errors.
- Resolved intermittent hydration errors by waiting for CMS metadata before streaming the page. This uses the documented [Next.js metadata configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots).
- Corrected article button accessibility, added its main landmark, and fixed Client Care/newsletter canonical URLs.

## Verification

- Production browser acceptance suite: **52/52 passed** on final release 69c4a8b, including all nine topic pages, menu navigation, footer changes, forms, PDFs and four viewport widths: 320, 390, 768 and 1440 pixels.
- An additional 30 full page loads produced **no JavaScript page errors** after the hydration fix.
- Site crawl: **37 public pages / 53 internal URL checks**, no broken destinations or section anchors.
- Sitemap: **34 unique URLs**, all responding successfully; no duplicates.
- Both legal downloads return real PDF documents; mobile document rendering was checked.
- Unauthenticated CMS writes return HTTP 401. Lint, TypeScript and production build checks pass.
- External booking calendar opened successfully. All six listed consultation durations/prices match the website; discovery-call availability is displayed. No booking or payment was made.
- External destinations were checked. LinkedIn requires sign-in; Blue Knot blocks automated fetching but opened successfully in the browser.
- Production server error/fatal log scan was empty during the test window.

### Forms and authorised live email test

Both enquiry and intake forms passed browser completion, required-field validation, success-message rendering and delivery preparation with sending disabled.

At 08:37:32 UTC, one explicitly authorised, clearly labelled test enquiry was submitted through production. The endpoint returned HTTP 200 with `ok: true` (not development mode). The corresponding automatic confirmation arrived in Gerard's Gmail inbox. [Confirmation email](https://mail.google.com/mail/#all/1a0d7b673260e568).

This verifies live sending and receipt of the confirmation. Dan's main recipient inbox and admin-notification receipt were not independently inspected. The intake form was not sent a second live test.

### Lighthouse

On production release 14e6cad, the homepage scored:

| Device | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Mobile | 99 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

Scores are point-in-time lab measurements and may vary. The wider article/Client Care findings were corrected and verified on release 14e6cad:

| Page/device | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Article/mobile | 98 | 100 | 100 | 100 |
| Article/desktop | 100 | 100 | 100 | 100 |
| Client Care/mobile | 99 | 100 | 100 | 100 |
| Client Care/desktop | 100 | 100 | 100 | 100 |

## Handover limits

- Newsletter subscriptions remain unavailable until a mailing/CRM provider is configured. No signup falsely claims to have subscribed someone.
- Dan should confirm the labelled test reached his recipient inbox. The user's confirmation email was verified directly.
- No real booking, charge, or payment was made. LinkedIn's profile beyond its sign-in wall was not independently verified.
- The audit covers tested public routes and interactions; it is not a guarantee against every future issue or a full penetration test.

## Evidence

Screenshots and machine-readable browser results are saved locally in `output/playwright/client-handoff-2026-09-25/`. Original unrelated workspace recovery files and local changes were preserved.

## Final release

- Latest client amendment: **Financial Trauma Crises:** (including the colon), superseding **Financial Trauma Causes**.
- CMS version: `1790325727406`. Only the requested heading changed in this final CMS save.
- Production application commit: `69c4a8b98bd7edfe6952688c1d530b62c80c691f`.
- Vercel deployment: `dpl_6rNFCAPn3y4qxus23MEgZJbynYT5`, READY, assigned to the canonical domain.
- Immutable deployment: https://money-4vm0nlgsy-gerard-grenvilles-projects.vercel.app
- Canonical-domain server HTML confirms the new heading, absence of the old heading, and this deployment ID.
- The later audit-report commit changes documentation only; production application code matches the release above.

Final acceptance rerun on deployment dpl_6rNFCAPn3y4qxus23MEgZJbynYT5: **52/52 passed**, including the latest Crises heading. No JavaScript page errors or server error/fatal log entries were observed.
