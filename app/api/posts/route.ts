import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import path from "path"
import { access, constants, mkdir, writeFile } from "fs/promises"
import { AUTH_COOKIE_NAME, getEnvVar, verifyAuthToken } from "@/lib/auth"
import { getAllPostsMeta } from "@/lib/mdx"
import { hasSupabase, sbGetContent, sbInsertContent } from "@/lib/supabase-rest"

async function requireAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const JWT_SECRET = getEnvVar("JWT_SECRET", "dev-secret-change")
  const payload = token ? await verifyAuthToken(token, JWT_SECRET) : null
  if (!payload) {
    throw new Error("Unauthorized")
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export async function GET() {
  const posts = await getAllPostsMeta()
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  try {
    await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = (await request.json().catch(() => null)) as {
    title?: string
    description?: string
    date?: string
    slug?: string
  } | null
  if (!body?.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 })
  }
  const slug = body.slug ? slugify(body.slug) : slugify(body.title)

  if (hasSupabase()) {
    const existing = await sbGetContent("posts", slug)
    if (existing) {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 })
    }
  }

  const postsDir = path.join(process.cwd(), "content", "posts")
  const filePath = path.join(postsDir, `${slug}.mdx`)
  try {
    await access(filePath, constants.F_OK)
    return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 })
  } catch {
    // file does not exist which is expected
  }
  await mkdir(postsDir, { recursive: true })
  const now = body.date ?? new Date().toISOString().slice(0, 10)
  const description =
    body.description ?? "Draft description. Update this once you add the full article body."
  const template = `---
title: "${body.title}"
description: "${description}"
date: "${now}"
slug: "${slug}"
tags:
  - draft
coverImage: "/og.jpg"
---

Write your article content here...
`

  if (hasSupabase()) {
    const result = await sbInsertContent("posts", slug, template)
    if (result === "exists") {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 })
    }
    return NextResponse.json({ ok: true, slug })
  }

  await writeFile(filePath, template, "utf8")
  return NextResponse.json({ ok: true, slug })
}

