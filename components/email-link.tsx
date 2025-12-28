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
  const mailtoUrl = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`
  
  return (
    <a
      href={mailtoUrl}
      onClick={(e) => {
        e.preventDefault()
        window.location.href = mailtoUrl
      }}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  )
}

