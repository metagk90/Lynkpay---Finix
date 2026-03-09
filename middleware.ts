import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SESSION_COOKIE_NAME = "session"

const PROTECTED_ROUTES = ["/dashboard"]
const AUTH_ROUTES = ["/login", "/signup"]

async function isTokenValid(token: string, secret: string): Promise<boolean> {
  try {
    const [payloadBase64, signature] = token.split(".")
    if (!payloadBase64 || !signature) return false

    // Use Web Crypto API (available in Edge runtime)
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    )
    const signatureBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadBase64))
    const expectedSignature = bufferToBase64Url(signatureBytes)

    if (expectedSignature !== signature) return false

    // Check expiry
    const payloadJson = atob(
      payloadBase64.replace(/-/g, "+").replace(/_/g, "/") +
        "==".slice(0, (4 - (payloadBase64.length % 4)) % 4),
    )
    const payload = JSON.parse(payloadJson) as { exp?: number }
    if (typeof payload.exp === "number" && payload.exp < Math.floor(Date.now() / 1000)) {
      return false
    }

    return true
  } catch {
    return false
  }
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const secret = process.env.AUTH_SECRET

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  if (isProtected) {
    if (!sessionToken || !secret) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    const valid = await isTokenValid(sessionToken, secret)
    if (!valid) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      const response = NextResponse.redirect(loginUrl)
      // Clear the invalid/expired cookie
      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: "",
        path: "/",
        maxAge: 0,
      })
      return response
    }
  }

  // If already logged in, redirect away from auth pages to dashboard
  if (isAuthRoute && sessionToken && secret) {
    const valid = await isTokenValid(sessionToken, secret)
    if (valid) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
}
