import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import path from "path"
import { readFile, writeFile } from "fs/promises"
import { AUTH_COOKIE_NAME, getEnvVar, verifyAuthToken } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Params = { params: { slug: string } }

async function requireAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const JWT_SECRET = getEnvVar("JWT_SECRET", "dev-secret-change")
  const payload = token ? await verifyAuthToken(token, JWT_SECRET) : null
  if (!payload) throw new Error("Unauthorized")
}

function safeSlug(input: string): string {
  const s = String(input ?? "").trim()
  if (!s || s.includes("/") || s.includes("..") || s.includes("\\")) {
    throw new Error("Invalid slug")
  }
  return s
}

export async function GET(_req: Request, { params }: Params) {
  const slug = safeSlug(params.slug)
  const filePath = path.join(process.cwd(), "public", "newsletters", `${slug}.html`)

  try {
    const html = await readFile(filePath, "utf8")
    return NextResponse.json({ slug, html })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const slug = safeSlug(params.slug)
  const body = (await req.json().catch(() => null)) as { html?: string } | null
  const html = body?.html

  if (typeof html !== "string") {
    return NextResponse.json({ error: "Missing html" }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), "public", "newsletters", `${slug}.html`)

  try {
    // Ensure directory exists
    const dir = path.dirname(filePath)
    const { mkdir } = await import("fs/promises")
    await mkdir(dir, { recursive: true })
    await writeFile(filePath, html, "utf8")
    return NextResponse.json({ ok: true, slug })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unable to write file"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

