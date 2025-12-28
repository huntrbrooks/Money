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
import { FlowSection } from "@/components/flow-section"
import { EmailLink } from "@/components/email-link"
import {
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildPageMetadata,
  buildServiceSchema,
} from "@/lib/seo"

const HOME_TITLE = "Financial Abuse Therapist | Financial Trauma — Dan Lobel"
const HOME_DESCRIPTION =
  "Trauma-informed counselling in Melbourne focused on financial abuse recovery, financial trauma, money anxiety and safe, gender-aware and inclusive care."
const HOME_KEYWORDS = [
  "financial therapy Melbourne",
  "financial abuse counselling",
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
  const homepageContent = config.homepage ?? {}
  const sections = homepageContent.sections ?? {}
  const copy = homepageContent.copy ?? {}
  const valueProps = homepageContent.valueProps ?? []
  const testimonials = homepageContent.testimonials ?? []
  const homepageFaqs = homepageContent.faqs ?? []
  const hasTestimonials = testimonials.length > 0
  const leadMagnet = homepageContent.leadMagnet
  const showValueProps = sections.showValueProps !== false
  const showImportantLinks = sections.showImportantLinks !== false
  const showImportantLinksCallButton = sections.showImportantLinksCallButton !== false
  const showTestimonials = sections.showTestimonials !== false
  const showOtherAreas = sections.showOtherAreas !== false
  const showBooking = sections.showBooking !== false
  const showFaqs = sections.showFaqs !== false
  const showContact = sections.showContact !== false
  const showCrisis = sections.showCrisis !== false
  // Lead magnet popup (bottom-right). Default OFF unless explicitly enabled.
  // Priority:
  // - `config.experiments.showLeadMagnet` (admin toggle) if present
  // - `homepage.sections.showLeadMagnet` if present
  // - otherwise false
  const showLeadMagnet = config.experiments?.showLeadMagnet ?? sections.showLeadMagnet ?? false

  const otherAreas = homepageContent.otherAreas ?? []
  const contentSections = config.contentSections ?? []
  // Map content sections to their correct routes (dedicated pages take priority)
  const contentSectionRouteMap: Record<string, string> = {
    "why-money-triggers-anxiety": "/blog/why-money-triggers-anxiety",
    "what-is-financial-abuse": "/financial-abuse",
    "monetary-psychotherapy": "/monetary-psychotherapy",
    "financial-abuse-therapy": "/financial-abuse-therapy",
    "about-dan": "/about",
  }
  // Convert content sections to nav links for display
  const allContentSectionLinks = contentSections.map((section) => ({
    label: section.title,
    href: contentSectionRouteMap[section.slug] ?? `/content-sections/${section.slug}`,
  }))
  const consultationOptions = config.consultations ?? []
  const bookingCopy = config.bookingCopy
  const primaryCta = hero.primaryCta ?? { label: "Book a Session", href: "/#book" }
  const contactPhone = config.contact?.phone ?? ""
  const contactEmail = config.contact?.email ?? ""
  // Format phone number for tel: links - remove all spaces for proper tel: protocol
  const callDanHref = contactPhone ? `tel:${contactPhone.replace(/\s+/g, "")}` : "tel:"
  const eyebrow = String(hero.eyebrow ?? "")
    .replace(/monetary psychotherapy/gi, "")
    .replace(/\s*&\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()

  const HERO_END_BG = "var(--section-bg-1)"
  const bgForIndex = (idx: number) => (idx % 2 === 0 ? "var(--section-bg-2)" : "var(--section-bg-1)")
  const enabledFlowCount =
    (showValueProps && valueProps.length > 0 ? 1 : 0) +
    (showImportantLinks ? 1 : 0) +
    (showTestimonials && hasTestimonials ? 1 : 0) +
    (showOtherAreas ? 1 : 0) +
    (showBooking ? 1 : 0) +
    (showFaqs && homepageFaqs.length > 0 ? 1 : 0) +
    (showContact ? 1 : 0) +
    (showCrisis ? 1 : 0)
  // Footer continues the alternating sequence (the "next" colour after the final enabled section).
  const footerBg = bgForIndex(enabledFlowCount)

  return (
    <div className="min-h-screen bg-[var(--section-bg-2)]">
      <Navigation />
      <main>

      <section
        className="relative overflow-hidden bg-[linear-gradient(180deg,#d7e9ec_0%,rgba(215,233,236,0.95)_20%,rgba(108,164,172,0.85)_55%,rgba(108,164,172,0.7)_72%,rgba(229,238,210,0.9)_90%,#e5eed2_100%)]"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-32">
          <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 items-center max-w-7xl mx-auto">
            {/* Left Column - Text */}
            <div className="order-2 space-y-8 sm:space-y-10 lg:order-1 lg:pr-12 text-center lg:text-left">
              <div className="space-y-6">
                {eyebrow ? (
                  <p className="text-[#6b7d86] text-xs uppercase tracking-[0.3em] font-semibold">{eyebrow}</p>
                ) : null}
                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[var(--foreground)] leading-tight text-balance font-light">
                  {hero.title}
                </h1>
              </div>

              <div className="space-y-5 text-base sm:text-lg leading-relaxed text-[var(--foreground)]/90 max-w-2xl mx-auto lg:mx-0">
                <p className="text-xl sm:text-2xl text-[var(--foreground)] font-serif font-medium">
                  {hero.subtitle}
                </p>
                <p className="text-[var(--foreground)]/80">{hero.description}</p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
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
                  <a href={callDanHref} aria-label="Call Dan" data-analytics-id="hero-secondary-cta">
                    Call Dan
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="order-1 lg:order-2 relative lg:pl-8">
              <div className="relative mx-auto w-full max-w-[32rem] sm:max-w-[48rem] md:max-w-[56rem]">
                <div className="overflow-hidden rounded-[30px] aspect-[4/3] sm:aspect-auto">
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
      </section>

      <div data-homepage-flow>
        {(() => {
          const flowSections: Array<{
            key: string
            enabled: boolean
            id?: string
            className: string
            content: React.ReactNode
          }> = [
            {
              key: "valueProps",
              enabled: showValueProps && valueProps.length > 0,
              className: "py-12 sm:py-16 md:py-24",
              content: (
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                  <div className="max-w-5xl mx-auto space-y-8 text-center">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-semibold">
                        {copy.valuePropsEyebrow ?? "What to expect"}
                      </p>
                      <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
                        {copy.valuePropsHeading ?? "Therapy that honours your nervous system"}
                      </h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3 text-center md:text-left">
                      {valueProps.map((item, idx) => (
                        <div
                          key={`value-prop-${idx}`}
                          className="rounded-3xl border border-[var(--secondary)] bg-[var(--section-bg-1)]/80 p-6 shadow-sm"
                        >
                          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
                            0{idx + 1}
                          </p>
                          <h3 className="font-serif text-2xl text-[var(--foreground)] mt-2">{item.title}</h3>
                          <p className="text-[var(--primary)] mt-3 leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "importantLinks",
              enabled: showImportantLinks,
              id: "important-links",
              className: "py-12 sm:py-16 md:py-24",
              content: (
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                  <div className="max-w-5xl mx-auto space-y-8">
                    <div className="text-center space-y-3">
                      <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
                        {copy.importantLinksHeading ?? "Important Links"}
                      </h2>
                      <p className="text-[var(--primary)]">
                        {copy.importantLinksSubheading ?? "Quick access to key information"}
                      </p>
                    </div>

                    {/* Feature CTA (call) */}
                    {showImportantLinksCallButton && contactPhone ? (
                      <div className="flex justify-center">
                        <Button
                          asChild
                          size="lg"
                          className="w-full sm:w-auto max-w-2xl rounded-full px-8 sm:px-10 h-14 sm:h-16 text-base sm:text-lg font-semibold bg-[#F5F5DC] text-[var(--foreground)] border border-transparent shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] hover:bg-[#F0F0D8] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 active:translate-y-0"
                        >
                          <a href={callDanHref} className="no-underline" aria-label="Call Dan">
                            {copy.importantLinksCallCtaLabel ?? "Call Dan for a brief discussion of your situation"}
                          </a>
                        </Button>
                      </div>
                    ) : null}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {/* Row 1 — centered primary CTA */}
                      <div className="col-span-full flex justify-center">
                        <Button
                          asChild
                          className="w-full sm:w-auto bg-[var(--accent)] hover:opacity-90 text-white h-12 px-8 font-medium shadow-md rounded-lg"
                        >
                          <Link href="/#book" className="no-underline" data-analytics-id="important-links-book">
                            Book a Session
                          </Link>
                        </Button>
                      </div>

                      {/* Row 2 — two beige buttons */}
                      <div className="col-span-full grid gap-4 sm:grid-cols-2 place-items-stretch">
                        <Button
                          asChild
                          className="w-full h-12 font-medium bg-[var(--section-bg-2)] text-[var(--foreground)] border-transparent hover:opacity-90 shadow-sm rounded-lg"
                        >
                          <Link href="/privacy" className="no-underline">
                            Privacy Policy
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className="w-full h-12 font-medium bg-[var(--section-bg-2)] text-[var(--foreground)] border-transparent hover:opacity-90 shadow-sm rounded-lg"
                        >
                          <Link href="/terms" className="no-underline">
                            Terms of Service
                          </Link>
                        </Button>
                      </div>

                      {/* Row 3-5 — all 9 content sections in navy buttons */}
                      <div className="col-span-full grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {allContentSectionLinks.map((link) => (
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
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "testimonials",
              enabled: showTestimonials && hasTestimonials,
              className: "py-12 sm:py-16 md:py-24",
              content: (
                <>
                  <div
                    className="pointer-events-none absolute inset-0 opacity-65 bg-[radial-gradient(1200px_720px_at_18%_12%,color-mix(in_oklch,var(--primary)_24%,transparent),transparent_62%),radial-gradient(980px_560px_at_78%_6%,color-mix(in_oklch,var(--accent)_20%,transparent),transparent_60%),radial-gradient(1100px_620px_at_52%_88%,color-mix(in_oklch,var(--foreground)_12%,transparent),transparent_64%)]"
                    aria-hidden
                  />
                  <div className="container relative mx-auto px-4 sm:px-6 md:px-8">
                    <div className="max-w-6xl mx-auto space-y-8 text-center">
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-semibold">
                          {copy.testimonialsEyebrow ?? "Gentle proof"}
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
                          {copy.testimonialsHeading ?? "Reflections from clients"}
                        </h2>
                      </div>
                      <div className="grid gap-6 md:grid-cols-3">
                        {testimonials.map((testimonial, idx) => (
                          <div
                            key={`testimonial-${idx}`}
                            className="rounded-3xl border border-[var(--secondary)]/70 bg-[color-mix(in_oklch,var(--section-bg-2)_82%,white)] backdrop-blur-sm p-6 text-left shadow-[0_24px_48px_rgba(32,56,91,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(32,56,91,0.12)]"
                          >
                            <p className="text-[var(--primary)] italic leading-relaxed">“{testimonial.quote}”</p>
                            <div className="mt-6 border-t border-[var(--secondary)]/50 pt-4">
                              <p className="font-serif text-xl text-[var(--foreground)]">{testimonial.author}</p>
                              {testimonial.context && <p className="text-sm text-[var(--primary)]/80">{testimonial.context}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ),
            },
            {
              key: "otherAreas",
              enabled: showOtherAreas,
              id: "services",
              className: "py-16 sm:py-24 md:py-32 scroll-mt-20",
              content: (
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                  <div className="max-w-5xl mx-auto space-y-12">
                    <div className="text-center space-y-5">
                      <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[var(--foreground)] font-bold">
                        {copy.otherAreasHeading ?? "Other Areas of Specialisation"}
                      </h2>
                      <p className="text-lg sm:text-xl text-[var(--primary)] max-w-2xl mx-auto leading-relaxed">
                        {copy.otherAreasSubheading ?? "Short, digestible overviews with the option to read more"}
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
                            <p>{a.summary}</p>
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
              ),
            },
            {
              key: "booking",
              enabled: showBooking,
              id: "book",
              className: "py-16 sm:py-24 md:py-32 scroll-mt-20",
              content: (
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                  <div className="mx-auto flex max-w-6xl flex-col gap-10">
                    <div className="text-center">
                      <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[var(--foreground)] font-light">
                        {copy.bookingHeading ?? "Book a Confidential Consultation"}
                      </h2>
                      <p className="text-lg sm:text-xl text-[var(--primary)]/80 mt-2">
                        {copy.bookingSubheading ??
                          "Choose the appointment style that feels safest, then confirm via the secure scheduler."}
                      </p>
                    </div>
                    <BookingOptions
                      options={consultationOptions}
                      bookingCopy={bookingCopy}
                      contactEmail={contactEmail || undefined}
                      contactPhone={contactPhone || undefined}
                    />
                    <BookingScheduler
                      schedulerPoints={bookingCopy?.schedulerPoints}
                      helpText={bookingCopy?.schedulerHelpText}
                      email={contactEmail || undefined}
                      phone={contactPhone || undefined}
                    />
                  </div>
                </div>
              ),
            },
            {
              key: "faqs",
              enabled: showFaqs && homepageFaqs.length > 0,
              className: "py-16 sm:py-24 md:py-32",
              content: (
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="text-center space-y-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-semibold">
                        {copy.faqsEyebrow ?? "FAQ"}
                      </p>
                      <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
                        {copy.faqsHeading ?? "Questions clients ask before booking"}
                      </h2>
                    </div>
                    <Accordion
                      type="single"
                      collapsible
                      className="bg-[var(--section-bg-2)] rounded-2xl border border-[var(--secondary)] divide-y"
                    >
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
              ),
            },
            {
              key: "contact",
              enabled: showContact,
              id: "contact",
              className: "py-16 sm:py-24 md:py-32 scroll-mt-20",
              content: (
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                  <div className="max-w-4xl mx-auto">
                    <div className="grid gap-12 lg:gap-16 md:grid-cols-2">
                      {/* Left - Heading */}
                      <div className="space-y-8 text-center md:text-left">
                        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[var(--foreground)] font-light">
                          {copy.contactHeading ?? "When you're ready, I'm here."}
                        </h2>
                        <p className="text-lg sm:text-xl text-[var(--primary)] leading-relaxed">
                          {copy.contactBody ??
                            "Reach out to schedule an initial consultation or to ask questions. Your privacy, boundaries, and pace are respected at every step."}
                        </p>
                      </div>

                      {/* Right - Contact Info */}
                      <div className="space-y-6">
                        <div className="space-y-5">
                          <a
                            href={contactPhone ? `tel:${contactPhone.replace(/\s+/g, "")}` : "tel:"}
                            className="flex flex-col items-center md:items-start gap-4 p-6 bg-transparent rounded-lg hover:shadow-lg transition-all group border border-transparent hover:border-[var(--primary)] sm:flex-row sm:items-center"
                          >
                            <div className="size-14 bg-[var(--primary)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                              <Phone className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-center md:text-left">
                              <p className="text-xs text-[var(--primary)] uppercase tracking-wider font-semibold">Phone</p>
                              <p className="text-xl text-[var(--foreground)] font-medium">{contactPhone || "—"}</p>
                            </div>
                          </a>

                          <EmailLink
                            email={contactEmail || "dan@financialabusetherapist.com.au"}
                            subject="Contact Request"
                            className="flex flex-col items-center md:items-start gap-4 p-6 bg-transparent rounded-lg hover:shadow-lg transition-all group border border-transparent hover:border-[var(--accent)] sm:flex-row sm:items-center cursor-pointer"
                          >
                            <div className="size-14 bg-[var(--accent)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                              <Mail className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-center md:text-left">
                              <p className="text-xs text-[var(--primary)] uppercase tracking-wider font-semibold">Email</p>
                              <p className="text-xl text-[var(--foreground)] font-medium break-words">{contactEmail || "—"}</p>
                            </div>
                          </EmailLink>
                        </div>

                        <div className="pt-4">
                          <Button
                            asChild
                            className="w-full bg-[var(--accent)] hover:opacity-90 text-white h-14 font-medium text-base shadow-lg"
                          >
                            <Link href="/#book" data-analytics-id="contact-booking-cta">
                              Book Appointment Online
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "crisis",
              enabled: showCrisis,
              className: "py-16 sm:py-20",
              content: (
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                  <div className="max-w-6xl mx-auto space-y-10">
                    <div className="text-center space-y-3">
                      <h3 className="text-3xl font-serif font-light text-[var(--foreground)]">
                        {copy.crisisHeading ?? "If you’re in crisis or need immediate support, please reach out."}
                      </h3>
                      <p className="text-lg text-[var(--primary)] leading-relaxed">
                        {copy.crisisBody ?? "You are not alone — help is available 24/7."}
                      </p>
                      <p className="text-sm text-[var(--primary)]/80">
                        {copy.crisisNote ??
                          "If you or someone you know is in crisis and needs help now, call triple zero (000)."}
                      </p>
                    </div>
                    <CrisisBanner resources={config.resources ?? []} />
                    <ResourcesCarousel resources={config.resources ?? []} />
                  </div>
                </div>
              ),
            },
          ]

          const enabled = flowSections.filter((s) => s.enabled)

          if (enabled.length === 0) {
            // Ensure hero -> footer still blends if every section is toggled off.
            return (
              <div
                aria-hidden
                className="h-[var(--section-fade-height)]"
                style={{ backgroundImage: `linear-gradient(to bottom, ${HERO_END_BG}, ${footerBg})` }}
              />
            )
          }

          return enabled.map((s, idx) => {
            const bg = bgForIndex(idx)
            const prevBg = idx === 0 ? HERO_END_BG : undefined
            const nextBg = idx === enabled.length - 1 ? footerBg : bgForIndex(idx + 1)
            return (
              <FlowSection
                key={s.key}
                id={s.id}
                className={s.className}
                bg={bg}
                prevBg={prevBg}
                nextBg={nextBg}
                topFade={idx === 0}
              >
                {s.content}
              </FlowSection>
            )
          })
        })()}
      </div>

      <Footer backgroundColor={footerBg} />
      </main>
      {showLeadMagnet && <LeadMagnet content={leadMagnet} />}
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
