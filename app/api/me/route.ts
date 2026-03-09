import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import clientPromise from "@/lib/mongodb"
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth"

const DB = process.env.MONGODB_DB || "LYNKPAYCO"

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

    // Fetch persisted dashboard data in the same call
    const client = await clientPromise
    const db = client.db(DB)
    const dashDoc = await db
      .collection("dashboard_data")
      .findOne({ userId: session.sub })

    return NextResponse.json({
      user: {
        id: session.sub,
        email: session.email,
        username: session.username,
      },
      dashboard: {
        blocks: dashDoc?.blocks ?? null,
        appearance: dashDoc?.appearance ?? null,
      },
    })
  } catch {
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
