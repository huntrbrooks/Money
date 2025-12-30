"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { EmailLink } from "@/components/email-link"
import { normalizeEmailAddress } from "@/lib/email"

type ConsentFormState = {
  firstName: string
  lastName: string
  date: string
  fullName: string
  statement: string
}

export default function ConsentFormClient({
  requiredStatement,
  contactEmail,
  contactPhone,
}: {
  requiredStatement: string
  contactEmail?: string
  contactPhone?: string
}) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<null | "ok" | "error">(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [form, setForm] = useState<ConsentFormState>({
    firstName: "",
    lastName: "",
    date: "",
    fullName: "",
    statement: "",
  })

  const email = contactEmail || "dan@financialabusetherapist.com.au"
  const phone = contactPhone || ""

  useEffect(() => {
    // Clear stale error message when required statement changes.
    setSubmitted(null)
    setErrorMessage("")
  }, [requiredStatement])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(null)
    setErrorMessage("")

    if (!form.firstName || !form.lastName || !form.date || !form.fullName || !form.statement) {
      setSubmitted("error")
      setErrorMessage("Please complete all required fields.")
      return
    }
    if (form.statement.trim() !== requiredStatement) {
      setSubmitted("error")
      setErrorMessage("Please type the required statement exactly as shown.")
      return
    }
    if (!/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/.test(form.date.trim())) {
      setSubmitted("error")
      setErrorMessage("Please enter the date in dd/mm/yyyy format.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Something went wrong sending your consent form.")
      }
      setSubmitted("ok")
      setForm({ firstName: "", lastName: "", date: "", fullName: "", statement: "" })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : null
      setSubmitted("error")
      setErrorMessage(message ?? "Something went wrong sending your consent form.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-6">
      <p className="text-[var(--primary)]">
        I hereby acknowledge that I have read and understood this Consent &amp; Policies document. By pressing “Send”, I am agreeing to all the terms and conditions enclosed.
      </p>

      <div>
        <p className="text-sm text-[var(--primary)]/80">
          Type the following statement exactly <span className="text-[var(--accent)]">(required)</span>
        </p>
        <div className="mt-2 space-y-2">
          <Label htmlFor="statement">Required statement</Label>
          <Input
            id="statement"
            placeholder={requiredStatement}
            value={form.statement}
            onChange={(e) => setForm({ ...form, statement: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <p className="text-sm text-[var(--primary)]/80">
          Name <span className="text-[var(--accent)]">(required)</span>
        </p>
        <div className="grid gap-4 md:grid-cols-2 mt-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">
            Date (dd/mm/yyyy) <span className="text-[var(--accent)]">(required)</span>
          </Label>
          <Input
            id="date"
            placeholder="dd/mm/yyyy"
            inputMode="numeric"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Print Full Name <span className="text-[var(--accent)]">(required)</span>
          </Label>
          <Input
            id="fullName"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
        </div>
      </div>

      {submitted === "ok" && (
        <div className="text-sm rounded-md p-3 border border-green-200 bg-green-50 text-green-700">
          Thank you — your consent has been recorded and sent.
        </div>
      )}
      {submitted === "error" && (
        <div className="text-sm rounded-md p-3 border border-red-200 bg-red-50 text-red-700">{errorMessage}</div>
      )}

      <div className="pt-2 flex flex-wrap gap-3 items-center">
        <Button
          type="submit"
          disabled={submitting}
          className="h-12 px-10 bg-[var(--accent)] hover:opacity-90 text-white font-medium"
        >
          {submitting ? "Sending…" : "Send"}
        </Button>
        {email ? (
          <EmailLink
            email={email}
            subject="Consent Form Inquiry"
            className="text-sm underline text-[var(--accent)] break-all cursor-pointer"
          >
            {normalizeEmailAddress(email) || email}
          </EmailLink>
        ) : null}
        {phone ? (
          <a className="text-sm underline text-[var(--accent)]" href={`tel:${phone.replace(/\s+/g, "")}`}>
            {phone}
          </a>
        ) : null}
      </div>
    </form>
  )
}


