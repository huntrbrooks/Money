import { NextResponse } from "next/server"
import { readSiteConfig } from "@/lib/config"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const config = await readSiteConfig()
    const html = config.interactiveNewsletterHtml

    if (!html) {
      return new NextResponse("Interactive newsletter HTML not configured", { status: 404 })
    }

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unable to load newsletter"
    return new NextResponse(message, { status: 500 })
  }
}


