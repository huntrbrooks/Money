"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

type GoogleAdsConversionProps = {
  conversionLabel?: string
}

export function GoogleAdsConversion({ conversionLabel }: GoogleAdsConversionProps) {
  useEffect(() => {
    // Get values from environment variables (available at build time via NEXT_PUBLIC_ prefix)
    const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
    const defaultLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL
    const label = conversionLabel || defaultLabel

    if (!adsId || !label) {
      return
    }

    // Wait for gtag to be available (it loads asynchronously)
    const checkAndFire = () => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "conversion", {
          send_to: `${adsId}/${label}`,
        })
      } else {
        // Retry after a short delay if gtag isn't ready yet
        setTimeout(checkAndFire, 100)
      }
    }

    checkAndFire()
  }, [conversionLabel])

  return null
}

