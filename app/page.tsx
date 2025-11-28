import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Phone, Mail, ArrowRight } from "lucide-react"
import { Navigation, Footer } from "@/components/navigation"
import { BookingOptions } from "@/components/booking-options"
import { BookingScheduler } from "@/components/booking-scheduler"
import { readSiteConfig } from "@/lib/config"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CrisisBanner } from "@/components/crisis-banner"
import { ResourcesCarousel } from "@/components/resources-carousel"
import { LeadMagnet } from "@/components/lead-magnet"
import { NewsletterModal } from "@/components/newsletter-modal"
import {
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildPageMetadata,
  buildServiceSchema,
} from "@/lib/seo"

const HOME_TITLE = "Financial Abuse Therapist | Financial Trauma & Monetary Psychotherapy — Dan Lobel"
const HOME_DESCRIPTION =
  "Trauma-informed counselling in Melbourne focused on financial abuse recovery, financial trauma, money anxiety and monetary psychotherapy. Safe, gender-aware and inclusive care."
const HOME_KEYWORDS = [
  "financial therapy Melbourne",
  "financial abuse counselling",
  "monetary psychotherapy",
  "economic abuse recovery",
  "money anxiety therapy",
]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    path: "/",
    keywords: HOME_KEYWORDS,
  })
}

