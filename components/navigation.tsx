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
  const headerBannerUrl = cfg.brand?.headerBannerUrl
  const defaultLogo = "/LOGO.png"
  const logoSrc = cfg.brand?.logoUrl || headerBannerUrl || defaultLogo

  return (
    <nav
      className="sticky top-0 z-50 shadow-sm border-b border-[var(--secondary)]"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--primary, #6CA4AC) 100%, transparent) 0%, color-mix(in srgb, var(--primary, #6CA4AC) 50%, transparent) 100%)",
      }}
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className="relative py-8 md:py-12">
          <div className="flex justify-center">
            <Link href="/" aria-label="Home" className="inline-flex items-center py-4">
              <img src={logoSrc} alt={brandName} className="h-20 md:h-28 lg:h-32 w-auto object-contain" />
            </Link>
          </div>

          {/* Right-aligned Menu dropdown */}
          <div className="absolute top-4 right-4 md:right-8 z-10">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen((o) => !o)}
                className="px-4 py-2 text-[var(--foreground)]/90 hover:text-[var(--foreground)] rounded-md transition-colors text-sm md:text-base underline decoration-[color-mix(in_oklch,_var(--foreground)_30%,_transparent)] underline-offset-4"
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
              >
                Menu
              </button>
              {isMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-md bg-white/95 backdrop-blur-sm shadow-lg ring-1 ring-black/5 overflow-hidden"
                >
                  <div className="py-1">
                    {links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-[var(--foreground)]/90 hover:bg-[var(--secondary)]/20 transition-colors"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
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
  const defaultLogo = "/LOGO.png"
  const footerLogoSrc = cfg.brand?.logoUrl || cfg.brand?.headerBannerUrl || defaultLogo

  return (
    <footer className="bg-[var(--section-bg-1)] text-[var(--foreground)]">
      {/* Main Footer */}
      <div className="container mx-auto px-6 md:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-3 max-w-6xl mx-auto">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 py-4">
              <img src={footerLogoSrc} alt={`${brandName} logo`} className="h-16 w-auto object-contain" />
              <h3 className="font-serif text-3xl font-light">{brandName}</h3>
            </div>
            <p className="text-[var(--primary)]/80 leading-relaxed">
              {cfg.brand?.tagline ??
                "Trauma‑informed counselling specialising in financial trauma and monetary psychotherapy. A safe, gender‑aware and inclusive space."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-[var(--accent)]">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors">
                  {l.label}
                </Link>
              ))}
              <Link href="/#book" className="text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors">
                Book Appointment
              </Link>
              <Link href="/privacy" className="text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-[var(--accent)]">Contact</h4>
            <div className="space-y-3">
              {cfg.contact?.phone && (
                <a
                  href={`tel:${cfg.contact.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors group"
                >
                  <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span>{cfg.contact.phone}</span>
                </a>
              )}
              {cfg.contact?.email && (
                <a
                  href={`mailto:${cfg.contact.email}`}
                  className="flex items-start gap-3 text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors group"
                >
                  <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="break-all pt-2">{cfg.contact.email}</span>
                </a>
              )}
            </div>

            {/* Social */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-[var(--accent)]">Follow Dan</h4>
              <div className="flex items-center gap-4">
                <a href="https://www.facebook.com/the.melbourne.counsellor/" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-[var(--secondary)] hover:bg-[var(--secondary)] transition">
                  <Facebook className="w-5 h-5 text-[var(--primary)]" />
                </a>
                <a href="https://www.instagram.com/the.melbourne.counsellor/#" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-[var(--secondary)] hover:bg-[var(--secondary)] transition">
                  <Instagram className="w-5 h-5 text-[var(--primary)]" />
                </a>
                <a href="https://www.linkedin.com/in/dan-lobel-the-melbourne-counsellor-769b61204/" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-[var(--secondary)] hover:bg-[var(--secondary)] transition">
                  <Linkedin className="w-5 h-5 text-[var(--primary)]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--secondary)]">
        <div className="container mx-auto px-6 md:px-8 py-8">
          <div className="text-center space-y-3 text-sm text-[var(--primary)]/70 max-w-4xl mx-auto">
            <p>© 2025 The Financial Therapist. All rights reserved.</p>
            <p>The Financial Therapist Pty. Ltd. atf The Financial Therapist Trust.</p>
            <p className="leading-relaxed">
              The Financial Therapist acknowledges the Wurundjeri people who are the Traditional Custodians of the land
              on which we work. We pay our respects to Elders past, present and emerging.
            </p>
            <p className="space-x-4">
              <Link href="/privacy" className="hover:text-[var(--foreground)]">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[var(--foreground)]">Terms of Service</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
