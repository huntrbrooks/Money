"use client"

import { useEffect, useState, useMemo } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAnalytics } from "@/hooks/use-analytics"
import type { FormPage, FormField } from "@/lib/config"

type NewsletterModalProps = {
  triggerLabel?: string
  tags?: string[]
  formPage?: FormPage
}

export function NewsletterModal({ triggerLabel = "Get the guide", tags = ["newsletter"], formPage }: NewsletterModalProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [formConfig, setFormConfig] = useState<FormPage | null>(formPage || null)
  const { track } = useAnalytics()

  // Fetch form config if not provided
  useEffect(() => {
    if (!formConfig) {
      fetch("/api/site-config")
        .then((r) => r.json())
        .then((data) => {
          if (data.formPages?.newsletter) {
            setFormConfig(data.formPages.newsletter)
          }
        })
        .catch(() => {
          // Fallback to default structure if fetch fails
          setFormConfig({
            title: "Download the 5-step Financial Safety Check-in",
            subtitle: "Pop your details below and we'll send the grounding checklist, plus gentle updates you can opt-out of anytime.",
            action: "/api/subscribe",
            submitLabel: "Send it to me",
            successMessage: "Check your inbox — thanks for subscribing — your resource is on the way.",
            errorMessageMissingRequired: "Please complete all required fields.",
            sections: [
              {
                title: "",
                layout: "stack",
                fields: [
                  { type: "text", name: "name", label: "First name", required: false, placeholder: "Sasha" },
                  { type: "email", name: "email", label: "Email", required: true, placeholder: "you@email.com" },
                ],
              },
            ],
          })
        })
    }
  }, [formConfig])

  const fields = useMemo(() => {
    if (!formConfig) return []
    const allFields: FormField[] = []
    for (const section of formConfig.sections) {
      allFields.push(...section.fields)
    }
    return allFields
  }, [formConfig])

  const initialValues = useMemo(() => {
    const base: Record<string, string | boolean> = {}
    for (const field of fields) {
      if (field.type === "checkbox") {
        base[field.name] = field.defaultChecked ?? false
      } else {
        base[field.name] = ""
      }
    }
    return base
  }, [fields])

  const [form, setForm] = useState<Record<string, string | boolean>>(initialValues)

  useEffect(() => {
    if (open) {
      track("newsletter_modal_open")
    }
  }, [open, track])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = fields.filter((f) => f.required || (f.type === "checkbox" && f.mustBeTrue))
    for (const field of requiredFields) {
      if (field.type === "checkbox" && field.mustBeTrue) {
        if (form[field.name] !== true) {
          toast({ title: formConfig?.errorMessageMissingRequired ?? "Please complete all required fields.", variant: "destructive" })
          return
        }
      } else if (field.type === "email") {
        const value = String(form[field.name] ?? "").trim()
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          toast({ title: "Please enter a valid email address.", variant: "destructive" })
          return
        }
      } else {
        const value = String(form[field.name] ?? "").trim()
        if (!value) {
          toast({ title: formConfig?.errorMessageMissingRequired ?? "Please complete all required fields.", variant: "destructive" })
          return
        }
      }
    }

    setPending(true)
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tags }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Unable to subscribe right now.")
      }
      toast({ title: "Check your inbox", description: formConfig?.successMessage ?? "Thanks for subscribing — your resource is on the way." })
      setForm(initialValues)
      setOpen(false)
      track("newsletter_subscribed", { tags })
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : "Something went wrong."
      toast({ title: "Oops", description, variant: "destructive" })
    } finally {
      setPending(false)
    }
  }

  if (!formConfig) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-full bg-[var(--accent)] px-6 py-3 text-white shadow-[0_15px_30px_rgba(32,56,91,0.15)] hover:opacity-90">
            {triggerLabel}
          </Button>
        </DialogTrigger>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-[var(--accent)] px-6 py-3 text-white shadow-[0_15px_30px_rgba(32,56,91,0.15)] hover:opacity-90">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{formConfig.title}</DialogTitle>
          {formConfig.subtitle && <DialogDescription>{formConfig.subtitle}</DialogDescription>}
        </DialogHeader>
        <form className="space-y-4 pt-4" onSubmit={handleSubmit}>
          {fields.map((field) => {
            const value = form[field.name]
            const required = field.required || (field.type === "checkbox" && field.mustBeTrue)

            if (field.type === "checkbox") {
              const checked = Boolean(value)
              return (
                <div key={field.name} className="flex items-start gap-3">
                  <Checkbox
                    id={`newsletter-${field.name}`}
                    checked={checked}
                    onCheckedChange={(c) => setForm((prev) => ({ ...prev, [field.name]: Boolean(c) }))}
                  />
                  <div className="space-y-1">
                    <Label htmlFor={`newsletter-${field.name}`} className="text-sm text-[var(--primary)]">
                      {field.label} {required ? <span className="text-[var(--accent)]">(required)</span> : null}
                    </Label>
                    {field.helperText ? <p className="text-xs text-[var(--primary)]/70">{field.helperText}</p> : null}
                  </div>
                </div>
              )
            }

            const inputType = field.type === "email" ? "email" : field.type === "tel" ? "tel" : "text"
            return (
              <div key={field.name} className="space-y-1.5">
                <Label htmlFor={`newsletter-${field.name}`} className="text-sm font-medium text-[var(--foreground)]">
                  {field.label} {required ? <span className="text-[var(--accent)]">(required)</span> : null}
                </Label>
                <Input
                  id={`newsletter-${field.name}`}
                  type={inputType}
                  value={String(value ?? "")}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.name]: e.target.value }))}
                  placeholder={field.placeholder}
                  required={required}
                />
                {field.helperText ? <p className="text-xs text-[var(--primary)]/80">{field.helperText}</p> : null}
              </div>
            )
          })}
          <div className="flex gap-3">
            <Button type="submit" disabled={pending} className="flex-1">
              {pending ? "Sending..." : formConfig.submitLabel}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

