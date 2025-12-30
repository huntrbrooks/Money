# Release & QA Checklist

## 1. Pre-flight QA

1. `pnpm lint && pnpm build`
2. Run Lighthouse (desktop + mobile) on:
   - `/`
   - `/blog/why-money-triggers-anxiety`
   - `/client-care`
3. Validate structured data via Google Rich Results:
   - LocalBusiness (`/`)
   - Article (`/blog/...`)
   - VideoObject (`/vlog/...`)
4. Manual smoke tests:
   - Enquiry form (required fields, consent gating).
   - Intake form (date validation + submission).
   - Newsletter modal and page.
   - Lead magnet (mobile sticky + desktop slide-out).

## 2. Environment Variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 (optional). |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Google Ads conversion ID (AW-XXXXXXXXX format, optional). |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` | Google Ads conversion label (optional, provided when setting up conversion action). |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID (optional). |
| `NEXT_PUBLIC_LINKEDIN_TAG_ID` | LinkedIn Insight tag (optional). |
| `RESEND_API_KEY` or `SMTP_*` | Email delivery for enquiry/intake forms. |
| `CRM_WEBHOOK_URL` (optional) | Sends newsletter/enquiry/intake leads to CRM. |
| `CRM_WEBHOOK_TOKEN` (optional) | Bearer token for CRM webhook. |

## 3. Deployment sequence

1. Confirm `data/site.json` matches desired copy/theme settings.
2. Deploy to staging → rerun QA above.
3. Promote to production.
4. Monitor `/api/events` logs for lead magnet & newsletter events during first 24h.














