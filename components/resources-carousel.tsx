"use client"

import { useMemo, useState, type CSSProperties } from "react"
import type { CrisisResource } from "@/lib/config"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type ResourcesCarouselProps = {
  resources: CrisisResource[]
  durationSeconds?: number
}

export function ResourcesCarousel({ resources, durationSeconds = 45 }: ResourcesCarouselProps) {
  const items = useMemo(() => {
    return (resources || []).filter(Boolean)
  }, [resources])

  const marqueeItems = useMemo(() => [...items, ...items], [items])
  const [selected, setSelected] = useState<CrisisResource | null>(null)

  if (!items.length) return null

  function normalizeKey(input: string): string {
    return String(input ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .trim()
  }

  const logoMap = useMemo(() => {
    const pairs: Array<[string, string]> = [
      ["Lifeline", "/logos/Lifeline.webp"],
      ["Beyond Blue", "/logos/beyond%20blue.webp"],
      ["Blue Knot Foundation", "/logos/blue-knot.png"],
      ["Butterfly National Helpline", "/logos/butterfly-logo.png"],
      ["Headspace", "/logos/Headspace.png"],
      ["MensLine Australia", "/logos/mensline.webp"],
      ["QLife", "/logos/Qlife.webp"],
      ["Kids Helpline", "/logos/Kids%20helpline.webp"],
      ["Suicide CallBack Service", "/logos/suicide%20services%20call%20back.webp"],
      ["Suicide Call Back Service", "/logos/suicide%20services%20call%20back.webp"],
      ["1800 Respect", "/logos/1800respect%20logo%20small.png"],
      ["Medicare Mental Health", "/logos/images.png"],
    ]
    const map = new Map<string, string>()
    for (const [name, url] of pairs) map.set(normalizeKey(name), url)
    return map
  }, [])

  const legacyLogoFilenames = useMemo(() => {
    return new Set([
      "lifeline.webp",
      "beyond%20blue.webp",
      "blue-knot.png",
      "butterfly-logo.png",
      "headspace.png",
      "mensline.webp",
      "qlife.webp",
      "kids%20helpline.webp",
      "suicide%20services%20call%20back.webp",
      "1800respect%20logo%20small.png",
      "images.png",
    ])
  }, [])

  function getLogoSrc(resource: CrisisResource): string {
    const mapped = logoMap.get(normalizeKey(resource.name))
    const raw = (resource.logoUrl ?? "").trim()
    if (raw) {
      if (raw.startsWith("/logos/")) return raw
      // If the config is pointing at an older root-level logo filename, prefer the updated `/logos/...` asset.
      const filename = raw.split("/").pop()?.toLowerCase() ?? ""
      if (mapped && legacyLogoFilenames.has(filename)) return mapped
      return raw
    }
    return mapped ?? getFallbackLogo(resource)
  }

  function getFallbackLogo(resource: CrisisResource): string {
    return logoMap.get(normalizeKey(resource.name)) ?? "/logo.webp"
  }

  return (
    <div className="relative">
      <div className="relative overflow-hidden py-6">
        <div
          className="marquee"
          style={{ "--duration": `${durationSeconds}s` } as CSSProperties & { "--duration": string }}
        >
          {marqueeItems.map((r, idx) => (
            <button
              key={`${r.name}-${idx}`}
              className="group mx-10 flex w-auto min-w-[260px] items-center justify-center px-2 py-2 bg-transparent"
              onClick={() => setSelected(r)}
              aria-label={`${r.name} information`}
            >
              <img
                src={getLogoSrc(r)}
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
        <DialogContent className="bg-[var(--section-bg-2)]">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[var(--foreground)]">{selected.name}</DialogTitle>
                <DialogDescription className="text-[var(--primary)]">
                  {selected.description ?? "Support service"}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-4 pt-2">
                {getLogoSrc(selected) ? (
                  <img
                    src={getLogoSrc(selected)}
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


