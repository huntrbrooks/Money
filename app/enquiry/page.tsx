import type { Metadata } from "next"
import { Navigation, Footer } from "@/components/navigation"
import { readSiteConfig } from "@/lib/config"
import { DynamicForm } from "@/components/forms/DynamicForm"
import { buildPageMetadata } from "@/lib/seo"
import { EmailLink } from "@/components/email-link"

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Enquiry Form | Financial Trauma Therapist",
    description: "Send a confidential enquiry and Dan will respond as soon as possible.",
    path: "/enquiry",
    keywords: ["enquiry form", "contact counsellor", "financial trauma enquiry"],
  })
}

export default async function EnquiryPage() {
  const config = await readSiteConfig()
  const page = config.formPages?.enquiry
  if (!page) {
    // Fail-safe: keep site usable even if config is missing.
    return (
      <div className="min-h-screen bg-muted">
        <Navigation />
        <main className="container mx-auto px-6 md:px-8 py-16">
          <h1 className="font-serif text-4xl text-[var(--foreground)] font-light">Enquiry</h1>
          <p className="text-[var(--primary)] mt-2">
            The enquiry form is temporarily unavailable. Please email{" "}
            <EmailLink
              email={config.contact?.email ?? "dan@financialtraumatherapist.com.au"}
              subject="Enquiry"
              className="underline cursor-pointer"
            >
              {config.contact?.email ?? "dan@financialtraumatherapist.com.au"}
            </EmailLink>
            .
          </p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-10 text-center">
                <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">{page.title}</h1>
                {page.subtitle ? <p className="text-[var(--primary)] mt-2">{page.subtitle}</p> : null}
              </div>

              <DynamicForm page={page} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}


