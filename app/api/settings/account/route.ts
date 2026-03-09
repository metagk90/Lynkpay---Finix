import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { SESSION_COOKIE_NAME, verifySessionToken, verifyPassword } from "@/lib/auth"

const DB = process.env.MONGODB_DB || "lynkpay"

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const session = verifySessionToken(token)
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const password = typeof body?.password === "string" ? body.password : ""

    if (!password) {
      return NextResponse.json({ message: "Password is required to delete account" }, { status: 400 })
    }

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

    if (!verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ message: "Incorrect password" }, { status: 403 })
    }

    // Delete user and all related data
    await Promise.all([
      users.deleteOne({ _id: new ObjectId(session.sub) }),
      db.collection("dashboard_data").deleteOne({ userId: session.sub }),
      db.collection("lynk_pages").deleteOne({ userId: session.sub }),
    ])

    // Clear session cookie
    const response = NextResponse.json({ message: "Account deleted" })
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })
    return response
  } catch {
    return NextResponse.json({ message: "Failed to delete account" }, { status: 500 })
  }
}
