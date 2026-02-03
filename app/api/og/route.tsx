import { ImageResponse } from "next/og"

import { SITE_URL } from "@/lib/urls"

export const runtime = "edge"

const WIDTH = 1200
const HEIGHT = 630

export async function GET() {
  const siteHostname = SITE_URL.replace(/^https?:\/\//, "")

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #6CA4AC 0%, #E5EED2 100%)",
          padding: "60px",
          color: "#20385B",
          fontSize: 36,
          fontFamily: "sans-serif",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 32 }}>
          <span style={{ fontWeight: 600 }}>Financial Trauma Therapist</span>
          <span
            style={{
              border: "2px solid rgba(32, 56, 91, 0.2)",
              borderRadius: 999,
              padding: "8px 20px",
              fontSize: 24,
            }}
          >
            Melbourne
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h1 style={{ fontSize: 56, lineHeight: 1.15, margin: 0, maxWidth: "90%" }}>
            Reclaim Your Power. Heal Your Relationship With Money.
          </h1>
          <p style={{ fontSize: 28, maxWidth: "85%", color: "rgba(32, 56, 91, 0.85)", margin: 0 }}>
            Trauma-informed counselling for financial abuse recovery and money anxiety
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}>
          <span>Dan Lobel — Monetary Psychotherapy</span>
          <span>{siteHostname}</span>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
    },
  )
}
