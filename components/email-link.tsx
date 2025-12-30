"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { isLikelyEmailAddress, normalizeEmailAddress } from "@/lib/email"

type EmailLinkProps = {
  email: string
  subject?: string
  className?: string
  children: ReactNode
  ariaLabel?: string
}

function isChromeOnMac(userAgent: string): boolean {
  // Chrome on macOS reports "Macintosh" and "Chrome/". Exclude Edge/Opera which also include "Chrome".
  return /Macintosh/i.test(userAgent) && /Chrome\//i.test(userAgent) && !/Edg\//i.test(userAgent) && !/OPR\//i.test(userAgent)
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
  const enquiryUrl = `/enquiry?via=email${normalizedSubject ? `&subject=${encodeURIComponent(normalizedSubject)}` : ""}`
  const [href, setHref] = useState(mailtoUrl)

  // Chrome on Mac can be configured with no protocol handler for `mailto:` which results in a no-op click.
  // We can't force a mail client to exist, so we route those users to the on-site enquiry form (requires sender email).
  // This runs only after mount to avoid hydration mismatches.
  useEffect(() => {
    try {
      if (typeof navigator === "undefined") return
      if (isChromeOnMac(navigator.userAgent)) {
        setHref(enquiryUrl)
      }
    } catch {
      // keep mailto
    }
  }, [enquiryUrl])

  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  )
}

