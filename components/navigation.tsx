"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"

type NavLink = { label: string; href: string }
type Config = {
  brand?: { name?: string; subtitle?: string; tagline?: string; logoUrl?: string; headerBannerUrl?: string }
  navigation?: NavLink[]
  contact?: { phone?: string; email?: string }
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cfg, setCfg] = useState<Config>({})

  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((d) => setCfg(d))
      .catch(() => {})
  }, [])

  const links = cfg.navigation ?? [
    { label: "Home", href: "/" },
    { label: "About", href: "/about-dan" },
    { label: "Monetary Psychotherapy", href: "/monetary-psychotherapy" },
    { label: "Services", href: "/#services" },
    { label: "Contact", href: "/#contact" },
  ]
  const brandName = (cfg.brand?.name ?? "Financial Abuse Therapist").replace(/^\s*The\s+/i, "")
  const logoSrc = "/Logo.png"
  const brandColor = "#1f3f5c"

  return (
    <nav
      className="relative z-50 shadow-[0_15px_35px_rgba(30,60,70,0.18)]"
      style={{
        background: "linear-gradient(180deg, #929d5b 0%, #6ca4ac 100%)",
      }}
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className="relative py-12 md:py-16 flex items-center justify-center">
          <Link href="/" aria-label="Home" className="inline-flex justify-center">
            <img src={logoSrc} alt={brandName} className="h-24 md:h-32 lg:h-36 w-auto object-contain" />
          </Link>

          {/* Right-aligned Menu dropdown */}
          <div className="absolute inset-y-0 right-4 md:right-8 z-10 flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen((o) => !o)}
                className="flex flex-col items-center gap-1 rounded-full border-2 border-white/70 px-5 py-4 text-white transition hover:bg-white/10"
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
                aria-label="Open navigation menu"
              >
                {[0, 1, 2].map((i) => (
                  <span key={i} className="block h-0.5 w-7 rounded-full bg-current" aria-hidden="true" />
                ))}
              </button>
              {isMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/60 bg-white/90 p-2 shadow-2xl ring-1 ring-black/5 backdrop-blur"
                >
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-xl px-4 py-2 text-[#315460] transition hover:bg-white/70"
                    >
                      {l.label}
                    </Link>
                  ))}
                  <Link
                    href="/#book"
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-1 block rounded-xl px-4 py-2 font-semibold text-[#1f3f5c] transition hover:bg-white/80"
                  >
                    Book Appointment
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/70" />
        </div>
      </div>
    </nav>
  )
}

