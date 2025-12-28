import type { Metadata } from "next"
import Link from "next/link"
import { Navigation, Footer } from "@/components/navigation"
import { readSiteConfig } from "@/lib/config"
import { DynamicForm } from "@/components/forms/DynamicForm"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Intake Form | Financial Abuse Therapist",
    description: "Complete the intake form before your first appointment.",
    path: "/intake",
    keywords: ["intake form", "therapy intake", "client intake"],
  })
}

export default async function IntakePage() {
  const config = await readSiteConfig()
  const page = config.formPages?.intake
  if (!page) {
    return (
      <div className="min-h-screen bg-muted">
        <Navigation />
        <main className="container mx-auto px-6 md:px-8 py-16">
          <h1 className="font-serif text-4xl text-[var(--foreground)] font-light">Intake</h1>
          <p className="text-[var(--primary)] mt-2">
            The intake form is temporarily unavailable. Please email{" "}
            <a className="underline" href={`mailto:${config.contact?.email ?? "dan@financialabusetherapist.com.au"}`}>
              {config.contact?.email ?? "dan@financialabusetherapist.com.au"}
            </a>
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

              <p className="text-sm text-[var(--primary)] pb-4">
                Need a pause? Take a break and return when you feel ready. Grounding resources live in the{" "}
                <Link href="/client-care" className="underline">
                  Client Care Hub
                </Link>
                .
              </p>

              <DynamicForm page={page} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}



