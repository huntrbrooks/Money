import { NextResponse } from "next/server"
import { readSiteConfig } from "@/lib/config"
import { sendLeadToCrm } from "@/lib/crm"
import type { FormField, FormPage } from "@/lib/config"

function flattenFields(page?: FormPage | null): FormField[] {
  if (!page?.sections) return []
  const out: FormField[] = []
  for (const s of page.sections) {
    for (const f of s.fields) out.push(f)
  }
  return out
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

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> & {
    email?: string
    name?: string
    tags?: string[]
  } | null

  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  // Fetch form config for validation
  const config = await readSiteConfig()
  const formPage = config.formPages?.newsletter
  const fields = flattenFields(formPage)

  // Validate required fields
  if (fields.length > 0) {
    for (const field of fields) {
      if (isRequired(field)) {
        const value = body[field.name]
        if (!isFilled(field, value)) {
          const errorMsg = formPage?.errorMessageMissingRequired ?? "Please complete all required fields."
          return NextResponse.json({ error: errorMsg }, { status: 400 })
        }
        // Additional email validation
        if (field.type === "email") {
          const emailValue = String(value ?? "").trim()
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
            return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
          }
        }
      }
    }
  } else {
    // Fallback: basic email validation if no config
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 })
    }
  }

  const lead = await sendLeadToCrm({
    type: "newsletter",
    email: String(body.email ?? "").trim(),
    name: body.name ? String(body.name).trim() : undefined,
    tags: Array.isArray(body.tags) ? body.tags : ["newsletter"],
  })
  if (!lead.ok) {
    return NextResponse.json({ error: lead.error ?? "Unable to subscribe" }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}














