import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { randomInt, createHmac } from "node:crypto"

import clientPromise from "@/lib/mongodb"
import { sendEmail } from "@/lib/email"
import { otpVerificationEmail } from "@/lib/email-templates"

const DB = process.env.MONGODB_DB || "lynkpay"
const OTP_SECRET = process.env.JWT_SECRET || "lynkpay-otp-secret"
const OTP_EXPIRY_MINUTES = 10
const OTP_RESEND_COOLDOWN_SECONDS = 60

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).optional(),
})

function generateOtp(): string {
  // Generate a 6-digit numeric OTP
  return String(randomInt(100000, 999999))
}

function hashOtp(otp: string, email: string): string {
  return createHmac("sha256", OTP_SECRET).update(`${otp}:${email.toLowerCase()}`).digest("hex")
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const input = schema.safeParse(body)
    if (!input.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const { email, firstName } = input.data
    const emailLower = email.toLowerCase()

    const mongo = await clientPromise
    const db = mongo.db(DB)
    const otpCollection = db.collection("otp_tokens")

    // Check for rate limiting - prevent spam
    const recentOtp = await otpCollection.findOne({
      email: emailLower,
      createdAt: { $gte: new Date(Date.now() - OTP_RESEND_COOLDOWN_SECONDS * 1000) },
    })

    if (recentOtp) {
      const waitSeconds = Math.ceil(
        (OTP_RESEND_COOLDOWN_SECONDS * 1000 - (Date.now() - recentOtp.createdAt.getTime())) / 1000
      )
      return NextResponse.json(
        { error: `Please wait ${waitSeconds} seconds before requesting a new code` },
        { status: 429 }
      )
    }

    // Generate OTP and hash it for storage
    const otp = generateOtp()
    const hashedOtp = hashOtp(otp, emailLower)
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

    // Delete any existing OTPs for this email and insert new one
    await otpCollection.deleteMany({ email: emailLower })
    await otpCollection.insertOne({
      email: emailLower,
      otpHash: hashedOtp,
      attempts: 0,
      maxAttempts: 5,
      expiresAt,
      createdAt: new Date(),
    })

    // Create TTL index if it doesn't exist (auto-cleanup expired OTPs)
    await otpCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(() => {})

    // Send OTP email
    const { subject, html } = otpVerificationEmail({
      firstName: firstName || "there",
      otp,
      expiresIn: `${OTP_EXPIRY_MINUTES} minutes`,
    })

    await sendEmail({ to: email, subject, html })

    return NextResponse.json({
      message: "Verification code sent",
      expiresIn: OTP_EXPIRY_MINUTES * 60,
    })
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 })
  }
}
