import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { BookingCopy, ConsultationOption } from "@/lib/config"
import {
  Building,
  CreditCard,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

const OWNER_BOOKING_URL = "https://app.acuityscheduling.com/schedule.php?owner=32223024"

const defaultBillingHighlights = [
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

const defaultPaymentSupport = [
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
  if (!typeId) return OWNER_BOOKING_URL
  return `${OWNER_BOOKING_URL}&appointmentType=${typeId}`
}

type BookingOptionsProps = {
  options: ConsultationOption[]
  bookingCopy?: BookingCopy
  contactEmail?: string
  contactPhone?: string
}

export function BookingOptions({ options = [], bookingCopy, contactEmail, contactPhone }: BookingOptionsProps) {
  if (!options.length) {
    return null
  }

  const email = contactEmail || "dan@financialabusetherapist.com.au"
  const phone = contactPhone || "0467 477 786"
  const billingHighlights = (bookingCopy?.billingHighlights ?? defaultBillingHighlights).map((item, idx) => ({
    ...item,
    icon: defaultBillingHighlights[idx]?.icon ?? Sparkles,
  }))
  const paymentSupport = (bookingCopy?.paymentSupport ?? defaultPaymentSupport).map((item, idx) => ({
    ...item,
    icon: defaultPaymentSupport[idx]?.icon ?? CreditCard,
  }))

  return (
    <div className="space-y-12">
      <div className="rounded-[40px] border border-[#d3dcd9] bg-[var(--section-bg-1)]/85 p-5 sm:p-8 lg:p-10 shadow-[0_30px_70px_rgba(45,69,78,0.12)] backdrop-blur">
        {/* Mobile: compact dropdowns (accordion) */}
        <div className="sm:hidden">
          <Accordion type="single" collapsible className="divide-y rounded-3xl border border-[#d4ddd8] bg-[var(--section-bg-2)]/60">
            {options.map((option) => {
              const value = `consultation-${option.typeId ?? option.format}`
              const location = option.location ?? ""
              return (
                <AccordionItem key={value} value={value} className="px-4">
                  <AccordionTrigger className="py-4 text-left">
                    <div className="flex w-full items-center justify-between gap-3 pr-2">
                      <div className="min-w-0">
                        {option.mode && option.mode !== "Flexible Delivery" && (
                          <p className="text-[11px] uppercase tracking-[0.25em] text-[#5a7264]">{option.mode}</p>
                        )}
                        <p className="font-serif text-lg text-[#1f2d38] leading-snug truncate">{option.format}</p>
                      </div>
                      <div className="flex items-baseline gap-2 shrink-0">
                        <span className="font-serif text-2xl text-[#1f2d38]">{option.price}</span>
                        <span className="text-xs text-[#4a5c63]">{option.duration}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-[#4a5c63]">
                    <div className="space-y-3">
                      {option.highlight && (
                        <span className="inline-flex rounded-full bg-[#7b8c45]/15 px-3 py-1 text-xs font-semibold text-[#556026]">
                          {option.highlight}
                        </span>
                      )}
                      {option.description && (
                        <p className="text-sm leading-relaxed text-[#4a5a61]">{option.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span aria-hidden="true" className="inline-block h-4 w-4" />
                        {location ? <span>{location}</span> : <span aria-hidden="true">&nbsp;</span>}
                      </div>
                      <Button
                        asChild
                        size="lg"
                        className="w-full rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
                      >
                        <a href={buildBookingUrl(option.typeId)} target="_blank" rel="noopener noreferrer">
                          Book this session
                        </a>
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>

        {/* Desktop: existing cards */}
        <div className="hidden gap-5 sm:grid sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {options.map((option) => {
            const location = option.location ?? ""
            return (
              <article
                key={option.format}
                className="group flex h-full flex-col rounded-[28px] border border-[#d4ddd8] bg-[var(--section-bg-2)] p-6 shadow-[0_25px_55px_rgba(42,63,70,0.12)] transition hover:-translate-y-1 hover:shadow-[0_35px_80px_rgba(42,63,70,0.16)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {option.mode && option.mode !== "Flexible Delivery" && (
                      <p className="text-xs uppercase tracking-[0.25em] text-[#5a7264]">{option.mode}</p>
                    )}
                    <h3 className="font-serif text-2xl text-[#1f2d38]">{option.format}</h3>
                  </div>
                  {option.highlight && (
                    <span className="rounded-full bg-[#7b8c45]/15 px-3 py-1 text-xs font-semibold text-[#556026]">
                      {option.highlight}
                    </span>
                  )}
                </div>
                {option.description && (
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-[#4a5a61]">{option.description}</p>
                )}
                <div className="mt-6 flex flex-wrap items-baseline gap-2">
                  <span className="font-serif text-4xl text-[#1f2d38]">{option.price}</span>
                  <span className="text-sm text-[#4a5c63]">{option.duration}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#4a5c63]">
                  <span aria-hidden="true" className="inline-block h-4 w-4" />
                  {location ? <span>{location}</span> : <span aria-hidden="true">&nbsp;</span>}
                </div>
                <Button
                  asChild
                  size="lg"
                  className="mt-6 w-full rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
                >
                  <a href={buildBookingUrl(option.typeId)} target="_blank" rel="noopener noreferrer">
                    Book this session
                  </a>
                </Button>
              </article>
            )
          })}
        </div>

        {/* Mobile: collapse billing highlights into one dropdown */}
        <div className="mt-8 sm:hidden">
          <Accordion type="single" collapsible className="rounded-3xl border border-[#dfe6d5] bg-[var(--section-bg-2)]/60">
            <AccordionItem value="billing-highlights" className="px-4">
              <AccordionTrigger className="py-4 text-left">
                <span className="font-serif text-lg text-[#1f2d38]">Billing &amp; payment details</span>
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <div className="space-y-4">
                  {billingHighlights.map(({ title, detail, icon: Icon }) => (
                    <div key={title} className="flex gap-3">
                      <div className="mt-0.5 rounded-2xl bg-[#7b8c45]/15 p-2 text-[#7b8c45]">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1f2d38]">{title}</p>
                        <p className="mt-1 text-sm text-[#4a5c63]">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Desktop: keep the highlight tiles */}
        <div className="mt-10 hidden gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3">
          {billingHighlights.map(({ title, detail, icon: Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#dfe6d5] bg-[var(--section-bg-2)]/90 p-5 shadow-sm backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#7b8c45]/15 p-2 text-[#7b8c45]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <h4 className="text-base font-semibold text-[#1f2d38]">{title}</h4>
              </div>
              <p className="mt-3 text-sm text-[#4a5c63]">{detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[32px] border border-dashed border-[#c8d4cf] bg-[#d7e9ec] p-5 sm:p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          {paymentSupport.map(({ title, detail, icon: Icon }) => (
            <div key={title} className="flex gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#7b8c45]/15 text-[#7b8c45]">
                <Icon className="m-2 h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1f2d38]">{title}</p>
                <p className="text-sm text-[#4a5c63]">{detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col items-center gap-1 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#4a5c63]">Billing enquiries</p>
          <a
            href={`mailto:${email}`}
            className="text-sm font-semibold text-[#1f2d38] break-all"
          >
            {email}
          </a>
          <a href={`tel:${phone.replace(/\s+/g, "")}`} className="text-sm text-[#4a5c63]">
            {phone}
          </a>
        </div>
      </div>
    </div>
  )
}

