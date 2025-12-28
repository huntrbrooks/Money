import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Navigation, Footer } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { readSiteConfig } from "@/lib/config"
import { buildPageMetadata } from "@/lib/seo"
import { ArrowRight, Download } from "lucide-react"

type ContentSectionPageProps = {
  params: { slug: string }
}

export async function generateStaticParams() {
  const config = await readSiteConfig()
  const sections = config.contentSections ?? []
  return sections.map((section) => ({ slug: section.slug }))
}

export async function generateMetadata({ params }: ContentSectionPageProps): Promise<Metadata> {
  const config = await readSiteConfig()
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

export default async function ContentSectionPage({ params }: ContentSectionPageProps) {
  const config = await readSiteConfig()
  const section = config.contentSections?.find((s) => s.slug === params.slug)
  if (!section) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>
        <section className="py-16 md:py-24 bg-[var(--section-bg-1)]">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-10">
                <Link
                  href="/"
                  className="text-sm text-[var(--primary)]/80 hover:text-[var(--primary)] underline inline-flex items-center gap-2 mb-6"
                >
                  ← Back to Home
                </Link>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--foreground)] font-light">
                  {section.title}
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {section.content ? (
                <div className="prose prose-lg max-w-none">
                  <div className="text-[var(--primary)] leading-relaxed whitespace-pre-wrap">{section.content}</div>
                </div>
              ) : (
                <p className="text-[var(--primary)]/70 italic">Content coming soon...</p>
              )}

              {section.pdfUrl && (
                <div className="pt-8 border-t border-[var(--secondary)]">
                  <Button asChild className="bg-[var(--accent)] hover:opacity-90 text-white h-12 px-8">
                    <a href={section.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  </Button>
                </div>
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
      </main>
      <Footer />
    </div>
  )
}

