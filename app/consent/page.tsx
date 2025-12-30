import type { Metadata } from "next"
import { readSiteConfig } from "@/lib/config"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { Navigation, Footer } from "@/components/navigation"
import ConsentFormClient from "./ConsentFormClient"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Consent & Policies | Financial Abuse Therapist",
    description: "Read and acknowledge the counselling consent and policies document.",
    path: "/consent",
    keywords: ["consent form", "counselling policies", "therapy consent"],
  })
}

export default async function ConsentPage() {
  const config = await readSiteConfig().catch(() => null)
  const consent = config?.legal?.consent
  const title = consent?.title?.trim() || "Consent & Policies"
  const downloadUrl = consent?.downloadUrl?.trim() || "/Consent%20and%20Policies.docx"
  const isPdf = downloadUrl.toLowerCase().split("?")[0].endsWith(".pdf")
  const requiredStatement = consent?.requiredStatement?.trim() || "I have read & I understand the contents of this document"
  const source = consent?.bodyMdx?.trim() || ""

  const contactEmail = config?.contact?.email || "dan@financialabusetherapist.com.au"
  const contactPhone = config?.contact?.phone || ""

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
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-10 text-center">
                <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">{title}</h1>
                <p className="text-[var(--primary)] mt-2">
                  Please read carefully and complete the acknowledgement below. You may also{" "}
                  <a href={downloadUrl} className="underline" download>
                    download the document
                  </a>
                  .
                </p>
              </div>

              <div className="bg-[var(--section-bg-2)] border border-[var(--secondary)] rounded-xl p-6 md:p-10 space-y-6">
                {mdx ? (
                  <div className="mdx-content space-y-4 text-[var(--primary)] leading-relaxed">{mdx.content}</div>
                ) : isPdf ? (
                  <div className="w-full overflow-hidden rounded-md border border-[var(--secondary)] bg-[var(--section-bg-1)]">
                    <iframe title={title} src={downloadUrl} className="w-full" style={{ minHeight: "700px" }} />
                  </div>
                ) : (
                  <p className="text-[var(--primary)] text-sm">
                    This document is currently available as a download only.{" "}
                    <a href={downloadUrl} className="underline" target="_blank" rel="noopener noreferrer">
                      Open it in a new tab
                    </a>
                    .
                  </p>
                )}

                <ConsentFormClient requiredStatement={requiredStatement} contactEmail={contactEmail} contactPhone={contactPhone} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}


