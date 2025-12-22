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

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cfg, setCfg] = useState<Config>({})
  const brandLogo = cfg.brand?.logoUrl || "/logo.png"
  const postFallbackLog = (payload: Record<string, unknown>) => {
    const base = { ...payload }
    const fetchBody = JSON.stringify({ ...base, transport: "fetch" })
    fetch("/api/debug-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: fetchBody,
      keepalive: true,
    }).catch(() => {})
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      try {
        const beaconBody = JSON.stringify({ ...base, transport: "beacon" })
        const blob = new Blob([beaconBody], { type: "application/json" })
        navigator.sendBeacon("/api/debug-log", blob)
      } catch {}
    }
    try {
      const img = new Image()
      img.src = `/api/debug-log?p=${encodeURIComponent(JSON.stringify({ ...base, transport: "img" }))}`
    } catch {}
  }
  const closeMenu = () => {
    setIsMenuOpen(false)
    // #region agent log
    const payload = {
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "H2",
      location: "components/navigation.tsx:20",
      message: "closeMenu invoked",
      data: { isMenuOpenAfter: false },
      timestamp: Date.now(),
    }
    fetch("http://127.0.0.1:7242/ingest/404354d1-ef63-4efc-bc2d-65eee551a7b6", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {})
    postFallbackLog(payload)
    // #endregion
  }

  const handleMenuToggle = () => {
    setIsMenuOpen((o) => {
      const next = !o
      // #region agent log
      const payload = {
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H2",
        location: "components/navigation.tsx:83",
        message: "menu toggle clicked",
        data: { nextState: next },
        timestamp: Date.now(),
      }
      fetch("http://127.0.0.1:7242/ingest/404354d1-ef63-4efc-bc2d-65eee551a7b6", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {})
      postFallbackLog(payload)
      // #endregion
      return next
    })
  }

  useEffect(() => {
    // #region agent log
    const payload = {
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "H0",
      location: "components/navigation.tsx:38",
      message: "navigation mounted",
      data: {},
      timestamp: Date.now(),
    }
    fetch("http://127.0.0.1:7242/ingest/404354d1-ef63-4efc-bc2d-65eee551a7b6", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {})
    postFallbackLog(payload)
    // #endregion
  }, [])

  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((d) => {
        setCfg(d)
        // #region agent log
        const payload = {
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "H1",
          location: "components/navigation.tsx:24",
          message: "site-config fetched",
          data: {
            navCount: Array.isArray(d?.navigation) ? d.navigation.length : null,
            hasBrand: Boolean(d?.brand),
            hasContact: Boolean(d?.contact),
          },
          timestamp: Date.now(),
        }
        fetch("http://127.0.0.1:7242/ingest/404354d1-ef63-4efc-bc2d-65eee551a7b6", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => {})
        postFallbackLog(payload)
        // #endregion
      })
      .catch((error) => {
        // #region agent log
        const payload = {
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "H1",
          location: "components/navigation.tsx:27",
          message: "site-config fetch failed",
          data: { error: error ? String(error) : "unknown" },
          timestamp: Date.now(),
        }
        fetch("http://127.0.0.1:7242/ingest/404354d1-ef63-4efc-bc2d-65eee551a7b6", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => {})
        postFallbackLog(payload)
        // #endregion
      })
  }, [])

  useEffect(() => {
    // #region agent log
    const payload = {
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "H2",
      location: "components/navigation.tsx:68",
      message: "isMenuOpen changed",
      data: { isMenuOpen },
      timestamp: Date.now(),
    }
    fetch("http://127.0.0.1:7242/ingest/404354d1-ef63-4efc-bc2d-65eee551a7b6", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {})
    postFallbackLog(payload)
    // #endregion
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    // #region agent log
    const payloadLock = {
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "H3",
      location: "components/navigation.tsx:31",
      message: "body scroll locked",
      data: { originalOverflow },
      timestamp: Date.now(),
    }
    fetch("http://127.0.0.1:7242/ingest/404354d1-ef63-4efc-bc2d-65eee551a7b6", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadLock),
    }).catch(() => {})
    postFallbackLog(payloadLock)
    // #endregion
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleKeyDown)
      // #region agent log
      const payloadRestore = {
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H3",
        location: "components/navigation.tsx:40",
        message: "body scroll restored",
        data: { restoredOverflow: originalOverflow },
        timestamp: Date.now(),
      }
      fetch("http://127.0.0.1:7242/ingest/404354d1-ef63-4efc-bc2d-65eee551a7b6", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadRestore),
      }).catch(() => {})
      postFallbackLog(payloadRestore)
      // #endregion
    }
  }, [isMenuOpen])

  const links = cfg.navigation ?? [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Contact", href: "/#contact" },
  ]
  const brandName = (cfg.brand?.name ?? "Financial Abuse Therapist").replace(/^\s*The\s+/i, "")
  const menuButtonClasses =
    "flex items-center justify-center w-32 h-12 px-6 rounded-full border border-white/30 text-white text-base font-serif tracking-[0.2em] uppercase bg-[#6ca4ac]/95 hover:bg-[#5d9199] shadow-[0_12px_25px_rgba(32,56,91,0.22)] transition-colors"
  const overlayBaseClasses = "fixed inset-0 z-40 flex flex-col bg-[#6ca4ac] text-white transition duration-500 ease-out"
  const overlayOpenClasses = "opacity-100 pointer-events-auto translate-y-0"
  const overlayClosedClasses = "opacity-0 pointer-events-none translate-y-2"
  const overlayStyle = {
    background:
      "linear-gradient(180deg, #929d5b 0%, rgba(146,157,91,0.9) 16%, rgba(108,164,172,0.94) 60%, #6ca4ac 100%)",
  }
  const menuOverlayContent = (
    <>
      <div className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-white/15">
        <span className="text-lg md:text-xl font-serif tracking-wide">{brandName}</span>
        <button
          onClick={closeMenu}
          className="px-5 py-2 rounded-full border border-white/40 text-xs font-semibold tracking-[0.25em] uppercase hover:bg-white/10 transition"
          aria-label="Close menu"
        >
          Close
        </button>
      </div>
      <nav className="flex-1 flex flex-col items-center justify-center gap-6 md:gap-8 px-6 py-10 text-center" aria-label="Navigation">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={closeMenu}
            className="w-full max-w-sm text-center text-2xl md:text-3xl font-serif tracking-wide px-8 py-3 rounded-full border border-white/30 bg-white/5 hover:bg-white/10 transition"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="px-6 md:px-10 py-6 border-t border-white/10 text-center text-sm text-white/80">
        <p className="font-serif tracking-wide">Trauma-informed counselling for financial wellbeing</p>
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
            <div className="relative flex items-center justify-center min-h-[7.5rem] sm:min-h-[9rem] md:min-h-[11rem] py-6 md:py-10">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Link href="/" aria-label="Home" className="pointer-events-auto inline-flex items-center justify-center group">
                  {brandLogo ? (
                    <span className="header-logo-shell">
                      <img
                        src={brandLogo}
                        alt={brandName}
                        className="header-logo-img w-auto max-w-[min(62rem,92vw)] max-h-[70%] object-contain drop-shadow-[0_18px_35px_rgba(32,56,91,0.28)] transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.02]"
                      />
                    </span>
                  ) : (
                    <span className="font-serif whitespace-nowrap text-[clamp(1.75rem,7vw,4rem)] text-[var(--foreground)] font-medium leading-none tracking-tight">
                      {brandName}
                    </span>
                  )}
                </Link>
              </div>

              <div className="absolute right-4 top-4 sm:right-6 sm:top-6 z-20">
                {isMenuOpen ? (
                  <button
                    onClick={handleMenuToggle}
                    className={menuButtonClasses}
                    aria-expanded="true"
                    aria-haspopup="true"
                    aria-label="Close navigation menu"
                  >
                    Menu
                  </button>
                ) : (
                  <button
                    onClick={handleMenuToggle}
                    className={menuButtonClasses}
                    aria-expanded="false"
                    aria-haspopup="true"
                    aria-label="Open navigation menu"
                  >
                    Menu
                  </button>
                )}
              </div>
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
                <a
                  href="https://www.facebook.com/the.melbourne.counsellor/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Facebook"
                  className="p-2 rounded-full border border-[var(--secondary)] hover:bg-[var(--secondary)] transition"
                >
                  <Facebook className="w-5 h-5 text-[var(--primary)]" />
                </a>
                <a
                  href="https://www.instagram.com/the.melbourne.counsellor/#"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Instagram"
                  className="p-2 rounded-full border border-[var(--secondary)] hover:bg-[var(--secondary)] transition"
                >
                  <Instagram className="w-5 h-5 text-[var(--primary)]" />
                </a>
                <a
                  href="https://www.linkedin.com/in/dan-lobel-the-melbourne-counsellor-769b61204/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="LinkedIn"
                  className="p-2 rounded-full border border-[var(--secondary)] hover:bg-[var(--secondary)] transition"
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
