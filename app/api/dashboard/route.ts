import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import clientPromise from "@/lib/mongodb"
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth"

const DB = process.env.MONGODB_DB || "LYNKPAYCO"

/** GET  – load blocks + appearance for the logged-in user */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const session = verifySessionToken(token)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const client = await clientPromise
    const db = client.db(DB)
    const doc = await db.collection("dashboard_data").findOne({ userId: session.sub })

    return NextResponse.json({
      blocks: doc?.blocks ?? null,
      appearance: doc?.appearance ?? null,
    })
  } catch (err) {
    console.error("GET /api/dashboard error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/** PUT  – save blocks + appearance for the logged-in user */
export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const session = verifySessionToken(token)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { blocks, appearance } = body

    const client = await clientPromise
    const db = client.db(DB)

    const update: Record<string, unknown> = { updatedAt: new Date() }
    if (blocks !== undefined) update.blocks = blocks
    if (appearance !== undefined) update.appearance = appearance

    await db.collection("dashboard_data").updateOne(
      { userId: session.sub },
      {
        $set: update,
        $setOnInsert: { userId: session.sub, createdAt: new Date() },
      },
      { upsert: true }
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("PUT /api/dashboard error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
