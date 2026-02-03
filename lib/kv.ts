type UpstashPipelineResult = {
  result?: unknown
  error?: string
}

function env(name: string): string | undefined {
  const v = process.env[name]
  if (!v) return undefined
  const trimmed = v.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const KV_URL = env("KV_REST_API_URL")
const KV_TOKEN = env("KV_REST_API_TOKEN")

export function hasKv(): boolean {
  return Boolean(KV_URL && KV_TOKEN)
}

async function pipeline(commands: Array<Array<string | number>>) {
  if (!KV_URL || !KV_TOKEN) {
    throw new Error("KV not configured")
  }
  const url = `${KV_URL.replace(/\/$/, "")}/pipeline`
  const res = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(commands),
  })
  if (!res.ok) {
    throw new Error(`KV request failed (${res.status})`)
  }
  const data = (await res.json().catch(() => null)) as UpstashPipelineResult[] | null
  if (!Array.isArray(data)) {
    throw new Error("KV invalid response")
  }
  return data
}

export async function kvGet(key: string): Promise<string | null> {
  const results = await pipeline([["GET", key]])
  const first = results[0]
  if (!first || first.error) return null
  return typeof first.result === "string" ? first.result : first.result == null ? null : String(first.result)
}

export async function kvSet(key: string, value: string): Promise<void> {
  const results = await pipeline([["SET", key, value]])
  const first = results[0]
  if (!first || first.error) {
    throw new Error(first?.error ?? "KV SET failed")
  }
}

export async function kvScanKeys(match: string, count = 1000): Promise<string[]> {
  const keys: string[] = []
  let cursor = "0"
  // SCAN cursor MATCH pattern COUNT n
  do {
    const results = await pipeline([["SCAN", cursor, "MATCH", match, "COUNT", count]])
    const first = results[0]
    if (!first || first.error) break
    const scan = first.result
    if (!Array.isArray(scan) || scan.length < 2) break
    cursor = String(scan[0] ?? "0")
    const batch = scan[1]
    if (Array.isArray(batch)) {
      for (const k of batch) {
        if (typeof k === "string") keys.push(k)
      }
    }
  } while (cursor !== "0")
  return keys
}


