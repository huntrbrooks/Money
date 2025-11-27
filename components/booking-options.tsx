import { Button } from "@/components/ui/button"
import type { ConsultationOption } from "@/lib/config"
import {
  Building,
  CreditCard,
  Footprints,
  Home,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react"

const OWNER_BOOKING_URL = "https://app.acuityscheduling.com/schedule.php?owner=32223024"

const billingHighlights = [
  {
    title: "Transparent billing",
    detail: "Fees listed are inclusive of GST with no surprise surcharges.",
    icon: Sparkles,
  },
  {
    title: "Secure payment",
    detail: "Pre-payment is processed by Square with bank-level encryption.",
    icon: ShieldCheck,
  },
  {
    title: "Flexible rescheduling",
    detail: "Need to adjust your time? Reach out with 72 hours notice to rebook.",
    icon: RefreshCcw,
  },
]

const paymentSupport = [
  {
    title: "Cards & wallets",
    detail: "Visa, Mastercard, AMEX, Apple Pay and Google Pay are accepted.",
    icon: CreditCard,
  },
  {
    title: "Invoices available",
    detail: "Detailed receipts can be provided for reimbursement claims.",
    icon: Building,
  },
]

function buildBookingUrl(typeId?: number) {
  if (!typeId) return `${OWNER_BOOKING_URL}&ref=embedded_csp`
  return `${OWNER_BOOKING_URL}&appointmentType=${typeId}&ref=embedded_csp`
}

function getModeIcon(mode?: string) {
  const value = (mode ?? "").toLowerCase()
  if (value.includes("walk")) return Footprints
  if (value.includes("home")) return Home
  if (value.includes("room")) return Building
  if (value.includes("couple")) return Users
  return Video
}

type BookingOptionsProps = {
  options: ConsultationOption[]
}

export function BookingOptions({ options = [] }: BookingOptionsProps) {
  if (!options.length) {
    return null
  }

  return (
    <div className="space-y-10">
      <div className="rounded-[32px] border border-[var(--primary)]/10 bg-[color-mix(in_oklch,_var(--brand-pale-blue)_70%,_white)]/70 p-6 sm:p-10 shadow-lg">
        <div className="grid gap-6 lg:grid-cols-2">
          {options.map((option) => {
            const Icon = getModeIcon(option.mode)
            return (
              <article
                key={option.format}
                className="group h-full rounded-3xl border border-white/40 bg-white/85 p-6 shadow-sm ring-1 ring-[var(--primary)]/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {option.mode && (
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--primary)]/70">{option.mode}</p>
                    )}
                    <h3 className="font-serif text-2xl text-[var(--foreground)]">{option.format}</h3>
                  </div>
                  {option.highlight && (
                    <span className="rounded-full bg-[var(--accent)]/15 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                      {option.highlight}
                    </span>
                  )}
                </div>
                {option.description && (
                  <p className="mt-4 text-sm leading-relaxed text-[var(--primary)]/85">{option.description}</p>
                )}
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="font-serif text-4xl text-[var(--foreground)]">{option.price}</span>
                  <span className="text-sm text-[var(--primary)]/80">{option.duration}</span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-sm text-[var(--primary)]/90">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{option.location ?? "Flexible delivery"}</span>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="mt-6 w-full bg-[var(--accent)] text-[var(--foreground)] hover:opacity-90"
                >
                  <a href={buildBookingUrl(option.typeId)} target="_blank" rel="noopener noreferrer">
                    Book via Acuity
                  </a>
                </Button>
              </article>
            )
          })}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {billingHighlights.map(({ title, detail, icon: Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-[var(--primary)]/10 bg-white/80 p-5 shadow-sm backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[var(--accent)]/15 p-2 text-[var(--accent)]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <h4 className="text-base font-semibold text-[var(--foreground)]">{title}</h4>
              </div>
              <p className="mt-3 text-sm text-[var(--primary)]/85">{detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-dashed border-[var(--primary)]/30 bg-white/85 p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          {paymentSupport.map(({ title, detail, icon: Icon }) => (
            <div key={title} className="flex gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
                <Icon className="m-2 h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
                <p className="text-sm text-[var(--primary)]/85">{detail}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--primary)]/70">
          Billing enquiries: dan@themelbournecounsellor.com.au · 0467 477 786
        </p>
      </div>
    </div>
  )
}

