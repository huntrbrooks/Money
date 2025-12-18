import { NextResponse } from "next/server"
import { readSiteConfig } from "@/lib/config"

type EnquiryPayload = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  message?: string
}

function sanitize(input: string): string {
  return input.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string)).trim()
}

function compileSubject(data: EnquiryPayload) {
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ").trim() || "New Enquiry"
  return `New Enquiry — ${name}`
}

function compileText(data: EnquiryPayload) {
  return [
    `New website enquiry`,
    ``,
    `Name: ${[data.firstName, data.lastName].filter(Boolean).join(" ") || "-"}`,
    `Email: ${data.email || "-"}`,
    `Phone: ${data.phone || "-"}`,
    ``,
    `Message:`,
    `${data.message || "-"}`,
  ].join("\n")
}

function compileHtml(data: EnquiryPayload) {
  return `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6; color:#222">
      <h2>New website enquiry</h2>
      <p><strong>Name:</strong> ${sanitize([data.firstName, data.lastName].filter(Boolean).join(" ") || "-")}</p>
      <p><strong>Email:</strong> ${sanitize(data.email || "-")}</p>
      <p><strong>Phone:</strong> ${sanitize(data.phone || "-")}</p>
      <p><strong>Message:</strong></p>
      <pre style="white-space:pre-wrap;background:#f6f8fa;padding:12px;border-radius:8px;border:1px solid #e5e7eb">${sanitize(
        data.message || "-",
      )}</pre>
    </div>
  `
}

async function sendViaResend(to: string, replyTo: string | undefined, data: EnquiryPayload) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || "Enquiries <onboarding@resend.dev>"
  if (!apiKey) return { ok: false as const, error: "RESEND_API_KEY not set" }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: compileSubject(data),
      text: compileText(data),
      html: compileHtml(data),
      reply_to: replyTo ? [replyTo] : undefined,
    }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    return { ok: false as const, error: `Resend error: ${detail || res.statusText}` }
  }
  return { ok: true as const }
}

async function sendViaSmtp(to: string, replyTo: string | undefined, data: EnquiryPayload) {
  // Only import when needed to avoid build-time dependency
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const nodemailer = await import("nodemailer").catch(() => null)
  if (!nodemailer) return { ok: false as const, error: "nodemailer not installed" }

  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const secure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true"
  const from = process.env.EMAIL_FROM || `Enquiries <${user ?? "no-reply@example.com"}>`
  if (!host || !user || !pass) return { ok: false as const, error: "SMTP configuration missing" }

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } })
  await transporter.sendMail({
    from,
    to,
    subject: compileSubject(data),
    text: compileText(data),
    html: compileHtml(data),
    replyTo: replyTo,
  })
  return { ok: true as const }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as EnquiryPayload | null
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const firstName = sanitize(String(body.firstName ?? "")).slice(0, 200)
  const lastName = sanitize(String(body.lastName ?? "")).slice(0, 200)
  const email = sanitize(String(body.email ?? "")).slice(0, 300)
  const phone = sanitize(String(body.phone ?? "")).slice(0, 60)
  const message = sanitize(String(body.message ?? "")).slice(0, 8000)

  if (!firstName || !email || !phone || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  const cfg = await readSiteConfig()
  const toAddress = cfg.contact?.email || process.env.FALLBACK_TO_EMAIL

  const data: EnquiryPayload = { firstName, lastName, email, phone, message }

  // Try SMTP first if configured, otherwise fall back to Resend
  let result:
    | { ok: true }
    | { ok: false; error: string } = { ok: false, error: "No email provider configured" }
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && toAddress) {
    result = await sendViaSmtp(toAddress, email, data).catch((e: any) => ({ ok: false as const, error: e?.message || "SMTP error" }))
  } else if (process.env.RESEND_API_KEY && toAddress) {
    result = await sendViaResend(toAddress, email, data).catch((e: any) => ({ ok: false as const, error: e?.message || "Resend error" }))
  } else {
    // Dev fallback: no provider configured, just log and succeed
    console.log("[enquiry] Dev mode - email not sent. Payload:", data)
    return NextResponse.json({ ok: true, dev: true })
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}


