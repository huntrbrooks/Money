import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Navigation, Footer } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { readSiteConfig } from "@/lib/config"
import { buildPageMetadata, buildServiceSchema } from "@/lib/seo"

const PAGE_TITLE = "Monetary Psychotherapy | Heal Your Relationship With Money"
const PAGE_DESCRIPTION =
  "Explore Dan Lobel’s monetary psychotherapy approach: trauma-informed care that connects emotions, money stories, and nervous-system safety for women experiencing financial stress."
const PAGE_KEYWORDS = ["monetary psychotherapy", "money anxiety therapy", "financial trauma counselling"]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: "/monetary-psychotherapy",
    keywords: PAGE_KEYWORDS,
    type: "article",
  })
}

export default async function MonetaryPsychotherapyPage() {
  const config = await readSiteConfig()
  const page = config.monetaryPsychotherapyPage ?? {
    eyebrow: "Monetary Psychotherapy",
    title: "Money carries stories. Some are empowering — others hold pain.",
    subtitle: "Understanding those stories is the first step toward emotional and financial freedom.",
    intro: "Monetary psychotherapy explores the deep connection between money, emotion, and self-identity. It's a trauma-informed space for women who have felt disempowered by financial control, scarcity, or uncertainty — especially during life transitions, separation, or rebuilding after abuse.",
    designedFor: [],
    sessionFocus: [],
    therapeuticPrinciples: [],
    howWeBegin: [],
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-5xl mx-auto space-y-8 text-[var(--primary)] leading-relaxed">
              {page.eyebrow && (
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">{page.eyebrow}</p>
              )}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--foreground)] font-light leading-tight">
                {page.title}
              </h1>
              <p className="text-xl text-[var(--foreground)]">
                {page.subtitle}
              </p>
              <p>
                {page.intro}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild className="bg-[var(--accent)] hover:opacity-90 text-white h-12 px-8 shadow-md">
                  <Link href="/bookings">
                    Book a consultation
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 px-8">
                  <Link href="/enquiry">Ask a Question</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {(page.designedFor && page.designedFor.length > 0) || (page.sessionFocus && page.sessionFocus.length > 0) ? (
          <section className="py-24 md:py-32 bg-[var(--section-bg-1)]">
            <div className="container mx-auto px-6 md:px-8">
              <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-2">
                {page.designedFor && page.designedFor.length > 0 && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-3xl md:text-4xl text-[var(--foreground)] font-light">Designed for women who:</h2>
                    <ul className="space-y-4">
                      {page.designedFor.map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-lg text-[var(--primary)]">
                          <CheckCircle2 className="w-6 h-6 text-[var(--accent)] flex-shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {page.sessionFocus && page.sessionFocus.length > 0 && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-3xl md:text-4xl text-[var(--foreground)] font-light">Session focus:</h2>
                    <ul className="space-y-4">
                      {page.sessionFocus.map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-lg text-[var(--primary)]">
                          <CheckCircle2 className="w-6 h-6 text-[var(--accent)] flex-shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-[var(--primary)]/80 pt-2">
                      🕊 This is not financial advice — it's emotional healing for the financial self.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {page.therapeuticPrinciples && page.therapeuticPrinciples.length > 0 && (
          <section className="py-24 md:py-32">
            <div className="container mx-auto px-6 md:px-8">
              <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
                {page.therapeuticPrinciples.map((principle, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl border border-[var(--secondary)] bg-[var(--section-bg-1)] p-6 shadow-[0_20px_60px_rgba(32,56,91,0.08)]"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">Principle</p>
                    <h3 className="font-serif text-2xl text-[var(--foreground)] mt-2">{principle.title}</h3>
                    <p className="text-[var(--primary)] mt-3 leading-relaxed">{principle.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {page.howWeBegin && page.howWeBegin.length > 0 && (
          <section className="py-24 md:py-32 bg-[var(--section-bg-2)]">
            <div className="container mx-auto px-6 md:px-8">
              <div className="max-w-4xl mx-auto space-y-6 text-[var(--primary)] leading-relaxed">
                <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light text-center">
                  How we begin
                </h2>
                <ol className="list-decimal pl-6 space-y-3">
                  {page.howWeBegin.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              <div className="pt-4 flex flex-wrap gap-4 justify-center">
                <Button asChild className="h-12 px-8 bg-[var(--accent)] text-white">
                  <Link href="/bookings">Start Monetary Psychotherapy</Link>
                </Button>
                <Button asChild variant="ghost" className="h-12 px-8 text-[var(--accent)] hover:text-[var(--accent)]">
                  <Link href="/about">Meet Dan</Link>
                </Button>
              </div>
              <p className="text-sm text-center text-[var(--primary)]/70">
                Further reading:{" "}
                <a className="underline" href="/why-money-triggers-anxiety-dan-lobel.html">
                  Why Money Triggers Anxiety
                </a>{" "}
                ·{" "}
                <a className="underline" href="/financial-abuse-emotional-healing-dan-lobel.html">
                  Financial Abuse and Emotional Healing
                </a>{" "}
                ·{" "}
                <a className="underline" href="/the-psychology-behind-spending-habits-dan-lobel.html">
                  The Psychology Behind Spending Habits
                </a>
              </p>
            </div>
          </div>
        </section>
        )}
      </main>
      <Footer />
      <Script
        id="monetary-psychotherapy-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildServiceSchema(config, {
              serviceType: "Monetary Psychotherapy",
              description: PAGE_DESCRIPTION,
            }),
          ),
        }}
      />
    </div>
  )
}



