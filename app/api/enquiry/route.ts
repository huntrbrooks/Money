import { NextResponse } from "next/server"
import { readSiteConfig } from "@/lib/config"
import { sendLeadToCrm } from "@/lib/crm"
import type { FormField, FormPage } from "@/lib/config"

type EnquiryPayload = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  message?: string
  supportFocus?: string
  preferredFormat?: string
  updatesOptIn?: boolean
}

function sanitize(input: string): string {
  return input.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string)).trim()
}

function flattenFields(page?: FormPage | null): FormField[] {
  if (!page?.sections) return []
  const out: FormField[] = []
  for (const s of page.sections) {
    for (const f of s.fields) out.push(f)
  }
  return out
}

function coerceFieldValue(field: FormField, raw: unknown): string | number | boolean {
  if (field.type === "checkbox") return Boolean(raw)
  if (field.type === "slider") return typeof raw === "number" ? raw : Number(raw)
  return sanitize(String(raw ?? ""))
}

function isRequired(field: FormField): boolean {
  if (field.type === "checkbox" && field.mustBeTrue) return true
  return Boolean((field as { required?: boolean }).required)
}

function isFilled(field: FormField, value: unknown): boolean {
  if (field.type === "checkbox") return field.mustBeTrue ? value === true : typeof value === "boolean"
  if (field.type === "slider") return typeof value === "number" && !Number.isNaN(value)
  return String(value ?? "").trim().length > 0
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
    `Preferred format: ${data.preferredFormat || "-"}`,
    ``,
    `Focus: ${data.supportFocus || "-"}`,
    ``,
    `Message:`,
    `${data.message || "-"}`,
    ``,
    `Updates opt-in: ${data.updatesOptIn ? "yes" : "no"}`,
  ].join("\n")
}

function compileHtml(data: EnquiryPayload) {
  return `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6; color:#222">
      <h2>New website enquiry</h2>
      <p><strong>Name:</strong> ${sanitize([data.firstName, data.lastName].filter(Boolean).join(" ") || "-")}</p>
      <p><strong>Email:</strong> ${sanitize(data.email || "-")}</p>
      <p><strong>Phone:</strong> ${sanitize(data.phone || "-")}</p>
      <p><strong>Preferred Format:</strong> ${sanitize(data.preferredFormat || "-")}</p>
      <p><strong>Focus:</strong> ${sanitize(data.supportFocus || "-")}</p>
      <p><strong>Message:</strong></p>
      <pre style="white-space:pre-wrap;background:#f6f8fa;padding:12px;border-radius:8px;border:1px solid #e5e7eb">${sanitize(
        data.message || "-",
      )}</pre>
      <p><strong>Updates opt-in:</strong> ${data.updatesOptIn ? "Yes" : "No"}</p>
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

function resolveErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const cfg = await readSiteConfig()
  const page = cfg.formPages?.enquiry
  const fields = flattenFields(page)

  // Schema-driven extraction (allows Admin to add/remove/reorder fields safely)
  const extracted: Record<string, string | number | boolean> = {}
  for (const f of fields) {
    const v = coerceFieldValue(f, body[f.name])
    // Bound strings for safety
    if (typeof v === "string") {
      extracted[f.name] = v.slice(0, 8000)
    } else {
      extracted[f.name] = v
    }
  }

  // Minimal fallback if config is missing
  const firstName = sanitize(String(extracted.firstName ?? body.firstName ?? "")).slice(0, 200)
  const lastName = sanitize(String(extracted.lastName ?? body.lastName ?? "")).slice(0, 200)
  const email = sanitize(String(extracted.email ?? body.email ?? "")).slice(0, 300)
  const phone = sanitize(String(extracted.phone ?? body.phone ?? "")).slice(0, 60)
  const message = sanitize(String(extracted.message ?? body.message ?? "")).slice(0, 8000)

  const required = fields.length ? fields.filter(isRequired) : []
  for (const f of required) {
    if (!isFilled(f, extracted[f.name])) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
  }
  if (!firstName || !email || !phone || !message) {
    // extra guard (legacy behavior)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }
  // checkbox mustBeTrue support
  const mustBeTrue = fields.filter((f) => f.type === "checkbox" && f.mustBeTrue)
  for (const f of mustBeTrue) {
    if (extracted[f.name] !== true) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
  }

  const toAddress = cfg.contact?.email || process.env.FALLBACK_TO_EMAIL
  const data: EnquiryPayload = {
    firstName,
    lastName,
    email,
    phone,
    message,
    supportFocus: sanitize(String(extracted.supportFocus ?? body.supportFocus ?? "")).slice(0, 800),
    preferredFormat: sanitize(String(extracted.preferredFormat ?? body.preferredFormat ?? "")).slice(0, 120),
    updatesOptIn: Boolean(extracted.updatesOptIn ?? body.updatesOptIn),
  }

  // Try SMTP first if configured, otherwise fall back to Resend
  let result:
    | { ok: true }
    | { ok: false; error: string } = { ok: false, error: "No email provider configured" }
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && toAddress) {
    try {
      result = await sendViaSmtp(toAddress, email, data)
    } catch (error) {
      result = { ok: false as const, error: resolveErrorMessage(error, "SMTP error") }
    }
  } else if (process.env.RESEND_API_KEY && toAddress) {
    try {
      result = await sendViaResend(toAddress, email, data)
    } catch (error) {
      result = { ok: false as const, error: resolveErrorMessage(error, "Resend error") }
    }
  } else {
    // Dev fallback: no provider configured, just log and succeed
    console.log("[enquiry] Dev mode - email not sent. Payload:", data)
    return NextResponse.json({ ok: true, dev: true })
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }
  void sendLeadToCrm({
    type: "enquiry",
    email,
    name: [firstName, lastName].filter(Boolean).join(" "),
    phone,
    tags: ["website-enquiry"],
    payload: { supportFocus, preferredFormat, updatesOptIn },
  })
  return NextResponse.json({ ok: true })
}


