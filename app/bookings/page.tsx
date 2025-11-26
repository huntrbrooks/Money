import Script from "next/script"
import { Navigation, Footer } from "@/components/navigation"

export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <main>
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="mb-10 text-center">
                <h1 className="font-serif text-5xl md:text-6xl text-[var(--foreground)] font-light">Schedule Appointment</h1>
                <p className="text-xl text-[var(--primary)]/80 mt-2">Secure your session time directly via Acuity Scheduling.</p>
              </div>
              <div className="rounded-lg overflow-hidden border border-[var(--secondary)] bg-white">
                <iframe
                  src="https://app.acuityscheduling.com/schedule.php?owner=32223024&ref=embedded_csp"
                  title="Schedule Appointment"
                  width="100%"
                  height="800"
                  frameBorder="0"
                  allow="payment"
                />
              </div>
              <Script src="https://embed.acuityscheduling.com/js/embed.js" strategy="afterInteractive" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
