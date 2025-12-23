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

export async function POST(request: Request) {
  try {
    await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as { prompt?: string } | null
  const prompt = body?.prompt?.trim()
  if (!prompt) return NextResponse.json({ error: "Missing prompt" }, { status: 400 })

  const owner = env("GITHUB_OWNER") ?? "huntrbrooks"
  const repo = env("GITHUB_REPO") ?? "Money"
  const token = env("GITHUB_TOKEN")
  if (!token) {
    return NextResponse.json({ error: "Missing GITHUB_TOKEN env var" }, { status: 500 })
  }

  const title = prompt.length > 80 ? `${prompt.slice(0, 77)}…` : prompt
  const issueBody = [
    "## Request",
    prompt,
    "",
    "## Notes",
    "- Created from the website Admin → Assistant → Code Agent.",
    "- This issue is labeled `agent` and should trigger the repo agent workflow to open a PR.",
    "",
    "## Guardrails",
    "- Prefer minimal, safe diffs.",
    "- Run `pnpm lint` and `pnpm build` before opening the PR (workflow).",
  ].join("\n")

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `Agent: ${title}`,
      body: issueBody,
      labels: ["agent"],
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    return NextResponse.json({ error: `GitHub error (${res.status})`, details: text.slice(0, 4000) }, { status: 502 })
  }

  const data = (await res.json().catch(() => null)) as { html_url?: string; number?: number } | null
  return NextResponse.json({ ok: true, url: data?.html_url ?? null, number: data?.number ?? null })
}


