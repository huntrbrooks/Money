import Link from "next/link"
import { Navigation, Footer } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { readSiteConfig } from "@/lib/config"

export const metadata = {
  title: "Client Care Hub | The Financial Therapist",
  description: "Session preparation, aftercare rituals, and crisis resources for clients working with Dan Lobel.",
}

const prepChecklist = [
  "Find a private, comfortable space and something grounding to hold.",
  "Take 90 seconds to notice your breathing and name one intention for the session.",
  "Have a glass of water, journal, or tissues nearby.",
]

const aftercare = [
  "Give yourself at least 10 minutes before diving into work or caretaking.",
  "Drink water, have a snack, and if possible step outside for fresh air.",
  "Note one insight or feeling you’d like to revisit next session.",
]

const downloads = [
  { label: "Consent & Policies", href: "/consent" },
  { label: "Enquiry Form", href: "/enquiry" },
  { label: "Intake Form", href: "/intake" },
  { label: "Financial Safety Check-in", href: "/newsletter" },
]

export default async function ClientCarePage() {
  const config = await readSiteConfig()
  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>
        <section className="py-16 md:py-24 bg-[var(--section-bg-1)]">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-semibold">Client care hub</p>
              <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
                Grounding resources for before and after session
              </h1>
              <p className="text-[var(--primary)] text-lg">
                Save this page to revisit rituals, crisis contacts, and downloads whenever you need them.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 grid gap-6 lg:grid-cols-2">
            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle>Session preparation (5 minutes)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-[var(--primary)]">
                  {prepChecklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle>Aftercare ritual</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-[var(--primary)]">
                  {aftercare.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 bg-[var(--section-bg-2)]">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto space-y-6 text-center">
              <h2 className="font-serif text-3xl md:text-4xl text-[var(--foreground)] font-light">
                Downloads & forms
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {downloads.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl border border-[var(--secondary)] bg-white p-4 text-[var(--primary)] hover:shadow-md"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="font-serif text-3xl text-[var(--foreground)] font-light">Need support between sessions?</h3>
              <p className="text-[var(--primary)]">
                Book a check-in or send a secure message if something urgent shifts.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="h-12 px-8 bg-[var(--accent)] text-white">
                <Link href="/bookings">Book a check-in</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-8">
                <Link href="/enquiry">Send a message</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="font-serif text-3xl text-[var(--foreground)] font-light">Crisis & helplines</h3>
              <p className="text-[var(--primary)]">
                If you or someone you know is in immediate danger, call triple zero (000) right away.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(config.resources ?? []).map((resource) => (
                <Card key={resource.name} className="bg-[var(--section-bg-1)]/70">
                  <CardHeader>
                    <CardTitle className="text-[var(--foreground)]">{resource.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-[var(--primary)]">
                    <p>{resource.description}</p>
                    <p className="font-semibold">{resource.number}</p>
                    {resource.website && (
                      <Link className="text-[var(--accent)] underline" href={resource.website}>
                        Visit website
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

