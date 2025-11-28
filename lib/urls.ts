export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://financialabusetherapist.com"

export function absoluteUrl(path = "/"): string {
  if (!path) return SITE_URL
  try {
    return new URL(path, SITE_URL).toString()
  } catch {
    return SITE_URL
  }
}


