import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AUTH_COOKIE_NAME, getEnvVar, verifyAuthToken } from "@/lib/auth"

function env(name: string): string | undefined {
  const v = process.env[name]
  if (!v) return undefined
  const trimmed = v.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

async function requireAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const JWT_SECRET = getEnvVar("JWT_SECRET", "dev-secret-change")
  const payload = token ? await verifyAuthToken(token, JWT_SECRET) : null
  if (!payload) throw new Error("Unauthorized")
}

export async function GET(request: Request) {
  try {
    await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const issueStr = url.searchParams.get("issue")
  const issue = issueStr ? Number(issueStr) : NaN
  if (!issueStr || Number.isNaN(issue) || issue <= 0) {
    return NextResponse.json({ error: "Missing/invalid issue" }, { status: 400 })
  }

  const owner = env("GITHUB_OWNER") ?? "huntrbrooks"
  const repo = env("GITHUB_REPO") ?? "Money"
  const token = env("GITHUB_TOKEN")
  if (!token) {
    return NextResponse.json({ error: "Missing GITHUB_TOKEN env var" }, { status: 500 })
  }

  // The workflow creates a PR branch named: agent/issue-<issue>
  const head = `${owner}:agent/issue-${issue}`
  const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all&head=${encodeURIComponent(head)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  })

  if (!prRes.ok) {
    const text = await prRes.text().catch(() => "")
    return NextResponse.json({ error: `GitHub error (${prRes.status})`, details: text.slice(0, 2000) }, { status: 502 })
  }

  const prs = (await prRes.json().catch(() => [])) as Array<{
    number: number
    html_url: string
    state: "open" | "closed"
    merged_at: string | null
    title: string
  }>

  const pr = prs?.[0] ?? null
  return NextResponse.json({
    ok: true,
    issue,
    pr: pr
      ? {
          number: pr.number,
          url: pr.html_url,
          state: pr.state,
          merged: Boolean(pr.merged_at),
          title: pr.title,
        }
      : null,
  })
}


