import Link from "next/link"

export const metadata = {
  title: "Financial Abuse Therapist | The Financial Therapist — Dan Lobel",
  description:
    "Work with a Financial Abuse Therapist. Trauma‑informed counselling focused on safety, dignity, and practical confidence. Melbourne & Telehealth.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://financialabusetherapist.com/financial-abuse-therapist",
  },
  openGraph: {
    title: "Financial Abuse Therapist | The Financial Therapist — Dan Lobel",
    description:
      "Trauma‑informed support for financial abuse recovery. Melbourne and Telehealth across Australia.",
    type: "profile",
    url: "https://financialabusetherapist.com/financial-abuse-therapist",
    siteName: "The Financial Therapist",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Financial Abuse Therapist | The Financial Therapist — Dan Lobel",
    description:
      "Trauma‑informed support for financial abuse recovery. Melbourne & Telehealth.",
  },
}

export default function FinancialAbuseTherapistPage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Dan Lobel",
    jobTitle: "Counsellor",
    description: "Financial Abuse Therapist — trauma‑informed counselling and monetary psychotherapy.",
    url: "https://financialabusetherapist.com/financial-abuse-therapist",
    image: "/Dan.png",
    telephone: "+61 488 222 137",
    worksFor: {
      "@type": "Organization",
      name: "The Financial Therapist",
      url: "https://financialabusetherapist.com",
    },
    sameAs: [
      "https://www.facebook.com/the.melbourne.counsellor/",
      "https://www.instagram.com/the.melbourne.counsellor/#",
      "https://www.linkedin.com/in/dan-lobel-the-melbourne-counsellor-769b61204/",
    ],
  }
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
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white text-[var(--accent)] font-semibold border border-[var(--accent)] hover:bg-[var(--secondary)]/20"
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

        <nav className="border border-[var(--secondary)] rounded-xl p-4 bg-white">
          <strong className="text-[var(--foreground)]">Related</strong>
          <ul className="mt-2 grid gap-1 list-disc pl-5 text-[var(--accent)]">
            <li><a href="/financial-abuse">Financial Abuse — Signs &amp; Support</a></li>
            <li><a href="/financial-abuse-therapy">Financial Abuse Therapy</a></li>
          </ul>
        </nav>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </div>
  )
}


