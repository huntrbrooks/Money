'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Navigation, Footer } from '@/components/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

type IntakeFormState = {
  // Contact
  firstName: string
  lastName: string
  email: string
  phone: string
  // Address
  country: string
  address1: string
  address2: string
  suburb: string
  state: string
  postcode: string
  // Date
  date: string
  // Background
  occupation: string
  relationshipStatus: string
  haveChildren: string
  nextOfKinName: string
  nextOfKinPhone: string
  // Health and history
  generalHealth: number
  seenCounsellor: string
  onMedication: string
  medicationDetails: string
  experiencingDepression: string
  suicidalThoughts: string
  otherInformation: string
  familyMentalHealthHistory: string
  sleepingHabits: number
  physicalHealth: number
  exerciseFrequency: string
  chronicPain: string
  useAlcoholOrDrugsForPain: string
  recentRecreationalDrugUse: string
  // Reason
  mainReason: string
}

export default function IntakePage() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<null | 'ok' | 'error'>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [form, setForm] = useState<IntakeFormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Australia',
    address1: '',
    address2: '',
    suburb: '',
    state: '',
    postcode: '',
    date: '',
    occupation: '',
    relationshipStatus: '',
    haveChildren: '',
    nextOfKinName: '',
    nextOfKinPhone: '',
    generalHealth: 3,
    seenCounsellor: '',
    onMedication: '',
    medicationDetails: '',
    experiencingDepression: '',
    suicidalThoughts: '',
    otherInformation: '',
    familyMentalHealthHistory: '',
    sleepingHabits: 3,
    physicalHealth: 3,
    exerciseFrequency: '',
    chronicPain: '',
    useAlcoholOrDrugsForPain: '',
    recentRecreationalDrugUse: '',
    mainReason: '',
  })
  const steps = [
    {
      label: 'Contact & logistics',
      complete: Boolean(form.firstName && form.email && form.phone && form.date),
    },
    {
      label: 'Health snapshot',
      complete: Boolean(form.seenCounsellor && form.onMedication && form.generalHealth),
    },
    {
      label: 'Goals & focus',
      complete: form.mainReason.length > 10,
    },
  ]

  const requiredOk =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.country.trim() &&
    form.address1.trim() &&
    form.suburb.trim() &&
    form.state.trim() &&
    form.postcode.trim() &&
    form.date.trim()

  function validate(): string | null {
    if (!requiredOk) return 'Please complete all required fields.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return 'Please enter a valid email address.'
    }
    if (!/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/.test(form.date.trim())) {
      return 'Please enter the date in dd/mm/yyyy format.'
    }
    return null
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(null)
    setErrorMessage('')

    const v = validate()
    if (v) {
      setSubmitted('error')
      setErrorMessage(v)
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Something went wrong sending your intake form.')
      }
      setSubmitted('ok')
      // Reset, keep country default
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: 'Australia',
        address1: '',
        address2: '',
        suburb: '',
        state: '',
        postcode: '',
        date: '',
        occupation: '',
        relationshipStatus: '',
        haveChildren: '',
        nextOfKinName: '',
        nextOfKinPhone: '',
        generalHealth: 3,
        seenCounsellor: '',
        onMedication: '',
        medicationDetails: '',
        experiencingDepression: '',
        suicidalThoughts: '',
        otherInformation: '',
        familyMentalHealthHistory: '',
        sleepingHabits: 3,
        physicalHealth: 3,
        exerciseFrequency: '',
        chronicPain: '',
        useAlcoholOrDrugsForPain: '',
        recentRecreationalDrugUse: '',
        mainReason: '',
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : null
      setSubmitted('error')
      setErrorMessage(message ?? 'Something went wrong sending your intake form.')
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
                <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">Intake Form</h1>
                <p className="text-[var(--primary)] mt-2">Please complete this form before your first appointment.</p>
              </div>
              <div className="mb-8 grid gap-4 sm:grid-cols-3">
                {steps.map((step, idx) => (
                  <div
                    key={step.label}
                    className={`rounded-2xl border p-4 text-left ${
                      step.complete ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--secondary)] bg-[var(--section-bg-1)]'
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)]/80">Step {idx + 1}</p>
                    <p className="font-semibold text-[var(--foreground)]">{step.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-[var(--primary)] pb-4">
                Need a pause? Take a break and return when you feel ready. Grounding resources live in the{' '}
                <Link href="/client-care" className="underline">
                  Client Care Hub
                </Link>
                .
              </p>

              <form onSubmit={handleSubmit} className="bg-[var(--section-bg-2)] border border-[var(--secondary)] rounded-xl p-6 md:p-10 space-y-8">
                <div className="space-y-1">
                  <p className="text-sm text-[var(--primary)]/80">Skip to Content</p>
                  <p className="text-[var(--foreground)] font-medium">The Financial Therapist</p>
                </div>

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
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
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
                </div>

                <div>
                  <p className="text-sm text-[var(--primary)]/80">Address <span className="text-[var(--accent)]">(required)</span></p>
                  <div className="grid gap-4 md:grid-cols-2 mt-2">
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Select
                        value={form.country}
                        onValueChange={(v) => setForm({ ...form, country: v })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address1">Address Line 1 <span className="text-[var(--accent)]">(required)</span></Label>
                      <Input
                        id="address1"
                        value={form.address1}
                        onChange={(e) => setForm({ ...form, address1: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="address2">Address Line 2</Label>
                      <Input
                        id="address2"
                        value={form.address2}
                        onChange={(e) => setForm({ ...form, address2: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="suburb">Suburb <span className="text-[var(--accent)]">(required)</span></Label>
                      <Input
                        id="suburb"
                        value={form.suburb}
                        onChange={(e) => setForm({ ...form, suburb: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3 mt-2">
                    <div className="space-y-2">
                      <Label>State <span className="text-[var(--accent)]">(required)</span></Label>
                      <Select
                        value={form.state}
                        onValueChange={(v) => setForm({ ...form, state: v })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VIC">VIC</SelectItem>
                          <SelectItem value="NSW">NSW</SelectItem>
                          <SelectItem value="QLD">QLD</SelectItem>
                          <SelectItem value="SA">SA</SelectItem>
                          <SelectItem value="WA">WA</SelectItem>
                          <SelectItem value="TAS">TAS</SelectItem>
                          <SelectItem value="NT">NT</SelectItem>
                          <SelectItem value="ACT">ACT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="postcode">Postcode <span className="text-[var(--accent)]">(required)</span></Label>
                      <Input
                        id="postcode"
                        inputMode="numeric"
                        value={form.postcode}
                        onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date (dd/mm/yyyy) <span className="text-[var(--accent)]">(required)</span></Label>
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
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={form.occupation}
                      onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Are you currently in any form of relationship?</Label>
                    <Select
                      value={form.relationshipStatus}
                      onValueChange={(v) => setForm({ ...form, relationshipStatus: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="relationship">In a relationship</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="separated">Separated</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                        <SelectItem value="prefer_not">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Do you have any children?</Label>
                    <Select
                      value={form.haveChildren}
                      onValueChange={(v) => setForm({ ...form, haveChildren: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="prefer_not">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nextOfKinName">Next of Kin (In case of emergency)</Label>
                    <Input
                      id="nextOfKinName"
                      value={form.nextOfKinName}
                      onChange={(e) => setForm({ ...form, nextOfKinName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextOfKinPhone">Phone number for Next of Kin</Label>
                    <Input
                      id="nextOfKinPhone"
                      type="tel"
                      inputMode="tel"
                      value={form.nextOfKinPhone}
                      onChange={(e) => setForm({ ...form, nextOfKinPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>How would you consider your general health?</Label>
                    <div className="pt-2">
                      <Slider
                        min={1}
                        max={5}
                        value={[form.generalHealth]}
                        onValueChange={([v]) => setForm({ ...form, generalHealth: v })}
                      />
                      <div className="text-xs text-[var(--primary)] pt-1">1 — 5 scale (1 = very poor, 5 = excellent)</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Have you previously seen a counsellor or psychologist?</Label>
                    <Select
                      value={form.seenCounsellor}
                      onValueChange={(v) => setForm({ ...form, seenCounsellor: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Are you on any medication from any previous issue?</Label>
                    <Select
                      value={form.onMedication}
                      onValueChange={(v) => setForm({ ...form, onMedication: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="space-y-2">
                      <Label htmlFor="medicationDetails">If yes, medication details</Label>
                      <Input
                        id="medicationDetails"
                        value={form.medicationDetails}
                        onChange={(e) => setForm({ ...form, medicationDetails: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Are you currently experiencing overwhelming sadness, grief or depression?</Label>
                    <Select
                      value={form.experiencingDepression}
                      onValueChange={(v) => setForm({ ...form, experiencingDepression: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Have you ever had any suicidal thoughts?</Label>
                    <Select
                      value={form.suicidalThoughts}
                      onValueChange={(v) => setForm({ ...form, suicidalThoughts: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Has any family member identified with any mental health issue?</Label>
                    <Select
                      value={form.familyMentalHealthHistory}
                      onValueChange={(v) => setForm({ ...form, familyMentalHealthHistory: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="unsure">Unsure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>How would you consider your sleeping habits?</Label>
                    <div className="pt-2">
                      <Slider
                        min={1}
                        max={5}
                        value={[form.sleepingHabits]}
                        onValueChange={([v]) => setForm({ ...form, sleepingHabits: v })}
                      />
                      <div className="text-xs text-[var(--primary)] pt-1">1 — 5 scale (1 = very poor, 5 = excellent)</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>How would you rate your current physical health?</Label>
                    <div className="pt-2">
                      <Slider
                        min={1}
                        max={5}
                        value={[form.physicalHealth]}
                        onValueChange={([v]) => setForm({ ...form, physicalHealth: v })}
                      />
                      <div className="text-xs text-[var(--primary)] pt-1">1 — 5 scale (1 = very poor, 5 = excellent)</div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Do you do any form of exercise? If so, how often?</Label>
                    <Select
                      value={form.exerciseFrequency}
                      onValueChange={(v) => setForm({ ...form, exerciseFrequency: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="1-2_per_week">1–2 times per week</SelectItem>
                        <SelectItem value="3-4_per_week">3–4 times per week</SelectItem>
                        <SelectItem value="5+_per_week">5+ times per week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Are you currently experiencing any form of chronic pain?</Label>
                    <Select
                      value={form.chronicPain}
                      onValueChange={(v) => setForm({ ...form, chronicPain: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Are you currently using any alcohol or drugs for pain management?</Label>
                    <Select
                      value={form.useAlcoholOrDrugsForPain}
                      onValueChange={(v) => setForm({ ...form, useAlcoholOrDrugsForPain: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Have you recently used any recreational drugs?</Label>
                    <Select
                      value={form.recentRecreationalDrugUse}
                      onValueChange={(v) => setForm({ ...form, recentRecreationalDrugUse: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mainReason">What is the main reason/s you are seeking therapy?</Label>
                  <Textarea
                    id="mainReason"
                    rows={6}
                    value={form.mainReason}
                    onChange={(e) => setForm({ ...form, mainReason: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherInformation">Is there any other information you think might be important?</Label>
                  <Textarea
                    id="otherInformation"
                    rows={5}
                    value={form.otherInformation}
                    onChange={(e) => setForm({ ...form, otherInformation: e.target.value })}
                  />
                </div>

                {submitted === 'ok' && (
                  <div className="text-sm rounded-md p-3 border border-green-200 bg-green-50 text-green-700">
                    Thank you — your intake form has been sent.
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

                <div className="space-y-2 pt-6 text-[var(--primary)]">
                  <p>Intake Form</p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <span>Intake Form</span>
                    <a href="/enquiry" className="underline">Enquiry Form</a>
                    <a href="/consent" className="underline">Consent Form</a>
                  </div>
                  <div className="pt-4 space-y-1">
                    <p>Contact:  Dan Lobel</p>
                    <p><a className="underline" href="mailto:dan@themelbournecounsellor.com.au">dan@themelbournecounsellor.com.au</a></p>
                    <p><a className="underline" href="tel:0467477786">0467 477 786</a></p>
                    <p>©The Financial Therapist. 2025.</p>
                    <p>The Financial Therapist Pty. Ltd. atf  The Financial Therapist Trust.</p>
                    <p>The Financial Therapist acknowledges the Wurundjeri people who are the Traditional Custodians of the land on which we work.</p>
                  </div>
                  <div className="pt-6">
                    <p className="text-[var(--foreground)] font-medium">If you or someone you know is in crisis and needs help now, call triple zero (000).</p>
                    <div className="grid md:grid-cols-2 gap-2 mt-2">
                      <p>Lifeline — Call 13 11 14.</p>
                      <p>Suicide Call Back Service — Call 1300 659 467.</p>
                      <p>Beyond Blue — Call 1300 22 4636.</p>
                      <p>MindSpot — Call 1800 61 44 34.</p>
                      <p>Medicare Mental Health — Call 1800 595 212.</p>
                      <p>MensLine Australia — Call 1300 78 99 78.</p>
                      <p>FriendLine — Call 1800 424 287.</p>
                      <p>Kids Helpline — Call 1800 55 1800.</p>
                      <p>Headspace — Call 1800 650 890.</p>
                      <p>Sane Australia — Call 1800 187 263.</p>
                      <p>Blue Knot Foundation — Call 1300 657 380.</p>
                      <p>13Yarn — Call 13 92 76.</p>
                      <p>Thirrili — Call 1800 805 801.</p>
                      <p>QLife — Call 1800 184 527.</p>
                      <p>Panda — Call 1300 726 306.</p>
                      <p>ForWhen — Call 1300 24 23 22.</p>
                      <p>Gidget Foundation — Call 1300 851 758.</p>
                      <p>Open Arms — Call 1800 011 046.</p>
                      <p>Butterfly National Helpline — Call 1800 33 4673.</p>
                    </div>
                  </div>
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



