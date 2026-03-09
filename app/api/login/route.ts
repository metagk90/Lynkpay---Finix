import { NextResponse } from "next/server"
import { z } from "zod"

import { SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS, createSessionToken, verifyPassword } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      return NextResponse.json({ message: issue?.message ?? "Invalid request body" }, { status: 400 })
    }

    const input = parsed.data
    const client = await clientPromise
    const dbName = process.env.MONGODB_DB || "lynkpay"
    const users = client.db(dbName).collection("users")

    const user = await users.findOne(
      { email: input.email },
      { projection: { _id: 1, email: 1, username: 1, passwordHash: 1 } },
    )

    if (!user || typeof user.passwordHash !== "string") {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    const isPasswordValid = verifyPassword(input.password, user.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    const token = createSessionToken({
      sub: user._id.toString(),
      email: user.email as string,
      username: (user.username as string) || "",
    })

    const response = NextResponse.json({ message: "Login successful" }, { status: 200 })
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
    return NextResponse.json({ message: "Login failed" }, { status: 500 })
  }
}
