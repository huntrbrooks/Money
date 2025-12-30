import { promises as fs } from "fs"
import path from "path"
import { hasSupabase } from "@/lib/supabase-rest"

type StoredAsset = {
  bytes: Uint8Array
  contentType: string
}

function env(name: string): string | undefined {
  const v = process.env[name]
  if (!v) return undefined
  const t = v.trim()
  return t.length ? t : undefined
}

function requireEnv(name: string): string {
  const v = env(name)
  if (!v) throw new Error(`Missing required environment variable: ${name}`)
  return v
}

// We intentionally serve all uploaded assets through our own API route so:
// - the bucket can remain private
// - we don't need to manage signed URL expiries
// - we can support local-dev persistence without Supabase
export const SITE_ASSETS_BUCKET = "site-assets"

function supabaseBaseUrl(): string {
  // Match `lib/supabase-rest.ts` env var compatibility so assets work in all deployments.
  const base =
    env("SUPABASE_URL") ??
    env("supabase_URL") ??
    env("NEXT_PUBLIC_SUPABASE_URL") ??
    env("Financialabusetherapist_SUPABASE_URL") ??
    env("NEXT_PUBLIC_Financialabusetherapist_SUPABASE_URL")
  if (!base) throw new Error("SUPABASE_URL missing")
  return base
}

function supabaseStorageUrl(objectPath: string): string {
  const base = supabaseBaseUrl()
  return `${base.replace(/\/$/, "")}/storage/v1/object/${SITE_ASSETS_BUCKET}/${objectPath.replace(/^\/+/, "")}`
}

async function sbFetch(url: string, init?: RequestInit): Promise<Response> {
  const key =
    env("SUPABASE_SERVICE_ROLE_KEY") ??
    env("supabase_SERVICE_ROLE_KEY") ??
    env("Financialabusetherapist_SUPABASE_SERVICE_ROLE_KEY")
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY missing")
  const headers = new Headers(init?.headers)
  headers.set("apikey", key)
  headers.set("Authorization", `Bearer ${key}`)
  headers.set("Cache-Control", "no-store")
  return await fetch(url, { ...init, headers, cache: "no-store" })
}

function localAssetsRoot(): string {
  return path.join(process.cwd(), "data", "uploads")
}

export function normalizeAssetPath(input: string): string {
  const trimmed = String(input ?? "").trim()
  if (!trimmed) throw new Error("Missing asset path")
  // Prevent path traversal; only allow relative paths.
  const cleaned = trimmed.replace(/^\/+/, "")
  if (cleaned.includes("..")) throw new Error("Invalid asset path")
  return cleaned
}

export async function putAsset(objectPath: string, asset: StoredAsset): Promise<void> {
  const normalized = normalizeAssetPath(objectPath)

  if (hasSupabase()) {
    const url = new URL(supabaseStorageUrl(normalized))
    url.searchParams.set("upsert", "true")
    const res = await sbFetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": asset.contentType || "application/octet-stream",
        "x-upsert": "true",
      },
      body: asset.bytes,
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      throw new Error(`Supabase storage upload failed (${res.status}): ${detail.slice(0, 500)}`)
    }
    return
  }

  // Local fallback: write to data/uploads/<path>
  const fullPath = path.join(localAssetsRoot(), normalized)
  await fs.mkdir(path.dirname(fullPath), { recursive: true })
  await fs.writeFile(fullPath, asset.bytes)
}

export async function getAsset(objectPath: string): Promise<{ contentType: string; bytes: Uint8Array } | null> {
  const normalized = normalizeAssetPath(objectPath)

  if (hasSupabase()) {
    const res = await sbFetch(supabaseStorageUrl(normalized), { method: "GET" })
    if (!res.ok) return null
    const arrayBuf = await res.arrayBuffer()
    const contentType = res.headers.get("content-type") || "application/octet-stream"
    return { contentType, bytes: new Uint8Array(arrayBuf) }
  }

  const fullPath = path.join(localAssetsRoot(), normalized)
  try {
    const bytes = await fs.readFile(fullPath)
    // Best-effort content type based on extension
    const ext = path.extname(normalized).toLowerCase()
    const contentType =
      ext === ".docx"
        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : ext === ".pdf"
          ? "application/pdf"
          : ext === ".png"
            ? "image/png"
            : ext === ".jpg" || ext === ".jpeg"
              ? "image/jpeg"
              : ext === ".webp"
                ? "image/webp"
                : "application/octet-stream"
    return { contentType, bytes: new Uint8Array(bytes) }
  } catch {
    return null
  }
}


