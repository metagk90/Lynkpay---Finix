import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createHmac } from "node:crypto"

import clientPromise from "@/lib/mongodb"

const DB = process.env.MONGODB_DB || "lynkpay"
const OTP_SECRET = process.env.JWT_SECRET || "lynkpay-otp-secret"

const schema = z.object({
  email: z.string().email(),
  otp: z.string().length(6).regex(/^\d+$/, "OTP must be 6 digits"),
})

function hashOtp(otp: string, email: string): string {
  return createHmac("sha256", OTP_SECRET).update(`${otp}:${email.toLowerCase()}`).digest("hex")
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const input = schema.safeParse(body)
    if (!input.success) {
      return NextResponse.json({ error: "Invalid verification code format" }, { status: 400 })
    }

    const { email, otp } = input.data
    const emailLower = email.toLowerCase()

    const mongo = await clientPromise
    const db = mongo.db(DB)
    const otpCollection = db.collection("otp_tokens")

    // Find the OTP record
    const record = await otpCollection.findOne({ email: emailLower })

    if (!record) {
      return NextResponse.json({ error: "No verification code found. Please request a new one." }, { status: 400 })
    }

    // Check if expired
    if (new Date() > record.expiresAt) {
      await otpCollection.deleteOne({ email: emailLower })
      return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 })
    }

    // Check max attempts
    if (record.attempts >= record.maxAttempts) {
      await otpCollection.deleteOne({ email: emailLower })
      return NextResponse.json({ error: "Too many incorrect attempts. Please request a new code." }, { status: 400 })
    }

    // Verify the OTP
    const hashedInput = hashOtp(otp, emailLower)
    if (hashedInput !== record.otpHash) {
      // Increment attempt counter
      await otpCollection.updateOne({ email: emailLower }, { $inc: { attempts: 1 } })
      const remaining = record.maxAttempts - record.attempts - 1
      return NextResponse.json(
        { error: `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.` },
        { status: 400 }
      )
    }

    // OTP verified successfully - mark as verified but don't delete yet
    // The signup process will check this and delete it after account creation
    await otpCollection.updateOne(
      { email: emailLower },
      { $set: { verified: true, verifiedAt: new Date() } }
    )

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
