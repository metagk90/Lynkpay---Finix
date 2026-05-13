import { NextRequest, NextResponse } from "next/server"
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

const DB = process.env.MONGODB_DB || "lynkpay"

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const session = verifySessionToken(token)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status") // "COMPLETED" | "PENDING" | "EXPIRED" | null for all
  const search = searchParams.get("search") || ""
  const searchField = searchParams.get("searchField") || "product"
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  try {
    const mongo = await clientPromise
    const db = mongo.db(DB)

    // Build the filter for orders belonging to this seller
    const filter: Record<string, unknown> = { sellerUsername: session.username }

    // Status filter -- map transfer states
    if (status && status !== "All Transaction") {
      const upperStatus = status.toUpperCase()
      if (upperStatus === "COMPLETED") {
        filter.state = { $in: ["SUCCEEDED", "COMPLETED"] }
      } else if (upperStatus === "PENDING") {
        filter.state = { $in: ["PENDING", "CREATED"] }
      } else if (upperStatus === "EXPIRED") {
        filter.state = { $in: ["FAILED", "CANCELED", "EXPIRED", "UNKNOWN"] }
      }
    }

    // Search filter
    if (search) {
      if (searchField === "Customer Email") {
        filter["customer.email"] = { $regex: search, $options: "i" }
      } else if (searchField === "Order ID") {
        filter.transactionId = { $regex: search, $options: "i" }
      } else {
        // Product Title (default)
        filter.productTitle = { $regex: search, $options: "i" }
      }
    }

    const total = await db.collection("orders").countDocuments(filter)

    // Aggregate total earnings from all completed orders for this seller
    const earningsAgg = await db.collection("orders").aggregate([
      { $match: { sellerUsername: session.username, state: { $in: ["SUCCEEDED", "COMPLETED"] } } },
      { $group: { _id: null, totalEarnings: { $sum: "$amount" } } },
    ]).toArray()
    const totalEarnings = earningsAgg.length > 0 ? earningsAgg[0].totalEarnings : 0

    const orders = await db
      .collection("orders")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Map to client format
    const mapped = orders.map((o) => {
      // Map Finix transfer state to display status
      let displayStatus: "COMPLETED" | "PENDING" | "EXPIRED" = "PENDING"
      if (o.state === "SUCCEEDED" || o.state === "COMPLETED") displayStatus = "COMPLETED"
      else if (o.state === "FAILED" || o.state === "CANCELED" || o.state === "EXPIRED" || o.state === "UNKNOWN") displayStatus = "EXPIRED"

      return {
        id: o.transactionId || o._id.toString(),
        date: new Date(o.createdAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: displayStatus,
        customer: o.customer?.email || "Unknown",
        customerName: `${o.customer?.firstName || ""} ${o.customer?.lastName || ""}`.trim(),
        product: o.productTitle || "Purchase",
        productType: o.productType || "digital",
        total: o.amount ? `$${(o.amount / 100).toFixed(2)}` : "$0.00",
        rawAmount: o.amount || 0,
        currency: o.currency || "USD",
        image: o.productImage || null,
      }
    })

    return NextResponse.json({
      orders: mapped,
      total,
      totalEarnings,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
