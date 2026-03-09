import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

const DB = process.env.MONGODB_DB || "lynkpay"

/** GET /api/profile/[username] -- public, no auth required */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    if (!username || username.length < 2) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(DB)

    // Find user by username (case-insensitive)
    const user = await db.collection("users").findOne(
      { username: { $regex: new RegExp(`^${username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
      { projection: { passwordHash: 0 } }
    )

    if (!user) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 })
    }

    // Get their dashboard data (blocks + appearance)
    const dashboardData = await db.collection("dashboard_data").findOne(
      { userId: user._id.toString() }
    )

    return NextResponse.json({
      profile: {
        username: user.username,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
        country: user.country || "",
        createdAt: user.createdAt,
      },
      blocks: dashboardData?.blocks ?? [],
      appearance: dashboardData?.appearance ?? null,
    })
  } catch (err) {
    console.error("GET /api/profile/[username] error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
