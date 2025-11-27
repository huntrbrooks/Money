'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Navigation, Footer } from '@/components/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  supportFocus: string
  preferredFormat: string
  updatesOptIn: boolean
  consentAccepted: boolean
}

export default function EnquiryPage() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<null | 'ok' | 'error'>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    supportFocus: '',
    preferredFormat: '',
    updatesOptIn: false,
    consentAccepted: false,
  })

  const steps = [
    {
      label: 'About you',
      complete: Boolean(form.firstName && form.email && form.phone),
    },
    {
      label: 'Support focus',
      complete: Boolean(form.message && form.supportFocus),
    },
    {
      label: 'Consent',
      complete: form.consentAccepted,
    },
  ]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(null)
    setErrorMessage('')

    // simple client validation
    if (!form.firstName || !form.email || !form.phone || !form.message) {
      setSubmitted('error')
      setErrorMessage('Please complete all required fields.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setSubmitted('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }
    if (!form.consentAccepted) {
      setSubmitted('error')
      setErrorMessage('Please acknowledge the consent statement.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Something went wrong sending your enquiry.')
      }
      setSubmitted('ok')
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : null
      setSubmitted('error')
      setErrorMessage(message ?? 'Something went wrong sending your enquiry.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />

      <main>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-10 text-center">
                <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">Enquiry Form</h1>
                <p className="text-[var(--primary)] mt-2">We’ll get back to you as soon as possible.</p>
              </div>
              <div className="mb-8 grid gap-4 sm:grid-cols-3">
                {steps.map((step, idx) => (
                  <div
                    key={step.label}
                    className={`rounded-2xl border p-4 text-left ${
                      step.complete ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--secondary)] bg-white'
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)]/80">Step {idx + 1}</p>
                    <p className="font-semibold text-[var(--foreground)]">{step.label}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="bg-white border border-[var(--secondary)] rounded-xl p-6 md:p-10 space-y-6">
                <div>
                  <p className="text-sm text-[var(--primary)]/80">Name <span className="text-[var(--accent)]">(required)</span></p>
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
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-[var(--accent)]">(required)</span></Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Phone Number <span className="text-[var(--accent)]">(required)</span></Label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message <span className="text-[var(--accent)]">(required)</span></Label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportFocus">What feels most helpful to focus on?</Label>
                  <Textarea
                    id="supportFocus"
                    rows={4}
                    value={form.supportFocus}
                    onChange={(e) => setForm({ ...form, supportFocus: e.target.value })}
                    placeholder="e.g. financial control in my relationship, rebuilding trust after separation…"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredFormat">Preferred session format</Label>
                  <select
                    id="preferredFormat"
                    className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-[var(--foreground)]"
                    value={form.preferredFormat}
                    onChange={(e) => setForm({ ...form, preferredFormat: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="Telehealth">Telehealth (Zoom)</option>
                    <option value="In-person">In-person (St Kilda Rd)</option>
                    <option value="In-home">In-home consultation</option>
                    <option value="Walk & Discuss">Walk & Discuss therapy</option>
                    <option value="Not sure">Not sure yet</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="updatesOptIn"
                      checked={form.updatesOptIn}
                      onCheckedChange={(checked) =>
                        setForm((prev) => ({ ...prev, updatesOptIn: Boolean(checked) }))
                      }
                    />
                    <Label htmlFor="updatesOptIn" className="text-sm text-[var(--primary)]">
                      Send me the Financial Safety Check-in and occasional updates (you can unsubscribe anytime).
                    </Label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="consentAccepted"
                      checked={form.consentAccepted}
                      onCheckedChange={(checked) =>
                        setForm((prev) => ({ ...prev, consentAccepted: Boolean(checked) }))
                      }
                      required
                    />
                    <Label htmlFor="consentAccepted" className="text-sm text-[var(--primary)]">
                      I’ve read the{' '}
                      <Link href="/consent" className="underline">
                        consent & policies
                      </Link>{' '}
                      and understand urgent support is available in the{' '}
                      <Link href="/client-care" className="underline">
                        Client Care Hub
                      </Link>
                      .
                    </Label>
                  </div>
                </div>

                {submitted === 'ok' && (
                  <div className="text-sm rounded-md p-3 border border-green-200 bg-green-50 text-green-700">
                    Thank you — your enquiry has been sent.
                  </div>
                )}
                {submitted === 'error' && (
                  <div className="text-sm rounded-md p-3 border border-red-200 bg-red-50 text-red-700">
                    {errorMessage}
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-12 px-10 bg-[var(--accent)] hover:opacity-90 text-white font-medium"
                  >
                    {submitting ? 'Sending…' : 'Send'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


