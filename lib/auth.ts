import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

const SESSION_COOKIE_NAME = "session"
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7

type SessionPayload = {
  sub: string
  email: string
  username: string
  exp: number
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error("Missing AUTH_SECRET environment variable")
  }
  return secret
}

function base64UrlEncode(input: string | Buffer) {
  return Buffer.from(input).toString("base64url")
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8")
}

function safeCompare(left: string, right: string, encoding?: BufferEncoding) {
  const leftBuffer = encoding ? Buffer.from(left, encoding) : Buffer.from(left)
  const rightBuffer = encoding ? Buffer.from(right, encoding) : Buffer.from(right)
  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }
  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, originalHash] = storedHash.split(":")
  if (!salt || !originalHash) {
    return false
  }
  const computedHash = scryptSync(password, salt, 64).toString("hex")
  return safeCompare(originalHash, computedHash, "hex")
}

export function createSessionToken(data: { sub: string; email: string; username: string }) {
  const payload: SessionPayload = {
    sub: data.sub,
    email: data.email,
    username: data.username,
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  }

  const payloadBase64 = base64UrlEncode(JSON.stringify(payload))
  const signature = createHmac("sha256", getAuthSecret()).update(payloadBase64).digest("base64url")
  return `${payloadBase64}.${signature}`
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [payloadBase64, signature] = token.split(".")
    if (!payloadBase64 || !signature) {
      return null
    }

    const expected = createHmac("sha256", getAuthSecret()).update(payloadBase64).digest("base64url")
    if (!safeCompare(signature, expected)) {
      return null
    }

    const payload = JSON.parse(base64UrlDecode(payloadBase64)) as SessionPayload
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

export { SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS }
