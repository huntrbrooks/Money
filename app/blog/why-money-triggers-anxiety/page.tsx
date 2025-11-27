import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { buildArticleSchema, buildFaqSchema, buildPageMetadata } from "@/lib/seo"

const PAGE_TITLE = "Why Money Triggers Anxiety | The Financial Therapist"
const PAGE_DESCRIPTION =
  "Money anxiety isn’t about being bad with numbers — it’s about how the brain links money to safety, control, and self-worth. Learn why it happens and how to heal your relationship with money."
const PAGE_PUBLISHED = "2025-11-13"
const PAGE_SLUG = "/blog/why-money-triggers-anxiety"

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: PAGE_SLUG,
    keywords: ["money anxiety", "financial trauma", "monetary psychotherapy"],
    type: "article",
    publishedTime: PAGE_PUBLISHED,
    modifiedTime: PAGE_PUBLISHED,
  })
}

export default function BlogWhyMoneyTriggersAnxiety() {
  const articleJsonLd = buildArticleSchema({
    title: "Why Money Triggers Anxiety",
    description: "Trauma-informed explanation of why money triggers anxiety and how to heal your relationship with it.",
    slug: PAGE_SLUG,
    publishedTime: PAGE_PUBLISHED,
    modifiedTime: PAGE_PUBLISHED,
  })

  const faqJsonLd = buildFaqSchema([
    {
      question: "Why does money trigger anxiety even when I’m earning well?",
      answer:
        "Because the nervous system links money with safety and identity. Old experiences can keep the body in protection mode despite present stability.",
    },
    {
      question: "Is money anxiety a sign I’m bad with finances?",
      answer:
        "No. It’s usually a sign your nervous system is over-protecting you due to past stress. Skills help, but regulation and safety come first.",
    },
    {
      question: "What actually helps reduce money anxiety?",
      answer:
        "Regulate first, then plan: brief breathing, tiny daily actions, visible safety buffers, and a weekly money check-in. Consistency rewires the stress response.",
    },
  ])

  return (
    <div className="container mx-auto px-4 py-16">
      <article className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-3 pb-6 border-b border-[var(--secondary)]">
          <div className="text-xs tracking-wider uppercase text-[var(--primary)]">
            Financial Trauma &amp; Monetary Psychotherapy
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
            Why Money Triggers Anxiety
          </h1>
          <p className="text-[var(--primary)] text-sm">
            By <strong>Dan Lobel, D.Couns., B.Couns., MCouns&amp;Psych</strong> • Melbourne, Australia
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[var(--accent)] text-white font-semibold border border-[var(--accent)] hover:opacity-90"
              href="/bookings"
              aria-label="Book a counselling session"
            >
              Book a Session
            </Link>
            <Link
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white text-[var(--accent)] font-semibold border border-[var(--accent)] hover:bg-[var(--secondary)]/20"
              href="/enquiry"
              aria-label="Contact Dan Lobel"
            >
              Contact
            </Link>
          </div>
        </header>

        <nav aria-label="Table of contents" className="border border-[var(--secondary)] rounded-xl p-4 bg-white">
          <strong className="text-[var(--foreground)]">On this page</strong>
          <ul className="mt-2 grid gap-1 list-disc pl-5 text-[var(--accent)]">
            <li><a href="#introduction">Introduction</a></li>
            <li><a href="#nervous-system">The Nervous System and Survival</a></li>
            <li><a href="#attachment">Family Conditioning and Attachment</a></li>
            <li><a href="#trauma">Financial Trauma</a></li>
            <li><a href="#intergenerational">Inherited &amp; Cultural Stories</a></li>
            <li><a href="#shame">Shame &amp; Self-Worth</a></li>
            <li><a href="#uncertainty">Uncertainty &amp; Control</a></li>
            <li><a href="#biases">How the Brain Trips You Up</a></li>
            <li><a href="#relationships">Relationships &amp; Money</a></li>
            <li><a href="#recognising">Recognising Money Anxiety</a></li>
            <li><a href="#healing">How to Heal</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </nav>

        <section id="introduction" className="space-y-3">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">Introduction</h2>
          <p className="text-[var(--primary)] leading-relaxed">
            Money is never just about money. It’s tied to safety, agency, freedom, and self‑worth. When finances feel
            uncertain, the body reacts as if survival is at stake. This isn’t weakness; it’s a nervous system doing its
            best to protect you. In practice, that protective alarm can block clear thinking, planning, and even opening
            a bank statement. Below, I outline the core psychological drivers behind money anxiety and the practical,
            trauma‑informed steps that help.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">
            <span id="nervous-system">The Nervous System and Survival</span>
          </h2>
          <p className="text-[var(--primary)] leading-relaxed">Your body doesn’t distinguish between a tiger and a sudden rent increase. When money feels tight, your threat system activates: heart rate climbs, muscles tense, and the prefrontal cortex (planning and problem‑solving) downshifts.</p>
          <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
            <li>Cortisol spikes and logical reasoning declines.</li>
            <li>Fight, flight, freeze, or fawn responses can take over.</li>
            <li>Avoidance grows problems, which then confirms the fear.</li>
          </ul>
          <blockquote className="border-l-4 border-[var(--accent)] bg-[color:rgb(248,250,252)] text-[color:rgb(15,23,42)] p-4">
            <strong>Story: Sam and the unopened bills.</strong> Growing up with periodic evictions, Sam’s body still
            equates envelopes with danger. Avoidance leads to late fees, which “prove” money is unsafe. The loop is neurological, not moral.
          </blockquote>
        </section>

        <section id="attachment" className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">
            Family Conditioning and Attachment
          </h2>
          <p className="text-[var(--primary)] leading-relaxed">Attachment patterns shape how we relate to money. When approval or love depended on achievement, balances can feel like report cards on worth.</p>
          <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
            <li><span className="font-medium">Anxious attachment</span>: reassurance‑seeking, compulsive balance checks.</li>
            <li><span className="font-medium">Avoidant attachment</span>: secrecy, refusal to plan jointly.</li>
            <li><span className="font-medium">Disorganised</span>: swings between strict saving and impulsive spending.</li>
          </ul>
          <blockquote className="border-l-4 border-[var(--accent)] bg-[color:rgb(248,250,252)] text-[color:rgb(15,23,42)] p-4">
            <strong>Story: Aya and the couple budget.</strong> Criticised for “stupid spending” as a child, Aya hears
            “budget” as “judgement.” Her system protects safety, not spreadsheets.
          </blockquote>
        </section>

        <section id="trauma" className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">
            Financial Trauma
          </h2>
          <p className="text-[var(--primary)] leading-relaxed">Financial trauma can be direct (job loss, bankruptcy, financial abuse) or indirect (chaotic homes, addiction, chronic instability). Either way, money cues can revive old states of helplessness.</p>
          <blockquote className="border-l-4 border-[var(--accent)] bg-[color:rgb(248,250,252)] text-[color:rgb(15,23,42)] p-4">
            <strong>Story: Leo and the pay review.</strong> Humiliated by a previous boss, Leo’s body still expects
            attack when a salary email arrives. New workplace, same alarm.
          </blockquote>
        </section>

        <section id="intergenerational" className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">
            Inherited &amp; Cultural Money Stories
          </h2>
          <p className="text-[var(--primary)] leading-relaxed">We absorb family rules like “debt is dangerous” or “we don’t splurge,” and cultural narratives about class, migration, and survival. These scripts shape what feels safe.</p>
          <blockquote className="border-l-4 border-[var(--accent)] bg-[color:rgb(248,250,252)] text-[color:rgb(15,23,42)] p-4">
            <strong>Story: Nina and the emergency fund.</strong> With a grandmother who fled war, risk feels unsafe.
            Despite a strong income, Nina hoards cash and avoids investing. It’s legacy protection, not irrationality.
          </blockquote>
        </section>

        <section id="shame" className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">
            Shame &amp; Self‑Worth
          </h2>
          <p className="text-[var(--primary)] leading-relaxed">When net worth is mistaken for self‑worth, setbacks feel like identity failures. Shame silences questions and fuels extremes: overwork to “earn worth,” or overspend to self‑soothe.</p>
          <blockquote className="border-l-4 border-[var(--accent)] bg-[color:rgb(248,250,252)] text-[color:rgb(15,23,42)] p-4">
            <strong>Story: Dev and the designer purchase.</strong> A credit‑fuelled watch buys an hour of relief, then
            doubles the shame. The issue is unaddressed inadequacy, not “being bad with money.”
          </blockquote>
        </section>

        <section id="uncertainty" className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">
            Uncertainty &amp; Control
          </h2>
          <p className="text-[var(--primary)] leading-relaxed">Money is probabilistic, not certain. Perfectionism says “do it perfectly or don’t start,” leading to paralysis and mounting dread.</p>
          <blockquote className="border-l-4 border-[var(--accent)] bg-[color:rgb(248,250,252)] text-[color:rgb(15,23,42)] p-4">
            <strong>Story: Carla and the perfect app.</strong> Endless research replaces action. The anxiety is about
            imperfection, not arithmetic.
          </blockquote>
        </section>

        <section id="biases" className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">
            How the Brain Trips You Up
          </h2>
          <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
            <li><span className="font-medium">Loss aversion</span>: losses hurt more than equal gains feel good.</li>
            <li><span className="font-medium">Present bias</span>: immediate relief beats future benefit.</li>
            <li><span className="font-medium">Sunk cost fallacy</span>: throwing good money after bad because of prior spend.</li>
          </ul>
          <p className="text-[var(--primary)] leading-relaxed">With ADHD or chronic anxiety, admin tasks become heavy lifts. The problem is executive load, not character.</p>
          <blockquote className="border-l-4 border-[var(--accent)] bg-[color:rgb(248,250,252)] text-[color:rgb(15,23,42)] p-4">
            <strong>Story: Marco and the subscription jungle.</strong> Missed cancellations trigger shame, which drives
            avoidance, which creates more chaos. The cycle is neurobiological.
          </blockquote>
        </section>

        <section id="relationships" className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">
            Relationship Dynamics and Money
          </h2>
          <p className="text-[var(--primary)] leading-relaxed">Couples clash because money represents values: safety, freedom, fairness. Without a shared map, each sees the other as irrational.</p>
          <blockquote className="border-l-4 border-[var(--accent)] bg-[color:rgb(248,250,252)] text-[color:rgb(15,23,42)] p-4">
            <strong>Story: Priya &amp; Tom.</strong> Saving equals safety for Priya; experiences equal life for Tom.
            They align by splitting budgets into <em>Safety</em>, <em>Life</em>, and <em>Future</em> buckets.
          </blockquote>
        </section>

        <section id="recognising" className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">
            Recognising Money Anxiety
          </h2>
          <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
            <li><span className="font-medium">Somatic</span>: tight chest, stomach knots, sleep disruption around money tasks.</li>
            <li><span className="font-medium">Cognitive</span>: catastrophising, all‑or‑nothing beliefs.</li>
            <li><span className="font-medium">Behavioural</span>: avoidance, impulsive buys, micromanaging, secrecy.</li>
            <li><span className="font-medium">Relational</span>: conflict, control struggles, withdrawal.</li>
          </ul>
        </section>

        <section id="healing" className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">
            How to Heal Your Relationship with Money
          </h2>
          <p className="text-[var(--primary)] leading-relaxed">Start with nervous‑system safety, then build simple, repeatable behaviours.</p>
          <ul className="list-disc pl-6 text-[var(--primary)] space-y-2">
            <li><span className="font-medium">Regulate, then plan</span>: one minute of square breathing before opening banking apps.</li>
            <li><span className="font-medium">Make safety visible</span>: rename accounts — Essentials, Safety Buffer, Joy &amp; Freedom, Future Me.</li>
            <li><span className="font-medium">Tiny daily wins</span>: 10‑minute “money sprints” (open mail, cancel one subscription, move $10).</li>
            <li><span className="font-medium">Reframe mistakes</span>: “This is a safety action, not a worth test.”</li>
            <li><span className="font-medium">Weekly Money Date</span>: 20 minutes to review balances, pay what’s due, plan one small improvement.</li>
            <li><span className="font-medium">Update the old story</span>: Identify the origin (e.g., “Bills = eviction”) and align with today’s reality.</li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[var(--accent)] text-white font-semibold border border-[var(--accent)] hover:opacity-90"
              href="/bookings"
              aria-label="Book a counselling session"
            >
              Book a Session
            </Link>
            <Link
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white text-[var(--accent)] font-semibold border border-[var(--accent)] hover:bg-[var(--secondary)]/20"
              href="/enquiry"
              aria-label="Learn about Financial Trauma Therapy"
            >
              Learn More
            </Link>
          </div>
          <p className="text-[var(--primary)] text-sm">If you’re experiencing coercion or financial abuse, prioritise safety. Consider confidential support and a private emergency fund.</p>
        </section>

        <section id="faq" className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--foreground)] font-light">FAQ</h2>
          <details className="border border-[var(--secondary)] rounded-xl p-4">
            <summary className="font-semibold cursor-pointer text-[var(--foreground)]">
              Why am I anxious about money even when I’m doing fine?
            </summary>
            <p className="text-[var(--primary)] leading-relaxed mt-2">
              Because your body learned to equate money with safety. Old experiences can keep protection mode switched
              on even when the present is stable. Therapy helps update that map.
            </p>
          </details>
          <details className="border border-[var(--secondary)] rounded-xl p-4">
            <summary className="font-semibold cursor-pointer text-[var(--foreground)]">Do I just need a better budget?</summary>
            <p className="text-[var(--primary)] leading-relaxed mt-2">
              Budgeting helps, but it’s not enough if your nervous system feels unsafe. Calm first, then plan. Small,
              consistent actions beat perfect systems.
            </p>
          </details>
          <details className="border border-[var(--secondary)] rounded-xl p-4">
            <summary className="font-semibold cursor-pointer text-[var(--foreground)]">
              Can couples therapy help with money issues?
            </summary>
            <p className="text-[var(--primary)] leading-relaxed mt-2">
              Yes. Money conflict is often value conflict. A shared map that honours both safety and freedom reduces
              tension and increases teamwork.
            </p>
          </details>
        </section>
      </article>
      <Script
        id="why-money-triggers-anxiety-article"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="why-money-triggers-anxiety-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  )
}