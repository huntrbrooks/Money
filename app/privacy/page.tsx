import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/seo"
import { readSiteConfig } from "@/lib/config"
import { SITE_URL } from "@/lib/urls"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Privacy Policy | The Financial Therapist",
    description: "Review The Financial Therapist privacy policy, download the latest document, or open it in a new tab.",
    path: "/privacy",
    keywords: ["privacy policy", "counselling privacy", "confidentiality Melbourne"],
    noIndex: false,
  })
}

export default async function PrivacyPage() {
  const config = await readSiteConfig().catch(() => null)
  const legal = config?.legal
  const privacy = legal?.privacy
  const title = privacy?.title?.trim() || "Privacy Policy"
  const downloadUrl = privacy?.downloadUrl?.trim() || "/Privacy%20Policy.docx"
  const fileUrl = `${SITE_URL.replace(/\/$/, "")}${downloadUrl}`
  const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`
  const source = privacy?.bodyMdx?.trim() || ""
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
          You can view the latest Privacy Policy below. You may also{" "}
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
              <iframe title="Privacy Policy" src={viewerUrl} className="w-full" style={{ minHeight: "900px" }} />
            </div>
            <p className="text-[var(--primary)] text-sm">
              If the embedded viewer does not load,{" "}
              <a href={viewerUrl} className="underline" target="_blank" rel="noopener noreferrer">
                open the Privacy Policy in a new tab
              </a>
              .
            </p>
          </>
        )}
      </div>
    </div>
  )
}


