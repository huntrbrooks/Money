function canonicalizeSiteUrl(input: string): string {
  try {
    const url = new URL(input)
    const host = url.hostname.toLowerCase()
    // Canonical domain requirement: always use www.financialabusetherapist.com
    if (
      host === "financialabusetherapist.com" ||
      host === "www.financialabusetherapist.com" ||
      host === "money-three-hazel.vercel.app"
    ) {
      return "https://www.financialabusetherapist.com"
    }
    return url.toString().replace(/\/$/, "")
  } catch {
    return "https://www.financialabusetherapist.com"
  }
}

export const SITE_URL = canonicalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.financialabusetherapist.com")

export function absoluteUrl(path = "/"): string {
  if (!path) return SITE_URL
  try {
    return new URL(path, SITE_URL).toString()
  } catch {
    return SITE_URL
  }
}















