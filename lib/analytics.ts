export type AnalyticsConfig = {
  gaId?: string
  metaPixelId?: string
  linkedinId?: string
  googleAdsId?: string
  googleAdsConversionLabel?: string
}

export function getAnalyticsConfig(): AnalyticsConfig {
  return {
    gaId: process.env.NEXT_PUBLIC_GA_ID,
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    linkedinId: process.env.NEXT_PUBLIC_LINKEDIN_TAG_ID,
    googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
    googleAdsConversionLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL,
  }
}














