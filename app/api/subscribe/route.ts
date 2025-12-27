import { NextResponse } from "next/server"
import { sendLeadToCrm } from "@/lib/crm"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string
    name?: string
    tags?: string[]
  } | null
  if (!body?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 })
  }
  const lead = await sendLeadToCrm({
    type: "newsletter",
    email: body.email,
    name: body.name?.trim(),
    tags: body.tags ?? ["newsletter"],
  })
  if (!lead.ok) {
    return NextResponse.json({ error: lead.error ?? "Unable to subscribe" }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}














