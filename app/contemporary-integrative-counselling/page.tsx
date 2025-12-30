import type { Metadata } from "next"
import Link from "next/link"
import { Navigation, Footer } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { readSiteConfig } from "@/lib/config"
import { buildPageMetadata } from "@/lib/seo"

const PAGE_DESCRIPTION =
  "Discover Dan Lobel’s contemporary integrative counselling approach — trauma-informed, nervous-system-aware support that blends monetary psychotherapy with evidence-based modalities."

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Contemporary Integrative Counselling | The Financial Therapist",
    description: PAGE_DESCRIPTION,
    path: "/contemporary-integrative-counselling",
    keywords: ["integrative counselling", "trauma informed therapy", "melbourne counsellor"],
  })
}

const pillars = [
  { title: "Safety first", detail: "Sessions begin with nervous-system check-ins, consent, and co-created boundaries." },
  { title: "Meaning-making", detail: "We explore the “why” behind patterns, stories, and protective responses." },
  { title: "Practical next steps", detail: "You leave with grounded actions that honour the realities of your life." },
]

const sessionRhythm = [
  "Arrive — regulate together, clarify what feels safe to explore.",
  "Name — notice emotions, body cues, and money narratives without judgement.",
  "Integrate — practice new language, boundaries, or choices that feel doable.",
  "Close — ground, honour progress, and plan gentle next steps.",
]

const coreValues = ["Empathy", "Trust", "Respect", "Authenticity", "Compassion", "Collaboration"]

export default async function ContemporaryIntegrativeCounsellingPage() {
  const config = await readSiteConfig()
  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">Therapeutic Approach</p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--foreground)] font-light leading-tight">
                Contemporary Integrative Counselling
              </h1>
              <p className="text-xl text-[var(--foreground)]">
                Therapy is paced by you. Consent, choice, and clear boundaries remain central from the first session onward.
              </p>
              <p className="text-[var(--primary)] leading-relaxed">
                Drawing on monetary psychotherapy alongside integrative, evidence-based modalities, Dan supports the emotional,
                relational, and practical dimensions of financial stress — helping you reconnect with agency, dignity, and hope.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild className="h-12 px-8 bg-[var(--accent)] text-white">
                  <Link href="/bookings">Book a consultation</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 px-8">
                  <Link href="/about">Meet Dan</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 bg-[var(--section-bg-1)]">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="rounded-3xl border border-[var(--secondary)] bg-[var(--section-bg-1)] p-6 space-y-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">Pillar</p>
                  <h3 className="font-serif text-2xl text-[var(--foreground)]">{pillar.title}</h3>
                  <p className="text-[var(--primary)] leading-relaxed">{pillar.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-4xl mx-auto space-y-6 text-[var(--primary)] leading-relaxed">
              <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">How sessions feel</h2>
              {(config.about?.paragraphs ?? []).map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
              <div className="rounded-2xl border border-[var(--secondary)] bg-[var(--section-bg-2)] p-8 space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">Session rhythm</p>
                <ol className="list-decimal pl-5 space-y-2">
                  {sessionRhythm.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 bg-[var(--section-bg-2)]">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-5xl mx-auto space-y-8 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">Core values</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {coreValues.map((value) => (
                  <span
                    key={value}
                    className="px-5 py-2 bg-[var(--section-bg-1)] text-[var(--primary)] text-sm rounded-full border border-[var(--primary)]/20"
                  >
                    {value}
                  </span>
                ))}
              </div>
              <p className="text-lg text-[var(--primary)] max-w-3xl mx-auto leading-relaxed">
                These values guide every interaction — whether you are processing financial abuse, exploring identity, or finding
                language for grief and transition.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild className="h-12 px-8 bg-[var(--accent)] text-white">
                  <Link href="/monetary-psychotherapy">Discover Monetary Psychotherapy</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 px-8">
                  <Link href="/bookings">Schedule a Session</Link>
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



