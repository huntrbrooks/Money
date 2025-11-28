import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { notFound } from "next/navigation"
import { getAllVideosMeta, getVideoBySlug } from "@/lib/mdx"
import { buildPageMetadata, buildVideoSchema } from "@/lib/seo"
import { absoluteUrl } from "@/lib/urls"
import { SocialShare } from "@/components/social-share"

type VlogPageProps = {
  params: { slug: string }
}

export async function generateStaticParams() {
  const videos = await getAllVideosMeta()
  return videos.map((video) => ({ slug: video.slug }))
}

export async function generateMetadata({ params }: VlogPageProps): Promise<Metadata> {
  const video = await getVideoBySlug(params.slug)
  if (!video) {
    return buildPageMetadata({
      title: "Video not found",
      description: "The requested video could not be located.",
      path: `/vlog/${params.slug}`,
      noIndex: true,
    })
  }
  return buildPageMetadata({
    title: `${video.frontmatter.title} | Video Session`,
    description: video.frontmatter.description,
    path: `/vlog/${video.frontmatter.slug}`,
    keywords: video.frontmatter.tags,
    type: "article",
    publishedTime: video.frontmatter.date,
    image: `/api/og/${video.frontmatter.slug}?kind=video`,
  })
}

export default async function VlogPostPage({ params }: VlogPageProps) {
  const video = await getVideoBySlug(params.slug)
  if (!video) {
    notFound()
  }
  const canonicalUrl = absoluteUrl(`/vlog/${video.frontmatter.slug}`)
  const schema = buildVideoSchema({
    title: video.frontmatter.title,
    description: video.frontmatter.description,
    slug: `/vlog/${video.frontmatter.slug}`,
    uploadDate: video.frontmatter.date,
    embedUrl: video.frontmatter.videoUrl,
  })

  return (
    <div className="container mx-auto px-4 py-16">
      <article className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-semibold">Video session</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">{video.frontmatter.title}</h1>
          <p className="text-[var(--primary)]">{video.frontmatter.description}</p>
          <p className="text-sm text-[var(--primary)]/80">
            Published {new Date(video.frontmatter.date).toLocaleDateString("en-AU", { dateStyle: "long" })}
          </p>
        </header>

        <SocialShare url={canonicalUrl} title={video.frontmatter.title} summary={video.frontmatter.description} />

        <div className="relative overflow-hidden rounded-[32px] border border-[var(--secondary)] bg-black shadow-2xl">
          <div className="aspect-video">
            <iframe
              src={video.frontmatter.videoUrl}
              title={video.frontmatter.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>

        <div className="space-y-4 text-[var(--primary)] leading-relaxed">
          {video.content}
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <Link
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[var(--accent)] text-white font-semibold border border-[var(--accent)] hover:opacity-90"
            href="/bookings"
            data-analytics-id="vlog-book-session"
          >
            Book a Session
          </Link>
          <Link
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[var(--section-bg-1)] text-[var(--accent)] font-semibold border border-[var(--accent)] hover:bg-[var(--section-bg-2)]/60"
            href="/enquiry"
            data-analytics-id="vlog-download-guide"
          >
            Download the guide
          </Link>
        </div>
      </article>
      <Script
        id={`video-schema-${video.frontmatter.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </div>
  )
}

