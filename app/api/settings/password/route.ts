import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { z } from "zod"
import clientPromise from "@/lib/mongodb"
import { SESSION_COOKIE_NAME, verifySessionToken, verifyPassword, hashPassword } from "@/lib/auth"
import { sendEmail } from "@/lib/email"
import { passwordChangedEmail } from "@/lib/email-templates"

const DB = process.env.MONGODB_DB || "lynkpay"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters").max(200),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const session = verifySessionToken(token)
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const parsed = passwordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 })
    }

    const input = parsed.data
    const client = await clientPromise
    const db = client.db(DB)
    const users = db.collection("users")

    const user = await users.findOne(
      { _id: new ObjectId(session.sub) },
      { projection: { passwordHash: 1 } },
    )

    if (!user || typeof user.passwordHash !== "string") {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (!verifyPassword(input.currentPassword, user.passwordHash)) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 403 })
    }

    const newHash = hashPassword(input.newPassword)
    await users.updateOne(
      { _id: new ObjectId(session.sub) },
      { $set: { passwordHash: newHash, updatedAt: new Date() } },
    )

    // Send password changed security notification (fire-and-forget)
    if (session.email) {
      const { subject, html } = passwordChangedEmail({
        firstName: session.username || "there",
        changedAt: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
      })
      sendEmail({ to: session.email, subject, html }).catch(() => {})
    }

    return NextResponse.json({ message: "Password updated successfully" })
  } catch {
    return NextResponse.json({ message: "Failed to change password" }, { status: 500 })
  }
}
