import { NextResponse, type NextRequest } from "next/server"
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLogin = pathname === "/admin/login"
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value || ""
  const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change"
  const payload = token ? await verifyAuthToken(token, JWT_SECRET) : null

  if (!payload && !isLogin) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  if (payload && isLogin) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}


