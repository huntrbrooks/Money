import { promises as fs } from "fs"
import path from "path"
import { hasSupabase, sbGetSiteConfigJson, sbInsertSiteConfigVersion, sbUpsertSiteConfigJson } from "@/lib/supabase-rest"
import { unstable_noStore as noStore } from "next/cache"

export type HeroButton = {
  label: string
  href: string
}

export type HeroStat = {
  label: string
  value: string
  description?: string
}

export type ServiceItem = {
  id: string
  name: string
  price: string
}

export type ConsultationOption = {
  format: string
  price: string
  duration: string
  mode?: string
  location?: string
  description?: string
  typeId?: number
  highlight?: string
  paymentNote?: string
}

export type NavLink = {
  label: string
  href: string
}

export type SocialLinks = {
  facebook?: string
  instagram?: string
  linkedin?: string
}

export type LegalPageConfig = {
  title?: string
  // Stored as MDX/Markdown (rendered server-side). Keep this lightweight and text-only.
  bodyMdx?: string
  // Optional downloadable document (e.g. docx/pdf). This should be a public URL or `/api/assets/...`.
  downloadUrl?: string
}

export type LegalConfig = {
  privacy?: LegalPageConfig
  terms?: LegalPageConfig
}

export type ClientCareConfig = {
  downloads?: NavLink[]
  prepChecklist?: string[]
  aftercareChecklist?: string[]
}

export type BookingCopyItem = {
  title: string
  detail: string
}

export type BookingCopy = {
  billingHighlights?: BookingCopyItem[]
  paymentSupport?: BookingCopyItem[]
  schedulerPoints?: string[]
  schedulerHelpText?: string
}

export type CrisisResource = {
  name: string
  number: string
  website?: string
  description?: string
  logoUrl?: string
  logoHeight?: number
}

const LOCKED_CAROUSEL_RESOURCES: Array<Pick<CrisisResource, "name" | "number">> = [
  { name: "Lifeline", number: "13 11 14" },
  { name: "Suicide CallBack Service", number: "1300 659 467" },
  { name: "Beyond Blue", number: "1300 224 636" },
  { name: "1800 Respect", number: "1800 732 732" },
  { name: "Medicare Mental Health", number: "1800 595 212" },
  { name: "Headspace", number: "1800 650 890" },
  { name: "Butterfly National Helpline", number: "1800 334 673" },
  { name: "Blue Knot Foundation", number: "1300 657 380" },
]

function normalizeKey(input: string): string {
  return String(input ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim()
}

export function normalizeCarouselResources(resources: CrisisResource[] | undefined | null): CrisisResource[] {
  const arr = Array.isArray(resources) ? resources : []
  const byKey = new Map<string, CrisisResource>()
  for (const r of arr) {
    if (!r?.name) continue
    byKey.set(normalizeKey(r.name), r)
  }
  // Also accept legacy naming variations (spaces/hyphens/case).
  const get = (name: string) => byKey.get(normalizeKey(name))
  return LOCKED_CAROUSEL_RESOURCES.map((locked) => {
    const match =
      get(locked.name) ??
      // common legacy variant:
      (normalizeKey(locked.name) === normalizeKey("Suicide CallBack Service") ? get("Suicide Call Back Service") : undefined)
    return {
      ...match,
      name: locked.name,
      number: match?.number ?? locked.number,
    }
  })
}

export type FormsConfig = {
  enquiry?: string
  consent?: string
  intake?: string
}

export type ValueProp = {
  title: string
  description: string
}

export type Testimonial = {
  quote: string
  author: string
  context?: string
}

export type FaqEntry = {
  question: string
  answer: string
}

export type LeadMagnetContent = {
  heading: string
  body: string
  ctaLabel: string
  ctaHref: string
  helper?: string
}

export type HomepageSectionToggles = {
  showValueProps?: boolean
  showNewsletter?: boolean
  showImportantLinks?: boolean
  showTestimonials?: boolean
  showOtherAreas?: boolean
  showBooking?: boolean
  showFaqs?: boolean
  showContact?: boolean
  showCrisis?: boolean
  showLeadMagnet?: boolean
}

export type HomepageCopy = {
  valuePropsEyebrow?: string
  valuePropsHeading?: string

  newsletterEyebrow?: string
  newsletterHeading?: string
  newsletterBody?: string
  newsletterCtaLabel?: string
  newsletterTags?: string[]

  importantLinksHeading?: string
  importantLinksSubheading?: string

  testimonialsEyebrow?: string
  testimonialsHeading?: string

  otherAreasHeading?: string
  otherAreasSubheading?: string

  bookingHeading?: string
  bookingSubheading?: string

  faqsEyebrow?: string
  faqsHeading?: string

  contactHeading?: string
  contactBody?: string

  crisisHeading?: string
  crisisBody?: string
  crisisNote?: string
}

export type OtherAreaCard = {
  title: string
  summary: string
  more: string
}

export type HomepageContent = {
  sections?: HomepageSectionToggles
  copy?: HomepageCopy
  otherAreas?: OtherAreaCard[]
  importantLinks?: {
    // Row 3 (navy) in the Important Links section on the homepage.
    blogLinks?: NavLink[]
    // Row 5 (navy) in the Important Links section on the homepage.
    specialistLinks?: NavLink[]
  }
  importantSectionLinks?: NavLink[]
  valueProps?: ValueProp[]
  testimonials?: Testimonial[]
  faqs?: FaqEntry[]
  leadMagnet?: LeadMagnetContent
}

export type ExperimentsConfig = {
  showNewsletterSection?: boolean
  showLeadMagnet?: boolean
}

export type SiteConfig = {
  meta?: {
    version: number
    updatedAt: string
  }
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
    emailAlt?: string
  }
  hero: {
    eyebrow?: string
    title: string
    subtitle: string
    description: string
    imageUrl: string
    primaryCta?: HeroButton
    secondaryCta?: HeroButton
    stats?: HeroStat[]
  }
  about: {
    title: string
    paragraphs: string[]
  }
  services: ServiceItem[]
  consultations?: ConsultationOption[]
  resources?: CrisisResource[]
  forms?: FormsConfig
  homepage?: HomepageContent
  experiments?: ExperimentsConfig
  social?: SocialLinks
  legal?: LegalConfig
  clientCare?: ClientCareConfig
  bookingCopy?: BookingCopy
}

