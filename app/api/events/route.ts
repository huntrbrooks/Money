import { NextResponse } from "next/server"

type EventPayload = {
  event?: string
  detail?: Record<string, unknown>
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as EventPayload | null
  if (!body?.event) {
    return NextResponse.json({ error: "Event name required" }, { status: 400 })
  }
  console.log("[analytics]", body.event, body.detail ?? {})
  return NextResponse.json({ ok: true })
}

