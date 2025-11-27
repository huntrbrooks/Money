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

  const links =
    cfg.navigation ?? [
      { label: "Home", href: "/" },
      { label: "About", href: "/about-dan" },
      { label: "Monetary Psychotherapy", href: "/monetary-psychotherapy" },
      { label: "Services", href: "/#services" },
      { label: "Contact", href: "/#contact" },
    ]
  const brandName = (cfg.brand?.name ?? "Financial Abuse Therapist").replace(/^\s*The\s+/i, "")
  const logoSrc = "/LOGO.png"
  const phone = cfg.contact?.phone ?? "0467 477 786"
  const phoneHref = phone.replace(/\s+/g, "")
  const email = cfg.contact?.email ?? "dan@themelbournecounsellor.com.au"

  return (
    <header className="relative z-50 border-b border-white/60 shadow-[0_18px_60px_rgba(36,68,82,0.18)]">
      <div
        className="relative"
        style={{
          background: "linear-gradient(180deg, #cbd8c1 0%, #c5dce9 55%, #dce7df 100%)",
        }}
      >
        <div className="container mx-auto px-6 md:px-8 py-8 md:py-10">
          <div className="hidden md:flex items-center justify-between text-sm tracking-[0.2em] uppercase text-white/85">
            <span>Financial Trauma & Monetary Psychotherapy</span>
            <div className="flex items-center gap-6 tracking-[0.1em] text-white/90">
              <a href={`tel:${phoneHref}`} className="no-underline hover:text-white">
                {phone}
              </a>
              <a href={`mailto:${email}`} className="no-underline hover:text-white">
                {email}
              </a>
            </div>
          </div>
          <div className="relative mt-6 flex items-center justify-center">
            <Link href="/" aria-label="Home" className="inline-flex justify-center">
              <span className="inline-flex items-center justify-center rounded-full border-[5px] border-[#1f3254] bg-white/90 px-6 py-4 shadow-[0_18px_35px_rgba(28,55,66,0.35)]">
                <img src={logoSrc} alt={brandName} className="h-20 w-auto object-contain md:h-24 lg:h-28" />
              </span>
            </Link>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 md:right-2">
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen((o) => !o)}
                  className="flex flex-col items-center gap-1 rounded-full border-2 border-white/70 bg-[#1f3254]/40 px-5 py-4 text-white transition hover:bg-[#1f3254]/70"
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
                    className="absolute right-0 mt-3 w-64 rounded-3xl border border-white/80 bg-white/95 p-3 shadow-2xl ring-1 ring-black/5 backdrop-blur"
                  >
                    {links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block rounded-2xl px-4 py-2 text-[#2c4752] transition hover:bg-[#f1f5ef]"
                      >
                        {l.label}
                      </Link>
                    ))}
                    <Link
                      href="/#book"
                      onClick={() => setIsMenuOpen(false)}
                      className="mt-1 block rounded-2xl bg-[#7b8c45] px-4 py-2 text-center font-semibold text-white transition hover:bg-[#6f7d3c]"
                    >
                      Book Appointment
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
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
  const brandName = cfg.brand?.name ?? "Financial Abuse Therapist"
  const footerLogoSrc = cfg.brand?.logoUrl || "/LOGO.png"
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
  const sectionLabelClass = "text-[0.65rem] uppercase tracking-[0.4em] text-[#78886c] font-semibold"
  const navLinkClass =
    "block rounded-2xl border border-transparent bg-white/70 px-4 py-2 text-[#1f2d38]/90 no-underline transition hover:border-[#7b8c45] hover:bg-white"
  const socialButtonClass =
    "flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/85 text-[#4c5f69] shadow-sm transition hover:-translate-y-0.5 hover:text-[#1d2f3a]"
  const pillLinkClass =
    "inline-flex items-center gap-3 rounded-full border border-[#c3d1ba] px-5 py-2 text-sm font-medium text-[#3a4c46] no-underline hover:border-[#7b8c45] hover:text-[#1f2d28] transition"

  return (
    <footer className="mt-0 bg-[#dfe7f0] text-[#1d2f3a]">
      <div className="container mx-auto px-6 md:px-8 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.35fr,0.75fr]">
          <div className="space-y-8">
            <div className="space-y-4">
              <img src={footerLogoSrc} alt={`${brandName} logo`} className="h-16 w-auto object-contain" />
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6a7b63]">{brandName}</p>
              <p className="font-serif text-3xl leading-tight text-[#1f2f3a]">
                {cfg.brand?.subtitle ?? "Financial trauma therapy rooted in consent and pacing"}
              </p>
              <p className="text-lg text-[#4d5b54]">{tagline}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-[#7b8c45] px-8 text-base font-medium text-white shadow-lg hover:bg-[#6c7c39]"
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

          <div className="space-y-8">
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

            <div className="rounded-2xl border border-white/60 bg-white/80 p-5 text-sm leading-relaxed text-[#56635c]">
              <p>
                We acknowledge the Wurundjeri people of the Kulin Nation as the Traditional Custodians of the land on
                which we work, and we pay our respects to Elders past, present, and emerging.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/60 bg-[#cfd9e6]">
        <div className="container mx-auto px-6 md:px-8 py-8 text-center text-sm text-[#4b5c66] space-y-3">
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
