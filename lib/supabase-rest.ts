type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

function env(name: string): string | undefined {
  const v = process.env[name]
  if (!v) return undefined
  const trimmed = v.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

// Prefer unprefixed names, but also accept the Vercel/Supabase integration names you pasted.
const SUPABASE_URL =
  env("SUPABASE_URL") ??
  env("NEXT_PUBLIC_SUPABASE_URL") ??
  env("Financialabusetherapist_SUPABASE_URL") ??
  env("NEXT_PUBLIC_Financialabusetherapist_SUPABASE_URL")

// IMPORTANT: use Service Role key server-side only (never expose to the browser)
const SUPABASE_SERVICE_ROLE_KEY =
  env("SUPABASE_SERVICE_ROLE_KEY") ?? env("Financialabusetherapist_SUPABASE_SERVICE_ROLE_KEY")

export function hasSupabase(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
}

function restUrl(pathname: string): string {
  if (!SUPABASE_URL) throw new Error("SUPABASE_URL missing")
  return `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${pathname.replace(/^\//, "")}`
}

async function sbFetch(url: string, init?: RequestInit): Promise<Response> {
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY missing")
  const headers = new Headers(init?.headers)
  headers.set("apikey", SUPABASE_SERVICE_ROLE_KEY)
  headers.set("Authorization", `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`)
  headers.set("Cache-Control", "no-store")
  return await fetch(url, {
    ...init,
    cache: "no-store",
    headers,
  })
}

export async function sbGetSiteConfigJson(): Promise<Json | null> {
  if (!hasSupabase()) return null
  const url = `${restUrl("site_config")}?id=eq.1&select=data`
  const res = await sbFetch(url, { method: "GET" })
  if (!res.ok) return null
  const rows = (await res.json().catch(() => null)) as Array<{ data: Json }> | null
  return rows?.[0]?.data ?? null
}

export async function sbUpsertSiteConfigJson(data: Json): Promise<void> {
  if (!hasSupabase()) throw new Error("Supabase not configured")
  const url = `${restUrl("site_config")}?on_conflict=id`
  const res = await sbFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify([{ id: 1, data, updated_at: new Date().toISOString() }]),
  })
  if (!res.ok) {
    throw new Error(`Supabase upsert failed (${res.status})`)
  }
}

export type SiteConfigVersionRow = {
  id: number
  version: number
  updated_at: string
}

export async function sbInsertSiteConfigVersion(data: Json, version: number, updatedAt: string): Promise<void> {
  if (!hasSupabase()) throw new Error("Supabase not configured")
  const url = restUrl("site_config_versions")
  const res = await sbFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify([{ config_id: 1, version, updated_at: updatedAt, data }]),
  })
  if (!res.ok) {
    throw new Error(`Supabase insert version failed (${res.status})`)
  }
}

export async function sbListSiteConfigVersions(limit = 25): Promise<SiteConfigVersionRow[]> {
  if (!hasSupabase()) return []
  const url = `${restUrl("site_config_versions")}?config_id=eq.1&select=id,version,updated_at&order=updated_at.desc&limit=${limit}`
  const res = await sbFetch(url, { method: "GET" })
  if (!res.ok) return []
  const rows = (await res.json().catch(() => null)) as SiteConfigVersionRow[] | null
  return Array.isArray(rows) ? rows : []
}

export async function sbGetSiteConfigVersionById(id: number): Promise<{ data: Json; version: number; updated_at: string } | null> {
  if (!hasSupabase()) return null
  const url = `${restUrl("site_config_versions")}?id=eq.${id}&select=data,version,updated_at&limit=1`
  const res = await sbFetch(url, { method: "GET" })
  if (!res.ok) return null
  const rows = (await res.json().catch(() => null)) as Array<{ data: Json; version: number; updated_at: string }> | null
  const row = rows?.[0]
  if (!row) return null
  return row
}

export async function sbListContent(type: "posts" | "videos"): Promise<Array<{ slug: string; mdx: string }>> {
  if (!hasSupabase()) return []
  const url = `${restUrl("content_items")}?type=eq.${encodeURIComponent(type)}&select=slug,mdx`
  const res = await sbFetch(url, { method: "GET" })
  if (!res.ok) return []
  const rows = (await res.json().catch(() => null)) as Array<{ slug: string; mdx: string }> | null
  return Array.isArray(rows) ? rows.filter((r) => typeof r.slug === "string" && typeof r.mdx === "string") : []
}

export async function sbGetContent(type: "posts" | "videos", slug: string): Promise<string | null> {
  if (!hasSupabase()) return null
  const url = `${restUrl("content_items")}?type=eq.${encodeURIComponent(type)}&slug=eq.${encodeURIComponent(slug)}&select=mdx&limit=1`
  const res = await sbFetch(url, { method: "GET" })
  if (!res.ok) return null
  const rows = (await res.json().catch(() => null)) as Array<{ mdx: string }> | null
  const mdx = rows?.[0]?.mdx
  return typeof mdx === "string" ? mdx : null
}

export async function sbInsertContent(
  type: "posts" | "videos",
  slug: string,
  mdx: string
): Promise<"inserted" | "exists"> {
  if (!hasSupabase()) throw new Error("Supabase not configured")
  const url = restUrl("content_items")
  const res = await sbFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify([{ type, slug, mdx }]),
  })
  if (res.ok) return "inserted"
  if (res.status === 409) return "exists"
  throw new Error(`Supabase insert failed (${res.status})`)
}

export async function sbUpdateContent(
  type: "posts" | "videos",
  slug: string,
  mdx: string
): Promise<"updated" | "missing"> {
  if (!hasSupabase()) throw new Error("Supabase not configured")
  const url = `${restUrl("content_items")}?type=eq.${encodeURIComponent(type)}&slug=eq.${encodeURIComponent(slug)}`
  const res = await sbFetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ mdx }),
  })
  if (res.status === 404) return "missing"
  if (!res.ok) {
    throw new Error(`Supabase update failed (${res.status})`)
  }
  // PostgREST returns an array of updated rows when using return=representation
  const rows = (await res.json().catch(() => null)) as Array<{ slug?: string }> | null
  return Array.isArray(rows) && rows.length > 0 ? "updated" : "missing"
}

