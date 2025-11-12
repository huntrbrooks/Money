export const metadata = {
  title: "Terms of Service | The Melbourne Counsellor",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">Terms of Service</h1>
        <p className="text-[var(--primary)] leading-relaxed">
          Sessions are by appointment only. Cancellations with less than 24 hours’ notice may incur a fee. Therapy is a
          collaborative process and does not constitute financial or legal advice.
        </p>
        <p className="text-[var(--primary)] leading-relaxed">
          By booking, you agree to the above terms. For any questions, please contact
          <a href="mailto:dan@themelbournecounsellor.com.au" className="ml-1 underline">
            dan@themelbournecounsellor.com.au
          </a>
          .
        </p>
      </div>
    </div>
  )
}


