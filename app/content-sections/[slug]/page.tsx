import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Navigation, Footer } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { readSiteConfig } from "@/lib/config"
import { buildBreadcrumbSchema, buildFaqSchema, buildPageMetadata, buildServiceSchema } from "@/lib/seo"
import Script from "next/script"
import { ArrowRight } from "lucide-react"
import { CONTENT_SECTION_PAGE_DEFAULTS, applyContentSectionDefaults } from "@/lib/content-section-defaults"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

type ContentSectionPageProps = {
  params: { slug: string } | Promise<{ slug: string }>
  searchParams?: Record<string, string | string[] | undefined>
}

function isThenable(value: unknown): value is Promise<unknown> {
  return typeof (value as { then?: unknown })?.then === "function"
}

export async function generateMetadata({ params }: ContentSectionPageProps): Promise<Metadata> {
  const paramsObj = isThenable(params) ? await params : params
  const slug = String(paramsObj?.slug ?? "")
  const path = `/content-sections/${slug}`
  try {
    const config = await readSiteConfig()
    const requested = normalizeSlug(slug)
    const pages = Array.isArray(config.contentSectionPages) ? config.contentSectionPages : []
    const sections = Array.isArray(config.contentSections) ? config.contentSections : []
    const foundPage = pages.find((p) => normalizeSlug(p.slug) === requested) ?? null
    const page = foundPage ? applyContentSectionDefaults(foundPage, CONTENT_SECTION_PAGE_DEFAULTS[requested]) : null
    if (!page) {
      // Fallback to legacy contentSections if present.
      const section = sections.find((s) => normalizeSlug(s.slug) === requested) ?? null
      if (!section) {
        return await buildPageMetadata({
          title: "Section not found",
          description: "The requested section could not be located.",
          path,
          noIndex: true,
        })
      }
      const sectionTitle = String(section.title ?? "").trim() || "Content"
      const sectionDesc = String((section as { content?: string } | null)?.content ?? "")
      return await buildPageMetadata({
        title: `${sectionTitle} | Financial Trauma Therapist`,
        description: sectionDesc.slice(0, 160) || `Learn about ${sectionTitle}`,
        path: `/content-sections/${section.slug}`,
      })
    }
    return await buildPageMetadata({
      title: page.seo?.metaTitle?.trim() || `${page.title} | Financial Trauma Therapist`,
      description: page.seo?.metaDescription?.trim() || String(page.description ?? "").slice(0, 160),
      path,
    })
  } catch {
    // Never allow metadata generation errors to break page rendering.
    return {
      title: "Financial Trauma Therapist",
      description: "Content page.",
      robots: { index: false, follow: false },
      alternates: { canonical: path },
    }
  }
}

function normalizeSlug(input: string): string {
  return String(input ?? "").trim().toLowerCase()
}

export default async function ContentSectionPage({ params, searchParams }: ContentSectionPageProps) {
  const paramsObj = isThenable(params) ? await params : params
  const slug = String(paramsObj?.slug ?? "")
  const config = await readSiteConfig()
  const requested = normalizeSlug(slug)
  const pages = Array.isArray(config.contentSectionPages) ? config.contentSectionPages : []
  const sections = Array.isArray(config.contentSections) ? config.contentSections : []
  const foundPage = pages.find((p) => normalizeSlug(p.slug) === requested) ?? null
  const section = sections.find((s) => normalizeSlug(s.slug) === requested) ?? null
  const page = foundPage ? applyContentSectionDefaults(foundPage, CONTENT_SECTION_PAGE_DEFAULTS[requested]) : null

  const debug = String(searchParams?.debug ?? "") === "1"
  const debugPayload = {
    requested: slug,
    normalizedRequested: requested,
    paramsShape: {
      isThenable: isThenable(params),
      keys: params && typeof params === "object" ? Object.keys(params as Record<string, unknown>) : [],
    },
    matched: { page: Boolean(page), section: Boolean(section) },
    contentSectionPages: { count: pages.length, slugs: pages.map((p) => p.slug) },
    contentSections: { count: sections.length, slugs: sections.map((s) => s.slug) },
  }

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
              {JSON.stringify(debugPayload, null, 2)}
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
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: page?.title ?? section?.title ?? "Content", url: `/content-sections/${slug}` },
  ])

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
                      Book a consultation
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
                <section className="space-y-4 rounded-xl border border-[var(--secondary)] p-4">
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
                <section className="space-y-4 rounded-xl border border-[var(--secondary)] p-4">
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
                      Book a consultation
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
            id="content-section-breadcrumb"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
          />
          <Script
            id="content-section-service"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
          />
          {page.faqs && page.faqs.length > 0 ? (
            <Script
              id="content-section-faq"
              type="application/ld+json"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
          ) : null}
        </>
      ) : null}
    </div>
  )
}

