"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Video, Home, Building, Footprints, CheckCircle2, Mail, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Navigation, Footer } from "@/components/navigation"

export default function BookingsPage() {
  const { toast } = useToast()
  const [selectedFormat, setSelectedFormat] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  })

  const consultationFormats = [
    {
      id: "telehealth",
      title: "Telehealth Video",
      description: "Connect from anywhere via secure video",
      icon: Video,
      price: "$150",
    },
    {
      id: "home",
      title: "Your Home",
      description: "Therapy in your familiar environment",
      icon: Home,
      price: "$180",
    },
    {
      id: "office",
      title: "My Rooms",
      description: "Professional setting in Melbourne",
      icon: Building,
      price: "$150",
    },
    {
      id: "walk",
      title: "Walk & Discuss",
      description: "Therapeutic conversations while walking",
      icon: Footprints,
      price: "$160",
    },
  ]

  const availableTimes = ["9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM", "6:00 PM"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFormat || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a consultation format, date, and time.",
        variant: "destructive",
      })
      return
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would send to an API
    toast({
      title: "Booking Request Received",
      description: "Dan will contact you shortly to confirm your appointment and process prepayment.",
    })
  }

  return (
    <div className="min-h-screen bg-[#F5F3ED]">
      {/* Navigation Component */}
      <Navigation />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl text-[#28436C] mb-4">Book Your Appointment</h1>
            <p className="text-lg text-[#28436C]/70">Schedule a consultation with Dan Lobel</p>
          </div>

          {/* Prepayment Notice */}
          <Card className="mb-8 border-[#7CAE0A] bg-[#7CAE0A]/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#28436C]">
                <CheckCircle2 className="w-5 h-5 text-[#7CAE0A]" />
                Booking Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[#28436C]/80">
              <p className="flex items-start gap-2">
                <span className="font-medium">1.</span>
                <span>Select your preferred consultation format, date, and time below</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-medium">2.</span>
                <span>Submit your booking request with your contact details</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-medium">3.</span>
                <span>Dan will contact you to confirm availability and arrange prepayment</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-medium">4.</span>
                <span>Receive SMS and email reminders before your appointment</span>
              </p>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Consultation Format Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#28436C]">1. Choose Consultation Format</CardTitle>
                <CardDescription>Select how you'd like to meet with Dan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {consultationFormats.map((format) => {
                    const Icon = format.icon
                    return (
                      <button
                        key={format.id}
                        type="button"
                        onClick={() => setSelectedFormat(format.id)}
                        className={`p-6 rounded-lg border-2 text-left transition-all ${
                          selectedFormat === format.id
                            ? "border-[#7CAE0A] bg-[#7CAE0A]/5"
                            : "border-[#28436C]/20 hover:border-[#2A7477]"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <Icon
                            className={`w-6 h-6 mt-1 ${selectedFormat === format.id ? "text-[#7CAE0A]" : "text-[#28436C]"}`}
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-lg text-[#28436C] mb-1">{format.title}</h3>
                            <p className="text-sm text-[#28436C]/70 mb-2">{format.description}</p>
                            <p className="text-lg font-medium text-[#2A7477]">{format.price}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#28436C]">2. Select Date</CardTitle>
                <CardDescription>Choose your preferred appointment date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#28436C]" />
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="max-w-xs"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#28436C]">3. Select Time</CardTitle>
                <CardDescription>Choose your preferred appointment time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        selectedTime === time
                          ? "border-[#7CAE0A] bg-[#7CAE0A]/5 text-[#28436C]"
                          : "border-[#28436C]/20 hover:border-[#2A7477] text-[#28436C]"
                      }`}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-sm font-medium">{time}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#28436C]">4. Your Contact Information</CardTitle>
                <CardDescription>We'll use this to confirm your appointment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0400 000 000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any specific concerns or questions you'd like to discuss..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reminders Info */}
            <Card className="bg-[#30A3B0]/5 border-[#30A3B0]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#28436C]">
                  <Mail className="w-5 h-5 text-[#30A3B0]" />
                  Appointment Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-[#28436C]/80">
                <p className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#30A3B0]" />
                  <span>You'll receive an SMS reminder 24 hours before your appointment</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#30A3B0]" />
                  <span>An email confirmation will be sent after booking confirmation</span>
                </p>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button type="button" variant="outline" asChild>
                <Link href="/">Cancel</Link>
              </Button>
              <Button type="submit" size="lg" className="bg-[#7CAE0A] hover:bg-[#7CAE0A]/90 text-white">
                Submit Booking Request
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  )
}
