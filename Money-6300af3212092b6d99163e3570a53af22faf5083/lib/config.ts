import { promises as fs } from "fs"
import path from "path"

export type ServiceItem = {
  id: string
  name: string
  price: string
}

export type ConsultationOption = {
  format: string
  price: string
  duration: string
}

export type NavLink = {
  label: string
  href: string
}

export type CrisisResource = {
  name: string
  number: string
  website?: string
  description?: string
  logoUrl?: string
  logoHeight?: number
}

export type FormsConfig = {
  enquiry?: string
  consent?: string
  intake?: string
}

export type SiteConfig = {
  theme: {
    mode: "light" | "dark"
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    radius: string
    fontSans?: string
    fontSerif?: string
  }
  seo?: {
    title?: string
    description?: string
    ogImage?: string
  }
  brand?: {
    name: string
    subtitle?: string
    tagline?: string
    logoUrl?: string
    headerBannerUrl?: string
  }
  navigation?: NavLink[]
  contact?: {
    phone?: string
    email?: string
  }
  hero: {
    title: string
    subtitle: string
    description: string
    imageUrl: string
  }
  about: {
    title: string
    paragraphs: string[]
  }
  services: ServiceItem[]
  consultations?: ConsultationOption[]
  resources?: CrisisResource[]
  forms?: FormsConfig
}

const CONFIG_FILE_PATH = path.join(process.cwd(), "data", "site.json")

export const defaultConfig: SiteConfig = {
  theme: {
    mode: "light",
    primary: "#6CA4AC",
    secondary: "#E5EED2",
    accent: "#929D5B",
    background: "#FFFFFF",
    foreground: "#20385B",
    radius: "0.5rem",
    fontSans: "\"Geist\", system-ui, -apple-system, Segoe UI, Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", \"Liberation Sans\", sans-serif",
    fontSerif: "\"Cormorant Garamond\", Georgia, serif",
  },
  seo: {
    title: "Finacial Abuse Therapist | Dan Lobel",
    description: "Professional counselling services in Melbourne. Specialising in grief, trauma, anxiety, depression, and relationship therapy.",
    ogImage: "/placeholder.jpg",
  },
  brand: {
    name: "Finacial Abuse Therapist",
    subtitle: "Dan Lobel",
    tagline: "Trauma‑informed care with safety, dignity and choice.",
    logoUrl: "/placeholder-logo.svg",
    headerBannerUrl: undefined,
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Contact", href: "/#contact" },
  ],
  contact: {
    phone: "0467 477 786",
    email: "dan@financialabusetherapist.com",
  },
  hero: {
    title: "The guided solo journey with practitioner",
    subtitle: "Dan Lobel",
    description:
      "D.Couns., B.Couns., MCouns&Psych",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1469a-0Ivt3omzLN4pdHB0y2lffT6PoXhJwA.webp",
  },
  about: {
    title: "Contemporary Integrative Counselling",
    paragraphs: [
      "Dan's contemporary integrative counselling employs a comprehensive, evidence-based approach to therapy, integrating various therapeutic modalities to adapt to each client's unique needs and circumstances.",
      "With a person-centered, intuitive approach, Dan places great focus on candid communication accompanied by acute empathy and profound awareness of people. He promotes the importance of expressing feelings, fostering personal growth, and addressing issues realistically, whilst always prioritising mental health and wellbeing.",
    ],
  },
  services: [
    { id: "1", name: "Grief Therapy", price: "$150" },
    { id: "2", name: "Trauma Therapy", price: "$150" },
    { id: "3", name: "Monetary Psychotherapy", price: "$150" },
    { id: "4", name: "Stress Management Therapy", price: "$150" },
    { id: "5", name: "Anxiety & Depression Counselling", price: "$150" },
  ],
  consultations: [
    { format: "Telehealth Video", price: "$150", duration: "60 min" },
    { format: "In-Person (Office)", price: "$150", duration: "60 min" },
    { format: "Home Visit", price: "$180", duration: "60 min" },
    { format: "Walk & Discuss", price: "$160", duration: "60 min" },
    { format: "Extended Session", price: "$270", duration: "90 min" },
  ],
  resources: [
    {
      name: "Lifeline",
      number: "13 11 14",
      website: "https://www.lifeline.org.au",
      description: "24/7 crisis support and suicide prevention services across Australia.",
      logoUrl: "/Lifeline.webp",
      logoHeight: 80
    },
    {
      name: "Suicide Call Back Service",
      number: "1300 659 467",
      website: "https://www.suicidecallbackservice.org.au",
      description: "24/7 nationwide service offering free professional phone and online counselling for people affected by suicide.",
      logoUrl: "/suicide%20services%20call%20back.webp"
    },
    {
      name: "Beyond Blue",
      number: "1300 22 4636",
      website: "https://www.beyondblue.org.au",
      description: "Support, advice and action for anxiety, depression and suicide prevention.",
      logoUrl: "/beyond%20blue.webp"
    },
    {
      name: "MensLine Australia",
      number: "1300 78 99 78",
      website: "https://mensline.org.au",
      description: "24/7 counselling, information and referrals for men with family and relationship concerns.",
      logoUrl: "/mensline.webp"
    },
    {
      name: "Kids Helpline",
      number: "1800 55 1800",
      website: "https://kidshelpline.com.au",
      description: "24/7 phone and online counselling for young people aged 5–25.",
      logoUrl: "/Kids%20helpline.webp"
    },
    {
      name: "QLife",
      number: "1800 184 527",
      website: "https://qlife.org.au",
      description: "Australia‑wide anonymous LGBTIQ+ peer support and referral service.",
      logoUrl: "/Qlife.webp"
    },
  ],
  forms: {
    enquiry: "",
    consent: "",
    intake: "",
  },
}

