import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { z } from "zod"
import clientPromise from "@/lib/mongodb"
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
  createSessionToken,
  SESSION_DURATION_SECONDS,
} from "@/lib/auth"

const DB = process.env.MONGODB_DB || "lynkpay"

const profileSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .transform((v) => v.toLowerCase()),
  email: z.string().trim().email().transform((v) => v.toLowerCase()),
  phone: z.string().trim().max(30).optional().default(""),
  country: z.string().trim().max(80).optional().default(""),
})

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const session = verifySessionToken(token)
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const parsed = profileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 })
    }

    const input = parsed.data
    const client = await clientPromise
    const db = client.db(DB)
    const users = db.collection("users")

    // Check uniqueness if email or username changed
    if (input.email !== session.email) {
      const exists = await users.findOne({ email: input.email, _id: { $ne: new ObjectId(session.sub) } }, { projection: { _id: 1 } })
      if (exists) return NextResponse.json({ message: "Email already in use" }, { status: 409 })
    }

    if (input.username !== session.username) {
      const exists = await users.findOne({ username: input.username, _id: { $ne: new ObjectId(session.sub) } }, { projection: { _id: 1 } })
      if (exists) return NextResponse.json({ message: "Username already taken" }, { status: 409 })
    }

    await users.updateOne(
      { _id: new ObjectId(session.sub) },
      {
        $set: {
          firstName: input.firstName,
          lastName: input.lastName,
          username: input.username,
          email: input.email,
          phone: input.phone,
          country: input.country,
          updatedAt: new Date(),
        },
      },
    )

    // Re-issue session token with updated email/username
    const newToken = createSessionToken({
      sub: session.sub,
      email: input.email,
      username: input.username,
    })

    const response = NextResponse.json({ message: "Profile updated" })
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    })
    return response
  } catch {
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 })
  }
}
