import { headers } from "next/headers"

export const metadata = {
  title: "Terms of Service | The Financial Therapist",
}

export default function TermsPage() {
  const headersList = headers()
  const host = headersList.get("host") ?? "localhost:3000"
  const proto = headersList.get("x-forwarded-proto") ?? "http"
  const baseUrl = `${proto}://${host}`
  const fileUrl = `${baseUrl}${encodeURI("/Terms of Service.docx")}`
  const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">Terms of Service</h1>
        <p className="text-[var(--primary)] leading-relaxed">
          You can view the latest Terms of Service document below. You may also{" "}
          <a href="/Terms%20of%20Service.docx" className="underline" download>
            download the Word document
          </a>
          .
        </p>
        <div className="w-full overflow-hidden rounded-md border border-[var(--secondary)] bg-white">
          <iframe
            title="Terms of Service"
            src={viewerUrl}
            className="w-full"
            style={{ minHeight: "900px" }}
          />
        </div>
        <p className="text-[var(--primary)] text-sm">
          If the embedded viewer does not load,{" "}
          <a href={viewerUrl} className="underline" target="_blank" rel="noopener noreferrer">
            open the Terms of Service in a new tab
          </a>
          .
        </p>
      </div>
    </div>
  )
}


