import Link from "next/link"
import { Mail, Phone } from "lucide-react"
import { Navigation, Footer } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { readSiteConfig } from "@/lib/config"

export const metadata = {
  title: "About Dan Lobel | Financial Therapist Melbourne",
  description:
    "Meet Dan Lobel, D.Couns., B.Couns., MCouns&Psych — a trauma-informed financial therapist supporting women with money, self-worth, and life transitions.",
  alternates: {
    canonical: "https://financialabusetherapist.com/about-dan",
  },
  openGraph: {
    title: "About Dan Lobel | Financial Therapist Melbourne",
    description:
      "Learn about Dan’s integrative approach to monetary psychotherapy, trauma-informed counselling, and safety-first care.",
    url: "https://financialabusetherapist.com/about-dan",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Dan Lobel",
    description: "Trauma-informed financial therapist based in Melbourne & online.",
  },
}

export default async function AboutDanPage() {
  const config = await readSiteConfig()
  const email = config.contact?.email || "dan@themelbournecounsellor.com.au"
  const phone = config.contact?.phone || "0467 477 786"
  const phoneHref = phone.replace(/\s+/g, "")
  const aboutParagraphs = config.about?.paragraphs ?? []

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[1.1fr,0.9fr] items-start">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)] font-semibold">About Dan</p>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--foreground)] font-light leading-tight">
                  Dan Lobel, D.Couns., B.Couns., MCouns&Psych
                </h1>
                <p className="text-lg text-[var(--primary)]">
                  Trauma-informed financial therapist | Based in Melbourne & online across Australia
                </p>
                <p className="text-xl text-[var(--foreground)]">
                  Dan brings 15+ years of clinical experience, combining contemporary integrative counselling,
                  behavioural psychology, and monetary psychotherapy. His practice centres emotional safety, pacing,
                  and consent so you can explore self-worth, money stories, and relationships without pressure.
                </p>
                <blockquote className="font-serif text-2xl md:text-3xl text-[var(--primary)]/90 italic leading-snug border-l-4 border-[var(--accent)] pl-6">
                  “Financial wellbeing isn’t just about numbers — it’s about feeling resourced, dignified, and trusted in
                  your own decisions.”
                </blockquote>
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="inline-flex items-center gap-3 rounded-full border border-[var(--primary)]/30 bg-white px-4 py-2 text-sm text-[var(--primary)]">
                    🕊 Inclusive · LGBTQIA+ affirming · Neuro-affirming
                  </span>
                  <span className="inline-flex items-center gap-3 rounded-full border border-[var(--primary)]/30 bg-white px-4 py-2 text-sm text-[var(--primary)]">
                    📍 In-person (South Yarra) & telehealth Australia-wide
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild className="h-12 px-8 bg-[var(--accent)] text-white hover:opacity-90">
                    <Link href="/#book">Book a Session</Link>
                  </Button>
                  <Button asChild variant="outline" className="h-12 px-8 border-[var(--foreground)] text-[var(--foreground)]">
                    <Link href="/enquiry">Make an enquiry</Link>
                  </Button>
                </div>
              </div>
              <div className="space-y-6 rounded-[32px] border border-white/60 bg-white/75 p-8 shadow-xl">
                <h2 className="text-sm uppercase tracking-[0.3em] text-[var(--primary)] font-semibold">Qualifications & focus</h2>
                <ul className="space-y-3 text-[var(--primary)]">
                  <li>• Master of Counselling & Psychotherapy</li>
                  <li>• Bachelor & Diploma of Counselling</li>
                  <li>• Advanced training in somatic trauma therapy</li>
                  <li>• Certified polyvagal-informed practitioner</li>
                </ul>
                <p className="text-[var(--foreground)]">
                  Dan specialises in financial trauma, grief and transition, anxiety, and relationship repair. Every
                  session respects bodily cues, boundaries, and practical realities.
                </p>
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-semibold">Contact</p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--primary)]/30 px-4 py-2 text-sm text-[var(--foreground)] hover:border-[var(--accent)]"
                    >
                      <Mail className="w-4 h-4" />
                      {email}
                    </a>
                    <a
                      href={`tel:${phoneHref}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--primary)]/30 px-4 py-2 text-sm text-[var(--foreground)] hover:border-[var(--accent)]"
                    >
                      <Phone className="w-4 h-4" />
                      {phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-[var(--section-bg-1)]">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="space-y-3 text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)]">Therapeutic approach</p>
                <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
                  Consent-led, nervous-system-aware therapy
                </h2>
              </div>
              <div className="space-y-5 text-lg leading-relaxed text-[var(--primary)]">
                {aboutParagraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {["Choice & pacing", "Money stories & identity", "Practical next steps"].map((value) => (
                  <div
                    key={value}
                    className="rounded-2xl border border-[var(--primary)]/20 bg-white/80 px-4 py-6 text-center text-[var(--foreground)] font-medium"
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)]">Ready when you are</p>
              <h3 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
                When you need grounded, respectful support, Dan will meet you there.
              </h3>
              <p className="text-lg text-[var(--primary)]">
                Sessions can take place via secure telehealth, in Dan’s South Yarra rooms, or as walk-and-talk therapy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="h-12 px-8 bg-[var(--accent)] text-white hover:opacity-90">
                  <Link href="/bookings">View appointment types</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 px-8">
                  <Link href="/enquiry">Ask a question first</Link>
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