export default async function HomePage() {
  const config = await readSiteConfig()
  const hero = config.hero
  const experiments = config.experiments ?? {}
  const homepageContent = config.homepage ?? {}
  const valueProps = homepageContent.valueProps ?? []
  const testimonials = homepageContent.testimonials ?? []
  const homepageFaqs = homepageContent.faqs ?? []
  const leadMagnet = homepageContent.leadMagnet
  const otherAreas = [
    { title: "Grief Therapy", summary: "Gentle support for loss, meaning-making, and navigating the waves of grief.", more: "Space to honour your loss, hold ambivalence, and rebuild a relationship with life at your pace." },
    { title: "Trauma Therapy", summary: "Trauma‑informed care prioritising safety, pacing, and consent.", more: "We work collaboratively with your nervous system to build stability, choice, and self‑trust." },
    { title: "Stress Management", summary: "Reduce overwhelm with practical tools and compassionate awareness.", more: "Learn regulation skills, boundary‑setting, and restore a grounded sense of capability." },
    { title: "Anxiety & Depression", summary: "Warm, evidence‑informed support to ease anxiety and low mood.", more: "Understand patterns, reduce shame, and build steadier day‑to‑day foundations." },
    { title: "Family & Relationships", summary: "Navigate dynamics, roles, and boundaries with clarity and care.", more: "Strengthen communication, repair trust, and honour your needs in connection." },
    { title: "Guardianship & Caregiving", summary: "Support for the emotional weight of responsibility and change.", more: "Make space for grief, fatigue, identity shifts, and sustainable care." },
    { title: "Social Isolation & Loneliness", summary: "Compassionate support when life feels disconnected or small.", more: "Rebuild belonging, confidence, and meaningful connection, one step at a time." },
    { title: "LGBTQIA+ Therapy", summary: "Inclusive, affirming counselling for identity, relationships, and safety.", more: "A non‑judgemental space that respects every part of who you are." },
  ]
  const importantSectionLinks = [
    { label: "About Dan", href: "/about" },
    { label: "Monetary Psychotherapy", href: "/monetary-psychotherapy" },
    { label: "Integrative Counselling", href: "/contemporary-integrative-counselling" },
  ]
  const consultationOptions = config.consultations ?? []
  const primaryCta = hero.primaryCta ?? { label: "Book a Session", href: "/#book" }
  const secondaryCta = hero.secondaryCta ?? { label: "Learn More", href: "/monetary-psychotherapy" }

  return (
    <div className="min-h-screen bg-[var(--section-bg-2)]">
      <Navigation />
      <main>

      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #d7e9ec 0%, rgba(215,233,236,0.95) 20%, rgba(108,164,172,0.85) 55%, rgba(108,164,172,0.7) 72%, rgba(229,238,210,0.9) 90%, #e5eed2 100%)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-32">
          <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 items-center max-w-7xl mx-auto">
            {/* Left Column - Text */}
            <div className="order-2 space-y-8 sm:space-y-10 lg:order-1 lg:pr-12">
              <div className="space-y-6">
                <p className="text-[#6b7d86] text-xs uppercase tracking-[0.3em] font-semibold">
                  {hero.eyebrow ?? "Financial Trauma & Monetary Psychotherapy"}
                </p>
                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[var(--foreground)] leading-tight text-balance font-light">
                  {hero.title}
                </h1>
              </div>

              <div className="space-y-5 text-base sm:text-lg leading-relaxed text-[var(--foreground)]/90 max-w-2xl">
                <p className="text-xl sm:text-2xl text-[var(--foreground)] font-serif font-medium">
                  {hero.subtitle}
                </p>
                <p className="text-[var(--foreground)]/80">{hero.description}</p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto min-w-[220px] bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-[var(--accent-foreground)] border border-[var(--accent)]/40 text-base h-14 px-10 font-semibold rounded-full shadow-[0_0_35px_rgba(222,236,79,0.35)] flex items-center justify-center gap-2"
                >
                  <Link href={primaryCta.href} aria-label={primaryCta.label} data-analytics-id="hero-primary-cta">
                    {primaryCta.label}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto min-w-[220px] bg-[var(--section-bg-2)]/85 border border-[var(--section-bg-2)]/70 text-[var(--foreground)] hover:border-[var(--foreground)]/30 hover:bg-[var(--section-bg-1)] text-base h-14 px-10 font-medium rounded-full flex items-center justify-center gap-2 shadow-[0_20px_35px_rgba(32,56,91,0.08)]"
                >
                  <Link href={secondaryCta.href} aria-label={secondaryCta.label} data-analytics-id="hero-secondary-cta">
                    {secondaryCta.label}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="order-1 lg:order-2 relative lg:pl-8">
              <div className="relative mx-auto w-full max-w-[32rem] sm:max-w-[48rem] md:max-w-[56rem]">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-5 translate-y-5 rounded-[40px] bg-[var(--foreground)]/5 blur-[2px]"
                />
                <div className="relative rounded-[42px] border-[6px] border-[#6ca4ac] bg-[var(--section-bg-2)]/95 p-2 sm:p-3 md:p-4 shadow-[0_35px_60px_rgba(32,56,91,0.18)] backdrop-blur-sm">
                  <div className="rounded-[30px] overflow-hidden shadow-inner aspect-[4/3] sm:aspect-auto">
                    <img
                      src={hero.imageUrl || "/og.png?v=20251128"}
                      alt="Portrait of Dan Lobel, counsellor in Melbourne"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {valueProps.length > 0 && (
        <section className="py-12 sm:py-16 md:py-24 bg-[var(--section-bg-1)]">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-5xl mx-auto space-y-8 text-center">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-semibold">What to expect</p>
                <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
                  Therapy that honours your nervous system
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3 text-left">
                {valueProps.map((item, idx) => (
                  <div
                    key={`value-prop-${idx}`}
                    className="rounded-3xl border border-[var(--secondary)] bg-[var(--section-bg-1)]/80 p-6 shadow-sm"
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">0{idx + 1}</p>
                    <h3 className="font-serif text-2xl text-[var(--foreground)] mt-2">{item.title}</h3>
                    <p className="text-[var(--primary)] mt-3 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {experiments.showNewsletterSection !== false && (
        <section className="py-12 sm:py-16 md:py-24 bg-[var(--section-bg-2)]">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-semibold">Between sessions</p>
              <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
                Download the 5-step Financial Safety Check-in
              </h2>
              <p className="text-[var(--primary)]">
                A gentle ritual used in session to settle your system before money admin — delivered straight to your inbox.
              </p>
              <div className="flex justify-center">
                <NewsletterModal triggerLabel="Email me the check-in" tags={["newsletter", "safety-check-in"]} />
              </div>
            </div>
          </div>
        </section>
      )}


      <section id="important-links" className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">Important Links</h2>
              <p className="text-[var(--primary)]">Quick access to key information</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Row 1 — centered primary CTA */}
              <div className="col-span-full flex justify-center">
                <Button asChild className="w-full sm:w-auto bg-[var(--accent)] hover:opacity-90 text-white h-12 px-8 font-medium shadow-md rounded-lg">
                  <Link href="/#book" className="no-underline" data-analytics-id="important-links-book">Book a Session</Link>
                </Button>
              </div>

              {/* Row 2 — two beige buttons */}
              <div className="col-span-full grid gap-4 sm:grid-cols-2 place-items-stretch">
                <Button
                  asChild
                  className="w-full h-12 font-medium bg-[var(--section-bg-2)] text-[var(--foreground)] border-transparent hover:opacity-90 shadow-sm rounded-lg"
                >
                  <Link href="/privacy" className="no-underline">Privacy Policy</Link>
                </Button>
                <Button
                  asChild
                  className="w-full h-12 font-medium bg-[var(--section-bg-2)] text-[var(--foreground)] border-transparent hover:opacity-90 shadow-sm rounded-lg"
                >
                  <Link href="/terms" className="no-underline">Terms of Service</Link>
                </Button>
              </div>

              {/* Row 3 — three navy buttons */}
              <div className="col-span-full grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <Button
                  asChild
                  className="w-full h-12 font-medium bg-[var(--foreground)] text-white border-transparent hover:opacity-90 rounded-lg shadow-sm"
                >
                  <Link href="/blog/why-money-triggers-anxiety" className="no-underline">Why Money Triggers Anxiety</Link>
                </Button>
                <Button
                  asChild
                  className="w-full h-12 font-medium bg-[var(--foreground)] text-white border-transparent hover:opacity-90 rounded-lg shadow-sm"
                >
                  <Link href="/blog/financial-abuse-and-emotional-healing" className="no-underline">Financial Abuse and Emotional Healing</Link>
                </Button>
                <Button
                  asChild
                  className="w-full h-12 font-medium bg-[var(--foreground)] text-white border-transparent hover:opacity-90 rounded-lg shadow-sm"
                >
                  <Link href="/blog/the-psychology-behind-spending-habits" className="no-underline">The Psychology Behind Spending Habits</Link>
                </Button>
              </div>
              {/* Row 4 — internal section deep-dives */}
              <div className="col-span-full grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {importantSectionLinks.map((link) => (
                  <Button
                    key={link.href}
                    asChild
                    className="w-full h-12 font-medium bg-[var(--foreground)] text-white border-transparent hover:opacity-90 rounded-lg shadow-sm"
                  >
                    <Link href={link.href} className="no-underline">
                      {link.label}
                    </Link>
                  </Button>
                ))}
              </div>
              {/* Row 5 — specialist landing pages */}
              <div className="col-span-full grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <Button
                  asChild
                  className="w-full h-12 font-medium bg-[var(--foreground)] text-white border-transparent hover:opacity-90 rounded-lg shadow-sm"
                >
                  <Link href="/financial-abuse" className="no-underline">Financial Abuse</Link>
                </Button>
                <Button
                  asChild
                  className="w-full h-12 font-medium bg-[var(--foreground)] text-white border-transparent hover:opacity-90 rounded-lg shadow-sm"
                >
                  <Link href="/financial-abuse-therapy" className="no-underline">Financial Abuse Therapy</Link>
                </Button>
                <Button
                  asChild
                  className="w-full h-12 font-medium bg-[var(--foreground)] text-white border-transparent hover:opacity-90 rounded-lg shadow-sm"
                >
                  <Link href="/financial-abuse-therapist" className="no-underline">Financial Abuse Therapist</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="py-12 sm:py-16 md:py-24 bg-[var(--section-bg-2)]">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-6xl mx-auto space-y-8 text-center">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-semibold">Gentle proof</p>
                <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
                  Reflections from clients
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {testimonials.map((testimonial, idx) => (
                  <div
                    key={`testimonial-${idx}`}
                    className="rounded-3xl border border-[var(--secondary)] bg-[var(--section-bg-2)] p-6 text-left shadow-[0_20px_40px_rgba(32,56,91,0.08)]"
                  >
                    <p className="text-[var(--primary)] italic leading-relaxed">“{testimonial.quote}”</p>
                    <div className="mt-6">
                      <p className="font-serif text-xl text-[var(--foreground)]">{testimonial.author}</p>
                      {testimonial.context && (
                        <p className="text-sm text-[var(--primary)]/80">{testimonial.context}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="services" className="py-16 sm:py-24 md:py-32 scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-5">
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[var(--foreground)] font-bold">Other Areas of Specialisation</h2>
              <p className="text-lg sm:text-xl text-[var(--primary)] max-w-2xl mx-auto leading-relaxed">
                Short, digestible overviews with the option to read more
              </p>
            </div>
            <Accordion
              type="single"
              collapsible
              className="bg-[var(--section-bg-1)] rounded-lg border-2 border-[var(--secondary)] divide-y"
            >
              {otherAreas.map((a, idx) => (
                <AccordionItem
                  key={idx}
                  value={`area-${idx}`}
                  className="accordion-hover-card px-4 sm:px-6 transition-all duration-500"
                >
                  <AccordionTrigger className="relative z-10 py-4 sm:py-5 text-[var(--foreground)] items-center text-left sm:text-center">
                    <span className="flex-1 font-serif font-semibold text-lg sm:text-xl leading-snug">
                      {a.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="relative z-10 pb-6 text-[var(--primary)] text-left sm:text-center max-w-3xl mx-auto leading-relaxed space-y-2">
                    <p>
                      {a.summary}
                    </p>
                    <p className="text-[var(--primary)]/90">{a.more}</p>
                    <div className="pt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <Button asChild variant="outline" className="h-11 px-6 w-full sm:w-auto">
                        <Link href="/#book">Schedule a session to begin healing</Link>
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section id="book" className="py-16 sm:py-24 md:py-32 scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-10">
            <div className="text-center">
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[var(--foreground)] font-light">Book a Confidential Consultation</h2>
              <p className="text-lg sm:text-xl text-[var(--primary)]/80 mt-2">Choose the appointment style that feels safest, then confirm via the secure scheduler.</p>
            </div>
            <BookingOptions options={consultationOptions} />
            <BookingScheduler />
          </div>
        </div>
      </section>

      {homepageFaqs.length > 0 && (
        <section className="py-16 sm:py-24 md:py-32 bg-[var(--section-bg-1)]">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-semibold">FAQ</p>
                <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
                  Questions clients ask before booking
                </h2>
              </div>
              <Accordion type="single" collapsible className="bg-[var(--section-bg-2)] rounded-2xl border border-[var(--secondary)] divide-y">
                {homepageFaqs.map((faq, idx) => (
                  <AccordionItem key={`homepage-faq-${idx}`} value={`homepage-faq-${idx}`} className="px-4 sm:px-6">
                    <AccordionTrigger className="text-left text-lg font-serif text-[var(--foreground)] py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-[var(--primary)] leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-16 sm:py-24 md:py-32 scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-12 lg:gap-16 md:grid-cols-2">
              {/* Left - Heading */}
              <div className="space-y-8">
                <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[var(--foreground)] font-light">When you're ready, I'm here.</h2>
                <p className="text-lg sm:text-xl text-[var(--primary)] leading-relaxed">
                  Reach out to schedule an initial consultation or to ask questions. Your privacy, boundaries, and
                  pace are respected at every step.
                </p>
              </div>

              {/* Right - Contact Info */}
              <div className="space-y-6">
                <div className="space-y-5">
                  <a
                    href="tel:0467477786"
                    className="flex flex-col items-start gap-4 p-6 bg-transparent rounded-lg hover:shadow-lg transition-all group border border-transparent hover:border-[var(--primary)] sm:flex-row sm:items-center"
                  >
                    <div className="size-14 bg-[var(--primary)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--primary)] uppercase tracking-wider font-semibold">Phone</p>
                      <p className="text-xl text-[var(--foreground)] font-medium">0467 477 786</p>
                    </div>
                  </a>

                  <a
                    href="mailto:dan@themelbournecounsellor.com.au"
                    className="flex flex-col items-start gap-4 p-6 bg-transparent rounded-lg hover:shadow-lg transition-all group border border-transparent hover:border-[var(--accent)] sm:flex-row sm:items-center"
                  >
                    <div className="size-14 bg-[var(--accent)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--primary)] uppercase tracking-wider font-semibold">Email</p>
                      <p className="text-xl text-[var(--foreground)] font-medium break-words">dan@themelbournecounsellor.com.au</p>
                    </div>
                  </a>
                </div>

                <div className="pt-4">
                  <Button
                    asChild
                    className="w-full bg-[var(--accent)] hover:opacity-90 text-white h-14 font-medium text-base shadow-lg"
                  >
                    <Link href="/#book" data-analytics-id="contact-booking-cta">Book Appointment Online</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <h3 className="text-3xl font-serif font-light text-[var(--foreground)]">If you’re in crisis or need immediate support, please reach out.</h3>
              <p className="text-lg text-[var(--primary)] leading-relaxed">You are not alone — help is available 24/7.</p>
              <p className="text-sm text-[var(--primary)]/80">If you or someone you know is in crisis and needs help now, call triple zero (000).</p>
            </div>
            <CrisisBanner resources={config.resources ?? []} />
            <ResourcesCarousel resources={config.resources ?? []} />
          </div>
        </div>
      </section>

      <Footer backgroundColor="#E5EED2" />
      </main>
      {experiments.showLeadMagnet !== false && <LeadMagnet content={leadMagnet} />}
      {[
        { id: "org-jsonld", data: buildOrganizationSchema(config) },
        {
          id: "service-jsonld",
          data: buildServiceSchema(config, {
            serviceType: "Financial abuse therapy",
            description:
              "Trauma-informed counselling for financial abuse recovery, economic abuse, and money anxiety.",
            url: "/#book",
          }),
        },
        { id: "localbusiness-jsonld", data: buildLocalBusinessSchema(config) },
      ].map(({ id, data }) => (
        <Script
          key={id}
          id={id}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </div>
  )
}
