"use client"

import { useMemo, useState } from "react"
import type { FormField, FormPage, FormSection } from "@/lib/config"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

type FieldValue = string | number | boolean

function flattenSections(sections: FormSection[]): FormField[] {
  const out: FormField[] = []
  for (const s of sections) {
    for (const f of s.fields) out.push(f)
  }
  return out
}

function defaultValueForField(field: FormField): FieldValue {
  if (field.type === "checkbox") return Boolean(field.defaultChecked)
  if (field.type === "slider") return typeof field.defaultValue === "number" ? field.defaultValue : field.min
  return ""
}

function isFilled(field: FormField, value: FieldValue | undefined): boolean {
  if (field.type === "checkbox") {
    if (field.mustBeTrue) return value === true
    return typeof value === "boolean"
  }
  if (field.type === "slider") {
    return typeof value === "number" && !Number.isNaN(value)
  }
  if (field.type === "select") {
    // Select fields with empty string value are not filled
    const str = String(value ?? "")
    return str.trim().length > 0
  }
  const str = String(value ?? "").trim()
  return str.length > 0
}

function getLayoutClasses(layout: FormSection["layout"]): string {
  if (layout === "grid-3") return "grid gap-6 md:grid-cols-3"
  if (layout === "grid-2") return "grid gap-6 md:grid-cols-2"
  return "space-y-6"
}

