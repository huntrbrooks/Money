import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Navigation, Footer } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { readSiteConfig } from "@/lib/config"
import { buildFaqSchema, buildPageMetadata, buildServiceSchema } from "@/lib/seo"
import Script from "next/script"
import { ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

type ContentSectionPageProps = {
  params: { slug: string }
  searchParams?: Record<string, string | string[] | undefined>
}

export async function generateMetadata({ params }: ContentSectionPageProps): Promise<Metadata> {
  const config = await readSiteConfig()
  const page = (config.contentSectionPages ?? []).find((p) => p.slug === params.slug)
  if (!page) {
    // Fallback to legacy contentSections if present.
    const section = config.contentSections?.find((s) => s.slug === params.slug)
    if (!section) {
      return buildPageMetadata({
        title: "Section not found",
        description: "The requested section could not be located.",
        path: `/content-sections/${params.slug}`,
        noIndex: true,
      })
    }
    return buildPageMetadata({
      title: `${section.title} | Financial Abuse Therapist`,
      description: section.content.slice(0, 160) || `Learn about ${section.title}`,
      path: `/content-sections/${section.slug}`,
    })
  }
  return buildPageMetadata({
    title: page.seo?.metaTitle?.trim() || `${page.title} | Financial Abuse Therapist`,
    description: page.seo?.metaDescription?.trim() || String(page.description ?? "").slice(0, 160),
    path: `/content-sections/${params.slug}`,
  })
}

function normalizeSlug(input: string): string {
  return String(input ?? "").trim().toLowerCase()
}

export default async function ContentSectionPage({ params, searchParams }: ContentSectionPageProps) {
  const config = await readSiteConfig()
  const requested = normalizeSlug(params.slug)
  const pages = Array.isArray(config.contentSectionPages) ? config.contentSectionPages : []
  const sections = Array.isArray(config.contentSections) ? config.contentSections : []
  const page = pages.find((p) => normalizeSlug(p.slug) === requested) ?? null
  const section = sections.find((s) => normalizeSlug(s.slug) === requested) ?? null

  const debug = String(searchParams?.debug ?? "") === "1"
  if (debug) {
    return (
      <div className="min-h-screen bg-muted">
        <Navigation />
        <main className="container mx-auto px-4 py-10">
          <h1 className="font-serif text-3xl text-[var(--foreground)] font-light">Content section debug</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This view is only intended for diagnostics. Remove <code>?debug=1</code> to view the real page.
          </p>
          <div className="mt-6 rounded-lg border border-border/40 bg-background/70 p-4 text-sm">
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(
                {
                  requested: params.slug,
                  normalizedRequested: requested,
                  matched: { page: Boolean(page), section: Boolean(section) },
                  contentSectionPages: { count: pages.length, slugs: pages.map((p) => p.slug) },
                  contentSections: { count: sections.length, slugs: sections.map((s) => s.slug) },
                },
                null,
                2,
              )}
            </pre>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  if (!page && !section) notFound()

  const faqJsonLd = buildFaqSchema(page?.faqs ?? [])
  const serviceJsonLd = buildServiceSchema(config, {
    serviceType: "Financial abuse therapy",
    description: String(page?.seo?.metaDescription ?? page?.description ?? "").trim(),
    url: "/bookings",
  })

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>
        {page ? (
          <div className="container mx-auto px-4 py-16">
            <article className="max-w-3xl mx-auto space-y-8">
              <header className="space-y-2 pb-6 border-b border-[var(--secondary)]">
                <Link
                  href="/"
                  className="text-sm text-[var(--primary)]/80 hover:text-[var(--primary)] underline inline-flex items-center gap-2 mb-4"
                >
                  ← Back to Home
                </Link>
                {page.eyebrow ? <div className="text-xs tracking-wider uppercase text-[var(--primary)]">{page.eyebrow}</div> : null}
                <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">{page.title}</h1>
                <p className="text-[var(--primary)] whitespace-pre-line">{page.description}</p>
                <div className="pt-4">
                  <Button asChild className="bg-[var(--accent)] hover:opacity-90 text-white h-12 px-8">
                    <Link href="/#book" className="inline-flex items-center gap-2">
                      Book a Session
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
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
        ) : (
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
              <div className="max-w-4xl mx-auto space-y-8">
                <Link
                  href="/"
                  className="text-sm text-[var(--primary)]/80 hover:text-[var(--primary)] underline inline-flex items-center gap-2 mb-2"
                >
                  ← Back to Home
                </Link>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--foreground)] font-light">
                  {section?.title ?? "Content"}
                </h1>
                {section?.content ? (
                  <div className="prose prose-lg max-w-none">
                    <div className="text-[var(--primary)] leading-relaxed whitespace-pre-wrap">{section.content}</div>
                  </div>
                ) : (
                  <p className="text-[var(--primary)]/70 italic">Content coming soon...</p>
                )}
                <div className="pt-8 border-t border-[var(--secondary)]">
                  <Button asChild className="bg-[var(--accent)] hover:opacity-90 text-white h-12 px-8">
                    <Link href="/#book" className="inline-flex items-center gap-2">
                      Book a Session
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      {page ? (
        <>
          <Script
            id="content-section-service"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
          />
          <Script
            id="content-section-faq"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        </>
      ) : null}
    </div>
  )
}

