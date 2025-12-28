import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { readSiteConfig } from "@/lib/config"
import { buildPageMetadata, buildPersonSchema } from "@/lib/seo"

const PAGE_TITLE = "Financial Abuse Therapist | The Financial Therapist — Dan Lobel"
const PAGE_DESCRIPTION =
  "Work with a Financial Abuse Therapist. Trauma-informed counselling focused on safety, dignity, and practical confidence. Melbourne & Telehealth."
const PAGE_KEYWORDS = ["financial abuse therapist", "financial trauma counsellor", "melbourne telehealth therapist"]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: "/financial-abuse-therapist",
    keywords: PAGE_KEYWORDS,
    type: "profile",
  })
}

export default async function FinancialAbuseTherapistPage() {
  let config
  try {
    config = await readSiteConfig()
  } catch (error) {
    console.error("Error reading site config:", error)
    // Fallback to minimal config
    config = {
      brand: { subtitle: "Dan Lobel" },
      hero: { imageUrl: "/Dan.png" },
      contact: { phone: undefined },
    } as any
  }
  const personJsonLd = buildPersonSchema(config, {
    name: config.brand?.subtitle ?? "Dan Lobel",
    description: "Financial Abuse Therapist — trauma-informed counselling and monetary psychotherapy.",
    jobTitle: "Counsellor & Monetary Psychotherapist",
    image: config.hero?.imageUrl || "/Dan.png",
    url: "/financial-abuse-therapist",
    telephone: config.contact?.phone,
  })
  return (
    <div className="container mx-auto px-4 py-16">
      <article className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-2 pb-6 border-b border-[var(--secondary)]">
          <div className="text-xs tracking-wider uppercase text-[var(--primary)]">
            Financial Trauma &amp; Monetary Psychotherapy
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
            Financial Abuse Therapist — Work with Dan Lobel
          </h1>
          <p className="text-[var(--primary)]">
            A calm, respectful space to heal from financial control and rebuild self‑trust at your pace.
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

        <section className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">Special focus</h2>
          <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
            <li>Financial abuse and economic control</li>
            <li>Money anxiety, shame, and self‑worth</li>
            <li>Values‑aligned planning and boundary‑setting</li>
            <li>Gentle nervous‑system regulation and practical stabilisation</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">How we’ll work</h2>
          <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
            <li>Consent‑led, collaborative therapy</li>
            <li>Clear boundaries and a steady, gentle pace</li>
            <li>Small, achievable safety steps that build confidence</li>
          </ul>
        </section>

        <nav className="border border-[var(--secondary)] rounded-xl p-4 bg-[var(--section-bg-1)]">
          <strong className="text-[var(--foreground)]">Related</strong>
          <ul className="mt-2 grid gap-1 list-disc pl-5 text-[var(--accent)]">
            <li><a href="/financial-abuse">Financial Abuse — Signs &amp; Support</a></li>
            <li><a href="/financial-abuse-therapy">Financial Abuse Therapy</a></li>
          </ul>
        </nav>
      </article>
      <Script
        id="financial-abuse-therapist-person"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </div>
  )
}


