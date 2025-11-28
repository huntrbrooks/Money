import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import path from "path"
import { access, constants, mkdir, writeFile } from "fs/promises"
import { AUTH_COOKIE_NAME, getEnvVar, verifyAuthToken } from "@/lib/auth"
import { getAllVideosMeta } from "@/lib/mdx"

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
  const videos = await getAllVideosMeta()
  return NextResponse.json(videos)
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
    videoUrl?: string
    date?: string
    slug?: string
  } | null
  if (!body?.title || !body?.videoUrl) {
    return NextResponse.json({ error: "Title and videoUrl are required" }, { status: 400 })
  }
  const slug = body.slug ? slugify(body.slug) : slugify(body.title)
  const videosDir = path.join(process.cwd(), "content", "videos")
  const filePath = path.join(videosDir, `${slug}.mdx`)
  try {
    await access(filePath, constants.F_OK)
    return NextResponse.json({ error: "A video with this slug already exists" }, { status: 409 })
  } catch {
    // expected when file does not exist
  }
  await mkdir(videosDir, { recursive: true })
  const now = body.date ?? new Date().toISOString().slice(0, 10)
  const template = `---
title: "${body.title}"
description: "${body.description ?? "Draft video description. Update before publishing."}"
date: "${now}"
slug: "${slug}"
videoUrl: "${body.videoUrl}"
platform: "YouTube"
duration: ""
tags:
  - video
---

Add optional show notes here...
`
  await writeFile(filePath, template, "utf8")
  return NextResponse.json({ ok: true, slug })
}

