import type { MetadataRoute } from "next"

import { getAllPostsMeta, getAllVideosMeta } from "@/lib/mdx"
import { SITE_URL } from "@/lib/urls"
import { readSiteConfig } from "@/lib/config"

type RouteConfig = {
  path: string
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority?: number
  lastModified?: Date
}

const MARKETING_ROUTES: RouteConfig[] = [
  // Core pages - highest priority
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.9 },
  { path: "/bookings", changeFrequency: "weekly", priority: 0.9 },
  
  // Content listing pages - high priority for discovery
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/vlog", changeFrequency: "weekly", priority: 0.8 },
  
  // Service/specialization pages - high priority for SEO
  { path: "/financial-abuse", changeFrequency: "monthly", priority: 0.9 },
  { path: "/financial-abuse-therapy", changeFrequency: "monthly", priority: 0.9 },
  { path: "/financial-abuse-therapist", changeFrequency: "monthly", priority: 0.9 },
  { path: "/financial-trauma", changeFrequency: "monthly", priority: 0.8 },
  { path: "/monetary-psychotherapy", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contemporary-integrative-counselling", changeFrequency: "monthly", priority: 0.7 },
  { path: "/family-financial-assistance-inheritance", changeFrequency: "monthly", priority: 0.7 },
  { path: "/why-money-triggers-anxiety", changeFrequency: "yearly", priority: 0.6 },
  
  // Client-facing pages
  { path: "/client-care", changeFrequency: "monthly", priority: 0.7 },
  { path: "/enquiry", changeFrequency: "monthly", priority: 0.6 },
  { path: "/intake", changeFrequency: "monthly", priority: 0.6 },
  { path: "/newsletter", changeFrequency: "monthly", priority: 0.5 },
  
  // Legal/static pages - lower priority
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
]

const LEGACY_ROUTES: RouteConfig[] = [
  { path: "/financial-abuse-emotional-healing-dan-lobel.html", changeFrequency: "yearly", priority: 0.3 },
  { path: "/the-psychology-behind-spending-habits-dan-lobel.html", changeFrequency: "yearly", priority: 0.3 },
  { path: "/why-money-triggers-anxiety-dan-lobel.html", changeFrequency: "yearly", priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, videos, config] = await Promise.all([
    getAllPostsMeta(),
    getAllVideosMeta(),
    readSiteConfig().catch(() => null),
  ])
  
  // Add content section pages to sitemap
  const contentSectionRoutes: RouteConfig[] = []
  if (config) {
    const pages = Array.isArray(config.contentSectionPages) ? config.contentSectionPages : []
    const sections = Array.isArray(config.contentSections) ? config.contentSections : []
    const allContentSections = [...pages, ...sections]
    
    allContentSections.forEach((section) => {
      if (section?.slug) {
        contentSectionRoutes.push({
          path: `/content-sections/${section.slug}`,
          changeFrequency: "monthly" as const,
          priority: 0.7,
          lastModified: new Date(),
        })
      }
    })
  }
  
  const dynamicRoutes: RouteConfig[] = [
    // Blog posts - prioritize by recency
    ...posts.map((post, index) => ({
      path: `/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      // Recent posts get higher priority (first 10 posts get 0.7, rest get 0.6)
      priority: index < 10 ? 0.7 : 0.6,
      lastModified: new Date(post.date),
    })),
    // Video content
    ...videos.map((video, index) => ({
      path: `/vlog/${video.slug}`,
      changeFrequency: "monthly" as const,
      // Recent videos get higher priority (first 10 videos get 0.6, rest get 0.5)
      priority: index < 10 ? 0.6 : 0.5,
      lastModified: new Date(video.date),
    })),
    // Content sections from CMS
    ...contentSectionRoutes,
  ]
  
  // Use current date for static routes (they're regenerated on build)
  const now = new Date()
  const staticRoutes = [...MARKETING_ROUTES, ...LEGACY_ROUTES].map((route) => ({
    ...route,
    lastModified: route.lastModified ?? now,
  }))
  
  // Combine all routes and ensure proper formatting
  const allRoutes = [...staticRoutes, ...dynamicRoutes]
  
  return allRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: route.lastModified ?? now,
    changeFrequency: route.changeFrequency ?? "monthly",
    priority: route.priority ?? 0.5,
  }))
}


