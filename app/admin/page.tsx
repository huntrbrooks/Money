 "use client"
 
import type React from "react"
 
 import { useEffect, useState } from "react"
 import { Button } from "@/components/ui/button"
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
 import { Input } from "@/components/ui/input"
 import { Label } from "@/components/ui/label"
 import { Textarea } from "@/components/ui/textarea"
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
 import { Upload, Save, Eye, LogOut, ImageIcon, FileText, DollarSign, Palette } from "lucide-react"
 import { useToast } from "@/hooks/use-toast"
 import { useRouter } from "next/navigation"
 
 export default function AdminPage() {
   const { toast } = useToast()
   const router = useRouter()
   const [loading, setLoading] = useState(true)
   const [saving, setSaving] = useState<null | string>(null)
 
   // Theme state
   const [theme, setTheme] = useState({
     mode: "light",
     primary: "#30A3B0",
     secondary: "#E8F4F5",
     accent: "#7CAE0A",
     background: "#FFFFFF",
     foreground: "#28436C",
     radius: "0.5rem",
   })
 
  // Content state
   const [heroContent, setHeroContent] = useState({
     title: "",
     subtitle: "",
     description: "",
     imageUrl: "",
   })
 
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
 
   useEffect(() => {
     async function load() {
       try {
         const res = await fetch("/api/site-config", { cache: "no-store" })
         const data = await res.json()
         setTheme(data.theme)
         setHeroContent(data.hero)
         setAboutContent(data.about)
         setServices(data.services)
        setBrand(data.brand ?? {})
        setSeo(data.seo ?? {})
        setNavigation(data.navigation ?? [])
        setContact(data.contact ?? {})
        setConsultations(data.consultations ?? [])
        setResources(data.resources ?? [])
       } catch {
         toast({ title: "Failed to load config", variant: "destructive" })
       } finally {
         setLoading(false)
       }
     }
     load()
   }, [toast])
 
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
         }),
       })
       if (!res.ok) throw new Error("Save failed")
       toast({ title: "Saved", description: section ? `${section} updated` : "All changes saved" })
     } catch (e: any) {
       toast({ title: "Save failed", description: e.message ?? "Unable to save", variant: "destructive" })
     } finally {
       setSaving(null)
     }
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
               <p className="text-sm opacity-80">The Melbourne Counsellor</p>
             </div>
             <div className="flex items-center gap-4">
               <Button
                 variant="ghost"
                 size="sm"
                 className="hover:bg-white/10"
                 onClick={() => window.open("/", "_blank")}
               >
                 <Eye className="w-4 h-4 mr-2" />
                 Preview Site
               </Button>
               <Button
                 variant="ghost"
                 size="sm"
                 className="hover:bg-white/10"
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
         <TabsList className="grid w-full grid-cols-12 gap-2 max-w-full">
             <TabsTrigger value="hero">Hero Section</TabsTrigger>
             <TabsTrigger value="about">About</TabsTrigger>
             <TabsTrigger value="services">Services</TabsTrigger>
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
                       value={(theme as any).fontSans ?? ""}
                       onChange={(e) => setTheme({ ...theme, fontSans: e.target.value } as any)}
                       placeholder="e.g. Geist, system-ui, sans-serif"
                     />
                   </div>
                   <div className="space-y-2 sm:col-span-2">
                     <Label>Serif Font Family</Label>
                     <Input
                       value={(theme as any).fontSerif ?? ""}
                       onChange={(e) => setTheme({ ...theme, fontSerif: e.target.value } as any)}
                       placeholder="e.g. Cormorant Garamond, Georgia, serif"
                     />
                   </div>
                   {[
                     ["Primary", "primary"],
                     ["Secondary", "secondary"],
                     ["Accent", "accent"],
                     ["Background", "background"],
                     ["Foreground", "foreground"],
                   ].map(([label, key]) => (
                     <div key={key} className="space-y-2">
                       <Label>{label}</Label>
                       <div className="flex items-center gap-3">
                         <input
                           type="color"
                           value={(theme as any)[key]}
                           onChange={(e) => setTheme({ ...theme, [key]: e.target.value } as any)}
                           className="h-10 w-14 rounded-md border border-border"
                         />
                         <Input
                           value={(theme as any)[key]}
                           onChange={(e) => setTheme({ ...theme, [key]: e.target.value } as any)}
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
