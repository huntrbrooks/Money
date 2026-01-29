import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { Navigation, Footer } from "@/components/navigation"
import { readSiteConfig } from "@/lib/config"
import { buildArticleSchema, buildFaqSchema, buildPageMetadata } from "@/lib/seo"

const PAGE_TITLE = "Financial Abuse | Signs, Safety, and Support — Financial Trauma Therapist"
const PAGE_DESCRIPTION =
  "Understand financial abuse: the signs, effects, and how trauma-informed therapy supports safety, self-trust, and recovery. Melbourne and Telehealth (Australia)."
const PAGE_KEYWORDS = ["financial abuse signs", "economic abuse support", "family violence finances"]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: "/financial-abuse",
    keywords: PAGE_KEYWORDS,
    type: "article",
  })
}

export default async function FinancialAbusePage() {
  const config = await readSiteConfig()
  const page = config.financialAbusePage ?? {
    title: "Financial Abuse — Signs, Safety, and Support",
    description: "If money is being used to control, restrict, or punish you, you are not alone. Support is available.",
    eyebrow: "Financial Trauma & Monetary Psychotherapy",
    commonSigns: [],
    therapySupports: [],
    crisisText: "",
    nextStepsLinks: [],
  }

  const articleJsonLd = buildArticleSchema({
    title: page.title,
    description: PAGE_DESCRIPTION,
    slug: "/financial-abuse",
  })
  const faqJsonLd = buildFaqSchema([
    {
      question: "What is financial abuse?",
      answer:
        "Financial abuse is a pattern of control that restricts access to money, employment, information, or independence. It often co-occurs with other forms of coercion.",
    },
    {
      question: "Is financial abuse a form of family violence?",
      answer:
        "Yes. In Australia, financial abuse is recognised as a form of family and domestic violence. Your safety and consent are central in any support plan.",
    },
    {
      question: "How can therapy help with financial abuse?",
      answer:
        "Therapy focuses on safety, pacing, and self-trust. We work with the nervous system, clarify boundaries, and develop practical next steps at a pace that respects your situation.",
    },
  ])
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
              aria-label="Schedule a consultation"
            >
              Book a consultation
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

        {page.commonSigns && page.commonSigns.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">Common signs</h2>
            <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
              {page.commonSigns.map((sign, idx) => (
                <li key={idx}>{sign}</li>
              ))}
            </ul>
          </section>
        )}

        {page.therapySupports && page.therapySupports.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">How therapy supports safety</h2>
            <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
              {page.therapySupports.map((support, idx) => (
                <li key={idx}>{support}</li>
              ))}
            </ul>
          </section>
        )}

        {page.crisisText && (
          <section className="space-y-4">
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">If you're in crisis</h2>
            <p className="text-[var(--primary)]">
              {page.crisisText}
            </p>
          </section>
        )}

        {page.nextStepsLinks && page.nextStepsLinks.length > 0 && (
          <nav className="border border-[var(--secondary)] rounded-xl p-4 bg-[var(--section-bg-1)]">
            <strong className="text-[var(--foreground)]">Next steps</strong>
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
        id="financial-abuse-article"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="financial-abuse-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  )
}


