import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AUTH_COOKIE_NAME, getEnvVar, verifyAuthToken } from "@/lib/auth"
import { normalizeAssetPath, putAsset } from "@/lib/assets"
import { hasSupabase } from "@/lib/supabase-rest"
import path from "path"

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

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024 // 15MB

function inferContentTypeFromExt(ext: string): string {
  switch (ext) {
    case ".png":
      return "image/png"
    case ".jpg":
    case ".jpeg":
      return "image/jpeg"
    case ".webp":
      return "image/webp"
    case ".gif":
      return "image/gif"
    case ".svg":
      return "image/svg+xml"
    case ".pdf":
      return "application/pdf"
    case ".docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    case ".doc":
      return "application/msword"
    default:
      return "application/octet-stream"
  }
}

function isAllowedUpload(ext: string): boolean {
  return (
    ext === ".png" ||
    ext === ".jpg" ||
    ext === ".jpeg" ||
    ext === ".webp" ||
    ext === ".gif" ||
    ext === ".svg" ||
    ext === ".pdf" ||
    ext === ".doc" ||
    ext === ".docx"
  )
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
  const ext = path.extname(objectPath).toLowerCase()
  if (!isAllowedUpload(ext)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
  }
  const bytes = new Uint8Array(await file.arrayBuffer())
  if (bytes.byteLength > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 413 })
  }
  const declaredType = (file.type || "").toLowerCase()
  const inferredType = inferContentTypeFromExt(ext)
  const contentType =
    declaredType && declaredType !== "application/octet-stream"
      ? declaredType
      : inferredType

  try {
    await putAsset(objectPath, { bytes, contentType })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Upload failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // Always return our proxy URL so assets are served consistently (Supabase/private or local).
  const url = `/api/assets/${encodeURI(objectPath)}`
  return NextResponse.json({ ok: true, path: objectPath, url, storage: hasSupabase() ? "supabase" : "local" })
}


