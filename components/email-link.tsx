"use client"

import type { ReactNode } from "react"

type EmailLinkProps = {
  email: string
  subject?: string
  className?: string
  children: ReactNode
  ariaLabel?: string
}

export function EmailLink({ email, subject = "Contact Request", className = "", children, ariaLabel }: EmailLinkProps) {
  // Normalize because admin/content can sometimes include leading "mailto:" or whitespace.
  const normalizedEmail = String(email ?? "")
    .trim()
    .replace(/^mailto:\s*/i, "")

  const mailtoUrl = `mailto:${normalizedEmail}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`
  
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

