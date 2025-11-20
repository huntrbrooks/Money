import { NextResponse } from "next/server"
import { readSiteConfig } from "@/lib/config"

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
  nextOfKinName?: string
  nextOfKinPhone?: string
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
  chronicPain?: string
  useAlcoholOrDrugsForPain?: string
  recentRecreationalDrugUse?: string
  mainReason?: string
}

function sanitize(input: string): string {
  return input.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string)).trim()
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
    `Next of kin: ${data.nextOfKinName || "-"}`,
    `Next of kin phone: ${data.nextOfKinPhone || "-"}`,
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
    `Chronic pain: ${labelYesNo(data.chronicPain)}`,
    `Alcohol/drugs for pain management: ${labelYesNo(data.useAlcoholOrDrugsForPain)}`,
    `Recent recreational drug use: ${labelYesNo(data.recentRecreationalDrugUse)}`,
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
      <p><strong>Next of kin:</strong> ${sanitizeOrDash(data.nextOfKinName)}</p>
      <p><strong>Next of kin phone:</strong> ${sanitizeOrDash(data.nextOfKinPhone)}</p>
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
      <p><strong>Chronic pain:</strong> ${sanitizeOrDash(labelYesNo(data.chronicPain))}</p>
      <p><strong>Alcohol/drugs for pain management:</strong> ${sanitizeOrDash(labelYesNo(data.useAlcoholOrDrugsForPain))}</p>
      <p><strong>Recent recreational drug use:</strong> ${sanitizeOrDash(labelYesNo(data.recentRecreationalDrugUse))}</p>
      <p><strong>Main reason(s) seeking therapy:</strong></p>
      ${pre(data.mainReason)}
      <p><strong>Other important information:</strong></p>
      ${pre(data.otherInformation)}
    </div>
  `
}

async function sendViaResend(to: string, replyTo: string | undefined, data: IntakePayload) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || "Intake <onboarding@resend.dev>"
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

async function sendViaSmtp(to: string, replyTo: string | undefined, data: IntakePayload) {
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
  const from = process.env.EMAIL_FROM || `Intake <${user ?? "no-reply@example.com"}>`
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
  const raw = (await req.json().catch(() => null)) as IntakePayload | null
  if (!raw) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  // Sanitize and bound
  const s = (v?: string, max = 200) => sanitize(String(v ?? "")).slice(0, max)
  const sn = (v?: number) => (typeof v === "number" ? Math.max(1, Math.min(5, v)) : undefined)

  const data: IntakePayload = {
    firstName: s(raw.firstName),
    lastName: s(raw.lastName),
    email: s(raw.email, 300),
    phone: s(raw.phone, 60),
    country: s(raw.country, 80),
    address1: s(raw.address1, 300),
    address2: s(raw.address2, 300),
    suburb: s(raw.suburb, 120),
    state: s(raw.state, 50),
    postcode: s(raw.postcode, 20),
    date: s(raw.date, 20),
    occupation: s(raw.occupation, 200),
    relationshipStatus: s(raw.relationshipStatus, 40),
    haveChildren: s(raw.haveChildren, 40),
    nextOfKinName: s(raw.nextOfKinName, 200),
    nextOfKinPhone: s(raw.nextOfKinPhone, 60),
    generalHealth: sn(raw.generalHealth),
    seenCounsellor: s(raw.seenCounsellor, 10),
    onMedication: s(raw.onMedication, 10),
    medicationDetails: s(raw.medicationDetails, 2000),
    experiencingDepression: s(raw.experiencingDepression, 10),
    suicidalThoughts: s(raw.suicidalThoughts, 10),
    otherInformation: s(raw.otherInformation, 8000),
    familyMentalHealthHistory: s(raw.familyMentalHealthHistory, 20),
    sleepingHabits: sn(raw.sleepingHabits),
    physicalHealth: sn(raw.physicalHealth),
    exerciseFrequency: s(raw.exerciseFrequency, 30),
    chronicPain: s(raw.chronicPain, 10),
    useAlcoholOrDrugsForPain: s(raw.useAlcoholOrDrugsForPain, 10),
    recentRecreationalDrugUse: s(raw.recentRecreationalDrugUse, 10),
    mainReason: s(raw.mainReason, 8000),
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

  const cfg = await readSiteConfig()
  const toAddress = cfg.contact?.email || process.env.FALLBACK_TO_EMAIL

  // Try SMTP first if configured, otherwise fall back to Resend, otherwise log in dev
  let result: { ok: true } | { ok: false; error: string } = { ok: false, error: "No email provider configured" }
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && toAddress) {
    result = await sendViaSmtp(toAddress, data.email, data).catch((e: any) => ({
      ok: false as const,
      error: e?.message || "SMTP error",
    }))
  } else if (process.env.RESEND_API_KEY && toAddress) {
    result = await sendViaResend(toAddress, data.email, data).catch((e: any) => ({
      ok: false as const,
      error: e?.message || "Resend error",
    }))
  } else {
    console.log("[intake] Dev mode - email not sent. Payload:", data)
    return NextResponse.json({ ok: true, dev: true })
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}