export function DynamicForm({ page }: { page: FormPage }) {
  const fields = useMemo(() => flattenSections(page.sections), [page.sections])
  const initial = useMemo(() => {
    const base: Record<string, FieldValue> = {}
    for (const f of fields) base[f.name] = defaultValueForField(f)
    return base
  }, [fields])

  const [values, setValues] = useState<Record<string, FieldValue>>(initial)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<null | "ok" | "error">(null)
  const [errorMessage, setErrorMessage] = useState("")

  const steps = page.steps ?? []
  const stepStates = steps.map((s) => ({
    label: s.label,
    complete: s.completeWhenAllOf.every((name) => {
      const field = fields.find((f) => f.name === name)
      if (!field) return false
      return isFilled(field, values[name])
    }),
  }))
  const showSteps = stepStates.length > 0 && page.action !== "/api/enquiry"

  const requiredFields = fields.filter((f) => {
    if (f.type === "checkbox" && f.mustBeTrue) return true
    return Boolean((f as { required?: boolean }).required)
  })

  function validate(): string | null {
    for (const f of requiredFields) {
      if (!isFilled(f, values[f.name])) {
        return page.errorMessageMissingRequired ?? "Please complete all required fields."
      }
    }
    for (const f of fields) {
      if (f.type === "email") {
        const v = String(values[f.name] ?? "").trim()
        if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
          return "Please enter a valid email address."
        }
      }
    }
    // common dd/mm/yyyy validation (only if field name contains "date" and has a value)
    for (const f of fields) {
      if (f.type !== "text") continue
      if (!/date/i.test(f.name)) continue
      const v = String(values[f.name] ?? "").trim()
      if (v && !/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/.test(v)) {
        return "Please enter the date in dd/mm/yyyy format."
      }
    }
    return null
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(null)
    setErrorMessage("")
    const v = validate()
    if (v) {
      setSubmitted("error")
      setErrorMessage(v)
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(page.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Something went wrong submitting the form.")
      }
      setSubmitted("ok")
      setValues(initial)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : null
      setSubmitted("error")
      setErrorMessage(message ?? "Something went wrong submitting the form.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-[var(--section-bg-2)] border border-[var(--secondary)] rounded-xl p-6 md:p-10 space-y-8">
      {showSteps ? (
        <div className="mb-2 grid gap-4 sm:grid-cols-3">
          {stepStates.map((step, idx) => (
            <div
              key={step.label}
              className={`rounded-2xl border p-4 text-left ${
                step.complete ? "border-[var(--accent)] bg-[var(--accent)]/10" : "border-[var(--secondary)] bg-[var(--section-bg-1)]"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)]/80">Step {idx + 1}</p>
              <p className="font-semibold text-[var(--foreground)]">{step.label}</p>
            </div>
          ))}
        </div>
      ) : null}

      {page.sections.map((section, sectionIdx) => (
        <div key={`${section.title ?? "section"}-${sectionIdx}`} className="space-y-4">
          {section.title ? <h2 className="font-serif text-2xl text-[var(--foreground)] font-light">{section.title}</h2> : null}
          {section.description ? <p className="text-[var(--primary)]">{section.description}</p> : null}

          <div className={getLayoutClasses(section.layout)}>
            {section.fields.map((field) => {
              const value = values[field.name]
              const required = Boolean((field as { required?: boolean }).required) || (field.type === "checkbox" && field.mustBeTrue)

              if (field.type === "textarea") {
                return (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>
                      {field.label} {required ? <span className="text-[var(--accent)]">(required)</span> : null}
                    </Label>
                    <Textarea
                      id={field.name}
                      rows={field.rows ?? 6}
                      value={String(value ?? "")}
                      placeholder={field.placeholder}
                      onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                      required={required}
                    />
                    {field.helperText ? <p className="text-sm text-[var(--primary)]/80">{field.helperText}</p> : null}
                  </div>
                )
              }

              if (field.type === "select") {
                return (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>
                      {field.label} {required ? <span className="text-[var(--accent)]">(required)</span> : null}
                    </Label>
                    <select
                      id={field.name}
                      aria-label={field.label || field.name}
                      title={field.label || field.name}
                      className="w-full rounded-md border border-input bg-[var(--section-bg-1)] px-3 py-2 text-sm text-[var(--foreground)]"
                      value={String(value ?? "")}
                      onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                      required={required}
                    >
                      {field.options.map((opt) => (
                        <option key={`${field.name}-${opt.value}`} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {field.helperText ? <p className="text-sm text-[var(--primary)]/80">{field.helperText}</p> : null}
                  </div>
                )
              }

              if (field.type === "checkbox") {
                const checked = Boolean(value)
                return (
                  <div key={field.name} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={field.name}
                        checked={checked}
                        onCheckedChange={(c) => setValues((prev) => ({ ...prev, [field.name]: Boolean(c) }))}
                      />
                      <div className="space-y-1">
                        <Label htmlFor={field.name} className="text-sm text-[var(--primary)]">
                          {field.label} {required ? <span className="text-[var(--accent)]">(required)</span> : null}
                        </Label>
                        {field.helperText ? <p className="text-xs text-[var(--primary)]/70">{field.helperText}</p> : null}
                      </div>
                    </div>
                  </div>
                )
              }

              if (field.type === "slider") {
                const num = typeof value === "number" ? value : field.min
                return (
                  <div key={field.name} className="space-y-2">
                    <Label>
                      {field.label} {required ? <span className="text-[var(--accent)]">(required)</span> : null}
                    </Label>
                    <div className="pt-2">
                      <Slider
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={[num]}
                        onValueChange={([v]) => setValues((prev) => ({ ...prev, [field.name]: v }))}
                      />
                      {field.helperText ? (
                        <div className="text-xs text-[var(--primary)] pt-1">{field.helperText}</div>
                      ) : (
                        <div className="text-xs text-[var(--primary)] pt-1">
                          {field.min} — {field.max} scale
                        </div>
                      )}
                    </div>
                  </div>
                )
              }

              // text/email/tel
              const inputType = field.type
              const inputMode = inputType === "tel" ? "tel" : undefined

              return (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.label} {required ? <span className="text-[var(--accent)]">(required)</span> : null}
                  </Label>
                  <Input
                    id={field.name}
                    type={inputType === "text" ? "text" : inputType}
                    inputMode={inputMode}
                    value={String(value ?? "")}
                    placeholder={field.placeholder}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                    required={required}
                  />
                  {field.helperText ? <p className="text-sm text-[var(--primary)]/80">{field.helperText}</p> : null}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {submitted === "ok" && (
        <div className="text-sm rounded-md p-3 border border-green-200 bg-green-50 text-green-700">{page.successMessage}</div>
      )}
      {submitted === "error" && (
        <div className="text-sm rounded-md p-3 border border-red-200 bg-red-50 text-red-700">{errorMessage}</div>
      )}

      <div className="pt-2">
        <Button type="submit" disabled={submitting} className="h-12 px-10 bg-[var(--accent)] hover:opacity-90 text-white font-medium">
          {submitting ? "Sending…" : page.submitLabel}
        </Button>
      </div>
    </form>
  )
}


