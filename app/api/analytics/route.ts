import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

const DB = process.env.MONGODB_DB || "lynkpay"

/**
 * GET /api/analytics
 * Protected -- returns aggregated analytics for the logged-in user.
 * Query params: ?days=7 (default 30)
 */
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifySessionToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const userId = payload.sub
    const url = new URL(req.url)
    const days = Math.min(parseInt(url.searchParams.get("days") || "30", 10), 365)

    const client = await clientPromise
    const db = client.db(DB)

    // Get cutoff date
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    const cutoffStr = cutoff.toISOString().slice(0, 10)

    // Daily aggregates for charts
    const dailyStats = await db
      .collection("analytics_daily")
      .find({ userId, date: { $gte: cutoffStr } })
      .sort({ date: 1 })
      .toArray()

    // Total counts
    let totalViews = 0
    let totalClicks = 0
    let totalPurchases = 0
    for (const d of dailyStats) {
      totalViews += d.views || 0
      totalClicks += d.clicks || 0
      totalPurchases += d.purchases || 0
    }

    // Previous period for comparison
    const prevCutoff = new Date()
    prevCutoff.setDate(prevCutoff.getDate() - days * 2)
    const prevCutoffStr = prevCutoff.toISOString().slice(0, 10)

    const prevStats = await db
      .collection("analytics_daily")
      .find({ userId, date: { $gte: prevCutoffStr, $lt: cutoffStr } })
      .toArray()

    let prevViews = 0
    let prevClicks = 0
    let prevPurchases = 0
    for (const d of prevStats) {
      prevViews += d.views || 0
      prevClicks += d.clicks || 0
      prevPurchases += d.purchases || 0
    }

    function pctChange(current: number, previous: number): string {
      if (previous === 0) return current > 0 ? "+100%" : "0%"
      const pct = ((current - previous) / previous) * 100
      return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`
    }

    // Top blocks by clicks
    const topBlocks = await db
      .collection("analytics_blocks")
      .find({ userId })
      .sort({ clicks: -1 })
      .limit(10)
      .toArray()

    // Unique visitors (approximate from distinct IPs)
    const uniqueVisitors = await db
      .collection("analytics_events")
      .distinct("ip", {
        userId,
        event: "page_view",
        timestamp: { $gte: cutoff },
        ip: { $ne: null },
      })

    // Format daily data for charts
    const chartData = dailyStats.map((d) => ({
      date: d.date,
      views: d.views || 0,
      clicks: d.clicks || 0,
      purchases: d.purchases || 0,
    }))

    return NextResponse.json({
      totals: {
        views: totalViews,
        clicks: totalClicks,
        purchases: totalPurchases,
        uniqueVisitors: uniqueVisitors.length,
        clickRate: totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0",
      },
      changes: {
        views: pctChange(totalViews, prevViews),
        clicks: pctChange(totalClicks, prevClicks),
        purchases: pctChange(totalPurchases, prevPurchases),
      },
      chartData,
      topBlocks: topBlocks.map((b) => ({
        blockId: b.blockId,
        blockTitle: b.blockTitle,
        blockType: b.blockType,
        clicks: b.clicks,
      })),
      period: { days, from: cutoffStr, to: new Date().toISOString().slice(0, 10) },
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