const CONFIG_FILE_PATH = path.join(process.cwd(), "data", "site.json")

export const defaultConfig: SiteConfig = {
  meta: {
    version: 1,
    updatedAt: new Date().toISOString(),
  },
  theme: {
    mode: "light",
    primary: "#6CA4AC",
    secondary: "#E5EED2",
    accent: "#929D5B",
    background: "#E5EED2",
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
    { label: "About", href: "/about" },
    { label: "Services", href: "/#services" },
    { label: "Contact", href: "/#contact" },
  ],
  contact: {
    phone: "0467 477 786",
    email: "dan@financialabusetherapist.com.au",
    emailAlt: "dan@financialabusetherapist.com",
  },
  social: {
    facebook: "https://www.facebook.com/the.melbourne.counsellor/",
    instagram: "https://www.instagram.com/the.melbourne.counsellor/#",
    linkedin: "https://www.linkedin.com/in/dan-lobel-the-melbourne.counsellor-769b61204/",
  },
  legal: {
    privacy: {
      title: "Privacy Policy",
      downloadUrl: "/Privacy%20Policy.docx",
      bodyMdx: "",
    },
    terms: {
      title: "Terms of Service",
      downloadUrl: "/Terms%20of%20Service.docx",
      bodyMdx: "",
    },
  },
  clientCare: {
    downloads: [
      { label: "Consent & Policies", href: "/consent" },
      { label: "Enquiry Form", href: "/enquiry" },
      { label: "Intake Form", href: "/intake" },
      { label: "Financial Safety Check-in", href: "/newsletter" },
    ],
    prepChecklist: [
      "Find a private, comfortable space and something grounding to hold.",
      "Take 90 seconds to notice your breathing and name one intention for the session.",
      "Have a glass of water, journal, or tissues nearby.",
    ],
    aftercareChecklist: [
      "Give yourself at least 10 minutes before diving into work or caretaking.",
      "Drink water, have a snack, and if possible step outside for fresh air.",
      "Note one insight or feeling you’d like to revisit next session.",
    ],
  },
  bookingCopy: {
    billingHighlights: [
      { title: "Transparent billing", detail: "Fees listed are inclusive of GST with no surprise surcharges." },
      { title: "Secure payment", detail: "Pre-payment is processed by Square with bank-level encryption." },
      { title: "Flexible rescheduling", detail: "Need to adjust your time? Reach out with 72 hours notice to rebook." },
    ],
    paymentSupport: [
      { title: "Cards & wallets", detail: "Visa, Mastercard, AMEX, Apple Pay and Google Pay are accepted." },
      { title: "Invoices available", detail: "Detailed receipts can be provided for reimbursement claims." },
    ],
    schedulerPoints: [
      "Fees shown above already include GST and reflect the exact session length.",
      "Payments are captured through Square inside the secure Acuity portal.",
      "Need to reschedule? Reach out with 72 hours notice and we’ll arrange a new time.",
    ],
    schedulerHelpText: "Need help deciding on a format? Email or call — a personal reply is guaranteed.",
  },
  hero: {
    eyebrow: "Financial Trauma & Monetary Psychotherapy",
    title: "The guided solo journey with practitioner",
    subtitle: "Dan Lobel",
    description:
      "D.Couns., B.Couns., MCouns&Psych",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1469a-0Ivt3omzLN4pdHB0y2lffT6PoXhJwA.webp",
    primaryCta: { label: "Book a Session", href: "/#book" },
    secondaryCta: { label: "Learn More", href: "/monetary-psychotherapy" },
    stats: [
      { label: "Sessions held", value: "1,200+" },
      { label: "Years in practice", value: "10+" },
      { label: "Client satisfaction", value: "4.9/5" },
    ],
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
      logoHeight: 80,
    },
    {
      name: "Suicide CallBack Service",
      number: "1300 659 467",
      website: "https://www.suicidecallbackservice.org.au",
      description: "24/7 nationwide service offering free professional phone and online counselling for people affected by suicide.",
      logoUrl: "/suicide%20services%20call%20back.webp",
    },
    {
      name: "Beyond Blue",
      number: "1300 224 636",
      website: "https://www.beyondblue.org.au",
      description: "Support, advice and action for anxiety, depression and suicide prevention.",
      logoUrl: "/beyond%20blue.webp",
    },
    { name: "1800 Respect", number: "1800 732 732", website: "https://1800respect.org.au", description: "", logoUrl: "" },
    {
      name: "Medicare Mental Health",
      number: "1800 595 212",
      website: "https://www.healthdirect.gov.au/mental-health-helplines",
      description: "",
      logoUrl: "",
    },
    { name: "Headspace", number: "1800 650 890", website: "https://headspace.org.au", description: "", logoUrl: "" },
    {
      name: "Butterfly National Helpline",
      number: "1800 334 673",
      website: "https://butterfly.org.au",
      description: "",
      logoUrl: "",
    },
    {
      name: "Blue Knot Foundation",
      number: "1300 657 380",
      website: "https://blueknot.org.au",
      description: "",
      logoUrl: "",
    },
  ],
  forms: {
    enquiry: "",
    consent: "",
    intake: "",
  },
  homepage: {
    sections: {
      showValueProps: true,
      showNewsletter: true,
      showImportantLinks: true,
      showTestimonials: false,
      showOtherAreas: true,
      showBooking: true,
      showFaqs: true,
      showContact: true,
      showCrisis: true,
      // The bottom-right lead magnet popup should be opt-in (off by default).
      showLeadMagnet: false,
    },
    copy: {
      valuePropsEyebrow: "What to expect",
      valuePropsHeading: "Therapy that honours your nervous system",

      newsletterEyebrow: "Between sessions",
      newsletterHeading: "Download the 5-step Financial Safety Check-in",
      newsletterBody:
        "A gentle ritual used in session to settle your system before money admin — delivered straight to your inbox.",
      newsletterCtaLabel: "Email me the check-in",
      newsletterTags: ["newsletter", "safety-check-in"],

      importantLinksHeading: "Important Links",
      importantLinksSubheading: "Quick access to key information",

      testimonialsEyebrow: "Gentle proof",
      testimonialsHeading: "Reflections from clients",

      otherAreasHeading: "Other Areas of Specialisation",
      otherAreasSubheading: "Short, digestible overviews with the option to read more",

      bookingHeading: "Book a Confidential Consultation",
      bookingSubheading: "Choose the appointment style that feels safest, then confirm via the secure scheduler.",

      faqsEyebrow: "FAQ",
      faqsHeading: "Questions clients ask before booking",

      contactHeading: "When you're ready, I'm here.",
      contactBody:
        "Reach out to schedule an initial consultation or to ask questions. Your privacy, boundaries, and pace are respected at every step.",

      crisisHeading: "If you’re in crisis or need immediate support, please reach out.",
      crisisBody: "You are not alone — help is available 24/7.",
      crisisNote: "If you or someone you know is in crisis and needs help now, call triple zero (000).",
    },
    importantLinks: {
      blogLinks: [
        { label: "Why Money Triggers Anxiety", href: "/blog/why-money-triggers-anxiety" },
        { label: "Financial Abuse and Emotional Healing", href: "/blog/financial-abuse-and-emotional-healing" },
        { label: "The Psychology Behind Spending Habits", href: "/blog/the-psychology-behind-spending-habits" },
      ],
      specialistLinks: [
        { label: "Financial Abuse", href: "/financial-abuse" },
        { label: "Financial Abuse Therapy", href: "/financial-abuse-therapy" },
        { label: "Financial Abuse Therapist", href: "/financial-abuse-therapist" },
      ],
    },
    importantSectionLinks: [
      { label: "About Dan", href: "/about" },
      { label: "Monetary Psychotherapy", href: "/monetary-psychotherapy" },
      { label: "Integrative Counselling", href: "/contemporary-integrative-counselling" },
    ],
    otherAreas: [
      {
        title: "Grief Therapy",
        summary: "Gentle support for loss, meaning-making, and navigating the waves of grief.",
        more: "Space to honour your loss, hold ambivalence, and rebuild a relationship with life at your pace.",
      },
      {
        title: "Trauma Therapy",
        summary: "Trauma‑informed care prioritising safety, pacing, and consent.",
        more: "We work collaboratively with your nervous system to build stability, choice, and self‑trust.",
      },
      {
        title: "Stress Management",
        summary: "Reduce overwhelm with practical tools and compassionate awareness.",
        more: "Learn regulation skills, boundary‑setting, and restore a grounded sense of capability.",
      },
      {
        title: "Anxiety & Depression",
        summary: "Warm, evidence‑informed support to ease anxiety and low mood.",
        more: "Understand patterns, reduce shame, and build steadier day‑to‑day foundations.",
      },
      {
        title: "Family & Relationships",
        summary: "Navigate dynamics, roles, and boundaries with clarity and care.",
        more: "Strengthen communication, repair trust, and honour your needs in connection.",
      },
      {
        title: "Guardianship & Caregiving",
        summary: "Support for the emotional weight of responsibility and change.",
        more: "Make space for grief, fatigue, identity shifts, and sustainable care.",
      },
      {
        title: "Social Isolation & Loneliness",
        summary: "Compassionate support when life feels disconnected or small.",
        more: "Rebuild belonging, confidence, and meaningful connection, one step at a time.",
      },
      {
        title: "LGBTQIA+ Therapy",
        summary: "Inclusive, affirming counselling for identity, relationships, and safety.",
        more: "A non‑judgemental space that respects every part of who you are.",
      },
    ],
    valueProps: [
      {
        title: "Consent-led therapy",
        description: "Every session is paced by your nervous system. No pressure, just steady co-regulation.",
      },
      {
        title: "Financial clarity + emotional care",
        description: "We pair nervous-system safety with practical next steps so money decisions feel grounded.",
      },
      {
        title: "Support beyond the session",
        description: "Access worksheets, email check-ins, and referrals that keep momentum between appointments.",
      },
    ],
    testimonials: [
      {
        quote: "Dan’s presence is calm and respectful. I learned to listen to my body and make money decisions that honour my values.",
        author: "Amelia",
        context: "Telehealth Client",
      },
      {
        quote: "I felt safe naming money shame for the first time. The pace was gentle and honouring.",
        author: "Priya",
        context: "Melbourne",
      },
      {
        quote: "Sessions helped me rebuild self-trust. I’m making decisions from care, not fear.",
        author: "Grace",
        context: "In-person Client",
      },
    ],
    faqs: [
      {
        question: "Do I need to prepare financial documents?",
        answer:
          "No. We focus on how money feels in your body and relationships. Bring numbers only if it feels helpful.",
      },
      {
        question: "Is this therapy suitable if I’m still in an unsafe situation?",
        answer:
          "Yes. We prioritise safety and work collaboratively with any existing support services or trusted contacts.",
      },
      {
        question: "Can I start with Telehealth before meeting in person?",
        answer: "Absolutely. Many clients begin online and shift to in-person once they feel ready.",
      },
    ],
    leadMagnet: {
      heading: "Need a gentle starting point?",
      body: "Download the 5-step Financial Safety Check-in used in session to calm your nervous system before money tasks.",
      ctaLabel: "Get the check-in",
      ctaHref: "/enquiry",
      helper: "Downloading acknowledges the consent statement in our client agreement.",
    },
  },
  experiments: {
    showNewsletterSection: false,
    showLeadMagnet: false,
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
  // Ensure Next.js doesn't statically cache the config.
  noStore()
  try {
    if (hasSupabase()) {
      const sbData = await sbGetSiteConfigJson()
      if (sbData) {
        const parsed = sbData as Record<string, unknown>
        return {
          ...defaultConfig,
          ...parsed,
          theme: { ...defaultConfig.theme, ...(parsed.theme ?? {}) },
          seo: { ...defaultConfig.seo, ...(parsed.seo ?? {}) },
          brand: { ...defaultConfig.brand, ...(parsed.brand ?? {}) },
          navigation: parsed.navigation ?? defaultConfig.navigation,
          contact: { ...defaultConfig.contact, ...(parsed.contact ?? {}) },
          social: { ...(defaultConfig.social ?? {}), ...(parsed.social ?? {}) },
          legal: {
            privacy: { ...(defaultConfig.legal?.privacy ?? {}), ...(parsed.legal?.privacy ?? {}) },
            terms: { ...(defaultConfig.legal?.terms ?? {}), ...(parsed.legal?.terms ?? {}) },
          },
          clientCare: {
            downloads: parsed.clientCare?.downloads ?? defaultConfig.clientCare?.downloads,
            prepChecklist: parsed.clientCare?.prepChecklist ?? defaultConfig.clientCare?.prepChecklist,
            aftercareChecklist: parsed.clientCare?.aftercareChecklist ?? defaultConfig.clientCare?.aftercareChecklist,
          },
          bookingCopy: {
            ...(defaultConfig.bookingCopy ?? {}),
            ...(parsed.bookingCopy ?? {}),
            billingHighlights: parsed.bookingCopy?.billingHighlights ?? defaultConfig.bookingCopy?.billingHighlights,
            paymentSupport: parsed.bookingCopy?.paymentSupport ?? defaultConfig.bookingCopy?.paymentSupport,
            schedulerPoints: parsed.bookingCopy?.schedulerPoints ?? defaultConfig.bookingCopy?.schedulerPoints,
            schedulerHelpText: parsed.bookingCopy?.schedulerHelpText ?? defaultConfig.bookingCopy?.schedulerHelpText,
          },
          hero: { ...defaultConfig.hero, ...(parsed.hero ?? {}) },
          about: { ...defaultConfig.about, ...(parsed.about ?? {}) },
          services: parsed.services ?? defaultConfig.services,
          consultations: parsed.consultations ?? defaultConfig.consultations,
          resources: normalizeCarouselResources(parsed.resources ?? defaultConfig.resources),
          forms: { ...(defaultConfig.forms ?? {}), ...(parsed.forms ?? {}) },
          homepage: (() => {
            const defaults = defaultConfig.homepage ?? {}
            const hp = (parsed.homepage ?? {}) as Partial<HomepageContent>
            const leadMagnetDefaults = defaults.leadMagnet ?? {
              heading: "",
              body: "",
              ctaLabel: "",
              ctaHref: "",
            }
            return {
              ...defaults,
              ...hp,
              sections: { ...(defaults.sections ?? {}), ...(hp.sections ?? {}) },
              copy: { ...(defaults.copy ?? {}), ...(hp.copy ?? {}) },
              importantLinks: {
                ...(defaults.importantLinks ?? {}),
                ...(hp.importantLinks ?? {}),
                blogLinks: hp.importantLinks?.blogLinks ?? defaults.importantLinks?.blogLinks,
                specialistLinks: hp.importantLinks?.specialistLinks ?? defaults.importantLinks?.specialistLinks,
              },
              importantSectionLinks: hp.importantSectionLinks ?? defaults.importantSectionLinks,
              otherAreas: hp.otherAreas ?? defaults.otherAreas,
              valueProps: hp.valueProps ?? defaults.valueProps,
              testimonials: hp.testimonials ?? defaults.testimonials,
              faqs: hp.faqs ?? defaults.faqs,
              leadMagnet: { ...leadMagnetDefaults, ...(hp.leadMagnet ?? {}) },
            }
          })(),
          meta: { ...(defaultConfig.meta ?? { version: 1, updatedAt: new Date().toISOString() }), ...(parsed.meta ?? {}) },
          experiments: { ...defaultConfig.experiments, ...(parsed.experiments ?? {}) },
        }
      }
    }
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
      social: { ...(defaultConfig.social ?? {}), ...(parsed.social ?? {}) },
      legal: {
        privacy: { ...(defaultConfig.legal?.privacy ?? {}), ...(parsed.legal?.privacy ?? {}) },
        terms: { ...(defaultConfig.legal?.terms ?? {}), ...(parsed.legal?.terms ?? {}) },
      },
      clientCare: {
        downloads: parsed.clientCare?.downloads ?? defaultConfig.clientCare?.downloads,
        prepChecklist: parsed.clientCare?.prepChecklist ?? defaultConfig.clientCare?.prepChecklist,
        aftercareChecklist: parsed.clientCare?.aftercareChecklist ?? defaultConfig.clientCare?.aftercareChecklist,
      },
      bookingCopy: {
        ...(defaultConfig.bookingCopy ?? {}),
        ...(parsed.bookingCopy ?? {}),
        billingHighlights: parsed.bookingCopy?.billingHighlights ?? defaultConfig.bookingCopy?.billingHighlights,
        paymentSupport: parsed.bookingCopy?.paymentSupport ?? defaultConfig.bookingCopy?.paymentSupport,
        schedulerPoints: parsed.bookingCopy?.schedulerPoints ?? defaultConfig.bookingCopy?.schedulerPoints,
        schedulerHelpText: parsed.bookingCopy?.schedulerHelpText ?? defaultConfig.bookingCopy?.schedulerHelpText,
      },
      hero: { ...defaultConfig.hero, ...(parsed.hero ?? {}) },
      about: { ...defaultConfig.about, ...(parsed.about ?? {}) },
      services: parsed.services ?? defaultConfig.services,
      consultations: parsed.consultations ?? defaultConfig.consultations,
      resources: normalizeCarouselResources(parsed.resources ?? defaultConfig.resources),
      forms: { ...(defaultConfig.forms ?? {}), ...(parsed.forms ?? {}) },
      homepage: (() => {
        const defaults = defaultConfig.homepage ?? {}
      const hp = (parsed.homepage ?? {}) as Partial<HomepageContent>
      const leadMagnetDefaults = defaults.leadMagnet ?? {
        heading: "",
        body: "",
        ctaLabel: "",
        ctaHref: "",
      }
        return {
          ...defaults,
          ...hp,
          sections: { ...(defaults.sections ?? {}), ...(hp.sections ?? {}) },
          copy: { ...(defaults.copy ?? {}), ...(hp.copy ?? {}) },
          importantLinks: {
            ...(defaults.importantLinks ?? {}),
            ...(hp.importantLinks ?? {}),
            blogLinks: hp.importantLinks?.blogLinks ?? defaults.importantLinks?.blogLinks,
            specialistLinks: hp.importantLinks?.specialistLinks ?? defaults.importantLinks?.specialistLinks,
          },
          importantSectionLinks: hp.importantSectionLinks ?? defaults.importantSectionLinks,
          otherAreas: hp.otherAreas ?? defaults.otherAreas,
          valueProps: hp.valueProps ?? defaults.valueProps,
          testimonials: hp.testimonials ?? defaults.testimonials,
          faqs: hp.faqs ?? defaults.faqs,
          leadMagnet: { ...leadMagnetDefaults, ...(hp.leadMagnet ?? {}) },
        }
      })(),
      meta: { ...(defaultConfig.meta ?? { version: 1, updatedAt: new Date().toISOString() }), ...(parsed.meta ?? {}) },
      experiments: { ...defaultConfig.experiments, ...(parsed.experiments ?? {}) },
    }
  } catch {
    if (hasSupabase()) {
      return defaultConfig
    }
    // On Vercel (production), the filesystem is not a safe persistence layer.
    // If Supabase isn't configured, return defaults instead of trying to write files (which can cause 500s).
    if (process.env.NODE_ENV === "production") {
      return defaultConfig
    }
    await ensureDir(CONFIG_FILE_PATH)
    await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(defaultConfig, null, 2), "utf8")
    return defaultConfig
  }
}

