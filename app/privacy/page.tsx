import type { Metadata } from "next"
import { headers } from "next/headers"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Privacy Policy | The Financial Therapist",
    description: "Review The Financial Therapist privacy policy, download the latest document, or open it in a new tab.",
    path: "/privacy",
    keywords: ["privacy policy", "counselling privacy", "confidentiality Melbourne"],
    noIndex: false,
  })
}

export default function PrivacyPage() {
  const headersList = headers()
  const host = headersList.get("host") ?? "localhost:3000"
  const proto = headersList.get("x-forwarded-proto") ?? "http"
  const baseUrl = `${proto}://${host}`
  const fileUrl = `${baseUrl}${encodeURI("/Privacy Policy.docx")}`
  const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">Privacy Policy</h1>
        <p className="text-[var(--primary)] leading-relaxed">
          You can view the latest Privacy Policy below. You may also{" "}
          <a href="/Privacy%20Policy.docx" className="underline" download>
            download the Word document
          </a>
          .
        </p>
        <div className="w-full overflow-hidden rounded-md border border-[var(--secondary)] bg-[var(--section-bg-1)]">
          <iframe
            title="Privacy Policy"
            src={viewerUrl}
            className="w-full"
            style={{ minHeight: "900px" }}
          />
        </div>
        <p className="text-[var(--primary)] text-sm">
          If the embedded viewer does not load,{" "}
          <a href={viewerUrl} className="underline" target="_blank" rel="noopener noreferrer">
            open the Privacy Policy in a new tab
          </a>
          .
        </p>
      </div>
    </div>
  )
}


