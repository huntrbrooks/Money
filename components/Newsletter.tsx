"use client"

import React, { useState, useEffect } from "react"

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
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Determine the actual URL to load
  const getUrl = () => {
    // Files in public/ are served from root, so /newsletters/file.html works directly
    return htmlFile
  }

  const url = getUrl()

  useEffect(() => {
    // Reset error state when URL changes
    setError(null)
    setLoading(true)
  }, [url])

  const handleLoad = () => {
    setLoading(false)
    setError(null)
  }

  const handleError = () => {
    setLoading(false)
    setError(`Failed to load newsletter. Please check that ${htmlFile} exists in the public directory.`)
  }

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>{title}</h1>
        {date ? <p style={{ margin: "6px 0 0", opacity: 0.75 }}>{date}</p> : null}
      </div>

      {error && (
        <div style={{ 
          padding: "20px", 
          background: "#fee", 
          border: "1px solid #fcc", 
          borderRadius: 8,
          marginBottom: 12,
          color: "#c33"
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && !error && (
        <div style={{ 
          padding: "20px", 
          textAlign: "center",
          color: "#666"
        }}>
          Loading newsletter...
        </div>
      )}

      <iframe
        title={title}
        src={url}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: "100%",
          height: "calc(100vh - 160px)",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 14,
          background: "#fff",
          display: error ? "none" : "block",
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  )
}

