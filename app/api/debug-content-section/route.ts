import { NextResponse } from "next/server"
import { readSiteConfig } from "@/lib/config"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function normalizeSlug(input: string): string {
  return String(input ?? "").trim().toLowerCase()
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const slugRaw = url.searchParams.get("slug") ?? ""
  const requested = normalizeSlug(slugRaw)

  const cfg = await readSiteConfig()
  const pages = Array.isArray(cfg.contentSectionPages) ? cfg.contentSectionPages : []
  const sections = Array.isArray(cfg.contentSections) ? cfg.contentSections : []
  const page = pages.find((p) => normalizeSlug(p.slug) === requested) ?? null
  const section = sections.find((s) => normalizeSlug(s.slug) === requested) ?? null

  return NextResponse.json({
    ok: true,
    requested: slugRaw,
    normalizedRequested: requested,
    matched: { page: Boolean(page), section: Boolean(section) },
    counts: { contentSectionPages: pages.length, contentSections: sections.length },
    slugs: { contentSectionPages: pages.map((p) => p.slug), contentSections: sections.map((s) => s.slug) },
  })
}


