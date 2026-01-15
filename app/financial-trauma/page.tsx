import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { notFound } from "next/navigation"
import { Navigation, Footer } from "@/components/navigation"
import { readSiteConfig } from "@/lib/config"
import { buildFaqSchema, buildPageMetadata, buildServiceSchema } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const config = await readSiteConfig()
  const page = config.financialTraumaPage
  const title = page?.seo?.metaTitle?.trim() || page?.title?.trim() || "Financial Trauma"
  const description = page?.seo?.metaDescription?.trim() || page?.description?.trim() || ""
  return buildPageMetadata({
    title,
    description,
    path: "/financial-trauma",
    keywords: ["financial trauma", "money anxiety", "financial abuse", "therapy"],
  })
}

export default async function FinancialTraumaPage() {
  const config = await readSiteConfig()
  const page = config.financialTraumaPage
  if (!page) notFound()

  const serviceJsonLd = buildServiceSchema(config, {
    serviceType: "Financial trauma therapy",
    description: (page.seo?.metaDescription ?? page.description ?? "").trim(),
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
              {page.eyebrow ? <div className="text-xs tracking-wider uppercase text-[var(--primary)]">{page.eyebrow}</div> : null}
              <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">{page.title}</h1>
              {page.description ? <p className="text-[var(--primary)] whitespace-pre-line">{page.description}</p> : null}
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

            {page.therapyApproach?.length ? (
              <section className="space-y-4">
                <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">Therapy approach</h2>
                <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
                  {page.therapyApproach.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {page.sessionFormats?.length ? (
              <section className="space-y-4">
                <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">Session formats</h2>
                <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
                  {page.sessionFormats.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {page.nextStepsLinks?.length ? (
              <nav className="border border-[var(--secondary)] rounded-xl p-4 bg-[var(--section-bg-1)]">
                <strong className="text-[var(--foreground)]">Explore more</strong>
                <ul className="mt-2 grid gap-1 list-disc pl-5 text-[var(--accent)]">
                  {page.nextStepsLinks.map((link, idx) => (
                    <li key={idx}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            {page.faqs?.length ? (
              <section className="space-y-4">
                <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">FAQs</h2>
                <div className="space-y-4">
                  {page.faqs.map((faq, idx) => (
                    <div key={idx} className="rounded-xl border border-[var(--secondary)] bg-[var(--section-bg-1)] p-4">
                      <p className="font-semibold text-[var(--foreground)]">{faq.question}</p>
                      <p className="mt-2 text-[var(--primary)] whitespace-pre-line">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        </div>
      </main>
      <Footer />

      <Script
        id="financial-trauma-service"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id="financial-trauma-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  )
}


