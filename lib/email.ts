/**
 * Shared email utilities.
 *
 * IMPORTANT: This module must remain server-safe (no `use client`),
 * because it's used by Server Components during SSR.
 */
export function normalizeEmailAddress(input: unknown): string {
  let value = String(input ?? "").trim()
  if (!value) return ""

  // Admin/content may include a full mailto URL or extra copy/punctuation.
  value = value.replace(/^mailto:\s*/i, "")

  // Drop query/hash if someone pastes `dan@x.com?subject=...` or `mailto:...#...`
  value = value.split(/[?#]/)[0]

  // Some users paste emails in angle brackets: `<dan@x.com>`
  if (value.startsWith("<") && value.endsWith(">") && value.length > 2) {
    value = value.slice(1, -1)
  }

  // If someone pastes "dan@x.com (preferred)" take the first token.
  value = value.split(/\s+/)[0]

  // Strip common trailing punctuation from copy/paste.
  value = value.replace(/[),.;:]+$/, "")

  return value.trim()
}

export function isLikelyEmailAddress(value: string): boolean {
  // Basic sanity check: we only want to emit a `mailto:` href for something that looks like an email.
  // This intentionally isn't perfect RFC validation.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}


