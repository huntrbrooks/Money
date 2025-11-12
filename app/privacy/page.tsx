export const metadata = {
  title: "Privacy Policy | The Melbourne Counsellor",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] font-light">Privacy Policy</h1>
        <p className="text-[var(--primary)] leading-relaxed">
          Your privacy matters. This practice maintains strict confidentiality and securely stores client information in
          accordance with Australian privacy principles. Information is never shared without your consent, except where
          required by law or to prevent serious harm.
        </p>
        <p className="text-[var(--primary)] leading-relaxed">
          If you have any questions about how your information is collected, used, or stored, please contact
          <a href="mailto:dan@themelbournecounsellor.com.au" className="ml-1 underline">
            dan@themelbournecounsellor.com.au
          </a>
          .
        </p>
      </div>
    </div>
  )
}


