 "use client"

import type React from "react"
 
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Save, Eye, LogOut, ImageIcon, FileText, DollarSign, Palette, Home, Info, Briefcase, Layout, FlaskConical, Building2, Menu, Phone, Search, Calendar, BookOpen, Clock, Bot, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { SiteConfig } from "@/lib/config"
import type { PostMeta, VideoMeta } from "@/lib/mdx"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
 
type ThemeState = {
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

const themeColorKeys: Array<keyof Pick<ThemeState, "primary" | "secondary" | "accent" | "background" | "foreground">> = ["primary", "secondary", "accent", "background", "foreground"] /*
  "primary",
  "secondary",
  "accent",
  "background",
  "foreground",
]

*/
const createEmptyHero = (): SiteConfig["hero"] => ({
  eyebrow: "",
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  primaryCta: { label: "", href: "" },
  secondaryCta: { label: "", href: "" },
  stats: [],
})

const createEmptyHomepage = (): NonNullable<SiteConfig["homepage"]> => ({
  sections: {
    showValueProps: true,
    showNewsletter: false,
    showImportantLinks: true,
    showImportantLinksCallButton: false,
    showTestimonials: true,
    showOtherAreas: true,
    showBooking: true,
    showFaqs: true,
    showContact: true,
    showCrisis: true,
    // Lead magnet popup should be opt-in.
    showLeadMagnet: false,
  },
  copy: {
    valuePropsEyebrow: "",
    valuePropsHeading: "",
    newsletterEyebrow: "",
    newsletterHeading: "",
    newsletterBody: "",
    newsletterCtaLabel: "",
    newsletterTags: [],
    importantLinksHeading: "",
    importantLinksSubheading: "",
    testimonialsEyebrow: "",
    testimonialsHeading: "",
    otherAreasHeading: "",
    otherAreasSubheading: "",
    bookingHeading: "",
    bookingSubheading: "",
    faqsEyebrow: "",
    faqsHeading: "",
    contactHeading: "",
    contactBody: "",
    crisisHeading: "",
    crisisBody: "",
    crisisNote: "",
  },
  otherAreas: [],
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
  valueProps: [],
  testimonials: [],
  faqs: [],
  leadMagnet: {
    heading: "",
    body: "",
    ctaLabel: "",
    ctaHref: "",
    helper: "",
  },
})

 export default function AdminPage() {
   const { toast } = useToast()
   const router = useRouter()
   const [loading, setLoading] = useState(true)
   const [saving, setSaving] = useState<null | string>(null)
  const [showAdvancedTabs, setShowAdvancedTabs] = useState(false)
  const [saveUi, setSaveUi] = useState<{
    phase: "idle" | "saving" | "verifying" | "done" | "error"
    progress: number
    message?: string
    version?: number | null
  }>({ phase: "idle", progress: 0 })
  const [loadedSnapshot, setLoadedSnapshot] = useState<string | null>(null)
  const [loadedConfig, setLoadedConfig] = useState<SiteConfig | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [versions, setVersions] = useState<Array<{ id: number; version: number; updated_at: string }>>([])
  const [versionsLoading, setVersionsLoading] = useState(false)

  const showSaveBar = saveUi.phase !== "idle"

   const redirectToLogin = (nextPath = "/admin") => {
     router.replace(`/admin/login?next=${encodeURIComponent(nextPath)}`)
   }
 
  function stableStringify(value: unknown): string {
    const seen = new WeakSet<object>()
    const normalize = (v: unknown): unknown => {
      if (v === null || typeof v !== "object") return v
      if (Array.isArray(v)) return v.map(normalize)
      if (seen.has(v)) return "[Circular]"
      seen.add(v)
      const rec = v as Record<string, unknown>
      const keys = Object.keys(rec).sort()
      const out: Record<string, unknown> = {}
      for (const k of keys) out[k] = normalize(rec[k])
      return out
    }
    return JSON.stringify(normalize(value))
  }

   // Theme state
  const [theme, setTheme] = useState<ThemeState>({
    mode: "light",
    primary: "#6CA4AC",
    secondary: "#E5EED2",
    accent: "#929D5B",
    background: "#E5EED2",
    foreground: "#20385B",
    radius: "0.5rem",
    fontSans: "",
    fontSerif: "",
  })
 
  // Content state
  const [heroContent, setHeroContent] = useState<SiteConfig["hero"]>(createEmptyHero())
 
   const [aboutContent, setAboutContent] = useState<SiteConfig["about"]>({
     title: "",
     paragraphs: [""],
   })
 
   const [services, setServices] = useState<SiteConfig["services"]>([])
  const [brand, setBrand] = useState<NonNullable<SiteConfig["brand"]>>({ name: "", subtitle: "", tagline: "", logoUrl: "", headerBannerUrl: "" })
  const [seo, setSeo] = useState<{ title?: string; description?: string; ogImage?: string }>({})
  const [navigation, setNavigation] = useState<{ label: string; href: string }[]>([])
  const [contact, setContact] = useState<{ phone?: string; email?: string; emailAlt?: string }>({})
  const [social, setSocial] = useState<NonNullable<SiteConfig["social"]>>({ facebook: "", instagram: "", linkedin: "" })
  const [consultations, setConsultations] = useState<{ format: string; price: string; duration: string }[]>([])
  const [resources, setResources] = useState<
    Array<{
      name: string
      number: string
      website?: string
      description?: string
      logoUrl?: string
      logoHeight?: number
    }>
  >([])
  const [homepage, setHomepage] = useState<NonNullable<SiteConfig["homepage"]>>(createEmptyHomepage())
  const [postsMeta, setPostsMeta] = useState<PostMeta[]>([])
  const [videosMeta, setVideosMeta] = useState<VideoMeta[]>([])
  const [newPostDraft, setNewPostDraft] = useState({ title: "", description: "" })
  const [newVideoDraft, setNewVideoDraft] = useState({ title: "", description: "", videoUrl: "" })
const [experiments, setExperiments] = useState<SiteConfig["experiments"]>({
  showNewsletterSection: true,
  // Lead magnet popup should be opt-in.
  showLeadMagnet: false,
})

  const [legal, setLegal] = useState<NonNullable<SiteConfig["legal"]>>({
    privacy: { title: "Privacy Policy", bodyMdx: "", downloadUrl: "" },
    terms: { title: "Terms of Service", bodyMdx: "", downloadUrl: "" },
    consent: { title: "Consent & Policies", bodyMdx: "", downloadUrl: "", requiredStatement: "" },
  })
  const [forms, setForms] = useState<NonNullable<SiteConfig["forms"]>>({
    enquiry: "/enquiry",
    consent: "/consent",
    intake: "/intake",
  })
  const [formPages, setFormPages] = useState<SiteConfig["formPages"]>({})
  const [formPagesEditor, setFormPagesEditor] = useState<{ enquiry: string; intake: string; newsletter: string }>({ enquiry: "", intake: "", newsletter: "" })
  const [clientCare, setClientCare] = useState<SiteConfig["clientCare"]>({ downloads: [] })
  const [contentSections, setContentSections] = useState<SiteConfig["contentSections"]>([])
  const [contentSectionPages, setContentSectionPages] = useState<SiteConfig["contentSectionPages"]>([])
  const [footer, setFooter] = useState<SiteConfig["footer"]>({
    copyrightText: "",
    companyName: "",
    acknowledgementText: "",
    quickLinks: [],
  })
  const [bookingCopy, setBookingCopy] = useState<SiteConfig["bookingCopy"]>({
    billingHighlights: [],
    paymentSupport: [],
    paymentOptions: [],
    schedulerPoints: [],
    schedulerHelpText: "",
  })
  const [financialAbusePage, setFinancialAbusePage] = useState<SiteConfig["financialAbusePage"]>({
    title: "",
    description: "",
    eyebrow: "",
    commonSigns: [],
    therapySupports: [],
    crisisText: "",
    nextStepsLinks: [],
  })
  const [monetaryPsychotherapyPage, setMonetaryPsychotherapyPage] = useState<SiteConfig["monetaryPsychotherapyPage"]>({
    eyebrow: "",
    title: "",
    subtitle: "",
    intro: "",
    designedFor: [],
    sessionFocus: [],
    therapeuticPrinciples: [],
    howWeBegin: [],
  })
  const [financialAbuseTherapyPage, setFinancialAbuseTherapyPage] = useState<SiteConfig["financialAbuseTherapyPage"]>({
    eyebrow: "",
    title: "",
    description: "",
    therapyApproach: [],
    sessionFormats: [],
    nextStepsLinks: [],
    faqs: [],
    seo: { metaTitle: "", metaDescription: "" },
  })

  const [familyFinancialAssistanceInheritancePage, setFamilyFinancialAssistanceInheritancePage] = useState<
    SiteConfig["familyFinancialAssistanceInheritancePage"]
  >({
    eyebrow: "",
    title: "",
    description: "",
    therapyApproach: [],
    sessionFormats: [],
    nextStepsLinks: [],
    faqs: [],
    seo: { metaTitle: "", metaDescription: "" },
  })

  const [financialTraumaPage, setFinancialTraumaPage] = useState<SiteConfig["financialTraumaPage"]>({
    eyebrow: "",
    title: "",
    description: "",
    therapyApproach: [],
    sessionFormats: [],
    nextStepsLinks: [],
    faqs: [],
    seo: { metaTitle: "", metaDescription: "" },
  })

  const [postEditor, setPostEditor] = useState<{
    open: boolean
    slug: string | null
    title: string | null
    mdx: string
    loading: boolean
    saving: boolean
    source: string | null
  }>({ open: false, slug: null, title: null, mdx: "", loading: false, saving: false, source: null })

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Dirty tracking must be computed AFTER state initialisation (avoids TDZ crash in production bundles).
  const buildSaveBody = (): Omit<SiteConfig, "meta"> => ({
    theme,
    hero: heroContent,
    about: aboutContent,
    financialAbusePage,
    monetaryPsychotherapyPage,
    financialAbuseTherapyPage,
    familyFinancialAssistanceInheritancePage,
    financialTraumaPage,
    services,
    brand,
    seo,
    navigation,
    contact,
    social,
    consultations,
    resources,
    experiments,
    homepage,
    legal,
    forms,
    formPages,
    clientCare,
    contentSections,
    contentSectionPages,
    footer,
    bookingCopy,
  })

  const currentSnapshot = stableStringify(buildSaveBody())
  const isDirty = Boolean(loadedSnapshot && loadedSnapshot !== currentSnapshot)
 
   useEffect(() => {
     async function load() {
       try {
         const res = await fetch("/api/site-config", { cache: "no-store" })
        if (res.status === 401) {
          redirectToLogin("/admin")
          return
        }
        if (!res.ok) throw new Error("Failed to load config")
        const data = await res.json()
        setTheme(data.theme)
        const heroDefaults = createEmptyHero()
        const nextHero = {
          ...heroDefaults,
          ...(data.hero ?? {}),
          primaryCta: { ...heroDefaults.primaryCta, ...(data.hero?.primaryCta ?? {}) },
          secondaryCta: { ...heroDefaults.secondaryCta, ...(data.hero?.secondaryCta ?? {}) },
          stats: data.hero?.stats ?? [],
        }
        setHeroContent(nextHero)
        const nextAbout = data.about
        const nextServices = data.services
        const nextBrand = data.brand ?? {}
        const nextSeo = data.seo ?? {}
        const nextNav = data.navigation ?? []
        const nextContact = data.contact ?? {}
       const nextSocial = data.social ?? {}
        const nextConsultations = data.consultations ?? []
        const nextResources = data.resources ?? []
       const nextLegal = data.legal ?? {}
       const nextForms = data.forms ?? {}
       const nextFormPages = data.formPages ?? {}
       const nextClientCare = data.clientCare ?? {}
       const nextContentSections = data.contentSections ?? []
       const nextContentSectionPages = data.contentSectionPages ?? []
       const nextFooter = data.footer ?? {}
       const nextBookingCopy = data.bookingCopy ?? {}
       const nextFinancialAbusePage = data.financialAbusePage ?? {
         title: "",
         description: "",
         eyebrow: "",
         commonSigns: [],
         therapySupports: [],
         crisisText: "",
         nextStepsLinks: [],
       }
       const nextMonetaryPsychotherapyPage = data.monetaryPsychotherapyPage ?? {
         eyebrow: "",
         title: "",
         subtitle: "",
         intro: "",
         designedFor: [],
         sessionFocus: [],
         therapeuticPrinciples: [],
         howWeBegin: [],
       }
       const nextFinancialAbuseTherapyPage = data.financialAbuseTherapyPage ?? {
         eyebrow: "",
         title: "",
         description: "",
         therapyApproach: [],
         sessionFormats: [],
         nextStepsLinks: [],
         faqs: [],
         seo: { metaTitle: "", metaDescription: "" },
       }
       const nextFamilyFinancialAssistanceInheritancePage = data.familyFinancialAssistanceInheritancePage ?? {
         eyebrow: "",
         title: "",
         description: "",
         therapyApproach: [],
         sessionFormats: [],
         nextStepsLinks: [],
         faqs: [],
         seo: { metaTitle: "", metaDescription: "" },
       }
       const nextFinancialTraumaPage = data.financialTraumaPage ?? {
         eyebrow: "",
         title: "",
         description: "",
         therapyApproach: [],
         sessionFormats: [],
         nextStepsLinks: [],
         faqs: [],
         seo: { metaTitle: "", metaDescription: "" },
       }
        setAboutContent(nextAbout)
        setFinancialAbusePage(nextFinancialAbusePage)
        setMonetaryPsychotherapyPage(nextMonetaryPsychotherapyPage)
        setFinancialAbuseTherapyPage(nextFinancialAbuseTherapyPage)
       setFamilyFinancialAssistanceInheritancePage(nextFamilyFinancialAssistanceInheritancePage)
       setFinancialTraumaPage(nextFinancialTraumaPage)
        setServices(nextServices)
        setBrand(nextBrand)
        setSeo(nextSeo)
        setNavigation(nextNav)
        setContact(nextContact)
        setSocial({ facebook: "", instagram: "", linkedin: "", ...(nextSocial ?? {}) })
        setConsultations(nextConsultations)
        setResources(nextResources)
        setLegal({
          privacy: { title: "Privacy Policy", bodyMdx: "", downloadUrl: "", ...(nextLegal.privacy ?? {}) },
          terms: { title: "Terms of Service", bodyMdx: "", downloadUrl: "", ...(nextLegal.terms ?? {}) },
          consent: {
            title: "Consent & Policies",
            bodyMdx: "",
            downloadUrl: "",
            requiredStatement: "",
            ...(nextLegal.consent ?? {}),
          },
        })
        setForms({
          enquiry: nextForms.enquiry ?? "/enquiry",
          consent: nextForms.consent ?? "/consent",
          intake: nextForms.intake ?? "/intake",
        })
        setFormPages(nextFormPages)
        setFormPagesEditor({
          enquiry: JSON.stringify(nextFormPages?.enquiry ?? {}, null, 2),
          intake: JSON.stringify(nextFormPages?.intake ?? {}, null, 2),
          newsletter: JSON.stringify(nextFormPages?.newsletter ?? {}, null, 2),
        })
        setClientCare({
          downloads: Array.isArray(nextClientCare.downloads) ? nextClientCare.downloads : [],
          prepChecklist: Array.isArray(nextClientCare.prepChecklist) ? nextClientCare.prepChecklist : [],
          aftercareChecklist: Array.isArray(nextClientCare.aftercareChecklist) ? nextClientCare.aftercareChecklist : [],
        })
        setContentSections(Array.isArray(nextContentSections) ? nextContentSections : [])
       setContentSectionPages(Array.isArray(nextContentSectionPages) ? nextContentSectionPages : [])
        setFooter({
          copyrightText: nextFooter.copyrightText ?? "",
          companyName: nextFooter.companyName ?? "",
          acknowledgementText: nextFooter.acknowledgementText ?? "",
          quickLinks: Array.isArray(nextFooter.quickLinks) ? nextFooter.quickLinks : [],
        })
        setBookingCopy({
          billingHighlights: Array.isArray(nextBookingCopy.billingHighlights) ? nextBookingCopy.billingHighlights : [],
          paymentSupport: Array.isArray(nextBookingCopy.paymentSupport) ? nextBookingCopy.paymentSupport : [],
          paymentOptions: Array.isArray(nextBookingCopy.paymentOptions) ? nextBookingCopy.paymentOptions : [],
          schedulerPoints: Array.isArray(nextBookingCopy.schedulerPoints) ? nextBookingCopy.schedulerPoints : [],
          schedulerHelpText: nextBookingCopy.schedulerHelpText ?? "",
        })
       const homepageDefaults = createEmptyHomepage()
       const nextHomepage = {
         ...homepageDefaults,
         ...(data.homepage ?? {}),
         sections: { ...(homepageDefaults.sections ?? {}), ...(data.homepage?.sections ?? {}) },
         copy: { ...(homepageDefaults.copy ?? {}), ...(data.homepage?.copy ?? {}) },
         otherAreas: data.homepage?.otherAreas ?? [],
         importantLinks: {
           ...(homepageDefaults.importantLinks ?? {}),
           ...(data.homepage?.importantLinks ?? {}),
           blogLinks: data.homepage?.importantLinks?.blogLinks ?? homepageDefaults.importantLinks?.blogLinks ?? [],
           specialistLinks: data.homepage?.importantLinks?.specialistLinks ?? homepageDefaults.importantLinks?.specialistLinks ?? [],
         },
         importantSectionLinks: data.homepage?.importantSectionLinks ?? homepageDefaults.importantSectionLinks ?? [],
         valueProps: data.homepage?.valueProps ?? [],
         testimonials: data.homepage?.testimonials ?? [],
         faqs: data.homepage?.faqs ?? [],
         leadMagnet: {
           ...homepageDefaults.leadMagnet,
           ...(data.homepage?.leadMagnet ?? {}),
         },
       }
       setHomepage(nextHomepage)
       const nextExperiments = {
         showNewsletterSection: data.experiments?.showNewsletterSection ?? true,
         showLeadMagnet: data.experiments?.showLeadMagnet ?? true,
       }
       setExperiments(nextExperiments)

       // baseline snapshot + revert point
       const baseline: SiteConfig = {
         meta: data.meta ?? undefined,
         theme: data.theme,
         hero: nextHero,
         about: nextAbout,
         services: nextServices,
         brand: nextBrand,
         seo: nextSeo,
         navigation: nextNav,
         contact: nextContact,
         social: { facebook: "", instagram: "", linkedin: "", ...(nextSocial ?? {}) },
         consultations: nextConsultations,
         resources: nextResources,
         homepage: nextHomepage,
         experiments: nextExperiments,
         legal: {
           privacy: { title: "Privacy Policy", bodyMdx: "", downloadUrl: "", ...(nextLegal.privacy ?? {}) },
           terms: { title: "Terms of Service", bodyMdx: "", downloadUrl: "", ...(nextLegal.terms ?? {}) },
          consent: {
            title: "Consent & Policies",
            bodyMdx: "",
            downloadUrl: "",
            requiredStatement: "",
            ...(nextLegal.consent ?? {}),
          },
         },
         forms: {
           enquiry: nextForms.enquiry ?? "/enquiry",
           consent: nextForms.consent ?? "/consent",
           intake: nextForms.intake ?? "/intake",
         },
        formPages: nextFormPages ?? {},
         clientCare: {
           downloads: Array.isArray(nextClientCare.downloads) ? nextClientCare.downloads : [],
           prepChecklist: Array.isArray(nextClientCare.prepChecklist) ? nextClientCare.prepChecklist : [],
           aftercareChecklist: Array.isArray(nextClientCare.aftercareChecklist) ? nextClientCare.aftercareChecklist : [],
         },
         contentSections: Array.isArray(nextContentSections) ? nextContentSections : [],
         footer: {
           copyrightText: nextFooter.copyrightText ?? "",
           companyName: nextFooter.companyName ?? "",
           acknowledgementText: nextFooter.acknowledgementText ?? "",
           quickLinks: Array.isArray(nextFooter.quickLinks) ? nextFooter.quickLinks : [],
         },
         bookingCopy: {
           billingHighlights: Array.isArray(nextBookingCopy.billingHighlights) ? nextBookingCopy.billingHighlights : [],
           paymentSupport: Array.isArray(nextBookingCopy.paymentSupport) ? nextBookingCopy.paymentSupport : [],
          paymentOptions: Array.isArray(nextBookingCopy.paymentOptions) ? nextBookingCopy.paymentOptions : [],
           schedulerPoints: Array.isArray(nextBookingCopy.schedulerPoints) ? nextBookingCopy.schedulerPoints : [],
           schedulerHelpText: nextBookingCopy.schedulerHelpText ?? "",
         },
       }
       setLoadedConfig(baseline)
       setLoadedSnapshot(stableStringify({
         theme: baseline.theme,
         hero: baseline.hero,
         about: baseline.about,
         services: baseline.services,
         brand: baseline.brand,
         seo: baseline.seo,
         navigation: baseline.navigation,
         contact: baseline.contact,
         social: baseline.social,
         consultations: baseline.consultations,
         resources: baseline.resources,
         experiments: baseline.experiments,
         homepage: baseline.homepage,
         legal: baseline.legal,
         forms: baseline.forms,
         formPages: baseline.formPages,
         clientCare: baseline.clientCare,
         contentSections: baseline.contentSections,
         footer: baseline.footer,
         bookingCopy: baseline.bookingCopy,
       }))
       setLastSavedAt(baseline.meta?.updatedAt ?? null)
       // Load version history (best-effort)
       void loadVersions()
       } catch {
         toast({ title: "Failed to load config", variant: "destructive" })
       } finally {
         setLoading(false)
       }
     }
     load()
    loadContent()
   }, [toast, router])

  async function loadVersions() {
    setVersionsLoading(true)
    try {
      const res = await fetch("/api/site-config/versions", { cache: "no-store" })
      if (res.status === 401) return
      const data = (await res.json().catch(() => null)) as { versions?: Array<{ id: number; version: number; updated_at: string }> } | null
      setVersions(Array.isArray(data?.versions) ? data!.versions : [])
    } finally {
      setVersionsLoading(false)
    }
  }

  async function rollbackTo(id: number) {
    const ok = window.confirm("Rollback will restore the site to that saved version. Continue?")
    if (!ok) return
    setSaving("rollback")
    setSaveUi({ phase: "saving", progress: 20, message: "Rolling back…" })
    try {
      const res = await fetch("/api/site-config/rollback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (res.status === 401) {
        toast({ title: "Session expired", description: "Please sign in again.", variant: "destructive" })
        redirectToLogin("/admin")
        return
      }
      if (!res.ok) throw new Error("Rollback failed")
      toast({ title: "Rolled back", description: "Reloading admin…" })
      window.location.reload()
    } catch (e: unknown) {
      toast({ title: "Rollback failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" })
      setSaveUi({ phase: "error", progress: 100, message: "Rollback failed" })
      window.setTimeout(() => setSaveUi({ phase: "idle", progress: 0 }), 2000)
    } finally {
      setSaving(null)
    }
  }

  useEffect(() => {
    if (!isDirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
      return ""
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [isDirty])

  function revertToLoaded() {
    if (!loadedConfig) return
    setTheme(loadedConfig.theme)
    setHeroContent(loadedConfig.hero)
    setAboutContent(loadedConfig.about)
    setServices(loadedConfig.services)
    setBrand(loadedConfig.brand ?? {})
    setSeo(loadedConfig.seo ?? {})
    setNavigation(loadedConfig.navigation ?? [])
    setContact(loadedConfig.contact ?? {})
    setSocial({ facebook: "", instagram: "", linkedin: "", ...(loadedConfig.social ?? {}) })
    setConsultations(loadedConfig.consultations ?? [])
    setResources(loadedConfig.resources ?? [])
    setHomepage(loadedConfig.homepage ?? createEmptyHomepage())
    setExperiments(loadedConfig.experiments ?? { showNewsletterSection: true, showLeadMagnet: false })
    setLegal({
      privacy: { title: "Privacy Policy", bodyMdx: "", downloadUrl: "", ...(loadedConfig.legal?.privacy ?? {}) },
      terms: { title: "Terms of Service", bodyMdx: "", downloadUrl: "", ...(loadedConfig.legal?.terms ?? {}) },
      consent: {
        title: "Consent & Policies",
        bodyMdx: "",
        downloadUrl: "",
        requiredStatement: "",
        ...(loadedConfig.legal?.consent ?? {}),
      },
    })
    setForms({
      enquiry: loadedConfig.forms?.enquiry ?? "/enquiry",
      consent: loadedConfig.forms?.consent ?? "/consent",
      intake: loadedConfig.forms?.intake ?? "/intake",
    })
    setFormPages(loadedConfig.formPages ?? {})
    setFormPagesEditor({
      enquiry: JSON.stringify(loadedConfig.formPages?.enquiry ?? {}, null, 2),
      intake: JSON.stringify(loadedConfig.formPages?.intake ?? {}, null, 2),
      newsletter: JSON.stringify(loadedConfig.formPages?.newsletter ?? {}, null, 2),
    })
    setClientCare({
      downloads: loadedConfig.clientCare?.downloads ?? [],
      prepChecklist: loadedConfig.clientCare?.prepChecklist ?? [],
      aftercareChecklist: loadedConfig.clientCare?.aftercareChecklist ?? [],
    })
    setContentSectionPages(loadedConfig.contentSectionPages ?? [])
    setFinancialAbusePage(loadedConfig.financialAbusePage ?? {
      title: "",
      description: "",
      eyebrow: "",
      commonSigns: [],
      therapySupports: [],
      crisisText: "",
      nextStepsLinks: [],
    })
    setMonetaryPsychotherapyPage(loadedConfig.monetaryPsychotherapyPage ?? {
      eyebrow: "",
      title: "",
      subtitle: "",
      intro: "",
      designedFor: [],
      sessionFocus: [],
      therapeuticPrinciples: [],
      howWeBegin: [],
    })
    setFinancialAbuseTherapyPage(loadedConfig.financialAbuseTherapyPage ?? {
      eyebrow: "",
      title: "",
      description: "",
      therapyApproach: [],
      sessionFormats: [],
      nextStepsLinks: [],
      faqs: [],
      seo: { metaTitle: "", metaDescription: "" },
    })
    setFamilyFinancialAssistanceInheritancePage(loadedConfig.familyFinancialAssistanceInheritancePage ?? {
      eyebrow: "",
      title: "",
      description: "",
      therapyApproach: [],
      sessionFormats: [],
      nextStepsLinks: [],
      faqs: [],
      seo: { metaTitle: "", metaDescription: "" },
    })
    setFinancialTraumaPage(loadedConfig.financialTraumaPage ?? {
      eyebrow: "",
      title: "",
      description: "",
      therapyApproach: [],
      sessionFormats: [],
      nextStepsLinks: [],
      faqs: [],
      seo: { metaTitle: "", metaDescription: "" },
    })
    setBookingCopy({
      billingHighlights: loadedConfig.bookingCopy?.billingHighlights ?? [],
      paymentSupport: loadedConfig.bookingCopy?.paymentSupport ?? [],
      paymentOptions: loadedConfig.bookingCopy?.paymentOptions ?? [],
      schedulerPoints: loadedConfig.bookingCopy?.schedulerPoints ?? [],
      schedulerHelpText: loadedConfig.bookingCopy?.schedulerHelpText ?? "",
    })
    toast({ title: "Reverted", description: "Changes reverted to last loaded state." })
  }

  async function pickFile(accept?: string): Promise<File | null> {
    return await new Promise((resolve) => {
      const input = document.createElement("input")
      input.type = "file"
      if (accept) input.accept = accept
      // Some browsers can fail to fire `change` reliably if the input isn't attached to the DOM.
      // Also, if the user closes the dialog without selecting, we should resolve `null` instead of hanging.
      input.style.position = "fixed"
      input.style.left = "-9999px"
      input.style.top = "-9999px"
      input.style.width = "1px"
      input.style.height = "1px"
      input.style.opacity = "0"

      let settled = false
      const settle = (file: File | null) => {
        if (settled) return
        settled = true
        try {
          window.removeEventListener("focus", onFocus, true)
        } catch {
          // ignore
        }
        try {
          input.remove()
        } catch {
          // ignore
        }
        resolve(file)
      }

      const onFocus = () => {
        // When the file dialog closes, the window regains focus.
        // If `change` didn't fire, resolve with whatever we have (often null).
        setTimeout(() => {
          settle(input.files?.[0] ?? null)
        }, 0)
      }

      input.addEventListener(
        "change",
        () => {
          settle(input.files?.[0] ?? null)
        },
        { once: true },
      )

      window.addEventListener("focus", onFocus, true)
      document.body.appendChild(input)
      input.click()

      // Failsafe: never hang forever.
      setTimeout(() => {
        settle(input.files?.[0] ?? null)
      }, 60_000)
    })
  }

  async function uploadAsset(params: { path: string; accept?: string }) {
    const file = await pickFile(params.accept)
    if (!file) return null
    const filename = String(file.name ?? "").trim()
    const rawExt = filename.includes(".") ? filename.split(".").pop() ?? "" : ""
    const safeExt = rawExt && /^[a-z0-9]{1,8}$/i.test(rawExt) ? `.${rawExt.toLowerCase()}` : ""
    const pathWithExt = params.path.includes("{{ext}}")
      ? params.path.replace("{{ext}}", safeExt || ".bin")
      : params.path
    const body = new FormData()
    body.set("path", pathWithExt)
    body.set("file", file)
    const res = await fetch("/api/admin/upload", { method: "POST", body })
    if (res.status === 401) {
      toast({ title: "Session expired", description: "Please sign in again.", variant: "destructive" })
      redirectToLogin("/admin")
      return null
    }
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string }
      throw new Error(err.error ?? "Upload failed")
    }
    const data = (await res.json().catch(() => null)) as { url?: string } | null
    if (!data?.url) throw new Error("Upload did not return a URL")
    // Cache-bust: many assets are uploaded to a stable path (upsert). Append a version query so
    // browsers/CDNs will fetch the new bytes immediately after replacement.
    return `${data.url}${data.url.includes("?") ? "&" : "?"}v=${Date.now()}`
  }

  function slugifyAdmin(input: string): string {
    return String(input ?? "")
      .toLowerCase()
      .trim()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  async function openPostEditor(post: PostMeta) {
    setPostEditor({ open: true, slug: post.slug, title: post.title, mdx: "", loading: true, saving: false, source: null })
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(post.slug)}`, { cache: "no-store" })
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(err.error ?? "Unable to load article content")
      }
      const data = (await res.json().catch(() => null)) as { mdx?: string; source?: string } | null
      setPostEditor((prev) => ({ ...prev, mdx: data?.mdx ?? "", source: data?.source ?? null, loading: false }))
    } catch (e: unknown) {
      toast({ title: "Load failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" })
      setPostEditor((prev) => ({ ...prev, loading: false }))
    }
  }

  async function savePostEditor() {
    if (!postEditor.slug) return
    setPostEditor((prev) => ({ ...prev, saving: true }))
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(postEditor.slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mdx: postEditor.mdx }),
      })
      if (res.status === 401) {
        toast({ title: "Session expired", description: "Please sign in again.", variant: "destructive" })
        redirectToLogin("/admin")
        return
      }
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(err.error ?? "Save failed")
      }
      toast({ title: "Saved", description: "Article updated." })
      // Refresh meta list (title/description/date could change)
      await loadContent()
      setPostEditor((prev) => ({ ...prev, saving: false, open: false }))
    } catch (e: unknown) {
      toast({ title: "Save failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" })
      setPostEditor((prev) => ({ ...prev, saving: false }))
    }
  }
 
   async function saveAll(section?: string) {
     if (!isDirty) {
       toast({ title: "No changes", description: "There’s nothing new to save." })
       return
     }
     setSaving(section ?? "all")
    setSaveUi({ phase: "saving", progress: 12, message: "Saving changes…" })

    let tick = 12
    const interval = window.setInterval(() => {
      tick = Math.min(85, tick + Math.random() * 7)
      setSaveUi((prev) => (prev.phase === "saving" ? { ...prev, progress: tick } : prev))
    }, 250)

     try {
       const snapshotBeforeSave = currentSnapshot
       const res = await fetch("/api/site-config", {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(buildSaveBody()),
       })
       if (res.status === 401) {
         toast({ title: "Session expired", description: "Please sign in again.", variant: "destructive" })
         redirectToLogin("/admin")
         return
       }
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(err.error ?? "Save failed")
      }
      const payload = (await res.json().catch(() => ({}))) as { version?: number | null; updatedAt?: string | null }

      toast({ title: "Saved", description: section ? `${section} updated` : "All changes saved" })
      setLastSavedAt(payload.updatedAt ?? new Date().toISOString())

      // Verify the public site sees the same version (best-effort "deployed" signal).
      const targetVersion = payload.version ?? null
      setSaveUi({ phase: "verifying", progress: 92, message: "Verifying live site…", version: targetVersion })

      const started = Date.now()
      let verified = false
      while (Date.now() - started < 15000) {
        const checkRes = await fetch("/api/site-config", { cache: "no-store" })
        const check = (await checkRes.json().catch(() => null)) as SiteConfig | null
        const liveVersion = check?.meta?.version ?? null
        if (targetVersion && liveVersion === targetVersion) {
          verified = true
          break
        }
        await new Promise((r) => setTimeout(r, 500))
      }

      if (verified) {
        setSaveUi({ phase: "done", progress: 100, message: "Live on site" })
        setLoadedSnapshot(snapshotBeforeSave)
        setLoadedConfig((prev) =>
          prev
            ? { ...prev, meta: { version: targetVersion ?? prev.meta?.version ?? Date.now(), updatedAt: payload.updatedAt ?? new Date().toISOString() } }
            : null
        )
        window.setTimeout(() => setSaveUi({ phase: "idle", progress: 0 }), 1200)
      } else {
        setSaveUi({ phase: "error", progress: 100, message: "Saved, but live verification timed out" })
        setLoadedSnapshot(snapshotBeforeSave)
        window.setTimeout(() => setSaveUi({ phase: "idle", progress: 0 }), 2500)
      }
     } catch (error: unknown) {
       const description = error instanceof Error ? error.message : "Unable to save"
       toast({ title: "Save failed", description, variant: "destructive" })
      setSaveUi({ phase: "error", progress: 100, message: "Save failed" })
      window.setTimeout(() => setSaveUi({ phase: "idle", progress: 0 }), 2500)
     } finally {
      window.clearInterval(interval)
       setSaving(null)
     }
   }

  async function loadContent() {
    try {
      const [postsRes, videosRes] = await Promise.all([fetch("/api/posts"), fetch("/api/videos")])
      if (postsRes.status === 401 || videosRes.status === 401) {
        toast({ title: "Session expired", description: "Please sign in again.", variant: "destructive" })
        redirectToLogin("/admin")
        return
      }
      const postsData = await postsRes.json()
      const videosData = await videosRes.json()
      setPostsMeta(postsData)
      setVideosMeta(videosData)
    } catch {
      toast({ title: "Failed to load content", variant: "destructive" })
    }
  }

  async function createPostDraft() {
    if (!newPostDraft.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" })
      return
    }
    setSaving("content-post")
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newPostDraft.title.trim(),
          description: newPostDraft.description.trim(),
        }),
      })
      if (res.status === 401) {
        toast({ title: "Session expired", description: "Please sign in again.", variant: "destructive" })
        redirectToLogin("/admin")
        return
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Unable to create post")
      }
      toast({ title: "Post draft created" })
      setNewPostDraft({ title: "", description: "" })
      await loadContent()
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : "Unable to create post"
      toast({ title: "Error", description, variant: "destructive" })
    } finally {
      setSaving(null)
    }
  }

  async function createVideoDraft() {
    if (!newVideoDraft.title.trim() || !newVideoDraft.videoUrl.trim()) {
      toast({ title: "Title and video URL are required", variant: "destructive" })
      return
    }
    setSaving("content-video")
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newVideoDraft.title.trim(),
          description: newVideoDraft.description.trim(),
          videoUrl: newVideoDraft.videoUrl.trim(),
        }),
      })
      if (res.status === 401) {
        toast({ title: "Session expired", description: "Please sign in again.", variant: "destructive" })
        redirectToLogin("/admin")
        return
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Unable to create video")
      }
      toast({ title: "Video draft created" })
      setNewVideoDraft({ title: "", description: "", videoUrl: "" })
      await loadContent()
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : "Unable to create video"
      toast({ title: "Error", description, variant: "destructive" })
    } finally {
      setSaving(null)
    }
  }

  const updateTheme = <K extends keyof ThemeState>(key: K, value: ThemeState[K]) => {
    setTheme((prev) => ({ ...prev, [key]: value }))
  }
 
function AssistantBox({ onSaved }: { onSaved: () => void }) {
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  async function run() {
    if (!input.trim()) return
    setBusy(true)
    try {
      const res = await fetch("/api/site-config/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      })
      if (!res.ok) throw new Error("Assistant failed")
      onSaved()
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="space-y-3">
      <Textarea
        placeholder='Examples: set primary to #4169e1; dark mode on; hero title to "Financial Therapy in Melbourne"; add service "Telehealth" price $150'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
      />
      <div className="flex gap-3">
        <Button onClick={run} disabled={busy}>
          {busy ? "Applying..." : "Apply"}
        </Button>
        <Button variant="outline" onClick={() => setInput("")} disabled={busy}>
          Clear
        </Button>
      </div>
    </div>
  )
}

function CodeAgentBox() {
  const { toast } = useToast()
  const [prompt, setPrompt] = useState("")
  const [busy, setBusy] = useState(false)
  const [lastIssueUrl, setLastIssueUrl] = useState<string | null>(null)
  const [lastIssueNumber, setLastIssueNumber] = useState<number | null>(null)
  const [status, setStatus] = useState<{
    phase: "idle" | "queued" | "searching" | "pr_found"
    prUrl?: string | null
    prState?: string | null
    message?: string
  }>({ phase: "idle" })

  useEffect(() => {
    if (!lastIssueNumber) return
    let cancelled = false
    let tries = 0
    setStatus({ phase: "queued", message: "Queued. Waiting for workflow to start…" })

    const poll = async () => {
      tries += 1
      try {
        setStatus((prev) => ({ ...prev, phase: "searching", message: "Checking for PR…" }))
        const res = await fetch(`/api/admin/code-agent/status?issue=${lastIssueNumber}`, { cache: "no-store" })
        if (!res.ok) return
        const data = (await res.json().catch(() => null)) as { pr?: { url: string; state: string } | null } | null
        const pr = data?.pr ?? null
        if (pr?.url) {
          if (cancelled) return
          setStatus({ phase: "pr_found", prUrl: pr.url, prState: pr.state, message: "PR created" })
          return
        }
      } catch {
        // ignore transient errors
      }
      if (tries < 60 && !cancelled) {
        window.setTimeout(poll, 5000)
      } else if (!cancelled) {
        setStatus({ phase: "queued", message: "Still queued. Check the GitHub issue for workflow logs." })
      }
    }

    window.setTimeout(poll, 1500)
    return () => {
      cancelled = true
    }
  }, [lastIssueNumber])

  async function run() {
    if (!prompt.trim()) return
    setBusy(true)
    try {
      const res = await fetch("/api/admin/code-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = (await res.json().catch(() => ({}))) as { url?: string | null; number?: number | null; error?: string }
      if (!res.ok) throw new Error(data.error ?? "Unable to create agent issue")
      setLastIssueUrl(data.url ?? null)
      setLastIssueNumber(typeof data.number === "number" ? data.number : null)
      toast({ title: "Agent queued", description: "Created a GitHub issue to open a PR." })
      setPrompt("")
    } catch (e: unknown) {
      toast({
        title: "Agent failed",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        placeholder='Describe a code change. Example: "Add a toggle in Admin to hide the Testimonials section."'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Button onClick={run} disabled={busy || !prompt.trim()}>
            {busy ? "Creating…" : "Create PR via Agent"}
          </Button>
          <Button variant="outline" onClick={() => setPrompt("")} disabled={busy}>
            Clear
          </Button>
        </div>
        {lastIssueUrl && (
          <a className="text-sm underline text-[var(--accent)]" href={lastIssueUrl} target="_blank" rel="noreferrer noopener">
            View GitHub issue
          </a>
        )}
      </div>
      {status.phase !== "idle" && (
        <div className="rounded-lg border border-border/40 p-3 text-sm">
          <p className="text-muted-foreground">{status.message ?? "Working…"}</p>
          {status.prUrl && (
            <p className="mt-2">
              <a className="underline text-[var(--accent)]" href={status.prUrl} target="_blank" rel="noreferrer noopener">
                View PR ({status.prState})
              </a>
            </p>
          )}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        This creates a GitHub issue labeled <code>agent</code>. A GitHub Action will generate a PR for review.
      </p>
    </div>
  )
}
   async function logout() {
     await fetch("/api/auth/logout", { method: "POST" })
     router.replace("/admin/login")
   }
 
  const handleImageUpload = async (section: "Profile Photo" | "Background Images" | "Logo" | "Header Banner" | "OG Image") => {
    try {
      const base =
        section === "Profile Photo"
          ? "images/profile"
          : section === "Background Images"
            ? "images/background"
            : section === "Logo"
              ? "images/logo"
              : section === "Header Banner"
                ? "images/header-banner"
                : "images/og"

      const url = await uploadAsset({ path: `${base}{{ext}}`, accept: "image/*" })
      if (!url) return

      if (section === "Profile Photo") {
        setHeroContent((prev) => ({ ...prev, imageUrl: url }))
        setImageErrors((prev) => ({ ...prev, hero: false }))
      } else if (section === "Logo") {
        setBrand((prev) => ({ ...prev, logoUrl: url }))
        setImageErrors((prev) => ({ ...prev, logo: false }))
      } else if (section === "Header Banner") {
        setBrand((prev) => ({ ...prev, headerBannerUrl: url }))
        setImageErrors((prev) => ({ ...prev, banner: false }))
      } else if (section === "OG Image") {
        setSeo((prev) => ({ ...prev, ogImage: url }))
        setImageErrors((prev) => ({ ...prev, og: false }))
      } else {
        // Background images aren't currently a first-class config field; store in brand headerBannerUrl as a safe default.
        setBrand((prev) => ({ ...prev, headerBannerUrl: url }))
        setImageErrors((prev) => ({ ...prev, banner: false }))
      }

      toast({ title: "Uploaded", description: `${section} updated. Click Save to apply changes.` })
    } catch (e: unknown) {
      toast({ title: "Upload failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" })
    }
  }
 
   return (
     <div className="min-h-screen bg-muted">
      {showSaveBar && (
        <div className="fixed inset-x-0 top-0 z-[60]">
          <Progress value={saveUi.progress} className="h-1 rounded-none" />
          <div className="bg-background/80 backdrop-blur border-b border-border/40 px-4 py-1 text-xs text-muted-foreground">
            {saveUi.message ?? "Working…"}
          </div>
        </div>
      )}
       {/* Header */}
       <header className="bg-primary text-primary-foreground py-4 sticky top-0 z-10 shadow-lg">
         <div className="container mx-auto px-4">
           <div className="flex items-center justify-between">
             <div>
               <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm opacity-80">The Financial Therapist</p>
             </div>
             <div className="flex items-center gap-4">
              {!loading && (
                <div
                  className={[
                    "hidden sm:flex items-center gap-2 rounded-full px-3 py-1.5 text-xs border",
                    isDirty ? "bg-yellow-500/10 border-yellow-500/30" : "bg-green-500/10 border-green-500/30",
                  ].join(" ")}
                >
                  <span className={`inline-block h-2 w-2 rounded-full ${isDirty ? "bg-yellow-500" : "bg-green-500"}`} />
                  <span className={isDirty ? "font-medium" : ""}>
                    {isDirty ? "Unsaved changes" : "All changes saved"}
                  </span>
                  {lastSavedAt && !isDirty && (
                    <span className="opacity-75">
                      · {new Date(lastSavedAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>
              )}
              {isDirty && (
                <Button
                  size="sm"
                  onClick={() => saveAll()}
                  disabled={saving !== null}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save All
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-[var(--section-bg-1)]/20"
                onClick={revertToLoaded}
                disabled={!isDirty || saving !== null}
              >
                Revert
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-[var(--section-bg-1)]/20"
                 onClick={() => window.open("/", "_blank")}
               >
                 <Eye className="w-4 h-4 mr-2" />
                 Preview Site
               </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-[var(--section-bg-1)]/20"
                 onClick={logout}
               >
                 <LogOut className="w-4 h-4 mr-2" />
                 Logout
               </Button>
             </div>
           </div>
         </div>
       </header>
 
       <div className="container mx-auto px-4 py-8">
         <Tabs defaultValue="hero" className="space-y-6">
           <div className="flex items-center justify-between gap-3 flex-wrap">
             <p className="text-sm font-semibold text-[var(--foreground)]">Admin sections</p>
             <Button
               type="button"
               variant="outline"
               size="sm"
               onClick={() => setShowAdvancedTabs((prev) => !prev)}
             >
               {showAdvancedTabs ? "Hide advanced" : "Show advanced"}
             </Button>
           </div>

        <TabsList className="flex w-full flex-wrap gap-2 max-w-full overflow-x-auto pb-2">
            <TabsTrigger value="hero" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Hero</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">About</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Pages</span>
            </TabsTrigger>
            <TabsTrigger value="homepage" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              <span className="hidden sm:inline">Homepage</span>
            </TabsTrigger>
            <TabsTrigger value="content-sections" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Homepage Buttons</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Blog & Videos</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="consultations" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Consultations</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Images</span>
            </TabsTrigger>

            {showAdvancedTabs ? (
              <>
                <TabsTrigger value="theme" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Theme</span>
                </TabsTrigger>
                <TabsTrigger value="brand" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Brand</span>
                </TabsTrigger>
                <TabsTrigger value="nav" className="flex items-center gap-2">
                  <Menu className="w-4 h-4" />
                  <span className="hidden sm:inline">Navigation</span>
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">Contact</span>
                </TabsTrigger>
                <TabsTrigger value="seo" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">SEO</span>
                </TabsTrigger>
                <TabsTrigger value="footer" className="flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  <span className="hidden sm:inline">Footer</span>
                </TabsTrigger>
                <TabsTrigger value="experiments" className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4" />
                  <span className="hidden sm:inline">Experiments</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                </TabsTrigger>
                <TabsTrigger value="assistant" className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <span className="hidden sm:inline">Assistant</span>
                </TabsTrigger>
              </>
            ) : null}
          </TabsList>
 
           {/* Hero Section Tab */}
           <TabsContent value="hero" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Home className="w-5 h-5" />
                   Edit Hero Section
                 </CardTitle>
                 <CardDescription>Update the main headline and description on your homepage</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-eyebrow">Eyebrow / Tagline</Label>
                  <p className="text-xs text-muted-foreground">A short line that appears above the main title (optional)</p>
                  <Input
                    id="hero-eyebrow"
                    value={heroContent.eyebrow ?? ""}
                    onChange={(e) => setHeroContent((prev) => ({ ...prev, eyebrow: e.target.value }))}
                    placeholder="e.g., Welcome, or Your Trusted Therapist"
                  />
                </div>
                 <div className="space-y-2">
                   <Label htmlFor="hero-title">Main Title</Label>
                   <p className="text-xs text-muted-foreground">This is the main headline visitors see first. Make it clear and compelling.</p>
                   <Input
                     id="hero-title"
                     value={heroContent.title}
                     onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                     className="text-lg"
                     placeholder="e.g., Healing from Financial Abuse"
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="hero-subtitle">Subtitle</Label>
                   <p className="text-xs text-muted-foreground">A supporting line that appears below the main title (optional)</p>
                   <Input
                     id="hero-subtitle"
                     value={heroContent.subtitle}
                     onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                     placeholder="e.g., Specialized therapy for financial trauma"
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="hero-description">Description</Label>
                   <p className="text-xs text-muted-foreground">A longer description that explains your services. This appears below the title and subtitle.</p>
                   <Textarea
                     id="hero-description"
                     value={heroContent.description}
                     onChange={(e) => setHeroContent({ ...heroContent, description: e.target.value })}
                     rows={4}
                     placeholder="Describe your approach, expertise, and how you help clients..."
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="hero-image">Hero Image URL</Label>
                   <p className="text-xs text-muted-foreground">Upload an image in the Images tab, or paste a URL. Recommended size: 1200x800px.</p>
                   <Input
                     id="hero-image"
                     value={heroContent.imageUrl}
                     onChange={(e) => setHeroContent({ ...heroContent, imageUrl: e.target.value })}
                   />
                 </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hero-primary-label">Primary CTA Label</Label>
                    <p className="text-xs text-muted-foreground">Text for the main call-to-action button</p>
                    <Input
                      id="hero-primary-label"
                      value={heroContent.primaryCta?.label ?? ""}
                      onChange={(e) =>
                        setHeroContent((prev) => ({
                          ...prev,
                          primaryCta: { ...(prev.primaryCta ?? { label: "", href: "" }), label: e.target.value },
                        }))
                      }
                      placeholder="e.g., Book Appointment"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-primary-href">Primary CTA URL</Label>
                    <p className="text-xs text-muted-foreground">Where the button links to (e.g., /bookings or /contact)</p>
                    <Input
                      id="hero-primary-href"
                      value={heroContent.primaryCta?.href ?? ""}
                      onChange={(e) =>
                        setHeroContent((prev) => ({
                          ...prev,
                          primaryCta: { ...(prev.primaryCta ?? { label: "", href: "" }), href: e.target.value },
                        }))
                      }
                      placeholder="e.g., /bookings"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hero-secondary-label">Secondary CTA Label</Label>
                    <p className="text-xs text-muted-foreground">Text for the secondary button (optional)</p>
                    <Input
                      id="hero-secondary-label"
                      value={heroContent.secondaryCta?.label ?? ""}
                      onChange={(e) =>
                        setHeroContent((prev) => ({
                          ...prev,
                          secondaryCta: { ...(prev.secondaryCta ?? { label: "", href: "" }), label: e.target.value },
                        }))
                      }
                      placeholder="e.g., Learn More"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-secondary-href">Secondary CTA URL</Label>
                    <p className="text-xs text-muted-foreground">Where the secondary button links to (optional)</p>
                    <Input
                      id="hero-secondary-href"
                      value={heroContent.secondaryCta?.href ?? ""}
                      onChange={(e) =>
                        setHeroContent((prev) => ({
                          ...prev,
                          secondaryCta: { ...(prev.secondaryCta ?? { label: "", href: "" }), href: e.target.value },
                        }))
                      }
                      placeholder="e.g., /about"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Hero Stats</Label>
                  {(heroContent.stats ?? []).map((stat, idx) => (
                    <div key={`${stat.label}-${idx}`} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] items-end rounded-lg border border-border/50 p-3">
                      <div className="space-y-1">
                        <Label>Value</Label>
                        <Input
                          value={stat.value}
                          onChange={(e) =>
                            setHeroContent((prev) => {
                              const nextStats = [...(prev.stats ?? [])]
                              nextStats[idx] = { ...nextStats[idx], value: e.target.value }
                              return { ...prev, stats: nextStats }
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Label</Label>
                        <Input
                          value={stat.label}
                          onChange={(e) =>
                            setHeroContent((prev) => {
                              const nextStats = [...(prev.stats ?? [])]
                              nextStats[idx] = { ...nextStats[idx], label: e.target.value }
                              return { ...prev, stats: nextStats }
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Description</Label>
                        <Input
                          value={stat.description ?? ""}
                          onChange={(e) =>
                            setHeroContent((prev) => {
                              const nextStats = [...(prev.stats ?? [])]
                              nextStats[idx] = { ...nextStats[idx], description: e.target.value }
                              return { ...prev, stats: nextStats }
                            })
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setHeroContent((prev) => {
                            const nextStats = [...(prev.stats ?? [])]
                            nextStats.splice(idx, 1)
                            return { ...prev, stats: nextStats }
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setHeroContent((prev) => ({
                        ...prev,
                        stats: [...(prev.stats ?? []), { label: "", value: "", description: "" }],
                      }))
                    }
                  >
                    + Add Stat
                  </Button>
                </div>
                 <Button onClick={() => saveAll("Hero Section")} disabled={saving !== null}>
                   <Save className="w-4 h-4 mr-2" />
                   Save Changes
                 </Button>
               </CardContent>
             </Card>
           </TabsContent>
 
           {/* About Section Tab */}
           <TabsContent value="about" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <FileText className="w-5 h-5" />
                   Edit About Section
                 </CardTitle>
                 <CardDescription>Update your practice description and approach</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label htmlFor="about-title">Section Title</Label>
                   <Input
                     id="about-title"
                     value={aboutContent.title}
                     onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                     className="text-lg"
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="about-para1">Paragraph 1</Label>
                   <Textarea
                     id="about-para1"
                     value={aboutContent.paragraphs[0]}
                     onChange={(e) => {
                       const newParagraphs = [...aboutContent.paragraphs]
                       newParagraphs[0] = e.target.value
                       setAboutContent({ ...aboutContent, paragraphs: newParagraphs })
                     }}
                     rows={3}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="about-para2">Paragraph 2</Label>
                   <Textarea
                     id="about-para2"
                     value={aboutContent.paragraphs[1]}
                     onChange={(e) => {
                       const newParagraphs = [...aboutContent.paragraphs]
                       newParagraphs[1] = e.target.value
                       setAboutContent({ ...aboutContent, paragraphs: newParagraphs })
                     }}
                     rows={3}
                   />
                 </div>
                 <Button onClick={() => saveAll("About Section")} disabled={saving !== null}>
                   <Save className="w-4 h-4 mr-2" />
                   Save Changes
                 </Button>
               </CardContent>
             </Card>
           </TabsContent>

           {/* Pages Tab (grouped) */}
           <TabsContent value="pages" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <FileText className="w-5 h-5" />
                   Pages
                 </CardTitle>
                 <CardDescription>Edit the key standalone pages (grouped for easier navigation)</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                {(() => {
                  const pages = Array.isArray(contentSectionPages) && contentSectionPages.length ? contentSectionPages : []
                  const defaultSlug = pages[0]?.slug ?? "why-money-triggers-anxiety"
                  return (
                    <Tabs defaultValue={defaultSlug} className="space-y-6">
                      <TabsList className="flex w-full flex-wrap gap-2">
                        {pages.map((p) => (
                          <TabsTrigger key={p.slug} value={p.slug} className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>{p.title || p.slug}</span>
                            <span className="text-xs text-muted-foreground hidden md:inline">{`/content-sections/${p.slug}`}</span>
                          </TabsTrigger>
                        ))}
                      </TabsList>

                  {pages.map((p, idx) => (
                    <TabsContent key={`page-${p.slug}`} value={p.slug} className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Edit Page
                          </CardTitle>
                          <CardDescription>{`Update content for /content-sections/${p.slug}`}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Eyebrow Text</Label>
                            <Input
                              value={p.eyebrow ?? ""}
                              onChange={(e) => {
                                const next = [...pages]
                                next[idx] = { ...next[idx], eyebrow: e.target.value }
                                setContentSectionPages(next)
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={p.title ?? ""}
                              onChange={(e) => {
                                const next = [...pages]
                                next[idx] = { ...next[idx], title: e.target.value }
                                setContentSectionPages(next)
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={p.description ?? ""}
                              onChange={(e) => {
                                const next = [...pages]
                                next[idx] = { ...next[idx], description: e.target.value }
                                setContentSectionPages(next)
                              }}
                              rows={4}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Therapy Approach (one per line)</Label>
                            <Textarea
                              value={(p.therapyApproach ?? []).join("\n")}
                              onChange={(e) => {
                                const next = [...pages]
                                next[idx] = { ...next[idx], therapyApproach: e.target.value.split("\n").filter(Boolean) }
                                setContentSectionPages(next)
                              }}
                              rows={5}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Session Formats (one per line)</Label>
                            <Textarea
                              value={(p.sessionFormats ?? []).join("\n")}
                              onChange={(e) => {
                                const next = [...pages]
                                next[idx] = { ...next[idx], sessionFormats: e.target.value.split("\n").filter(Boolean) }
                                setContentSectionPages(next)
                              }}
                              rows={4}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Next Steps Links</Label>
                            {(p.nextStepsLinks ?? []).map((link, linkIdx) => (
                              <div key={`${p.slug}-link-${linkIdx}`} className="flex gap-2">
                                <Input
                                  placeholder="Label"
                                  value={link.label}
                                  onChange={(e) => {
                                    const next = [...pages]
                                    const links = [...(next[idx].nextStepsLinks ?? [])]
                                    links[linkIdx] = { ...links[linkIdx], label: e.target.value }
                                    next[idx] = { ...next[idx], nextStepsLinks: links }
                                    setContentSectionPages(next)
                                  }}
                                />
                                <Input
                                  placeholder="URL"
                                  value={link.href}
                                  onChange={(e) => {
                                    const next = [...pages]
                                    const links = [...(next[idx].nextStepsLinks ?? [])]
                                    links[linkIdx] = { ...links[linkIdx], href: e.target.value }
                                    next[idx] = { ...next[idx], nextStepsLinks: links }
                                    setContentSectionPages(next)
                                  }}
                                />
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    const next = [...pages]
                                    const links = [...(next[idx].nextStepsLinks ?? [])]
                                    links.splice(linkIdx, 1)
                                    next[idx] = { ...next[idx], nextStepsLinks: links }
                                    setContentSectionPages(next)
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              onClick={() => {
                                const next = [...pages]
                                next[idx] = { ...next[idx], nextStepsLinks: [...(next[idx].nextStepsLinks ?? []), { label: "", href: "" }] }
                                setContentSectionPages(next)
                              }}
                            >
                              + Add Link
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label>FAQs</Label>
                            {(p.faqs ?? []).map((faq, faqIdx) => (
                              <div key={`${p.slug}-faq-${faqIdx}`} className="border rounded-lg p-4 space-y-2">
                                <Input
                                  placeholder="Question"
                                  value={faq.question}
                                  onChange={(e) => {
                                    const next = [...pages]
                                    const faqs = [...(next[idx].faqs ?? [])]
                                    faqs[faqIdx] = { ...faqs[faqIdx], question: e.target.value }
                                    next[idx] = { ...next[idx], faqs }
                                    setContentSectionPages(next)
                                  }}
                                />
                                <Textarea
                                  placeholder="Answer"
                                  value={faq.answer}
                                  onChange={(e) => {
                                    const next = [...pages]
                                    const faqs = [...(next[idx].faqs ?? [])]
                                    faqs[faqIdx] = { ...faqs[faqIdx], answer: e.target.value }
                                    next[idx] = { ...next[idx], faqs }
                                    setContentSectionPages(next)
                                  }}
                                  rows={3}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const next = [...pages]
                                    const faqs = [...(next[idx].faqs ?? [])]
                                    faqs.splice(faqIdx, 1)
                                    next[idx] = { ...next[idx], faqs }
                                    setContentSectionPages(next)
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              onClick={() => {
                                const next = [...pages]
                                next[idx] = { ...next[idx], faqs: [...(next[idx].faqs ?? []), { question: "", answer: "" }] }
                                setContentSectionPages(next)
                              }}
                            >
                              + Add FAQ
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label>SEO Meta Title</Label>
                            <Input
                              value={p.seo?.metaTitle ?? ""}
                              onChange={(e) => {
                                const next = [...pages]
                                next[idx] = { ...next[idx], seo: { ...(next[idx].seo ?? {}), metaTitle: e.target.value } }
                                setContentSectionPages(next)
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>SEO Meta Description</Label>
                            <Textarea
                              value={p.seo?.metaDescription ?? ""}
                              onChange={(e) => {
                                const next = [...pages]
                                next[idx] = { ...next[idx], seo: { ...(next[idx].seo ?? {}), metaDescription: e.target.value } }
                                setContentSectionPages(next)
                              }}
                              rows={2}
                            />
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <Button onClick={() => saveAll("Pages")} disabled={saving !== null}>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                            <a
                              className="text-sm underline text-[var(--accent)] self-center"
                              href={`/content-sections/${p.slug}`}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              View page →
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                    </Tabs>
                  )
                })()}
                     <Card>
                       <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                           <FileText className="w-5 h-5" />
                           Edit Financial Abuse Page
                         </CardTitle>
                         <CardDescription>Update content for /financial-abuse page</CardDescription>
                       </CardHeader>
                       <CardContent className="space-y-4">
                         <div className="space-y-2">
                           <Label>Eyebrow Text</Label>
                           <Input
                             value={financialAbusePage?.eyebrow ?? ""}
                             onChange={(e) => setFinancialAbusePage({ ...financialAbusePage, eyebrow: e.target.value })}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Title</Label>
                           <Input
                             value={financialAbusePage?.title ?? ""}
                             onChange={(e) => setFinancialAbusePage({ ...financialAbusePage, title: e.target.value })}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Description</Label>
                           <Textarea
                             value={financialAbusePage?.description ?? ""}
                             onChange={(e) => setFinancialAbusePage({ ...financialAbusePage, description: e.target.value })}
                             rows={3}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Common Signs (one per line)</Label>
                           <Textarea
                             value={(financialAbusePage?.commonSigns ?? []).join("\n")}
                             onChange={(e) =>
                               setFinancialAbusePage({
                                 ...financialAbusePage,
                                 commonSigns: e.target.value.split("\n").filter(Boolean),
                               })
                             }
                             rows={5}
                             placeholder="Blocking access to accounts, payslips, or financial information"
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>How Therapy Supports Safety (one per line)</Label>
                           <Textarea
                             value={(financialAbusePage?.therapySupports ?? []).join("\n")}
                             onChange={(e) =>
                               setFinancialAbusePage({
                                 ...financialAbusePage,
                                 therapySupports: e.target.value.split("\n").filter(Boolean),
                               })
                             }
                             rows={5}
                             placeholder="Nervous‑system‑aware pacing to reduce overwhelm"
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Crisis Text</Label>
                           <Textarea
                             value={financialAbusePage?.crisisText ?? ""}
                             onChange={(e) => setFinancialAbusePage({ ...financialAbusePage, crisisText: e.target.value })}
                             rows={2}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Next Steps Links</Label>
                           {(financialAbusePage?.nextStepsLinks ?? []).map((link, idx) => (
                             <div key={idx} className="flex gap-2">
                               <Input
                                 placeholder="Label"
                                 value={link.label}
                                 onChange={(e) => {
                                   const next = [...(financialAbusePage?.nextStepsLinks ?? [])]
                                   next[idx] = { ...next[idx], label: e.target.value }
                                   setFinancialAbusePage({ ...financialAbusePage, nextStepsLinks: next })
                                 }}
                               />
                               <Input
                                 placeholder="URL (e.g., /financial-abuse-therapy)"
                                 value={link.href}
                                 onChange={(e) => {
                                   const next = [...(financialAbusePage?.nextStepsLinks ?? [])]
                                   next[idx] = { ...next[idx], href: e.target.value }
                                   setFinancialAbusePage({ ...financialAbusePage, nextStepsLinks: next })
                                 }}
                               />
                               <Button
                                 variant="outline"
                                 onClick={() => {
                                   const next = [...(financialAbusePage?.nextStepsLinks ?? [])]
                                   next.splice(idx, 1)
                                   setFinancialAbusePage({ ...financialAbusePage, nextStepsLinks: next })
                                 }}
                               >
                                 Remove
                               </Button>
                             </div>
                           ))}
                           <Button
                             variant="outline"
                             onClick={() =>
                               setFinancialAbusePage({
                                 ...financialAbusePage,
                                 nextStepsLinks: [...(financialAbusePage?.nextStepsLinks ?? []), { label: "", href: "" }],
                               })
                             }
                           >
                             + Add Link
                           </Button>
                         </div>
                         <Button onClick={() => saveAll("Financial Abuse Page")} disabled={saving !== null}>
                           <Save className="w-4 h-4 mr-2" />
                           Save Changes
                         </Button>
                       </CardContent>
                     </Card>
                   </TabsContent>

                   <TabsContent value="monetary-psychotherapy" className="space-y-6">
                     <Card>
                       <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                           <FileText className="w-5 h-5" />
                           Edit Monetary Psychotherapy Page
                         </CardTitle>
                         <CardDescription>Update content for /monetary-psychotherapy page</CardDescription>
                       </CardHeader>
                       <CardContent className="space-y-4">
                         <div className="space-y-2">
                           <Label>Eyebrow Text</Label>
                           <Input
                             value={monetaryPsychotherapyPage?.eyebrow ?? ""}
                             onChange={(e) => setMonetaryPsychotherapyPage({ ...monetaryPsychotherapyPage, eyebrow: e.target.value })}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Title</Label>
                           <Input
                             value={monetaryPsychotherapyPage?.title ?? ""}
                             onChange={(e) => setMonetaryPsychotherapyPage({ ...monetaryPsychotherapyPage, title: e.target.value })}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Subtitle</Label>
                           <Input
                             value={monetaryPsychotherapyPage?.subtitle ?? ""}
                             onChange={(e) => setMonetaryPsychotherapyPage({ ...monetaryPsychotherapyPage, subtitle: e.target.value })}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Intro Paragraph</Label>
                           <Textarea
                             value={monetaryPsychotherapyPage?.intro ?? ""}
                             onChange={(e) => setMonetaryPsychotherapyPage({ ...monetaryPsychotherapyPage, intro: e.target.value })}
                             rows={4}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Designed For (one per line)</Label>
                           <Textarea
                             value={(monetaryPsychotherapyPage?.designedFor ?? []).join("\n")}
                             onChange={(e) =>
                               setMonetaryPsychotherapyPage({
                                 ...monetaryPsychotherapyPage,
                                 designedFor: e.target.value.split("\n").filter(Boolean),
                               })
                             }
                             rows={5}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Session Focus (one per line)</Label>
                           <Textarea
                             value={(monetaryPsychotherapyPage?.sessionFocus ?? []).join("\n")}
                             onChange={(e) =>
                               setMonetaryPsychotherapyPage({
                                 ...monetaryPsychotherapyPage,
                                 sessionFocus: e.target.value.split("\n").filter(Boolean),
                               })
                             }
                             rows={5}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Therapeutic Principles</Label>
                           {(monetaryPsychotherapyPage?.therapeuticPrinciples ?? []).map((principle, idx) => (
                             <div key={idx} className="border rounded-lg p-4 space-y-2">
                               <Input
                                 placeholder="Principle Title"
                                 value={principle.title}
                                 onChange={(e) => {
                                   const next = [...(monetaryPsychotherapyPage?.therapeuticPrinciples ?? [])]
                                   next[idx] = { ...next[idx], title: e.target.value }
                                   setMonetaryPsychotherapyPage({ ...monetaryPsychotherapyPage, therapeuticPrinciples: next })
                                 }}
                               />
                               <Textarea
                                 placeholder="Principle Body"
                                 value={principle.body}
                                 onChange={(e) => {
                                   const next = [...(monetaryPsychotherapyPage?.therapeuticPrinciples ?? [])]
                                   next[idx] = { ...next[idx], body: e.target.value }
                                   setMonetaryPsychotherapyPage({ ...monetaryPsychotherapyPage, therapeuticPrinciples: next })
                                 }}
                                 rows={2}
                               />
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => {
                                   const next = [...(monetaryPsychotherapyPage?.therapeuticPrinciples ?? [])]
                                   next.splice(idx, 1)
                                   setMonetaryPsychotherapyPage({ ...monetaryPsychotherapyPage, therapeuticPrinciples: next })
                                 }}
                               >
                                 Remove
                               </Button>
                             </div>
                           ))}
                           <Button
                             variant="outline"
                             onClick={() =>
                               setMonetaryPsychotherapyPage({
                                 ...monetaryPsychotherapyPage,
                                 therapeuticPrinciples: [
                                   ...(monetaryPsychotherapyPage?.therapeuticPrinciples ?? []),
                                   { title: "", body: "" },
                                 ],
                               })
                             }
                           >
                             + Add Principle
                           </Button>
                         </div>
                         <div className="space-y-2">
                           <Label>How We Begin (one per line)</Label>
                           <Textarea
                             value={(monetaryPsychotherapyPage?.howWeBegin ?? []).join("\n")}
                             onChange={(e) =>
                               setMonetaryPsychotherapyPage({
                                 ...monetaryPsychotherapyPage,
                                 howWeBegin: e.target.value.split("\n").filter(Boolean),
                               })
                             }
                             rows={4}
                           />
                         </div>
                         <Button onClick={() => saveAll("Monetary Psychotherapy Page")} disabled={saving !== null}>
                           <Save className="w-4 h-4 mr-2" />
                           Save Changes
                         </Button>
                       </CardContent>
                     </Card>
                   </TabsContent>

                   <TabsContent value="financial-abuse-therapy" className="space-y-6">
                     <Card>
                       <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                           <FileText className="w-5 h-5" />
                           Edit Financial Abuse Therapy Page
                         </CardTitle>
                         <CardDescription>Update content for /financial-abuse-therapy page</CardDescription>
                       </CardHeader>
                       <CardContent className="space-y-4">
                         <div className="space-y-2">
                           <Label>Eyebrow Text</Label>
                           <Input
                             value={financialAbuseTherapyPage?.eyebrow ?? ""}
                             onChange={(e) =>
                               setFinancialAbuseTherapyPage({ ...financialAbuseTherapyPage, eyebrow: e.target.value })
                             }
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Title</Label>
                           <Input
                             value={financialAbuseTherapyPage?.title ?? ""}
                             onChange={(e) => setFinancialAbuseTherapyPage({ ...financialAbuseTherapyPage, title: e.target.value })}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Description</Label>
                           <Textarea
                             value={financialAbuseTherapyPage?.description ?? ""}
                             onChange={(e) =>
                               setFinancialAbuseTherapyPage({ ...financialAbuseTherapyPage, description: e.target.value })
                             }
                             rows={3}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Therapy Approach (one per line)</Label>
                           <Textarea
                             value={(financialAbuseTherapyPage?.therapyApproach ?? []).join("\n")}
                             onChange={(e) =>
                               setFinancialAbuseTherapyPage({
                                 ...financialAbuseTherapyPage,
                                 therapyApproach: e.target.value.split("\n").filter(Boolean),
                               })
                             }
                             rows={5}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Session Formats (one per line)</Label>
                           <Textarea
                             value={(financialAbuseTherapyPage?.sessionFormats ?? []).join("\n")}
                             onChange={(e) =>
                               setFinancialAbuseTherapyPage({
                                 ...financialAbuseTherapyPage,
                                 sessionFormats: e.target.value.split("\n").filter(Boolean),
                               })
                             }
                             rows={4}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Next Steps Links</Label>
                           {(financialAbuseTherapyPage?.nextStepsLinks ?? []).map((link, idx) => (
                             <div key={idx} className="flex gap-2">
                               <Input
                                 placeholder="Label"
                                 value={link.label}
                                 onChange={(e) => {
                                   const next = [...(financialAbuseTherapyPage?.nextStepsLinks ?? [])]
                                   next[idx] = { ...next[idx], label: e.target.value }
                                   setFinancialAbuseTherapyPage({ ...financialAbuseTherapyPage, nextStepsLinks: next })
                                 }}
                               />
                               <Input
                                 placeholder="URL"
                                 value={link.href}
                                 onChange={(e) => {
                                   const next = [...(financialAbuseTherapyPage?.nextStepsLinks ?? [])]
                                   next[idx] = { ...next[idx], href: e.target.value }
                                   setFinancialAbuseTherapyPage({ ...financialAbuseTherapyPage, nextStepsLinks: next })
                                 }}
                               />
                               <Button
                                 variant="outline"
                                 onClick={() => {
                                   const next = [...(financialAbuseTherapyPage?.nextStepsLinks ?? [])]
                                   next.splice(idx, 1)
                                   setFinancialAbuseTherapyPage({ ...financialAbuseTherapyPage, nextStepsLinks: next })
                                 }}
                               >
                                 Remove
                               </Button>
                             </div>
                           ))}
                           <Button
                             variant="outline"
                             onClick={() =>
                               setFinancialAbuseTherapyPage({
                                 ...financialAbuseTherapyPage,
                                 nextStepsLinks: [...(financialAbuseTherapyPage?.nextStepsLinks ?? []), { label: "", href: "" }],
                               })
                             }
                           >
                             + Add Link
                           </Button>
                         </div>
                         <div className="space-y-2">
                           <Label>FAQs</Label>
                           {(financialAbuseTherapyPage?.faqs ?? []).map((faq, idx) => (
                             <div key={idx} className="border rounded-lg p-4 space-y-2">
                               <Input
                                 placeholder="Question"
                                 value={faq.question}
                                 onChange={(e) => {
                                   const next = [...(financialAbuseTherapyPage?.faqs ?? [])]
                                   next[idx] = { ...next[idx], question: e.target.value }
                                   setFinancialAbuseTherapyPage({ ...financialAbuseTherapyPage, faqs: next })
                                 }}
                               />
                               <Textarea
                                 placeholder="Answer"
                                 value={faq.answer}
                                 onChange={(e) => {
                                   const next = [...(financialAbuseTherapyPage?.faqs ?? [])]
                                   next[idx] = { ...next[idx], answer: e.target.value }
                                   setFinancialAbuseTherapyPage({ ...financialAbuseTherapyPage, faqs: next })
                                 }}
                                 rows={2}
                               />
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => {
                                   const next = [...(financialAbuseTherapyPage?.faqs ?? [])]
                                   next.splice(idx, 1)
                                   setFinancialAbuseTherapyPage({ ...financialAbuseTherapyPage, faqs: next })
                                 }}
                               >
                                 Remove
                               </Button>
                             </div>
                           ))}
                           <Button
                             variant="outline"
                             onClick={() =>
                               setFinancialAbuseTherapyPage({
                                 ...financialAbuseTherapyPage,
                                 faqs: [...(financialAbuseTherapyPage?.faqs ?? []), { question: "", answer: "" }],
                               })
                             }
                           >
                             + Add FAQ
                           </Button>
                         </div>
                         <Button onClick={() => saveAll("Financial Abuse Therapy Page")} disabled={saving !== null}>
                           <Save className="w-4 h-4 mr-2" />
                           Save Changes
                         </Button>
                       </CardContent>
                     </Card>
                   </TabsContent>

                  <TabsContent value="family-financial-assistance-inheritance" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Edit Family Financial Assistance Page
                        </CardTitle>
                        <CardDescription>Update content for /family-financial-assistance-inheritance page</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Eyebrow Text</Label>
                          <Input
                            value={familyFinancialAssistanceInheritancePage?.eyebrow ?? ""}
                            onChange={(e) =>
                              setFamilyFinancialAssistanceInheritancePage({
                                ...familyFinancialAssistanceInheritancePage,
                                eyebrow: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={familyFinancialAssistanceInheritancePage?.title ?? ""}
                            onChange={(e) =>
                              setFamilyFinancialAssistanceInheritancePage({
                                ...familyFinancialAssistanceInheritancePage,
                                title: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={familyFinancialAssistanceInheritancePage?.description ?? ""}
                            onChange={(e) =>
                              setFamilyFinancialAssistanceInheritancePage({
                                ...familyFinancialAssistanceInheritancePage,
                                description: e.target.value,
                              })
                            }
                            rows={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Therapy Approach (one per line)</Label>
                          <Textarea
                            value={(familyFinancialAssistanceInheritancePage?.therapyApproach ?? []).join("\n")}
                            onChange={(e) =>
                              setFamilyFinancialAssistanceInheritancePage({
                                ...familyFinancialAssistanceInheritancePage,
                                therapyApproach: e.target.value.split("\n").filter(Boolean),
                              })
                            }
                            rows={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Session Formats (one per line)</Label>
                          <Textarea
                            value={(familyFinancialAssistanceInheritancePage?.sessionFormats ?? []).join("\n")}
                            onChange={(e) =>
                              setFamilyFinancialAssistanceInheritancePage({
                                ...familyFinancialAssistanceInheritancePage,
                                sessionFormats: e.target.value.split("\n").filter(Boolean),
                              })
                            }
                            rows={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Next Steps Links</Label>
                          {(familyFinancialAssistanceInheritancePage?.nextStepsLinks ?? []).map((link, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Input
                                placeholder="Label"
                                value={link.label}
                                onChange={(e) => {
                                  const next = [...(familyFinancialAssistanceInheritancePage?.nextStepsLinks ?? [])]
                                  next[idx] = { ...next[idx], label: e.target.value }
                                  setFamilyFinancialAssistanceInheritancePage({
                                    ...familyFinancialAssistanceInheritancePage,
                                    nextStepsLinks: next,
                                  })
                                }}
                              />
                              <Input
                                placeholder="URL"
                                value={link.href}
                                onChange={(e) => {
                                  const next = [...(familyFinancialAssistanceInheritancePage?.nextStepsLinks ?? [])]
                                  next[idx] = { ...next[idx], href: e.target.value }
                                  setFamilyFinancialAssistanceInheritancePage({
                                    ...familyFinancialAssistanceInheritancePage,
                                    nextStepsLinks: next,
                                  })
                                }}
                              />
                              <Button
                                variant="outline"
                                onClick={() => {
                                  const next = [...(familyFinancialAssistanceInheritancePage?.nextStepsLinks ?? [])]
                                  next.splice(idx, 1)
                                  setFamilyFinancialAssistanceInheritancePage({
                                    ...familyFinancialAssistanceInheritancePage,
                                    nextStepsLinks: next,
                                  })
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() =>
                              setFamilyFinancialAssistanceInheritancePage({
                                ...familyFinancialAssistanceInheritancePage,
                                nextStepsLinks: [
                                  ...(familyFinancialAssistanceInheritancePage?.nextStepsLinks ?? []),
                                  { label: "", href: "" },
                                ],
                              })
                            }
                          >
                            + Add Link
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label>FAQs</Label>
                          {(familyFinancialAssistanceInheritancePage?.faqs ?? []).map((faq, idx) => (
                            <div key={idx} className="border rounded-lg p-4 space-y-2">
                              <Input
                                placeholder="Question"
                                value={faq.question}
                                onChange={(e) => {
                                  const next = [...(familyFinancialAssistanceInheritancePage?.faqs ?? [])]
                                  next[idx] = { ...next[idx], question: e.target.value }
                                  setFamilyFinancialAssistanceInheritancePage({
                                    ...familyFinancialAssistanceInheritancePage,
                                    faqs: next,
                                  })
                                }}
                              />
                              <Textarea
                                placeholder="Answer"
                                value={faq.answer}
                                onChange={(e) => {
                                  const next = [...(familyFinancialAssistanceInheritancePage?.faqs ?? [])]
                                  next[idx] = { ...next[idx], answer: e.target.value }
                                  setFamilyFinancialAssistanceInheritancePage({
                                    ...familyFinancialAssistanceInheritancePage,
                                    faqs: next,
                                  })
                                }}
                                rows={3}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const next = [...(familyFinancialAssistanceInheritancePage?.faqs ?? [])]
                                  next.splice(idx, 1)
                                  setFamilyFinancialAssistanceInheritancePage({
                                    ...familyFinancialAssistanceInheritancePage,
                                    faqs: next,
                                  })
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() =>
                              setFamilyFinancialAssistanceInheritancePage({
                                ...familyFinancialAssistanceInheritancePage,
                                faqs: [...(familyFinancialAssistanceInheritancePage?.faqs ?? []), { question: "", answer: "" }],
                              })
                            }
                          >
                            + Add FAQ
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label>SEO Meta Title</Label>
                          <Input
                            value={familyFinancialAssistanceInheritancePage?.seo?.metaTitle ?? ""}
                            onChange={(e) =>
                              setFamilyFinancialAssistanceInheritancePage({
                                ...familyFinancialAssistanceInheritancePage,
                                seo: { ...(familyFinancialAssistanceInheritancePage?.seo ?? {}), metaTitle: e.target.value },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>SEO Meta Description</Label>
                          <Textarea
                            value={familyFinancialAssistanceInheritancePage?.seo?.metaDescription ?? ""}
                            onChange={(e) =>
                              setFamilyFinancialAssistanceInheritancePage({
                                ...familyFinancialAssistanceInheritancePage,
                                seo: { ...(familyFinancialAssistanceInheritancePage?.seo ?? {}), metaDescription: e.target.value },
                              })
                            }
                            rows={2}
                          />
                        </div>
                        <Button onClick={() => saveAll("Family Financial Assistance Page")} disabled={saving !== null}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="financial-trauma" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Edit Financial Trauma Page
                        </CardTitle>
                        <CardDescription>Update content for /financial-trauma page</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Eyebrow Text</Label>
                          <Input
                            value={financialTraumaPage?.eyebrow ?? ""}
                            onChange={(e) => setFinancialTraumaPage({ ...financialTraumaPage, eyebrow: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={financialTraumaPage?.title ?? ""}
                            onChange={(e) => setFinancialTraumaPage({ ...financialTraumaPage, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={financialTraumaPage?.description ?? ""}
                            onChange={(e) => setFinancialTraumaPage({ ...financialTraumaPage, description: e.target.value })}
                            rows={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Therapy Approach (one per line)</Label>
                          <Textarea
                            value={(financialTraumaPage?.therapyApproach ?? []).join("\n")}
                            onChange={(e) =>
                              setFinancialTraumaPage({
                                ...financialTraumaPage,
                                therapyApproach: e.target.value.split("\n").filter(Boolean),
                              })
                            }
                            rows={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Session Formats (one per line)</Label>
                          <Textarea
                            value={(financialTraumaPage?.sessionFormats ?? []).join("\n")}
                            onChange={(e) =>
                              setFinancialTraumaPage({
                                ...financialTraumaPage,
                                sessionFormats: e.target.value.split("\n").filter(Boolean),
                              })
                            }
                            rows={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Next Steps Links</Label>
                          {(financialTraumaPage?.nextStepsLinks ?? []).map((link, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Input
                                placeholder="Label"
                                value={link.label}
                                onChange={(e) => {
                                  const next = [...(financialTraumaPage?.nextStepsLinks ?? [])]
                                  next[idx] = { ...next[idx], label: e.target.value }
                                  setFinancialTraumaPage({ ...financialTraumaPage, nextStepsLinks: next })
                                }}
                              />
                              <Input
                                placeholder="URL"
                                value={link.href}
                                onChange={(e) => {
                                  const next = [...(financialTraumaPage?.nextStepsLinks ?? [])]
                                  next[idx] = { ...next[idx], href: e.target.value }
                                  setFinancialTraumaPage({ ...financialTraumaPage, nextStepsLinks: next })
                                }}
                              />
                              <Button
                                variant="outline"
                                onClick={() => {
                                  const next = [...(financialTraumaPage?.nextStepsLinks ?? [])]
                                  next.splice(idx, 1)
                                  setFinancialTraumaPage({ ...financialTraumaPage, nextStepsLinks: next })
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() =>
                              setFinancialTraumaPage({
                                ...financialTraumaPage,
                                nextStepsLinks: [...(financialTraumaPage?.nextStepsLinks ?? []), { label: "", href: "" }],
                              })
                            }
                          >
                            + Add Link
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label>FAQs</Label>
                          {(financialTraumaPage?.faqs ?? []).map((faq, idx) => (
                            <div key={idx} className="border rounded-lg p-4 space-y-2">
                              <Input
                                placeholder="Question"
                                value={faq.question}
                                onChange={(e) => {
                                  const next = [...(financialTraumaPage?.faqs ?? [])]
                                  next[idx] = { ...next[idx], question: e.target.value }
                                  setFinancialTraumaPage({ ...financialTraumaPage, faqs: next })
                                }}
                              />
                              <Textarea
                                placeholder="Answer"
                                value={faq.answer}
                                onChange={(e) => {
                                  const next = [...(financialTraumaPage?.faqs ?? [])]
                                  next[idx] = { ...next[idx], answer: e.target.value }
                                  setFinancialTraumaPage({ ...financialTraumaPage, faqs: next })
                                }}
                                rows={3}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const next = [...(financialTraumaPage?.faqs ?? [])]
                                  next.splice(idx, 1)
                                  setFinancialTraumaPage({ ...financialTraumaPage, faqs: next })
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() =>
                              setFinancialTraumaPage({ ...financialTraumaPage, faqs: [...(financialTraumaPage?.faqs ?? []), { question: "", answer: "" }] })
                            }
                          >
                            + Add FAQ
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label>SEO Meta Title</Label>
                          <Input
                            value={financialTraumaPage?.seo?.metaTitle ?? ""}
                            onChange={(e) =>
                              setFinancialTraumaPage({
                                ...financialTraumaPage,
                                seo: { ...(financialTraumaPage?.seo ?? {}), metaTitle: e.target.value },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>SEO Meta Description</Label>
                          <Textarea
                            value={financialTraumaPage?.seo?.metaDescription ?? ""}
                            onChange={(e) =>
                              setFinancialTraumaPage({
                                ...financialTraumaPage,
                                seo: { ...(financialTraumaPage?.seo ?? {}), metaDescription: e.target.value },
                              })
                            }
                            rows={2}
                          />
                        </div>
                        <Button onClick={() => saveAll("Financial Trauma Page")} disabled={saving !== null}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                 </Tabs>
               </CardContent>
             </Card>
           </TabsContent>
 
           {/* Services Tab */}
           <TabsContent value="services" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <DollarSign className="w-5 h-5" />
                   Manage Services & Pricing
                 </CardTitle>
                 <CardDescription>Update your service offerings and consultation rates</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 {services.map((service, index) => (
                   <div key={service.id} className="flex gap-4 items-end p-4 bg-muted rounded-lg">
                     <div className="flex-1 space-y-2">
                       <Label htmlFor={`service-name-${service.id}`}>Service Name</Label>
                       <Input
                         id={`service-name-${service.id}`}
                         value={service.name}
                         onChange={(e) => {
                           const newServices = [...services]
                           newServices[index].name = e.target.value
                           setServices(newServices)
                         }}
                       />
                     </div>
                     <div className="w-32 space-y-2">
                       <Label htmlFor={`service-price-${service.id}`}>Price</Label>
                       <Input
                         id={`service-price-${service.id}`}
                         value={service.price}
                         onChange={(e) => {
                           const newServices = [...services]
                           newServices[index].price = e.target.value
                           setServices(newServices)
                         }}
                       />
                     </div>
                   </div>
                 ))}
                 <div className="flex gap-3">
                   <Button
                     variant="outline"
                     onClick={() =>
                       setServices((prev) => [
                         ...prev,
                         { id: Math.random().toString(36).slice(2), name: "New Service", price: "$0" },
                       ])
                     }
                   >
                     Add Service
                   </Button>
                   <Button onClick={() => saveAll("Services")} disabled={saving !== null}>
                     <Save className="w-4 h-4 mr-2" />
                     Save Changes
                   </Button>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>

          {/* Homepage Tab */}
          <TabsContent value="homepage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Homepage Controls</CardTitle>
                <CardDescription>Toggle sections and edit homepage headings/copy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <p className="text-sm font-semibold">Show / hide sections</p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(
                      [
                        ["showValueProps", "Value props"],
                        ["showNewsletter", "Newsletter band"],
                        ["showImportantLinks", "Important links"],
                        ["showImportantLinksCallButton", "Call Dan button (in Important Links)"],
                        ["showTestimonials", "Testimonials"],
                        ["showOtherAreas", "Other areas"],
                        ["showBooking", "Booking"],
                        ["showFaqs", "FAQs"],
                        ["showContact", "Contact"],
                        ["showCrisis", "Crisis resources"],
                        ["showLeadMagnet", "Lead magnet widget"],
                      ] as const
                    ).map(([key, label]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between border border-border/40 rounded-2xl p-4"
                      >
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">{label}</p>
                          <p className="text-sm text-muted-foreground">Controls visibility on the homepage.</p>
                        </div>
                        <Switch
                          checked={(homepage.sections?.[key] ?? true) as boolean}
                          onCheckedChange={(checked) =>
                            setHomepage((prev) => ({
                              ...prev,
                              sections: { ...(prev.sections ?? {}), [key]: Boolean(checked) },
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-semibold">Homepage headings & copy</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Value props eyebrow</Label>
                      <Input
                        value={homepage.copy?.valuePropsEyebrow ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), valuePropsEyebrow: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Value props heading</Label>
                      <Input
                        value={homepage.copy?.valuePropsHeading ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), valuePropsHeading: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Newsletter eyebrow</Label>
                      <Input
                        value={homepage.copy?.newsletterEyebrow ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), newsletterEyebrow: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Newsletter heading</Label>
                      <Input
                        value={homepage.copy?.newsletterHeading ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), newsletterHeading: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Newsletter body</Label>
                      <Textarea
                        rows={3}
                        value={homepage.copy?.newsletterBody ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), newsletterBody: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Newsletter button label</Label>
                      <Input
                        value={homepage.copy?.newsletterCtaLabel ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), newsletterCtaLabel: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Newsletter tags (comma-separated)</Label>
                      <Input
                        value={(homepage.copy?.newsletterTags ?? []).join(", ")}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: {
                              ...(prev.copy ?? {}),
                              newsletterTags: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Important links heading</Label>
                      <Input
                        value={homepage.copy?.importantLinksHeading ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), importantLinksHeading: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Important links call button label</Label>
                      <Input
                        value={homepage.copy?.importantLinksCallCtaLabel ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), importantLinksCallCtaLabel: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Important links subheading</Label>
                      <Input
                        value={homepage.copy?.importantLinksSubheading ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), importantLinksSubheading: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Testimonials eyebrow</Label>
                      <Input
                        value={homepage.copy?.testimonialsEyebrow ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), testimonialsEyebrow: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Testimonials heading</Label>
                      <Input
                        value={homepage.copy?.testimonialsHeading ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), testimonialsHeading: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Other areas heading</Label>
                      <Input
                        value={homepage.copy?.otherAreasHeading ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), otherAreasHeading: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Other areas subheading</Label>
                      <Input
                        value={homepage.copy?.otherAreasSubheading ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), otherAreasSubheading: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Booking heading</Label>
                      <Input
                        value={homepage.copy?.bookingHeading ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), bookingHeading: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Booking subheading</Label>
                      <Input
                        value={homepage.copy?.bookingSubheading ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), bookingSubheading: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>FAQ eyebrow</Label>
                      <Input
                        value={homepage.copy?.faqsEyebrow ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), faqsEyebrow: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>FAQ heading</Label>
                      <Input
                        value={homepage.copy?.faqsHeading ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), faqsHeading: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Contact heading</Label>
                      <Input
                        value={homepage.copy?.contactHeading ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), contactHeading: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Contact body</Label>
                      <Textarea
                        rows={2}
                        value={homepage.copy?.contactBody ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), contactBody: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Crisis heading</Label>
                      <Input
                        value={homepage.copy?.crisisHeading ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), crisisHeading: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Crisis body</Label>
                      <Input
                        value={homepage.copy?.crisisBody ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), crisisBody: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Crisis note</Label>
                      <Input
                        value={homepage.copy?.crisisNote ?? ""}
                        onChange={(e) =>
                          setHomepage((prev) => ({
                            ...prev,
                            copy: { ...(prev.copy ?? {}), crisisNote: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => saveAll("Homepage Controls")} disabled={saving !== null}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Homepage Controls
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Important Links (all 9 navy buttons)</CardTitle>
                <CardDescription>Controls the 9 navy buttons in the homepage “Important Links” section.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-[var(--foreground)]">Row 3 — Blog links (3)</p>
                    {Array.from({ length: 3 }).map((_, idx) => {
                      const link = homepage.importantLinks?.blogLinks?.[idx] ?? { label: "", href: "" }
                      return (
                        <div key={`blog-${idx}`} className="grid gap-3 sm:grid-cols-2 items-end rounded-lg border border-border/40 p-4">
                          <div className="space-y-2">
                            <Label>Label</Label>
                            <Input
                              value={link.label}
                              onChange={(e) =>
                                setHomepage((prev) => {
                                  const next = [...(prev.importantLinks?.blogLinks ?? [])]
                                  while (next.length < 3) next.push({ label: "", href: "" })
                                  next[idx] = { ...next[idx], label: e.target.value }
                                  return { ...prev, importantLinks: { ...(prev.importantLinks ?? {}), blogLinks: next } }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Href</Label>
                            <Input
                              value={link.href}
                              onChange={(e) =>
                                setHomepage((prev) => {
                                  const next = [...(prev.importantLinks?.blogLinks ?? [])]
                                  while (next.length < 3) next.push({ label: "", href: "" })
                                  next[idx] = { ...next[idx], href: e.target.value }
                                  return { ...prev, importantLinks: { ...(prev.importantLinks ?? {}), blogLinks: next } }
                                })
                              }
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-[var(--foreground)]">Row 4 — Internal deep-dives (3)</p>
                    {Array.from({ length: 3 }).map((_, idx) => {
                      const link = homepage.importantSectionLinks?.[idx] ?? { label: "", href: "" }
                      return (
                        <div key={`deep-${idx}`} className="grid gap-3 sm:grid-cols-2 items-end rounded-lg border border-border/40 p-4">
                          <div className="space-y-2">
                            <Label>Label</Label>
                            <Input
                              value={link.label}
                              onChange={(e) =>
                                setHomepage((prev) => {
                                  const next = [...(prev.importantSectionLinks ?? [])]
                                  while (next.length < 3) next.push({ label: "", href: "" })
                                  next[idx] = { ...next[idx], label: e.target.value }
                                  return { ...prev, importantSectionLinks: next }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Href</Label>
                            <Input
                              value={link.href}
                              onChange={(e) =>
                                setHomepage((prev) => {
                                  const next = [...(prev.importantSectionLinks ?? [])]
                                  while (next.length < 3) next.push({ label: "", href: "" })
                                  next[idx] = { ...next[idx], href: e.target.value }
                                  return { ...prev, importantSectionLinks: next }
                                })
                              }
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-[var(--foreground)]">Row 5 — Specialist pages (3)</p>
                    {Array.from({ length: 3 }).map((_, idx) => {
                      const link = homepage.importantLinks?.specialistLinks?.[idx] ?? { label: "", href: "" }
                      return (
                        <div key={`spec-${idx}`} className="grid gap-3 sm:grid-cols-2 items-end rounded-lg border border-border/40 p-4">
                          <div className="space-y-2">
                            <Label>Label</Label>
                            <Input
                              value={link.label}
                              onChange={(e) =>
                                setHomepage((prev) => {
                                  const next = [...(prev.importantLinks?.specialistLinks ?? [])]
                                  while (next.length < 3) next.push({ label: "", href: "" })
                                  next[idx] = { ...next[idx], label: e.target.value }
                                  return { ...prev, importantLinks: { ...(prev.importantLinks ?? {}), specialistLinks: next } }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Href</Label>
                            <Input
                              value={link.href}
                              onChange={(e) =>
                                setHomepage((prev) => {
                                  const next = [...(prev.importantLinks?.specialistLinks ?? [])]
                                  while (next.length < 3) next.push({ label: "", href: "" })
                                  next[idx] = { ...next[idx], href: e.target.value }
                                  return { ...prev, importantLinks: { ...(prev.importantLinks ?? {}), specialistLinks: next } }
                                })
                              }
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Button onClick={() => saveAll("Important links")} disabled={saving !== null}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Important Links
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Other areas (accordion)</CardTitle>
                <CardDescription>Controls the “Other Areas of Specialisation” accordion items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(homepage.otherAreas ?? []).map((item, idx) => (
                  <div key={`${item.title}-${idx}`} className="rounded-lg border border-border/40 p-4 space-y-3">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const next = [...(homepage.otherAreas ?? [])]
                          next[idx] = { ...next[idx], title: e.target.value }
                          setHomepage((prev) => ({ ...prev, otherAreas: next }))
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Summary</Label>
                      <Textarea
                        rows={2}
                        value={item.summary}
                        onChange={(e) => {
                          const next = [...(homepage.otherAreas ?? [])]
                          next[idx] = { ...next[idx], summary: e.target.value }
                          setHomepage((prev) => ({ ...prev, otherAreas: next }))
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>More</Label>
                      <Textarea
                        rows={2}
                        value={item.more}
                        onChange={(e) => {
                          const next = [...(homepage.otherAreas ?? [])]
                          next[idx] = { ...next[idx], more: e.target.value }
                          setHomepage((prev) => ({ ...prev, otherAreas: next }))
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        const next = [...(homepage.otherAreas ?? [])]
                        next.splice(idx, 1)
                        setHomepage((prev) => ({ ...prev, otherAreas: next }))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setHomepage((prev) => ({
                        ...prev,
                        otherAreas: [
                          ...(prev.otherAreas ?? []),
                          { title: "New area", summary: "Short summary", more: "Longer description" },
                        ],
                      }))
                    }
                  >
                    + Add area
                  </Button>
                  <Button onClick={() => saveAll("Other areas")} disabled={saving !== null}>
                    <Save className="w-4 h-4 mr-2" />
                    Save other areas
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Value Props</CardTitle>
                <CardDescription>Update the quick-hit reasons clients feel safe booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(homepage.valueProps ?? []).map((item, idx) => (
                  <div key={`value-prop-${idx}`} className="rounded-lg border border-border/40 p-4 space-y-3">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const next = [...(homepage.valueProps ?? [])]
                          next[idx] = { ...next[idx], title: e.target.value }
                          setHomepage((prev) => ({ ...prev, valueProps: next }))
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={3}
                        value={item.description}
                        onChange={(e) => {
                          const next = [...(homepage.valueProps ?? [])]
                          next[idx] = { ...next[idx], description: e.target.value }
                          setHomepage((prev) => ({ ...prev, valueProps: next }))
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        const next = [...(homepage.valueProps ?? [])]
                        next.splice(idx, 1)
                        setHomepage((prev) => ({ ...prev, valueProps: next }))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setHomepage((prev) => ({
                      ...prev,
                      valueProps: [...(prev.valueProps ?? []), { title: "New value prop", description: "" }],
                    }))
                  }
                >
                  + Add Value Prop
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Testimonials</CardTitle>
                <CardDescription>Short quotes for social proof</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(homepage.testimonials ?? []).map((item, idx) => (
                  <div key={`testimonial-${idx}`} className="rounded-lg border border-border/40 p-4 space-y-3">
                    <div className="space-y-2">
                      <Label>Quote</Label>
                      <Textarea
                        rows={3}
                        value={item.quote}
                        onChange={(e) => {
                          const next = [...(homepage.testimonials ?? [])]
                          next[idx] = { ...next[idx], quote: e.target.value }
                          setHomepage((prev) => ({ ...prev, testimonials: next }))
                        }}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={item.author}
                          onChange={(e) => {
                            const next = [...(homepage.testimonials ?? [])]
                            next[idx] = { ...next[idx], author: e.target.value }
                            setHomepage((prev) => ({ ...prev, testimonials: next }))
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Context</Label>
                        <Input
                          value={item.context ?? ""}
                          onChange={(e) => {
                            const next = [...(homepage.testimonials ?? [])]
                            next[idx] = { ...next[idx], context: e.target.value }
                            setHomepage((prev) => ({ ...prev, testimonials: next }))
                          }}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        const next = [...(homepage.testimonials ?? [])]
                        next.splice(idx, 1)
                        setHomepage((prev) => ({ ...prev, testimonials: next }))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setHomepage((prev) => ({
                      ...prev,
                      testimonials: [
                        ...(prev.testimonials ?? []),
                        { quote: "New testimonial", author: "Client", context: "" },
                      ],
                    }))
                  }
                >
                  + Add Testimonial
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>FAQs</CardTitle>
                <CardDescription>Address common doubts directly on the landing page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(homepage.faqs ?? []).map((item, idx) => (
                  <div key={`faq-${idx}`} className="rounded-lg border border-border/40 p-4 space-y-3">
                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Input
                        value={item.question}
                        onChange={(e) => {
                          const next = [...(homepage.faqs ?? [])]
                          next[idx] = { ...next[idx], question: e.target.value }
                          setHomepage((prev) => ({ ...prev, faqs: next }))
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Answer</Label>
                      <Textarea
                        rows={3}
                        value={item.answer}
                        onChange={(e) => {
                          const next = [...(homepage.faqs ?? [])]
                          next[idx] = { ...next[idx], answer: e.target.value }
                          setHomepage((prev) => ({ ...prev, faqs: next }))
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        const next = [...(homepage.faqs ?? [])]
                        next.splice(idx, 1)
                        setHomepage((prev) => ({ ...prev, faqs: next }))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setHomepage((prev) => ({
                      ...prev,
                      faqs: [...(prev.faqs ?? []), { question: "New FAQ", answer: "" }],
                    }))
                  }
                >
                  + Add FAQ
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Magnet</CardTitle>
                <CardDescription>Controls the sticky CTA / exit intent copy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input
                    value={homepage.leadMagnet?.heading ?? ""}
                    onChange={(e) =>
                      setHomepage((prev) => ({
                        ...prev,
                        leadMagnet: { ...(prev.leadMagnet ?? createEmptyHomepage().leadMagnet), heading: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Body</Label>
                  <Textarea
                    rows={3}
                    value={homepage.leadMagnet?.body ?? ""}
                    onChange={(e) =>
                      setHomepage((prev) => ({
                        ...prev,
                        leadMagnet: { ...(prev.leadMagnet ?? createEmptyHomepage().leadMagnet), body: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>CTA Label</Label>
                    <Input
                      value={homepage.leadMagnet?.ctaLabel ?? ""}
                      onChange={(e) =>
                        setHomepage((prev) => ({
                          ...prev,
                          leadMagnet: { ...(prev.leadMagnet ?? createEmptyHomepage().leadMagnet), ctaLabel: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA URL</Label>
                    <Input
                      value={homepage.leadMagnet?.ctaHref ?? ""}
                      onChange={(e) =>
                        setHomepage((prev) => ({
                          ...prev,
                          leadMagnet: { ...(prev.leadMagnet ?? createEmptyHomepage().leadMagnet), ctaHref: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Helper / Consent copy</Label>
                  <Textarea
                    rows={2}
                    value={homepage.leadMagnet?.helper ?? ""}
                    onChange={(e) =>
                      setHomepage((prev) => ({
                        ...prev,
                        leadMagnet: { ...(prev.leadMagnet ?? createEmptyHomepage().leadMagnet), helper: e.target.value },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={() => saveAll("Homepage")} disabled={saving !== null}>
                <Save className="w-4 h-4 mr-2" />
                Save Homepage
              </Button>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Articles</CardTitle>
                <CardDescription>Manage MDX blog posts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {postsMeta.length === 0 && <p className="text-sm text-muted-foreground">No articles yet.</p>}
                  {postsMeta.map((post) => (
                    <div key={post.slug} className="flex flex-col gap-2 rounded-lg border border-border/40 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{post.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(post.date).toLocaleDateString("en-AU", { dateStyle: "medium" })} · /blog/{post.slug}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button type="button" variant="outline" onClick={() => openPostEditor(post)}>
                          Edit
                        </Button>
                        <Link href={`/blog/${post.slug}`} target="_blank" className="text-sm font-semibold text-[var(--accent)] underline">
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid gap-3">
                  <Input
                    placeholder="New article title"
                    value={newPostDraft.title}
                    onChange={(e) => setNewPostDraft((prev) => ({ ...prev, title: e.target.value }))}
                  />
                  <Textarea
                    rows={3}
                    placeholder="Short description"
                    value={newPostDraft.description}
                    onChange={(e) => setNewPostDraft((prev) => ({ ...prev, description: e.target.value }))}
                  />
                  <Button onClick={createPostDraft} disabled={saving !== null}>
                    <Save className="w-4 h-4 mr-2" />
                    Create Draft
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vlog Entries</CardTitle>
                <CardDescription>Manage video-based resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {videosMeta.length === 0 && <p className="text-sm text-muted-foreground">No videos yet.</p>}
                  {videosMeta.map((video) => (
                    <div key={video.slug} className="flex flex-col gap-2 rounded-lg border border-border/40 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{video.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(video.date).toLocaleDateString("en-AU", { dateStyle: "medium" })} · /vlog/{video.slug}
                        </p>
                      </div>
                      <Link
                        href={`/vlog/${video.slug}`}
                        target="_blank"
                        className="text-sm font-semibold text-[var(--accent)] underline"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="grid gap-3">
                  <Input
                    placeholder="Video title"
                    value={newVideoDraft.title}
                    onChange={(e) => setNewVideoDraft((prev) => ({ ...prev, title: e.target.value }))}
                  />
                  <Input
                    placeholder="Embed URL (YouTube, Vimeo, etc.)"
                    value={newVideoDraft.videoUrl}
                    onChange={(e) => setNewVideoDraft((prev) => ({ ...prev, videoUrl: e.target.value }))}
                  />
                  <Textarea
                    rows={3}
                    placeholder="Short description"
                    value={newVideoDraft.description}
                    onChange={(e) => setNewVideoDraft((prev) => ({ ...prev, description: e.target.value }))}
                  />
                  <Button onClick={createVideoDraft} disabled={saving !== null}>
                    <Save className="w-4 h-4 mr-2" />
                    Create Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <Dialog
            open={postEditor.open}
            onOpenChange={(open) => {
              if (!open) setPostEditor({ open: false, slug: null, title: null, mdx: "", loading: false, saving: false, source: null })
            }}
          >
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Edit article</DialogTitle>
                <DialogDescription>
                  {postEditor.slug ? (
                    <>
                      <span className="font-medium">/blog/{postEditor.slug}</span>
                      {postEditor.source ? <span className="text-muted-foreground"> · source: {postEditor.source}</span> : null}
                    </>
                  ) : (
                    "Loading…"
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label>MDX</Label>
                <Textarea
                  rows={18}
                  value={postEditor.mdx}
                  onChange={(e) => setPostEditor((prev) => ({ ...prev, mdx: e.target.value }))}
                  disabled={postEditor.loading || postEditor.saving}
                />
              </div>
              <DialogFooter className="sm:justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  {postEditor.loading ? "Loading content…" : postEditor.saving ? "Saving…" : "Tip: frontmatter controls title/description/date."}
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setPostEditor((prev) => ({ ...prev, open: false }))} disabled={postEditor.saving}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={savePostEditor} disabled={postEditor.loading || postEditor.saving || !postEditor.slug}>
                    Save
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Experiments Tab */}
          <TabsContent value="experiments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature toggles</CardTitle>
                <CardDescription>Quickly enable or pause experimental sections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between border border-border/40 rounded-2xl p-4">
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Show newsletter section</p>
                    <p className="text-sm text-muted-foreground">
                      Controls the “Download the 5-step Financial Safety Check-in” band on the homepage.
                    </p>
                  </div>
                  <Switch
                    checked={experiments?.showNewsletterSection ?? true}
                    onCheckedChange={(checked) =>
                      setExperiments((prev) => ({ ...prev, showNewsletterSection: Boolean(checked) }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between border border-border/40 rounded-2xl p-4">
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Show lead magnet</p>
                    <p className="text-sm text-muted-foreground">
                      Enables the sticky mobile CTA and desktop exit intent panel.
                    </p>
                  </div>
                  <Switch
                    checked={experiments?.showLeadMagnet ?? true}
                    onCheckedChange={(checked) =>
                      setExperiments((prev) => ({ ...prev, showLeadMagnet: Boolean(checked) }))
                    }
                  />
                </div>
              </CardContent>
              <CardContent>
                <Button onClick={() => saveAll("Experiments")} disabled={saving !== null}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Toggles
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
 
           {/* Images Tab */}
           <TabsContent value="images" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <ImageIcon className="w-5 h-5" />
                   Manage Images
                 </CardTitle>
                 <CardDescription>Upload and manage photos for your website. Images are shown as thumbnails below.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="grid gap-6 md:grid-cols-2">
                   {/* Profile Photo (Hero) */}
                   <div className="border rounded-lg p-4 space-y-4">
                     <div>
                       <h3 className="text-lg font-semibold mb-1">Profile Photo (Hero)</h3>
                       <p className="text-sm text-muted-foreground">
                         This appears in the hero section on your homepage. Recommended size: 1200x800px.
                       </p>
                     </div>
                     {heroContent.imageUrl ? (
                       <div className="space-y-3">
                         <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center">
                           {imageErrors["hero"] ? (
                             <div className="text-center text-muted-foreground">
                               <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                               <p className="text-xs">Image not found</p>
                             </div>
                           ) : (
                             <img
                               src={heroContent.imageUrl}
                               alt="Hero profile photo"
                               className="w-full h-full object-contain"
                               onError={() => setImageErrors((prev) => ({ ...prev, hero: true }))}
                             />
                           )}
                         </div>
                         <div className="flex gap-2">
                           <Button
                             onClick={() => handleImageUpload("Profile Photo")}
                             variant="outline"
                             className="flex-1"
                           >
                             <Upload className="w-4 h-4 mr-2" />
                             Replace
                           </Button>
                           <Button
                             onClick={() => {
                               setHeroContent((prev) => ({ ...prev, imageUrl: "" }))
                               setImageErrors((prev) => ({ ...prev, hero: false }))
                               toast({ title: "Removed", description: "Profile photo cleared. Click Save to apply." })
                             }}
                             variant="outline"
                             size="icon"
                           >
                             <X className="w-4 h-4" />
                           </Button>
                         </div>
                         <p className="text-xs text-muted-foreground truncate" title={heroContent.imageUrl}>
                           {heroContent.imageUrl}
                         </p>
                       </div>
                     ) : (
                       <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                         <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-40" />
                         <Button
                           onClick={() => handleImageUpload("Profile Photo")}
                           variant="outline"
                         >
                           <Upload className="w-4 h-4 mr-2" />
                           Upload Photo
                         </Button>
                       </div>
                     )}
                   </div>

                   {/* Logo */}
                   <div className="border rounded-lg p-4 space-y-4">
                     <div>
                       <h3 className="text-lg font-semibold mb-1">Logo</h3>
                       <p className="text-sm text-muted-foreground">
                         Your brand logo appears in the header and footer. Recommended: transparent PNG, 200x60px.
                       </p>
                     </div>
                     {brand.logoUrl ? (
                       <div className="space-y-3">
                         <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center">
                           {imageErrors["logo"] ? (
                             <div className="text-center text-muted-foreground">
                               <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                               <p className="text-xs">Image not found</p>
                             </div>
                           ) : (
                             <img
                               src={brand.logoUrl}
                               alt="Logo"
                               className="max-w-full max-h-full object-contain"
                               onError={() => setImageErrors((prev) => ({ ...prev, logo: true }))}
                             />
                           )}
                         </div>
                         <div className="flex gap-2">
                           <Button
                             onClick={() => handleImageUpload("Logo")}
                             variant="outline"
                             className="flex-1"
                           >
                             <Upload className="w-4 h-4 mr-2" />
                             Replace
                           </Button>
                           <Button
                             onClick={() => {
                               setBrand((prev) => ({ ...prev, logoUrl: "" }))
                               setImageErrors((prev) => ({ ...prev, logo: false }))
                               toast({ title: "Removed", description: "Logo cleared. Click Save to apply." })
                             }}
                             variant="outline"
                             size="icon"
                           >
                             <X className="w-4 h-4" />
                           </Button>
                         </div>
                         <p className="text-xs text-muted-foreground truncate" title={brand.logoUrl}>
                           {brand.logoUrl}
                         </p>
                       </div>
                     ) : (
                       <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                         <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-40" />
                         <Button
                           onClick={() => handleImageUpload("Logo")}
                           variant="outline"
                         >
                           <Upload className="w-4 h-4 mr-2" />
                           Upload Logo
                         </Button>
                       </div>
                     )}
                   </div>

                   {/* Header Banner */}
                   <div className="border rounded-lg p-4 space-y-4">
                     <div>
                       <h3 className="text-lg font-semibold mb-1">Header Banner</h3>
                       <p className="text-sm text-muted-foreground">
                         Optional banner image for the header area. Recommended: 1920x200px.
                       </p>
                     </div>
                     {brand.headerBannerUrl ? (
                       <div className="space-y-3">
                         <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center">
                           {imageErrors["banner"] ? (
                             <div className="text-center text-muted-foreground">
                               <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                               <p className="text-xs">Image not found</p>
                             </div>
                           ) : (
                             <img
                               src={brand.headerBannerUrl}
                               alt="Header banner"
                               className="w-full h-full object-contain"
                               onError={() => setImageErrors((prev) => ({ ...prev, banner: true }))}
                             />
                           )}
                         </div>
                         <div className="flex gap-2">
                           <Button
                             onClick={() => handleImageUpload("Header Banner")}
                             variant="outline"
                             className="flex-1"
                           >
                             <Upload className="w-4 h-4 mr-2" />
                             Replace
                           </Button>
                           <Button
                             onClick={() => {
                               setBrand((prev) => ({ ...prev, headerBannerUrl: "" }))
                               setImageErrors((prev) => ({ ...prev, banner: false }))
                               toast({ title: "Removed", description: "Header banner cleared. Click Save to apply." })
                             }}
                             variant="outline"
                             size="icon"
                           >
                             <X className="w-4 h-4" />
                           </Button>
                         </div>
                         <p className="text-xs text-muted-foreground truncate" title={brand.headerBannerUrl}>
                           {brand.headerBannerUrl}
                         </p>
                       </div>
                     ) : (
                       <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                         <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-40" />
                         <Button
                           onClick={() => handleImageUpload("Header Banner")}
                           variant="outline"
                         >
                           <Upload className="w-4 h-4 mr-2" />
                           Upload Banner
                         </Button>
                       </div>
                     )}
                   </div>

                   {/* Open Graph Image */}
                   <div className="border rounded-lg p-4 space-y-4">
                     <div>
                       <h3 className="text-lg font-semibold mb-1">Open Graph Image</h3>
                       <p className="text-sm text-muted-foreground">
                         Image shown when your site is shared on social media. Recommended: 1200x630px.
                       </p>
                     </div>
                     {seo.ogImage ? (
                       <div className="space-y-3">
                         <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center">
                           {imageErrors["og"] ? (
                             <div className="text-center text-muted-foreground">
                               <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                               <p className="text-xs">Image not found</p>
                             </div>
                           ) : (
                             <img
                               src={seo.ogImage}
                               alt="Open Graph image"
                               className="w-full h-full object-contain"
                               onError={() => setImageErrors((prev) => ({ ...prev, og: true }))}
                             />
                           )}
                         </div>
                         <div className="flex gap-2">
                           <Button
                             onClick={() => handleImageUpload("OG Image")}
                             variant="outline"
                             className="flex-1"
                           >
                             <Upload className="w-4 h-4 mr-2" />
                             Replace
                           </Button>
                           <Button
                             onClick={() => {
                               setSeo((prev) => ({ ...prev, ogImage: "" }))
                               setImageErrors((prev) => ({ ...prev, og: false }))
                               toast({ title: "Removed", description: "OG image cleared. Click Save to apply." })
                             }}
                             variant="outline"
                             size="icon"
                           >
                             <X className="w-4 h-4" />
                           </Button>
                         </div>
                         <p className="text-xs text-muted-foreground truncate" title={seo.ogImage || ""}>
                           {seo.ogImage}
                         </p>
                       </div>
                     ) : (
                       <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                         <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-40" />
                         <Button
                           onClick={() => handleImageUpload("OG Image")}
                           variant="outline"
                         >
                           <Upload className="w-4 h-4 mr-2" />
                           Upload OG Image
                         </Button>
                       </div>
                     )}
                   </div>
                 </div>
                 <div className="pt-4 border-t">
                   <Button onClick={() => saveAll("Images")} disabled={saving !== null} className="w-full sm:w-auto">
                     <Save className="w-4 h-4 mr-2" />
                     Save Images
                   </Button>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>
 
           {/* Theme Tab */}
           <TabsContent value="theme" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Palette className="w-5 h-5" />
                   Theme & Styles
                 </CardTitle>
                 <CardDescription>Adjust brand colors, text color, background, and border radius</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="grid sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <Label>Mode</Label>
                     <div className="flex gap-3">
                       <Button
                         type="button"
                         variant={theme.mode === "light" ? "default" : "outline"}
                         onClick={() => setTheme({ ...theme, mode: "light" })}
                       >
                         Light
                       </Button>
                       <Button
                         type="button"
                         variant={theme.mode === "dark" ? "default" : "outline"}
                         onClick={() => setTheme({ ...theme, mode: "dark" })}
                       >
                         Dark
                       </Button>
                     </div>
                   </div>
                   <div className="space-y-2">
                     <Label>Border Radius</Label>
                     <Input
                       value={theme.radius}
                       onChange={(e) => setTheme({ ...theme, radius: e.target.value })}
                       placeholder="e.g. 0.5rem"
                     />
                   </div>
                   <div className="space-y-2 sm:col-span-2">
                    <Label>Sans Font Family</Label>
                    <Input
                      value={theme.fontSans ?? ""}
                      onChange={(e) => updateTheme("fontSans", e.target.value)}
                      placeholder="e.g. Geist, system-ui, sans-serif"
                    />
                   </div>
                   <div className="space-y-2 sm:col-span-2">
                     <Label>Serif Font Family</Label>
                     <Input
                      value={theme.fontSerif ?? ""}
                      onChange={(e) => updateTheme("fontSerif", e.target.value)}
                       placeholder="e.g. Cormorant Garamond, Georgia, serif"
                     />
                   </div>
                  {themeColorKeys.map((key) => (
                    <div key={key} className="space-y-2">
                      <Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                       <div className="flex items-center gap-3">
                         <input
                           type="color"
                          value={theme[key]}
                          onChange={(e) => updateTheme(key, e.target.value)}
                           className="h-10 w-14 rounded-md border border-border"
                           aria-label={`${key} color`}
                         />
                         <Input
                          value={theme[key]}
                          onChange={(e) => updateTheme(key, e.target.value)}
                         />
                       </div>
                     </div>
                   ))}
                 </div>
                 <div className="flex gap-3">
                   <Button onClick={() => saveAll("Theme")} disabled={saving !== null}>
                     <Save className="w-4 h-4 mr-2" />
                     Save Theme
                   </Button>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>

           {/* Brand Tab */}
           <TabsContent value="brand" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle>Brand</CardTitle>
                 <CardDescription>Set site name, subtitle and tagline</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label>Site Name</Label>
                   <p className="text-xs text-muted-foreground">Your practice or business name as it appears throughout the site</p>
                   <Input value={brand.name} onChange={(e) => setBrand({ ...brand, name: e.target.value })} placeholder="e.g., Financial Abuse Therapist" />
                 </div>
                 <div className="space-y-2">
                   <Label>Subtitle</Label>
                   <p className="text-xs text-muted-foreground">A short line that appears below the site name (optional)</p>
                   <Input value={brand.subtitle ?? ""} onChange={(e) => setBrand({ ...brand, subtitle: e.target.value })} placeholder="e.g., Specialized Therapy Services" />
                 </div>
                 <div className="space-y-2">
                   <Label>Tagline</Label>
                   <p className="text-xs text-muted-foreground">A longer tagline or mission statement (optional)</p>
                   <Textarea value={brand.tagline ?? ""} onChange={(e) => setBrand({ ...brand, tagline: e.target.value })} rows={3} placeholder="Your practice mission or tagline..." />
                 </div>
                 <Button onClick={() => saveAll("Brand")} disabled={saving !== null}>
                   <Save className="w-4 h-4 mr-2" /> Save Brand
                 </Button>
               </CardContent>
             </Card>
           </TabsContent>

           {/* Navigation Tab */}
           <TabsContent value="nav" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle>Navigation</CardTitle>
                 <CardDescription>Manage header and footer links</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 {navigation.map((link, idx) => (
                   <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end bg-muted p-3 rounded-md">
                     <div className="space-y-2">
                       <Label>Label</Label>
                       <Input
                         value={link.label}
                         onChange={(e) => {
                           const next = [...navigation]
                           next[idx] = { ...next[idx], label: e.target.value }
                           setNavigation(next)
                         }}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Href</Label>
                       <Input
                         value={link.href}
                         onChange={(e) => {
                           const next = [...navigation]
                           next[idx] = { ...next[idx], href: e.target.value }
                           setNavigation(next)
                         }}
                       />
                     </div>
                   </div>
                 ))}
                 <div className="flex gap-3">
                   <Button
                     variant="outline"
                     onClick={() => setNavigation((prev) => [...prev, { label: "New Link", href: "/" }])}
                   >
                     Add Link
                   </Button>
                   <Button onClick={() => saveAll("Navigation")} disabled={saving !== null}>
                     <Save className="w-4 h-4 mr-2" /> Save Navigation
                   </Button>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>

           {/* Contact Tab */}
           <TabsContent value="contact" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle>Contact</CardTitle>
                 <CardDescription>Manage phone, email, and social links</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label>Phone</Label>
                   <p className="text-xs text-muted-foreground">Include country code if needed (e.g., +61 2 1234 5678)</p>
                   <Input value={contact.phone ?? ""} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+61 2 1234 5678" />
                 </div>
                 <div className="space-y-2">
                   <Label>Email</Label>
                   <p className="text-xs text-muted-foreground">Primary contact email address</p>
                   <Input value={contact.email ?? ""} onChange={(e) => setContact({ ...contact, email: e.target.value })} type="email" placeholder="dan@financialabusetherapist.com.au" />
                 </div>
                <div className="space-y-2">
                  <Label>Alternate Email (optional)</Label>
                  <p className="text-xs text-muted-foreground">Secondary email address if needed</p>
                  <Input value={contact.emailAlt ?? ""} onChange={(e) => setContact({ ...contact, emailAlt: e.target.value })} type="email" />
                </div>
                 <div className="space-y-2">
                   <Label>Facebook URL</Label>
                   <p className="text-xs text-muted-foreground">Full URL to your Facebook page (optional)</p>
                   <Input value={social.facebook ?? ""} onChange={(e) => setSocial((p) => ({ ...p, facebook: e.target.value }))} placeholder="https://facebook.com/yourpage" />
                 </div>
                 <div className="space-y-2">
                   <Label>Instagram URL</Label>
                   <p className="text-xs text-muted-foreground">Full URL to your Instagram profile (optional)</p>
                   <Input value={social.instagram ?? ""} onChange={(e) => setSocial((p) => ({ ...p, instagram: e.target.value }))} placeholder="https://instagram.com/yourprofile" />
                 </div>
                 <div className="space-y-2">
                   <Label>LinkedIn URL</Label>
                   <p className="text-xs text-muted-foreground">Full URL to your LinkedIn profile (optional)</p>
                   <Input value={social.linkedin ?? ""} onChange={(e) => setSocial((p) => ({ ...p, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/yourprofile" />
                 </div>
                 <Button onClick={() => saveAll("Contact")} disabled={saving !== null}>
                   <Save className="w-4 h-4 mr-2" /> Save Contact
                 </Button>
               </CardContent>
             </Card>
           </TabsContent>

           {/* SEO Tab */}
           <TabsContent value="seo" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle>SEO</CardTitle>
                 <CardDescription>Global SEO metadata</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label>Title</Label>
                   <p className="text-xs text-muted-foreground">The main title shown in search results and browser tabs. Keep it under 60 characters.</p>
                   <Input value={seo.title ?? ""} onChange={(e) => setSeo({ ...seo, title: e.target.value })} placeholder="e.g., Financial Abuse Therapy | Dan Lobel" />
                 </div>
                 <div className="space-y-2">
                   <Label>Description</Label>
                   <p className="text-xs text-muted-foreground">A brief description shown in search results. Aim for 150-160 characters.</p>
                   <Textarea value={seo.description ?? ""} onChange={(e) => setSeo({ ...seo, description: e.target.value })} rows={3} placeholder="Describe your services and expertise..." />
                 </div>
                 <div className="space-y-2">
                   <Label>Open Graph Image URL</Label>
                   <p className="text-xs text-muted-foreground">Image shown when your site is shared on social media. Upload in the Images tab. Recommended: 1200x630px.</p>
                   <Input value={seo.ogImage ?? ""} onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })} placeholder="/api/assets/images/og.jpg" />
                 </div>
                 <Button onClick={() => saveAll("SEO")} disabled={saving !== null}>
                   <Save className="w-4 h-4 mr-2" /> Save SEO
                 </Button>
               </CardContent>
             </Card>
           </TabsContent>

           {/* Documents Tab */}
           <TabsContent value="documents" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle>Legal pages</CardTitle>
                <CardDescription>Manage Privacy Policy, Terms of Service, and Consent &amp; Policies content and downloadable files.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-8">
                <div className="grid gap-6 lg:grid-cols-3">
                   <div className="space-y-3 rounded-lg border border-border/40 p-4">
                     <p className="font-semibold text-[var(--foreground)]">Privacy Policy</p>
                     <div className="space-y-2">
                       <Label>Title</Label>
                       <Input
                         value={legal.privacy?.title ?? ""}
                         onChange={(e) => setLegal((prev) => ({ ...prev, privacy: { ...(prev.privacy ?? {}), title: e.target.value } }))}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Download URL</Label>
                       <Input
                         value={legal.privacy?.downloadUrl ?? ""}
                         onChange={(e) =>
                           setLegal((prev) => ({ ...prev, privacy: { ...(prev.privacy ?? {}), downloadUrl: e.target.value } }))
                         }
                       />
                       <div className="flex flex-wrap gap-3">
                         <Button
                           type="button"
                           variant="outline"
                           onClick={async () => {
                             try {
                              const url = await uploadAsset({ path: "docs/privacy-policy{{ext}}", accept: ".docx,.pdf" })
                               if (!url) return
                              setLegal((prev) => ({ ...prev, privacy: { ...(prev.privacy ?? {}), downloadUrl: url } }))
                               toast({ title: "Uploaded", description: "Privacy Policy document updated." })
                             } catch (e: unknown) {
                               toast({ title: "Upload failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" })
                             }
                           }}
                         >
                           <Upload className="w-4 h-4 mr-2" />
                           Replace file
                         </Button>
                         {legal.privacy?.downloadUrl ? (
                           <a className="text-sm underline text-[var(--accent)]" href={legal.privacy.downloadUrl} target="_blank" rel="noreferrer noopener">
                             View file
                           </a>
                         ) : null}
                       </div>
                     </div>
                     <div className="space-y-2">
                       <Label>Body (MDX/Markdown)</Label>
                       <Textarea
                         rows={10}
                         value={legal.privacy?.bodyMdx ?? ""}
                         onChange={(e) =>
                           setLegal((prev) => ({ ...prev, privacy: { ...(prev.privacy ?? {}), bodyMdx: e.target.value } }))
                         }
                       />
                     </div>
                   </div>

                   <div className="space-y-3 rounded-lg border border-border/40 p-4">
                     <p className="font-semibold text-[var(--foreground)]">Terms of Service</p>
                     <div className="space-y-2">
                       <Label>Title</Label>
                       <Input
                         value={legal.terms?.title ?? ""}
                         onChange={(e) => setLegal((prev) => ({ ...prev, terms: { ...(prev.terms ?? {}), title: e.target.value } }))}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Download URL</Label>
                       <Input
                         value={legal.terms?.downloadUrl ?? ""}
                         onChange={(e) =>
                           setLegal((prev) => ({ ...prev, terms: { ...(prev.terms ?? {}), downloadUrl: e.target.value } }))
                         }
                       />
                       <div className="flex flex-wrap gap-3">
                         <Button
                           type="button"
                           variant="outline"
                           onClick={async () => {
                             try {
                              const url = await uploadAsset({ path: "docs/terms-of-service{{ext}}", accept: ".docx,.pdf" })
                               if (!url) return
                              setLegal((prev) => ({ ...prev, terms: { ...(prev.terms ?? {}), downloadUrl: url } }))
                               toast({ title: "Uploaded", description: "Terms of Service document updated." })
                             } catch (e: unknown) {
                               toast({ title: "Upload failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" })
                             }
                           }}
                         >
                           <Upload className="w-4 h-4 mr-2" />
                           Replace file
                         </Button>
                         {legal.terms?.downloadUrl ? (
                           <a className="text-sm underline text-[var(--accent)]" href={legal.terms.downloadUrl} target="_blank" rel="noreferrer noopener">
                             View file
                           </a>
                         ) : null}
                       </div>
                     </div>
                     <div className="space-y-2">
                       <Label>Body (MDX/Markdown)</Label>
                       <Textarea
                         rows={10}
                         value={legal.terms?.bodyMdx ?? ""}
                         onChange={(e) =>
                           setLegal((prev) => ({ ...prev, terms: { ...(prev.terms ?? {}), bodyMdx: e.target.value } }))
                         }
                       />
                     </div>
                   </div>

                  <div className="space-y-3 rounded-lg border border-border/40 p-4">
                    <p className="font-semibold text-[var(--foreground)]">Consent &amp; Policies</p>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={legal.consent?.title ?? ""}
                        onChange={(e) => setLegal((prev) => ({ ...prev, consent: { ...(prev.consent ?? {}), title: e.target.value } }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Required statement (must be typed exactly)</Label>
                      <Input
                        value={legal.consent?.requiredStatement ?? ""}
                        onChange={(e) =>
                          setLegal((prev) => ({ ...prev, consent: { ...(prev.consent ?? {}), requiredStatement: e.target.value } }))
                        }
                        placeholder="I have read & I understand the contents of this document"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Download URL</Label>
                      <Input
                        value={legal.consent?.downloadUrl ?? ""}
                        onChange={(e) =>
                          setLegal((prev) => ({ ...prev, consent: { ...(prev.consent ?? {}), downloadUrl: e.target.value } }))
                        }
                      />
                      <div className="flex flex-wrap gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={async () => {
                            try {
                              const url = await uploadAsset({ path: "docs/consent-and-policies{{ext}}", accept: ".docx,.pdf" })
                              if (!url) return
                              setLegal((prev) => ({ ...prev, consent: { ...(prev.consent ?? {}), downloadUrl: url } }))
                              toast({ title: "Uploaded", description: "Consent & Policies document updated." })
                            } catch (e: unknown) {
                              toast({ title: "Upload failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" })
                            }
                          }}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Replace file
                        </Button>
                        {legal.consent?.downloadUrl ? (
                          <a className="text-sm underline text-[var(--accent)]" href={legal.consent.downloadUrl} target="_blank" rel="noreferrer noopener">
                            View file
                          </a>
                        ) : null}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Body (MDX/Markdown)</Label>
                      <Textarea
                        rows={10}
                        value={legal.consent?.bodyMdx ?? ""}
                        onChange={(e) =>
                          setLegal((prev) => ({ ...prev, consent: { ...(prev.consent ?? {}), bodyMdx: e.target.value } }))
                        }
                      />
                    </div>
                  </div>
                 </div>
               </CardContent>
             </Card>

             <Card>
               <CardHeader>
                 <CardTitle>Forms</CardTitle>
                 <CardDescription>Control where the “forms” links point (routes only).</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label>Enquiry</Label>
                   <Input value={forms.enquiry ?? ""} onChange={(e) => setForms((p) => ({ ...p, enquiry: e.target.value }))} />
                 </div>
                 <div className="space-y-2">
                   <Label>Consent</Label>
                   <Input value={forms.consent ?? ""} onChange={(e) => setForms((p) => ({ ...p, consent: e.target.value }))} />
                 </div>
                 <div className="space-y-2">
                   <Label>Intake</Label>
                   <Input value={forms.intake ?? ""} onChange={(e) => setForms((p) => ({ ...p, intake: e.target.value }))} />
                 </div>
                 <Button onClick={() => saveAll("Documents")} disabled={saving !== null}>
                   <Save className="w-4 h-4 mr-2" /> Save Documents
                 </Button>
               </CardContent>
             </Card>

             <Card>
               <CardHeader>
                 <CardTitle>Form pages (advanced)</CardTitle>
                 <CardDescription>
                   Full control over form fields, labels, options, required rules, and section structure. Apply JSON changes, then Save Documents.
                 </CardDescription>
               </CardHeader>
               <CardContent className="space-y-8">
                 <div className="space-y-3">
                   <p className="font-semibold text-[var(--foreground)]">Enquiry form schema (JSON)</p>
                   <Textarea
                     rows={14}
                     value={formPagesEditor.enquiry}
                     onChange={(e) => setFormPagesEditor((p) => ({ ...p, enquiry: e.target.value }))}
                   />
                   <div className="flex flex-wrap gap-3">
                     <Button
                       type="button"
                       variant="outline"
                       onClick={() => {
                         try {
                           const parsed = JSON.parse(formPagesEditor.enquiry || "{}")
                           setFormPages((prev) => ({ ...(prev ?? {}), enquiry: parsed }))
                           toast({ title: "Applied", description: "Enquiry form schema updated. Remember to Save Documents." })
                         } catch (e: unknown) {
                           toast({ title: "Invalid JSON", description: e instanceof Error ? e.message : "Unable to parse JSON", variant: "destructive" })
                         }
                       }}
                     >
                       Apply Enquiry JSON
                     </Button>
                     <Button
                       type="button"
                       variant="outline"
                       onClick={() => setFormPagesEditor((p) => ({ ...p, enquiry: JSON.stringify(formPages?.enquiry ?? {}, null, 2) }))}
                     >
                       Reset from current
                     </Button>
                     <a className="text-sm underline text-[var(--accent)] self-center" href="/enquiry" target="_blank" rel="noreferrer noopener">
                       Preview Enquiry
                     </a>
                   </div>
                 </div>

                 <div className="space-y-3">
                   <p className="font-semibold text-[var(--foreground)]">Intake form schema (JSON)</p>
                   <Textarea
                     rows={14}
                     value={formPagesEditor.intake}
                     onChange={(e) => setFormPagesEditor((p) => ({ ...p, intake: e.target.value }))}
                   />
                   <div className="flex flex-wrap gap-3">
                     <Button
                       type="button"
                       variant="outline"
                       onClick={() => {
                         try {
                           const parsed = JSON.parse(formPagesEditor.intake || "{}")
                           setFormPages((prev) => ({ ...(prev ?? {}), intake: parsed }))
                           toast({ title: "Applied", description: "Intake form schema updated. Remember to Save Documents." })
                         } catch (e: unknown) {
                           toast({ title: "Invalid JSON", description: e instanceof Error ? e.message : "Unable to parse JSON", variant: "destructive" })
                         }
                       }}
                     >
                       Apply Intake JSON
                     </Button>
                     <Button
                       type="button"
                       variant="outline"
                       onClick={() => setFormPagesEditor((p) => ({ ...p, intake: JSON.stringify(formPages?.intake ?? {}, null, 2) }))}
                     >
                       Reset from current
                     </Button>
                     <a className="text-sm underline text-[var(--accent)] self-center" href="/intake" target="_blank" rel="noreferrer noopener">
                       Preview Intake
                     </a>
                   </div>
                 </div>

                 <div className="space-y-3">
                   <p className="font-semibold text-[var(--foreground)]">Newsletter form schema (JSON)</p>
                   <Textarea
                     rows={14}
                     value={formPagesEditor.newsletter}
                     onChange={(e) => setFormPagesEditor((p) => ({ ...p, newsletter: e.target.value }))}
                   />
                   <div className="flex flex-wrap gap-3">
                     <Button
                       type="button"
                       variant="outline"
                       onClick={() => {
                         try {
                           const parsed = JSON.parse(formPagesEditor.newsletter || "{}")
                           setFormPages((prev) => ({ ...(prev ?? {}), newsletter: parsed }))
                           toast({ title: "Applied", description: "Newsletter form schema updated. Remember to Save Documents." })
                         } catch (e: unknown) {
                           toast({ title: "Invalid JSON", description: e instanceof Error ? e.message : "Unable to parse JSON", variant: "destructive" })
                         }
                       }}
                     >
                       Apply Newsletter JSON
                     </Button>
                     <Button
                       type="button"
                       variant="outline"
                       onClick={() => setFormPagesEditor((p) => ({ ...p, newsletter: JSON.stringify(formPages?.newsletter ?? {}, null, 2) }))}
                     >
                       Reset from current
                     </Button>
                     <a className="text-sm underline text-[var(--accent)] self-center" href="/newsletter" target="_blank" rel="noreferrer noopener">
                       Preview Newsletter
                     </a>
                   </div>
                 </div>
               </CardContent>
             </Card>

             <Card>
               <CardHeader>
                 <CardTitle>Client Care page</CardTitle>
                 <CardDescription>Edit the Client Care Hub checklists and downloads.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="space-y-3">
                   <p className="text-sm font-semibold text-[var(--foreground)]">Session preparation (3)</p>
                   {Array.from({ length: 3 }).map((_, idx) => (
                     <div key={`prep-${idx}`} className="space-y-2">
                       <Label>Item {idx + 1}</Label>
                       <Input
                         value={clientCare?.prepChecklist?.[idx] ?? ""}
                         onChange={(e) =>
                           setClientCare((prev) => {
                             const next = [...((prev?.prepChecklist ?? []) as string[])]
                             while (next.length < 3) next.push("")
                             next[idx] = e.target.value
                             return { ...(prev ?? {}), prepChecklist: next }
                           })
                         }
                       />
                     </div>
                   ))}
                 </div>

                 <div className="space-y-3">
                   <p className="text-sm font-semibold text-[var(--foreground)]">Aftercare ritual (3)</p>
                   {Array.from({ length: 3 }).map((_, idx) => (
                     <div key={`after-${idx}`} className="space-y-2">
                       <Label>Item {idx + 1}</Label>
                       <Input
                         value={clientCare?.aftercareChecklist?.[idx] ?? ""}
                         onChange={(e) =>
                           setClientCare((prev) => {
                             const next = [...((prev?.aftercareChecklist ?? []) as string[])]
                             while (next.length < 3) next.push("")
                             next[idx] = e.target.value
                             return { ...(prev ?? {}), aftercareChecklist: next }
                           })
                         }
                       />
                     </div>
                   ))}
                 </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[var(--foreground)]">Downloads & forms (Note: Page shows Inquiry Form, Intake Form, Privacy Policy, and Terms of Service as fixed buttons)</p>
                  <p className="text-xs text-[var(--primary)]/70">The downloads array is kept for backwards compatibility but the page displays fixed buttons.</p>
                  {Array.from({ length: 2 }).map((_, idx) => {
                    const link = clientCare?.downloads?.[idx] ?? { label: "", href: "" }
                    return (
                      <div key={`dl-${idx}`} className="grid gap-3 sm:grid-cols-2 rounded-lg border border-border/40 p-4">
                        <div className="space-y-2">
                          <Label>Label</Label>
                          <Input
                            value={link.label}
                            onChange={(e) =>
                              setClientCare((prev) => {
                                const next = [...(prev?.downloads ?? [])]
                                while (next.length < 2) next.push({ label: "", href: "" })
                                next[idx] = { ...next[idx], label: e.target.value }
                                return { ...(prev ?? {}), downloads: next }
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Href</Label>
                          <Input
                            value={link.href}
                            onChange={(e) =>
                              setClientCare((prev) => {
                                const next = [...(prev?.downloads ?? [])]
                                while (next.length < 2) next.push({ label: "", href: "" })
                                next[idx] = { ...next[idx], href: e.target.value }
                                return { ...(prev ?? {}), downloads: next }
                              })
                            }
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                 <Button onClick={() => saveAll("Client care")} disabled={saving !== null}>
                   <Save className="w-4 h-4 mr-2" /> Save Client Care
                 </Button>
               </CardContent>
             </Card>
           </TabsContent>

          {/* Homepage Buttons Tab */}
           <TabsContent value="content-sections" className="space-y-6">
             <Card>
               <CardHeader>
                <CardTitle>Homepage Buttons</CardTitle>
                <CardDescription>Manage the 9 navy buttons shown in the homepage “Important Links” section.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                 {Array.from({ length: 9 }).map((_, idx) => {
                   const section = contentSections?.[idx] ?? { title: "", slug: "", content: "", pdfUrl: "" }
                   return (
                     <div key={idx} className="space-y-4 rounded-lg border border-border/40 p-4">
                       <p className="text-sm font-semibold text-[var(--foreground)]">Section {idx + 1}</p>
                       <div className="grid gap-4 sm:grid-cols-2">
                         <div className="space-y-2">
                           <Label>Title</Label>
                           <Input
                             value={section.title}
                             onChange={(e) => {
                               const next = [...(contentSections ?? [])]
                               while (next.length < 9) next.push({ title: "", slug: "", content: "", pdfUrl: "" })
                               next[idx] = { ...next[idx], title: e.target.value }
                               setContentSections(next)
                             }}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Slug (URL-friendly identifier)</Label>
                           <Input
                             value={section.slug}
                             onChange={(e) => {
                               const next = [...(contentSections ?? [])]
                               while (next.length < 9) next.push({ title: "", slug: "", content: "", pdfUrl: "" })
                               next[idx] = { ...next[idx], slug: e.target.value }
                               setContentSections(next)
                             }}
                           />
                         </div>
                       </div>
                       <div className="space-y-2">
                         <Label>Content (Markdown or plain text)</Label>
                         <Textarea
                           rows={8}
                           value={section.content}
                           onChange={(e) => {
                             const next = [...(contentSections ?? [])]
                             while (next.length < 9) next.push({ title: "", slug: "", content: "", pdfUrl: "" })
                             next[idx] = { ...next[idx], content: e.target.value }
                             setContentSections(next)
                           }}
                         />
                       </div>
                       <div className="space-y-2">
                         <Label>PDF Document URL</Label>
                         <div className="flex gap-3">
                           <Input
                             value={section.pdfUrl ?? ""}
                             onChange={(e) => {
                               const next = [...(contentSections ?? [])]
                               while (next.length < 9) next.push({ title: "", slug: "", content: "", pdfUrl: "" })
                               next[idx] = { ...next[idx], pdfUrl: e.target.value }
                               setContentSections(next)
                             }}
                             placeholder="PDF URL or leave empty"
                           />
                           <Button
                             type="button"
                             variant="outline"
                             onClick={async () => {
                               try {
                                 const rawSlug = String(section.slug ?? "").trim()
                                 const slugKey = slugifyAdmin(rawSlug) || slugifyAdmin(String(section.title ?? "")) || `section-${idx + 1}`
                                 // Store PDFs at a stable slug-based path so replacements overwrite the canonical file.
                                 const url = await uploadAsset({ path: `docs/content-sections/${slugKey}.pdf`, accept: ".pdf" })
                                 if (!url) return
                                 const next = [...(contentSections ?? [])]
                                 while (next.length < 9) next.push({ title: "", slug: "", content: "", pdfUrl: "" })
                                 // Ensure slug is URL-safe so the public button routes correctly.
                                 next[idx] = { ...next[idx], slug: slugKey, pdfUrl: url }
                                 setContentSections(next)
                                 toast({ title: "Uploaded", description: `PDF uploaded for section ${idx + 1}.` })
                                 // Persist immediately so uploads never get "lost" if user forgets to click Save.
                                 // Wait a tick so dirty tracking sees the updated state.
                                 await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
                                 void saveAll("Content sections")
                               } catch (e: unknown) {
                                 toast({ title: "Upload failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" })
                               }
                             }}
                           >
                             <Upload className="w-4 h-4 mr-2" />
                             Upload PDF
                           </Button>
                         </div>
                         {section.pdfUrl ? (
                           <a className="text-sm underline text-[var(--accent)]" href={section.pdfUrl} target="_blank" rel="noopener noreferrer">
                             View PDF
                           </a>
                         ) : null}
                       </div>
                       {section.slug ? (
                         <div>
                           <Link href={`/content-sections/${section.slug}`} target="_blank" className="text-sm underline text-[var(--accent)]">
                             View page →
                           </Link>
                         </div>
                       ) : null}
                     </div>
                   )
                 })}
                 <Button onClick={() => saveAll("Content sections")} disabled={saving !== null}>
                   <Save className="w-4 h-4 mr-2" /> Save Content Sections
                 </Button>
               </CardContent>
             </Card>
           </TabsContent>

           {/* Consultations Tab */}
           <TabsContent value="consultations" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle>Consultation Options</CardTitle>
                 <CardDescription>Manage session formats and pricing</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 {consultations.map((opt, idx) => (
                   <div key={idx} className="grid sm:grid-cols-3 gap-3 items-end bg-muted p-3 rounded-md">
                     <div className="space-y-2">
                       <Label>Format</Label>
                       <Input
                         value={opt.format}
                         onChange={(e) => {
                           const next = [...consultations]
                           next[idx] = { ...next[idx], format: e.target.value }
                           setConsultations(next)
                         }}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Price</Label>
                       <Input
                         value={opt.price}
                         onChange={(e) => {
                           const next = [...consultations]
                           next[idx] = { ...next[idx], price: e.target.value }
                           setConsultations(next)
                         }}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Duration</Label>
                       <Input
                         value={opt.duration}
                         onChange={(e) => {
                           const next = [...consultations]
                           next[idx] = { ...next[idx], duration: e.target.value }
                           setConsultations(next)
                         }}
                       />
                     </div>
                   </div>
                 ))}
                 <div className="flex gap-3">
                   <Button variant="outline" onClick={() => setConsultations((p) => [...p, { format: "New", price: "$0", duration: "60 min" }])}>
                     Add Option
                   </Button>
                   <Button onClick={() => saveAll("Consultations")} disabled={saving !== null}>
                     <Save className="w-4 h-4 mr-2" /> Save Consultations
                   </Button>
                 </div>
               </CardContent>
             </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment methods</CardTitle>
                <CardDescription>
                  Controls the payment method text, and the “Accepted payments” list (logos + toggles). No payment processing logic is changed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[var(--foreground)]">Billing highlights (3)</p>
                  {Array.from({ length: 3 }).map((_, idx) => {
                    const item = bookingCopy?.billingHighlights?.[idx] ?? { title: "", detail: "" }
                    return (
                      <div key={`bh-${idx}`} className="grid gap-3 sm:grid-cols-2 rounded-lg border border-border/40 p-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={item.title}
                            onChange={(e) =>
                              setBookingCopy((prev) => {
                                const next = [...(prev?.billingHighlights ?? [])]
                                while (next.length < 3) next.push({ title: "", detail: "" })
                                next[idx] = { ...next[idx], title: e.target.value }
                                return { ...(prev ?? {}), billingHighlights: next }
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Detail</Label>
                          <Input
                            value={item.detail}
                            onChange={(e) =>
                              setBookingCopy((prev) => {
                                const next = [...(prev?.billingHighlights ?? [])]
                                while (next.length < 3) next.push({ title: "", detail: "" })
                                next[idx] = { ...next[idx], detail: e.target.value }
                                return { ...(prev ?? {}), billingHighlights: next }
                              })
                            }
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[var(--foreground)]">Payment support (2)</p>
                  {Array.from({ length: 2 }).map((_, idx) => {
                    const item = bookingCopy?.paymentSupport?.[idx] ?? { title: "", detail: "" }
                    return (
                      <div key={`ps-${idx}`} className="grid gap-3 sm:grid-cols-2 rounded-lg border border-border/40 p-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={item.title}
                            onChange={(e) =>
                              setBookingCopy((prev) => {
                                const next = [...(prev?.paymentSupport ?? [])]
                                while (next.length < 2) next.push({ title: "", detail: "" })
                                next[idx] = { ...next[idx], title: e.target.value }
                                return { ...(prev ?? {}), paymentSupport: next }
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Detail</Label>
                          <Input
                            value={item.detail}
                            onChange={(e) =>
                              setBookingCopy((prev) => {
                                const next = [...(prev?.paymentSupport ?? [])]
                                while (next.length < 2) next.push({ title: "", detail: "" })
                                next[idx] = { ...next[idx], detail: e.target.value }
                                return { ...(prev ?? {}), paymentSupport: next }
                              })
                            }
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[var(--foreground)]">Accepted payments (add as many as you like)</p>
                  <p className="text-sm text-muted-foreground">Toggle each option on/off and upload a logo if you want it displayed.</p>
                  {(bookingCopy?.paymentOptions ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No payment options yet. Click “Add payment option”.</p>
                  ) : (
                    <div className="space-y-3">
                      {(bookingCopy?.paymentOptions ?? []).map((opt, idx) => {
                        const enabled = (opt?.enabled ?? true) as boolean
                        const safeKey = String(opt?.id || opt?.label || `option-${idx}`)
                        return (
                          <div key={safeKey} className="grid gap-3 rounded-lg border border-border/40 p-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label>Label</Label>
                                <Input
                                  value={opt?.label ?? ""}
                                  onChange={(e) =>
                                    setBookingCopy((prev) => {
                                      const next = [...(prev?.paymentOptions ?? [])]
                                      next[idx] = {
                                        id: opt?.id ?? `po-${Date.now()}`,
                                        label: e.target.value,
                                        enabled,
                                        logoUrl: opt?.logoUrl ?? "",
                                      }
                                      return { ...(prev ?? {}), paymentOptions: next }
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Enabled</Label>
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={enabled}
                                    onCheckedChange={(checked) =>
                                      setBookingCopy((prev) => {
                                        const next = [...(prev?.paymentOptions ?? [])]
                                        next[idx] = {
                                          id: opt?.id ?? `po-${Date.now()}`,
                                          label: opt?.label ?? "",
                                          enabled: checked,
                                          logoUrl: opt?.logoUrl ?? "",
                                        }
                                        return { ...(prev ?? {}), paymentOptions: next }
                                      })
                                    }
                                  />
                                  <span className="text-sm text-muted-foreground">{enabled ? "On" : "Off"}</span>
                                </div>
                              </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label>Logo URL</Label>
                                <Input
                                  value={opt?.logoUrl ?? ""}
                                  onChange={(e) =>
                                    setBookingCopy((prev) => {
                                      const next = [...(prev?.paymentOptions ?? [])]
                                      next[idx] = {
                                        id: opt?.id ?? `po-${Date.now()}`,
                                        label: opt?.label ?? "",
                                        enabled,
                                        logoUrl: e.target.value,
                                      }
                                      return { ...(prev ?? {}), paymentOptions: next }
                                    })
                                  }
                                  placeholder="/api/assets/payment-options/apple-pay.png"
                                />
                              </div>
                              <div className="flex flex-wrap items-end gap-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={async () => {
                                    try {
                                      const base = String(opt?.label || opt?.id || `payment-option-${idx}`)
                                        .toLowerCase()
                                        .replace(/[^a-z0-9]+/g, "-")
                                        .replace(/(^-|-$)+/g, "")
                                      const url = await uploadAsset({ path: `payment-options/${base}{{ext}}`, accept: "image/*" })
                                      if (!url) return
                                      setBookingCopy((prev) => {
                                        const next = [...(prev?.paymentOptions ?? [])]
                                        next[idx] = {
                                          id: opt?.id ?? `po-${Date.now()}`,
                                          label: opt?.label ?? "",
                                          enabled,
                                          logoUrl: url,
                                        }
                                        return { ...(prev ?? {}), paymentOptions: next }
                                      })
                                      toast({ title: "Uploaded", description: "Payment logo updated. Remember to Save." })
                                    } catch (e: unknown) {
                                      toast({ title: "Upload failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" })
                                    }
                                  }}
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload logo
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    setBookingCopy((prev) => {
                                      const next = [...(prev?.paymentOptions ?? [])]
                                      next.splice(idx, 1)
                                      return { ...(prev ?? {}), paymentOptions: next }
                                    })
                                  }
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setBookingCopy((prev) => {
                          const next = [...(prev?.paymentOptions ?? [])]
                          next.push({ id: `po-${Date.now()}`, label: "New payment method", enabled: true, logoUrl: "" })
                          return { ...(prev ?? {}), paymentOptions: next }
                        })
                      }
                    >
                      Add payment option
                    </Button>
                  </div>
                </div>

                <Button onClick={() => saveAll("Payment copy")} disabled={saving !== null}>
                  <Save className="w-4 h-4 mr-2" /> Save Payment Copy
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduler helper copy</CardTitle>
                <CardDescription>Controls the “Secure checkout” bullet points and help text (text only).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[var(--foreground)]">Bullet points (3)</p>
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={`sp-${idx}`} className="space-y-2">
                      <Label>Point {idx + 1}</Label>
                      <Input
                        value={bookingCopy?.schedulerPoints?.[idx] ?? ""}
                        onChange={(e) =>
                          setBookingCopy((prev) => {
                            const next = [...(prev?.schedulerPoints ?? [])]
                            while (next.length < 3) next.push("")
                            next[idx] = e.target.value
                            return { ...(prev ?? {}), schedulerPoints: next }
                          })
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Help text</Label>
                  <Input
                    value={bookingCopy?.schedulerHelpText ?? ""}
                    onChange={(e) => setBookingCopy((prev) => ({ ...(prev ?? {}), schedulerHelpText: e.target.value }))}
                  />
                </div>

                <Button onClick={() => saveAll("Scheduler copy")} disabled={saving !== null}>
                  <Save className="w-4 h-4 mr-2" /> Save Scheduler Copy
                </Button>
              </CardContent>
            </Card>
           </TabsContent>

           {/* Resources Tab */}
           <TabsContent value="resources" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle>Crisis Resources</CardTitle>
                 <CardDescription>
                   Carousel is locked to exactly 8 entries. You can edit details and upload logos, but you can’t add extra items.
                 </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 {resources.map((r, idx) => (
                   <div key={r.name} className="grid gap-3 rounded-lg border border-border/40 p-4">
                     <div className="grid gap-3 sm:grid-cols-2">
                       <div className="space-y-2">
                         <Label>Name (locked)</Label>
                         <Input value={r.name} disabled />
                       </div>
                       <div className="space-y-2">
                         <Label>Number</Label>
                         <Input
                           value={r.number}
                           onChange={(e) => {
                             const next = [...resources]
                             next[idx] = { ...next[idx], number: e.target.value }
                             setResources(next)
                           }}
                         />
                       </div>
                     </div>
                     <div className="grid gap-3 sm:grid-cols-2">
                       <div className="space-y-2">
                         <Label>Website</Label>
                         <Input
                           value={r.website ?? ""}
                           onChange={(e) => {
                             const next = [...resources]
                             next[idx] = { ...next[idx], website: e.target.value }
                             setResources(next)
                           }}
                         />
                       </div>
                       <div className="space-y-2">
                         <Label>Logo URL</Label>
                         <Input
                           value={r.logoUrl ?? ""}
                           onChange={(e) => {
                             const next = [...resources]
                             next[idx] = { ...next[idx], logoUrl: e.target.value }
                             setResources(next)
                           }}
                         />
                       </div>
                     </div>
                     <div className="grid gap-3 sm:grid-cols-2">
                       <div className="space-y-2">
                         <Label>Logo Height (px)</Label>
                         <Input
                           value={String(r.logoHeight ?? "")}
                           onChange={(e) => {
                             const n = Number(e.target.value)
                             const next = [...resources]
                             next[idx] = { ...next[idx], logoHeight: Number.isFinite(n) ? n : undefined }
                             setResources(next)
                           }}
                           placeholder="e.g. 80"
                         />
                       </div>
                       <div className="flex items-end">
                         <Button
                           type="button"
                           variant="outline"
                           onClick={async () => {
                             try {
                               const safe = r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
                               const url = await uploadAsset({ path: `carousel/${safe}.png`, accept: "image/*" })
                               if (!url) return
                               const next = [...resources]
                               next[idx] = { ...next[idx], logoUrl: url }
                               setResources(next)
                               toast({ title: "Uploaded", description: `${r.name} logo updated. Remember to Save.` })
                             } catch (e: unknown) {
                               toast({ title: "Upload failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" })
                             }
                           }}
                         >
                           <Upload className="w-4 h-4 mr-2" />
                           Upload logo
                         </Button>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <Label>Description</Label>
                       <Textarea
                         rows={2}
                         value={r.description ?? ""}
                         onChange={(e) => {
                           const next = [...resources]
                           next[idx] = { ...next[idx], description: e.target.value }
                           setResources(next)
                         }}
                       />
                     </div>
                   </div>
                 ))}
                 <div className="flex gap-3">
                   <Button onClick={() => saveAll("Resources")} disabled={saving !== null}>
                     <Save className="w-4 h-4 mr-2" /> Save Resources
                   </Button>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>

           {/* History Tab */}
           <TabsContent value="history" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle>Version history</CardTitle>
                 <CardDescription>Rollback to a previous saved configuration.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="flex gap-3">
                   <Button variant="outline" onClick={loadVersions} disabled={versionsLoading || saving !== null}>
                     {versionsLoading ? "Loading…" : "Refresh history"}
                   </Button>
                 </div>
                 {versions.length === 0 ? (
                   <p className="text-sm text-muted-foreground">
                     No history yet. (A history entry is created on each save once `site_config_versions` exists.)
                   </p>
                 ) : (
                   <div className="space-y-3">
                     {versions.map((v) => (
                       <div
                         key={v.id}
                         className="flex flex-col gap-3 rounded-lg border border-border/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                       >
                         <div>
                           <p className="font-semibold text-[var(--foreground)]">
                             {new Date(v.updated_at).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}
                           </p>
                           <p className="text-sm text-muted-foreground">Version: {v.version}</p>
                         </div>
                         <Button onClick={() => rollbackTo(v.id)} disabled={saving !== null}>
                           Rollback
                         </Button>
                       </div>
                     ))}
                   </div>
                 )}
               </CardContent>
             </Card>
           </TabsContent>

           {/* Assistant Tab */}
           <TabsContent value="assistant" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle>Assistant</CardTitle>
                 <CardDescription>Type a command like “set primary to #4169e1” or “hero title to ‘Welcome’”</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <AssistantBox onSaved={() => toast({ title: "Updated via Assistant" })} />
               </CardContent>
             </Card>
             <Card>
               <CardHeader>
                 <CardTitle>Code Agent (GitHub PR)</CardTitle>
                 <CardDescription>Creates a GitHub issue that triggers an automated PR workflow.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <CodeAgentBox />
               </CardContent>
             </Card>
           </TabsContent>
         </Tabs>
         {!loading && (
           <div className="pt-6">
             <Button onClick={() => saveAll()} disabled={saving !== null}>
               <Save className="w-4 h-4 mr-2" />
               Save All Changes
             </Button>
           </div>
         )}
       </div>
     </div>
   )
 }
