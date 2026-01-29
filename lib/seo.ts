import type { Metadata } from "next"

import { readSiteConfig } from "@/lib/config"
import type { SiteConfig } from "@/lib/config"
import { absoluteUrl, SITE_URL } from "@/lib/urls"

const DEFAULT_TITLE = "Financial Trauma Therapist — Dan Lobel"
const DEFAULT_DESCRIPTION =
  "Trauma-informed counselling in Melbourne focused on financial trauma recovery, money anxiety, and monetary psychotherapy."
const DEFAULT_OG_IMAGE = "/og.jpg"

const DEFAULT_KEYWORDS = [
  "financial abuse",
  "financial abuse therapy",
  "Financial Trauma Therapist",
  "financial trauma therapy",
  "monetary psychotherapy",
  "economic abuse counselling",
  "women's counselling Melbourne",
  "money anxiety therapy",
  "financial trauma recovery",
  "counselling Melbourne",
]

function getSocialProfiles(config: SiteConfig): string[] {
  const fallback = [
    "https://www.facebook.com/the.melbourne.counsellor/",
    "https://www.instagram.com/the.melbourne.counsellor/#",
    "https://www.linkedin.com/in/dan-lobel-the-melbourne-counsellor-769b61204/",
  ]
  const raw = [config.social?.facebook, config.social?.instagram, config.social?.linkedin].filter(Boolean) as string[]
  const valid = raw.filter((u) => {
    try {
      new URL(u)
      return true
    } catch {
      return false
    }
  })
  return valid.length ? valid : fallback
}

type OpenGraphType = NonNullable<NonNullable<Metadata["openGraph"]>["type"]>

type BuildMetadataInput = {
  title?: string
  description?: string
  path?: string
  canonical?: string
  keywords?: string[]
  image?: string
  type?: OpenGraphType
  publishedTime?: string
  modifiedTime?: string
  noIndex?: boolean
  noFollow?: boolean
}

export async function buildPageMetadata(options: BuildMetadataInput = {}): Promise<Metadata> {
  const config = await readSiteConfig()
  const brandName = config.brand?.name ?? "Financial Trauma Therapist"
  const title = options.title ?? config.seo?.title ?? DEFAULT_TITLE
  const description = options.description ?? config.seo?.description ?? DEFAULT_DESCRIPTION
  const canonicalUrl = options.canonical ?? absoluteUrl(options.path ?? "/")
  const ogImage = absoluteUrl(options.image ?? config.seo?.ogImage ?? DEFAULT_OG_IMAGE)
  const keywords = Array.from(new Set([...DEFAULT_KEYWORDS, ...(options.keywords ?? [])].filter(Boolean)))

  const openGraph: NonNullable<Metadata["openGraph"]> = {
    title,
    description,
    url: canonicalUrl,
    siteName: brandName,
    images: [{ url: ogImage }],
    type: options.type ?? "website",
    locale: "en_AU",
  }

  if (openGraph.type === "article" && (options.publishedTime || options.modifiedTime)) {
    openGraph.article = {
      publishedTime: options.publishedTime,
      modifiedTime: options.modifiedTime ?? options.publishedTime,
      authors: [brandName],
    }
  }

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: canonicalUrl,
        "en-AU": canonicalUrl,
      },
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: options.noIndex
      ? {
          index: false,
          follow: !options.noFollow,
          googleBot: {
            index: false,
            follow: !options.noFollow,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        },
  }
}

type ArticleSchemaInput = {
  title: string
  description: string
  slug: string
  publishedTime?: string
  modifiedTime?: string
  authorName?: string
  image?: string
}

export function buildArticleSchema(options: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.title,
    description: options.description,
    author: {
      "@type": "Person",
      name: options.authorName ?? "Dan Lobel",
      url: absoluteUrl("/about"),
    },
    publisher: {
      "@type": "Organization",
      name: "Financial Trauma Therapist",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.svg"),
      },
    },
    datePublished: options.publishedTime,
    dateModified: options.modifiedTime ?? options.publishedTime,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(options.slug),
    },
    image: options.image ? absoluteUrl(options.image) : undefined,
  }
}

