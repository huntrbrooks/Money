"use client"

import type { ReactNode } from "react"
import { isLikelyEmailAddress, normalizeEmailAddress } from "@/lib/email"

type EmailLinkProps = {
  email: string
  subject?: string
  className?: string
  children: ReactNode
  ariaLabel?: string
}

export function EmailLink({ email, subject = "Contact Request", className = "", children, ariaLabel }: EmailLinkProps) {
  const normalizedEmail = normalizeEmailAddress(email)
  const normalizedSubject = String(subject ?? "").trim()

  // If email isn't valid, still render the children but do not emit a broken `mailto:` link.
  if (!isLikelyEmailAddress(normalizedEmail)) {
    return (
      <span className={className} aria-label={ariaLabel}>
        {children}
      </span>
    )
  }

  const mailtoUrl = `mailto:${normalizedEmail}${normalizedSubject ? `?subject=${encodeURIComponent(normalizedSubject)}` : ""}`

  return (
    <a
      href={mailtoUrl}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  )
}

