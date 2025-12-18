import Link from "next/link"

export const metadata = {
  title: "Financial Abuse | Signs, Safety, and Support — Financial Abuse Therapist",
  description:
    "Understand financial abuse: the signs, effects, and how trauma‑informed therapy supports safety, self‑trust, and recovery. Melbourne and Telehealth (Australia).",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://financialabusetherapist.com/financial-abuse",
  },
  openGraph: {
    title: "Financial Abuse | Signs, Safety, and Support",
    description:
      "Recognise financial abuse and learn how trauma‑informed therapy supports safety, dignity and choice.",
    type: "article",
    url: "https://financialabusetherapist.com/financial-abuse",
    siteName: "The Financial Therapist",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Financial Abuse | Signs, Safety, and Support",
    description:
      "Recognise financial abuse and learn how trauma‑informed therapy supports safety, dignity and choice.",
  },
}

export default function FinancialAbusePage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Financial Abuse — Signs, Safety, and Support",
    description:
      "A trauma‑informed guide to financial abuse: signs, impacts, and pathways to recovery.",
    author: { "@type": "Person", name: "Dan Lobel" },
    publisher: { "@type": "Organization", name: "The Financial Therapist" },
    mainEntityOfPage: "https://financialabusetherapist.com/financial-abuse",
  }
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is financial abuse?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Financial abuse is a pattern of control that restricts access to money, employment, information, or independence. It often co‑occurs with other forms of coercion.",
        },
      },
      {
        "@type": "Question",
        name: "Is financial abuse a form of family violence?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. In Australia, financial abuse is recognised as a form of family and domestic violence. Your safety and consent are central in any support plan.",
        },
      },
      {
        "@type": "Question",
        name: "How can therapy help with financial abuse?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Therapy focuses on safety, pacing, and self‑trust. We work with the nervous system, clarify boundaries, and develop practical next steps at a pace that respects your situation.",
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
            Financial Abuse — Signs, Safety, and Support
          </h1>
          <p className="text-[var(--primary)]">
            If money is being used to control, restrict, or punish you, you are not alone. Support is available.
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
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">Common signs</h2>
          <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
            <li>Blocking access to accounts, payslips, or financial information</li>
            <li>Controlling spending or demanding full oversight of purchases</li>
            <li>Sabotaging employment or study; forced debt or coerced signatures</li>
            <li>Withholding money, essentials, or transport; creating dependency</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">How therapy supports safety</h2>
          <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
            <li>Nervous‑system‑aware pacing to reduce overwhelm</li>
            <li>Clarifying boundaries, consent, and next steps</li>
            <li>Planning confidential support and practical safety edges</li>
            <li>Restoring self‑trust and financial confidence over time</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">If you’re in crisis</h2>
          <p className="text-[var(--primary)]">
            If you’re in immediate danger, call 000. You can also reach Lifeline on 13&nbsp;11&nbsp;14 (24/7).
          </p>
        </section>

        <nav className="border border-[var(--secondary)] rounded-xl p-4 bg-white">
          <strong className="text-[var(--foreground)]">Next steps</strong>
          <ul className="mt-2 grid gap-1 list-disc pl-5 text-[var(--accent)]">
            <li><a href="/financial-abuse-therapy">Learn about Financial Abuse Therapy</a></li>
            <li><a href="/financial-abuse-therapist">Work with a Financial Abuse Therapist</a></li>
          </ul>
        </nav>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  )
}


