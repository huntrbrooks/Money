"use client"

import { useEffect, useState } from "react"
import PdfImageFallback from "@/components/PdfImageFallback"

type ResponsivePdfEmbedProps = {
  title: string
  fileUrl: string
  viewerUrl: string
  openLabel: string
}

export default function ResponsivePdfEmbed({ title, fileUrl, viewerUrl, openLabel }: ResponsivePdfEmbedProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(mq.matches)
    update()
    if ("addEventListener" in mq) {
      mq.addEventListener("change", update)
      return () => mq.removeEventListener("change", update)
    }
    mq.addListener(update)
    return () => mq.removeListener(update)
  }, [])

  if (isMobile) {
    return (
      <div className="p-4 space-y-4">
        <PdfImageFallback fileUrl={fileUrl} title={title} />
        <a className="inline-block text-sm underline text-[var(--primary)]" href={fileUrl} target="_blank" rel="noopener noreferrer">
          {openLabel}
        </a>
      </div>
    )
  }

  return (
    <iframe
      title={title}
      src={viewerUrl}
      className="w-full h-[80vh] md:h-[900px] bg-white"
    />
  )
}
