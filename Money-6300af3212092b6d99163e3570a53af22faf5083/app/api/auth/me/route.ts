import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { AUTH_COOKIE_NAME, getEnvVar, verifyAuthToken } from "@/lib/auth"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ authenticated: false }, { status: 200 })
  const JWT_SECRET = getEnvVar("JWT_SECRET", "dev-secret-change")
  const payload = await verifyAuthToken(token, JWT_SECRET)
  if (!payload) return NextResponse.json({ authenticated: false }, { status: 200 })
  return NextResponse.json({ authenticated: true, user: { username: payload.username } })
}


