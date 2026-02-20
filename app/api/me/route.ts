import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const session = verifySessionToken(token)

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: session.sub,
        email: session.email,
        username: session.username,
      },
    })
  } catch {
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