export function Footer() {
  const [cfg, setCfg] = useState<Config>({})
  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((d) => setCfg(d))
      .catch(() => {})
  }, [])

  const links = (cfg.navigation ?? []).filter((l) => l.href !== "/bookings" && l.href !== "/#book")
  const brandName = cfg.brand?.name ?? "The Financial Therapist"
  const footerLogoSrc = cfg.brand?.logoUrl || "/Logo.png"
  const defaultTagline =
    "Trauma‑informed care with safety, dignity, and choice. Specialised support for financial trauma, monetary psychotherapy, and nervous system regulation."
  const tagline = cfg.brand?.tagline ?? defaultTagline
  const quickLinks = [
    ...links,
    { label: "Book Appointment", href: "/#book" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ]
  const dedupedLinks = quickLinks.filter(
    (link, index, self) => index === self.findIndex((l) => l.href === link.href && l.label === link.label),
  )
  const phone = cfg.contact?.phone ?? "+61 488 222 137"
  const email = cfg.contact?.email ?? "dan@themelbournecounsellor.com.au"
  const phoneHref = phone.replace(/\s+/g, "")
  const sectionLabelClass = "text-[0.65rem] uppercase tracking-[0.4em] text-[#96a271] font-semibold"
  const navLinkClass =
    "block rounded-2xl border border-transparent bg-white/60 px-4 py-2 text-[var(--foreground)]/80 no-underline transition hover:border-[#9fb18d] hover:bg-white"
  const socialButtonClass =
    "flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-[#4c665c] shadow-sm transition hover:-translate-y-0.5 hover:text-[#1d2f3a]"
  const pillLinkClass =
    "inline-flex items-center gap-3 rounded-full border border-[#cad5b4] px-4 py-2 text-sm font-medium text-[#465651] no-underline hover:border-[#7c8d44] hover:text-[#1f2d28] transition"

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#f9f7ef] via-[#e7efdc] to-[#dfe8d4] text-[#1d2f3a]">
      <div className="container relative mx-auto px-6 md:px-8 py-24">
        <div className="rounded-[36px] border border-white/50 bg-white/80 p-8 sm:p-12 shadow-[0_35px_90px_rgba(78,103,92,0.18)] backdrop-blur">
          <div className="grid gap-12 xl:grid-cols-[1.25fr,0.9fr]">
            <div className="space-y-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="w-fit rounded-[30px] bg-gradient-to-b from-[#f9fbef] to-[#e7f0db] p-5 shadow-[0_25px_60px_rgba(124,141,68,0.35)]">
                  <img src={footerLogoSrc} alt={`${brandName} logo`} className="h-16 w-auto object-contain sm:h-20" />
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6e7a57]">{brandName}</p>
                  <p className="font-serif text-3xl leading-tight text-[var(--foreground)]">
                    {cfg.brand?.subtitle ?? "Financial trauma therapy rooted in consent and pacing"}
                  </p>
                  <p className="text-lg text-[#4d5b54]">{tagline}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-[#7c8d44] px-8 text-base font-medium text-white shadow-lg hover:bg-[#6c7c39]"
                >
                  <Link href="/#book">Book a confidential consultation</Link>
                </Button>
                <a href={`tel:${phoneHref}`} className={pillLinkClass}>
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
                <a href={`mailto:${email}`} className={pillLinkClass}>
                  <Mail className="h-4 w-4" />
                  {email}
                </a>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <p className={sectionLabelClass}>Practice Details</p>
                  <div className="space-y-1.5 text-lg text-[#485650]">
                    <p>Unit 503, 666 Chapel Street</p>
                    <p>South Yarra VIC 3141</p>
                    <p>In-person & telehealth across Australia</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className={sectionLabelClass}>Availability</p>
                  <div className="space-y-1.5 text-lg text-[#485650]">
                    <p>Monday – Friday · 10:00am – 7:00pm</p>
                    <p>Saturday appointments by request</p>
                    <p>Consent-led, paced sessions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <p className={sectionLabelClass}>Quick Links</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {dedupedLinks.map((l) => (
                    <Link key={`${l.href}-${l.label}`} href={l.href} className={navLinkClass}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className={sectionLabelClass}>Follow Dan</p>
                <div className="flex flex-wrap items-center gap-3 text-[#5b7484]">
                  <a
                    href="https://www.facebook.com/the.melbourne.counsellor/"
                    aria-label="Visit Facebook"
                    target="_blank"
                    rel="noreferrer"
                    className={socialButtonClass}
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/the.melbourne.counsellor/#"
                    aria-label="Visit Instagram"
                    target="_blank"
                    rel="noreferrer"
                    className={socialButtonClass}
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/dan-lobel-the-melbourne-counsellor-769b61204/"
                    aria-label="Visit LinkedIn"
                    target="_blank"
                    rel="noreferrer"
                    className={socialButtonClass}
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-[#dfe8ce] bg-[#f5f7ec] p-5 text-sm leading-relaxed text-[#56635c]">
                <p>
                  We acknowledge the Wurundjeri people of the Kulin Nation as the Traditional Custodians of the land on
                  which we work, and we pay our respects to Elders past, present, and emerging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/60 bg-[#d8e3ca]/70">
        <div className="container mx-auto px-6 md:px-8 py-8 text-center text-sm text-[#56635c] space-y-3">
          <p>© 2025 {brandName}. All rights reserved.</p>
          <p>The Financial Therapist Pty. Ltd. atf The Financial Therapist Trust.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy" className="no-underline text-[#4D6377] hover:text-[#1F385B]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="no-underline text-[#4D6377] hover:text-[#1F385B]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
