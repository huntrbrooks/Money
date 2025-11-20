import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Calendar, ArrowRight, CheckCircle2, Video, Home, Building, Footprints, Clock } from "lucide-react"
import { Navigation, Footer } from "@/components/navigation"
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

      <section className="relative">
        <div className="container mx-auto px-6 md:px-8 py-24 md:py-36">
          <div className="grid gap-16 lg:grid-cols-2 items-center max-w-7xl mx-auto">
            {/* Left Column - Text */}
            <div className="space-y-10 lg:pr-12">
              <div className="space-y-6">
                <p className="text-[var(--primary)] text-xs uppercase tracking-[0.2em] font-semibold">Financial Trauma & Monetary Psychotherapy</p>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[var(--foreground)] leading-[1.05] text-balance font-light">
                  Reclaim Your Power. Heal Your Relationship With Money.
                </h1>
              </div>

              <div className="space-y-4 text-[var(--primary)] text-lg leading-relaxed">
                <p className="text-2xl text-[var(--foreground)] font-serif font-medium">
                  Financial trauma can leave deep emotional scars — from shame and anxiety to a loss of self‑trust.
                </p>
                <p className="text-[var(--primary)]">
                  Dan offers a safe, confidential space for women to understand, process, and transform their emotional
                  relationship with money, self‑worth, and security.
                </p>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[var(--accent)] hover:opacity-90 text-white border-0 text-base h-14 px-10 font-medium shadow-lg"
                >
                  <Link href="/bookings">
                    Book a Session
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white bg-white text-base h-14 px-10 font-medium"
                >
                  <a href="#monetary-psychotherapy">Learn More</a>
                </Button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative lg:pl-8">
              <div className="relative aspect-[3/4] max-w-[39.2rem] mx-auto">
                {/* Navy offset panel behind the photo */}
                <div className="absolute inset-0 translate-x-8 translate-y-10 rounded-xl bg-[var(--foreground)] shadow-xl" />
                {/* Main white framed photo card */}
                <div className="relative bg-white p-4 rounded-xl shadow-2xl ring-1 ring-black/5">
                  <img
                    src={config.hero.imageUrl}
                    alt="Portrait of Dan Lobel, counsellor in Melbourne"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {/* Slim green accent bar near the bottom edge of the white frame */}
                  <div className="absolute -bottom-3 left-6 right-6 h-2 bg-[var(--accent)] rounded-sm shadow-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 md:py-32 scroll-mt-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-16 lg:grid-cols-5 items-start">
              {/* Left - Heading */}
              <div className="lg:col-span-2 space-y-6">
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--primary)] font-bold">About Dan</p>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--foreground)] leading-[1.1] font-light">
                  Dan Lobel, D.Couns., B.Couns., MCouns&Psych
                </h2>
                <p className="text-[var(--primary)]/90">The Financial Therapist</p>
              </div>
              {/* Right - Content */}
              <div className="lg:col-span-3 space-y-6 text-lg leading-relaxed text-[var(--primary)]">
                <p className="text-xl text-[var(--foreground)] font-medium">
                  Dan is a warm, empathic counsellor with a deep understanding of human behaviour and emotional
                  complexity. He combines contemporary integrative counselling with behavioural psychology to help
                  clients understand the “why” behind their feelings and choices — particularly around money, self‑worth,
                  grief, and life transitions.
                </p>
                <blockquote className="font-serif text-2xl md:text-3xl text-[var(--primary)] leading-[1.3] font-light italic">
                  “I believe that financial wellbeing isn’t just about numbers — it’s about emotional safety, self‑trust, and our relationship with value.”
                </blockquote>
                <p>
                  Dan’s approach is inclusive, trauma‑informed, and non‑judgemental. He has extensive experience
                  supporting women who have felt disempowered by financial control, inequality, or generational money
                  patterns.
                </p>
                <div className="grid gap-3 md:grid-cols-2 pt-2">
                  <p className="text-sm text-[var(--primary)]/90">📍 Based in Melbourne | Online & In‑Person Sessions</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`mailto:${config.contact?.email || "dan@themelbournecounsellor.com.au"}`}
                      aria-label={`Email Dan at ${config.contact?.email || "dan@themelbournecounsellor.com.au"}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--primary)]/20 bg-white text-[var(--primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                    >
                      <Mail className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm">{config.contact?.email || "dan@themelbournecounsellor.com.au"}</span>
                    </a>
                    <a
                      href={`tel:${(config.contact?.phone || "0467 477 786").replace(/\\s+/g, "")}`}
                      aria-label={`Call Dan on ${config.contact?.phone || "0467 477 786"}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--primary)]/20 bg-white text-[var(--primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                    >
                      <Phone className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm">{config.contact?.phone || "0467 477 786"}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="monetary-psychotherapy" className="py-24 md:py-36 scroll-mt-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-16 lg:grid-cols-5 items-start">
              {/* Left - Heading */}
              <div className="lg:col-span-2 space-y-8">
                <div className="inline-block px-5 py-2 bg-black/5 rounded-full border border-black/10">
                  <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-[0.15em]">Monetary Psychotherapy</span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--foreground)] leading-[1.1] font-light">
                  Money carries stories. Some are empowering — others hold pain.
                </h2>
              </div>

              {/* Right - Content */}
              <div className="lg:col-span-3 space-y-6 text-lg leading-relaxed text-[var(--primary)]">
                <p className="text-xl text-[var(--foreground)] font-medium">
                  Understanding those stories is the first step toward emotional and financial freedom.
                </p>
                <p>Monetary Psychotherapy explores the deep connection between money, emotion, and self‑identity. It’s designed for women who:</p>
                <ul className="grid gap-3">
                  {[
                    "Feel anxiety or guilt when spending or saving",
                    "Struggle with financial control or dependency in relationships",
                    "Carry family or generational patterns of financial stress",
                    "Have experienced financial infidelity, exploitation, or loss",
                    "Want to build confidence in their financial decisions",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--accent)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-2 pt-2">
                  <p>Dan’s sessions focus on:</p>
                  <ul className="grid gap-3">
                    {[
                      "Exploring the emotional roots of your financial story",
                      "Healing shame and rebuilding self‑worth",
                      "Making grounded, values‑aligned money decisions",
                      "Developing resilience, independence, and long‑term confidence",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--accent)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-[var(--primary)]/80 pt-2">🕊 This is not financial advice — it’s emotional healing for the financial self.</p>
                <div className="pt-6">
                  <Button
                    asChild
                    variant="outline"
                    className="border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white bg-transparent h-12 px-8"
                  >
                    <Link href="/bookings">Book a Consultation</Link>
                  </Button>
                </div>
                <div className="pt-2 text-sm">
                  <span className="text-[var(--primary)]/80">Further reading: </span>
                  <Link href="/why-money-triggers-anxiety-dan-lobel.html" className="mr-3">Why Money Triggers Anxiety</Link>
                  <Link href="/financial-abuse-emotional-healing-dan-lobel.html" className="mr-3">Financial Abuse and Emotional Healing</Link>
                  <Link href="/the-psychology-behind-spending-habits-dan-lobel.html">The Psychology Behind Spending Habits</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="important-links" className="py-16 md:py-24 bg-white">
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
                  <Link href="/bookings" className="no-underline">Book a Session</Link>
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

              {/* Row 3 — three navy buttons */}
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
                  <AccordionTrigger className="py-4 sm:py-5 text-[var(--foreground)] items-center">
                    <span className="flex-1 text-center font-serif font-semibold text-lg sm:text-xl leading-snug">
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
                        <Link href="/bookings">Schedule a session to begin healing</Link>
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
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-5">
              <h2 className="font-serif text-5xl md:text-6xl font-light text-[var(--foreground)]">Consultation Formats</h2>
              <p className="text-xl text-[var(--primary)] max-w-2xl mx-auto leading-relaxed">
                Private, flexible options designed to meet you where you are
              </p>
            </div>

            {/* Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {consultationOptions.map((option, index) => {
                const format = option.format.toLowerCase()
                const Icon =
                  format.includes("telehealth") || format.includes("zoom")
                    ? Video
                    : format.includes("home")
                    ? Home
                    : format.includes("room") || format.includes("office")
                    ? Building
                    : format.includes("walk")
                    ? Footprints
                    : format.includes("extended")
                    ? Clock
                    : Calendar
                return (
                  <div
                    key={index}
                    className="group bg-white border border-[var(--foreground)]/10 rounded-xl p-8 hover:border-[var(--accent)]/40 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--secondary)] text-[var(--primary)] flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)]/10 group-hover:text-[var(--accent)] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-serif font-medium text-[var(--foreground)]">{option.format}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-serif text-[var(--foreground)] font-light">{option.price}</span>
                          <span className="text-[var(--primary)]">/ {option.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="pt-2 flex justify-center">
              <div className="inline-flex items-center px-4 py-2 border-2 border-red-300 bg-red-50 text-red-700 font-bold rounded-md shadow-sm w-fit sm:whitespace-nowrap text-center">
                Medicare rebates are not available. Receipts provided for private health or personal records.
              </div>
            </div>

            {/* Forms links */}
            <div className="pt-2">
              <div className="text-center space-y-3">
                <h3 className="font-serif text-3xl md:text-4xl font-light text-[var(--foreground)]">Pre‑Session Forms</h3>
                <p className="text-[var(--primary)]">Please complete these before your first appointment</p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            </div>

            <div className="text-center pt-8">
              <Button
                asChild
                size="lg"
                className="bg-[var(--accent)] hover:opacity-90 text-white border-0 text-base h-14 px-10 font-medium shadow-lg"
              >
                <Link href="/bookings">
                  Schedule Your Session
                  <Calendar className="ml-2 w-5 h-5" />
                </Link>
              </Button>
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
                    <Link href="/bookings">Book Appointment Online</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--section-bg-1)]">
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
      <section id="testimonials" className="py-24 md:py-32 bg-[var(--section-bg-3)]">
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
    </div>
  )
}
