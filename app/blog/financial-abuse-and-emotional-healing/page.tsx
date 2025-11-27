import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/seo"

const PAGE_DESCRIPTION =
  "Financial abuse can fracture trust, autonomy, and identity. This teaser previews a longer guide on safety, healing, and regaining self-worth."

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Financial Abuse and Emotional Healing | The Financial Therapist",
    description: PAGE_DESCRIPTION,
    path: "/blog/financial-abuse-and-emotional-healing",
    keywords: ["financial abuse healing", "economic abuse recovery"],
    type: "article",
  })
}

export default function BlogFinancialAbuseHealing() {
  return (
    <div className="container mx-auto px-4 py-16">
      <article className="max-w-3xl mx-auto space-y-6">
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">Financial Abuse and Emotional Healing</h1>
        <p className="text-[var(--primary)] leading-relaxed">
          Financial abuse can fracture trust, autonomy, and identity. Recovery is possible. Therapy centres safety,
          consent, pacing, and re‑building self‑worth while gently untangling the emotional impact of control.
        </p>
        <p className="text-[var(--primary)] leading-relaxed">
          This is a preview. A longer version is on the way. If you’re navigating economic control or coercion, support
          is available.
        </p>
      </article>
    </div>
  )
}


