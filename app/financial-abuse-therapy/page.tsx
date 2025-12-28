import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { Navigation, Footer } from "@/components/navigation"
import { readSiteConfig } from "@/lib/config"
import { buildFaqSchema, buildPageMetadata, buildServiceSchema } from "@/lib/seo"

const PAGE_TITLE = "Financial Abuse Therapy | Trauma-Informed Counselling — Melbourne & Telehealth"
const PAGE_DESCRIPTION =
  "Gentle, trauma-informed therapy for financial abuse and economic control. Restore safety, dignity, and practical confidence. Melbourne and Telehealth across Australia."
const PAGE_KEYWORDS = ["financial abuse therapy", "economic abuse counselling", "telehealth trauma therapy"]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: "/financial-abuse-therapy",
    keywords: PAGE_KEYWORDS,
  })
}

export default async function FinancialAbuseTherapyPage() {
  const config = await readSiteConfig()
  const page = config.financialAbuseTherapyPage ?? {
    eyebrow: "Financial Trauma & Monetary Psychotherapy",
    title: "Financial Abuse Therapy",
    description: "A gentle, consent‑led path to restore safety, autonomy, and self‑trust after financial control or coercion.",
    therapyApproach: [],
    sessionFormats: [],
    nextStepsLinks: [],
    faqs: [],
  }

  const serviceJsonLd = buildServiceSchema(config, {
    serviceType: "Financial abuse therapy",
    description: PAGE_DESCRIPTION,
    url: "/bookings",
  })
  const faqJsonLd = buildFaqSchema(page.faqs ?? [])

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>
        <div className="container mx-auto px-4 py-16">
          <article className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-2 pb-6 border-b border-[var(--secondary)]">
          {page.eyebrow && (
            <div className="text-xs tracking-wider uppercase text-[var(--primary)]">
              {page.eyebrow}
            </div>
          )}
          <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
            {page.title}
          </h1>
          <p className="text-[var(--primary)]">
            {page.description}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[var(--accent)] text-white font-semibold border border-[var(--accent)] hover:opacity-90"
              href="/bookings"
              aria-label="Book a counselling session"
            >
              Book a Session
            </Link>
            <Link
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[var(--section-bg-1)] text-[var(--accent)] font-semibold border border-[var(--accent)] hover:bg-[var(--section-bg-2)]/60"
              href="/enquiry"
              aria-label="Contact"
            >
              Contact
            </Link>
          </div>
        </header>

        {page.therapyApproach && page.therapyApproach.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">Therapy approach</h2>
            <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
              {page.therapyApproach.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {page.sessionFormats && page.sessionFormats.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">Session formats</h2>
            <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
              {page.sessionFormats.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {page.nextStepsLinks && page.nextStepsLinks.length > 0 && (
          <nav className="border border-[var(--secondary)] rounded-xl p-4 bg-[var(--section-bg-1)]">
            <strong className="text-[var(--foreground)]">Explore more</strong>
            <ul className="mt-2 grid gap-1 list-disc pl-5 text-[var(--accent)]">
              {page.nextStepsLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}
          </article>
        </div>
      </main>
      <Footer />
      <Script
        id="financial-abuse-therapy-service"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id="financial-abuse-therapy-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  )
}


