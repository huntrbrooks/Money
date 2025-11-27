// Simple HMAC-based token (JWT-like) using Web Crypto so it works in edge and node runtimes
export type AuthPayload = {
  username: string
  exp: number // seconds since epoch
}

const TEXT_ENCODER = new TextEncoder()

function toBase64Url(input: ArrayBuffer | Uint8Array | string): string {
  let bytes: Uint8Array
  if (typeof input === "string") {
    bytes = TEXT_ENCODER.encode(input)
  } else if (input instanceof ArrayBuffer) {
    bytes = new Uint8Array(input)
  } else {
    bytes = input
  }
  // Encode to base64 in both Edge (btoa) and Node (Buffer) runtimes
  let base64: string
  if (typeof btoa === "function") {
    let str = ""
    for (let i = 0; i < bytes.length; i++) {
      str += String.fromCharCode(bytes[i])
    }
    base64 = btoa(str)
  } else {
    // Node.js fallback
    base64 = Buffer.from(bytes).toString("base64")
  }
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function fromBase64Url(input: string): Uint8Array {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4))
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad
  // Decode from base64 in both Edge (atob) and Node (Buffer) runtimes
  if (typeof atob === "function") {
    const binary = atob(base64)
    const buffer = new ArrayBuffer(binary.length)
    const view = new Uint8Array(buffer)
    for (let i = 0; i < binary.length; i++) {
      view[i] = binary.charCodeAt(i)
    }
    return view
  } else {
    // Node.js fallback returns a Uint8Array backed by ArrayBuffer (not SharedArrayBuffer)
    const nodeBuf = Buffer.from(base64, "base64")
    const buffer = new ArrayBuffer(nodeBuf.length)
    const view = new Uint8Array(buffer)
    for (let i = 0; i < nodeBuf.length; i++) {
      view[i] = nodeBuf[i]
    }
    return view
  }
}

async function importKey(secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    TEXT_ENCODER.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

export async function createAuthToken(
  payload: AuthPayload,
  secret: string
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" }
  const headerB64 = toBase64Url(JSON.stringify(header))
  const payloadB64 = toBase64Url(JSON.stringify(payload))
  const toSign = `${headerB64}.${payloadB64}`
  const key = await importKey(secret)
  const signature = await crypto.subtle.sign("HMAC", key, TEXT_ENCODER.encode(toSign))
  const sigB64 = toBase64Url(signature)
  return `${toSign}.${sigB64}`
}

export async function verifyAuthToken(
  token: string,
  secret: string
): Promise<AuthPayload | null> {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const [headerB64, payloadB64, sigB64] = parts
    const toVerify = `${headerB64}.${payloadB64}`
    const key = await importKey(secret)
    // Ensure BufferSource types compatible across runtimes and TS libs
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      new Uint8Array(fromBase64Url(sigB64)),
      TEXT_ENCODER.encode(toVerify)
    )
    if (!ok) return null
    const payloadJson = new TextDecoder().decode(fromBase64Url(payloadB64))
    const payload = JSON.parse(payloadJson) as AuthPayload
    const nowSec = Math.floor(Date.now() / 1000)
    if (typeof payload.exp !== "number" || payload.exp < nowSec) return null
    return payload
  } catch {
    return null
  }
}

export function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name]
  if (value && value.length > 0) return value
  if (fallback !== undefined) return fallback
  throw new Error(`Missing required environment variable: ${name}`)
}

export const AUTH_COOKIE_NAME = "auth_token"


