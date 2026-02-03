import { NextResponse } from "next/server"
import { AUTH_COOKIE_NAME } from "@/lib/auth"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.headers.append(
    "Set-Cookie",
    `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  )
  return res
}


