import { ImageResponse } from "next/og"

import { SITE_URL } from "@/lib/urls"
import { OgTemplate } from "./template"

export const runtime = "edge"

type Params = {
  params: { slug: string }
}

const WIDTH = 1200
const HEIGHT = 630

type PostSummary = {
  slug: string
  title: string
  description: string
}

type VideoSummary = {
  slug: string
  title: string
  description: string
}

type OgResource = {
  badge: "Article" | "Video"
  title: string
  description: string
}

async function fetchCollection<T>(endpoint: string, requestUrl: string): Promise<T[] | null> {
  try {
    const url = new URL(endpoint, requestUrl)
    const response = await fetch(url.toString(), {
      next: { revalidate: 300 },
    })
    if (!response.ok) {
      return null
    }
    return (await response.json()) as T[]
  } catch {
    return null
  }
}

async function resolveResource(slug: string, requestUrl: string): Promise<OgResource | null> {
  const posts = await fetchCollection<PostSummary>("/api/posts", requestUrl)
  const post = posts?.find((item) => item.slug === slug)
  if (post) {
    return {
      badge: "Article",
      title: post.title,
      description: post.description,
    }
  }

  const videos = await fetchCollection<VideoSummary>("/api/videos", requestUrl)
  const video = videos?.find((item) => item.slug === slug)
  if (video) {
    return {
      badge: "Video",
      title: video.title,
      description: video.description,
    }
  }

  return null
}

export async function GET(request: Request, { params }: Params) {
  const resource = await resolveResource(params.slug, request.url)
  const title = resource?.title ?? "Financial Trauma Therapist"
  const description =
    resource?.description ??
    "Trauma-informed counselling for financial abuse recovery, monetary psychotherapy, and money anxiety."
  const badge = resource?.badge ?? "Financial Therapy"
  const siteHostname = SITE_URL.replace(/^https?:\/\//, "")

  return new ImageResponse(
    <OgTemplate
      width={WIDTH}
      height={HEIGHT}
      badge={badge}
      title={title}
      description={description}
      siteHostname={siteHostname}
    />,
    {
      width: WIDTH,
      height: HEIGHT,
    },
  )
}

