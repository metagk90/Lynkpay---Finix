import { NextResponse } from "next/server"
import { z } from "zod"
import { randomBytes, createHmac } from "node:crypto"

import clientPromise from "@/lib/mongodb"

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

    // In production, send this via email. For now, return the token in the response.
    // The raw token is what the user receives; the hashed version is what we store.
    return NextResponse.json({
      message: "If that email exists, a reset link has been generated.",
      // Include the reset token so the UI can display the link
      // In production, remove this and send via email instead
      resetToken: rawToken,
    })
  } catch {
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 })
  }
}
