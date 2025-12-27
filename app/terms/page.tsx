import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/seo"
import { readSiteConfig } from "@/lib/config"
import { SITE_URL } from "@/lib/urls"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"

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
  const downloadUrl = terms?.downloadUrl?.trim() || "/Terms%20of%20Service.docx"
  const fileUrl = `${SITE_URL.replace(/\/$/, "")}${downloadUrl}`
  const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`
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
        <p className="text-[var(--primary)] leading-relaxed">
          You can view the latest Terms of Service document below. You may also{" "}
          <a href={downloadUrl} className="underline" download>
            download the Word document
          </a>
          .
        </p>
        {mdx ? (
          <div className="rounded-md border border-[var(--secondary)] bg-[var(--section-bg-1)] p-6">
            <div className="mdx-content space-y-4 text-[var(--primary)] leading-relaxed">{mdx.content}</div>
          </div>
        ) : (
          <>
            <div className="w-full overflow-hidden rounded-md border border-[var(--secondary)] bg-[var(--section-bg-1)]">
              <iframe title="Terms of Service" src={viewerUrl} className="w-full" style={{ minHeight: "900px" }} />
            </div>
            <p className="text-[var(--primary)] text-sm">
              If the embedded viewer does not load,{" "}
              <a href={viewerUrl} className="underline" target="_blank" rel="noopener noreferrer">
                open the Terms of Service in a new tab
              </a>
              .
            </p>
          </>
        )}
      </div>
    </div>
  )
}


