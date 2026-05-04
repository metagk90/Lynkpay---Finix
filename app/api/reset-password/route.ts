import { NextResponse } from "next/server"
import { z } from "zod"
import { createHmac } from "node:crypto"

import { hashPassword } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { sendEmail } from "@/lib/email"
import { passwordChangedEmail } from "@/lib/email-templates"

const DB = process.env.MONGODB_DB || "lynkpay"

const schema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      return NextResponse.json({ message: issue?.message ?? "Invalid request" }, { status: 400 })
    }

    const { token, password } = parsed.data
    const client = await clientPromise
    const db = client.db(DB)

    // Hash the incoming token the same way we hashed it when storing
    const secret = process.env.AUTH_SECRET || "fallback"
    const tokenHash = createHmac("sha256", secret).update(token).digest("hex")

    // Find the token record
    const resetRecord = await db.collection("password_reset_tokens").findOne({ tokenHash })

    if (!resetRecord) {
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 })
    }

    // Check expiry
    if (new Date() > new Date(resetRecord.expiresAt)) {
      await db.collection("password_reset_tokens").deleteOne({ _id: resetRecord._id })
      return NextResponse.json({ message: "Reset token has expired. Please request a new one." }, { status: 400 })
    }

    // Update the user's password
    const newHash = hashPassword(password)
    await db.collection("users").updateOne(
      { _id: resetRecord.userId },
      { $set: { passwordHash: newHash, updatedAt: new Date() } },
    )

    // Delete all reset tokens for this user
    await db.collection("password_reset_tokens").deleteMany({ userId: resetRecord.userId })

    // Send password changed security notification (fire-and-forget)
    const { subject, html } = passwordChangedEmail({
      firstName: (resetRecord as { email?: string }).email?.split("@")[0] || "there",
      changedAt: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
    })
    sendEmail({ to: resetRecord.email, subject, html }).catch(() => {})

    return NextResponse.json({ message: "Password has been reset successfully. You can now log in." })
  } catch {
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 })
  }
}
