import { ImageResponse } from "next/og"
import { getPostBySlug, getVideoBySlug } from "@/lib/mdx"
import { SITE_URL } from "@/lib/seo"

export const runtime = "nodejs"

type Params = {
  params: { slug: string }
}

const WIDTH = 1200
const HEIGHT = 630

export async function GET(request: Request, { params }: Params) {
  const post = await getPostBySlug(params.slug)
  const video = post ? null : await getVideoBySlug(params.slug)
  const resource = post ?? video

  const title = resource?.frontmatter.title ?? "Financial Abuse Therapist"
  const description =
    resource?.frontmatter.description ??
    "Trauma-informed counselling for financial abuse recovery, monetary psychotherapy, and money anxiety."
  const badge = post ? "Article" : video ? "Video" : "Financial Therapy"

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
          <span style={{ fontWeight: 600 }}>Financial Abuse Therapist</span>
          <span
            style={{
              border: "2px solid rgba(32, 56, 91, 0.2)",
              borderRadius: 999,
              padding: "8px 20px",
              fontSize: 24,
            }}
          >
            {badge}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h1 style={{ fontSize: 64, lineHeight: 1.1, margin: 0 }}>{title}</h1>
          <p style={{ fontSize: 28, maxWidth: "80%", color: "rgba(32, 56, 91, 0.85)", margin: 0 }}>{description}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}>
          <span>Dan Lobel — Monetary Psychotherapy & Financial Trauma</span>
          <span>{SITE_URL.replace("https://", "")}</span>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
    },
  )
}

