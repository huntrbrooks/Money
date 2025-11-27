import { absoluteUrl } from "@/lib/seo"

type BuildUtmOptions = {
  source: string
  medium?: string
  campaign?: string
}

export function withUtm(url: string, options: BuildUtmOptions): string {
  try {
    const target = new URL(url.startsWith("http") ? url : absoluteUrl(url))
    target.searchParams.set("utm_source", options.source)
    target.searchParams.set("utm_medium", options.medium ?? "social")
    target.searchParams.set("utm_campaign", options.campaign ?? "content-share")
    return target.toString()
  } catch {
    return url
  }
}

