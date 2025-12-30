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
  // Optional: used by the Consent page acknowledgement flow.
  requiredStatement?: string
}

export type LegalConfig = {
  privacy?: LegalPageConfig
  terms?: LegalPageConfig
  consent?: LegalPageConfig
}

export type ClientCareConfig = {
  downloads?: NavLink[]
  prepChecklist?: string[]
  aftercareChecklist?: string[]
}

export type ContentSectionConfig = {
  title: string
  slug: string
  content: string
  pdfUrl?: string
}

export type FinancialAbusePageConfig = {
  title: string
  description: string
  eyebrow?: string
  commonSigns?: string[]
  therapySupports?: string[]
  crisisText?: string
  nextStepsLinks?: NavLink[]
}

export type MonetaryPsychotherapyPageConfig = {
  eyebrow?: string
  title: string
  subtitle: string
  intro: string
  designedFor?: string[]
  sessionFocus?: string[]
  therapeuticPrinciples?: Array<{
    title: string
    body: string
  }>
  howWeBegin?: string[]
}

export type FinancialAbuseTherapyPageConfig = {
  eyebrow?: string
  title: string
  description: string
  therapyApproach?: string[]
  sessionFormats?: string[]
  nextStepsLinks?: NavLink[]
  faqs?: FaqEntry[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export type FooterConfig = {
  copyrightText?: string
  companyName?: string
  acknowledgementText?: string
  quickLinks?: NavLink[]
}

export type BookingCopyItem = {
  title: string
  detail: string
}

export type PaymentOption = {
  id: string
  label: string
  /**
   * If omitted (legacy), treat as enabled.
   */
  enabled?: boolean
  /**
   * Optional logo image URL (prefer `/api/assets/...` from Admin uploads).
   */
  logoUrl?: string
}

export type BookingCopy = {
  billingHighlights?: BookingCopyItem[]
  paymentSupport?: BookingCopyItem[]
  paymentOptions?: PaymentOption[]
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

export type FormFieldOption = {
  value: string
  label: string
}

export type FormField =
  | {
      type: "text" | "email" | "tel"
      name: string
      label: string
      required?: boolean
      placeholder?: string
      helperText?: string
    }
  | {
      type: "textarea"
      name: string
      label: string
      required?: boolean
      placeholder?: string
      helperText?: string
      rows?: number
    }
  | {
      type: "select"
      name: string
      label: string
      required?: boolean
      placeholder?: string
      helperText?: string
      options: FormFieldOption[]
    }
  | {
      type: "checkbox"
      name: string
      label: string
      required?: boolean
      helperText?: string
      /**
       * If provided, the checkbox must be true (server will validate).
       */
      mustBeTrue?: boolean
      defaultChecked?: boolean
    }
  | {
      type: "slider"
      name: string
      label: string
      required?: boolean
      helperText?: string
      min: number
      max: number
      step?: number
      defaultValue?: number
    }

export type FormSection = {
  title?: string
  description?: string
  /**
   * Layout hint for UI (keeps the current look while still being schema-driven).
   */
  layout?: "stack" | "grid-2" | "grid-3"
  fields: FormField[]
}

export type FormStep = {
  label: string
  /**
   * A step is considered complete when ALL of these fields are non-empty (or true for mustBeTrue checkboxes).
   */
  completeWhenAllOf: string[]
}

export type FormPage = {
  title: string
  subtitle?: string
  intro?: string
  action: string
  submitLabel: string
  successMessage: string
  errorMessageMissingRequired?: string
  steps?: FormStep[]
  sections: FormSection[]
}

export type FormPagesConfig = {
  enquiry?: FormPage
  intake?: FormPage
  consent?: FormPage
  newsletter?: FormPage
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
  showImportantLinksCallButton?: boolean
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

  // Feature CTA shown above the Important Links section (calls the configured phone number).
  importantLinksCallCtaLabel?: string
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
  formPages?: FormPagesConfig
  homepage?: HomepageContent
  experiments?: ExperimentsConfig
  social?: SocialLinks
  legal?: LegalConfig
  clientCare?: ClientCareConfig
  contentSections?: ContentSectionConfig[]
  footer?: FooterConfig
  bookingCopy?: BookingCopy
  financialAbusePage?: FinancialAbusePageConfig
  monetaryPsychotherapyPage?: MonetaryPsychotherapyPageConfig
  financialAbuseTherapyPage?: FinancialAbuseTherapyPageConfig
  familyFinancialAssistanceInheritancePage?: FinancialAbuseTherapyPageConfig
  financialTraumaPage?: FinancialAbuseTherapyPageConfig
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
    emailAlt: "",
  },
  social: {
    facebook: "https://www.facebook.com/the.melbourne.counsellor/",
    instagram: "https://www.instagram.com/the.melbourne.counsellor/#",
    linkedin: "https://www.linkedin.com/in/dan-lobel-the-melbourne.counsellor-769b61204/",
  },
  legal: {
    privacy: {
      title: "Privacy Policy",
      downloadUrl: "/Privacy%20Policy.pdf",
      bodyMdx: "",
    },
    terms: {
      title: "Terms of Service",
      downloadUrl: "/Terms%20of%20Service.pdf",
      bodyMdx: "",
    },
    consent: {
      title: "Consent & Policies",
      downloadUrl: "/Consent%20and%20Policies.docx",
      bodyMdx: "",
      requiredStatement: "I have read & I understand the contents of this document",
    },
  },
  clientCare: {
    downloads: [
      { label: "Enquiry Form", href: "/enquiry" },
      { label: "Intake Form", href: "/intake" },
    ],
    prepChecklist: [
      "Find a private, comfortable space and something grounding to hold.",
      "Take 90 seconds to notice your breathing and name one intention for the session.",
      "Have a glass of water, journal, or tissues nearby.",
    ],
    aftercareChecklist: [
      "Give yourself at least 10 minutes before diving into work or caretaking.",
      "Drink water, have a snack, and if possible step outside for fresh air.",
      "Note one insight or feeling you'd like to revisit next session.",
    ],
  },
  contentSections: [
    { title: "Why money triggers anxiety", slug: "why-money-triggers-anxiety", content: "", pdfUrl: "" },
    { title: "What is Financial Abuse", slug: "what-is-financial-abuse", content: "", pdfUrl: "" },
    { title: "Elderly/Disabled Financial Abuse", slug: "elderly-disabled-financial-abuse", content: "", pdfUrl: "" },
    { title: "Monetary Psychotherapy", slug: "monetary-psychotherapy", content: "", pdfUrl: "" },
    { title: "Financial Trauma", slug: "financial-trauma", content: "", pdfUrl: "" },
    { title: "Family Financial Assistance. Inheritance.", slug: "family-financial-assistance-inheritance", content: "", pdfUrl: "" },
    { title: "Estrangement", slug: "estrangement", content: "", pdfUrl: "" },
    { title: "Financial Abuse Therapy", slug: "financial-abuse-therapy", content: "", pdfUrl: "" },
    { title: "About Dan", slug: "about-dan", content: "", pdfUrl: "" },
  ],
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
    paymentOptions: [
      { id: "visa", label: "Visa", enabled: true, logoUrl: "" },
      { id: "mastercard", label: "Mastercard", enabled: true, logoUrl: "" },
      { id: "amex", label: "AMEX", enabled: true, logoUrl: "" },
      { id: "apple-pay", label: "Apple Pay", enabled: true, logoUrl: "" },
      { id: "google-pay", label: "Google Pay", enabled: true, logoUrl: "" },
    ],
    schedulerPoints: [
      "Fees shown above already include GST and reflect the exact session length.",
      "Payments are captured through Square inside the secure Acuity portal.",
      "Need to reschedule? Reach out with 72 hours notice and we’ll arrange a new time.",
    ],
    schedulerHelpText: "Need help deciding on a format? Email or call — a personal reply is guaranteed.",
  },
  financialAbusePage: {
    title: "Financial Abuse — Signs, Safety, and Support",
    description: "If money is being used to control, restrict, or punish you, you are not alone. Support is available.",
    eyebrow: "Financial Trauma & Monetary Psychotherapy",
    commonSigns: [
      "Blocking access to accounts, payslips, or financial information",
      "Controlling spending or demanding full oversight of purchases",
      "Sabotaging employment or study; forced debt or coerced signatures",
      "Withholding money, essentials, or transport; creating dependency",
    ],
    therapySupports: [
      "Nervous‑system‑aware pacing to reduce overwhelm",
      "Clarifying boundaries, consent, and next steps",
      "Planning confidential support and practical safety edges",
      "Restoring self‑trust and financial confidence over time",
    ],
    crisisText: "If you're in immediate danger, call 000. You can also reach Lifeline on 13 11 14 (24/7).",
    nextStepsLinks: [
      { label: "Learn about Financial Abuse Therapy", href: "/financial-abuse-therapy" },
      { label: "Work with a Financial Abuse Therapist", href: "/financial-abuse-therapist" },
    ],
  },
  monetaryPsychotherapyPage: {
    eyebrow: "Monetary Psychotherapy",
    title: "Money carries stories. Some are empowering — others hold pain.",
    subtitle: "Understanding those stories is the first step toward emotional and financial freedom.",
    intro: "Monetary psychotherapy explores the deep connection between money, emotion, and self-identity. It's a trauma-informed space for women who have felt disempowered by financial control, scarcity, or uncertainty — especially during life transitions, separation, or rebuilding after abuse.",
    designedFor: [
      "Feel anxiety, shame, or guilt when spending or saving",
      "Have experienced financial control, infidelity, or dependency",
      "Carry generational narratives about scarcity, inequality, or debt",
      "Want steady confidence when making financial decisions",
    ],
    sessionFocus: [
      "Exploring the emotional roots of your financial story",
      "Rebuilding self-trust and values-aligned boundaries",
      "Integrating practical money actions that feel doable",
      "Developing resilience, independence, and long-term confidence",
    ],
    therapeuticPrinciples: [
      {
        title: "Consent-led pacing",
        body: "You decide what feels safe to share. Sessions move gently, making space for the body's cues and nervous-system capacity.",
      },
      {
        title: "Story + strategy",
        body: "We untangle family, cultural, and lived stories about money and pair the insights with grounded, compassionate plans.",
      },
      {
        title: "Self-trust first",
        body: "Financial change sticks when it's anchored in worthiness. We practice choices that honour your needs, boundaries, and values.",
      },
    ],
    howWeBegin: [
      "We anchor in what safety means for your nervous system and set conversational boundaries.",
      "We map the moments, relationships, or events that shaped your relationship with money — gently and at your pace.",
      "We co-create small experiments or practices that honour your values and increase agency with money decisions.",
    ],
  },
  financialAbuseTherapyPage: {
    eyebrow: "Financial Trauma & Monetary Psychotherapy",
    title: "Financial Abuse Therapy",
    description: "A gentle, consent‑led path to restore safety, autonomy, and self‑trust after financial control or coercion.",
    therapyApproach: [
      "Trauma‑informed: safety first, always at your pace",
      "Nervous‑system regulation and practical stabilisation",
      "Values‑aligned boundary‑setting and next steps",
      "Rebuilding self‑trust and financial confidence",
    ],
    sessionFormats: [
      "Telehealth (Australia)",
      "In‑person (Melbourne)",
      "Walk & Discuss Therapy (by arrangement)",
    ],
    nextStepsLinks: [
      { label: "What is Financial Abuse?", href: "/financial-abuse" },
      { label: "Find a Financial Abuse Therapist", href: "/financial-abuse-therapist" },
    ],
    faqs: [
      {
        question: "What happens in the first session?",
        answer: "We focus on safety, consent, and pacing. You set boundaries on what to share. We outline gentle, practical next steps that respect your situation.",
      },
      {
        question: "Is this confidential?",
        answer: "Yes. Confidentiality is respected within legal and ethical limits. If there is risk of harm, we discuss appropriate safety steps.",
      },
      {
        question: "Do you offer Telehealth?",
        answer: "Yes — Telehealth across Australia, as well as in-person sessions in Melbourne.",
      },
    ],
  },
  familyFinancialAssistanceInheritancePage: {
    eyebrow: "Money, family roles, obligation, and recovery",
    title: "Family Financial Assistance and Inheritance",
    description:
      "When support becomes leverage, guilt, or a bargaining chip, the relationship stops being about care and starts being about control. This page explains the hidden patterns of financial abuse that can show up in family assistance and inheritance, and how therapy can help you rebuild autonomy, boundaries, and self trust.\n\nLast updated: 30 Apr 2025",
    therapyApproach: [
      "Trauma-informed support that prioritises safety, consent, and pacing",
      "Clarifying what is yours to carry, and what was pushed onto you",
      "Boundary setting for money requests, debts, gifts, and family expectations",
      "Reducing guilt and fear through nervous system regulation and skills",
      "Practical next steps: scripts, plans, and decision support",
    ],
    sessionFormats: ["Telehealth (Australia)", "In-person (Melbourne)", "Walk and Discuss Therapy (by arrangement)"],
    nextStepsLinks: [
      { label: "What is Financial Abuse?", href: "/financial-abuse" },
      { label: "Financial Abuse Therapy", href: "/financial-abuse-therapy" },
      { label: "Financial Trauma", href: "/financial-trauma" },
    ],
    faqs: [
      {
        question: "When does family help cross the line into financial abuse?",
        answer:
          "When money is used to pressure, punish, monitor, control, or “buy” your choices. Common signs include strings attached, moving goalposts, guilt campaigns, threats to withdraw support, demands for access to accounts, using gifts as debt, forcing you into secrecy, or making your independence feel like betrayal.",
      },
      {
        question: "What if the money was a gift, but they keep bringing it up?",
        answer:
          "A gift is not a lifetime contract. If someone repeatedly uses past help to override your decisions, that is leverage. Therapy can help you separate gratitude from obligation, decide what you want to acknowledge, and set a boundary that ends the ongoing price tag.",
      },
      {
        question: "I feel guilty saying no, even when the request is unreasonable. Why?",
        answer:
          "Guilt is often a learned alarm system, not a moral truth. In some families, saying no triggers fear of rejection, anger, or withdrawal of love. We work on the emotional pattern underneath, then build practical skills so your boundaries hold even under pressure.",
      },
      {
        question: "How do inheritances get weaponised?",
        answer:
          "Through threats, conditional promises, sudden changes, secrecy, triangulation between siblings, or “loyalty tests” that require obedience to stay included. Even when no one says it directly, the inheritance can become a silent leash. Therapy helps you get clear on your values and make decisions that protect your dignity.",
      },
      {
        question: "Should I keep accepting money if it helps me survive?",
        answer:
          "Sometimes you need short-term stability, and that does not make you weak. We can work on a safer plan: what support is worth taking, what conditions you refuse, how to document agreements, how to reduce exposure to control, and how to build a realistic path toward independence.",
      },
      {
        question: "Can therapy help with the practical side, not just feelings?",
        answer:
          "Yes. We can map the money dynamics, create boundaries, write scripts for hard conversations, plan for predictable flare-ups, and decide next steps. The goal is stability and autonomy, not just insight.",
      },
    ],
    seo: {
      metaTitle: "Family Financial Assistance and Inheritance | Dan Lobel",
      metaDescription:
        "How family help and inheritance can become control, guilt, or coercion, and how financial abuse therapy supports autonomy, boundaries, and recovery.",
    },
  },
  financialTraumaPage: {
    eyebrow: "",
    title: "Financial Trauma",
    description: "",
    therapyApproach: [],
    sessionFormats: [],
    nextStepsLinks: [],
    faqs: [],
    seo: {
      metaTitle: "Financial Trauma | Dan Lobel",
      metaDescription: "",
    },
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
      logoUrl: "/logos/Lifeline.webp",
      logoHeight: 80,
    },
    {
      name: "Suicide CallBack Service",
      number: "1300 659 467",
      website: "https://www.suicidecallbackservice.org.au",
      description: "24/7 nationwide service offering free professional phone and online counselling for people affected by suicide.",
      logoUrl: "/logos/suicide%20services%20call%20back.webp",
    },
    {
      name: "Beyond Blue",
      number: "1300 224 636",
      website: "https://www.beyondblue.org.au",
      description: "Support, advice and action for anxiety, depression and suicide prevention.",
      logoUrl: "/logos/beyond%20blue.webp",
    },
    { name: "1800 Respect", number: "1800 732 732", website: "https://1800respect.org.au", description: "", logoUrl: "/logos/1800respect%20logo%20small.png" },
    {
      name: "Medicare Mental Health",
      number: "1800 595 212",
      website: "https://www.healthdirect.gov.au/mental-health-helplines",
      description: "",
      logoUrl: "/logos/images.png",
    },
    { name: "Headspace", number: "1800 650 890", website: "https://headspace.org.au", description: "", logoUrl: "/logos/Headspace.png" },
    {
      name: "Butterfly National Helpline",
      number: "1800 334 673",
      website: "https://butterfly.org.au",
      description: "",
      logoUrl: "/logos/butterfly-logo.png",
    },
    {
      name: "Blue Knot Foundation",
      number: "1300 657 380",
      website: "https://blueknot.org.au",
      description: "",
      logoUrl: "/logos/blue-knot.svg",
      logoHeight: 72,
    },
  ],
  forms: {
    enquiry: "",
    consent: "",
    intake: "",
  },
  formPages: {
    enquiry: {
      title: "Enquiry Form",
      subtitle: "We’ll get back to you as soon as possible.",
      action: "/api/enquiry",
      submitLabel: "Send",
      successMessage: "Thank you — your enquiry has been sent.",
      errorMessageMissingRequired: "Please complete all required fields.",
      steps: [
        { label: "About you", completeWhenAllOf: ["firstName", "email", "phone"] },
        { label: "Support focus", completeWhenAllOf: ["message"] },
        { label: "Consent", completeWhenAllOf: ["consentAccepted"] },
      ],
      sections: [
        {
          title: "About you",
          layout: "grid-2",
          fields: [
            { type: "text", name: "firstName", label: "First Name", required: true },
            { type: "text", name: "lastName", label: "Last Name", required: false },
            { type: "email", name: "email", label: "Email", required: true },
            { type: "tel", name: "phone", label: "Mobile Phone Number", required: true },
          ],
        },
        {
          title: "Support focus",
          layout: "stack",
          fields: [
            { type: "textarea", name: "message", label: "Message", required: true, rows: 6 },
            {
              type: "textarea",
              name: "supportFocus",
              label: "What feels most helpful to focus on?",
              required: false,
              rows: 4,
              placeholder: "e.g. financial control in my relationship, rebuilding trust after separation…",
            },
            {
              type: "select",
              name: "preferredFormat",
              label: "Preferred session format",
              required: false,
              options: [
                { value: "", label: "Select" },
                { value: "Telehealth", label: "Telehealth (Zoom)" },
                { value: "In-person", label: "In-person (St Kilda Rd)" },
                { value: "In-home", label: "In-home consultation" },
                { value: "Walk & Discuss", label: "Walk & Discuss therapy" },
                { value: "Not sure", label: "Not sure yet" },
              ],
            },
          ],
        },
        {
          title: "Consent",
          layout: "stack",
          fields: [
            {
              type: "checkbox",
              name: "updatesOptIn",
              label: "Send me the Financial Safety Check-in and occasional updates (you can unsubscribe anytime).",
              required: false,
              defaultChecked: false,
            },
            {
              type: "checkbox",
              name: "consentAccepted",
              label: "I’ve read the consent & policies and understand urgent support is available in the Client Care Hub.",
              required: true,
              mustBeTrue: true,
              defaultChecked: false,
            },
          ],
        },
      ],
    },
    intake: {
      title: "Intake Form",
      subtitle: "Please complete this form before your first appointment.",
      action: "/api/intake",
      submitLabel: "Send",
      successMessage: "Thank you — your intake form has been sent.",
      errorMessageMissingRequired: "Please complete all required fields.",
      sections: [
        {
          title: "Contact",
          layout: "grid-2",
          fields: [
            { type: "text", name: "firstName", label: "First Name", required: true },
            { type: "text", name: "lastName", label: "Last Name", required: true },
            { type: "email", name: "email", label: "Email", required: true },
            { type: "tel", name: "phone", label: "Mobile Phone Number", required: true },
          ],
        },
        {
          title: "Address",
          layout: "grid-2",
          fields: [
            {
              type: "select",
              name: "country",
              label: "Country",
              required: true,
              options: [{ value: "Australia", label: "Australia" }],
            },
            { type: "text", name: "address1", label: "Address Line 1", required: true },
            { type: "text", name: "address2", label: "Address Line 2", required: false },
            { type: "text", name: "suburb", label: "Suburb", required: true },
            {
              type: "select",
              name: "state",
              label: "State",
              required: true,
              options: [
                { value: "VIC", label: "VIC" },
                { value: "NSW", label: "NSW" },
                { value: "QLD", label: "QLD" },
                { value: "SA", label: "SA" },
                { value: "WA", label: "WA" },
                { value: "TAS", label: "TAS" },
                { value: "NT", label: "NT" },
                { value: "ACT", label: "ACT" },
              ],
            },
            { type: "text", name: "postcode", label: "Postcode", required: true },
          ],
        },
        {
          title: "Background",
          layout: "grid-2",
          fields: [
            { type: "text", name: "date", label: "Date (dd/mm/yyyy)", required: true, placeholder: "dd/mm/yyyy" },
            { type: "text", name: "occupation", label: "Occupation", required: false },
            {
              type: "select",
              name: "relationshipStatus",
              label: "Are you currently in any form of relationship?",
              required: false,
              options: [
                { value: "", label: "Select" },
                { value: "single", label: "Single" },
                { value: "relationship", label: "In a relationship" },
                { value: "married", label: "Married" },
                { value: "separated", label: "Separated" },
                { value: "divorced", label: "Divorced" },
                { value: "widowed", label: "Widowed" },
                { value: "prefer_not", label: "Prefer not to say" },
              ],
            },
            {
              type: "select",
              name: "haveChildren",
              label: "Do you have any children?",
              required: false,
              options: [
                { value: "", label: "Select" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "prefer_not", label: "Prefer not to say" },
              ],
            },
            { type: "text", name: "nextOfKinName", label: "Next of Kin (In case of emergency)", required: false },
            { type: "tel", name: "nextOfKinPhone", label: "Phone number for Next of Kin", required: false },
          ],
        },
        {
          title: "Health snapshot",
          layout: "grid-2",
          fields: [
            { type: "slider", name: "generalHealth", label: "How would you consider your general health?", required: false, min: 1, max: 5, defaultValue: 3 },
            {
              type: "select",
              name: "seenCounsellor",
              label: "Have you previously seen a counsellor or psychologist?",
              required: false,
              options: [
                { value: "", label: "Select" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ],
            },
            {
              type: "select",
              name: "onMedication",
              label: "Are you on any medication from any previous issue?",
              required: false,
              options: [
                { value: "", label: "Select" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ],
            },
            { type: "text", name: "medicationDetails", label: "If yes, medication details", required: false },
            {
              type: "select",
              name: "experiencingDepression",
              label: "Are you currently experiencing overwhelming sadness, grief or depression?",
              required: false,
              options: [
                { value: "", label: "Select" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ],
            },
            {
              type: "select",
              name: "suicidalThoughts",
              label: "Have you ever had any suicidal thoughts?",
              required: false,
              options: [
                { value: "", label: "Select" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ],
            },
            {
              type: "select",
              name: "familyMentalHealthHistory",
              label: "Has any family member identified with any mental health issue?",
              required: false,
              options: [
                { value: "", label: "Select" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "unsure", label: "Unsure" },
              ],
            },
            { type: "slider", name: "sleepingHabits", label: "How would you consider your sleeping habits?", required: false, min: 1, max: 5, defaultValue: 3 },
            { type: "slider", name: "physicalHealth", label: "How would you rate your current physical health?", required: false, min: 1, max: 5, defaultValue: 3 },
            {
              type: "select",
              name: "exerciseFrequency",
              label: "Do you do any form of exercise? If so, how often?",
              required: false,
              options: [
                { value: "", label: "Select" },
                { value: "none", label: "None" },
                { value: "1-2_per_week", label: "1–2 times per week" },
                { value: "3-4_per_week", label: "3–4 times per week" },
                { value: "5+_per_week", label: "5+ times per week" },
              ],
            },
            {
              type: "select",
              name: "chronicPain",
              label: "Are you currently experiencing any form of chronic pain?",
              required: false,
              options: [
                { value: "", label: "Select" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ],
            },
            {
              type: "select",
              name: "useAlcoholOrDrugsForPain",
              label: "Are you currently using any alcohol or drugs for pain management?",
              required: false,
              options: [
                { value: "", label: "Select" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ],
            },
            {
              type: "select",
              name: "recentRecreationalDrugUse",
              label: "Have you recently used any recreational drugs?",
              required: false,
              options: [
                { value: "", label: "Select" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ],
            },
          ],
        },
        {
          title: "Goals",
          layout: "stack",
          fields: [
            { type: "textarea", name: "mainReason", label: "What is the main reason/s you are seeking therapy?", required: false, rows: 6 },
            { type: "textarea", name: "otherInformation", label: "Is there any other information you think might be important?", required: false, rows: 5 },
          ],
        },
      ],
    },
    consent: {
      title: "Consent Acknowledgement",
      subtitle: "Complete the acknowledgement below.",
      action: "/api/consent",
      submitLabel: "Send",
      successMessage: "Thank you — your consent has been recorded and sent.",
      errorMessageMissingRequired: "Please complete all required fields.",
      sections: [
        {
          title: "Acknowledgement",
          layout: "stack",
          fields: [
            { type: "text", name: "statement", label: "Required statement", required: true },
            { type: "text", name: "firstName", label: "First Name", required: true },
            { type: "text", name: "lastName", label: "Last Name", required: true },
            { type: "text", name: "date", label: "Date (dd/mm/yyyy)", required: true, placeholder: "dd/mm/yyyy" },
            { type: "text", name: "fullName", label: "Print Full Name", required: true },
          ],
        },
      ],
    },
    newsletter: {
      title: "Download the 5-step Financial Safety Check-in",
      subtitle: "Pop your details below and we'll send the grounding checklist, plus gentle updates you can opt-out of anytime.",
      action: "/api/subscribe",
      submitLabel: "Send it to me",
      successMessage: "Check your inbox — thanks for subscribing — your resource is on the way.",
      errorMessageMissingRequired: "Please complete all required fields.",
      sections: [
        {
          title: "",
          layout: "stack",
          fields: [
            { type: "text", name: "name", label: "First name", required: false, placeholder: "Sasha" },
            { type: "email", name: "email", label: "Email", required: true, placeholder: "you@email.com" },
            {
              type: "checkbox",
              name: "consent",
              label: 'By subscribing you consent to receive updates from Dan Lobel. You can unsubscribe anytime. Read the privacy policy for details.',
              required: false,
              defaultChecked: false,
            },
          ],
        },
      ],
    },
  },
  homepage: {
    sections: {
      showValueProps: true,
      showNewsletter: false,
      showImportantLinks: true,
      showImportantLinksCallButton: false,
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

function slugify(input: string): string {
  return String(input ?? "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function normalizeContentSectionsFixedLength(
  stored: SiteConfig["contentSections"] | undefined,
  defaults: SiteConfig["contentSections"] | undefined,
): SiteConfig["contentSections"] {
  const storedArr = Array.isArray(stored) ? stored : []
  const defaultsArr = Array.isArray(defaults) ? defaults : []

  // If we have no defaults to anchor to, just return the stored value (or empty).
  if (defaultsArr.length === 0) {
    return storedArr
      .map((s) => ({
        title: String(s?.title ?? "").trim(),
        slug: String(s?.slug ?? "").trim(),
        content: String(s?.content ?? ""),
        pdfUrl: s?.pdfUrl ? String(s.pdfUrl) : "",
      }))
      .filter((s) => s.title || s.slug || s.content || s.pdfUrl)
  }

  /**
   * IMPORTANT:
   * Historically, `contentSections` is treated as a fixed-length list (9 buttons on the homepage).
   * If the stored config ever drops an item (especially in the middle), index-based merging causes
   * the remaining items to "shift" and one default to disappear. That can remove the intended
   * homepage button (e.g. "Monetary Psychotherapy").
   *
   * Strategy:
   * - If lengths match, keep index-based merging (preserves any intentional re-ordering).
   * - If lengths differ, anchor to defaults order and merge by slug/title to restore missing defaults.
   */
  const out: ContentSectionConfig[] = []
  const usedSlugs = new Set<string>()

  const safeStored: ContentSectionConfig[] = storedArr
    .map((s) => ({
      title: String((s as ContentSectionConfig | null | undefined)?.title ?? "").trim(),
      slug: String((s as ContentSectionConfig | null | undefined)?.slug ?? "").trim(),
      content: String((s as ContentSectionConfig | null | undefined)?.content ?? ""),
      pdfUrl: String((s as ContentSectionConfig | null | undefined)?.pdfUrl ?? "").trim() || "",
    }))
    .filter((s) => s.title || s.slug || s.content || s.pdfUrl)

  const sameLength = safeStored.length === defaultsArr.length

  const bySlug = new Map<string, ContentSectionConfig>()
  const byTitle = new Map<string, ContentSectionConfig>()
  if (!sameLength) {
    for (const s of safeStored) {
      if (s.slug) bySlug.set(normalizeKey(s.slug), s)
      if (s.title) byTitle.set(normalizeKey(s.title), s)
    }
  }

  for (let i = 0; i < defaultsArr.length; i++) {
    const def = defaultsArr[i] ?? { title: "", slug: "", content: "", pdfUrl: "" }

    const raw: ContentSectionConfig | undefined = sameLength
      ? safeStored[i]
      : bySlug.get(normalizeKey(def.slug)) ??
        byTitle.get(normalizeKey(def.title)) ??
        // If a stored item has a blank slug but a slugified title that matches the default slug, accept it.
        (def.slug ? safeStored.find((s) => !s.slug && normalizeKey(slugify(s.title)) === normalizeKey(def.slug)) : undefined)

    const merged: ContentSectionConfig = {
      title: String(raw?.title ?? def.title ?? "").trim(),
      slug: String(raw?.slug ?? def.slug ?? "").trim(),
      content: String(raw?.content ?? def.content ?? ""),
      pdfUrl: String(raw?.pdfUrl ?? def.pdfUrl ?? "").trim() || "",
    }

    if (!merged.title && def.title) merged.title = def.title

    // Ensure we always have a usable slug for routing.
    if (!merged.slug) {
      merged.slug = def.slug || slugify(merged.title) || `section-${i + 1}`
    }

    // Make sure slugs are unique (avoid broken lookups/links).
    let candidate = merged.slug
    let n = 2
    while (usedSlugs.has(candidate)) {
      candidate = `${merged.slug}-${n}`
      n += 1
    }
    merged.slug = candidate
    usedSlugs.add(merged.slug)

    out.push(merged)
  }

  return out
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
      try {
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
              consent: { ...(defaultConfig.legal?.consent ?? {}), ...(parsed.legal?.consent ?? {}) },
            },
            clientCare: {
              downloads: parsed.clientCare?.downloads ?? defaultConfig.clientCare?.downloads,
              prepChecklist: parsed.clientCare?.prepChecklist ?? defaultConfig.clientCare?.prepChecklist,
              aftercareChecklist: parsed.clientCare?.aftercareChecklist ?? defaultConfig.clientCare?.aftercareChecklist,
            },
            contentSections: normalizeContentSectionsFixedLength(parsed.contentSections, defaultConfig.contentSections),
            footer: { ...defaultConfig.footer, ...(parsed.footer ?? {}) },
            financialAbusePage: parsed.financialAbusePage ?? defaultConfig.financialAbusePage,
            monetaryPsychotherapyPage: parsed.monetaryPsychotherapyPage ?? defaultConfig.monetaryPsychotherapyPage,
            financialAbuseTherapyPage: parsed.financialAbuseTherapyPage ?? defaultConfig.financialAbuseTherapyPage,
            familyFinancialAssistanceInheritancePage:
              parsed.familyFinancialAssistanceInheritancePage ?? defaultConfig.familyFinancialAssistanceInheritancePage,
            financialTraumaPage: parsed.financialTraumaPage ?? defaultConfig.financialTraumaPage,
            bookingCopy: {
              ...(defaultConfig.bookingCopy ?? {}),
              ...(parsed.bookingCopy ?? {}),
              billingHighlights: parsed.bookingCopy?.billingHighlights ?? defaultConfig.bookingCopy?.billingHighlights,
              paymentSupport: parsed.bookingCopy?.paymentSupport ?? defaultConfig.bookingCopy?.paymentSupport,
              paymentOptions: parsed.bookingCopy?.paymentOptions ?? defaultConfig.bookingCopy?.paymentOptions,
              schedulerPoints: parsed.bookingCopy?.schedulerPoints ?? defaultConfig.bookingCopy?.schedulerPoints,
              schedulerHelpText: parsed.bookingCopy?.schedulerHelpText ?? defaultConfig.bookingCopy?.schedulerHelpText,
            },
            hero: { ...defaultConfig.hero, ...(parsed.hero ?? {}) },
            about: { ...defaultConfig.about, ...(parsed.about ?? {}) },
            services: parsed.services ?? defaultConfig.services,
            consultations: parsed.consultations ?? defaultConfig.consultations,
            resources: normalizeCarouselResources(parsed.resources ?? defaultConfig.resources),
            forms: { ...(defaultConfig.forms ?? {}), ...(parsed.forms ?? {}) },
            formPages: { ...(defaultConfig.formPages ?? {}), ...(parsed.formPages ?? {}) },
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
      } catch {
        // If Supabase fetch fails (network error, timeout, etc.), fall through to file system or defaults
        // Don't throw - gracefully degrade to file system or default config
        // In production, if Supabase is configured, skip file system read (it's read-only anyway)
        if (process.env.NODE_ENV === "production") {
          return defaultConfig
        }
      }
    }
    // Only try file system read if not in production or if Supabase is not configured
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
        consent: { ...(defaultConfig.legal?.consent ?? {}), ...(parsed.legal?.consent ?? {}) },
      },
      clientCare: {
        downloads: parsed.clientCare?.downloads ?? defaultConfig.clientCare?.downloads,
        prepChecklist: parsed.clientCare?.prepChecklist ?? defaultConfig.clientCare?.prepChecklist,
        aftercareChecklist: parsed.clientCare?.aftercareChecklist ?? defaultConfig.clientCare?.aftercareChecklist,
      },
      contentSections: normalizeContentSectionsFixedLength(parsed.contentSections, defaultConfig.contentSections),
      footer: { ...defaultConfig.footer, ...(parsed.footer ?? {}) },
      financialAbusePage: parsed.financialAbusePage ?? defaultConfig.financialAbusePage,
      monetaryPsychotherapyPage: parsed.monetaryPsychotherapyPage ?? defaultConfig.monetaryPsychotherapyPage,
      financialAbuseTherapyPage: parsed.financialAbuseTherapyPage ?? defaultConfig.financialAbuseTherapyPage,
      familyFinancialAssistanceInheritancePage:
        parsed.familyFinancialAssistanceInheritancePage ?? defaultConfig.familyFinancialAssistanceInheritancePage,
      financialTraumaPage: parsed.financialTraumaPage ?? defaultConfig.financialTraumaPage,
      bookingCopy: {
        ...(defaultConfig.bookingCopy ?? {}),
        ...(parsed.bookingCopy ?? {}),
        billingHighlights: parsed.bookingCopy?.billingHighlights ?? defaultConfig.bookingCopy?.billingHighlights,
        paymentSupport: parsed.bookingCopy?.paymentSupport ?? defaultConfig.bookingCopy?.paymentSupport,
        paymentOptions: parsed.bookingCopy?.paymentOptions ?? defaultConfig.bookingCopy?.paymentOptions,
        schedulerPoints: parsed.bookingCopy?.schedulerPoints ?? defaultConfig.bookingCopy?.schedulerPoints,
        schedulerHelpText: parsed.bookingCopy?.schedulerHelpText ?? defaultConfig.bookingCopy?.schedulerHelpText,
      },
      hero: { ...defaultConfig.hero, ...(parsed.hero ?? {}) },
      about: { ...defaultConfig.about, ...(parsed.about ?? {}) },
      services: parsed.services ?? defaultConfig.services,
      consultations: parsed.consultations ?? defaultConfig.consultations,
      resources: normalizeCarouselResources(parsed.resources ?? defaultConfig.resources),
      forms: { ...(defaultConfig.forms ?? {}), ...(parsed.forms ?? {}) },
      formPages: { ...(defaultConfig.formPages ?? {}), ...(parsed.formPages ?? {}) },
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
      consent: { ...(defaultConfig.legal?.consent ?? {}), ...(newConfig.legal?.consent ?? {}) },
    },
    contentSections: normalizeContentSectionsFixedLength(newConfig.contentSections, defaultConfig.contentSections),
    footer: { ...defaultConfig.footer, ...(newConfig.footer ?? {}) },
    bookingCopy: {
      ...(defaultConfig.bookingCopy ?? {}),
      ...(newConfig.bookingCopy ?? {}),
      billingHighlights: newConfig.bookingCopy?.billingHighlights ?? defaultConfig.bookingCopy?.billingHighlights,
      paymentSupport: newConfig.bookingCopy?.paymentSupport ?? defaultConfig.bookingCopy?.paymentSupport,
      paymentOptions: newConfig.bookingCopy?.paymentOptions ?? defaultConfig.bookingCopy?.paymentOptions,
      schedulerPoints: newConfig.bookingCopy?.schedulerPoints ?? defaultConfig.bookingCopy?.schedulerPoints,
      schedulerHelpText: newConfig.bookingCopy?.schedulerHelpText ?? defaultConfig.bookingCopy?.schedulerHelpText,
    },
    hero: { ...defaultConfig.hero, ...newConfig.hero },
    about: { ...defaultConfig.about, ...newConfig.about },
    services: newConfig.services ?? defaultConfig.services,
    consultations: newConfig.consultations ?? defaultConfig.consultations,
    resources: normalizeCarouselResources(newConfig.resources ?? defaultConfig.resources),
    forms: { ...(defaultConfig.forms ?? {}), ...(newConfig.forms ?? {}) },
    formPages: { ...(defaultConfig.formPages ?? {}), ...(newConfig.formPages ?? {}) },
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


