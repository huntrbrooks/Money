import { NextResponse } from "next/server"
import { readSiteConfig } from "@/lib/config"

type ConsentPayload = {
  firstName?: string
  lastName?: string
  fullName?: string
  date?: string
  statement?: string
}

function sanitize(input: string): string {
  return input.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string)).trim()
}

function compileSubject(data: ConsentPayload) {
  const name = data.fullName?.trim() || [data.firstName, data.lastName].filter(Boolean).join(" ").trim() || "Consent Submission"
  return `Consent Form — ${name}`
}

function compileText(data: ConsentPayload) {
  return [
    `New consent form submission`,
    ``,
    `Name: ${[data.firstName, data.lastName].filter(Boolean).join(" ") || "-"}`,
    `Full Name (printed): ${data.fullName || "-"}`,
    `Date: ${data.date || "-"}`,
    ``,
    `Statement:`,
    `${data.statement || "-"}`,
  ].join("\n")
}

function compileHtml(data: ConsentPayload) {
  return `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6; color:#222">
      <h2>New consent form submission</h2>
      <p><strong>Name:</strong> ${sanitize([data.firstName, data.lastName].filter(Boolean).join(" ") || "-")}</p>
      <p><strong>Full Name (printed):</strong> ${sanitize(data.fullName || "-")}</p>
      <p><strong>Date:</strong> ${sanitize(data.date || "-")}</p>
      <p><strong>Statement:</strong></p>
      <pre style="white-space:pre-wrap;background:#f6f8fa;padding:12px;border-radius:8px;border:1px solid #e5e7eb">${sanitize(
        data.statement || "-",
      )}</pre>
    </div>
  `
}

async function sendViaResend(to: string, data: ConsentPayload) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || "Forms <onboarding@resend.dev>"
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
    }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    return { ok: false as const, error: `Resend error: ${detail || res.statusText}` }
  }
  return { ok: true as const }
}

async function sendViaSmtp(to: string, data: ConsentPayload) {
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
  const from = process.env.EMAIL_FROM || `Forms <${user ?? "no-reply@example.com"}>`
  if (!host || !user || !pass) return { ok: false as const, error: "SMTP configuration missing" }

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } })
  await transporter.sendMail({
    from,
    to,
    subject: compileSubject(data),
    text: compileText(data),
    html: compileHtml(data),
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
  const body = (await req.json().catch(() => null)) as ConsentPayload | null
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const firstName = sanitize(String(body.firstName ?? "")).slice(0, 200)
  const lastName = sanitize(String(body.lastName ?? "")).slice(0, 200)
  const fullName = sanitize(String(body.fullName ?? "")).slice(0, 400)
  const date = sanitize(String(body.date ?? "")).slice(0, 40)
  const statement = sanitize(String(body.statement ?? "")).slice(0, 500)

  if (!firstName || !lastName || !fullName || !date || !statement) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  const cfg = await readSiteConfig()
  const requiredStatement = cfg.legal?.consent?.requiredStatement?.trim() || "I have read & I understand the contents of this document"
  if (statement.trim() !== requiredStatement) {
    return NextResponse.json({ error: "Statement does not match required text" }, { status: 400 })
  }
  // dd/mm/yyyy simple validation
  if (!/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date format (dd/mm/yyyy)" }, { status: 400 })
  }

  const toAddress = cfg.contact?.email || process.env.FALLBACK_TO_EMAIL
  if (!toAddress) {
    return NextResponse.json({ error: "No destination email configured" }, { status: 500 })
  }

  const data: ConsentPayload = { firstName, lastName, fullName, date, statement }

  let result: { ok: true } | { ok: false; error: string } = { ok: false, error: "No email provider configured" }
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      result = await sendViaSmtp(toAddress, data)
    } catch (error) {
      result = { ok: false as const, error: resolveErrorMessage(error, "SMTP error") }
    }
  } else if (process.env.RESEND_API_KEY) {
    try {
      result = await sendViaResend(toAddress, data)
    } catch (error) {
      result = { ok: false as const, error: resolveErrorMessage(error, "Resend error") }
    }
  } else {
    // Dev fallback: no provider configured, just log and succeed
    console.log("[consent] Dev mode - email not sent. Payload:", data)
    return NextResponse.json({ ok: true, dev: true })
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}



