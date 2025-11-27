import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { readSiteConfig } from "@/lib/config"
import { SITE_URL } from "@/lib/seo"
import { AnalyticsScripts } from "@/components/analytics-scripts"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Financial Abuse Therapist | Financial Trauma & Monetary Psychotherapy — Dan Lobel",
    template: "%s | Financial Abuse Therapist",
  },
  description:
    "Trauma‑informed counselling in Melbourne focused on financial abuse recovery, financial trauma, money anxiety and monetary psychotherapy. Safe, gender‑aware and inclusive care.",
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
    title: "Financial Abuse Therapist | Financial Trauma & Monetary Psychotherapy — Dan Lobel",
    description:
      "Trauma‑informed counselling in Melbourne focused on financial abuse recovery, financial trauma, money anxiety and monetary psychotherapy.",
    siteName: "The Financial Therapist",
    locale: "en_AU",
    images: [{ url: "/og.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Financial Abuse Therapist | Financial Trauma & Monetary Psychotherapy",
    description:
      "Trauma‑informed counselling for financial abuse, economic abuse recovery, and money anxiety.",
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
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg" }],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const config = await readSiteConfig()
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
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#20385B" />
        <link rel="manifest" href="/site.webmanifest" />
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
