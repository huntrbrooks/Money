"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, Upload, Save, Eye, LogOut, ImageIcon, FileText, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginData, setLoginData] = useState({ username: "", password: "" })

  // Content state
  const [heroContent, setHeroContent] = useState({
    title: "The Melbourne Counsellor",
    subtitle: "Dan Lobel",
    description:
      "A welcoming, empathic approach with profound respect for diversity. Skilfully navigating the complexities of human behaviour, emotions, and mental health.",
  })

  const [aboutContent, setAboutContent] = useState({
    title: "Contemporary Integrative Counselling",
    paragraphs: [
      "Dan's contemporary integrative counselling employs a comprehensive, evidence-based approach to therapy, integrating various elements and modalities to adapt to a constantly evolving environment.",
      "Dan has a person-centered, intuitive approach that places a great focus on candid communication accompanied by an acute empathy and profound awareness of people.",
    ],
  })

  const [services, setServices] = useState([
    { id: 1, name: "Grief Therapy", price: "$150" },
    { id: 2, name: "Trauma Therapy", price: "$150" },
    { id: 3, name: "Monetary Psychotherapy", price: "$150" },
    { id: 4, name: "Stress Management Therapy", price: "$150" },
    { id: 5, name: "Anxiety & Depression Counselling", price: "$150" },
  ])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would authenticate against a backend
    if (loginData.username === "admin" && loginData.password === "demo") {
      setIsAuthenticated(true)
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
      })
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      })
    }
  }

  const handleSave = (section: string) => {
    toast({
      title: "Changes Saved",
      description: `${section} has been updated successfully`,
    })
  }

  const handleImageUpload = (section: string) => {
    toast({
      title: "Image Upload",
      description: `Image for ${section} would be uploaded here`,
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F3ED] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-[#28436C] rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-[#28436C]">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#7CAE0A] hover:bg-[#7CAE0A]/90 text-white">
                Sign In
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">Demo credentials: admin / demo</p>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F3ED]">
      {/* Header */}
      <header className="bg-[#28436C] text-white py-4 sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-white/70">The Melbourne Counsellor</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => window.open("/", "_blank")}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Site
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => setIsAuthenticated(false)}
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
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          {/* Hero Section Tab */}
          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#28436C]">
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
                <Button onClick={() => handleSave("Hero Section")} className="bg-[#7CAE0A] hover:bg-[#7CAE0A]/90">
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
                <CardTitle className="flex items-center gap-2 text-[#28436C]">
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
                <Button onClick={() => handleSave("About Section")} className="bg-[#7CAE0A] hover:bg-[#7CAE0A]/90">
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
                <CardTitle className="flex items-center gap-2 text-[#28436C]">
                  <DollarSign className="w-5 h-5" />
                  Manage Services & Pricing
                </CardTitle>
                <CardDescription>Update your service offerings and consultation rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {services.map((service, index) => (
                  <div key={service.id} className="flex gap-4 items-end p-4 bg-[#F5F3ED] rounded-lg">
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
                <Button onClick={() => handleSave("Services")} className="bg-[#7CAE0A] hover:bg-[#7CAE0A]/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#28436C]">
                  <ImageIcon className="w-5 h-5" />
                  Manage Images
                </CardTitle>
                <CardDescription>Upload and manage photos for your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-[#28436C]/20 rounded-lg p-8 text-center hover:border-[#7CAE0A] transition-colors">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-[#28436C]/40" />
                    <h3 className="text-lg font-medium text-[#28436C] mb-2">Profile Photo</h3>
                    <p className="text-sm text-[#28436C]/60 mb-4">Current: Dan Lobel headshot</p>
                    <Button
                      onClick={() => handleImageUpload("Profile Photo")}
                      variant="outline"
                      className="border-[#7CAE0A] text-[#7CAE0A] hover:bg-[#7CAE0A]/10"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Photo
                    </Button>
                  </div>

                  <div className="border-2 border-dashed border-[#28436C]/20 rounded-lg p-8 text-center hover:border-[#7CAE0A] transition-colors">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-[#28436C]/40" />
                    <h3 className="text-lg font-medium text-[#28436C] mb-2">Background Images</h3>
                    <p className="text-sm text-[#28436C]/60 mb-4">Add decorative images for sections</p>
                    <Button
                      onClick={() => handleImageUpload("Background Images")}
                      variant="outline"
                      className="border-[#7CAE0A] text-[#7CAE0A] hover:bg-[#7CAE0A]/10"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Images
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
