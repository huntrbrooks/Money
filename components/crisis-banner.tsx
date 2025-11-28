'use client'

import { useEffect, useMemo, useState } from "react"
import type { CrisisResource } from "@/lib/config"

type CrisisBannerProps = {
  resources: CrisisResource[]
  intervalMs?: number
}

export function CrisisBanner({ resources, intervalMs = 3500 }: CrisisBannerProps) {
  const items = useMemo(() => resources?.length ? resources : [], [resources])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (items.length <= 1) return
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [items.length, intervalMs])

  if (!items.length) return null

  return (
    <div className="relative mx-auto w-full max-w-2xl h-16 overflow-hidden rounded-lg border border-[var(--secondary)] bg-[var(--section-bg-1)]/80">
      {items.map((it, i) => (
        <div
          key={it.name}
          className={`absolute inset-0 flex items-center justify-center px-4 transition-opacity duration-700 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
          aria-hidden={i !== index}
        >
          <div className="text-center">
            <p className="text-[var(--foreground)] font-medium">{it.name}</p>
            <p className="text-[var(--primary)]">{it.number}</p>
          </div>
        </div>
      ))}
    </div>
  )
}


