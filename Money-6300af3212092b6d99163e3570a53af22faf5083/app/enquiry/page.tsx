'use client'

import { useState } from 'react'
import { Navigation, Footer } from '@/components/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
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
  })

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
    } catch (err: any) {
      setSubmitted('error')
      setErrorMessage(err?.message ?? 'Something went wrong sending your enquiry.')
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


