import Link from "next/link"
import { Navigation, Footer } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { readSiteConfig } from "@/lib/config"

export const metadata = {
  title: "Client Care Hub | The Financial Therapist",
  description: "Session preparation, aftercare rituals, and crisis resources for clients working with Dan Lobel.",
}

export default async function ClientCarePage() {
  const config = await readSiteConfig()
  const prepChecklist = config.clientCare?.prepChecklist ?? []
  const aftercare = config.clientCare?.aftercareChecklist ?? []
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
            <Card className="bg-[var(--section-bg-2)]/90">
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
            <Card className="bg-[var(--section-bg-2)]/90">
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
                <Button
                  asChild
                  className="w-full h-12 font-medium bg-[var(--section-bg-2)] text-[var(--foreground)] border-transparent hover:opacity-90 shadow-sm rounded-lg"
                >
                  <Link href="/enquiry" className="no-underline">
                    Inquiry Form
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full h-12 font-medium bg-[var(--section-bg-2)] text-[var(--foreground)] border-transparent hover:opacity-90 shadow-sm rounded-lg"
                >
                  <Link href="/intake" className="no-underline">
                    Intake Form
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full h-12 font-medium bg-[var(--section-bg-2)] text-[var(--foreground)] border-transparent hover:opacity-90 shadow-sm rounded-lg"
                >
                  <Link href="/privacy" className="no-underline">
                    Privacy Policy
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full h-12 font-medium bg-[var(--section-bg-2)] text-[var(--foreground)] border-transparent hover:opacity-90 shadow-sm rounded-lg"
                >
                  <Link href="/terms" className="no-underline">
                    Terms of Service
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[var(--section-bg-1)]">
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

