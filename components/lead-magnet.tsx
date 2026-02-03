"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"

type LeadMagnetContent = {
  heading?: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  helper?: string
}

type LeadMagnetProps = {
  content?: LeadMagnetContent | null
}

const CTA_FALLBACK = "/enquiry"

export function LeadMagnet({ content }: LeadMagnetProps) {
  const [dismissed, setDismissed] = useState(false)
  const [showDesktop, setShowDesktop] = useState(false)
  const { track } = useAnalytics()

  useEffect(() => {
    if (!content || dismissed) return
    track("lead_magnet_view", { slug: content.heading ?? "leadMagnet" })
    const timer = window.setTimeout(() => setShowDesktop(true), 15000)
    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 0) setShowDesktop(true)
    }
    document.addEventListener("mouseleave", handleMouseLeave)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [content, dismissed, track])

  if (!content || (!content.heading && !content.body)) {
    return null
  }

  const ctaHref = content.ctaHref || CTA_FALLBACK
  const ctaLabel = content.ctaLabel || "Start a conversation"

  const handleDismiss = () => {
    setDismissed(true)
    track("lead_magnet_dismiss", { slug: content.heading ?? "leadMagnet" })
  }

  const handleClick = () => {
    track("lead_magnet_cta_click", { slug: content.heading ?? "leadMagnet" })
  }

  return (
    <>
      {/* Mobile sticky bar */}
      {!dismissed && (
        <div className="md:hidden fixed inset-x-4 bottom-4 z-40 rounded-3xl border border-[var(--foreground)]/15 bg-[var(--foreground)] text-white shadow-[0_30px_45px_rgba(32,56,91,0.45)] p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">{content.heading}</p>
              {content.body && <p className="text-base leading-relaxed">{content.body}</p>}
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-full bg-[var(--section-bg-2)]/20 p-1 text-white hover:bg-[var(--section-bg-1)]/30"
              aria-label="Dismiss offer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <Link
            href={ctaHref}
            onClick={handleClick}
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[var(--accent-foreground)] shadow-[0_0_25px_rgba(222,236,79,0.3)]"
          >
            {ctaLabel}
          </Link>
          {content.helper && <p className="mt-2 text-xs text-white/70">{content.helper}</p>}
        </div>
      )}

      {/* Desktop slide-out */}
      <div
        className={`hidden md:block fixed bottom-6 right-6 z-40 transition-all duration-300 ${
          showDesktop && !dismissed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-[360px] rounded-[32px] border border-[var(--secondary)] bg-[var(--section-bg-2)] p-6 shadow-[0_30px_70px_rgba(32,56,91,0.25)]">
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-semibold">{content.heading}</p>
              {content.body && <p className="text-[var(--foreground)] leading-relaxed">{content.body}</p>}
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-full border border-border/60 p-1 text-[var(--primary)] hover:bg-[var(--section-bg-1)]"
              aria-label="Dismiss lead magnet"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <Link
              href={ctaHref}
              onClick={handleClick}
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-white font-semibold shadow-[0_20px_35px_rgba(32,56,91,0.25)]"
            >
              {ctaLabel}
            </Link>
            {content.helper && <p className="text-xs text-[var(--primary)]/80">{content.helper}</p>}
          </div>
        </div>
      </div>
    </>
  )
}

