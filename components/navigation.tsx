"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react"
import { LogoMark } from "@/components/logo"

type NavLink = { label: string; href: string }
type Config = {
  brand?: { name?: string; subtitle?: string; tagline?: string; logoUrl?: string; headerBannerUrl?: string }
  navigation?: NavLink[]
  contact?: { phone?: string; email?: string }
}

const DEFAULT_LOGO_SRC = "/logo.png?v=20251205"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cfg, setCfg] = useState<Config>({})
  const brandLogo = cfg.brand?.headerBannerUrl || cfg.brand?.logoUrl || DEFAULT_LOGO_SRC

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

  return (
    <nav className="relative z-50 overflow-visible shadow-[0_22px_45px_rgba(32,56,91,0.12)]">
      <div
        className="relative overflow-visible border-b border-white/20"
        style={{
          background: "linear-gradient(180deg, #929d5b 0%, #6ca4ac 100%)",
        }}
      >
        <div className="relative z-10">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative">
            <div className="flex items-center justify-center min-h-[7.5rem] sm:min-h-[9rem] md:min-h-[11rem] py-4 md:py-6">
              <Link href="/" aria-label="Home" className="inline-flex items-center justify-center group">
                {headerBannerUrl || brandLogo ? (
                  <img
                    src={headerBannerUrl || brandLogo}
                    alt={brandName}
                    className="h-20 sm:h-28 md:h-40 lg:h-44 w-auto object-contain transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.02]"
                  />
                ) : (
                  <span className="font-serif whitespace-nowrap text-[clamp(1.75rem,7vw,4rem)] text-[var(--foreground)] font-medium leading-none tracking-tight">
                    {brandName}
                  </span>
                )}
              </Link>
            </div>
            <div className="relative mt-4 mb-2 flex justify-center z-20 md:mb-0 md:mt-0 md:absolute md:right-4 md:top-1/2 md:-translate-y-1/2 md:flex md:justify-end">
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen((o) => !o)}
                  className="flex flex-col items-center justify-center gap-1.5 w-14 h-14 rounded-full border border-[var(--section-bg-2)]/60 text-white bg-[#6ca4ac]/90 hover:bg-[#5d9199] shadow-[0_12px_25px_rgba(32,56,91,0.2)] transition-colors"
                  aria-expanded={isMenuOpen}
                  aria-haspopup="menu"
                  aria-label="Toggle navigation menu"
                >
                  <span className="sr-only">Toggle navigation menu</span>
                  {[0, 1, 2].map((idx) => (
                    <span key={idx} className="block w-7 h-0.5 bg-current rounded-full" />
                  ))}
                </button>
                {isMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-3 w-56 rounded-2xl bg-[#6ca4ac] text-white shadow-[0_20px_35px_rgba(32,56,91,0.15)] ring-1 ring-[var(--section-bg-2)]/25 overflow-hidden"
                  >
                    <div className="py-1">
                      {links.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-2 text-white/90 hover:bg-[var(--section-bg-1)]/20 transition-colors"
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
      </div>
    </nav>
  )
}

type FooterProps = {
  backgroundColor?: string
}

export function Footer({ backgroundColor = "#d7e9ec" }: FooterProps = {}) {
  const [cfg, setCfg] = useState<Config>({})
  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((d) => setCfg(d))
      .catch(() => {})
  }, [])
  const links = (cfg.navigation ?? []).filter((l) => l.href !== "/bookings" && l.href !== "/#book")

  return (
    <footer
      className="text-[var(--foreground)]"
      style={{ backgroundColor, backgroundImage: "none" }}
    >
      {/* Main Footer */}
      <div className="container mx-auto px-6 md:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-3 max-w-6xl mx-auto">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {cfg.brand?.logoUrl ? (
                <img
                  src={cfg.brand.logoUrl}
                  alt={`${cfg.brand?.name ?? "Site"} logo`}
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <LogoMark className="h-10 w-10 text-[var(--primary)]" title={`${cfg.brand?.name ?? "Site"} logo`} />
              )}
              <h3 className="font-serif text-3xl font-light">{cfg.brand?.name ?? "The Financial Therapist"}</h3>
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
      <div className="border-t border-[var(--secondary)]" style={{ backgroundColor, backgroundImage: "none" }}>
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
