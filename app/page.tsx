import Link from "next/link"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Phone, Mail, ArrowRight } from "lucide-react"
import { Navigation, Footer } from "@/components/navigation"
import { BookingOptions } from "@/components/booking-options"
import { readSiteConfig } from "@/lib/config"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CrisisBanner } from "@/components/crisis-banner"
import { ResourcesCarousel } from "@/components/resources-carousel"

export default async function HomePage() {
  const config = await readSiteConfig()
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

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>

      <section className="relative overflow-hidden bg-gradient-to-b from-[#6ca4ac] via-[#88b2ba] to-[#f3f6da]">
        <div className="container mx-auto px-6 md:px-8 py-32 md:py-40">
          <div className="grid items-center gap-16 lg:grid-cols-2 max-w-7xl mx-auto">
            {/* Left Column - Text */}
            <div className="space-y-10 lg:pr-12 text-[#1c2e40]">
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.4em] text-[#5f6b63]/80 font-semibold">
                  Financial Trauma & Monetary Psychotherapy
                </p>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-balance font-light">
                  Reclaim Your Power. Heal Your Relationship With Money.
                </h1>
              </div>

              <div className="space-y-4 text-lg leading-relaxed text-[#566860]">
                <p className="text-2xl text-[#1f3243] font-serif font-medium">
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
                  className="bg-[#7c8d44] hover:bg-[#6c7c39] text-white border-0 text-base h-14 px-10 font-medium shadow-lg"
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
                  className="border border-[#5f7c77] text-[#35515b] hover:bg-[#5f7c77] hover:text-white bg-transparent text-base h-14 px-10 font-medium"
                >
                  <Link href="/monetary-psychotherapy">Learn More</Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[30rem] sm:max-w-[34rem] lg:max-w-[36rem] xl:max-w-[40rem] rounded-[40px] border-[5px] border-[#6585a1] bg-white/80 p-6 shadow-[0_35px_80px_rgba(28,55,66,0.25)]">
                <div className="overflow-hidden rounded-[30px] border border-white/50 bg-[#f3f6f6] aspect-[4/5]">
                  <img
                    src={config.hero.imageUrl}
                    alt="Portrait of Dan Lobel, counsellor in Melbourne"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="important-links" className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">Important Links</h2>
              <p className="text-[var(--primary)]">Quick access to key information</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Row 1 — centered primary CTA */}
              <div className="col-span-full flex justify-center">
                <Button asChild className="bg-[var(--accent)] hover:opacity-90 text-white h-12 px-8 font-medium shadow-md rounded-lg">
                  <Link href="/#book" className="no-underline">Book a Session</Link>
                </Button>
              </div>

              {/* Row 2 — two beige buttons */}
              <div className="col-span-full grid gap-4 sm:grid-cols-2 place-items-stretch">
                <Button
                  asChild
                  className="h-12 font-medium bg-[var(--section-bg-2)] text-[var(--foreground)] border-transparent hover:opacity-90 shadow-sm rounded-lg"
                >
                  <Link href="/privacy" className="no-underline">Privacy Policy</Link>
                </Button>
                <Button
                  asChild
                  className="h-12 font-medium bg-[var(--section-bg-2)] text-[var(--foreground)] border-transparent hover:opacity-90 shadow-sm rounded-lg"
                >
                  <Link href="/terms" className="no-underline">Terms of Service</Link>
                </Button>
              </div>

              {/* Row 3 — dedicated deep-dive pages */}
              <div className="col-span-full grid gap-4 md:grid-cols-3">
                <Button
                  asChild
                  className="h-12 font-medium bg-[var(--foreground)] text-white border-transparent hover:opacity-90 rounded-lg shadow-sm"
                >
                  <Link href="/about-dan" className="no-underline">About Dan</Link>
                </Button>
                <Button
                  asChild
                  className="h-12 font-medium bg-[var(--foreground)] text-white border-transparent hover:opacity-90 rounded-lg shadow-sm"
                >
                  <Link href="/monetary-psychotherapy" className="no-underline">Monetary Psychotherapy</Link>
                </Button>
                <Button
                  asChild
                  className="h-12 font-medium bg-[var(--foreground)] text-white border-transparent hover:opacity-90 rounded-lg shadow-sm"
                >
                  <Link href="/contemporary-integrative-counselling" className="no-underline">Integrative Counselling</Link>
                </Button>
              </div>

              {/* Row 4 — three navy buttons */}
              <div className="col-span-full grid gap-4 md:grid-cols-3">
                <Button
                  asChild
                  className="h-12 font-medium bg-[var(--foreground)] text-white border-transparent hover:opacity-90 rounded-lg shadow-sm"
                >
                  <Link href="/why-money-triggers-anxiety-dan-lobel.html" className="no-underline">Why Money Triggers Anxiety</Link>
                </Button>
                <Button
                  asChild
                  className="h-12 font-medium bg-[var(--foreground)] text-white border-transparent hover:opacity-90 rounded-lg shadow-sm"
                >
                  <Link href="/financial-abuse-emotional-healing-dan-lobel.html" className="no-underline">Financial Abuse and Emotional Healing</Link>
                </Button>
                <Button
                  asChild
                  className="h-12 font-medium bg-[var(--foreground)] text-white border-transparent hover:opacity-90 rounded-lg shadow-sm"
                >
                  <Link href="/the-psychology-behind-spending-habits-dan-lobel.html" className="no-underline">The Psychology Behind Spending Habits</Link>
                </Button>
              </div>
              {/* Row 5 — new landing pages */}
              <div className="col-span-full grid gap-4 md:grid-cols-3">
                <Button
                  asChild
                  className="h-12 font-medium bg-[var(--foreground)] text-white border-transparent hover:opacity-90 rounded-lg shadow-sm"
                >
                  <Link href="/financial-abuse" className="no-underline">Financial Abuse</Link>
                </Button>
                <Button
                  asChild
                  className="h-12 font-medium bg-[var(--foreground)] text-white border-transparent hover:opacity-90 rounded-lg shadow-sm"
                >
                  <Link href="/financial-abuse-therapy" className="no-underline">Financial Abuse Therapy</Link>
                </Button>
                <Button
                  asChild
                  className="h-12 font-medium bg-[var(--foreground)] text-white border-transparent hover:opacity-90 rounded-lg shadow-sm"
                >
                  <Link href="/financial-abuse-therapist" className="no-underline">Financial Abuse Therapist</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-24 md:py-32 scroll-mt-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-5">
              <h2 className="font-serif text-6xl md:text-7xl text-[var(--foreground)] font-bold">Other Areas of Specialisation</h2>
              <p className="text-xl text-[var(--primary)] max-w-2xl mx-auto leading-relaxed">
                Short, digestible overviews with the option to read more
              </p>
            </div>
            <Accordion type="single" collapsible className="bg-[var(--section-bg-1)] rounded-lg border-2 border-[var(--secondary)] divide-y">
              {otherAreas.map((a, idx) => (
                <AccordionItem key={idx} value={`area-${idx}`} className="px-4 sm:px-6">
                  <AccordionTrigger className="py-4 sm:py-5 text-[var(--foreground)] items-center relative isolate overflow-hidden before:content-[''] before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-r before:from-[var(--brand-pale-blue)] before:via-white/70 before:to-[var(--brand-pale-green)] before:opacity-0 before:transition-opacity before:duration-500 before:pointer-events-none hover:before:opacity-100 data-[state=open]:before:opacity-100">
                    <span className="relative z-10 flex-1 text-center font-serif font-semibold text-lg sm:text-xl leading-snug">
                      {a.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-[var(--primary)] text-center max-w-3xl mx-auto leading-relaxed space-y-2">
                    <p>
                      {a.summary}
                    </p>
                    <p className="text-[var(--primary)]/90">{a.more}</p>
                    <div className="pt-4 flex justify-center">
                      <Button asChild variant="outline" className="h-11 px-6">
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

      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-16 lg:grid-cols-3">
              {/* Left - Heading */}
              <div className="lg:col-span-1">
                <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] sticky top-24 font-light leading-tight">
                  Contemporary Integrative Counselling
                </h2>
              </div>

              {/* Right - Content */}
              <div className="lg:col-span-2 space-y-6 text-lg leading-relaxed text-[var(--primary)]">
                {(config.about.paragraphs || []).map((para, idx) => <p key={idx}>{para}</p>)}

                <div className="pt-8 space-y-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-[var(--primary)] font-bold">Core Values</p>
                  <div className="flex flex-wrap gap-3">
                    {["Empathy", "Trust", "Respect", "Authenticity", "Compassion", "Collaboration"].map((value) => (
                      <span
                        key={value}
                        className="px-5 py-2 bg-[var(--primary)]/10 text-[var(--primary)] text-sm rounded-full border border-[var(--primary)]/20"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto space-y-10 text-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)]/70">Before your appointment</p>
              <h2 className="font-serif text-5xl md:text-6xl font-light text-[var(--foreground)]">Pre‑Session Forms</h2>
              <p className="text-xl text-[var(--primary)]/85 leading-relaxed">
                Submit the forms below ahead of time so your first consultation can focus on what matters most.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Button asChild variant="outline" className="h-12 font-medium">
                <Link href={config.forms?.enquiry || "#"} target="_blank" rel="noopener noreferrer">
                  Enquiry form
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 font-medium">
                <Link href={config.forms?.consent || "#"} target="_blank" rel="noopener noreferrer">
                  Consent form
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 font-medium">
                <Link href={config.forms?.intake || "#"} target="_blank" rel="noopener noreferrer">
                  Intake form
                </Link>
              </Button>
            </div>
            <p className="text-sm text-[var(--primary)]/80">
              Need help choosing the right form? Email{" "}
              <a href="mailto:dan@themelbournecounsellor.com.au" className="underline">
                dan@themelbournecounsellor.com.au
              </a>{" "}
              or call 0467 477 786.
            </p>
          </div>
        </div>
      </section>

      <section id="book" className="py-24 md:py-32 scroll-mt-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-10">
            <div className="text-center">
              <h2 className="font-serif text-5xl md:text-6xl text-[var(--foreground)] font-light">Book a Confidential Consultation</h2>
              <p className="text-xl text-[var(--primary)]/80 mt-3">Choose the format, length, and location that meets you where you are.</p>
            </div>

            <BookingOptions options={consultationOptions} />

            <div className="rounded-[24px] border border-[var(--primary)]/10 bg-white/80 px-6 py-5 text-center text-sm text-[var(--primary)]/75">
              Prefer email or phone? Reach Dan on{" "}
              <a href="mailto:dan@themelbournecounsellor.com.au" className="underline">
                dan@themelbournecounsellor.com.au
              </a>{" "}
              or 0467 477 786.
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 md:py-32 scroll-mt-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-16 md:grid-cols-2">
              {/* Left - Heading */}
              <div className="space-y-8">
                <h2 className="font-serif text-5xl md:text-6xl text-[var(--foreground)] font-light">When you're ready, I'm here.</h2>
                <p className="text-xl text-[var(--primary)] leading-relaxed">
                  Reach out to schedule an initial consultation or to ask questions. Your privacy, boundaries, and
                  pace are respected at every step.
                </p>
              </div>

              {/* Right - Contact Info */}
              <div className="space-y-6">
                <div className="space-y-5">
                  <a
                    href="tel:0467477786"
                    className="flex items-center gap-5 p-6 bg-transparent rounded-lg hover:shadow-lg transition-all group border border-transparent hover:border-[var(--primary)]"
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
                    className="flex items-center gap-5 p-6 bg-transparent rounded-lg hover:shadow-lg transition-all group border border-transparent hover:border-[var(--accent)]"
                  >
                    <div className="size-14 bg-[var(--accent)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--primary)] uppercase tracking-wider font-semibold">Email</p>
                      <p className="text-xl text-[var(--foreground)] font-medium break-all">dan@themelbournecounsellor.com.au</p>
                    </div>
                  </a>
                </div>

                <div className="pt-4">
                  <Button
                    asChild
                    className="w-full bg-[var(--accent)] hover:opacity-90 text-white h-14 font-medium text-base shadow-lg"
                  >
                    <Link href="/#book">Book Appointment Online</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 md:px-8">
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

      {/* Testimonials */}
      <section id="testimonials" className="hidden">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <h2 className="font-serif text-5xl md:text-6xl font-light text-[var(--foreground)]">Kind words from clients</h2>
              <p className="text-[var(--primary)] max-w-2xl mx-auto">Heartfelt reflections that align with Dan’s gentle, trauma‑informed approach.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-8 border border-[var(--secondary)] shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src="https://i.pravatar.cc/120?img=11"
                    alt="Portrait of Amelia R."
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-[var(--secondary)]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <p className="font-serif text-xl text-[var(--foreground)]">Amelia R.</p>
                    <p className="text-sm text-[var(--primary)]/80">Telehealth Client</p>
                  </div>
                </div>
                <blockquote className="mt-5 text-[var(--foreground)] leading-relaxed">
                  “Dan’s presence is calm and respectful. I’ve learned to listen to my body, set boundaries, and make money decisions that honour my values.”
                </blockquote>
              </div>
              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-8 border border-[var(--secondary)] shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src="https://i.pravatar.cc/120?img=32"
                    alt="Portrait of Priya K."
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-[var(--secondary)]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <p className="font-serif text-xl text-[var(--foreground)]">Priya K.</p>
                    <p className="text-sm text-[var(--primary)]/80">In‑Person Client</p>
                  </div>
                </div>
                <blockquote className="mt-5 text-[var(--foreground)] leading-relaxed">
                  “I came in with anxiety and shame around finances. With Dan, I found steady ground and a kinder relationship with myself.”
                </blockquote>
              </div>
              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-8 border border-[var(--secondary)] shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src="https://i.pravatar.cc/120?img=5"
                    alt="Portrait of Elena M."
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-[var(--secondary)]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <p className="font-serif text-xl text-[var(--foreground)]">Elena M.</p>
                    <p className="text-sm text-[var(--primary)]/80">Monetary Psychotherapy</p>
                  </div>
                </div>
                <blockquote className="mt-5 text-[var(--foreground)] leading-relaxed">
                  “Dan helped me untangle old stories about worth. I feel safer, clearer, and more in control of my choices.”
                </blockquote>
              </div>
              {/* Card 4 */}
              <div className="bg-white rounded-2xl p-8 border border-[var(--secondary)] shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src="https://i.pravatar.cc/120?img=21"
                    alt="Portrait of Sophie T."
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-[var(--secondary)]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <p className="font-serif text-xl text-[var(--foreground)]">Sophie T.</p>
                    <p className="text-sm text-[var(--primary)]/80">Telehealth Client</p>
                  </div>
                </div>
                <blockquote className="mt-5 text-[var(--foreground)] leading-relaxed">
                  “The pace was gentle and consent‑led. I learned practical regulation tools I actually use day‑to‑day.”
                </blockquote>
              </div>
              {/* Card 5 */}
              <div className="bg-white rounded-2xl p-8 border border-[var(--secondary)] shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src="https://i.pravatar.cc/120?img=47"
                    alt="Portrait of Grace L."
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-[var(--secondary)]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <p className="font-serif text-xl text-[var(--foreground)]">Grace L.</p>
                    <p className="text-sm text-[var(--primary)]/80">In‑Person Client</p>
                  </div>
                </div>
                <blockquote className="mt-5 text-[var(--foreground)] leading-relaxed">
                  “Working with Dan rebuilt my self‑trust. I’m making decisions from care, not fear.”
                </blockquote>
              </div>
              {/* Card 6 */}
              <div className="bg-white rounded-2xl p-8 border border-[var(--secondary)] shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src="https://i.pravatar.cc/120?img=15"
                    alt="Portrait of Hannah W."
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-[var(--secondary)]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <p className="font-serif text-xl text-[var(--foreground)]">Hannah W.</p>
                    <p className="text-sm text-[var(--primary)]/80">Monetary Psychotherapy</p>
                  </div>
                </div>
                <blockquote className="mt-5 text-[var(--foreground)] leading-relaxed">
                  “I left each session feeling more grounded and hopeful. The work is tender and deeply respectful.”
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </main>
      {/* Organization & Service JSON-LD */}
      {(() => {
        const organizationJsonLd = {
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
            ? [
                {
                  "@type": "ContactPoint",
                  telephone: config.contact.phone,
                  contactType: "customer service",
                  areaServed: "AU",
                  availableLanguage: ["en"],
                },
              ]
            : undefined,
        }
        const serviceJsonLd = {
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
        }
        const localBusinessJsonLd = {
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
        }
        return (
          <>
            <Script
              id="org-jsonld"
              type="application/ld+json"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
            />
            <Script
              id="service-jsonld"
              type="application/ld+json"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
            />
            <Script
              id="localbusiness-jsonld"
              type="application/ld+json"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
            />
          </>
        )
      })()}
    </div>
  )
}
