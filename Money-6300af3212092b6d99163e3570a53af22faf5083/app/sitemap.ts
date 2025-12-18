import type { MetadataRoute } from "next"

const BASE_URL = "https://financialabusetherapist.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const routes: Array<{
    path: string
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"]
    priority?: number
  }> = [
    // Core pages
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/bookings", changeFrequency: "monthly", priority: 0.8 },
    { path: "/enquiry", changeFrequency: "monthly", priority: 0.7 },
    { path: "/financial-abuse", changeFrequency: "monthly", priority: 0.9 },
    { path: "/financial-abuse-therapy", changeFrequency: "monthly", priority: 0.9 },
    { path: "/financial-abuse-therapist", changeFrequency: "monthly", priority: 0.9 },
    { path: "/consent", changeFrequency: "yearly", priority: 0.4 },
    { path: "/intake", changeFrequency: "yearly", priority: 0.4 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/why-money-triggers-anxiety", changeFrequency: "yearly", priority: 0.6 },

    // Blog posts
    { path: "/blog/financial-abuse-and-emotional-healing", changeFrequency: "yearly", priority: 0.7 },
    { path: "/blog/the-psychology-behind-spending-habits", changeFrequency: "yearly", priority: 0.7 },
    { path: "/blog/why-money-triggers-anxiety", changeFrequency: "yearly", priority: 0.7 },

    // Legacy static HTML pages (kept for SEO continuity)
    { path: "/financial-abuse-emotional-healing-dan-lobel.html", changeFrequency: "yearly", priority: 0.3 },
    { path: "/the-psychology-behind-spending-habits-dan-lobel.html", changeFrequency: "yearly", priority: 0.3 },
    { path: "/why-money-triggers-anxiety-dan-lobel.html", changeFrequency: "yearly", priority: 0.3 },
  ]

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}


