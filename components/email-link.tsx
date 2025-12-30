"use client"

import type { ReactNode } from "react"

type EmailLinkProps = {
  email: string
  subject?: string
  className?: string
  children: ReactNode
  ariaLabel?: string
}

export function normalizeEmailAddress(input: unknown): string {
  let value = String(input ?? "").trim()
  if (!value) return ""

  // Admin/content may include a full mailto URL or extra copy/punctuation.
  value = value.replace(/^mailto:\s*/i, "")

  // Drop query/hash if someone pastes `dan@x.com?subject=...` or `mailto:...#...`
  value = value.split(/[?#]/)[0]

  // Some users paste emails in angle brackets: `<dan@x.com>`
  if (value.startsWith("<") && value.endsWith(">") && value.length > 2) {
    value = value.slice(1, -1)
  }

  // If someone pastes "dan@x.com (preferred)" take the first token.
  value = value.split(/\s+/)[0]

  // Strip common trailing punctuation from copy/paste.
  value = value.replace(/[),.;:]+$/, "")

  return value.trim()
}

function isLikelyEmailAddress(value: string): boolean {
  // Basic sanity check: we only want to emit a `mailto:` href for something that looks like an email.
  // This intentionally isn't perfect RFC validation.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
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

