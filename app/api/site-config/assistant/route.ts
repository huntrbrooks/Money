import { NextResponse } from "next/server"
import { readSiteConfig, writeSiteConfig, type SiteConfig } from "@/lib/config"
import { cookies } from "next/headers"
import { AUTH_COOKIE_NAME, getEnvVar, verifyAuthToken } from "@/lib/auth"

export const runtime = "nodejs"

function parseColor(input: string): string | null {
  const hex = input.match(/#([0-9a-f]{3,8})/i)?.[0]
  if (hex) return hex
  const named = input.match(/\b(black|white|red|green|blue|royalblue|navy|teal|olive|purple|gray|grey|pink|orange|gold|cyan)\b/i)?.[0]
  return named ?? null
}

function applyCommands(input: string, cfg: SiteConfig): SiteConfig {
  const text = input.toLowerCase()
  // theme primary color
  if (/primary color|primary to/.test(text)) {
    const col = parseColor(input)
    if (col) cfg.theme.primary = col
  }
  if (/secondary color|secondary to/.test(text)) {
    const col = parseColor(input)
    if (col) cfg.theme.secondary = col
  }
  if (/accent color|accent to/.test(text)) {
    const col = parseColor(input)
    if (col) cfg.theme.accent = col
  }
  if (/background color|background to/.test(text)) {
    const col = parseColor(input)
    if (col) cfg.theme.background = col
  }
  if (/foreground color|headings? color|text color/.test(text)) {
    const col = parseColor(input)
    if (col) cfg.theme.foreground = col
  }
  if (/\bdark mode\b|\benable dark\b/.test(text)) {
    cfg.theme.mode = "dark"
  }
  if (/\blight mode\b|\bdisable dark\b/.test(text)) {
    cfg.theme.mode = "light"
  }
  const radiusMatch = input.match(/radius\s*(to|=)?\s*([0-9.]+)\s*(px|rem|em)?/i)
  if (radiusMatch) {
    const val = `${radiusMatch[2]}${radiusMatch[3] ?? "px"}`
    cfg.theme.radius = val
  }
  const fontSans = input.match(/sans(?:[\s-]?font)?\s*(to|=)?\s*"?([^"]+)"?/i)
  if (fontSans) {
    cfg.theme.fontSans = fontSans[2]
  }
  const fontSerif = input.match(/serif(?:[\s-]?font)?\s*(to|=)?\s*"?([^"]+)"?/i)
  if (fontSerif) {
    cfg.theme.fontSerif = fontSerif[2]
  }
  // hero
  const heroTitle = input.match(/hero title\s*(to|=)\s*"?([^"]+)"?/i)
  if (heroTitle) cfg.hero.title = heroTitle[2]
  const heroSubtitle = input.match(/hero subtitle\s*(to|=)\s*"?([^"]+)"?/i)
  if (heroSubtitle) cfg.hero.subtitle = heroSubtitle[2]
  const heroDesc = input.match(/hero (desc|description)\s*(to|=)\s*"?([^"]+)"?/i)
  if (heroDesc) cfg.hero.description = heroDesc[3]
  const heroImg = input.match(/hero image\s*(to|=)\s*(https?:[^\s"']+)/i)
  if (heroImg) cfg.hero.imageUrl = heroImg[2]
  // about
  const aboutTitle = input.match(/about title\s*(to|=)\s*"?([^"]+)"?/i)
  if (aboutTitle) cfg.about.title = aboutTitle[2]
  // add service
  const addService = input.match(/add service\s*"?([^"|]+)"?\s*(?:price\s*([$A-Za-z0-9 .:/-]+))?/i)
  if (addService) {
    cfg.services = cfg.services ?? []
    cfg.services.push({ id: Math.random().toString(36).slice(2), name: addService[1].trim(), price: (addService[2] ?? "$0").trim() })
  }
  // contact
  const phone = input.match(/phone\s*(to|=)\s*([0-9 +()-]{6,})/i)
  if (phone) cfg.contact = { ...(cfg.contact ?? {}), phone: phone[2].trim() }
  const email = input.match(/email\s*(to|=)\s*([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i)
  if (email) cfg.contact = { ...(cfg.contact ?? {}), email: email[2] }
  // navigation add/remove
  const addNav = input.match(/add nav link\s*"?([^"|]+)"?\s*(?:to|=)?\s*(\/[\w#-/]+)/i)
  if (addNav) {
    cfg.navigation = cfg.navigation ?? []
    cfg.navigation.push({ label: addNav[1].trim(), href: addNav[2] })
  }
  const removeNav = input.match(/remove nav link\s*"?([^"|]+)"?/i)
  if (removeNav && cfg.navigation) {
    cfg.navigation = cfg.navigation.filter((l) => l.label.toLowerCase() !== removeNav[1].trim().toLowerCase())
  }
  // seo
  const seoTitle = input.match(/seo title\s*(to|=)\s*"?([^"]+)"?/i)
  if (seoTitle) cfg.seo = { ...(cfg.seo ?? {}), title: seoTitle[2] }
  const seoDesc = input.match(/seo desc(?:ription)?\s*(to|=)\s*"?([^"]+)"?/i)
  if (seoDesc) cfg.seo = { ...(cfg.seo ?? {}), description: seoDesc[2] }
  const og = input.match(/og image\s*(to|=)\s*(https?:[^\s"']+)/i)
  if (og) cfg.seo = { ...(cfg.seo ?? {}), ogImage: og[2] }
  return cfg
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const JWT_SECRET = getEnvVar("JWT_SECRET", "dev-secret-change")
  const payload = token ? await verifyAuthToken(token, JWT_SECRET) : null
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = (await request.json().catch(() => null)) as { input?: string } | null
  if (!body?.input) return NextResponse.json({ error: "Missing input" }, { status: 400 })
  const cfg = await readSiteConfig()
  const updated = applyCommands(body.input, cfg)
  await writeSiteConfig(updated)
  return NextResponse.json({ ok: true, config: updated })
}


