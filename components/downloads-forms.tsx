import Link from "next/link"
import { Button } from "@/components/ui/button"

const DOWNLOAD_LINKS = [
  { label: "Enquiry Form", href: "/enquiry" },
  { label: "Intake Form", href: "/intake" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
]

export function DownloadsForms({ heading }: { heading?: string }) {
  return (
    <div id="downloads-forms" className="scroll-mt-10 rounded-[40px] border-2 border-[#78a3ab] bg-[var(--section-bg-1)]/85 p-5 sm:p-10 shadow-[0_30px_70px_rgba(45,69,78,0.12)] backdrop-blur">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <h3 className="font-serif text-3xl md:text-4xl text-[var(--foreground)] font-light">{heading?.trim() || "Downloads & Forms:"}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {DOWNLOAD_LINKS.map((link) => (
            <Button
              key={link.href}
              asChild
              className="w-full h-12 font-medium bg-[var(--section-bg-2)] text-[var(--foreground)] border-transparent hover:opacity-90 shadow-sm rounded-lg"
            >
              <Link href={link.href} className="no-underline">
                {link.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
