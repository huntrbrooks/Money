import type { Metadata } from "next"
import Link from "next/link"
import { getAllVideosMeta } from "@/lib/mdx"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Video Library | Financial Abuse Therapist",
    description: "Watch short teachings on financial abuse recovery, nervous-system-aware money practices, and client care rituals.",
    path: "/vlog",
    keywords: ["financial therapy videos", "monetary psychotherapy video", "financial abuse vlog"],
  })
}

export default async function VlogIndexPage() {
  const videos = await getAllVideosMeta()
  return (
    <div className="min-h-screen bg-muted">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto space-y-10">
          <header className="text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-semibold">Video resources</p>
            <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">
              Watch gentle, practical walkthroughs
            </h1>
            <p className="text-[var(--primary)]">
              Bite-sized sessions to revisit between appointments or share with people supporting your journey.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            {videos.map((video) => (
              <Link
                key={video.slug}
                href={`/vlog/${video.slug}`}
                className="rounded-3xl border border-[var(--secondary)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(32,56,91,0.1)]"
              >
                <div className="aspect-video rounded-2xl bg-[var(--section-bg-1)] mb-4 flex items-center justify-center text-[var(--primary)]/60 text-sm uppercase tracking-[0.3em]">
                  {video.platform ?? "Video"}
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--primary)] font-semibold">
                  {new Date(video.date).toLocaleDateString("en-AU", { dateStyle: "medium" })}
                </p>
                <h2 className="font-serif text-2xl text-[var(--foreground)] mt-2">{video.title}</h2>
                <p className="text-[var(--primary)] mt-2">{video.description}</p>
                <div className="mt-3 text-sm text-[var(--accent)] font-semibold">Watch video →</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

