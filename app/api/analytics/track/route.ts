import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

const DB = process.env.MONGODB_DB || "lynkpay"

function detectDevice(ua: string | null): string {
  if (!ua) return "Desktop"
  const lower = ua.toLowerCase()
  if (/tablet|ipad|playbook|silk/.test(lower)) return "Tablet"
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/.test(lower)) return "Mobile"
  return "Desktop"
}

/**
 * POST /api/analytics/track
 * Public endpoint -- records page_view, link_click, and purchase events.
 * Body: { username, event, blockId?, blockTitle?, blockType?, referrer? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, event } = body

    if (!username || !event) {
      return NextResponse.json({ error: "username and event are required" }, { status: 400 })
    }

    if (!["page_view", "link_click", "purchase"].includes(event)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(DB)

    // Look up the userId for this username
    const user = await db.collection("users").findOne(
      { username: { $regex: new RegExp(`^${username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
      { projection: { _id: 1 } }
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userAgent = req.headers.get("user-agent") ?? null
    const device = detectDevice(userAgent)
    const now = new Date()
    const hour = now.getUTCHours().toString().padStart(2, "0")

    const doc = {
      userId: user._id.toString(),
      username: username.toLowerCase(),
      event,
      blockId: body.blockId ?? null,
      blockTitle: body.blockTitle ?? null,
      blockType: body.blockType ?? null,
      referrer: body.referrer ?? null,
      userAgent,
      device,
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      timestamp: now,
    }

    await db.collection("analytics_events").insertOne(doc)

    // Update daily aggregates
    const today = now.toISOString().slice(0, 10) // YYYY-MM-DD
    const incField = event === "page_view" ? "views" : event === "link_click" ? "clicks" : "purchases"

    await db.collection("analytics_daily").updateOne(
      { userId: user._id.toString(), date: today },
      {
        $inc: { [incField]: 1 },
        $setOnInsert: {
          userId: user._id.toString(),
          date: today,
          ...(incField !== "views" && { views: 0 }),
          ...(incField !== "clicks" && { clicks: 0 }),
          ...(incField !== "purchases" && { purchases: 0 }),
        },
      },
      { upsert: true }
    )

    // Update device aggregates
    await db.collection("analytics_devices").updateOne(
      { userId: user._id.toString(), device },
      { $inc: { count: 1 }, $setOnInsert: { userId: user._id.toString(), device } },
      { upsert: true }
    )

    // Update hourly aggregates
    await db.collection("analytics_hourly").updateOne(
      { userId: user._id.toString(), hour },
      { $inc: { visitors: 1 }, $setOnInsert: { userId: user._id.toString(), hour } },
      { upsert: true }
    )

    // If it's a link click or purchase, track per-block stats
    if ((event === "link_click" || event === "purchase") && body.blockId) {
      await db.collection("analytics_blocks").updateOne(
        { userId: user._id.toString(), blockId: body.blockId },
        {
          $inc: { clicks: 1, ...(event === "purchase" ? { purchases: 1 } : {}) },
          $set: { blockTitle: body.blockTitle || "", blockType: body.blockType || "" },
          $setOnInsert: { userId: user._id.toString(), blockId: body.blockId },
        },
        { upsert: true }
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}
