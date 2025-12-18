import type { MetadataRoute } from "next"

const BASE_URL = "https://financialabusetherapist.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/login"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: "financialabusetherapist.com",
  }
}


