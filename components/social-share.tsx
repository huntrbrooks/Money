"use client"

import { useState } from "react"
import { Facebook, Link as LinkIcon, Linkedin, Mail } from "lucide-react"
import { withUtm } from "@/lib/social"

type SocialShareProps = {
  url: string
  title: string
  summary?: string
}

export function SocialShare({ url, title, summary }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const shareTargets = [
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(withUtm(url, {
        source: "linkedin",
      }))}`,
      icon: Linkedin,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(withUtm(url, {
        source: "facebook",
      }))}`,
      icon: Facebook,
    },
    {
      name: "Email",
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
        `${summary ?? ""}\n\n${withUtm(url, { source: "email", medium: "email" })}`,
      )}`,
      icon: Mail,
    },
  ]

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--secondary)] bg-white/80 p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">Share</p>
        <div className="flex flex-wrap gap-2">
          {shareTargets.map((target) => (
            <a
              key={target.name}
              href={target.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--secondary)] px-3 py-1 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--section-bg-2)]"
            >
              <target.icon className="h-4 w-4" aria-hidden="true" />
              {target.name}
            </a>
          ))}
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--secondary)] px-3 py-1 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--section-bg-2)]"
          >
            <LinkIcon className="h-4 w-4" aria-hidden="true" />
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </div>
    </div>
  )
}

