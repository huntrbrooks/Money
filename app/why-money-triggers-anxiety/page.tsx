import { redirect } from "next/navigation"
import { readSiteConfig } from "@/lib/config"

export const dynamic = "force-dynamic"

function normalizeKey(input: string): string {
  return String(input ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim()
}

export default async function WhyMoneyTriggersAnxietyAlias() {
  const cfg = await readSiteConfig()
  const wantedSlug = "why-money-triggers-anxiety"
  const wantedTitleKey = normalizeKey("Why money triggers anxiety")

  const section =
    cfg.contentSections?.find((s) => s?.slug === wantedSlug) ??
    cfg.contentSections?.find((s) => normalizeKey(s?.title ?? "") === wantedTitleKey)

  const hasAdminContent = Boolean((section?.content ?? "").trim() || (section?.pdfUrl ?? "").trim())

  // If Admin has populated the content section, use the CMS-driven page (editable + persistent).
  if (section?.slug && hasAdminContent) {
    redirect(`/content-sections/${section.slug}`)
  }

  // Otherwise, fall back to the legacy published article so the link is never "blank" in production.
  redirect("/why-money-triggers-anxiety-dan-lobel.html")
}


