import Link from "next/link"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Mail, Phone } from "lucide-react"
import { Navigation, Footer } from "@/components/navigation"
import { BookingOptions } from "@/components/booking-options"
import { readSiteConfig } from "@/lib/config"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default async function HomePage() {
  const config = await readSiteConfig()
  const heroHighlights = [
    "Private telehealth & in-person sessions",
    "Consent-led pacing that honours your nervous system",
    "Specialised monetary psychotherapy for women",
  ]
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
  const consultationOptions = config.consultations ?? []
  const phoneDisplay = config.contact?.phone ?? "0467 477 786"
  const phoneHref = phoneDisplay.replace(/\s+/g, "")
  const email = config.contact?.email ?? "dan@themelbournecounsellor.com.au"
  const resourceStrip = (config.resources ?? []).slice(0, 4)
  const formLinks = [
    { label: "Enquiry form", href: config.forms?.enquiry || "/enquiry" },
    { label: "Consent form", href: config.forms?.consent || "/consent" },
    { label: "Intake form", href: config.forms?.intake || "/intake" },
  ]
  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ]
  const insightLinks = [
    { label: "About Dan", href: "/about-dan" },
    { label: "Monetary Psychotherapy", href: "/monetary-psychotherapy" },
    { label: "Integrative Counselling", href: "/contemporary-integrative-counselling" },
  ]
  const articleLinks = [
    { label: "Why Money Triggers Anxiety", href: "/why-money-triggers-anxiety-dan-lobel.html" },
    { label: "Financial Abuse & Emotional Healing", href: "/financial-abuse-emotional-healing-dan-lobel.html" },
    { label: "Psychology Behind Spending Habits", href: "/the-psychology-behind-spending-habits-dan-lobel.html" },
  ]
  const landingLinks = [
    { label: "Financial Abuse", href: "/financial-abuse" },
    { label: "Financial Abuse Therapy", href: "/financial-abuse-therapy" },
    { label: "Financial Abuse Therapist", href: "/financial-abuse-therapist" },
  ]
  const supportCards = [
    {
      label: "Phone",
      value: phoneDisplay,
      description: "Call or SMS for time-sensitive enquiries.",
      href: `tel:${phoneHref}`,
      accent: "bg-[#6ca4ac]",
      icon: Phone,
    },
    {
      label: "Email",
      value: email,
      description: "Share forms or context ahead of your session.",
      href: `mailto:${email}`,
      accent: "bg-[#929d5b]",
      icon: Mail,
    },
  ]

  return (
    <div className="min-h-screen bg-transparent text-[#1f2d38]">
      <Navigation />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-[#c7dae4] via-[#dfe8e6] to-[#f2f5db]">
          <div className="container mx-auto px-6 md:px-8 py-24 md:py-32">
            <div className="grid items-center gap-16 lg:grid-cols-[1.05fr,0.95fr] max-w-6xl mx-auto">
              <div className="space-y-8 lg:pr-10 text-[#1f2d38]">
                <p className="text-xs uppercase tracking-[0.4em] text-[#4f665f]">Financial Trauma & Monetary Psychotherapy</p>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight">
                  Reclaim Your Power. Heal Your Relationship With Money.
                </h1>
                <div className="space-y-4 text-lg leading-relaxed text-[#415352]">
                  <p className="text-2xl font-serif text-[#1f3243]">
                    Financial trauma can leave deep emotional scars — from shame and anxiety to a loss of self‑trust.
                  </p>
                  <p>
                    Dan offers a safe, confidential space for women to understand, process, and transform their emotional
                    relationship with money, self‑worth, and security.
                  </p>
                </div>
                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#7b8c45] hover:bg-[#6c7c39] text-white text-base h-14 px-10 font-medium shadow-lg"
                  >
                    <Link href="/#book">
                      Book a Session
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#4a6973] text-[#1f2d38] hover:bg-[#4a6973] hover:text-white bg-white/60 text-base h-14 px-10 font-medium"
                  >
                    <a href={`tel:${phoneHref}`}>Call {phoneDisplay}</a>
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {heroHighlights.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 backdrop-blur"
                    >
                      <CheckCircle2 className="h-5 w-5 text-[#7b8c45]" aria-hidden="true" />
                      <p className="text-sm text-[#4a5c63]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[30rem] rounded-[42px] border-[6px] border-[#476081] bg-white/85 p-6 shadow-[0_35px_80px_rgba(37,62,79,0.25)]">
                  <div className="overflow-hidden rounded-[30px] border border-white/60 bg-[#f6f6f0] aspect-[4/5]">
                    <img src={config.hero.imageUrl} alt="Portrait of Dan Lobel" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="important-links" className="bg-[#f5f7ef] py-20">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="text-center space-y-3">
                <h2 className="font-serif text-4xl md:text-5xl">Important Links</h2>
                <p className="text-[#4f675e]">Direct access to frequently requested information.</p>
              </div>
              <div className="space-y-5">
                <div className="flex justify-center">
                  <Button asChild className="h-12 px-10 rounded-full bg-[#7b8c45] text-white text-base font-medium shadow-md">
                    <Link href="/#book" className="no-underline">
                      Book a confidential consultation
                    </Link>
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {legalLinks.map((link) => (
                    <Button
                      key={link.href}
                      asChild
                      variant="outline"
                      className="h-12 rounded-2xl border-[#cad3c7] bg-white/70 text-[#1f2d38]"
                    >
                      <Link href={link.href} className="no-underline">
                        {link.label}
                      </Link>
                    </Button>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {insightLinks.map((link) => (
                    <Button key={link.href} asChild className="h-12 rounded-2xl bg-[#1f2d38] text-white">
                      <Link href={link.href} className="no-underline">
                        {link.label}
                      </Link>
                    </Button>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {articleLinks.map((link) => (
                    <Button key={link.href} asChild className="h-12 rounded-2xl bg-[#29415a] text-white">
                      <Link href={link.href} className="no-underline">
                        {link.label}
                      </Link>
                    </Button>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {landingLinks.map((link) => (
                    <Button key={link.href} asChild className="h-12 rounded-2xl bg-[#304b55] text-white">
                      <Link href={link.href} className="no-underline">
                        {link.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="bg-[#fefdf8] py-20">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="text-center space-y-4">
                <h2 className="font-serif text-5xl md:text-6xl">Other Areas of Specialisation</h2>
                <p className="text-xl text-[#4a5c63]">Short, digestible overviews with the option to read more.</p>
              </div>
              <div className="rounded-[36px] border border-[#d1d9bf] bg-white/70 p-6 sm:p-10 shadow-[0_25px_60px_rgba(120,140,106,0.15)]">
                <Accordion type="single" collapsible className="divide-y divide-[#e4ead6]">
                  {otherAreas.map((area, idx) => (
                    <AccordionItem key={area.title} value={`area-${idx}`} className="px-2 sm:px-4">
                      <AccordionTrigger className="py-4 text-[#1f2d38] font-serif text-lg">
                        {area.title}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-center text-[#4a5c63] space-y-2">
                        <p>{area.summary}</p>
                        <p className="text-[#4a5c63]/80">{area.more}</p>
                        <div className="pt-3">
                          <Button asChild variant="outline" className="rounded-full px-6">
                            <Link href="/#book">Schedule a session to begin healing</Link>
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fdfbf7] py-20">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-5xl mx-auto grid gap-12 lg:grid-cols-[0.9fr,1.1fr]">
              <div>
                <h2 className="font-serif text-4xl md:text-5xl leading-tight">Contemporary Integrative Counselling</h2>
              </div>
              <div className="space-y-6 text-lg leading-relaxed text-[#4a5c63]">
                {(config.about.paragraphs || []).map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
                <div className="pt-6 space-y-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#4a5c63]">Core Values</p>
                  <div className="flex flex-wrap gap-3">
                    {["Empathy", "Trust", "Respect", "Authenticity", "Compassion", "Collaboration"].map((value) => (
                      <span key={value} className="rounded-full border border-[#d7dfd1] px-5 py-2 text-sm">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f1f5ea] py-20">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.25em] text-[#4a5c63]">Before your appointment</p>
                <h2 className="font-serif text-5xl">Pre-Session Forms</h2>
                <p className="text-[#4a5c63] text-lg">
                  Submit the forms below ahead of time so your first consultation can focus on what matters most.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {formLinks.map((form) => (
                  <Button key={form.href} asChild variant="outline" className="h-12 rounded-full">
                    <Link href={form.href} target="_blank" rel="noopener noreferrer">
                      {form.label}
                    </Link>
                  </Button>
                ))}
              </div>
              <p className="text-sm text-[#4a5c63]/80">
                Need help choosing the right form? Email <a href={`mailto:${email}`} className="underline">{email}</a> or call {phoneDisplay}.
              </p>
            </div>
          </div>
        </section>

        <section id="book" className="bg-[#e6eff6] py-20 scroll-mt-20">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-6xl mx-auto space-y-10">
              <div className="text-center space-y-3">
                <h2 className="font-serif text-5xl">Book a Confidential Consultation</h2>
                <p className="text-[#4a5c63] text-lg">Choose the format, length, and location that meets you where you are.</p>
              </div>
              <BookingOptions options={consultationOptions} />
              <div className="rounded-[24px] border border-[#cfd8cf] bg-white/85 px-6 py-5 text-center text-sm text-[#4a5c63]">
                Prefer email or phone? Reach Dan on <a href={`mailto:${email}`} className="underline">{email}</a> or {phoneDisplay}.
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#f4f6e8] py-20 scroll-mt-20">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-5xl mx-auto grid gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <h2 className="font-serif text-5xl leading-tight">When you're ready, I'm here.</h2>
                <p className="text-lg text-[#4a5c63]">
                  Reach out to schedule an initial consultation or to ask questions. Your privacy, boundaries, and pace are respected at every step.
                </p>
                <div className="space-y-4">
                  {supportCards.map(({ label, value, description, href, accent, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      className="flex items-center gap-4 rounded-[26px] border border-transparent bg-white/80 px-5 py-4 shadow-sm transition hover:border-[#7b8c45]"
                    >
                      <div className={`h-14 w-14 flex items-center justify-center rounded-full text-white ${accent}`}>
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-[#4a5c63]">{label}</p>
                        <p className="text-xl font-medium text-[#1f2d38]">{value}</p>
                        <p className="text-sm text-[#4a5c63]/80">{description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              <div className="rounded-[32px] border border-[#d8e0cf] bg-white/85 p-8 space-y-6 shadow-[0_25px_60px_rgba(48,62,55,0.12)]">
                <p className="text-xs uppercase tracking-[0.25em] text-[#4a5c63]">Practice details</p>
                <p className="text-lg text-[#4a5c63]">
                  Need clarity before booking? Submit your forms, request a specific modality, or ask about availability — I respond within one business day.
                </p>
                <Button asChild className="w-full rounded-full bg-[#7b8c45] text-white h-12 text-base">
                  <Link href="/#book">Book appointment online</Link>
                </Button>
                <div className="space-y-2 text-sm text-[#4a5c63]">
                  <p>Unit 503, 666 Chapel Street · South Yarra VIC 3141</p>
                  <p>Telehealth across Australia</p>
                  <p>Monday – Friday · 10:00am – 7:00pm</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#dce7f2] py-20">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <h3 className="font-serif text-3xl">If you’re in crisis or need immediate support, please reach out.</h3>
              <p className="text-lg text-[#4a5c63]">You are not alone — help is available 24/7. If you or someone you know is unsafe, call triple zero (000).</p>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              {resourceStrip.map((resource) => (
                <div key={resource.name} className="flex items-center gap-4 rounded-[26px] border border-[#c7d6e2] bg-white/85 px-6 py-4 shadow-sm">
                  {resource.logoUrl ? (
                    <img src={resource.logoUrl} alt={`${resource.name} logo`} className="h-12 w-auto object-contain" />
                  ) : null}
                  <div className="text-left">
                    <p className="font-semibold text-[#1f2d38]">{resource.name}</p>
                    <p className="text-sm text-[#4a5c63]">{resource.number}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="hidden">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-6xl mx-auto space-y-10">
              <div className="text-center space-y-3">
                <h2 className="font-serif text-5xl md:text-6xl font-light text-[var(--foreground)]">Kind words from clients</h2>
                <p className="text-[var(--primary)] max-w-2xl mx-auto">Heartfelt reflections that align with Dan’s gentle, trauma‑informed approach.</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[11, 32, 5, 21, 47, 15].map((avatar, idx) => (
                  <div key={avatar} className="bg-white rounded-2xl p-8 border border-[var(--secondary)] shadow-sm">
                    <div className="flex items-center gap-4">
                      <img
                        src={`https://i.pravatar.cc/120?img=${avatar}`}
                        alt="Client portrait"
                        className="h-16 w-16 rounded-full object-cover ring-2 ring-[var(--secondary)]"
                        loading="lazy"
                        decoding="async"
                      />
                      <div>
                        <p className="font-serif text-xl text-[var(--foreground)]">{["Amelia", "Priya", "Elena", "Sophie", "Grace", "Hannah"][idx]}.</p>
                        <p className="text-sm text-[var(--primary)]/80">Client</p>
                      </div>
                    </div>
                    <blockquote className="mt-5 text-[var(--foreground)] leading-relaxed">
                      “Dan’s presence is calm and respectful. I’ve learned to listen to my body, set boundaries, and make money decisions that honour my values.”
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
      <Script id="structured-data-organization" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: config.brand?.name || "The Financial Therapist",
          url: "https://financialabusetherapist.com",
          logo: config.brand?.logoUrl || "/logo.svg",
          sameAs: [
            "https://www.facebook.com/the.melbourne.counsellor/",
            "https://www.instagram.com/the.melbourne.counsellor/#",
            "https://www.linkedin.com/in/dan-lobel-the-melbourne-counsellor-769b61204/",
          ],
          contactPoint: config.contact?.phone
            ? [{
                "@type": "ContactPoint",
                telephone: config.contact.phone,
                contactType: "customer service",
                areaServed: "AU",
                availableLanguage: ["en"],
              }]
            : undefined,
        }),
      }} />
      <Script id="structured-data-service" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Financial abuse therapy",
          provider: {
            "@type": "Organization",
            name: config.brand?.name || "The Financial Therapist",
            url: "https://financialabusetherapist.com",
          },
          areaServed: ["Melbourne", "Victoria", "Australia"],
          availableChannel: {
            "@type": "ServiceChannel",
            serviceUrl: "https://financialabusetherapist.com/#book",
            availableLanguage: ["en"],
          },
        }),
      }} />
      <Script id="structured-data-localbusiness" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["LocalBusiness", "ProfessionalService"],
          name: config.brand?.name || "The Financial Abuse Therapist",
          url: "https://financialabusetherapist.com",
          image: config.seo?.ogImage || "/og.jpg",
          telephone: (config.contact?.phone || "+61 488 222 137").replace(/\s+/g, " "),
          address: {
            "@type": "PostalAddress",
            streetAddress: "Unit 503, 666 Chapel Street",
            addressLocality: "South Yarra",
            addressRegion: "VIC",
            postalCode: "3141",
            addressCountry: "AU",
          },
          areaServed: ["Melbourne", "Victoria", "Australia"],
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "10:00",
              closes: "19:00",
            },
          ],
          knowsAbout: [
            "financial abuse",
            "economic abuse",
            "mental health",
            "therapy",
            "psychology",
            "counselling",
            "monetary psychotherapy",
          ],
          sameAs: [
            "https://www.facebook.com/the.melbourne.counsellor/",
            "https://www.instagram.com/the.melbourne.counsellor/#",
            "https://www.linkedin.com/in/dan-lobel-the-melbourne-counsellor-769b61204/",
          ],
        }),
      }} />
    </div>
  )
}
