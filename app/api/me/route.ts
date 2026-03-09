import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth"

const DB = process.env.MONGODB_DB || "lynkpay"

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

    const client = await clientPromise
    const db = client.db(DB)

    // Fetch full user profile from DB (not just session data)
    const userDoc = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(session.sub) },
        { projection: { passwordHash: 0 } }
      )

    // Fetch persisted dashboard data
    const dashDoc = await db
      .collection("dashboard_data")
      .findOne({ userId: session.sub })

    return NextResponse.json({
      user: {
        id: session.sub,
        email: userDoc?.email ?? session.email,
        username: userDoc?.username ?? session.username,
        firstName: userDoc?.firstName ?? "",
        lastName: userDoc?.lastName ?? "",
        phone: userDoc?.phone ?? "",
        country: userDoc?.country ?? "",
        creatorCategory: userDoc?.creatorCategory ?? "",
        createdAt: userDoc?.createdAt ?? null,
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
