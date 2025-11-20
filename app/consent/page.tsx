'use client'

import { useState } from 'react'
import { Navigation, Footer } from '@/components/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type ConsentFormState = {
  firstName: string
  lastName: string
  date: string
  fullName: string
  statement: string
}

const REQUIRED_STATEMENT = 'I have read & I understand the contents of this document'

export default function ConsentPage() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<null | 'ok' | 'error'>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [form, setForm] = useState<ConsentFormState>({
    firstName: '',
    lastName: '',
    date: '',
    fullName: '',
    statement: '',
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(null)
    setErrorMessage('')

    // Basic client-side validation
    if (!form.firstName || !form.lastName || !form.date || !form.fullName || !form.statement) {
      setSubmitted('error')
      setErrorMessage('Please complete all required fields.')
      return
    }
    if (form.statement.trim() !== REQUIRED_STATEMENT) {
      setSubmitted('error')
      setErrorMessage('Please type the required statement exactly as shown.')
      return
    }
    // dd/mm/yyyy basic pattern
    if (!/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/.test(form.date.trim())) {
      setSubmitted('error')
      setErrorMessage('Please enter the date in dd/mm/yyyy format.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Something went wrong sending your consent form.')
      }
      setSubmitted('ok')
      setForm({ firstName: '', lastName: '', date: '', fullName: '', statement: '' })
    } catch (err: any) {
      setSubmitted('error')
      setErrorMessage(err?.message ?? 'Something went wrong sending your consent form.')
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
                <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">Consent Form</h1>
                <p className="text-[var(--primary)] mt-2">Please read carefully and complete the acknowledgement below.</p>
              </div>

              <div className="bg-white border border-[var(--secondary)] rounded-xl p-6 md:p-10 space-y-6">
                <div className="space-y-4 text-[var(--primary)] leading-relaxed">
                  <p>Skip to Content</p>
                  <p className="text-[var(--foreground)] font-medium">The Financial Therapist</p>
                  <p>Informed Consent, Disclosure and Policies Document for The Financial Therapist Pty. Ltd. ACN 674 533 861.</p>
                  <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light mt-6">COUNSELLOR-CLIENT SERVICE AGREEMENT</h2>
                  <p>This document contains material disclosure information and has been prepared in accordance with the Australian Counselling Association&apos;s Code of Ethics and Practice.</p>
                  <p>Our agreement shall be reflected in this document upon your electronic agreement to its contents herewith.</p>

                  <h3 className="font-serif text-xl md:text-2xl text-[var(--foreground)] font-light mt-6">COUNSELLING AND PSYCHOTHERAPY SERVICES</h3>
                  <p>The practice of counselling entails both advantages and disadvantages.</p>
                  <p>Uncomfortable emotions, including but not limited to sorrow, regret, anxiety, frustration. anger, loneliness, and feeling powerless, may be encountered during the counselling process, as it frequently entails the disclosure of unfavourable facets of one&apos;s life.</p>
                  <p>Counselling results in substantial reductions in distress levels, enhancements in interpersonal satisfaction, increased self-awareness and insight, improved stress management abilities, and successful resolutions to particular issues.</p>
                  <p>However, the future cannot be predicted with absolute certainty.</p>
                  <p>Counselling involves a significant commitment of your time, energy, and willingness.</p>
                  <p>To achieve optimum success, you will need to implement what you learn during therapy to your daily life.</p>

                  <h3 className="font-serif text-xl md:text-2xl text-[var(--foreground)] font-light mt-6">THERAPEUTIC ORIENTATION</h3>
                  <p>As an advocate for personalised treatment, the approach to client interaction may vary in accordance with the specific requirements and inclinations of each unique and individual client.</p>
                  <p>By employing a strengths-based approach, an effort is made to emphasise the client&apos;s capabilities while candidly acknowledging challenges. Recognising and valuing the client&apos;s desire to be heard, understood, and validated through attentive listening. Utilising psychosocial and attachment-based methodologies to aid individuals in recognising the correlations between their current relationship dynamics/behavioural patterns and their previous experiences.</p>
                  <p>Therapeutic approaches commonly integrate a blend of directive and relational therapies, such as cognitive-behavioural therapy and interpersonal therapy.</p>

                  <h3 className="font-serif text-xl md:text-2xl text-[var(--foreground)] font-light mt-6">APPOINTMENTS</h3>
                  <p>Initial intake session lasts for 90 minutes, and subsequent sessions last for 60 minutes. Appointments may be scheduled once weekly or once every two weeks, as agreed. There will invariably be exceptions contingent upon the specific personal needs of the individual.</p>

                  <h3 className="font-serif text-xl md:text-2xl text-[var(--foreground)] font-light mt-6">PREPAYMENT POLICY</h3>
                  <p>For online booking, prepayment is required at the time of booking to ensure the appointment time is reserved. If you require additional information regarding service fees or available times, please send an email to <a href="mailto:dan@themelbournecounsellor.com.au" className="underline">dan@themelbournecounsellor.com.au</a> or call Dan to discuss on 0467 477 786. All fees are inclusive of GST.</p>

                  <h3 className="font-serif text-xl md:text-2xl text-[var(--foreground)] font-light mt-6">CANCELLATION &amp; RESCHEDULING POLICY</h3>
                  <p>It should be noted that the online booking system of &quot;The Financial Therapist&quot; does not provide support for online cancellations or rescheduling. Notifications of rescheduling or cancellation must be validated by contacting Dan at 0467 477 786. Post-telephone confirmation of the cancellation or rescheduling will be provided via email. The client shall not consider the appointment cancelled or rescheduled in the absence of a confirmatory phone call and an email confirming the change.</p>
                  <p>Kindly note that cancellations received less than 72 hours prior to the scheduled appointment time will not be accepted.</p>
                  <p>We acknowledge that there may be instances where matters transpire in ways beyond the clients&apos; control, including extenuating circumstances or emergency situations. Should this circumstance arise with less than twenty-four hours&apos; notice, kindly contact Dan at 0467 477 786 to discuss the matter in greater detail. All cases will be considered on a case by case basis.</p>

                  <h3 className="font-serif text-xl md:text-2xl text-[var(--foreground)] font-light mt-6">LATE APPOINTMENTS POLICY</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Text message and email reminders will be transmitted to the client prior to their scheduled appointment.</li>
                    <li>&quot;The Financial Therapist&quot; shall allow a fifteen-minute grace period before considering the appointment non-refundable in the event that the client arrives late for the scheduled session.</li>
                    <li>Should the client arrive late for their scheduled appointment, the duration of the appointment will be reduced by the same amount of time that the client was delayed.</li>
                  </ul>

                  <h3 className="font-serif text-xl md:text-2xl text-[var(--foreground)] font-light mt-6">CLIENT INFORMATION, PROFESSIONAL RECORDS, PRIVACY POLICY &amp; DISCLOSURE OF PERSONAL INFORMATION POLICY</h3>
                  <p>Client notes are kept private and secure on software for a private practice that safeguards client documents. The legal obligations of the Privacy Act 1988 and the Australian Privacy Principles govern your clinical records. Personal information of the client, including but not limited to name, address, contact phone number, medical history, and email addresses, chat logs, and text messages exchanged between the client and The Financial Therapist, is considered client information as defined by the Act.</p>
                  <p>All personal information gathered during the provision of the counselling service will remain confidential and secure except where:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Information is subpoenaed by a court, or</li>
                    <li>Failure to disclose the information would place you or another person at serious and imminent risk; or</li>
                    <li>Your prior approval has been obtained to: Provide a written report to another professional or agency (e.g., a GP or a lawyer); or discuss the material with another person (e.g., an employer); or if disclosure is otherwise required or authorised by law.</li>
                  </ul>
                  <p>The privacy of your personal information is important to us. Any personal information collected will be handled in accordance with our privacy policy.</p>

                  <h3 className="font-serif text-xl md:text-2xl text-[var(--foreground)] font-light mt-6">ZOOM/VIDEO CONFERENCING/TELE-HEALTH POLICY</h3>
                  <p>The provision of Zoom video conferencing services is governed by the Privacy Act of 1988. Kindly note that any expenses related to the provision of your own software, hardware, and data utilisation in connection with this service are your responsibility.</p>

                  <h3 className="font-serif text-xl md:text-2xl text-[var(--foreground)] font-light mt-6">INFORMATION AND ACCURACY POLICY</h3>
                  <p>This website&apos;s content is restricted to Australian residents only. The sole purpose of the website is to deliver information. At the time of compilation, the information presented on the website is believed to be accurate and is provided in good faith.</p>

                  <h3 className="font-serif text-xl md:text-2xl text-[var(--foreground)] font-light mt-6">COPYRIGHT AND TRADEMARKS POLICY</h3>
                  <p>All material presented on this website is safeguarded by copyright regulations. This content may be utilised exclusively for personal reference purposes. The material on this website may not be used, reproduced, published, modified, distributed, linked, framed, or transmitted in any way, electronic or mechanical, for any purpose, without The Financial Therapist Pty Ltd.’s prior written consent. The Financial Therapist Trust or third parties with whom The Financial Therapist Pty Ltd maintains an affiliation own the trademarks utilised on this website. Utilising a trademark featured on this website without the owner&apos;s prior written consent is strictly prohibited.</p>

                  <h3 className="font-serif text-xl md:text-2xl text-[var(--foreground)] font-light mt-6">LINKS POLICY</h3>
                  <p>Links to third-party-owned and operated websites may be present on this website. We do not provide any assurance, warranty, or representation regarding the content or privacy policies of third-party websites or the privacy practices of any third parties. The client acknowledges and commits to providing indemnification for The Financial Therapist Pty Ltd and all affiliated service providers against any claims, losses, damages, injuries, objections, or litigation that may result from cancellations executed in accordance with these terms and conditions.</p>

                  <h3 className="font-serif text-xl md:text-2xl text-[var(--foreground)] font-light mt-6">OTHER RIGHTS</h3>
                  <p>You retain the autonomy to terminate therapy at any point and may request a referral to a different therapist. Every person has the inherent right to receive compassionate, safe, and honourable care, regardless of their socioeconomic status, age, religion, national origin, race, ethnicity, skin tone, sexual orientation, or national origin.</p>

                  <h3 className="font-serif text-xl md:text-2xl text-[var(--foreground)] font-light mt-6">GOVERNING LAW</h3>
                  <p>By visiting this website, you agree that the laws of the state of Victoria, Australia without regard to principles of conflict of laws, will govern these Conditions of Use and any dispute of any sort that might arise between you and The Financial Therapist Pty. Ltd.</p>

                  <h3 className="font-serif text-xl md:text-2xl text-[var(--foreground)] font-light mt-6">DISCLAIMER</h3>
                  <p>The purpose of publishing this information is to provide you with details regarding The Financial Therapist Pty. Ltd. and the way it operates. We have made every effort to ensure that the information provided is accurate. However, we reserve the right to modify the information without prior notice.</p>
                  <p>The Financial Therapist Pty. Ltd. disclaims all responsibility and liability, to the extent permitted by law, for any losses or damages of any kind that may result from the utilisation of the website&apos;s content.</p>
                  <p>Without our express permission, you may download the information for your own personal use but may not reproduce it for any other purpose.</p>

                  <h3 className="font-serif text-xl md:text-2xl text-[var(--foreground)] font-light mt-6">CONSENT TO COUNSELLING AND PSYCHOTHERAPY SERVICES</h3>
                  <p>This is a digital agreement which confirms that you have read the document and consent to receiving Counselling and Psychotherapy Services from The Financial Therapist.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                  <p className="text-[var(--primary)]">
                    I hereby acknowledge that I have read and understood this Informed Consent, Disclosure and Policies Document from The Financial Therapist Pty. Ltd. By pressing the “Send” button, I am agreeing to all the terms and conditions enclosed herewith.
                  </p>
                  <div>
                    <p className="text-sm text-[var(--primary)]/80">Print &quot;I have read &amp; I understand the contents of this document&quot; <span className="text-[var(--accent)]">(required)</span></p>
                    <div className="mt-2 space-y-2">
                      <Label htmlFor="statement">Required statement</Label>
                      <Input
                        id="statement"
                        placeholder={REQUIRED_STATEMENT}
                        value={form.statement}
                        onChange={(e) => setForm({ ...form, statement: e.target.value })}
                        required
                      />
                    </div>
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

                  <div className="grid gap-4 md:grid-cols-2">
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
                      <Label htmlFor="fullName">Print Full Name <span className="text-[var(--accent)]">(required)</span></Label>
                      <Input
                        id="fullName"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {submitted === 'ok' && (
                    <div className="text-sm rounded-md p-3 border border-green-200 bg-green-50 text-green-700">
                      Thank you — your consent has been recorded and sent.
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

                <div className="space-y-2 pt-6 text-[var(--primary)]">
                  <p>Informed Consent, Disclosure and Policies Document for “The Financial Therapist” Therapy Services.</p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <a href="/enquiry" className="underline">Enquiry Form</a>
                    <a href="/intake" className="underline">Intake Form</a>
                    <span>Consent Form</span>
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
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


