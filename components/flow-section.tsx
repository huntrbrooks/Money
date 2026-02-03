import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type FlowSectionProps = {
  id?: string
  className?: string
  /** CSS color (e.g. `var(--section-bg-1)` or `#ffffff`) */
  bg: string
  /** CSS color used to fade in from the previous section (only used when `topFade` is true) */
  prevBg?: string
  /** CSS color used to fade out into the next section */
  nextBg: string
  /** When true, render a top fade from `prevBg` -> `bg` (use for the first section after hero). */
  topFade?: boolean
  children: ReactNode
}

export function FlowSection({ id, className, bg, prevBg, nextBg, topFade = false, children }: FlowSectionProps) {
  return (
    <section
      id={id}
      className={cn("relative", className)}
      style={{ backgroundColor: bg }}
      data-flow-section
    >
      {/* Top fade (optional): previous -> current */}
      {topFade && prevBg ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[var(--section-fade-height)]"
          style={{ backgroundImage: `linear-gradient(to bottom, ${prevBg}, ${bg})` }}
        />
      ) : null}

      {/* Bottom fade: current -> next */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[var(--section-fade-height)]"
        style={{ backgroundImage: `linear-gradient(to bottom, ${bg}, ${nextBg})` }}
      />

      <div className="relative">{children}</div>
    </section>
  )
}


