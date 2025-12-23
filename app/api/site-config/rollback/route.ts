import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AUTH_COOKIE_NAME, getEnvVar, verifyAuthToken } from "@/lib/auth"
import { hasSupabase, sbGetSiteConfigVersionById } from "@/lib/supabase-rest"
import { writeSiteConfig, type SiteConfig } from "@/lib/config"

async function requireAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const JWT_SECRET = getEnvVar("JWT_SECRET", "dev-secret-change")
  const payload = token ? await verifyAuthToken(token, JWT_SECRET) : null
  if (!payload) throw new Error("Unauthorized")
}

export async function POST(request: Request) {
  try {
    await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!hasSupabase()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 400 })
  }

  const body = (await request.json().catch(() => null)) as { id?: number } | null
  const id = body?.id
  if (!id || typeof id !== "number") {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  const row = await sbGetSiteConfigVersionById(id)
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Restoring creates a new version entry via writeSiteConfig()
  await writeSiteConfig(row.data as SiteConfig)
  return NextResponse.json({ ok: true })
}


