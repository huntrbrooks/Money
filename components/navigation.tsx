"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react"

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
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Contact", href: "/#contact" },
  ]
  const brandName = (cfg.brand?.name ?? "Financial Abuse Therapist").replace(/^\s*The\s+/i, "")
  const logoSrc = "/LOGO.png"
  const brandColor = "#1f3f5c"

  return (
    <nav
      className="relative z-50 border-b border-white/40 shadow-[0_20px_45px_rgba(32,69,79,0.2)]"
      style={{
        background: "linear-gradient(180deg, #b5c371 0%, #88b1b9 55%, #eff4dc 100%)",
      }}
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className="relative py-10 md:py-14">
          <div className="flex justify-center">
            <Link href="/" aria-label="Home" className="inline-flex items-center">
              <span
                className="relative inline-flex items-center rounded-full border-[3px] px-10 py-4 shadow-[0_25px_60px_rgba(23,56,76,0.25)]"
                style={{ borderColor: brandColor, backgroundColor: "rgba(255,255,255,0.35)" }}
              >
                <img src={logoSrc} alt={brandName} className="h-20 md:h-28 lg:h-32 w-auto object-contain" />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 rounded-full border border-white/60"
                />
              </span>
            </Link>
          </div>

          {/* Right-aligned Menu dropdown */}
          <div className="absolute inset-y-0 right-4 md:right-8 z-10 flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen((o) => !o)}
                className="flex flex-col items-center gap-1 rounded-full border-2 px-5 py-4 text-[var(--foreground)] transition hover:bg-white/40"
                style={{ borderColor: brandColor }}
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
  const brandName = cfg.brand?.name ?? "Financial Abuse Therapist"
  const footerLogoSrc = cfg.brand?.logoUrl || "/LOGO.png"
  const quickLinks = [
    ...links,
    { label: "Book Appointment", href: "/#book" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ]
  const accentHeadingClass = "text-[11px] uppercase tracking-[0.55em] text-[#9ba367] font-semibold"
  const linkClass =
    "block text-[var(--foreground)]/80 text-lg no-underline hover:text-[var(--foreground)] transition-colors"
  const socialButtonClass =
    "flex h-11 w-11 items-center justify-center rounded-full border border-[#c1cda7] text-[#5b7484] bg-white/50 hover:bg-white transition"

  return (
    <footer className="bg-[#E7F0D4] text-[#1D2F3A]">
      <div className="container mx-auto px-6 md:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.35fr,0.85fr,1fr]">
          <div className="space-y-6">
            <div className="max-w-md">
              <img src={footerLogoSrc} alt={`${brandName} logo`} className="w-full max-w-sm object-contain" />
            </div>
            <p className="text-lg leading-relaxed text-[#6A7A84]">
              {cfg.brand?.tagline ??
                "Trauma‑informed care with safety, dignity and choice. Specialised support for financial trauma, monetary psychotherapy and healing nervous systems gently."}
            </p>
          </div>

          <div className="space-y-5">
            <p className={accentHeadingClass}>Quick Links</p>
            <div className="space-y-3">
              {quickLinks.map((l) => (
                <Link key={`${l.href}-${l.label}`} href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-5">
              <p className={accentHeadingClass}>Contact</p>
              <div className="space-y-4 text-lg text-[#4D6377]">
                {cfg.contact?.phone && (
                  <a
                    href={`tel:${cfg.contact.phone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-4 no-underline hover:text-[#1F385B] transition-colors"
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#C3DCDD] text-[#1F385B] shadow-sm">
                      <Phone className="w-5 h-5" />
                    </span>
                    <span className="font-medium">{cfg.contact.phone}</span>
                  </a>
                )}
                {cfg.contact?.email && (
                  <a
                    href={`mailto:${cfg.contact.email}`}
                    className="flex items-start gap-4 no-underline hover:text-[#1F385B] transition-colors"
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#b5bd75] text-white shadow-sm">
                      <Mail className="w-5 h-5" />
                    </span>
                    <span className="break-all font-medium pt-1.5">{cfg.contact.email}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className={accentHeadingClass}>Follow Dan</p>
              <div className="flex items-center gap-3 text-[#5b7484]">
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
          </div>
        </div>
      </div>

      <div className="border-t border-[#CAD5B4] bg-[#E7F0D4]/80">
        <div className="container mx-auto px-6 md:px-8 py-10">
          <div className="text-center space-y-3 text-sm text-[#65765F] max-w-4xl mx-auto">
            <p>© 2025 The Financial Therapist. All rights reserved.</p>
            <p>The Financial Therapist Pty. Ltd. atf The Financial Therapist Trust.</p>
            <p className="leading-relaxed">
              The Financial Therapist acknowledges the Wurundjeri people who are the Traditional Custodians of the land
              on which we work. We pay our respects to Elders past, present and emerging.
            </p>
            <p className="space-x-5">
              <Link href="/privacy" className="no-underline text-[#4D6377] hover:text-[#1F385B]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="no-underline text-[#4D6377] hover:text-[#1F385B]">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
