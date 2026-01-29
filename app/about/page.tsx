import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { Mail, Phone, ArrowRight } from "lucide-react"
import { Navigation, Footer } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { readSiteConfig } from "@/lib/config"
import { buildBreadcrumbSchema, buildPageMetadata, buildPersonSchema } from "@/lib/seo"
import { EmailLink } from "@/components/email-link"

export const dynamic = 'force-dynamic'

const PAGE_DESCRIPTION =
  "Meet Dan Lobel — a warm, trauma-informed counsellor specialising in monetary psychotherapy, financial trauma, and self-worth. Learn about his approach, credentials, and how sessions feel."

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "About Dan Lobel | Financial Trauma Therapist & Monetary Psychotherapist",
    description: PAGE_DESCRIPTION,
    path: "/about",
    keywords: ["about financial therapist", "Dan Lobel counsellor", "monetary psychotherapy"],
  })
}

export default async function AboutPage() {
  const config = await readSiteConfig()
  const email = config.contact?.email ?? "dan@financialtraumatherapist.com.au"
  const emailAlt = config.contact?.emailAlt ?? ""
  const phone = config.contact?.phone ?? "+61 488 222 137"
  const aboutContent = config.about ?? { title: "", paragraphs: [] }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>
        <section
          className="py-24 md:py-32"
          style={{
            background:
              "linear-gradient(180deg, #6ca4ac 0%, rgba(108,164,172,0.85) 22%, rgba(215,233,236,0.92) 55%, rgba(229,238,210,0.94) 80%, #e5eed2 100%)",
          }}
        >
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-6xl mx-auto grid gap-16 lg:grid-cols-5 items-start">
              <div className="lg:col-span-2 space-y-6">
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--foreground)]/80 sm:text-[var(--primary)] font-bold">
                  About Dan
                </p>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--foreground)] leading-[1.1] font-light">
                  Dan Lobel
                </h1>
              </div>
              <div className="lg:col-span-3 space-y-6 text-lg leading-relaxed text-[var(--foreground)]/80 sm:text-[var(--primary)]">
                {aboutContent.title ? (
                  <p className="text-xl text-[var(--foreground)] font-medium">{aboutContent.title}</p>
                ) : null}
                {aboutContent.paragraphs?.[0] ? (
                  <blockquote className="font-serif text-2xl md:text-3xl text-[var(--primary)] leading-[1.3] font-light italic">
                    {aboutContent.paragraphs[0]}
                  </blockquote>
                ) : null}
                {aboutContent.paragraphs?.slice(1).map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
                <div className="grid gap-3 md:grid-cols-2 pt-2">
                  <p className="text-sm text-[var(--foreground)]/80 sm:text-[var(--primary)]/90">
                    📍 Based in Melbourne | Online &amp; In-Person Sessions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <EmailLink
                      email={email}
                      subject="Contact Request"
                      ariaLabel={`Email Dan at ${email}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--section-bg-1)] text-[var(--primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                    >
                      <Mail className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm">{email}</span>
                    </EmailLink>
                    {emailAlt && emailAlt !== email ? (
                      <EmailLink
                        email={emailAlt}
                        subject="Contact Request"
                        ariaLabel={`Email Dan at ${emailAlt}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--section-bg-1)] text-[var(--primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                      >
                        <Mail className="w-4 h-4" aria-hidden="true" />
                        <span className="text-sm">{emailAlt}</span>
                      </EmailLink>
                    ) : null}
                    <a
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      aria-label={`Call Dan on ${phone}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--section-bg-1)] text-[var(--primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                    >
                      <Phone className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm">{phone}</span>
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button asChild className="bg-[var(--accent)] hover:opacity-90 text-white h-12 px-8 shadow-md">
                    <Link href="/bookings">
                      Book a consultation
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-12 px-8">
                    <Link href="/monetary-psychotherapy">Explore Monetary Psychotherapy</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer backgroundColor="#d7e9ec" />
      <Script
        id="breadcrumb-schema-about"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "About Dan Lobel", url: "/about" },
            ])
          ),
        }}
      />
      <Script
        id="person-schema-dan-lobel"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildPersonSchema(config, {
              name: "Dan Lobel",
              description:
                "Dan Lobel is a warm, trauma-informed counsellor specialising in monetary psychotherapy, financial trauma, and self-worth. Based in Melbourne, offering in-person and telehealth sessions.",
              jobTitle: "Financial Trauma Therapist & Monetary Psychotherapist",
              url: "/about",
              telephone: phone,
              image: config.hero?.imageUrl,
            })
          ),
        }}
      />
    </div>
  )
}


