import { NextResponse } from "next/server"
import { z } from "zod"

import { hashPassword, createSessionToken, SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS } from "@/lib/auth"
import { upsertLynkPageOnSignup } from "@/lib/lynk-data"
import clientPromise from "@/lib/mongodb"
import { sendEmail } from "@/lib/email"
import { welcomeEmail } from "@/lib/email-templates"

const signupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .transform((value) => value.toLowerCase()),
  email: z.string().trim().email("Invalid email address").transform((value) => value.toLowerCase()),
  phone: z.string().trim().max(30).optional().default(""),
  country: z.string().trim().max(80).optional().default(""),
  creatorCategory: z.string().trim().max(100).optional().default(""),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      return NextResponse.json({ message: issue?.message ?? "Invalid request body" }, { status: 400 })
    }

    const input = parsed.data
    const client = await clientPromise
    const dbName = process.env.MONGODB_DB || "lynkpay"
    const db = client.db(dbName)
    const users = db.collection("users")

    await users.createIndexes([
      { key: { email: 1 }, unique: true, name: "unique_email" },
      { key: { username: 1 }, unique: true, name: "unique_username" },
    ])

    const [emailExists, usernameExists] = await Promise.all([
      users.findOne({ email: input.email }, { projection: { _id: 1 } }),
      users.findOne({ username: input.username }, { projection: { _id: 1 } }),
    ])

    if (emailExists) {
      return NextResponse.json({ message: "Email already exists" }, { status: 409 })
    }

    if (usernameExists) {
      return NextResponse.json({ message: "Username already exists" }, { status: 409 })
    }

    // Verify that email has been verified via OTP
    const otpCollection = db.collection("otp_tokens")
    const otpRecord = await otpCollection.findOne({ email: input.email, verified: true })
    if (!otpRecord) {
      return NextResponse.json({ message: "Email not verified. Please complete OTP verification first." }, { status: 400 })
    }

    // Delete the OTP record now that signup is proceeding
    await otpCollection.deleteOne({ email: input.email })

    const now = new Date()
    const passwordHash = hashPassword(input.password)

    const result = await users.insertOne({
      firstName: input.firstName,
      lastName: input.lastName,
      username: input.username,
      usernameHistory: [],
      email: input.email,
      phone: input.phone,
      country: input.country,
      creatorCategory: input.creatorCategory,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    })
    try {
      await upsertLynkPageOnSignup(db, { _id: result.insertedId, username: input.username })
    } catch {
      // Keep signup successful even if secondary page bootstrap fails.
    }

    // Send welcome email (fire-and-forget, don't block signup)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lynkpay.co"
    const { subject, html } = welcomeEmail({
      firstName: input.firstName,
      username: input.username,
      loginUrl: `${baseUrl}/dashboard`,
    })
    sendEmail({ to: input.email, subject, html }).catch(() => {})

    // Auto-login: set session cookie so user goes straight to dashboard
    const token = createSessionToken({
      sub: result.insertedId.toString(),
      email: input.email,
      username: input.username,
    })

    const response = NextResponse.json(
      {
        message: "Account created successfully",
        userId: result.insertedId.toString(),
      },
      { status: 201 },
    )
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    })
    return response
  } catch {
    return NextResponse.json({ message: "Failed to create account" }, { status: 500 })
  }
}
