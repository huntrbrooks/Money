'use client'

import { useMemo, useState } from "react"
import type { CrisisResource } from "@/lib/config"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type ResourcesCarouselProps = {
  resources: CrisisResource[]
  durationSeconds?: number
}

export function ResourcesCarousel({ resources, durationSeconds = 45 }: ResourcesCarouselProps) {
  const items = useMemo(() => {
    return (resources || []).filter((r) => Boolean(r.logoUrl))
  }, [resources])

  const marqueeItems = useMemo(() => [...items, ...items], [items])
  const [selected, setSelected] = useState<CrisisResource | null>(null)

  if (!items.length) return null

  function getFallbackLogo(resource: CrisisResource): string {
    try {
      if (resource.website) {
        const url = new URL(resource.website)
        const domain = url.hostname.replace(/^www\./, "")
        return `https://logo.clearbit.com/${domain}`
      }
    } catch {
      // ignore parse errors
    }
    return "/placeholder-logo.png"
  }

  return (
    <div className="relative">
      <div className="relative overflow-hidden py-6">
        <div
          className="marquee"
          style={
            {
              // @ts-ignore custom property consumed by styled-jsx
              "--duration": `${durationSeconds}s`,
            } as any
          }
        >
          {marqueeItems.map((r, idx) => (
            <button
              key={`${r.name}-${idx}`}
              className="group mx-10 flex w-auto min-w-[260px] items-center justify-center px-2 py-2 bg-transparent"
              onClick={() => setSelected(r)}
              aria-label={`${r.name} information`}
            >
              <img
                src={r.logoUrl ?? ""}
                alt={`${r.name} logo`}
                className="w-auto object-contain opacity-95 group-hover:opacity-100"
                style={{ height: (r.logoHeight ?? 96) }}
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement & { dataset: { fallbackApplied?: string } }
                  if (img.dataset.fallbackApplied === "true") return
                  img.src = getFallbackLogo(r)
                  img.dataset.fallbackApplied = "true"
                }}
              />
            </button>
          ))}
        </div>

        <style jsx>{`
          .marquee {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            width: max-content;
            animation: scroll var(--duration) linear infinite;
            will-change: transform;
          }
          .marquee:hover {
            animation-play-state: paused;
          }
          @keyframes scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="bg-white">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[var(--foreground)]">{selected.name}</DialogTitle>
                <DialogDescription className="text-[var(--primary)]">
                  {selected.description ?? "Support service"}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-4 pt-2">
                {selected.logoUrl ? (
                  <img
                    src={selected.logoUrl}
                    alt={`${selected.name} logo`}
                    className="h-10 w-auto object-contain"
                  />
                ) : null}
                <div className="text-[var(--primary)]">
                  <p className="text-xs uppercase tracking-wide">Available 24/7</p>
                  <p className="text-xl text-[var(--foreground)] font-medium">{selected.number}</p>
                </div>
              </div>
              <DialogFooter className="sm:justify-start">
                <Button
                  asChild
                  className="bg-[var(--accent)] hover:opacity-90 text-white"
                >
                  <a href={`tel:${selected.number.replace(/\s+/g, "")}`} aria-label={`Call ${selected.name}`}>
                    Call {selected.number}
                  </a>
                </Button>
                {selected.website ? (
                  <Button asChild variant="outline" className="border-2">
                    <a href={selected.website} target="_blank" rel="noopener noreferrer" aria-label={`${selected.name} website`}>
                      Visit Website
                    </a>
                  </Button>
                ) : null}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


