import Script from "next/script"
import { Button } from "@/components/ui/button"
import { EmailLink } from "@/components/email-link"
import { normalizeEmailAddress } from "@/lib/email"
import type { BookingCopy } from "@/lib/config"

const SCHEDULER_URL = "https://app.acuityscheduling.com/schedule.php?owner=32223024"
const SCHEDULER_EMBED_URL = `${SCHEDULER_URL}&ref=embedded_csp`

type BookingSchedulerProps = {
  showEmbedToggle?: boolean
  bookingCopy?: BookingCopy
  email?: string
  phone?: string
}

export function BookingScheduler({
  showEmbedToggle = true,
  bookingCopy,
  email = "dan@financialtraumatherapist.com.au",
  phone = "0467 477 786",
}: BookingSchedulerProps) {
  const normalizedEmail = normalizeEmailAddress(email)
  const displayPhone = phone ? phone.replace(/\s+/g, "") : ""
  const schedulerPoints = bookingCopy?.schedulerPoints ?? [
    "Fees shown above already include GST and reflect the exact session length.",
    "Payments are captured through Square inside the secure Acuity portal.",
    "Need to reschedule? Reach out with 72 hours notice and we'll arrange a new time.",
  ]
  const helpText = bookingCopy?.schedulerHelpText ?? "Need help deciding on a format? Email or call — a personal reply is guaranteed."
  const eyebrow = bookingCopy?.schedulerEyebrow ?? "Secure checkout"
  const title = bookingCopy?.schedulerTitle ?? "Confirm your appointment in one place"
  const intro = bookingCopy?.schedulerIntro ?? "Choosing *Launch secure scheduler* opens Acuity in a new tab so you can pick an exact time, complete billing, and receive immediate confirmation."
  const buttonLabel = bookingCopy?.schedulerButtonLabel ?? "Launch secure scheduler"
  const emailButtonLabel = bookingCopy?.schedulerEmailButtonLabel ?? "Email Dan instead"
  const receiptNote = bookingCopy?.schedulerReceiptNote ?? "Receipts are issued automatically after payment, and you can reply to the confirmation email for any adjustments."
  const embedToggleLabel = bookingCopy?.schedulerEmbedToggleLabel ?? "Prefer to stay on this page? Use the embedded scheduler"
  const embedFallbackText = bookingCopy?.schedulerEmbedFallbackText ?? "If the scheduler does not load, please use the launch button above or email Dan for assistance."

  return (
    <div className="space-y-8 rounded-[40px] border border-[#78a3ab] bg-[var(--section-bg-1)]/85 p-5 sm:p-10 shadow-[0_30px_70px_rgba(45,69,78,0.12)] backdrop-blur">
      <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5 text-[#4a5c63]">
          <p className="text-xs uppercase tracking-[0.25em] text-[#5a7264]">{eyebrow}</p>
          <h3 className="font-serif text-3xl text-[#1f2d38]">{title}</h3>
          <p className="text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: intro.replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
          <ul className="space-y-3 text-sm">
            {schedulerPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#7b8c45]" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[28px] border border-[#c7d1cc] bg-[var(--section-bg-2)] p-5 sm:p-6 shadow-[inset_0_0_0_1px_rgba(229,238,210,0.85)]">
          <div className="flex h-full flex-col items-center gap-6 text-center text-[#33444b]">
            {helpText ? <p className="text-sm leading-relaxed">{helpText}</p> : null}
            <div className="space-y-1 text-base">
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <span className="font-semibold break-words">{normalizedEmail || String(email ?? "").trim()}</span>
              </p>
              <p className="text-sm uppercase tracking-[0.2em] text-[#5a7264]">or</p>
              {displayPhone ? (
                <p>
                  <span className="font-semibold">Call:</span> <span className="font-semibold">{displayPhone}</span>
                </p>
              ) : null}
            </div>
            <div className="flex w-full flex-col items-center gap-3">
              <Button
                asChild
                variant="outline"
                className="w-full max-w-sm rounded-full border-[#c8d4cf] bg-[var(--section-bg-1)] text-[#3f4f57] hover:bg-[var(--section-bg-1)]/90"
              >
                <EmailLink email={email} subject="Booking Inquiry">
                  {emailButtonLabel}
                </EmailLink>
              </Button>
              <Button
                asChild
                className="w-full max-w-sm rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90 focus-visible:ring-[var(--accent)]"
              >
                <a href={SCHEDULER_URL} target="_blank" rel="noopener noreferrer">
                  {buttonLabel}
                </a>
              </Button>
            </div>
            <p className="mt-auto text-xs text-[#4a5c63] text-center">
              {receiptNote}
            </p>
          </div>
        </div>
      </div>

      {showEmbedToggle && (
        <details className="group rounded-[32px] border border-dashed border-[#c8d4cf] bg-[var(--section-bg-2)]/90 p-5 sm:p-6">
          <summary className="flex cursor-pointer items-center gap-4 text-base font-semibold text-[#4a5c63] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7b8c45] focus-visible:ring-offset-2 list-none">
            <span className="flex-1 text-center font-semibold">{embedToggleLabel}</span>
            <span className="text-base text-[#7b8c45] transition-transform duration-200 group-open:rotate-45">+</span>
          </summary>
          <div className="mt-5 space-y-4">
            <div className="overflow-hidden rounded-[24px] border border-[#dfe6d5] bg-[var(--section-bg-1)] shadow-inner">
              <iframe
                src={SCHEDULER_EMBED_URL}
                title="Embedded Acuity scheduler"
                width="100%"
                height="820"
                frameBorder="0"
                allow="payment"
              />
            </div>
            <p className="text-xs text-[#4a5c63]">
              {embedFallbackText}
            </p>
          </div>
        </details>
      )}

      <Script src="https://embed.acuityscheduling.com/js/embed.js" strategy="lazyOnload" />
    </div>
  )
}

