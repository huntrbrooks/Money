import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AUTH_COOKIE_NAME, getEnvVar, verifyAuthToken } from "@/lib/auth"
import { normalizeAssetPath, putAsset } from "@/lib/assets"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function requireAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const JWT_SECRET = getEnvVar("JWT_SECRET", "dev-secret-change")
  const payload = token ? await verifyAuthToken(token, JWT_SECRET) : null
  if (!payload) throw new Error("Unauthorized")
}

function safeFilename(name: string): string {
  return String(name ?? "")
    .trim()
    .replace(/[^a-z0-9._-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120) || "file"
}

export async function POST(request: Request) {
  try {
    await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 })
  }

  const pathRaw = String(form.get("path") ?? "")
  const folderRaw = String(form.get("folder") ?? "")
  const file = form.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 })
  }

  const folder = folderRaw.trim().replace(/^\/+/, "").replace(/\/+$/, "")
  const filename = safeFilename(file.name)
  const objectPath = normalizeAssetPath(pathRaw || (folder ? `${folder}/${filename}` : filename))
  const contentType = file.type || "application/octet-stream"
  const bytes = new Uint8Array(await file.arrayBuffer())

  try {
    await putAsset(objectPath, { bytes, contentType })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Upload failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // Always return our proxy URL so assets are served consistently (Supabase/private or local).
  const url = `/api/assets/${encodeURI(objectPath)}`
  return NextResponse.json({ ok: true, path: objectPath, url })
}


