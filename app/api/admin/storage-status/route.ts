import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AUTH_COOKIE_NAME, getEnvVar, verifyAuthToken } from "@/lib/auth"
import { hasSupabase } from "@/lib/supabase-rest"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function requireAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const JWT_SECRET = getEnvVar("JWT_SECRET", "dev-secret-change")
  const payload = token ? await verifyAuthToken(token, JWT_SECRET) : null
  if (!payload) throw new Error("Unauthorized")
}

export async function GET() {
  try {
    await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    ok: true,
    storage: hasSupabase() ? "supabase" : "local",
    bucket: "site-assets",
  })
}


