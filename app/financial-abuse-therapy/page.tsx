import Link from "next/link"

export const metadata = {
  title: "Financial Abuse Therapy | Trauma‑Informed Counselling — Melbourne & Telehealth",
  description:
    "Gentle, trauma‑informed therapy for financial abuse and economic control. Restore safety, dignity, and practical confidence. Melbourne and Telehealth across Australia.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://financialabusetherapist.com/financial-abuse-therapy",
  },
  openGraph: {
    title: "Financial Abuse Therapy | Trauma‑Informed Counselling",
    description:
      "A consent‑led, nervous‑system‑aware approach to healing from financial abuse and control.",
    type: "website",
    url: "https://financialabusetherapist.com/financial-abuse-therapy",
    siteName: "The Financial Therapist",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Financial Abuse Therapy | Trauma‑Informed Counselling",
    description:
      "A consent‑led, nervous‑system‑aware approach to healing from financial abuse and control.",
  },
}

export default function FinancialAbuseTherapyPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Financial abuse therapy",
    provider: {
      "@type": "Organization",
      name: "The Financial Therapist",
      url: "https://financialabusetherapist.com",
    },
    areaServed: ["Melbourne", "Victoria", "Australia"],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: "https://financialabusetherapist.com/bookings",
    },
  }
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What happens in the first session?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We focus on safety, consent, and pacing. You set boundaries on what to share. We outline gentle, practical next steps that respect your situation.",
        },
      },
      {
        "@type": "Question",
        name: "Is this confidential?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Confidentiality is respected within legal and ethical limits. If there is risk of harm, we discuss appropriate safety steps.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer Telehealth?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — Telehealth across Australia, as well as in‑person sessions in Melbourne.",
        },
      },
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
            Financial Abuse Therapy
          </h1>
          <p className="text-[var(--primary)]">
            A gentle, consent‑led path to restore safety, autonomy, and self‑trust after financial control or coercion.
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
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">Therapy approach</h2>
          <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
            <li>Trauma‑informed: safety first, always at your pace</li>
            <li>Nervous‑system regulation and practical stabilisation</li>
            <li>Values‑aligned boundary‑setting and next steps</li>
            <li>Rebuilding self‑trust and financial confidence</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">Session formats</h2>
          <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
            <li>Telehealth (Australia)</li>
            <li>In‑person (Melbourne)</li>
            <li>Walk &amp; Discuss Therapy (by arrangement)</li>
          </ul>
        </section>

        <nav className="border border-[var(--secondary)] rounded-xl p-4 bg-white">
          <strong className="text-[var(--foreground)]">Explore more</strong>
          <ul className="mt-2 grid gap-1 list-disc pl-5 text-[var(--accent)]">
            <li><a href="/financial-abuse">What is Financial Abuse?</a></li>
            <li><a href="/financial-abuse-therapist">Find a Financial Abuse Therapist</a></li>
          </ul>
        </nav>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  )
}


