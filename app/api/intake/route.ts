import { NextResponse } from "next/server"
import { readSiteConfig } from "@/lib/config"
import { sendLeadToCrm } from "@/lib/crm"
import type { FormField, FormPage, FormSection } from "@/lib/config"

type IntakePayload = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  country?: string
  address1?: string
  address2?: string
  suburb?: string
  state?: string
  postcode?: string
  date?: string
  occupation?: string
  relationshipStatus?: string
  haveChildren?: string
  generalHealth?: number
  seenCounsellor?: string
  onMedication?: string
  medicationDetails?: string
  experiencingDepression?: string
  suicidalThoughts?: string
  otherInformation?: string
  familyMentalHealthHistory?: string
  sleepingHabits?: number
  physicalHealth?: number
  exerciseFrequency?: string
  mainReason?: string
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
  if (field.type === "slider") {
    const n = typeof raw === "number" ? raw : Number(raw)
    if (Number.isFinite(n)) {
      return Math.max(field.min, Math.min(field.max, n))
    }
    return field.defaultValue ?? field.min
  }
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

function compileTextFromSchema(page: FormPage, values: Record<string, unknown>): string {
  const lines: string[] = []
  lines.push(`New intake form submission`)
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

function compileHtmlFromSchema(page: FormPage, values: Record<string, unknown>): string {
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
      <h2>New intake form submission</h2>
      ${page.sections
        .map((section) => {
          const title = section.title ? `<h3 style="margin-top:18px">${esc(section.title)}</h3>` : ""
          return `${title}<table style="border-collapse:collapse;width:100%">${rows(section)}</table>`
        })
        .join("")}
    </div>
  `
}

function labelForRelationship(v?: string) {
  const map: Record<string, string> = {
    single: "Single",
    relationship: "In a relationship",
    married: "Married",
    separated: "Separated",
    divorced: "Divorced",
    widowed: "Widowed",
    prefer_not: "Prefer not to say",
  }
  return (v && map[v]) || (v ?? "-")
}

function labelYesNo(v?: string) {
  if (!v) return "-"
  if (v === "yes") return "Yes"
  if (v === "no") return "No"
  if (v === "unsure") return "Unsure"
  if (v === "prefer_not") return "Prefer not to say"
  return v
}

function labelExercise(v?: string) {
  const map: Record<string, string> = {
    none: "None",
    "1-2_per_week": "1–2 times per week",
    "3-4_per_week": "3–4 times per week",
    "5+_per_week": "5+ times per week",
  }
  return (v && map[v]) || (v ?? "-")
}

function compileSubject(data: IntakePayload) {
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ").trim() || "New Intake"
  return `New Intake Form — ${name}`
}

function compileText(data: IntakePayload) {
  const address = [
    data.address1 || "",
    data.address2 || "",
    [data.suburb, data.state, data.postcode].filter(Boolean).join(" "),
    data.country || "",
  ]
    .filter(Boolean)
    .join("\n        ")

  return [
    `New intake form submission`,
    ``,
    `Name: ${[data.firstName, data.lastName].filter(Boolean).join(" ") || "-"}`,
    `Email: ${data.email || "-"}`,
    `Phone: ${data.phone || "-"}`,
    ``,
    `Address:`,
    `        ${address || "-"}`,
    ``,
    `Date: ${data.date || "-"}`,
    `Occupation: ${data.occupation || "-"}`,
    `Relationship status: ${labelForRelationship(data.relationshipStatus)}`,
    `Have children: ${labelYesNo(data.haveChildren)}`,
    ``,
    `General health (1–5): ${String(data.generalHealth ?? "-")}`,
    `Seen counsellor/psychologist before: ${labelYesNo(data.seenCounsellor)}`,
    `On medication from any previous issue: ${labelYesNo(data.onMedication)}`,
    `Medication details: ${data.medicationDetails || "-"}`,
    `Overwhelming sadness, grief or depression: ${labelYesNo(data.experiencingDepression)}`,
    `Suicidal thoughts ever: ${labelYesNo(data.suicidalThoughts)}`,
    `Family mental health history: ${labelYesNo(data.familyMentalHealthHistory)}`,
    `Sleeping habits (1–5): ${String(data.sleepingHabits ?? "-")}`,
    `Physical health (1–5): ${String(data.physicalHealth ?? "-")}`,
    `Exercise frequency: ${labelExercise(data.exerciseFrequency)}`,
    ``,
    `Main reason(s) seeking therapy:`,
    `${data.mainReason || "-"}`,
    ``,
    `Other important information:`,
    `${data.otherInformation || "-"}`,
  ].join("\n")
}

function compileHtml(data: IntakePayload) {
  const sanitizeOrDash = (v?: string) => sanitize(String(v ?? "-"))
  const addressHtml =
    [
      sanitizeOrDash(data.address1 || ""),
      sanitizeOrDash(data.address2 || ""),
      sanitizeOrDash([data.suburb, data.state, data.postcode].filter(Boolean).join(" ")),
      sanitizeOrDash(data.country || ""),
    ]
      .filter((x) => x && x !== "-")
      .join("<br />") || "-"

  const pre = (v?: string) =>
    `<pre style="white-space:pre-wrap;background:#f6f8fa;padding:12px;border-radius:8px;border:1px solid #e5e7eb">${sanitizeOrDash(
      v || "-",
    )}</pre>`

  return `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6; color:#222">
      <h2>New intake form submission</h2>
      <p><strong>Name:</strong> ${sanitizeOrDash([data.firstName, data.lastName].filter(Boolean).join(" ") || "-")}</p>
      <p><strong>Email:</strong> ${sanitizeOrDash(data.email)}</p>
      <p><strong>Phone:</strong> ${sanitizeOrDash(data.phone)}</p>
      <p><strong>Address:</strong><br />${addressHtml}</p>
      <p><strong>Date:</strong> ${sanitizeOrDash(data.date)}</p>
      <p><strong>Occupation:</strong> ${sanitizeOrDash(data.occupation)}</p>
      <p><strong>Relationship status:</strong> ${sanitizeOrDash(labelForRelationship(data.relationshipStatus))}</p>
      <p><strong>Have children:</strong> ${sanitizeOrDash(labelYesNo(data.haveChildren))}</p>
      <p><strong>General health (1–5):</strong> ${sanitizeOrDash(String(data.generalHealth ?? "-"))}</p>
      <p><strong>Seen counsellor/psychologist before:</strong> ${sanitizeOrDash(labelYesNo(data.seenCounsellor))}</p>
      <p><strong>On medication from any previous issue:</strong> ${sanitizeOrDash(labelYesNo(data.onMedication))}</p>
      <p><strong>Medication details:</strong> ${sanitizeOrDash(data.medicationDetails)}</p>
      <p><strong>Overwhelming sadness, grief or depression:</strong> ${sanitizeOrDash(labelYesNo(data.experiencingDepression))}</p>
      <p><strong>Suicidal thoughts ever:</strong> ${sanitizeOrDash(labelYesNo(data.suicidalThoughts))}</p>
      <p><strong>Family mental health history:</strong> ${sanitizeOrDash(labelYesNo(data.familyMentalHealthHistory))}</p>
      <p><strong>Sleeping habits (1–5):</strong> ${sanitizeOrDash(String(data.sleepingHabits ?? "-"))}</p>
      <p><strong>Physical health (1–5):</strong> ${sanitizeOrDash(String(data.physicalHealth ?? "-"))}</p>
      <p><strong>Exercise frequency:</strong> ${sanitizeOrDash(labelExercise(data.exerciseFrequency))}</p>
      <p><strong>Main reason(s) seeking therapy:</strong></p>
      ${pre(data.mainReason)}
      <p><strong>Other important information:</strong></p>
      ${pre(data.otherInformation)}
    </div>
  `
}

function compileAdminNoticeSubject(data: IntakePayload) {
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ").trim() || "New Intake"
  return `Intake received — ${name}`
}

function compileAdminNoticeText(data: IntakePayload, recipient: string) {
  return [
    "A new intake form has been submitted.",
    "",
    `Name: ${[data.firstName, data.lastName].filter(Boolean).join(" ") || "-"}`,
    `Email: ${data.email || "-"}`,
    `Phone: ${data.phone || "-"}`,
    "",
    `Full submission delivered to ${recipient}.`,
  ].join("\n")
}

function compileAdminNoticeHtml(data: IntakePayload, recipient: string) {
  return `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6; color:#222">
      <p>A new intake form has been submitted.</p>
      <p><strong>Name:</strong> ${sanitize([data.firstName, data.lastName].filter(Boolean).join(" ") || "-")}</p>
      <p><strong>Email:</strong> ${sanitize(data.email || "-")}</p>
      <p><strong>Phone:</strong> ${sanitize(data.phone || "-")}</p>
      <p>Full submission delivered to <strong>${sanitize(recipient)}</strong>.</p>
    </div>
  `
}

function compileConfirmationSubject() {
  return "Your intake form has been received"
}

function confirmationGreeting(firstName?: string) {
  const name = String(firstName ?? "").trim()
  return `Hi ${name || "there"},`
}

function compileConfirmationText(firstName?: string) {
  return [
    confirmationGreeting(firstName),
    "",
    "I'm writing to confirm that your intake form has been submitted successfully. Thank you for taking the time to complete it.",
    "",
    "I'll review the information you've shared carefully. Everything you've provided is treated with respect and confidentiality.",
    "",
    "If there are any next steps or clarifications needed, I'll be in touch. Otherwise, I'll speak with you soon as planned.",
    "",
    "Thank you again for your openness and trust.",
    "",
    "Warm regards,",
    "Dan",
  ].join("\n")
}

function compileConfirmationHtml(firstName?: string) {
  return `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6; color:#222">
      <p>${sanitize(confirmationGreeting(firstName))}</p>
      <p>I'm writing to confirm that your intake form has been submitted successfully. Thank you for taking the time to complete it.</p>
      <p>I'll review the information you've shared carefully. Everything you've provided is treated with respect and confidentiality.</p>
      <p>If there are any next steps or clarifications needed, I'll be in touch. Otherwise, I'll speak with you soon as planned.</p>
      <p>Thank you again for your openness and trust.</p>
      <p>Warm regards,<br />Dan</p>
    </div>
  `
}

async function sendResendEmail(
  to: string,
  replyTo: string | undefined,
  subject: string,
  text: string,
  html: string,
  fromOverride?: string,
) {
  const apiKey = process.env.RESEND_API_KEY
  const from = fromOverride || process.env.EMAIL_FROM || "Intake <onboarding@resend.dev>"
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

async function sendSmtpEmail(
  to: string,
  replyTo: string | undefined,
  subject: string,
  text: string,
  html: string,
  fromOverride?: string,
) {
  // Only import when needed
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const nodemailer = await import("nodemailer").catch(() => null)
  if (!nodemailer) return { ok: false as const, error: "nodemailer not installed" }

  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const secure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true"
  const from = fromOverride || process.env.EMAIL_FROM || `Intake <${user ?? "no-reply@example.com"}>`
  if (!host || !user || !pass) return { ok: false as const, error: "SMTP configuration missing" }

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } })
  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
    replyTo: replyTo,
  })
  return { ok: true as const }
}

async function sendViaResend(to: string, replyTo: string | undefined, data: IntakePayload, fromOverride?: string) {
  const apiKey = process.env.RESEND_API_KEY
  const from = fromOverride || process.env.EMAIL_FROM || "Intake <onboarding@resend.dev>"
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

async function sendViaSmtp(to: string, replyTo: string | undefined, data: IntakePayload, fromOverride?: string) {
  // Only import when needed
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const nodemailer = await import("nodemailer").catch(() => null)
  if (!nodemailer) return { ok: false as const, error: "nodemailer not installed" }

  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const secure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true"
  const from = fromOverride || process.env.EMAIL_FROM || `Intake <${user ?? "no-reply@example.com"}>`
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
  const url = new URL(req.url)
  const dryRun = url.searchParams.get("dryRun") === "true"
  const raw = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!raw) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const cfg = await readSiteConfig()
  const page = cfg.formPages?.intake

  // Schema-driven mode (Admin can edit the form and the backend will adapt).
  if (page) {
    const fields = flattenFields(page)
    const values: Record<string, unknown> = {}
    for (const f of fields) {
      const v = coerceFieldValue(f, raw[f.name])
      values[f.name] = v
    }

    for (const f of fields.filter(isRequired)) {
      if (!isFilled(f, values[f.name])) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }
    }

    const email = sanitize(String(values.email ?? "")).slice(0, 300)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }
    const date = sanitize(String(values.date ?? "")).slice(0, 40)
    if (date && !/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/.test(date)) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 })
    }

    const formRecipient = cfg.contact?.email || "dan@financialtraumatherapist.com.au"
    const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || "danlobel@icloud.com"
    const fromDan = `Dan <${formRecipient}>`

    const firstName = sanitize(String(values.firstName ?? "")).slice(0, 200)
    const lastName = sanitize(String(values.lastName ?? "")).slice(0, 200)
    const name = [firstName, lastName].filter(Boolean).join(" ").trim() || "New Intake"
    const subject = `New Intake Form — ${name}`
    const text = compileTextFromSchema(page, values)
    const html = compileHtmlFromSchema(page, values)

    const adminSubject = compileAdminNoticeSubject({ firstName, lastName, email, phone: typeof values.phone === "string" ? values.phone : undefined })
    const adminText = compileAdminNoticeText({ firstName, lastName, email, phone: typeof values.phone === "string" ? values.phone : undefined }, formRecipient)
    const adminHtml = compileAdminNoticeHtml({ firstName, lastName, email, phone: typeof values.phone === "string" ? values.phone : undefined }, formRecipient)
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
            replyTo: email || undefined,
            subject,
            text,
            html,
          },
          admin: {
            to: adminRecipient,
            from: fromDan,
            replyTo: email || undefined,
            subject: adminSubject,
            text: adminText,
            html: adminHtml,
          },
          confirmation: {
            to: email || undefined,
            from: fromDan,
            replyTo: formRecipient,
            subject: confirmationSubject,
            text: confirmationText,
            html: confirmationHtml,
          },
        },
      })
    }

    // Try SMTP first if configured, otherwise fall back to Resend, otherwise log in dev
    let result: { ok: true } | { ok: false; error: string } = { ok: false, error: "No email provider configured" }
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && formRecipient) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const nodemailer = await import("nodemailer").catch(() => null)
        if (!nodemailer) return NextResponse.json({ error: "nodemailer not installed" }, { status: 500 })
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
          secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true",
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        })
        await transporter.sendMail({
          from: fromDan,
          to: formRecipient,
          subject,
          text,
          html,
          replyTo: email || undefined,
        })
        result = { ok: true as const }
      } catch (error) {
        result = { ok: false as const, error: resolveErrorMessage(error, "SMTP error") }
      }
    } else if (process.env.RESEND_API_KEY && formRecipient) {
      try {
        const apiKey = process.env.RESEND_API_KEY
        const from = fromDan
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from,
            to: [formRecipient],
            subject,
            text,
            html,
            reply_to: email ? [email] : undefined,
          }),
        })
        if (!res.ok) {
          const detail = await res.text().catch(() => "")
          result = { ok: false as const, error: `Resend error: ${detail || res.statusText}` }
        } else {
          result = { ok: true as const }
        }
      } catch (error) {
        result = { ok: false as const, error: resolveErrorMessage(error, "Resend error") }
      }
    } else {
      console.log("[intake] Dev mode - email not sent. Payload:", values)
      return NextResponse.json({ ok: true, dev: true })
    }

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    if (adminRecipient) {
      try {
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
          await sendSmtpEmail(adminRecipient, email || undefined, adminSubject, adminText, adminHtml, fromDan)
        } else if (process.env.RESEND_API_KEY) {
          await sendResendEmail(adminRecipient, email || undefined, adminSubject, adminText, adminHtml, fromDan)
        }
      } catch (error) {
        console.warn("[intake] admin notification failed", error)
      }
    }

    if (email) {
      const confirmationFrom = fromDan
      try {
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
          await sendSmtpEmail(email, formRecipient, confirmationSubject, confirmationText, confirmationHtml, confirmationFrom)
        } else if (process.env.RESEND_API_KEY) {
          await sendResendEmail(email, formRecipient, confirmationSubject, confirmationText, confirmationHtml, confirmationFrom)
        }
      } catch (error) {
        console.warn("[intake] confirmation email failed", error)
      }
    }

    void sendLeadToCrm({
      type: "intake",
      email: email || undefined,
      name,
      phone: typeof values.phone === "string" ? values.phone : undefined,
      tags: ["intake"],
      payload: values,
    })
    return NextResponse.json({ ok: true })
  }

  // Sanitize and bound
  const rawLegacy = raw as IntakePayload
  const s = (v?: string, max = 200) => sanitize(String(v ?? "")).slice(0, max)
  const sn = (v?: number) => (typeof v === "number" ? Math.max(1, Math.min(5, v)) : undefined)

  const data: IntakePayload = {
    firstName: s(rawLegacy.firstName),
    lastName: s(rawLegacy.lastName),
    email: s(rawLegacy.email, 300),
    phone: s(rawLegacy.phone, 60),
    country: s(rawLegacy.country, 80),
    address1: s(rawLegacy.address1, 300),
    address2: s(rawLegacy.address2, 300),
    suburb: s(rawLegacy.suburb, 120),
    state: s(rawLegacy.state, 50),
    postcode: s(rawLegacy.postcode, 20),
    date: s(rawLegacy.date, 20),
    occupation: s(rawLegacy.occupation, 200),
    relationshipStatus: s(rawLegacy.relationshipStatus, 40),
    haveChildren: s(rawLegacy.haveChildren, 40),
    generalHealth: sn(rawLegacy.generalHealth),
    seenCounsellor: s(rawLegacy.seenCounsellor, 10),
    onMedication: s(rawLegacy.onMedication, 10),
    medicationDetails: s(rawLegacy.medicationDetails, 2000),
    experiencingDepression: s(rawLegacy.experiencingDepression, 10),
    suicidalThoughts: s(rawLegacy.suicidalThoughts, 10),
    otherInformation: s(rawLegacy.otherInformation, 8000),
    familyMentalHealthHistory: s(rawLegacy.familyMentalHealthHistory, 20),
    sleepingHabits: sn(rawLegacy.sleepingHabits),
    physicalHealth: sn(rawLegacy.physicalHealth),
    exerciseFrequency: s(rawLegacy.exerciseFrequency, 30),
    mainReason: s(rawLegacy.mainReason, 8000),
  }

  // Validate required
  if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.country || !data.address1 || !data.suburb || !data.state || !data.postcode || !data.date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }
  // Light date format check (dd/mm/yyyy)
  if (!/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/.test(data.date)) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 })
  }

  const formRecipient = cfg.contact?.email || "dan@financialtraumatherapist.com.au"
  const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || "danlobel@icloud.com"
  const fromDan = `Dan <${formRecipient}>`
  const adminSubject = compileAdminNoticeSubject(data)
  const adminText = compileAdminNoticeText(data, formRecipient)
  const adminHtml = compileAdminNoticeHtml(data, formRecipient)
  const confirmationSubject = compileConfirmationSubject()
  const confirmationText = compileConfirmationText(data.firstName)
  const confirmationHtml = compileConfirmationHtml(data.firstName)

  if (dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      deliveries: {
        form: {
          to: formRecipient,
          from: fromDan,
          replyTo: data.email,
          subject: compileSubject(data),
          text: compileText(data),
          html: compileHtml(data),
        },
        admin: {
          to: adminRecipient,
          from: fromDan,
          replyTo: data.email,
          subject: adminSubject,
          text: adminText,
          html: adminHtml,
        },
        confirmation: {
          to: data.email,
          from: fromDan,
          replyTo: formRecipient,
          subject: confirmationSubject,
          text: confirmationText,
          html: confirmationHtml,
        },
      },
    })
  }

  // Try SMTP first if configured, otherwise fall back to Resend, otherwise log in dev
  let result: { ok: true } | { ok: false; error: string } = { ok: false, error: "No email provider configured" }
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && formRecipient) {
    try {
      result = await sendViaSmtp(formRecipient, data.email, data, fromDan)
    } catch (error) {
      result = { ok: false as const, error: resolveErrorMessage(error, "SMTP error") }
    }
  } else if (process.env.RESEND_API_KEY && formRecipient) {
    try {
      result = await sendViaResend(formRecipient, data.email, data, fromDan)
    } catch (error) {
      result = { ok: false as const, error: resolveErrorMessage(error, "Resend error") }
    }
  } else {
    console.log("[intake] Dev mode - email not sent. Payload:", data)
    return NextResponse.json({ ok: true, dev: true })
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

    if (adminRecipient) {
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
          await sendSmtpEmail(adminRecipient, data.email, adminSubject, adminText, adminHtml, fromDan)
      } else if (process.env.RESEND_API_KEY) {
          await sendResendEmail(adminRecipient, data.email, adminSubject, adminText, adminHtml, fromDan)
      }
    } catch (error) {
      console.warn("[intake] admin notification failed", error)
    }
  }

  if (data.email) {
    const confirmationFrom = fromDan
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        await sendSmtpEmail(data.email, formRecipient, confirmationSubject, confirmationText, confirmationHtml, confirmationFrom)
      } else if (process.env.RESEND_API_KEY) {
        await sendResendEmail(data.email, formRecipient, confirmationSubject, confirmationText, confirmationHtml, confirmationFrom)
      }
    } catch (error) {
      console.warn("[intake] confirmation email failed", error)
    }
  }
  void sendLeadToCrm({
    type: "intake",
    email: data.email!,
    name: [data.firstName, data.lastName].filter(Boolean).join(" "),
    phone: data.phone,
    tags: ["intake"],
    payload: { mainReason: data.mainReason },
  })
  return NextResponse.json({ ok: true })
}




