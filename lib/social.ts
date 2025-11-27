type BuildUtmOptions = {
  source: string
  medium?: string
  campaign?: string
}

const PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://financialabusetherapist.com"

function resolveAbsolute(path: string) {
  if (!path) return PUBLIC_SITE_URL
  if (/^https?:\/\//i.test(path)) return path
  try {
    return new URL(path, PUBLIC_SITE_URL).toString()
  } catch {
    return path
  }
}

export function withUtm(url: string, options: BuildUtmOptions): string {
  try {
    const target = new URL(resolveAbsolute(url))
    target.searchParams.set("utm_source", options.source)
    target.searchParams.set("utm_medium", options.medium ?? "social")
    target.searchParams.set("utm_campaign", options.campaign ?? "content-share")
    return target.toString()
  } catch {
    return url
  }
}

