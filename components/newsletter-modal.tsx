"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAnalytics } from "@/hooks/use-analytics"

type NewsletterModalProps = {
  triggerLabel?: string
  tags?: string[]
}

export function NewsletterModal({ triggerLabel = "Get the guide", tags = ["newsletter"] }: NewsletterModalProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [form, setForm] = useState({ name: "", email: "" })
  const { track } = useAnalytics()

  useEffect(() => {
    if (open) {
      track("newsletter_modal_open")
    }
  }, [open, track])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.email) {
      toast({ title: "Please add your email", variant: "destructive" })
      return
    }
    setPending(true)
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tags }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Unable to subscribe right now.")
      }
      toast({ title: "Check your inbox", description: "Thanks for subscribing — your resource is on the way." })
      setForm({ name: "", email: "" })
      setOpen(false)
      track("newsletter_subscribed", { tags })
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : "Something went wrong."
      toast({ title: "Oops", description, variant: "destructive" })
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-[var(--accent)] px-6 py-3 text-white shadow-[0_15px_30px_rgba(32,56,91,0.15)] hover:opacity-90">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Download the 5-step Financial Safety Check-in</DialogTitle>
          <DialogDescription>
            Pop your details below and we’ll send the grounding checklist, plus gentle updates you can opt-out of anytime.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4 pt-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="newsletter-name" className="text-sm font-medium text-[var(--foreground)]">
              First name
            </label>
            <Input
              id="newsletter-name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Sasha"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="newsletter-email" className="text-sm font-medium text-[var(--foreground)]">
              Email
            </label>
            <Input
              id="newsletter-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="you@email.com"
              required
            />
          </div>
          <p className="text-xs text-[var(--primary)]/80">
            By subscribing you consent to receive updates from Dan Lobel. You can unsubscribe anytime. Read the{" "}
            <a href="/privacy" className="underline">
              privacy policy
            </a>{" "}
            for details.
          </p>
          <div className="flex gap-3">
            <Button type="submit" disabled={pending} className="flex-1">
              {pending ? "Sending..." : "Send it to me"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

