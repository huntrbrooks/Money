import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Phone, Mail, Calendar, ArrowRight } from "lucide-react"
import { Navigation, Footer } from "@/components/navigation"

export default function HomePage() {
  const coreServices = [
    {
      title: "Financial Trauma Therapy",
      description: "Specialized support for those affected by financial abuse, economic hardship, and monetary stress",
      featured: true,
    },
    {
      title: "Grief & Loss Counselling",
      description: "Compassionate guidance through bereavement and life transitions",
    },
    {
      title: "Trauma-Informed Therapy",
      description: "Evidence-based approaches to healing from traumatic experiences",
    },
    {
      title: "Anxiety & Depression Support",
      description: "Practical strategies for managing mental health challenges",
    },
    {
      title: "Relationship Counselling",
      description: "Navigate family dynamics and interpersonal connections",
    },
    {
      title: "LGBTQIA+ Affirming Therapy",
      description: "Safe, inclusive support for diverse identities and experiences",
    },
  ]

  const consultationOptions = [
    { format: "Telehealth Video", price: "$160", duration: "60 min" },
    { format: "In-Person (Office)", price: "$180", duration: "60 min" },
    { format: "Home Visit", price: "$170", duration: "60 min" },
    { format: "Walk & Discuss", price: "$180", duration: "60 min" },
    { format: "Extended Session", price: "$270", duration: "90 min" },
  ]

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />

      <section className="relative bg-gradient-to-br from-[#E8F8FA] to-[#F4FCFD]">
        <div className="container mx-auto px-4 py-24 md:py-36">
          <div className="grid gap-16 lg:grid-cols-2 items-center max-w-7xl mx-auto">
            {/* Left Column - Text */}
            <div className="space-y-10 lg:pr-12">
              <div className="space-y-6">
                <p className="text-[#2A7477] text-xs uppercase tracking-[0.2em] font-semibold">
                  Melbourne-Based Counsellor
                </p>
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#28436C] leading-[1.05] text-balance font-light">
                  The guided solo journey with practitioner
                </h1>
              </div>

              <div className="space-y-3 text-[#2A7477] text-lg leading-relaxed">
                <p className="text-2xl text-[#28436C] font-serif font-medium">Dan Lobel</p>
                <p className="text-[#2A7477]/80">D.Couns., B.Couns., MCouns&Psych</p>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#7CAE0A] hover:bg-[#7CAE0A]/90 text-white border-0 text-base h-14 px-10 font-medium shadow-lg"
                >
                  <Link href="/bookings">
                    Book Consultation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#30A3B0] text-[#30A3B0] hover:bg-[#30A3B0] hover:text-white bg-white text-base h-14 px-10 font-medium"
                >
                  <a href="#contact">Get in Touch</a>
                </Button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative lg:pl-8">
              <div className="relative aspect-[3/4] max-w-md mx-auto">
                <div className="absolute inset-0 bg-[#C0C944]/30 rounded-lg translate-x-6 translate-y-6" />
                <div className="relative bg-white p-3 rounded-lg shadow-2xl">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1469a-0Ivt3omzLN4pdHB0y2lffT6PoXhJwA.webp"
                    alt="Dan Lobel - The Melbourne Counsellor"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-accent-light py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <blockquote className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#2A7477] leading-[1.2] text-balance font-light italic">
              "Empathy is at the heart of therapy"
            </blockquote>
            <p className="text-xl text-[#2A7477]/70 leading-relaxed max-w-2xl mx-auto">
              The ability to listen, understand and share in another person's feelings forms the foundation of
              meaningful therapeutic work.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-36 bg-gradient-to-br from-[#30A3B0] to-[#2A7477]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-16 lg:grid-cols-5 items-start">
              {/* Left - Heading */}
              <div className="lg:col-span-2 space-y-8">
                <div className="inline-block px-5 py-2 bg-white/20 rounded-full border border-white/30">
                  <span className="text-xs font-bold text-white uppercase tracking-[0.15em]">Core Specialization</span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] font-light">
                  Financial Trauma & Monetary Psychotherapy
                </h2>
              </div>

              {/* Right - Content */}
              <div className="lg:col-span-3 space-y-6 text-lg leading-relaxed text-white/80">
                <p className="text-xl text-white font-medium">
                  Exploring psychological and emotional issues associated with financial abuse, economic hardship, and
                  monetary stress.
                </p>
                <p>
                  Financial trauma can manifest in many forms—from experiencing economic abuse in relationships to
                  navigating the psychological impact of debt, bankruptcy, or sudden financial loss. These experiences
                  often leave deep emotional scars that affect self-worth, relationships, and life decisions.
                </p>
                <p>
                  Dan brings specialized expertise in monetary psychotherapy, offering a safe space to process the
                  complex emotions surrounding money, financial control, and economic wellbeing. This work addresses not
                  just the practical aspects of financial stress, but the profound psychological impact it has on
                  identity, security, and hope for the future.
                </p>
                <div className="pt-6">
                  <Button
                    asChild
                    variant="outline"
                    className="border-2 border-[#30A3B0] text-[#30A3B0] hover:bg-[#30A3B0] hover:text-white bg-transparent h-12 px-8"
                  >
                    <Link href="/bookings">Schedule a Consultation</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-24 md:py-32 bg-muted scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-5">
              <h2 className="font-serif text-5xl md:text-6xl text-[#28436C] font-light">Areas of Practice</h2>
              <p className="text-xl text-[#2A7477]/70 max-w-2xl mx-auto leading-relaxed">
                Contemporary integrative counselling tailored to your unique needs
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {coreServices.map((service, index) => (
                <Card
                  key={index}
                  className={`p-8 border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${
                    service.featured
                      ? // Featured card uses soft olive/lime background
                        "bg-gradient-to-br from-[#C0C944] to-[#B5BE3E] text-[#28436C] border-[#C0C944]/50"
                      : "bg-white border-[#E8F4F5] hover:border-[#30A3B0]"
                  }`}
                >
                  <div className="space-y-4">
                    <h3
                      className={`text-xl font-serif font-medium ${
                        service.featured ? "text-[#28436C]" : "text-[#2A7477]"
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p className={`leading-relaxed ${service.featured ? "text-[#28436C]/80" : "text-[#2A7477]/70"}`}>
                      {service.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 md:py-32 bg-accent-light scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-16 lg:grid-cols-3">
              {/* Left - Heading */}
              <div className="lg:col-span-1">
                <h2 className="font-serif text-4xl md:text-5xl text-[#28436C] sticky top-24 font-light leading-tight">
                  Contemporary Integrative Approach
                </h2>
              </div>

              {/* Right - Content */}
              <div className="lg:col-span-2 space-y-6 text-lg leading-relaxed text-[#2A7477]/80">
                <p>
                  Dan's contemporary integrative counselling employs a comprehensive, evidence-based approach to
                  therapy, integrating various therapeutic modalities to adapt to each client's unique needs and
                  circumstances.
                </p>
                <p>
                  With a person-centered, intuitive approach, Dan places great focus on candid communication accompanied
                  by acute empathy and profound awareness of people. He promotes the importance of expressing feelings,
                  fostering personal growth, and addressing issues realistically, whilst always prioritising mental
                  health and wellbeing.
                </p>
                <p>
                  Drawing from lived experience and professional training, Dan offers valuable insights, resources, and
                  strategies to help you navigate obstacles associated with long-term emotional and psychological
                  wellbeing.
                </p>

                <div className="pt-8 space-y-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-[#2A7477]/60 font-bold">Core Values</p>
                  <div className="flex flex-wrap gap-3">
                    {["Empathy", "Trust", "Respect", "Authenticity", "Compassion", "Collaboration"].map((value) => (
                      <span
                        key={value}
                        className="px-5 py-2 bg-[#30A3B0]/10 text-[#2A7477] text-sm rounded-full border border-[#30A3B0]/20"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-gradient-to-br from-[#7CAE0A] to-[#6A9C08]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-5 text-white">
              <h2 className="font-serif text-5xl md:text-6xl font-light">Consultation Formats</h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Flexible options designed to meet you where you are
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {consultationOptions.map((option, index) => (
                <div
                  key={index}
                  className="bg-white/15 backdrop-blur-sm border-2 border-white/25 rounded-lg p-8 space-y-4 hover:bg-white/20 hover:border-white/40 transition-all"
                >
                  <h3 className="text-xl font-serif font-medium text-white">{option.format}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-serif text-white font-light">{option.price}</span>
                    <span className="text-white/80">/ {option.duration}</span>
                  </div>
                </div>
              ))}
              <div className="bg-[#28436C] rounded-lg p-8 space-y-3 md:col-span-2 lg:col-span-3 text-center border-2 border-[#28436C]">
                <p className="text-white/95 text-lg leading-relaxed">
                  All fees include GST. Prepayment required for telehealth and phone consultations.
                </p>
              </div>
            </div>

            <div className="text-center pt-8">
              <Button
                asChild
                size="lg"
                className="bg-white text-[#7CAE0A] hover:bg-white/95 h-14 px-10 text-base font-medium"
              >
                <Link href="/bookings">
                  Schedule Your Session
                  <Calendar className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 md:py-32 bg-muted scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-16 md:grid-cols-2">
              {/* Left - Heading */}
              <div className="space-y-8">
                <h2 className="font-serif text-5xl md:text-6xl text-[#28436C] font-light">Ready to begin?</h2>
                <p className="text-xl text-[#2A7477]/70 leading-relaxed">
                  Reach out to schedule your initial consultation or to learn more about how therapy can support your
                  journey.
                </p>
              </div>

              {/* Right - Contact Info */}
              <div className="space-y-6">
                <div className="space-y-5">
                  <a
                    href="tel:0467477786"
                    className="flex items-center gap-5 p-6 bg-white rounded-lg hover:shadow-lg transition-all group border border-transparent hover:border-[#30A3B0]"
                  >
                    <div className="w-14 h-14 bg-[#30A3B0] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#2A7477]/60 uppercase tracking-wider font-semibold">Phone</p>
                      <p className="text-xl text-[#28436C] font-medium">0467 477 786</p>
                    </div>
                  </a>

                  <a
                    href="mailto:dan@themelbournecounsellor.com.au"
                    className="flex items-center gap-5 p-6 bg-white rounded-lg hover:shadow-lg transition-all group border border-transparent hover:border-[#7CAE0A]"
                  >
                    <div className="w-14 h-14 bg-[#7CAE0A] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#2A7477]/60 uppercase tracking-wider font-semibold">Email</p>
                      <p className="text-lg text-[#28436C] font-medium break-all">dan@themelbournecounsellor.com.au</p>
                    </div>
                  </a>
                </div>

                <div className="pt-4">
                  <Button
                    asChild
                    className="w-full bg-[#7CAE0A] hover:bg-[#7CAE0A]/90 text-white h-14 font-medium text-base shadow-lg"
                  >
                    <Link href="/bookings">Book Appointment Online</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#2A7477] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <h3 className="text-3xl font-serif font-light">Crisis Support Resources</h3>
              <p className="text-lg text-white/85 leading-relaxed">
                If you or someone you know is in crisis and needs help now, call triple zero (000).
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Lifeline", number: "13 11 14" },
                { name: "Suicide Call Back Service", number: "1300 659 467" },
                { name: "Beyond Blue", number: "1300 22 4636" },
                { name: "MensLine Australia", number: "1300 78 99 78" },
                { name: "Kids Helpline", number: "1800 55 1800" },
                { name: "QLife", number: "1800 184 527" },
              ].map((resource) => (
                <div
                  key={resource.name}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-5 space-y-2 border border-white/20 hover:bg-white/15 transition-colors"
                >
                  <p className="font-medium text-white">{resource.name}</p>
                  <p className="text-white/90 text-lg">{resource.number}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
