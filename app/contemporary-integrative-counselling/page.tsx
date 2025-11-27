import Link from "next/link"
import { Navigation, Footer } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { readSiteConfig } from "@/lib/config"

export const metadata = {
  title: "Contemporary Integrative Counselling | Financial Abuse Therapist",
  description:
    "Learn how Dan Lobel blends trauma-informed, somatic, and behavioural therapies to support nervous-system regulation, agency, and values-aligned action.",
  alternates: {
    canonical: "https://financialabusetherapist.com/contemporary-integrative-counselling",
  },
  openGraph: {
    title: "Contemporary Integrative Counselling",
    description:
      "Consent-led counselling that integrates somatic, relational, and behavioural approaches for financial trauma and life transitions.",
    type: "article",
    url: "https://financialabusetherapist.com/contemporary-integrative-counselling",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contemporary Integrative Counselling",
    description: "Safety-first therapy rooted in pacing, agency, and collaboration.",
  },
}

export default async function IntegrativeCounsellingPage() {
  const config = await readSiteConfig()
  const aboutParagraphs = config.about?.paragraphs ?? []
  const values = ["Empathy", "Trust", "Respect", "Authenticity", "Compassion", "Collaboration"]

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)]">Therapeutic Philosophy</p>
              <h1 className="font-serif text-4xl md:text-6xl text-[var(--foreground)] font-light">
                Contemporary Integrative Counselling
              </h1>
              <p className="text-xl text-[var(--primary)]">
                Therapy paced by you. Consent, choice, and clear boundaries sit at the heart of every session. We only go
                as far as your nervous system feels resourced to travel.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button asChild className="h-12 px-8 bg-[var(--accent)] text-white hover:opacity-90">
                  <Link href="/bookings">Book a session</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 px-8">
                  <Link href="/enquiry">Discuss fit</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed text-[var(--primary)]">
              {aboutParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[var(--section-bg-1)]">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-[1fr,1fr]">
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)]">Modalities blended</p>
                <h2 className="font-serif text-4xl text-[var(--foreground)] font-light">What integrative means here</h2>
                <ul className="space-y-3 text-[var(--primary)]">
                  <li>• Polyvagal-informed nervous-system regulation</li>
                  <li>• Parts work & attachment repair</li>
                  <li>• Somatic processing & grounding practices</li>
                  <li>• Behavioural experiments & practical planning</li>
                  <li>• Financial therapy frameworks & money scripts</li>
                </ul>
              </div>
              <div className="rounded-[32px] border border-[var(--primary)]/20 bg-white/85 p-8 space-y-4">
                <h3 className="text-xl font-semibold text-[var(--foreground)]">Session structure</h3>
                <p className="text-[var(--primary)]">
                  We co-create every session. Expect time to settle, agree on focus, explore gently, and close with
                  integration. You can pause, redirect, or slow down at any point.
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {["Attune", "Explore", "Integrate", "Plan"].map((phase) => (
                    <div
                      key={phase}
                      className="rounded-2xl border border-[var(--primary)]/20 bg-[var(--section-bg-2)]/70 px-4 py-5 text-center text-[var(--foreground)] font-medium"
                    >
                      {phase}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="space-y-3 text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)]">Core values</p>
                <h2 className="font-serif text-4xl text-[var(--foreground)] font-light">The qualities we return to</h2>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {values.map((value) => (
                  <span
                    key={value}
                    className="px-5 py-2 bg-white text-[var(--foreground)] text-sm rounded-full border border-[var(--primary)]/20"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[var(--section-bg-1)]">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)]">Next steps</p>
              <h3 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
                Healing moves at the speed of safety.
              </h3>
              <p className="text-lg text-[var(--primary)]">
                Book a consultation or reach out if you want to check if this approach feels right. We will always begin
                with consent, curiosity, and collaboration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="h-12 px-8 bg-[var(--accent)] text-white hover:opacity-90">
                  <Link href="/#book">Book online</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 px-8">
                  <Link href="/consent">View consent information</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

