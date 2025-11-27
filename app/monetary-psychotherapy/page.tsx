import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Navigation, Footer } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { readSiteConfig } from "@/lib/config"

export const metadata = {
  title: "Monetary Psychotherapy | Heal Your Relationship with Money",
  description:
    "Explore trauma-informed monetary psychotherapy with Dan Lobel. Understand money stories, rebuild self-worth, and make values-aligned decisions.",
  alternates: {
    canonical: "https://financialabusetherapist.com/monetary-psychotherapy",
  },
  openGraph: {
    title: "Monetary Psychotherapy",
    description:
      "A consent-led space to unpack money, shame, and self-worth — online and in Melbourne.",
    type: "article",
    url: "https://financialabusetherapist.com/monetary-psychotherapy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monetary Psychotherapy",
    description: "Heal your relationship with money through evidence-based counselling.",
  },
}

export default async function MonetaryPsychotherapyPage() {
  const config = await readSiteConfig()
  const heroList = [
    "Feel anxiety or guilt when spending or saving",
    "Struggle with financial control or dependency in relationships",
    "Carry generational stories about scarcity, duty, or worth",
    "Have experienced financial infidelity, exploitation, or loss",
    "Want to build confidence in financial conversations and decisions",
  ]
  const focusList = [
    "Exploring the emotional roots of your financial story",
    "Healing shame and rebuilding self-worth",
    "Creating values-aligned spending, saving, and giving practices",
    "Developing resilience, independence, and long-term confidence",
  ]

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>
        <section className="py-24 md:py-32 bg-gradient-to-b from-[#cce1e6] via-[#dfead2] to-[#f9f7ef]">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-5xl mx-auto space-y-10 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-semibold">Monetary Psychotherapy</p>
              <h1 className="font-serif text-4xl md:text-6xl text-[var(--foreground)] font-light">
                Money carries stories. Some are empowering — others hold pain.
              </h1>
              <p className="text-xl text-[var(--primary)] max-w-3xl mx-auto">
                Monetary Psychotherapy explores the connection between money, emotion, meaning, and identity. Together we
                look at how nervous system responses, cultural expectations, and lived experiences shape financial
                behaviour — then build safer ways forward.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button asChild className="h-12 px-8 bg-[var(--accent)] text-white hover:opacity-90">
                  <Link href="/bookings">Book a consultation</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 px-8">
                  <Link href="/enquiry">Ask about suitability</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-5xl mx-auto grid gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl text-[var(--foreground)] font-light">
                  This work is for you if you:
                </h2>
                <ul className="space-y-4 text-[var(--primary)]">
                  {heroList.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 text-[var(--accent)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl text-[var(--foreground)] font-light">Session focus</h2>
                <ul className="space-y-4 text-[var(--primary)]">
                  {focusList.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 text-[var(--accent)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-[var(--primary)]/80">🕊 This is emotional healing for the financial self — not financial advice.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[var(--section-bg-1)]">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="space-y-3 text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)]">Method</p>
                <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
                  Safety, consent, and practical change
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { title: "Regulate", detail: "Gentle nervous-system work to reduce overwhelm before talking money." },
                  { title: "Reframe", detail: "Understand inherited beliefs, trauma responses, and protective behaviours." },
                  { title: "Rebuild", detail: "Create values-aligned action plans and communication scripts." },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="rounded-3xl border border-[var(--primary)]/20 bg-white/80 p-6 text-center space-y-3"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)]">{card.title}</p>
                    <p className="text-[var(--foreground)]">{card.detail}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-[32px] border border-[var(--primary)]/20 bg-white/90 p-8 space-y-4">
                <h3 className="font-serif text-3xl text-[var(--foreground)] font-light">Aftercare & integration</h3>
                <p className="text-[var(--primary)] leading-relaxed">
                  Sessions close with grounding exercises, resourcing strategies, and optional between-session check-ins.
                  You’ll receive reflective prompts or practical tools to keep momentum without pressure.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-2">
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)]">Formats & pacing</p>
                <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">How we can work together</h2>
                <ul className="space-y-3 text-[var(--primary)]">
                  <li>• 50-minute or 90-minute telehealth consultations</li>
                  <li>• In-room sessions in South Yarra</li>
                  <li>• Walk-and-talk and in-home therapy for nervous-system support</li>
                  <li>• Optional extended assessment for complex histories</li>
                </ul>
                <p className="text-[var(--primary)]">
                  Fees and current availability are listed on the bookings page. Sliding-scale places are offered when
                  capacity allows — reach out to enquire.
                </p>
              </div>
              <div className="rounded-[32px] border border-[var(--primary)]/20 bg-[var(--section-bg-2)]/80 p-8 space-y-4">
                <h3 className="text-xl font-semibold text-[var(--foreground)]">Getting started</h3>
                <ol className="space-y-3 text-[var(--primary)] list-decimal list-inside">
                  <li>Book a consultation online or submit the enquiry form.</li>
                  <li>Complete the consent & intake forms when you feel ready.</li>
                  <li>We pace the first sessions around safety, context, and goals.</li>
                </ol>
                <div className="grid gap-3 sm:grid-cols-2 pt-2">
                  <Button asChild variant="outline" className="h-12">
                    <Link href={config.forms?.enquiry || "/enquiry"}>Enquiry form</Link>
                  </Button>
                  <Button asChild variant="outline" className="h-12">
                    <Link href={config.forms?.intake || "/intake"}>Intake form</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[var(--section-bg-1)]">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)]">Next steps</p>
              <h3 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
                Your financial story can feel lighter.
              </h3>
              <p className="text-lg text-[var(--primary)]">
                Whether you’re untangling coercive control, healing from burnout, or building a healthier money culture,
                monetary psychotherapy offers a steady, judgment-free space.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="h-12 px-8 bg-[var(--accent)] text-white hover:opacity-90">
                  <Link href="/bookings">See availability</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 px-8">
                  <Link href="/financial-abuse">Learn about financial abuse</Link>
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

