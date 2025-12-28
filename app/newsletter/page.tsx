import { Navigation, Footer } from "@/components/navigation"
import { NewsletterModal } from "@/components/newsletter-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { readSiteConfig } from "@/lib/config"

export const metadata = {
  title: "Newsletter & Safety Check-in | The Financial Therapist",
  description: "Subscribe to Dan's gentle updates and receive the 5-step Financial Safety Check-in to use between sessions.",
}

export default async function NewsletterPage() {
  const config = await readSiteConfig()
  const formPage = config.formPages?.newsletter
  const homepageCopy = config.homepage?.copy

  // Default content if config not available
  const pageTitle = formPage?.title ?? "A gentler money letter (and a safety ritual to start)"
  const pageDescription = formPage?.subtitle ?? homepageCopy?.newsletterBody ?? "Join the list to receive the 5-step Financial Safety Check-in plus occasional notes when new resources or sessions become available. No spam, just care."
  const triggerLabel = homepageCopy?.newsletterCtaLabel ?? "Email me the check-in"
  const tags = homepageCopy?.newsletterTags ?? ["newsletter", "safety-check-in"]

  // Default topics - could be moved to config later if needed
  const topics = [
    "Financial abuse recovery practices and scripts.",
    "Nervous-system-aware rituals for money admin.",
    "Updates on availability, new resources, and workshops.",
  ]

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>
        <section className="py-16 md:py-24 bg-[var(--section-bg-1)]">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto space-y-6 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-semibold">Newsletter</p>
              <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">{pageTitle}</h1>
              <p className="text-[var(--primary)] text-lg">{pageDescription}</p>
              <div className="flex justify-center pt-2">
                <NewsletterModal triggerLabel={triggerLabel} tags={tags} formPage={formPage} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>What you'll receive</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-[var(--primary)]">
                  {topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Frequency & respect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-[var(--primary)]">
                <p>Emails are sent roughly once a month, sometimes less. Your details aren't shared with anyone.</p>
                <p>
                  You can unsubscribe anytime with one click. Need urgent support? Visit the{' '}
                  <a href="/client-care" className="underline">
                    Client Care Hub
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}














