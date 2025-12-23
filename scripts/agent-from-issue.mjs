/* eslint-disable no-undef */
/* global fetch */

import { execSync } from "node:child_process"
import fs from "node:fs"

function env(name, fallback = undefined) {
  const v = process.env[name]
  if (!v) return fallback
  const t = String(v).trim()
  return t.length ? t : fallback
}

const OPENAI_API_KEY = env("OPENAI_API_KEY")
const MODEL = env("OPENAI_MODEL", "gpt-4.1-mini")
const ISSUE_NUMBER = env("ISSUE_NUMBER", "")
const ISSUE_TITLE = env("ISSUE_TITLE", "")
const ISSUE_BODY = env("ISSUE_BODY", "")

if (!OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY secret. Add it in GitHub repo Secrets.")
  process.exit(1)
}

function sh(cmd) {
  return execSync(cmd, { stdio: "pipe", encoding: "utf8" })
}

function readFileSafe(path) {
  try {
    return fs.readFileSync(path, "utf8")
  } catch {
    return ""
  }
}

// Provide a focused bundle of context to the model.
const contextFiles = [
  "lib/config.ts",
  "app/page.tsx",
  "app/admin/page.tsx",
  "app/api/site-config/route.ts",
  "app/api/site-config/assistant/route.ts",
  "components/navigation.tsx",
  "proxy.ts",
]

const fileContext = contextFiles
  .map((p) => `\n\n---\nFILE: ${p}\n---\n${readFileSafe(p).slice(0, 12000)}`)
  .join("")

const instruction = `
You are a coding agent operating in a Git repo.

Goal: apply the requested change from the issue.

Rules:
- Output MUST be a unified diff that can be applied with \`git apply\`.
- Only edit files that exist in the repo.
- Keep changes minimal and safe.
- Do NOT modify lockfiles unless needed.
- Do NOT add new dependencies unless explicitly required by the request.
- If unsure, choose the smallest change that plausibly satisfies the request.

Issue #${ISSUE_NUMBER}: ${ISSUE_TITLE}

Issue body:
${ISSUE_BODY}

Repo context (partial, truncated):
${fileContext}
`

async function openaiResponse(prompt) {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 2200,
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`OpenAI error ${res.status}: ${text.slice(0, 2000)}`)
  }
  const data = await res.json()
  // Try to extract text from Responses API
  const out =
    data?.output_text ??
    data?.output?.map((o) => o?.content?.map((c) => c?.text).join("")).join("\n") ??
    ""
  return String(out).trim()
}

const diff = await openaiResponse(instruction)
if (!diff.includes("---") && !diff.includes("diff --git")) {
  console.error("Model did not return a diff. Output was:\n", diff.slice(0, 4000))
  process.exit(2)
}

fs.writeFileSync("agent.patch", diff, "utf8")
console.log("Applying patch…")
sh("git apply --whitespace=nowarn agent.patch")

const changed = sh("git status --porcelain").trim()
if (!changed) {
  console.log("No changes after applying patch.")
  process.exit(0)
}

console.log("Patch applied. Changed files:\n" + changed)

// Ensure we don't leave patch artifacts around in the PR.
try {
  fs.unlinkSync("agent.patch")
} catch {
  // ignore
}



