import type { Metadata } from "next"
import { Navigation, Footer } from "@/components/navigation"
import { BookingOptions } from "@/components/booking-options"
import { BookingScheduler } from "@/components/booking-scheduler"
import { readSiteConfig } from "@/lib/config"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Book a Session | The Financial Therapist",
    description: "Choose your preferred consultation format and confirm a confidential session with Dan Lobel.",
    path: "/bookings",
    keywords: ["book counselling", "financial therapist appointment", "acuity scheduling"],
  })
}

export default async function BookingsPage() {
  const config = await readSiteConfig()
  const consultationOptions = config.consultations ?? []
  const bookingCopy = config.bookingCopy
  const contactEmail = config.contact?.email ?? ""
  const contactPhone = config.contact?.phone ?? ""

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>
        <section className="py-16 sm:py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-10">
              <div className="text-center">
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[var(--foreground)] font-light">Schedule Appointment</h1>
                <p className="text-lg sm:text-xl text-[var(--primary)]/80 mt-2">
                  Review pricing, choose your preferred format, and finalise payment via the secure Acuity portal.
                </p>
              </div>
              <BookingOptions
                options={consultationOptions}
                bookingCopy={bookingCopy}
                contactEmail={contactEmail || undefined}
                contactPhone={contactPhone || undefined}
              />
              <BookingScheduler
                schedulerPoints={bookingCopy?.schedulerPoints}
                helpText={bookingCopy?.schedulerHelpText}
                email={contactEmail || undefined}
                phone={contactPhone || undefined}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
