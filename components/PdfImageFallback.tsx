"use client"

import { useEffect, useState } from \"react\"

type PdfImageFallbackProps = {
  fileUrl: string
  title: string
}

type RenderedPage = {
  pageNumber: number
  dataUrl: string
}

const PDFJS_CDN = \"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js\"
const PDFJS_WORKER = \"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js\"

export default function PdfImageFallback({ fileUrl, title }: PdfImageFallbackProps) {
  const [pages, setPages] = useState<RenderedPage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadPdfJs() {
      if ((window as Window & { pdfjsLib?: unknown }).pdfjsLib) return
      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(`script[src=\"${PDFJS_CDN}\"]`)
        if (existing) {
          existing.addEventListener(\"load\", () => resolve())
          existing.addEventListener(\"error\", () => reject(new Error(\"PDF.js failed to load\")))
          return
        }
        const script = document.createElement(\"script\")
        script.src = PDFJS_CDN
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error(\"PDF.js failed to load\"))
        document.body.appendChild(script)
      })
    }

    async function renderPdf() {
      try {
        setLoading(true)
        await loadPdfJs()
        const pdfjsLib = (window as Window & { pdfjsLib?: any }).pdfjsLib
        if (!pdfjsLib) throw new Error(\"PDF.js not available\")
        pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER

        const pdf = await pdfjsLib.getDocument({ url: fileUrl }).promise
        const rendered: RenderedPage[] = []
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber)
          const viewport = page.getViewport({ scale: 1.4 })
          const canvas = document.createElement(\"canvas\")
          const context = canvas.getContext(\"2d\")
          if (!context) continue
          canvas.width = viewport.width
          canvas.height = viewport.height
          await page.render({ canvasContext: context, viewport }).promise
          rendered.push({ pageNumber, dataUrl: canvas.toDataURL(\"image/png\") })
          if (cancelled) return
        }
        if (!cancelled) {
          setPages(rendered)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : \"Unable to render PDF\")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void renderPdf()
    return () => {
      cancelled = true
    }
  }, [fileUrl])

  if (loading) {
    return <div className=\"text-sm text-[var(--primary)]\">Loading document…</div>
  }

  if (error) {
    return (
      <div className=\"text-sm text-[var(--primary)]\">
        Unable to preview this document on mobile. Please open it in a new tab.
      </div>
    )
  }

  return (
    <div className=\"space-y-4\">
      {pages.map((page) => (
        <img
          key={page.pageNumber}
          src={page.dataUrl}
          alt={`${title} page ${page.pageNumber}`}
          className=\"w-full rounded-sm border border-[var(--secondary)] bg-white\"
          loading=\"lazy\"
        />
      ))}
    </div>
  )
}
