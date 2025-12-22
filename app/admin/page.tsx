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
import { Upload, Save, Eye, LogOut, ImageIcon, FileText, DollarSign, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { SiteConfig } from "@/lib/config"
import type { PostMeta, VideoMeta } from "@/lib/mdx"
import { Switch } from "@/components/ui/switch"
 
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
    showNewsletter: true,
    showImportantLinks: true,
    showTestimonials: true,
    showOtherAreas: true,
    showBooking: true,
    showFaqs: true,
    showContact: true,
    showCrisis: true,
    showLeadMagnet: true,
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
  importantSectionLinks: [],
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

   const redirectToLogin = (nextPath = "/admin") => {
     router.replace(`/admin/login?next=${encodeURIComponent(nextPath)}`)
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
 
   const [aboutContent, setAboutContent] = useState({
     title: "",
     paragraphs: [""],
   })
 
   const [services, setServices] = useState<{ id: string; name: string; price: string }[]>([])
  const [brand, setBrand] = useState<{ name: string; subtitle?: string; tagline?: string }>({ name: "" })
  const [seo, setSeo] = useState<{ title?: string; description?: string; ogImage?: string }>({})
  const [navigation, setNavigation] = useState<{ label: string; href: string }[]>([])
  const [contact, setContact] = useState<{ phone?: string; email?: string }>({})
  const [consultations, setConsultations] = useState<{ format: string; price: string; duration: string }[]>([])
  const [resources, setResources] = useState<{ name: string; number: string }[]>([])
  const [homepage, setHomepage] = useState<NonNullable<SiteConfig["homepage"]>>(createEmptyHomepage())
  const [postsMeta, setPostsMeta] = useState<PostMeta[]>([])
  const [videosMeta, setVideosMeta] = useState<VideoMeta[]>([])
  const [newPostDraft, setNewPostDraft] = useState({ title: "", description: "" })
  const [newVideoDraft, setNewVideoDraft] = useState({ title: "", description: "", videoUrl: "" })
const [experiments, setExperiments] = useState<SiteConfig["experiments"]>({
  showNewsletterSection: true,
  showLeadMagnet: true,
})
 
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
        setHeroContent({
          ...heroDefaults,
          ...(data.hero ?? {}),
          primaryCta: { ...heroDefaults.primaryCta, ...(data.hero?.primaryCta ?? {}) },
          secondaryCta: { ...heroDefaults.secondaryCta, ...(data.hero?.secondaryCta ?? {}) },
          stats: data.hero?.stats ?? [],
        })
        setAboutContent(data.about)
        setServices(data.services)
       setBrand(data.brand ?? {})
       setSeo(data.seo ?? {})
       setNavigation(data.navigation ?? [])
       setContact(data.contact ?? {})
       setConsultations(data.consultations ?? [])
       setResources(data.resources ?? [])
       const homepageDefaults = createEmptyHomepage()
       setHomepage({
         ...homepageDefaults,
         ...(data.homepage ?? {}),
         sections: { ...(homepageDefaults.sections ?? {}), ...(data.homepage?.sections ?? {}) },
         copy: { ...(homepageDefaults.copy ?? {}), ...(data.homepage?.copy ?? {}) },
         otherAreas: data.homepage?.otherAreas ?? [],
         importantSectionLinks: data.homepage?.importantSectionLinks ?? [],
         valueProps: data.homepage?.valueProps ?? [],
         testimonials: data.homepage?.testimonials ?? [],
         faqs: data.homepage?.faqs ?? [],
         leadMagnet: {
           ...homepageDefaults.leadMagnet,
           ...(data.homepage?.leadMagnet ?? {}),
         },
       })
       setExperiments({
         showNewsletterSection: data.experiments?.showNewsletterSection ?? true,
         showLeadMagnet: data.experiments?.showLeadMagnet ?? true,
       })
       } catch {
         toast({ title: "Failed to load config", variant: "destructive" })
       } finally {
         setLoading(false)
       }
     }
     load()
    loadContent()
   }, [toast, router])
 
   async function saveAll(section?: string) {
     setSaving(section ?? "all")
     try {
       const res = await fetch("/api/site-config", {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           theme,
           hero: heroContent,
           about: aboutContent,
           services,
           brand,
           seo,
           navigation,
           contact,
           consultations,
           resources,
          experiments,
           homepage,
         }),
       })
       if (res.status === 401) {
         toast({ title: "Session expired", description: "Please sign in again.", variant: "destructive" })
         redirectToLogin("/admin")
         return
       }
       if (!res.ok) throw new Error("Save failed")
       toast({ title: "Saved", description: section ? `${section} updated` : "All changes saved" })
     } catch (error: unknown) {
       const description = error instanceof Error ? error.message : "Unable to save"
       toast({ title: "Save failed", description, variant: "destructive" })
     } finally {
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
   async function logout() {
     await fetch("/api/auth/logout", { method: "POST" })
     router.replace("/admin/login")
   }
 
   const handleImageUpload = (section: string) => {
     toast({
       title: "Image Upload",
       description: `Image for ${section} would be uploaded here`,
     })
   }
 
   return (
     <div className="min-h-screen bg-muted">
       {/* Header */}
       <header className="bg-primary text-primary-foreground py-4 sticky top-0 z-10 shadow-lg">
         <div className="container mx-auto px-4">
           <div className="flex items-center justify-between">
             <div>
               <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm opacity-80">The Financial Therapist</p>
             </div>
             <div className="flex items-center gap-4">
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
        <TabsList className="grid w-full grid-cols-15 gap-2 max-w-full">
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="homepage">Homepage</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="experiments">Experiments</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
           <TabsTrigger value="brand">Brand</TabsTrigger>
           <TabsTrigger value="nav">Navigation</TabsTrigger>
           <TabsTrigger value="contact">Contact</TabsTrigger>
           <TabsTrigger value="seo">SEO</TabsTrigger>
           <TabsTrigger value="consultations">Consultations</TabsTrigger>
           <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="assistant">Assistant</TabsTrigger>
          </TabsList>
 
           {/* Hero Section Tab */}
           <TabsContent value="hero" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <FileText className="w-5 h-5" />
                   Edit Hero Section
                 </CardTitle>
                 <CardDescription>Update the main headline and description on your homepage</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-eyebrow">Eyebrow / Tagline</Label>
                  <Input
                    id="hero-eyebrow"
                    value={heroContent.eyebrow ?? ""}
                    onChange={(e) => setHeroContent((prev) => ({ ...prev, eyebrow: e.target.value }))}
                  />
                </div>
                 <div className="space-y-2">
                   <Label htmlFor="hero-title">Main Title</Label>
                   <Input
                     id="hero-title"
                     value={heroContent.title}
                     onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                     className="text-lg"
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="hero-subtitle">Subtitle</Label>
                   <Input
                     id="hero-subtitle"
                     value={heroContent.subtitle}
                     onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="hero-description">Description</Label>
                   <Textarea
                     id="hero-description"
                     value={heroContent.description}
                     onChange={(e) => setHeroContent({ ...heroContent, description: e.target.value })}
                     rows={4}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="hero-image">Hero Image URL</Label>
                   <Input
                     id="hero-image"
                     value={heroContent.imageUrl}
                     onChange={(e) => setHeroContent({ ...heroContent, imageUrl: e.target.value })}
                   />
                 </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hero-primary-label">Primary CTA Label</Label>
                    <Input
                      id="hero-primary-label"
                      value={heroContent.primaryCta?.label ?? ""}
                      onChange={(e) =>
                        setHeroContent((prev) => ({
                          ...prev,
                          primaryCta: { ...(prev.primaryCta ?? { label: "", href: "" }), label: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-primary-href">Primary CTA URL</Label>
                    <Input
                      id="hero-primary-href"
                      value={heroContent.primaryCta?.href ?? ""}
                      onChange={(e) =>
                        setHeroContent((prev) => ({
                          ...prev,
                          primaryCta: { ...(prev.primaryCta ?? { label: "", href: "" }), href: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hero-secondary-label">Secondary CTA Label</Label>
                    <Input
                      id="hero-secondary-label"
                      value={heroContent.secondaryCta?.label ?? ""}
                      onChange={(e) =>
                        setHeroContent((prev) => ({
                          ...prev,
                          secondaryCta: { ...(prev.secondaryCta ?? { label: "", href: "" }), label: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-secondary-href">Secondary CTA URL</Label>
                    <Input
                      id="hero-secondary-href"
                      value={heroContent.secondaryCta?.href ?? ""}
                      onChange={(e) =>
                        setHeroContent((prev) => ({
                          ...prev,
                          secondaryCta: { ...(prev.secondaryCta ?? { label: "", href: "" }), href: e.target.value },
                        }))
                      }
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
                <CardTitle>Important links (editable row)</CardTitle>
                <CardDescription>Controls the “internal section deep-dives” buttons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(homepage.importantSectionLinks ?? []).map((link, idx) => (
                  <div key={`${link.href}-${idx}`} className="grid gap-3 sm:grid-cols-2 items-end rounded-lg border border-border/40 p-4">
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={link.label}
                        onChange={(e) => {
                          const next = [...(homepage.importantSectionLinks ?? [])]
                          next[idx] = { ...next[idx], label: e.target.value }
                          setHomepage((prev) => ({ ...prev, importantSectionLinks: next }))
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Href</Label>
                      <Input
                        value={link.href}
                        onChange={(e) => {
                          const next = [...(homepage.importantSectionLinks ?? [])]
                          next[idx] = { ...next[idx], href: e.target.value }
                          setHomepage((prev) => ({ ...prev, importantSectionLinks: next }))
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        const next = [...(homepage.importantSectionLinks ?? [])]
                        next.splice(idx, 1)
                        setHomepage((prev) => ({ ...prev, importantSectionLinks: next }))
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
                        importantSectionLinks: [...(prev.importantSectionLinks ?? []), { label: "New link", href: "/" }],
                      }))
                    }
                  >
                    + Add link
                  </Button>
                  <Button onClick={() => saveAll("Important links")} disabled={saving !== null}>
                    <Save className="w-4 h-4 mr-2" />
                    Save links
                  </Button>
                </div>
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
                      <Link
                        href={`/blog/${post.slug}`}
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
                 <CardDescription>Upload and manage photos for your website</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="space-y-4">
                   <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                     <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-40" />
                     <h3 className="text-lg font-medium mb-2">Profile Photo</h3>
                     <p className="text-sm text-muted-foreground mb-4">Current: Dan Lobel headshot</p>
                     <Button
                       onClick={() => handleImageUpload("Profile Photo")}
                       variant="outline"
                     >
                       <Upload className="w-4 h-4 mr-2" />
                       Upload New Photo
                     </Button>
                   </div>
 
                   <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                     <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-40" />
                     <h3 className="text-lg font-medium mb-2">Background Images</h3>
                     <p className="text-sm text-muted-foreground mb-4">Add decorative images for sections</p>
                     <Button
                       onClick={() => handleImageUpload("Background Images")}
                       variant="outline"
                     >
                       <Upload className="w-4 h-4 mr-2" />
                       Upload Images
                     </Button>
                   </div>
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
                   <Input value={brand.name} onChange={(e) => setBrand({ ...brand, name: e.target.value })} />
                 </div>
                 <div className="space-y-2">
                   <Label>Subtitle</Label>
                   <Input value={brand.subtitle ?? ""} onChange={(e) => setBrand({ ...brand, subtitle: e.target.value })} />
                 </div>
                 <div className="space-y-2">
                   <Label>Tagline</Label>
                   <Textarea value={brand.tagline ?? ""} onChange={(e) => setBrand({ ...brand, tagline: e.target.value })} rows={3} />
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
                 <CardDescription>Manage phone and email</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label>Phone</Label>
                   <Input value={contact.phone ?? ""} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                 </div>
                 <div className="space-y-2">
                   <Label>Email</Label>
                   <Input value={contact.email ?? ""} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
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
                   <Input value={seo.title ?? ""} onChange={(e) => setSeo({ ...seo, title: e.target.value })} />
                 </div>
                 <div className="space-y-2">
                   <Label>Description</Label>
                   <Textarea value={seo.description ?? ""} onChange={(e) => setSeo({ ...seo, description: e.target.value })} rows={3} />
                 </div>
                 <div className="space-y-2">
                   <Label>Open Graph Image URL</Label>
                   <Input value={seo.ogImage ?? ""} onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })} />
                 </div>
                 <Button onClick={() => saveAll("SEO")} disabled={saving !== null}>
                   <Save className="w-4 h-4 mr-2" /> Save SEO
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
           </TabsContent>

           {/* Resources Tab */}
           <TabsContent value="resources" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle>Crisis Resources</CardTitle>
                 <CardDescription>Manage crisis support numbers</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 {resources.map((r, idx) => (
                   <div key={idx} className="grid sm:grid-cols-2 gap-3 items-end bg-muted p-3 rounded-md">
                     <div className="space-y-2">
                       <Label>Name</Label>
                       <Input
                         value={r.name}
                         onChange={(e) => {
                           const next = [...resources]
                           next[idx] = { ...next[idx], name: e.target.value }
                           setResources(next)
                         }}
                       />
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
                 ))}
                 <div className="flex gap-3">
                   <Button variant="outline" onClick={() => setResources((p) => [...p, { name: "New Resource", number: "" }])}>
                     Add Resource
                   </Button>
                   <Button onClick={() => saveAll("Resources")} disabled={saving !== null}>
                     <Save className="w-4 h-4 mr-2" /> Save Resources
                   </Button>
                 </div>
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
