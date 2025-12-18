'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { ConsultationOption } from '@/lib/config'
import { Calendar, Clock } from 'lucide-react'

type BookingFormProps = {
  consultations?: ConsultationOption[]
}

export function BookingForm({ consultations = [] }: BookingFormProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<null | 'ok' | 'error'>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const availableTimes = useMemo(
    () => ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM'],
    [],
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(null)
    setErrorMessage('')

    if (!selectedFormat || !selectedDate || !selectedTime) {
      setSubmitted('error')
      setErrorMessage('Please select a consultation format, date, and time.')
      return
    }

    if (!firstName || !email || !phone) {
      setSubmitted('error')
      setErrorMessage('Please complete the required contact fields.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubmitted('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }

    const message = [
      `Booking request`,
      ``,
      `Format: ${selectedFormat}`,
      `Date: ${selectedDate}`,
      `Time: ${selectedTime}`,
      notes ? `` : '',
      notes ? `Notes:` : '',
      notes ? `${notes}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    setSubmitting(true)
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone, message }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Something went wrong submitting your request.')
      }
      setSubmitted('ok')
      setSelectedFormat('')
      setSelectedDate('')
      setSelectedTime('')
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setNotes('')
    } catch (err: any) {
      setSubmitted('error')
      setErrorMessage(err?.message ?? 'Something went wrong submitting your request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-[var(--foreground)]">1. Choose Consultation Format</CardTitle>
          <CardDescription>Pick the option that feels safest and most comfortable for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {consultations.map((c, idx) => (
              <button
                key={`${c.format}-${idx}`}
                type="button"
                onClick={() => setSelectedFormat(c.format)}
                className={`p-6 rounded-lg border-2 text-left transition-all ${
                  selectedFormat === c.format
                    ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                    : 'border-[var(--foreground)]/20 hover:border-[var(--primary)]/40'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg text-[var(--foreground)] mb-1">{c.format}</h3>
                    <p className="text-sm text-[var(--primary)]/70">{c.duration}</p>
                    <p className="text-lg font-medium text-[var(--accent)] mt-1">{c.price}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-[var(--foreground)]">2. Select Date</CardTitle>
            <CardDescription>Choose your preferred appointment date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[var(--primary)]" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="max-w-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[var(--foreground)]">3. Select Time</CardTitle>
            <CardDescription>Choose your preferred appointment time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    selectedTime === time
                      ? 'border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--foreground)]'
                      : 'border-[var(--foreground)]/20 hover:border-[var(--primary)]/40 text-[var(--foreground)]'
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-sm font-medium">{time}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[var(--foreground)]">4. Your Contact Information</CardTitle>
          <CardDescription>We'll use this to confirm your appointment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0400 000 000"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific concerns or questions you'd like to discuss..."
              rows={4}
            />
          </div>

          {submitted === 'ok' && (
            <div className="text-sm rounded-md p-3 border border-green-200 bg-green-50 text-green-700">
              Thank you — your booking request has been sent.
            </div>
          )}
          {submitted === 'error' && (
            <div className="text-sm rounded-md p-3 border border-red-200 bg-red-50 text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex gap-4 pt-2 justify-end">
            <Button type="submit" size="lg" disabled={submitting} className="bg-[var(--accent)] hover:opacity-90 text-white">
              {submitting ? 'Submitting…' : 'Submit Booking Request'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}


