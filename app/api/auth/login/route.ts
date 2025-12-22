import { NextResponse } from "next/server"
import { AUTH_COOKIE_NAME, createAuthToken, getEnvVar } from "@/lib/auth"

function normalizeEnvValue(value: string): string {
  const trimmed = value.trim()
  return trimmed.replace(/^["']([\s\S]*)["']$/, "$1").trim()
}

function parseAllowedValues(raw: string | undefined, fallback: string): string[] {
  if (!raw || raw.trim().length === 0) return [fallback]
  const normalized = normalizeEnvValue(raw)
  // Allow comma/newline-separated values so you can rotate credentials without downtime
  const parts = normalized
    .split(/[,\n]/g)
    .map((p) => normalizeEnvValue(p))
    .filter((p) => p.length > 0)
  return parts.length > 0 ? parts : [fallback]
}

export async function POST(request: Request) {
  const { username, password } = await request.json().catch(() => ({}))
  const allowedUsernames = parseAllowedValues(process.env.ADMIN_USERNAME, "Dan Lobel")
  const allowedPasswords = parseAllowedValues(process.env.ADMIN_PASSWORD, "Popcorn")

  if (!allowedUsernames.includes(String(username ?? "")) || !allowedPasswords.includes(String(password ?? ""))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const JWT_SECRET = getEnvVar("JWT_SECRET", "dev-secret-change")
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
  const token = await createAuthToken({ username: String(username ?? ""), exp }, JWT_SECRET)
  const res = NextResponse.json({ ok: true })

  const secure = process.env.NODE_ENV === "production" ? " Secure;" : ""
  res.headers.append(
    "Set-Cookie",
    `${AUTH_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7};${secure}`
  )

  return res
}

