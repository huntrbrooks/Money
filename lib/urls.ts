function canonicalizeSiteUrl(input: string): string {
  try {
    const url = new URL(input)
    const host = url.hostname.toLowerCase()
  // Canonical domain requirement: always use financialtraumatherapist.com.au
    if (
      host === "financialabusetherapist.com.au" ||
      host === "www.financialabusetherapist.com.au" ||
      host === "financialabusetherapist.com" ||
      host === "www.financialabusetherapist.com" ||
      host === "financialtraumatherapist.com.au" ||
      host === "www.financialtraumatherapist.com.au" ||
      host === "money-three-hazel.vercel.app"
    ) {
      return "https://financialtraumatherapist.com.au"
    }
    return url.toString().replace(/\/$/, "")
  } catch {
    return "https://financialtraumatherapist.com.au"
  }
}

export const SITE_URL = canonicalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? "https://financialtraumatherapist.com.au")

export function absoluteUrl(path = "/"): string {
  if (!path) return SITE_URL
  try {
    return new URL(path, SITE_URL).toString()
  } catch {
    return SITE_URL
  }
}















