import { Navigation, Footer } from "@/components/navigation"
import { BookingOptions } from "@/components/booking-options"
import { readSiteConfig } from "@/lib/config"

export default async function BookingsPage() {
  const config = await readSiteConfig()
  const consultationOptions = config.consultations ?? []

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-6 md:px-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-10">
              <div className="text-center">
                <h1 className="font-serif text-5xl md:text-6xl text-[var(--foreground)] font-light">Schedule Appointment</h1>
                <p className="text-xl text-[var(--primary)]/80 mt-3">Review fees, choose your preferred format, and book via Acuity.</p>
              </div>

              <BookingOptions options={consultationOptions} />

              <div className="rounded-[24px] border border-[var(--primary)]/10 bg-white/80 px-6 py-5 text-center text-sm text-[var(--primary)]/75">
                Prefer email or phone? Reach Dan on{" "}
                <a href="mailto:dan@themelbournecounsellor.com.au" className="underline">
                  dan@themelbournecounsellor.com.au
                </a>{" "}
                or 0467 477 786.
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
