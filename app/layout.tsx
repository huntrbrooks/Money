import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { readSiteConfig } from "@/lib/config"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Financial Trauma & Monetary Psychotherapy | The Financial Therapist — Dan Lobel",
  description:
    "Trauma‑informed counselling in Melbourne focused on financial trauma, economic abuse recovery, money anxiety and monetary psychotherapy. Safe, gender‑aware and inclusive care.",
  keywords: [
    "financial trauma therapy Melbourne",
    "money and mental health counselling",
    "monetary psychotherapy",
    "economic abuse counselling",
    "women's counselling Melbourne",
    "money anxiety therapy",
  ],
  generator: "v0.app",
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
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#20385B" />
        <link rel="manifest" href="/site.webmanifest" />
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
