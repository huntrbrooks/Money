import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { notFound } from "next/navigation"
import { getAllPostsMeta, getPostBySlug } from "@/lib/mdx"
import { absoluteUrl, buildArticleSchema, buildPageMetadata } from "@/lib/seo"
import { SocialShare } from "@/components/social-share"

type BlogPageProps = {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = await getAllPostsMeta()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) {
    return buildPageMetadata({
      title: "Article not found",
      description: "The requested article could not be located.",
      path: `/blog/${params.slug}`,
      noIndex: true,
    })
  }
  return buildPageMetadata({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    path: `/blog/${post.frontmatter.slug}`,
    keywords: post.frontmatter.tags,
    type: "article",
    publishedTime: post.frontmatter.date,
    modifiedTime: post.frontmatter.date,
    image: `/api/og/${post.frontmatter.slug}`,
  })
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const post = await getPostBySlug(params.slug)
  if (!post) {
    notFound()
  }
  const canonicalUrl = absoluteUrl(`/blog/${post.frontmatter.slug}`)
  const articleSchema = buildArticleSchema({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    slug: `/blog/${post.frontmatter.slug}`,
    publishedTime: post.frontmatter.date,
  })

  return (
    <div className="container mx-auto px-4 py-16">
      <article className="max-w-3xl mx-auto space-y-10">
        <header className="space-y-3 pb-6 border-b border-[var(--secondary)]">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
            Financial Trauma &amp; Monetary Psychotherapy
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
            {post.frontmatter.title}
          </h1>
          <p className="text-sm text-[var(--primary)]/80">
            Published {new Date(post.frontmatter.date).toLocaleDateString("en-AU", { dateStyle: "long" })}
          </p>
          <p className="text-[var(--primary)]">{post.frontmatter.description}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[var(--accent)] text-white font-semibold border border-[var(--accent)] hover:opacity-90"
              href="/bookings"
              aria-label="Book a counselling session"
              data-analytics-id="blog-book-session"
            >
              Book a Session
            </Link>
            <Link
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white text-[var(--accent)] font-semibold border border-[var(--accent)] hover:bg-[var(--secondary)]/20"
              href="/enquiry"
              aria-label="Contact Dan Lobel"
              data-analytics-id="blog-contact"
            >
              Contact
            </Link>
          </div>
        </header>

        <SocialShare url={canonicalUrl} title={post.frontmatter.title} summary={post.frontmatter.description} />

        <div className="mdx-content space-y-6 text-[var(--primary)] leading-relaxed">
          {post.content}
        </div>
      </article>
      <Script
        id={`article-schema-${post.frontmatter.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </div>
  )
}

