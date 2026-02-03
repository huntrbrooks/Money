import { NextResponse } from "next/server"
import { readSiteConfig } from "@/lib/config"
import { sendLeadToCrm } from "@/lib/crm"
import type { FormField, FormPage, FormSection } from "@/lib/config"

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

function displayValue(field: FormField, rawValue: unknown): string {
  if (field.type === "select") {
    const v = String(rawValue ?? "")
    const match = field.options?.find((o) => o.value === v)
    return match?.label ?? (v || "-")
  }
  if (field.type === "checkbox") {
    return rawValue ? "Yes" : "No"
  }
  if (field.type === "slider") {
    return typeof rawValue === "number" ? String(rawValue) : "-"
  }
  const s = String(rawValue ?? "").trim()
  return s.length ? s : "-"
}

function compileTextFromSchema(page: FormPage, values: Record<string, unknown>, sender: EnquiryPayload): string {
  const lines: string[] = []
  lines.push(`New website enquiry`)
  lines.push("")
  lines.push("Sender")
  lines.push("------")
  lines.push(`Name: ${[sender.firstName, sender.lastName].filter(Boolean).join(" ") || "-"}`)
  lines.push(`Email: ${sender.email || "-"}`)
  lines.push(`Phone: ${sender.phone || "-"}`)
  lines.push("")
  for (const section of page.sections) {
    if (section.title) {
      lines.push(section.title)
      lines.push("-".repeat(Math.min(40, section.title.length)))
    }
    for (const field of section.fields) {
      lines.push(`${field.label}: ${displayValue(field, values[field.name])}`)
    }
    lines.push("")
  }
  return lines.join("\n").trim()
}

function compileHtmlFromSchema(page: FormPage, values: Record<string, unknown>, sender: EnquiryPayload): string {
  const esc = (v: string) => sanitize(v)
  const rows = (section: FormSection) =>
    section.fields
      .map((field) => {
        const v = displayValue(field, values[field.name])
        return `<tr><td style="padding:6px 10px;border:1px solid #e5e7eb;vertical-align:top"><strong>${esc(
          field.label,
        )}</strong></td><td style="padding:6px 10px;border:1px solid #e5e7eb;vertical-align:top">${esc(v)}</td></tr>`
      })
      .join("")

  return `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6; color:#222">
      <h2>New website enquiry</h2>
      <h3 style="margin-top:18px">Sender</h3>
      <p><strong>Name:</strong> ${esc([sender.firstName, sender.lastName].filter(Boolean).join(" ") || "-")}</p>
      <p><strong>Email:</strong> ${esc(sender.email || "-")}</p>
      <p><strong>Phone:</strong> ${esc(sender.phone || "-")}</p>
      ${page.sections
        .map((section) => {
          const title = section.title ? `<h3 style="margin-top:18px">${esc(section.title)}</h3>` : ""
          return `${title}<table style="border-collapse:collapse;width:100%">${rows(section)}</table>`
        })
        .join("")}
    </div>
  `
}

function compileSubject(data: EnquiryPayload) {
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ").trim() || "New Enquiry"
  return `New Enquiry — ${name}`
}

function compileAdminNoticeSubject(data: EnquiryPayload) {
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ").trim() || "New Enquiry"
  return `Enquiry received — ${name}`
}

function compileAdminNoticeText(data: EnquiryPayload, recipient: string) {
  return [
    "A new enquiry has been submitted.",
    "",
    `Name: ${[data.firstName, data.lastName].filter(Boolean).join(" ") || "-"}`,
    `Email: ${data.email || "-"}`,
    `Phone: ${data.phone || "-"}`,
    "",
    `Full submission delivered to ${recipient}.`,
  ].join("\n")
}

