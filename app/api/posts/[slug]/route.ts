import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import path from "path"
import { readFile, writeFile } from "fs/promises"
import { AUTH_COOKIE_NAME, getEnvVar, verifyAuthToken } from "@/lib/auth"
import { hasSupabase, sbGetContent, sbInsertContent, sbUpdateContent } from "@/lib/supabase-rest"

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
  if (!s || s.includes("/") || s.includes("..")) throw new Error("Invalid slug")
  return s
}

export async function GET(_req: Request, { params }: Params) {
  const slug = safeSlug(params.slug)

  // Prefer Supabase source if configured (it overrides filesystem in rendering).
  if (hasSupabase()) {
    const mdx = await sbGetContent("posts", slug)
    if (typeof mdx === "string" && mdx.length) {
      return NextResponse.json({ slug, source: "supabase", mdx })
    }
  }

  const filePath = path.join(process.cwd(), "content", "posts", `${slug}.mdx`)
  try {
    const mdx = await readFile(filePath, "utf8")
    return NextResponse.json({ slug, source: "filesystem", mdx })
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
  const body = (await req.json().catch(() => null)) as { mdx?: string } | null
  const mdx = body?.mdx
  if (typeof mdx !== "string") {
    return NextResponse.json({ error: "Missing mdx" }, { status: 400 })
  }

  if (hasSupabase()) {
    // Ensure the row exists, then update (Supabase is the canonical override).
    const existing = await sbGetContent("posts", slug)
    if (!existing) {
      const result = await sbInsertContent("posts", slug, mdx)
      if (result === "exists") {
        await sbUpdateContent("posts", slug, mdx)
      }
    } else {
      await sbUpdateContent("posts", slug, mdx)
    }
    return NextResponse.json({ ok: true, slug, savedTo: "supabase" })
  }

  const filePath = path.join(process.cwd(), "content", "posts", `${slug}.mdx`)
  try {
    await writeFile(filePath, mdx, "utf8")
    return NextResponse.json({ ok: true, slug, savedTo: "filesystem" })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unable to write file"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