async function ensureDir(filePath: string) {
  const dir = path.dirname(filePath)
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch {
    // ignore
  }
}

export async function readSiteConfig(): Promise<SiteConfig> {
  try {
    const raw = await fs.readFile(CONFIG_FILE_PATH, "utf8")
    const parsed = JSON.parse(raw)
    return {
      ...defaultConfig,
      ...parsed,
      theme: { ...defaultConfig.theme, ...(parsed.theme ?? {}) },
      seo: { ...defaultConfig.seo, ...(parsed.seo ?? {}) },
      brand: { ...defaultConfig.brand, ...(parsed.brand ?? {}) },
      navigation: parsed.navigation ?? defaultConfig.navigation,
      contact: { ...defaultConfig.contact, ...(parsed.contact ?? {}) },
      hero: { ...defaultConfig.hero, ...(parsed.hero ?? {}) },
      about: { ...defaultConfig.about, ...(parsed.about ?? {}) },
      services: parsed.services ?? defaultConfig.services,
      consultations: parsed.consultations ?? defaultConfig.consultations,
      resources: parsed.resources ?? defaultConfig.resources,
      forms: { ...(defaultConfig.forms ?? {}), ...(parsed.forms ?? {}) },
    }
  } catch {
    await ensureDir(CONFIG_FILE_PATH)
    await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(defaultConfig, null, 2), "utf8")
    return defaultConfig
  }
}

export async function writeSiteConfig(newConfig: SiteConfig): Promise<void> {
  await ensureDir(CONFIG_FILE_PATH)
  const mergedBrand: NonNullable<SiteConfig["brand"]> = {
    name: newConfig.brand?.name ?? defaultConfig.brand!.name,
    subtitle: newConfig.brand?.subtitle ?? defaultConfig.brand!.subtitle,
    tagline: newConfig.brand?.tagline ?? defaultConfig.brand!.tagline,
    logoUrl: newConfig.brand?.logoUrl ?? defaultConfig.brand!.logoUrl,
    headerBannerUrl: newConfig.brand?.headerBannerUrl ?? defaultConfig.brand!.headerBannerUrl,
  }
  const merged: SiteConfig = {
    ...defaultConfig,
    ...newConfig,
    theme: { ...defaultConfig.theme, ...newConfig.theme },
    seo: { ...defaultConfig.seo, ...(newConfig.seo ?? {}) },
    brand: mergedBrand,
    navigation: newConfig.navigation ?? defaultConfig.navigation,
    contact: { ...defaultConfig.contact, ...(newConfig.contact ?? {}) },
    hero: { ...defaultConfig.hero, ...newConfig.hero },
    about: { ...defaultConfig.about, ...newConfig.about },
    services: newConfig.services ?? defaultConfig.services,
    consultations: newConfig.consultations ?? defaultConfig.consultations,
    resources: newConfig.resources ?? defaultConfig.resources,
    forms: { ...(defaultConfig.forms ?? {}), ...(newConfig.forms ?? {}) },
  }
  await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(merged, null, 2), "utf8")
}


