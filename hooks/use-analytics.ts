"use client"

import { useCallback } from "react"

type AnalyticsPayload = Record<string, unknown>

const serverTrackedEvents = new Set(["lead_magnet_cta_click", "newsletter_subscribed"])

export function useAnalytics() {
  const track = useCallback((event: string, payload: AnalyticsPayload = {}) => {
    if (typeof window === "undefined") return
    const w = window as typeof window & { dataLayer?: AnalyticsPayload[] }
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ event, ...payload })
    window.dispatchEvent(new CustomEvent("analytics", { detail: { event, payload } }))
    if (serverTrackedEvents.has(event)) {
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, detail: payload }),
      }).catch(() => {
        // ignore
      })
    }
  }, [])

  return { track }
}