export async function writeSiteConfig(newConfig: SiteConfig): Promise<void> {
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
    meta: {
      version: Date.now(),
      updatedAt: new Date().toISOString(),
    },
    theme: { ...defaultConfig.theme, ...newConfig.theme },
    seo: { ...defaultConfig.seo, ...(newConfig.seo ?? {}) },
    brand: mergedBrand,
    navigation: newConfig.navigation ?? defaultConfig.navigation,
    contact: { ...defaultConfig.contact, ...(newConfig.contact ?? {}) },
    social: { ...(defaultConfig.social ?? {}), ...(newConfig.social ?? {}) },
    legal: {
      privacy: { ...(defaultConfig.legal?.privacy ?? {}), ...(newConfig.legal?.privacy ?? {}) },
      terms: { ...(defaultConfig.legal?.terms ?? {}), ...(newConfig.legal?.terms ?? {}) },
    },
    bookingCopy: {
      ...(defaultConfig.bookingCopy ?? {}),
      ...(newConfig.bookingCopy ?? {}),
      billingHighlights: newConfig.bookingCopy?.billingHighlights ?? defaultConfig.bookingCopy?.billingHighlights,
      paymentSupport: newConfig.bookingCopy?.paymentSupport ?? defaultConfig.bookingCopy?.paymentSupport,
      schedulerPoints: newConfig.bookingCopy?.schedulerPoints ?? defaultConfig.bookingCopy?.schedulerPoints,
      schedulerHelpText: newConfig.bookingCopy?.schedulerHelpText ?? defaultConfig.bookingCopy?.schedulerHelpText,
    },
    hero: { ...defaultConfig.hero, ...newConfig.hero },
    about: { ...defaultConfig.about, ...newConfig.about },
    services: newConfig.services ?? defaultConfig.services,
    consultations: newConfig.consultations ?? defaultConfig.consultations,
    resources: normalizeCarouselResources(newConfig.resources ?? defaultConfig.resources),
    forms: { ...(defaultConfig.forms ?? {}), ...(newConfig.forms ?? {}) },
    homepage: (() => {
      const defaults = defaultConfig.homepage ?? {}
      const hp = (newConfig.homepage ?? {}) as Partial<HomepageContent>
      const leadMagnetDefaults = defaults.leadMagnet ?? {
        heading: "",
        body: "",
        ctaLabel: "",
        ctaHref: "",
      }
      return {
        ...defaults,
        ...hp,
        sections: { ...(defaults.sections ?? {}), ...(hp.sections ?? {}) },
        copy: { ...(defaults.copy ?? {}), ...(hp.copy ?? {}) },
      importantLinks: {
        ...(defaults.importantLinks ?? {}),
        ...(hp.importantLinks ?? {}),
        blogLinks: hp.importantLinks?.blogLinks ?? defaults.importantLinks?.blogLinks,
        specialistLinks: hp.importantLinks?.specialistLinks ?? defaults.importantLinks?.specialistLinks,
      },
        importantSectionLinks: hp.importantSectionLinks ?? defaults.importantSectionLinks,
        otherAreas: hp.otherAreas ?? defaults.otherAreas,
        valueProps: hp.valueProps ?? defaults.valueProps,
        testimonials: hp.testimonials ?? defaults.testimonials,
        faqs: hp.faqs ?? defaults.faqs,
        leadMagnet: { ...leadMagnetDefaults, ...(hp.leadMagnet ?? {}) },
      }
    })(),
    experiments: { ...defaultConfig.experiments, ...(newConfig.experiments ?? {}) },
    clientCare: {
      downloads: newConfig.clientCare?.downloads ?? defaultConfig.clientCare?.downloads,
      prepChecklist: newConfig.clientCare?.prepChecklist ?? defaultConfig.clientCare?.prepChecklist,
      aftercareChecklist: newConfig.clientCare?.aftercareChecklist ?? defaultConfig.clientCare?.aftercareChecklist,
    },
  }
  if (hasSupabase()) {
    // Write an immutable history record for rollback/auditing.
    // (Best-effort: if history insert fails, we still try to save the current config.)
    try {
      await sbInsertSiteConfigVersion(merged, merged.meta?.version ?? Date.now(), merged.meta?.updatedAt ?? new Date().toISOString())
    } catch {
      // ignore
    }
    await sbUpsertSiteConfigJson(merged)
    return
  }
  // In production, filesystem writes won't persist (and may fail). Force a clear error instead.
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Persistence is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel (or connect the Supabase integration) so admin saves can persist."
    )
  }
  await ensureDir(CONFIG_FILE_PATH)
  await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(merged, null, 2), "utf8")
}


