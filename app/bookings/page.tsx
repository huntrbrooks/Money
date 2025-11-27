import Script from "next/script"
import { Button } from "@/components/ui/button"
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

              <div className="rounded-[32px] border border-[var(--primary)]/15 bg-white/90 shadow-xl">
                <div className="flex flex-col gap-4 border-b border-[var(--primary)]/10 px-6 py-6 md:flex-row md:items-center md:justify-between">
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)]/70">Instant scheduling</p>
                    <h2 className="font-serif text-3xl text-[var(--foreground)]">Secure Acuity Portal</h2>
                    <p className="text-sm text-[var(--primary)]/80">Payments are processed via Square. Fees shown below match the cards above.</p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="border-[var(--primary)]/40 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
                  >
                    <a href="https://app.acuityscheduling.com/schedule.php?owner=32223024" target="_blank" rel="noopener noreferrer">
                      Open full scheduler
                    </a>
                  </Button>
                </div>
                <div className="relative rounded-[28px] border border-[var(--primary)]/10 bg-[color-mix(in_oklch,_var(--brand-pale-blue)_60%,_white)]/80 p-3">
                  <div className="rounded-[24px] bg-white shadow-inner">
                    <iframe
                      src="https://app.acuityscheduling.com/schedule.php?owner=32223024&ref=embedded_csp"
                      title="Schedule Appointment"
                      width="100%"
                      height="820"
                      frameBorder="0"
                      allow="payment"
                      className="rounded-[24px]"
                    />
                  </div>
                </div>
                <p className="px-6 pb-6 pt-3 text-center text-xs text-[var(--primary)]/70">
                  Prefer email or phone? Reach Dan on <a href="mailto:dan@themelbournecounsellor.com.au" className="underline">dan@themelbournecounsellor.com.au</a> or 0467 477 786.
                </p>
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
