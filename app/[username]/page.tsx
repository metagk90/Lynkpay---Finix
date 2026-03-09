import { notFound } from "next/navigation"
import clientPromise from "@/lib/mongodb"
import { DEFAULT_APPEARANCE } from "@/lib/appearance-types"
import { PublicProfileRenderer } from "@/components/public-profile-renderer"

const DB = process.env.MONGODB_DB || "lynkpay"

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const client = await clientPromise
  const db = client.db(DB)

  const user = await db.collection("users").findOne(
    { username: { $regex: new RegExp(`^${username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
    { projection: { firstName: 1, lastName: 1, username: 1 } }
  )

  if (!user) {
    return { title: "Creator Not Found | LynkPay" }
  }

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username

  return {
    title: `${displayName} | LynkPay`,
    description: `Check out ${displayName}'s page on LynkPay. Browse products, links, and more.`,
    openGraph: {
      title: `${displayName} | LynkPay`,
      description: `Check out ${displayName}'s page on LynkPay.`,
    },
  }
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  // Skip known routes that could conflict with this catch-all
  const reserved = [
    "api", "dashboard", "login", "signup", "pricing", "service",
    "faq", "blogs", "terms", "privacy", "terms-of-use", "_next", "favicon.ico",
  ]
  if (reserved.includes(username.toLowerCase())) {
    notFound()
  }

  const client = await clientPromise
  const db = client.db(DB)

  const user = await db.collection("users").findOne(
    { username: { $regex: new RegExp(`^${username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
    { projection: { passwordHash: 0 } }
  )

  if (!user) {
    notFound()
  }

  const dashboardData = await db.collection("dashboard_data").findOne(
    { userId: user._id.toString() }
  )

  const profile = {
    username: user.username as string,
    firstName: (user.firstName as string) || "",
    lastName: (user.lastName as string) || "",
  }

  // Serialize blocks (strip MongoDB _id if present)
  const blocks = (dashboardData?.blocks ?? []).map((b: Record<string, unknown>) => ({
    ...b,
    _id: undefined,
  }))

  const appearance = dashboardData?.appearance
    ? { ...DEFAULT_APPEARANCE, ...dashboardData.appearance }
    : DEFAULT_APPEARANCE

  return (
    <PublicProfileRenderer
      profile={profile}
      blocks={blocks}
      appearance={appearance}
    />
  )
}
