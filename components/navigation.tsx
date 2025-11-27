"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react"

type NavLink = { label: string; href: string }
type ResourceLogo = { name?: string; logoUrl?: string; logoHeight?: number; website?: string }
type Config = {
  brand?: { name?: string; subtitle?: string; tagline?: string }
  navigation?: NavLink[]
  contact?: { phone?: string; email?: string }
  resources?: ResourceLogo[]
}

const highlightedResourceNames = ["Kids Helpline", "QLife", "Lifeline"]

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
  const brandColor = "#1f3f5c"

  return (
    <nav
      className="relative z-50 border-b border-white/50 shadow-[0_15px_45px_rgba(30,61,92,0.18)]"
      style={{ background: "linear-gradient(180deg, #bfcf7a 0%, #8fb5b7 52%, #dfe9d0 100%)" }}
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className="relative flex items-center justify-center py-10 md:py-14">
          <Link href="/" aria-label="Go to homepage" className="inline-flex">
            <span
              className="relative inline-flex items-center gap-5 rounded-full border-[3px] px-10 py-5 text-center shadow-[0_25px_60px_rgba(23,56,76,0.25)]"
              style={{ borderColor: brandColor, backgroundColor: "rgba(255,255,255,0.28)" }}
            >
              <Image
                src="/Logo.webp"
                alt={`${brandName} logo`}
                width={360}
                height={110}
                priority
                className="h-20 w-auto object-contain mix-blend-multiply"
              />
              <span aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-full border border-white/40" />
            </span>
          </Link>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto hidden h-px w-3/4 bg-white/60 md:block" />

          {/* Menu button */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 md:right-10">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen((o) => !o)}
                className="flex flex-col items-center gap-1 rounded-full border-2 px-5 py-4 transition hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                style={{ borderColor: brandColor, color: brandColor, backgroundColor: "rgba(255,255,255,0.35)" }}
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
                aria-label="Open navigation menu"
              >
                {[0, 1, 2].map((line) => (
                  <span key={line} className="block h-0.5 w-7 rounded-full bg-current" aria-hidden="true" />
                ))}
              </button>
              {isMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-56 rounded-2xl border border-[#dbe5c7] bg-white/90 p-2 text-[var(--primary)] shadow-2xl ring-1 ring-black/5 backdrop-blur"
                >
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-xl px-4 py-2 text-[#305661] transition hover:bg-[var(--accent)]/10"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/#book"
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-xl px-4 py-2 font-semibold text-[#1f3f5c] transition hover:bg-[var(--accent)]/20"
                  >
                    Book Appointment
                  </Link>
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
  const brandName = cfg.brand?.name ?? "Financial Abuse Therapist"
  const brandTagline =
    cfg.brand?.tagline ??
    "Trauma-informed care with safety, dignity, and choice for every stage of financial recovery."

  const prioritizedResources = cfg.resources?.filter(Boolean) ?? []

  const curatedResources = highlightedResourceNames
    .map((name) => prioritizedResources.find((resource) => resource.name?.toLowerCase() === name.toLowerCase()))
    .filter((resource): resource is ResourceLogo => Boolean(resource))

  const safetyPartners = curatedResources.length > 0 ? curatedResources : prioritizedResources.slice(0, 3)

  return (
    <footer className="text-[#6f8c83]">
      {safetyPartners.length > 0 && (
        <div className="bg-gradient-to-b from-[#cfe5f2] via-[#dfead0] to-[#eef2d4]">
          <div className="container mx-auto px-6 md:px-8 py-10">
            <div className="flex flex-wrap items-center justify-center gap-10">
              {safetyPartners.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.website ?? "#"}
                  target={partner.website ? "_blank" : undefined}
                  rel={partner.website ? "noreferrer" : undefined}
                  className="flex flex-col items-center gap-3 transition hover:opacity-80"
                >
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.name ?? "Support partner"}
                      className="h-16 w-auto object-contain"
                      style={partner.logoHeight ? { maxHeight: partner.logoHeight } : undefined}
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-[#4f6a63]">{partner.name}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#eef2d4]">
        <div className="container mx-auto px-6 md:px-8 py-16">
          <div className="grid gap-12 lg:grid-cols-[1.4fr,1fr,1fr] max-w-6xl mx-auto">
            <div className="space-y-6">
              <Link href="/" aria-label="Return home" className="inline-flex">
                <span
                  className="relative inline-flex items-center gap-4 rounded-full border-[3px] px-8 py-4"
                  style={{ borderColor: "#1f3f5c", backgroundColor: "rgba(255,255,255,0.55)" }}
                >
                  <Image
                    src="/Logo.webp"
                    alt={`${brandName} logo`}
                    width={260}
                    height={90}
                    className="h-16 w-auto object-contain mix-blend-multiply"
                  />
                  <span aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-full border border-white/50" />
                </span>
              </Link>
              <p className="text-base leading-relaxed text-[#7e9588]">{brandTagline}</p>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8ea593]">Quick Links</p>
              <div className="flex flex-col gap-2 text-[#5f7b72]">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="transition hover:text-[#2d4c44]">
                    {link.label}
                  </Link>
                ))}
                <Link href="/#book" className="transition hover:text-[#2d4c44]">
                  Book Appointment
                </Link>
                <Link href="/privacy" className="transition hover:text-[#2d4c44]">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="transition hover:text-[#2d4c44]">
                  Terms of Service
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8ea593]">Contact</p>
                {cfg.contact?.phone && (
                  <a
                    href={`tel:${cfg.contact.phone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-3 rounded-2xl border border-[#dbe2c3] bg-white/60 px-4 py-3 text-[#4f6b68] transition hover:border-[#c6d7aa]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b2c48f] text-white">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-base font-medium">{cfg.contact.phone}</span>
                  </a>
                )}
                {cfg.contact?.email && (
                  <a
                    href={`mailto:${cfg.contact.email}`}
                    className="flex items-center gap-3 rounded-2xl border border-[#dbe2c3] bg-white/60 px-4 py-3 text-[#4f6b68] transition hover:border-[#c6d7aa]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7d9fb4] text-white">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="break-all text-base font-medium">{cfg.contact.email}</span>
                  </a>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8ea593]">Follow Dan</p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.facebook.com/the.melbourne.counsellor/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#bcd0b3] text-[#4f6b68] transition hover:bg-white"
                  >
                    <Facebook className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.instagram.com/the.melbourne.counsellor/#"
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#bcd0b3] text-[#4f6b68] transition hover:bg-white"
                  >
                    <Instagram className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/dan-lobel-the-melbourne-counsellor-769b61204/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#bcd0b3] text-[#4f6b68] transition hover:bg-white"
                  >
                    <Linkedin className="h-5 w-5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-[#d2ddbe] pt-6 text-center text-sm text-[#92a491] space-y-2">
            <p>© 2025 The Financial Therapist. All rights reserved.</p>
            <p>The Financial Therapist Pty. Ltd. atf The Financial Therapist Trust.</p>
            <p>
              The Financial Therapist acknowledges the Wurundjeri people, Traditional Custodians of the land on which we
              work, and pays respect to Elders past, present, and emerging.
            </p>
            <p className="space-x-4">
              <Link href="/privacy" className="underline-offset-2 hover:text-[#4f6b68]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="underline-offset-2 hover:text-[#4f6b68]">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
