export type CrmLead = {
  type: "newsletter" | "enquiry" | "intake"
  email: string
  name?: string
  phone?: string
  tags?: string[]
  payload?: Record<string, unknown>
}

export async function sendLeadToCrm(lead: CrmLead) {
  const webhook = process.env.CRM_WEBHOOK_URL
  if (!webhook) {
    console.log("[crm] CRM_WEBHOOK_URL missing. Lead payload:", lead)
    return { ok: true, dev: true }
  }
  const res = await fetch(webhook, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.CRM_WEBHOOK_TOKEN ? `Bearer ${process.env.CRM_WEBHOOK_TOKEN}` : undefined,
    },
    body: JSON.stringify(lead),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    return { ok: false as const, error: detail || res.statusText }
  }
  return { ok: true as const }
}