export type FaqItem = {
  question: string
  answer: string
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

type ServiceSchemaOptions = {
  serviceType?: string
  description?: string
  url?: string
  areaServed?: string[]
}

export function buildServiceSchema(config: SiteConfig, options: ServiceSchemaOptions = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: options.serviceType ?? "Financial trauma therapy",
    description: options.description,
    provider: {
      "@type": "Organization",
      name: config.brand?.name ?? "Financial Trauma Therapist",
      url: SITE_URL,
    },
    areaServed: options.areaServed ?? ["Melbourne", "Victoria", "Australia"],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl(options.url ?? "/bookings"),
      availableLanguage: ["en"],
    },
  }
}

export function buildOrganizationSchema(config: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.brand?.name ?? "Financial Trauma Therapist",
    url: SITE_URL,
    logo: absoluteUrl(config.brand?.logoUrl ?? "/logo.svg"),
    sameAs: getSocialProfiles(config),
    contactPoint: config.contact?.phone
      ? [
          {
            "@type": "ContactPoint",
            telephone: config.contact.phone,
            contactType: "customer service",
            areaServed: "AU",
            availableLanguage: ["en"],
          },
        ]
      : undefined,
  }
}

const DEFAULT_BUSINESS_ADDRESS = {
  streetAddress: "Unit 503, 666 Chapel Street",
  addressLocality: "South Yarra",
  addressRegion: "VIC",
  postalCode: "3141",
  addressCountry: "AU",
}

type LocalBusinessOptions = {
  telephone?: string
  address?: Partial<typeof DEFAULT_BUSINESS_ADDRESS>
}

export function buildLocalBusinessSchema(config: SiteConfig, options: LocalBusinessOptions = {}) {
  const telephone = (options.telephone ?? config.contact?.phone ?? "+61 488 222 137").replace(/\s+/g, " ")
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    name: config.brand?.name ?? "Financial Trauma Therapist",
    url: SITE_URL,
    image: absoluteUrl(config.seo?.ogImage ?? config.brand?.logoUrl ?? DEFAULT_OG_IMAGE),
    telephone,
    address: { ...DEFAULT_BUSINESS_ADDRESS, ...(options.address ?? {}) },
    areaServed: ["Melbourne", "Victoria", "Australia"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "19:00",
      },
    ],
    knowsAbout: [
      "financial abuse",
      "economic abuse",
      "mental health",
      "therapy",
      "counselling",
      "monetary psychotherapy",
    ],
    sameAs: getSocialProfiles(config),
  }
}

type PersonSchemaOptions = {
  name: string
  description: string
  jobTitle?: string
  image?: string
  url?: string
  telephone?: string
  sameAs?: string[]
}

export function buildPersonSchema(config: SiteConfig, options: PersonSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: options.name,
    jobTitle: options.jobTitle ?? "Counsellor",
    description: options.description,
    url: absoluteUrl(options.url ?? "/"),
    image: options.image ? absoluteUrl(options.image) : undefined,
    telephone: options.telephone,
    worksFor: {
      "@type": "Organization",
      name: config.brand?.name ?? "Financial Trauma Therapist",
      url: SITE_URL,
    },
    sameAs: options.sameAs ?? getSocialProfiles(config),
  }
}

type VideoSchemaOptions = {
  title: string
  description: string
  slug: string
  uploadDate: string
  thumbnailUrl?: string
  contentUrl?: string
  embedUrl?: string
}

export function buildVideoSchema(options: VideoSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: options.title,
    description: options.description,
    uploadDate: options.uploadDate,
    thumbnailUrl: options.thumbnailUrl ? absoluteUrl(options.thumbnailUrl) : undefined,
    contentUrl: options.contentUrl ? absoluteUrl(options.contentUrl) : undefined,
    embedUrl: options.embedUrl ?? absoluteUrl(`/vlog/${options.slug}`),
  }
}

type BreadcrumbItem = {
  name: string
  url: string
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  }
}

