import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { getAllPostsMeta } from "@/lib/mdx"
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Articles & Resources | Financial Abuse Therapist",
    description: "Read trauma-informed articles about money anxiety, financial abuse recovery, and monetary psychotherapy.",
    path: "/blog",
    keywords: ["financial therapy articles", "money anxiety resources", "financial abuse blog"],
  })
}

export default async function BlogIndexPage() {
  const posts = await getAllPostsMeta()
  return (
    <div className="min-h-screen bg-muted">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto space-y-10">
          <header className="text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-semibold">Articles</p>
            <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
              Trauma-informed notes on money and care
            </h1>
            <p className="text-[var(--primary)]">
              Essays and resources from Dan Lobel on financial abuse recovery, nervous-system-aware money rituals, and
              reclaiming self-trust.
            </p>
          </header>

          <div className="grid gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-3xl border border-[var(--secondary)] bg-[var(--section-bg-1)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(32,56,91,0.1)]"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--primary)] font-semibold">
                  {new Date(post.date).toLocaleDateString("en-AU", { dateStyle: "medium" })}
                </p>
                <h2 className="font-serif text-2xl text-[var(--foreground)] mt-2">{post.title}</h2>
                <p className="text-[var(--primary)] mt-2">{post.description}</p>
                <div className="mt-3 text-sm text-[var(--accent)] font-semibold">Read article →</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Script
        id="breadcrumb-schema-blog"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Blog", url: "/blog" },
            ])
          ),
        }}
      />
    </div>
  )
}

