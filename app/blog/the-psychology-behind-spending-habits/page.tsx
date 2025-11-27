import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/seo"

const PAGE_DESCRIPTION =
  "Our spending patterns often reflect unmet needs, learned roles, and inherited stories. This article preview explores compassionate, values-aligned change."

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "The Psychology Behind Spending Habits | The Financial Therapist",
    description: PAGE_DESCRIPTION,
    path: "/blog/the-psychology-behind-spending-habits",
    keywords: ["spending habits psychology", "money stories", "behavioural finance therapy"],
    type: "article",
  })
}

export default function BlogSpendingHabits() {
  return (
    <div className="container mx-auto px-4 py-16">
      <article className="max-w-3xl mx-auto space-y-6">
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">The Psychology Behind Spending Habits</h1>
        <p className="text-[var(--primary)] leading-relaxed">
          Our spending patterns often reflect unmet needs, learned roles, and inherited stories. With awareness and
          compassion, you can choose new patterns that align with your values and support your wellbeing.
        </p>
        <p className="text-[var(--primary)] leading-relaxed">
          This article is in development. For personalised support, consider booking a session.
        </p>
      </article>
    </div>
  )
}


