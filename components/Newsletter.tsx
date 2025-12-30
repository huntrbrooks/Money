import React from "react"

type Props = {
  title: string
  date?: string
  htmlFile: string
}

/**
 * Renders a full-page newsletter HTML file inside an iframe.
 * Place your HTML files in /public/newsletters/*.html
 * Or use /api/interactive-newsletter for why-money-triggers-anxiety.html
 */
export default function Newsletter({ title, date, htmlFile }: Props) {
  // Determine the actual URL to load
  const getUrl = () => {
    // Special handling for why-money-triggers-anxiety (uses API route)
    if (htmlFile === "/why-money-triggers-anxiety.html" || htmlFile.includes("why-money-triggers-anxiety")) {
      return "/api/interactive-newsletter"
    }
    // For other newsletters, use the provided path
    return htmlFile
  }

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>{title}</h1>
        {date ? <p style={{ margin: "6px 0 0", opacity: 0.75 }}>{date}</p> : null}
      </div>

      <iframe
        title={title}
        src={getUrl()}
        style={{
          width: "100%",
          height: "calc(100vh - 160px)",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 14,
          background: "#fff",
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  )
}

