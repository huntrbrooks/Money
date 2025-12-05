export type AnalyticsConfig = {
  gaId?: string
  metaPixelId?: string
  linkedinId?: string
}

export function getAnalyticsConfig(): AnalyticsConfig {
  return {
    gaId: process.env.NEXT_PUBLIC_GA_ID,
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    linkedinId: process.env.NEXT_PUBLIC_LINKEDIN_TAG_ID,
  }
}




