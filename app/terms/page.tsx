import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/seo"
import { readSiteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/urls"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Terms of Service | The Financial Therapist",
    description: "Read or download The Financial Therapist terms of service document for counselling support.",
    path: "/terms",
    keywords: ["terms of service", "counselling agreement", "therapy policies"],
  })
}

export default async function TermsPage() {
  const config = await readSiteConfig().catch(() => null)
  const legal = config?.legal
  const terms = legal?.terms
  const title = terms?.title?.trim() || "Terms of Service"
  const downloadUrl = terms?.downloadUrl?.trim() || "/Terms%20of%20Service.pdf"
  const isPdf = downloadUrl.toLowerCase().split("?")[0].endsWith(".pdf")
  // For PDF viewer: hide toolbar + panes, enable scroll, fit to page width on mobile.
  const pdfViewerUrl = isPdf
    ? `${downloadUrl.split("#")[0]}#toolbar=0&navpanes=0&scrollbar=1&zoom=page-width`
    : downloadUrl
  const pdfFileUrl = downloadUrl.split("#")[0]
  const mobileViewerUrl = isPdf
    ? `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(absoluteUrl(pdfFileUrl))}`
    : downloadUrl
  const source = terms?.bodyMdx?.trim() || ""
  let mdx: Awaited<ReturnType<typeof compileMDX>> | null = null
  if (source) {
    try {
      mdx = await compileMDX({
        source,
        options: {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
          },
        },
      })
    } catch {
      mdx = null
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">{title}</h1>
        {mdx ? (
          <div className="rounded-md border border-[var(--secondary)] bg-[var(--section-bg-1)] p-6">
            <div className="mdx-content space-y-4 text-[var(--primary)] leading-relaxed">{mdx.content}</div>
          </div>
        ) : isPdf ? (
          <>
            <div className="w-full rounded-md border border-[var(--secondary)] bg-[var(--section-bg-1)]">
              <iframe
                title="Terms of Service (Mobile)"
                src={mobileViewerUrl}
                className="w-full h-[80vh] bg-white md:hidden"
              />
              <iframe
                title="Terms of Service"
                src={pdfViewerUrl}
                className="hidden w-full h-[80vh] md:h-[900px] bg-white md:block"
              />
            </div>
            <p className="text-[var(--primary)] text-sm">
              If the embedded PDF does not load,{" "}
              <a href={downloadUrl} className="underline" target="_blank" rel="noopener noreferrer">
                open it in a new tab
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <p className="text-[var(--primary)] text-sm">
              This document is currently available as a download only.{" "}
              <a href={downloadUrl} className="underline" target="_blank" rel="noopener noreferrer">
                Open it in a new tab
              </a>
              .
            </p>
          </>
        )}
      </div>
    </div>
  )
}


