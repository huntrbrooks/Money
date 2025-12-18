import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const LOG_PATH = path.join(process.cwd(), ".cursor", "debug.log")

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = {
      ...body,
      timestamp: body?.timestamp ?? Date.now(),
    }
    await fs.mkdir(path.dirname(LOG_PATH), { recursive: true })
    await fs.appendFile(LOG_PATH, `${JSON.stringify(payload)}\n`, "utf8")
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error ? String(error) : "unknown" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const raw = searchParams.get("p")
    if (!raw) {
      return NextResponse.json({ ok: false, error: "missing payload" }, { status: 400 })
    }
    const decoded = decodeURIComponent(raw)
    const parsed = JSON.parse(decoded)
    const payload = {
      ...parsed,
      timestamp: parsed?.timestamp ?? Date.now(),
    }
    await fs.mkdir(path.dirname(LOG_PATH), { recursive: true })
    await fs.appendFile(LOG_PATH, `${JSON.stringify(payload)}\n`, "utf8")
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error ? String(error) : "unknown" }, { status: 500 })
  }
}
