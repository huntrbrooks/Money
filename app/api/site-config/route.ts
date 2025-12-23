import { NextResponse } from "next/server"
import { readSiteConfig, writeSiteConfig, type SiteConfig } from "@/lib/config"
import { cookies } from "next/headers"
import { AUTH_COOKIE_NAME, getEnvVar, verifyAuthToken } from "@/lib/auth"

export async function GET() {
  const config = await readSiteConfig()
  return NextResponse.json(config)
}

export async function PUT(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const JWT_SECRET = getEnvVar("JWT_SECRET", "dev-secret-change")
  const payload = token ? await verifyAuthToken(token, JWT_SECRET) : null
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = (await request.json().catch(() => null)) as SiteConfig | null
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  try {
    await writeSiteConfig(body)
    // Return current version so the admin UI can confirm "live" status.
    const updated = await readSiteConfig()
    return NextResponse.json({
      ok: true,
      version: updated.meta?.version ?? null,
      updatedAt: updated.meta?.updatedAt ?? null,
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unable to save"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


