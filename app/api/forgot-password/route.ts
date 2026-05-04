import { NextResponse } from "next/server"
import { z } from "zod"
import { randomBytes, createHmac } from "node:crypto"

import clientPromise from "@/lib/mongodb"
import { sendEmail } from "@/lib/email"
import { passwordResetEmail } from "@/lib/email-templates"

const DB = process.env.MONGODB_DB || "lynkpay"
const TOKEN_EXPIRY_MINUTES = 30

const schema = z.object({
  email: z.string().trim().email().transform((v) => v.toLowerCase()),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      // Always return success to prevent email enumeration
      return NextResponse.json({ message: "If that email exists, a reset link has been generated." })
    }

    const { email } = parsed.data
    const client = await clientPromise
    const db = client.db(DB)

    const user = await db.collection("users").findOne(
      { email },
      { projection: { _id: 1, username: 1, email: 1 } },
    )

    if (!user) {
      // Don't reveal whether the email exists
      return NextResponse.json({ message: "If that email exists, a reset link has been generated." })
    }

    // Generate a secure token
    const rawToken = randomBytes(32).toString("hex")
    const secret = process.env.AUTH_SECRET || "fallback"
    const tokenHash = createHmac("sha256", secret).update(rawToken).digest("hex")

    // Store hashed token in DB (we only compare hashes, never store raw tokens)
    await db.collection("password_reset_tokens").deleteMany({ userId: user._id })
    await db.collection("password_reset_tokens").insertOne({
      userId: user._id,
      email: user.email,
      tokenHash,
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000),
      createdAt: new Date(),
    })

    // Send password reset email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lynkpay.co"
    const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`
    const { subject, html } = passwordResetEmail({
      firstName: (user as { username?: string }).username || "there",
      resetUrl,
      expiresIn: `${TOKEN_EXPIRY_MINUTES} minutes`,
    })
    await sendEmail({ to: email, subject, html })

    return NextResponse.json({
      message: "If that email exists, a reset link has been sent.",
    })
  } catch {
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 })
  }
}