function compileAdminNoticeHtml(data: EnquiryPayload, recipient: string) {
  return `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6; color:#222">
      <p>A new enquiry has been submitted.</p>
      <p><strong>Name:</strong> ${sanitize([data.firstName, data.lastName].filter(Boolean).join(" ") || "-")}</p>
      <p><strong>Email:</strong> ${sanitize(data.email || "-")}</p>
      <p><strong>Phone:</strong> ${sanitize(data.phone || "-")}</p>
      <p>Full submission delivered to <strong>${sanitize(recipient)}</strong>.</p>
    </div>
  `
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

function compileConfirmationSubject() {
  return "Thanks for your enquiry"
}

function confirmationGreeting(firstName?: string) {
  const name = String(firstName ?? "").trim()
  return `Hi ${name || "there"},`
}

function compileConfirmationText(firstName?: string) {
  return [
    confirmationGreeting(firstName),
    "",
    "Thanks for getting in touch. This is a quick note to confirm I have received your enquiry.",
    "",
    "I personally review each message and will get back to you as soon as possible.",
    "",
    "In the meantime, take care of yourself, and thank you for reaching out.",
    "",
    "Kind regards,",
    "Dan",
  ].join("\n")
}

function compileConfirmationHtml(firstName?: string) {
  return `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6; color:#222">
      <p>${sanitize(confirmationGreeting(firstName))}</p>
      <p>Thanks for getting in touch. This is a quick note to confirm I have received your enquiry.</p>
      <p>I personally review each message and will get back to you as soon as possible.</p>
      <p>In the meantime, take care of yourself, and thank you for reaching out.</p>
      <p>Kind regards,<br />Dan</p>
    </div>
  `
}

async function sendViaResend(
  to: string,
  replyTo: string | undefined,
  subject: string,
  text: string,
  html: string,
  fromOverride?: string,
) {
  const apiKey = process.env.RESEND_API_KEY
  const from = fromOverride || process.env.EMAIL_FROM || "Enquiries <onboarding@resend.dev>"
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
      subject,
      text,
      html,
      reply_to: replyTo ? [replyTo] : undefined,
    }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    return { ok: false as const, error: `Resend error: ${detail || res.statusText}` }
  }
  return { ok: true as const }
}

function resolveErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}

export async function POST(req: Request) {
  const url = new URL(req.url)
  const dryRun = url.searchParams.get("dryRun") === "true"
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

  const formRecipient = cfg.contact?.email || "dan@financialtraumatherapist.com.au"
  const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || "danlobel@icloud.com"
  const fromDan = `Dan <${formRecipient}>`
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

  const subject = compileSubject(data)
  const text = page ? compileTextFromSchema(page, extracted, data) : compileText(data)
  const html = page ? compileHtmlFromSchema(page, extracted, data) : compileHtml(data)
  const adminSubject = compileAdminNoticeSubject(data)
  const adminText = compileAdminNoticeText(data, formRecipient)
  const adminHtml = compileAdminNoticeHtml(data, formRecipient)
  const confirmationSubject = compileConfirmationSubject()
  const confirmationText = compileConfirmationText(firstName)
  const confirmationHtml = compileConfirmationHtml(firstName)

  if (dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      deliveries: {
        form: {
          to: formRecipient,
          from: fromDan,
          replyTo: email,
          subject,
          text,
          html,
        },
        admin: {
          to: adminRecipient,
          from: fromDan,
          replyTo: email,
          subject: adminSubject,
          text: adminText,
          html: adminHtml,
        },
        confirmation: {
          to: email,
          from: fromDan,
          replyTo: formRecipient,
          subject: confirmationSubject,
          text: confirmationText,
          html: confirmationHtml,
        },
      },
    })
  }

  // Force Resend for all deliveries
  let result:
    | { ok: true }
    | { ok: false; error: string } = { ok: false, error: "No email provider configured" }
  if (process.env.RESEND_API_KEY && formRecipient) {
    try {
      result = await sendViaResend(formRecipient, email, subject, text, html, fromDan)
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

  if (adminRecipient) {
    try {
      if (process.env.RESEND_API_KEY) {
        await sendViaResend(adminRecipient, email, adminSubject, adminText, adminHtml, fromDan)
      }
    } catch (error) {
      console.warn("[enquiry] admin notification failed", error)
    }
  }

  if (email) {
    const confirmationFrom = fromDan
    try {
      if (process.env.RESEND_API_KEY) {
        await sendViaResend(email, formRecipient, confirmationSubject, confirmationText, confirmationHtml, confirmationFrom)
      }
    } catch (error) {
      console.warn("[enquiry] confirmation email failed", error)
    }
  }

  void sendLeadToCrm({
    type: "enquiry",
    email,
    name: [firstName, lastName].filter(Boolean).join(" "),
    phone,
    tags: ["website-enquiry"],
    payload: {
      supportFocus: data.supportFocus,
      preferredFormat: data.preferredFormat,
      updatesOptIn: data.updatesOptIn,
    },
  })
  return NextResponse.json({ ok: true })
}


