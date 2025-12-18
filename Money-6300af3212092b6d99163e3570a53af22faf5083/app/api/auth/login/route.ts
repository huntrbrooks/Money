import { NextResponse } from "next/server"
import { AUTH_COOKIE_NAME, createAuthToken, getEnvVar } from "@/lib/auth"

export async function POST(request: Request) {
  const { username, password } = await request.json().catch(() => ({}))
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "Dan Lobel"
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Popcorn"
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
  const JWT_SECRET = getEnvVar("JWT_SECRET", "dev-secret-change")
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
  const token = await createAuthToken({ username, exp }, JWT_SECRET)
  const res = NextResponse.json({ ok: true })
  res.headers.append(
    "Set-Cookie",
    `${AUTH_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  )
  return res
}


