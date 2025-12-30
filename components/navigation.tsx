"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react"
import { EmailLink } from "@/components/email-link"
import { normalizeEmailAddress } from "@/lib/email"

type NavLink = { label: string; href: string }
type Config = {
  brand?: { name?: string; subtitle?: string; tagline?: string; logoUrl?: string; headerBannerUrl?: string }
  navigation?: NavLink[]
  contact?: { phone?: string; email?: string; emailAlt?: string }
  social?: { facebook?: string; instagram?: string; linkedin?: string }
  footer?: {
    copyrightText?: string
    companyName?: string
    acknowledgementText?: string
    quickLinks?: NavLink[]
  }
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cfg, setCfg] = useState<Config>({})
  const brandLogo = cfg.brand?.logoUrl || "/logo.png"

  // NOTE: Previously this component shipped "agent debug logging" that attempted to POST to a localhost ingest
  // endpoint (and several /api/debug-log fallbacks). That creates noisy network errors in production and can leak
  // private interaction data. If diagnostics are needed again, reintroduce via an explicit, opt-in flag.
  const isDebugLoggingEnabled = false
  const closeMenu = () => {
    setIsMenuOpen(false)
    if (isDebugLoggingEnabled) {
      // intentionally empty (kept as a placeholder)
    }
  }

  const handleMenuToggle = () => {
    setIsMenuOpen((o) => {
      const next = !o
      if (isDebugLoggingEnabled) {
        // intentionally empty (kept as a placeholder)
      }
      return next
    })
  }

  useEffect(() => {
    if (isDebugLoggingEnabled) {
      // intentionally empty (kept as a placeholder)
    }
  }, [])

  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((d) => {
        setCfg(d)
        if (isDebugLoggingEnabled) {
          // intentionally empty (kept as a placeholder)
        }
      })
      .catch((error) => {
        if (isDebugLoggingEnabled) {
          void error
          // intentionally empty (kept as a placeholder)
        }
      })
  }, [])

  useEffect(() => {
    if (isDebugLoggingEnabled) {
      // intentionally empty (kept as a placeholder)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    if (isDebugLoggingEnabled) {
      void originalOverflow
      // intentionally empty (kept as a placeholder)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleKeyDown)
      if (isDebugLoggingEnabled) {
        // intentionally empty (kept as a placeholder)
      }
    }
  }, [isMenuOpen])

  const links = cfg.navigation ?? [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/#services" },
    { label: "Contact", href: "/#contact" },
  ]
  const normalizedLinks = links.map((l) => {
    const label = (l.label ?? "").trim().toLowerCase()
    if (label === "home") return { ...l, href: "/" }
    if (label === "about") return { ...l, href: "/about" }
    if ((l.href ?? "") === "/#about") return { ...l, href: "/about" }
    return l
  })
  const brandName = (cfg.brand?.name ?? "Financial Abuse Therapist").replace(/^\s*The\s+/i, "")
  const menuButtonClasses =
    "flex items-center justify-center w-24 h-10 px-4 rounded-full border border-white/30 text-white text-sm font-serif tracking-[0.18em] uppercase bg-[#6ca4ac]/95 hover:bg-[#5d9199] shadow-[0_12px_25px_rgba(32,56,91,0.22)] hover:shadow-[0_18px_38px_rgba(32,56,91,0.30)] active:shadow-[0_10px_22px_rgba(32,56,91,0.20)] transition-[background-color,box-shadow,filter] hover:brightness-[1.02] active:brightness-[0.98] sm:w-32 sm:h-12 sm:px-6 sm:text-base sm:tracking-[0.2em]"
  // NOTE: global `a { color: var(--primary); text-decoration: underline; }` exists in `app/globals.css`.
  // For the full-screen menu we explicitly set link colors + remove underlines for legibility.
  const overlayBaseClasses =
    "fixed inset-0 z-40 flex flex-col text-[var(--foreground)] transition duration-500 ease-out"
  const overlayOpenClasses = "opacity-100 pointer-events-auto translate-y-0"
  const overlayClosedClasses = "opacity-0 pointer-events-none translate-y-2"
  const overlayStyle = {
    background:
      // Match the homepage hero gradient for visual continuity.
      "linear-gradient(180deg, #d7e9ec 0%, rgba(215, 233, 236, 0.95) 20%, rgba(108, 164, 172, 0.85) 55%, rgba(108, 164, 172, 0.7) 72%, rgba(229, 238, 210, 0.9) 90%, #e5eed2 100%)",
  }
  const menuOverlayContent = (
    <>
      <div className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-[var(--foreground)]/20">
        <span className="min-w-0 text-lg md:text-xl font-serif tracking-wide truncate text-[var(--foreground)]">
          {brandName}
        </span>
        <button
          onClick={closeMenu}
          className="shrink-0 px-5 py-2 rounded-full border border-[var(--foreground)]/60 text-xs font-semibold tracking-[0.25em] uppercase text-[var(--foreground)] hover:bg-white/30 transition"
          aria-label="Close menu"
        >
          Close
        </button>
      </div>
      <nav className="flex-1 flex flex-col items-center justify-center gap-6 md:gap-8 px-6 py-10 text-center" aria-label="Navigation">
        {normalizedLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={closeMenu}
            className="w-full max-w-sm text-center text-2xl md:text-3xl font-serif tracking-wide px-8 py-3 rounded-full border border-[#20385B]/35 bg-white/85 hover:bg-white/95 text-[#20385B] no-underline shadow-[0_18px_35px_rgba(32,56,91,0.14)] hover:shadow-[0_30px_60px_rgba(32,56,91,0.18)] active:shadow-[0_14px_26px_rgba(32,56,91,0.12)] transition-[transform,box-shadow,background-color,border-color] duration-200 hover:-translate-y-0.5 active:translate-y-0 will-change-transform"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="px-6 md:px-10 py-6 border-t border-[var(--foreground)]/20 text-center text-sm text-[var(--foreground)]/85">
        <p className="font-serif tracking-wide text-[var(--foreground)]">Trauma-informed counselling for financial wellbeing</p>
      </div>
    </>
  )

  return (
    <nav className="relative z-50 overflow-visible">
      <div
        className="relative overflow-visible site-header-two-tone"
      >
        <div className="relative z-10">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center min-h-[7.5rem] sm:min-h-[9rem] md:min-h-[11rem] py-6 md:py-10">
              {/* Left spacer keeps the logo truly centered even when the right side has content */}
              <div aria-hidden="true" />

              <Link href="/" aria-label="Home" className="min-w-0 inline-flex items-center justify-center group justify-self-center">
                {brandLogo ? (
                  <span className="header-logo-shell header-logo-shell--nav min-w-0">
                    <img
                      src={brandLogo}
                      alt={brandName}
                      className="header-logo-img header-logo-img--nav object-contain drop-shadow-[0_18px_35px_rgba(32,56,91,0.28)] transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.02]"
                    />
                  </span>
                ) : (
                  <span className="font-serif whitespace-nowrap text-[clamp(1.5rem,6vw,3.25rem)] text-[var(--foreground)] font-medium leading-none tracking-tight text-center px-2">
                    {brandName}
                  </span>
                )}
              </Link>

              {/* Right spacer (menu button now lives below header, above hero) */}
              <div aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      {/* Menu button just below header (above hero), not inside the 2‑tone bar */}
      <div className="relative z-20 h-0 pointer-events-none">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-end pointer-events-auto">
            <button
              onClick={handleMenuToggle}
              className={`${menuButtonClasses} -translate-y-1/2`}
              aria-expanded={isMenuOpen ? "true" : "false"}
              aria-haspopup="true"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          aria-hidden="false"
          className={`${overlayBaseClasses} ${overlayOpenClasses}`}
          style={overlayStyle}
        >
          {menuOverlayContent}
        </div>
      ) : (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          aria-hidden="true"
          className={`${overlayBaseClasses} ${overlayClosedClasses}`}
          style={overlayStyle}
        >
          {menuOverlayContent}
        </div>
      )}
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

  const normalizedContactEmail = normalizeEmailAddress(cfg.contact?.email)
  const normalizedContactEmailAlt = normalizeEmailAddress(cfg.contact?.emailAlt)

  const navigationLinks = (cfg.navigation ?? []).filter((l) => l.href !== "/bookings" && l.href !== "/#book")
  const footerQuickLinks = cfg.footer?.quickLinks ?? []
  // Combine navigation links and footer quick links, avoiding duplicates
  const allQuickLinks = [
    ...navigationLinks,
    ...footerQuickLinks.filter((fl) => !navigationLinks.some((nl) => nl.href === fl.href)),
    { label: "Book Appointment", href: "/#book" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ]

  return (
    <footer
      className="text-[var(--foreground)]"
      style={{ backgroundColor, backgroundImage: "none" }}
    >
      {/* Main Footer */}
      <div className="container mx-auto px-6 md:px-8 py-16">
        <div className="grid gap-12 md:gap-16 lg:gap-20 md:grid-cols-3 max-w-6xl mx-auto">
          {/* Brand */}
          <div className="flex flex-col space-y-5 text-center md:text-left">
            <h3 className="font-serif text-2xl md:text-3xl font-light leading-tight">{cfg.brand?.name ?? "The Financial Therapist"}</h3>
            <p className="text-[var(--primary)]/80 leading-relaxed text-sm md:text-base">
              {cfg.brand?.tagline ??
                "Trauma‑informed counselling specialising in financial trauma and monetary psychotherapy. A safe, gender‑aware and inclusive space."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-5 text-center md:text-left">
            <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-[var(--accent)] mb-1">Quick Links</h4>
            <nav className="flex flex-col gap-2.5">
              {allQuickLinks.map((l) => (
                <Link key={l.href} href={l.href} className="text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors text-sm md:text-base underline decoration-[var(--primary)]/30 hover:decoration-[var(--primary)]">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-5">
              <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-[var(--accent)] mb-1 text-center md:text-left">Contact</h4>
              <div className="space-y-4">
                {cfg.contact?.phone && (
                  <a
                    href={`tel:${cfg.contact.phone.replace(/\s+/g, "")}`}
                    className="flex items-center justify-center md:justify-start gap-3 text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors group"
                  >
                    <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm md:text-base underline decoration-[var(--primary)]/30 group-hover:decoration-[var(--primary)]">{cfg.contact.phone}</span>
                  </a>
                )}
                {cfg.contact?.email && (
                  <EmailLink
                    email={cfg.contact.email}
                    subject="Contact Request"
                    className="flex items-start justify-center md:justify-start gap-3 text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform mt-0.5">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <span className="break-all text-sm md:text-base underline decoration-[var(--primary)]/30 group-hover:decoration-[var(--primary)] pt-1">
                      {normalizedContactEmail || cfg.contact.email}
                    </span>
                  </EmailLink>
                )}
                {cfg.contact?.emailAlt && normalizedContactEmailAlt !== normalizedContactEmail && (
                  <EmailLink
                    email={cfg.contact.emailAlt}
                    subject="Contact Request"
                    className="flex items-start justify-center md:justify-start gap-3 text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform mt-0.5">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <span className="break-all text-sm md:text-base underline decoration-[var(--primary)]/30 group-hover:decoration-[var(--primary)] pt-1">
                      {normalizedContactEmailAlt || cfg.contact.emailAlt}
                    </span>
                  </EmailLink>
                )}
              </div>
            </div>

            {/* Social */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-[var(--accent)] mb-4 text-center md:text-left">Follow Dan</h4>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <a
                  href={cfg.social?.facebook || "https://www.facebook.com/the.melbourne.counsellor/"}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Facebook"
                  className="p-2.5 rounded-full border border-[var(--secondary)] hover:bg-[var(--secondary)] transition-all hover:scale-110"
                >
                  <Facebook className="w-5 h-5 text-[var(--primary)]" />
                </a>
                <a
                  href={cfg.social?.instagram || "https://www.instagram.com/the.melbourne.counsellor/#"}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Instagram"
                  className="p-2.5 rounded-full border border-[var(--secondary)] hover:bg-[var(--secondary)] transition-all hover:scale-110"
                >
                  <Instagram className="w-5 h-5 text-[var(--primary)]" />
                </a>
                <a
                  href={cfg.social?.linkedin || "https://www.linkedin.com/in/dan-lobel-the-melbourne-counsellor-769b61204/"}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="LinkedIn"
                  className="p-2.5 rounded-full border border-[var(--secondary)] hover:bg-[var(--secondary)] transition-all hover:scale-110"
                >
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
            {cfg.footer?.copyrightText && <p>{cfg.footer.copyrightText}</p>}
            {cfg.footer?.companyName && <p>{cfg.footer.companyName}</p>}
            {cfg.footer?.acknowledgementText && <p className="leading-relaxed">{cfg.footer.acknowledgementText}</p>}
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
