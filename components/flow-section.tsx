import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type FlowSectionProps = {
  id?: string
  className?: string
  /** CSS color (e.g. `var(--section-bg-1)` or `#ffffff`) */
  bg: string
  /** CSS color used to fade in from the previous section */
  prevBg: string
  /** CSS color used to fade out into the next section */
  nextBg: string
  children: ReactNode
}

export function FlowSection({ id, className, bg, prevBg, nextBg, children }: FlowSectionProps) {
  return (
    <section
      id={id}
      className={cn("relative", className)}
      style={{ backgroundColor: bg }}
      data-flow-section
    >
      {/* Top fade: previous -> current */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[var(--section-fade-height)]"
        style={{ backgroundImage: `linear-gradient(to bottom, ${prevBg}, ${bg})` }}
      />

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


