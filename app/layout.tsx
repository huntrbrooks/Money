import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { readSiteConfig, defaultConfig } from "@/lib/config"
import { SITE_URL } from "@/lib/urls"
import { AnalyticsScripts } from "@/components/analytics-scripts"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Financial Abuse Counselling Melbourne | Dan Lobel",
    template: "%s | Financial Trauma Therapist",
  },
  description:
    "Trauma-informed counselling for financial abuse and money anxiety. Confidential support in Melbourne plus telehealth. Book a consultation with Dan Lobel.",
  keywords: [
    "financial abuse",
    "financial abuse therapy",
    "financial abuse therapist",
    "financial trauma therapy Melbourne",
    "monetary psychotherapy",
    "economic abuse counselling",
    "women's counselling Melbourne",
    "money anxiety therapy",
  ],
  generator: "nextjs",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Financial Abuse Counselling Melbourne | Dan Lobel",
    description:
      "Trauma-informed counselling for financial abuse and money anxiety. Confidential support in Melbourne plus telehealth. Book a consultation with Dan Lobel.",
    siteName: "Financial Trauma Therapist",
    locale: "en_AU",
    images: [{ url: "/og.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Financial Abuse Counselling Melbourne | Dan Lobel",
    description:
      "Trauma-informed counselling for financial abuse and money anxiety. Confidential support in Melbourne plus telehealth. Book a consultation with Dan Lobel.",
    images: ["/og.jpg"],
  },
  robots: {
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
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: SITE_URL,
      "en-AU": SITE_URL,
    },
  },
  icons: {
    icon: [
      { url: "/favicon_io/favicon.ico" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon_io/favicon.ico" }],
    apple: [{ url: "/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg" }],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let config
  try {
    config = await readSiteConfig()
  } catch (error) {
    // During static generation, DYNAMIC_SERVER_USAGE errors are expected and can be ignored
    // They just mean the route will be dynamically rendered (which is correct)
    if (error && typeof error === 'object' && 'digest' in error && error.digest === 'DYNAMIC_SERVER_USAGE') {
      // This is expected during build - route will be dynamic, use default config
      config = defaultConfig
    } else {
      // Real error - log it
      console.error("Failed to load site config:", error)
      config = defaultConfig
    }
  }
  const themeCss = `
    :root {
      --primary: ${config.theme.primary};
      --secondary: ${config.theme.secondary};
      --accent: ${config.theme.accent};
      --background: ${config.theme.background};
      --foreground: ${config.theme.foreground};
      --radius: ${config.theme.radius};
      ${config.theme.fontSans ? `--font-sans: ${config.theme.fontSans};` : ""}
      ${config.theme.fontSerif ? `--font-serif: ${config.theme.fontSerif};` : ""}
    }
  `
  const htmlClass = config.theme.mode === "dark" ? "dark" : ""
  return (
    <html lang="en" className={htmlClass}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content={config.theme.background} />
        <meta httpEquiv="content-language" content="en-AU" />
        <meta name="geo.region" content="AU-VIC" />
        <meta name="geo.placename" content="Melbourne" />
        <link rel="icon" href="/favicon_io/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#20385B" />
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
        <AnalyticsScripts />
      </body>
    </html>
  )
}
