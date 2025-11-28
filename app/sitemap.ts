import type { MetadataRoute } from "next"

import { getAllPostsMeta, getAllVideosMeta } from "@/lib/mdx"
import { SITE_URL } from "@/lib/urls"

type RouteConfig = {
  path: string
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority?: number
  lastModified?: Date
}

const MARKETING_ROUTES: RouteConfig[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "yearly", priority: 0.7 },
  { path: "/bookings", changeFrequency: "monthly", priority: 0.8 },
  { path: "/enquiry", changeFrequency: "monthly", priority: 0.6 },
  { path: "/intake", changeFrequency: "monthly", priority: 0.5 },
  { path: "/consent", changeFrequency: "yearly", priority: 0.4 },
  { path: "/monetary-psychotherapy", changeFrequency: "yearly", priority: 0.7 },
  { path: "/contemporary-integrative-counselling", changeFrequency: "yearly", priority: 0.6 },
  { path: "/financial-abuse", changeFrequency: "monthly", priority: 0.9 },
  { path: "/financial-abuse-therapy", changeFrequency: "monthly", priority: 0.9 },
  { path: "/financial-abuse-therapist", changeFrequency: "monthly", priority: 0.9 },
  { path: "/why-money-triggers-anxiety", changeFrequency: "yearly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
]

const LEGACY_ROUTES: RouteConfig[] = [
  { path: "/financial-abuse-emotional-healing-dan-lobel.html", changeFrequency: "yearly", priority: 0.3 },
  { path: "/the-psychology-behind-spending-habits-dan-lobel.html", changeFrequency: "yearly", priority: 0.3 },
  { path: "/why-money-triggers-anxiety-dan-lobel.html", changeFrequency: "yearly", priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, videos] = await Promise.all([getAllPostsMeta(), getAllVideosMeta()])
  const dynamicRoutes: RouteConfig[] = [
    ...posts.map((post) => ({
      path: `/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      lastModified: new Date(post.date),
    })),
    ...videos.map((video) => ({
      path: `/vlog/${video.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
      lastModified: new Date(video.date),
    })),
  ]
  const staticRoutes = [...MARKETING_ROUTES, ...LEGACY_ROUTES].map((route) => ({
    ...route,
    lastModified: new Date(),
  }))
  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: route.lastModified ?? new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}


