import { readSiteConfig, defaultConfig } from "@/lib/config"

export default async function Head() {
  let config
  try {
    config = await readSiteConfig()
  } catch (error) {
    // During static generation, DYNAMIC_SERVER_USAGE errors are expected and can be ignored
    // They just mean the route will be dynamically rendered (which is correct)
    if (error && typeof error === "object" && "digest" in error && error.digest === "DYNAMIC_SERVER_USAGE") {
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

  return (
    <>
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
    </>
  )
}
